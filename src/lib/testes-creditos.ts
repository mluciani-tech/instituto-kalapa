import { supabaseAdmin } from "./supabase";
import type { BeneficiarioPedido } from "./types";

export interface ItemLiberacao {
  produto_id: string;
  slug?: string;
  nome?: string;
  quantidade: number;
  is_teste?: boolean;
  rota_teste?: string | null;
}

/**
 * Normaliza o slug do teste a partir de rotas ou slugs
 * ex: '/teste-yin-yang' -> 'teste-yin-yang', 'yin-yang' -> 'teste-yin-yang'
 */
export function normalizarSlugTeste(slugOuRota: string): string {
  const limpo = slugOuRota.trim().replace(/^\//, "").toLowerCase();
  if (limpo.startsWith("teste-")) return limpo;
  return `teste-${limpo}`;
}

/**
 * Verifica se o teste é gratuito (preço <= 0)
 */
export async function isTesteGratuito(slugOuRota: string): Promise<boolean> {
  if (!supabaseAdmin) return false;
  const slugNormalizado = normalizarSlugTeste(slugOuRota);
  const slugVariante = slugNormalizado.replace(/^teste-/, "");

  try {
    const { data } = await supabaseAdmin
      .from("produtos")
      .select("*")
      .or(`slug.eq.${slugNormalizado},slug.eq.${slugVariante},rota_teste.ilike.%${slugVariante}%`)
      .limit(1)
      .maybeSingle();

    if (data) {
      const preco = (data as any).preco_promocional ?? data.preco ?? 67;
      return preco <= 0;
    }
  } catch (err) {
    console.warn("[testes-creditos] Erro ao verificar se teste é gratuito:", err);
  }
  return false;
}

/**
 * Extrai o slug padronizado do teste priorizando rota e palavras-chave
 */
export function extrairSlugNormalizadoTeste(item: ItemLiberacao): string {
  if (item.rota_teste && item.rota_teste.trim() && item.rota_teste !== "/teste") {
    return normalizarSlugTeste(item.rota_teste);
  }
  if (item.slug && item.slug.trim() && item.slug !== "teste" && item.slug !== "testes") {
    return normalizarSlugTeste(item.slug);
  }
  const nomeLower = (item.nome || "").toLowerCase();
  if (nomeLower.includes("cronotipo") || nomeLower.includes("ritmo")) {
    return "teste-cronotipo";
  }
  if (nomeLower.includes("eneagrama")) {
    return "teste-eneagrama";
  }
  if (nomeLower.includes("yin") || nomeLower.includes("yang")) {
    return "teste-yin-yang";
  }
  return normalizarSlugTeste(item.slug || "teste");
}

/**
 * Libera os créditos de teste para o pedido aprovado/pago.
 * Distribui entre o comprador e os beneficiários informados (quando quantidade >= 2).
 */
export async function liberarCreditosPedido({
  pedidoId,
  usuarioId,
  clienteEmail,
  itens,
  beneficiarios,
}: {
  pedidoId: string;
  usuarioId?: string | null;
  clienteEmail: string;
  itens: ItemLiberacao[];
  beneficiarios?: BeneficiarioPedido[] | null;
}): Promise<{ creditosGerados: number }> {
  if (!supabaseAdmin) return { creditosGerados: 0 };

  // Filtrar apenas itens que são testes ou cuja categoria/slug indique teste
  const testItens: ItemLiberacao[] = [];
  for (const item of itens) {
    if (item.is_teste) {
      testItens.push(item);
    } else {
      // Checar no banco se o produto é teste
      try {
        const { data: prod } = await supabaseAdmin
          .from("produtos")
          .select("id, slug, is_teste, rota_teste, nome")
          .eq("id", item.produto_id)
          .maybeSingle();

        if (prod && (prod.is_teste || prod.slug?.startsWith("teste-") || prod.rota_teste?.startsWith("/teste-"))) {
          testItens.push({
            ...item,
            nome: prod.nome || item.nome,
            slug: prod.slug,
            is_teste: true,
            rota_teste: prod.rota_teste,
          });
        }
      } catch (err) {
        console.warn("[testes-creditos] Erro ao consultar produto:", err);
      }
    }
  }

  if (testItens.length === 0) return { creditosGerados: 0 };

  // Evitar duplicidade caso webhook seja chamado mais de uma vez (idempotência estrita)
  try {
    const { count } = await supabaseAdmin
      .from("testes_creditos")
      .select("*", { count: "exact", head: true })
      .eq("pedido_id", pedidoId);

    if (count && count > 0) {
      console.log(`[testes-creditos] Créditos já liberados anteriormente para o pedido ${pedidoId}`);
      return { creditosGerados: count };
    }
  } catch (errCheck) {
    console.warn("[testes-creditos] Verificação de idempotência:", errCheck);
  }

  let creditosGerados = 0;

  for (const item of testItens) {
    const slugTeste = extrairSlugNormalizadoTeste(item);
    const qtd = Math.max(1, Number(item.quantidade) || 1);

    // Filtrar beneficiários específicos deste produto
    const benefsDoItem = (beneficiarios || []).filter(
      (b) => b.produto_id === item.produto_id && b.email?.trim()
    );

    // 1 crédito sempre pertence ao comprador titular
    const rowsToInsert: {
      pedido_id: string;
      produto_id: string;
      usuario_id: string | null;
      email_beneficiario: string;
      slug_teste: string;
      status: string;
    }[] = [
      {
        pedido_id: pedidoId,
        produto_id: item.produto_id,
        usuario_id: usuarioId || null,
        email_beneficiario: clienteEmail.trim().toLowerCase(),
        slug_teste: slugTeste,
        status: "disponivel",
      },
    ];

    // Para as quantidades adicionais (> 1):
    // Se houver beneficiários adicionais, vincula ao e-mail deles
    for (let i = 1; i < qtd; i++) {
      const benef = benefsDoItem[i - 1];
      const emailDestino = benef?.email?.trim().toLowerCase() || clienteEmail.trim().toLowerCase();

      // Tenta localizar se o beneficiário já possui conta no sistema
      let benefUsuarioId: string | null = null;
      if (emailDestino !== clienteEmail.trim().toLowerCase()) {
        try {
          const { data: userBenef } = await supabaseAdmin
            .from("usuarios")
            .select("id")
            .eq("email", emailDestino)
            .maybeSingle();
          if (userBenef) benefUsuarioId = userBenef.id;
        } catch {
          // ignore
        }
      } else {
        benefUsuarioId = usuarioId || null;
      }

      rowsToInsert.push({
        pedido_id: pedidoId,
        produto_id: item.produto_id,
        usuario_id: benefUsuarioId,
        email_beneficiario: emailDestino,
        slug_teste: slugTeste,
        status: "disponivel",
      });
    }

    try {
      const { error: insertErr } = await supabaseAdmin
        .from("testes_creditos")
        .insert(rowsToInsert);

      if (insertErr) {
        console.error(`[testes-creditos] Erro ao inserir créditos do teste ${slugTeste}:`, insertErr);
      } else {
        creditosGerados += rowsToInsert.length;
      }
    } catch (err) {
      console.error("[testes-creditos] Falha na inserção de créditos:", err);
    }
  }

  return { creditosGerados };
}

/**
 * Verifica se um usuário ou e-mail possui créditos disponíveis para o teste especificado
 */
export async function verificarCreditoDisponivel(
  usuarioId: string | null | undefined,
  email: string | null | undefined,
  slugOuRota: string
): Promise<{ disponivel: boolean; creditosRestantes: number; creditoId?: string }> {
  if (!supabaseAdmin) return { disponivel: false, creditosRestantes: 0 };
  if (!usuarioId && !email) return { disponivel: false, creditosRestantes: 0 };

  const slugPrincipal = normalizarSlugTeste(slugOuRota);
  const slugVariante = slugPrincipal.replace(/^teste-/, "");

  try {
    // 1. Localiza o produto no banco para obter seu ID e slugs válidos
    const { data: prodDb } = await supabaseAdmin
      .from("produtos")
      .select("id, slug, rota_teste, nome")
      .or(`slug.eq.${slugPrincipal},slug.eq.${slugVariante},rota_teste.ilike.%${slugVariante}%`)
      .limit(1)
      .maybeSingle();

    const produtoId = prodDb?.id;
    const slugsValidos = Array.from(
      new Set(
        [
          slugPrincipal,
          slugVariante,
          prodDb?.slug ? normalizarSlugTeste(prodDb.slug) : null,
          prodDb?.rota_teste ? normalizarSlugTeste(prodDb.rota_teste) : null,
        ].filter(Boolean) as string[]
      )
    );

    // 2. Busca créditos disponíveis do usuário
    let query = supabaseAdmin
      .from("testes_creditos")
      .select("id, status, slug_teste, produto_id")
      .eq("status", "disponivel");

    if (usuarioId && email) {
      const emailNorm = email.trim().toLowerCase();
      query = query.or(`usuario_id.eq.${usuarioId},email_beneficiario.eq.${emailNorm}`);
    } else if (usuarioId) {
      query = query.eq("usuario_id", usuarioId);
    } else if (email) {
      query = query.eq("email_beneficiario", email.trim().toLowerCase());
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return { disponivel: false, creditosRestantes: 0 };
    }

    // Filtra os créditos do teste específico (por produto_id ou por slug do teste)
    const creditosFiltrados = data.filter((c) => {
      if (produtoId && c.produto_id === produtoId) return true;
      if (c.slug_teste && slugsValidos.includes(normalizarSlugTeste(c.slug_teste))) return true;
      if (c.slug_teste && slugsValidos.includes(c.slug_teste.replace(/^teste-/, ""))) return true;
      return false;
    });

    if (creditosFiltrados.length === 0) {
      return { disponivel: false, creditosRestantes: 0 };
    }

    return {
      disponivel: true,
      creditosRestantes: creditosFiltrados.length,
      creditoId: creditosFiltrados[0].id,
    };
  } catch (err) {
    console.error("[testes-creditos] Erro ao verificar crédito:", err);
    return { disponivel: false, creditosRestantes: 0 };
  }
}

/**
 * Consome 1 crédito disponível do usuário ao concluir a avaliação
 */
export async function consumirCreditoTeste(
  usuarioId: string | null | undefined,
  email: string | null | undefined,
  slugOuRota: string,
  avaliacaoId?: string | null
): Promise<{ sucesso: boolean; creditoConsumidoId?: string; error?: string }> {
  if (!supabaseAdmin) return { sucesso: false, error: "Banco não configurado" };

  const { disponivel, creditoId } = await verificarCreditoDisponivel(usuarioId, email, slugOuRota);
  if (!disponivel || !creditoId) {
    return { sucesso: false, error: "Nenhum crédito disponível para este teste." };
  }

  try {
    const { error: updateErr } = await supabaseAdmin
      .from("testes_creditos")
      .update({
        status: "utilizado",
        avaliacao_id: avaliacaoId || null,
        utilizado_em: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", creditoId);

    if (updateErr) {
      console.error("[testes-creditos] Erro ao consumir crédito:", updateErr);
      return { sucesso: false, error: "Erro ao dar baixa no crédito de teste." };
    }

    return { sucesso: true, creditoConsumidoId: creditoId };
  } catch (err) {
    console.error("[testes-creditos] Exceção ao consumir crédito:", err);
    return { sucesso: false, error: "Erro inesperado ao consumir crédito." };
  }
}

/**
 * Lista todos os créditos do usuário (disponíveis e utilizados)
 */
export async function listarCreditosUsuario(
  usuarioId: string | null | undefined,
  email: string | null | undefined
) {
  if (!supabaseAdmin) return [];
  if (!usuarioId && !email) return [];

  try {
    let query = supabaseAdmin
      .from("testes_creditos")
      .select("*, produtos(nome, slug, imagem_url, rota_teste, inclui_laudo_pdf)")
      .order("created_at", { ascending: false });

    if (usuarioId && email) {
      const emailNorm = email.trim().toLowerCase();
      query = query.or(`usuario_id.eq.${usuarioId},email_beneficiario.eq.${emailNorm}`);
    } else if (usuarioId) {
      query = query.eq("usuario_id", usuarioId);
    } else if (email) {
      query = query.eq("email_beneficiario", email.trim().toLowerCase());
    }

    const { data, error } = await query;
    if (error) {
      console.error("[testes-creditos] Erro ao listar créditos:", error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("[testes-creditos] Exceção ao listar créditos:", err);
    return [];
  }
}
