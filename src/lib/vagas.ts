// Helpers server-side para vagas (usar apenas em API routes)
import { supabaseAdmin, isAdminConfigured } from "./supabase";

export const VAGAS_PADRAO = 15;
export const TURMA_PADRAO = "2025-01";

export async function getTurmaAtual(): Promise<string> {
  if (!isAdminConfigured()) return TURMA_PADRAO;
  const { data } = await supabaseAdmin!
    .from("configuracoes")
    .select("valor")
    .eq("chave", "turma_atual")
    .single();
  return data?.valor || TURMA_PADRAO;
}

/**
 * Retorna o limite de vagas.
 * Se produtoId informado e o produto tem vagas_maximas, usa o do produto.
 * Senão, cai para o global (configuracoes.vagas_maximas) ou padrão.
 */
export async function getVagasMaximas(produtoId?: string | null): Promise<number> {
  if (!isAdminConfigured()) return VAGAS_PADRAO;

  if (produtoId) {
    const { data: produto } = await supabaseAdmin!
      .from("produtos")
      .select("vagas_maximas")
      .eq("id", produtoId)
      .single();

    if (produto?.vagas_maximas != null && produto.vagas_maximas > 0) {
      return produto.vagas_maximas;
    }
  }

  const { data: config } = await supabaseAdmin!
    .from("configuracoes")
    .select("valor")
    .eq("chave", "vagas_maximas")
    .single();

  return config ? Number(config.valor) : VAGAS_PADRAO;
}

/**
 * Conta inscrições PAGAS.
 * - Com produtoId: apenas inscrições pagas vinculadas a pedidos daquele produto.
 * - Sem produtoId: todas as inscrições pagas da turma atual.
 *
 * Inscrições "pendente" (checkout abandonado) NÃO contam —
 * a vaga só é ocupada após o webhook confirmar o pagamento.
 */
export async function countInscricoesPagas(produtoId?: string | null): Promise<number> {
  if (!isAdminConfigured()) return 0;

  const turmaAtual = await getTurmaAtual();

  if (produtoId) {
    try {
      // 1. Contar vagas via pedidos pagos/confirmados (considerando quantidades múltiplas)
      const { data: pedidos, error: pedError } = await supabaseAdmin!
        .from("pedidos")
        .select("id, status, produto_id, itens")
        .in("status", ["pago", "confirmado"]);

      let totalVagas = 0;
      const pedidosContados = new Set<string>();

      if (!pedError && Array.isArray(pedidos)) {
        for (const ped of pedidos) {
          let matched = false;
          let qtd = 0;

          if (ped.produto_id === produtoId) {
            matched = true;
          }

          if (Array.isArray(ped.itens)) {
            for (const it of ped.itens as Array<{ produto_id?: string; quantidade?: number }>) {
              if (it && it.produto_id === produtoId) {
                matched = true;
                qtd += Number(it.quantidade) || 1;
              }
            }
          }

          if (matched) {
            pedidosContados.add(ped.id);
            totalVagas += qtd > 0 ? qtd : 1;
          }
        }
      }

      // 2. Contar inscrições pagas avulsas (que não possuem pedido_id já computado)
      const { data: inscricoes, error: inscError } = await supabaseAdmin!
        .from("inscricoes")
        .select("id, pedido_id, status, pedidos(produto_id)")
        .in("status", ["pago", "confirmado"]);

      if (!inscError && Array.isArray(inscricoes)) {
        for (const insc of inscricoes as Array<{ id: string; pedido_id?: string | null; pedidos?: { produto_id?: string } | { produto_id?: string }[] | null }>) {
          if (insc.pedido_id && pedidosContados.has(insc.pedido_id)) {
            continue;
          }
          const pedObj = Array.isArray(insc.pedidos) ? insc.pedidos[0] : insc.pedidos;
          if (pedObj?.produto_id === produtoId) {
            totalVagas += 1;
          }
        }
      }

      return Math.max(totalVagas, 0);
    } catch (err) {
      console.error("[vagas] Erro ao contar vagas por produto:", err);
      return 0;
    }
  }

  const { count, error } = await supabaseAdmin!
    .from("inscricoes")
    .select("*", { count: "exact", head: true })
    .eq("turma_id", turmaAtual)
    .in("status", ["pago", "confirmado"]);

  if (error) {
    console.error("[vagas] Erro ao contar:", error);
    return 0;
  }
  return count || 0;
}

export interface VagasCalculadas {
  preenchidas: number;
  maximas: number;
  restantes: number;
  turma: string;
  manual: boolean;
  reais: number;
}

/**
 * Retorna as informações consolidadas de vagas para um produto.
 * Se o produto tiver `vagas_ocupadas_manual` definido pelo Admin,
 * utiliza esse valor para exibição e validações. Caso contrário,
 * utiliza a contagem real de inscrições pagas no banco de dados.
 */
export async function getVagasInfo(produtoId?: string | null): Promise<VagasCalculadas> {
  const turmaAtual = await getTurmaAtual();
  if (!isAdminConfigured()) {
    return {
      preenchidas: 0,
      maximas: VAGAS_PADRAO,
      restantes: VAGAS_PADRAO,
      turma: turmaAtual,
      manual: false,
      reais: 0,
    };
  }

  try {
    let maximas = VAGAS_PADRAO;
    let manualOcupadas: number | null = null;

    if (produtoId) {
      const { data: produto, error } = await supabaseAdmin!
        .from("produtos")
        .select("vagas_maximas, vagas_ocupadas_manual")
        .eq("id", produtoId)
        .single();

      if (!error && produto) {
        if (produto.vagas_maximas != null && produto.vagas_maximas > 0) {
          maximas = produto.vagas_maximas;
        } else {
          const { data: config } = await supabaseAdmin!
            .from("configuracoes")
            .select("valor")
            .eq("chave", "vagas_maximas")
            .single();
          if (config?.valor) maximas = Number(config.valor);
        }

        if (produto.vagas_ocupadas_manual != null && produto.vagas_ocupadas_manual >= 0) {
          manualOcupadas = produto.vagas_ocupadas_manual;
        }
      }
    } else {
      const { data: config } = await supabaseAdmin!
        .from("configuracoes")
        .select("valor")
        .eq("chave", "vagas_maximas")
        .single();
      if (config?.valor) maximas = Number(config.valor);
    }

    const reais = await countInscricoesPagas(produtoId);
    const isManual = manualOcupadas !== null;
    const preenchidas = manualOcupadas !== null ? manualOcupadas : reais;
    const restantes = Math.max(maximas - preenchidas, 0);

    return {
      preenchidas,
      maximas,
      restantes,
      turma: turmaAtual,
      manual: isManual,
      reais,
    };
  } catch (err) {
    console.error("[vagas] Erro em getVagasInfo:", err);
    return {
      preenchidas: 0,
      maximas: VAGAS_PADRAO,
      restantes: VAGAS_PADRAO,
      turma: turmaAtual,
      manual: false,
      reais: 0,
    };
  }
}
