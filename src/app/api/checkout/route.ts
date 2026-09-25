import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";
import { getTurmaAtual, getVagasInfo } from "@/lib/vagas";
import { getClienteFromRequest } from "@/lib/cliente-auth";
import type { PedidoItem, EnderecoEntrega } from "@/lib/types";

export const dynamic = "force-dynamic";

const INFINITEPAY_API = "https://api.checkout.infinitepay.io/links";
const INFINITEPAY_HANDLE = process.env.INFINITEPAY_HANDLE || "kalapa";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://instituto-kalapa.vercel.app";
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "";

function formatPhoneE164(phone: string): string {
  const numbers = (phone || "").replace(/\D/g, "");
  if (!numbers) return "";
  if (numbers.startsWith("55")) return `+${numbers}`;
  return `+55${numbers}`;
}

export async function POST(req: NextRequest) {
  try {
    if (!isAdminConfigured()) {
      return NextResponse.json(
        { error: "Supabase não configurado" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { produto_id, itens: cartItens, inscricao, cupom_codigo, beneficiarios, pedido_origem_id } = body;

    // 0. Exigir autenticação obrigatória (Opção 1 — Somente usuários cadastrados concluem compra)
    const clienteLogado = await getClienteFromRequest(req);
    if (!clienteLogado) {
      return NextResponse.json(
        { error: "É necessário entrar na sua conta ou cadastrar-se para concluir a compra." },
        { status: 401 }
      );
    }

    // 1. Determinar lista de itens do pedido
    const itensProcessados: {
      produto_id: string;
      nome: string;
      quantidade: number;
      precoUnitario: number;
      vagasMaximas: number | null;
      imagem_url?: string | null;
    }[] = [];

    if (Array.isArray(cartItens) && cartItens.length > 0) {
      // Modo Carrinho (multi-produtos)
      for (const item of cartItens) {
        const { data: prod } = await supabaseAdmin!
          .from("produtos")
          .select("id, nome, preco, vagas_maximas, ativo, imagem_url")
          .eq("id", item.produto_id)
          .eq("ativo", true)
          .single();

        if (prod) {
          itensProcessados.push({
            produto_id: prod.id,
            nome: prod.nome,
            quantidade: Number(item.quantidade) || 1,
            precoUnitario: Number(prod.preco) || 0,
            vagasMaximas: prod.vagas_maximas,
            imagem_url: prod.imagem_url,
          });
        }
      }
    } else if (produto_id) {
      // Modo Produto Único / Legado
      const { data: prod, error: produtoError } = await supabaseAdmin!
        .from("produtos")
        .select("id, nome, preco, vagas_maximas, ativo, imagem_url")
        .eq("id", produto_id)
        .eq("ativo", true)
        .single();

      if (produtoError || !prod) {
        return NextResponse.json(
          { error: "Produto não encontrado" },
          { status: 404 }
        );
      }

      itensProcessados.push({
        produto_id: prod.id,
        nome: prod.nome,
        quantidade: 1,
        precoUnitario: Number(prod.preco) || 0,
        vagasMaximas: prod.vagas_maximas,
        imagem_url: prod.imagem_url,
      });
    }

    if (itensProcessados.length === 0) {
      return NextResponse.json(
        { error: "Nenhum produto válido selecionado" },
        { status: 400 }
      );
    }

    // 2. Verificar vagas de vivências no servidor (fecha race condition)
    for (const item of itensProcessados) {
      if (item.vagasMaximas != null) {
        const vagasInfo = await getVagasInfo(item.produto_id);

        if (vagasInfo.restantes <= 0) {
          return NextResponse.json(
            { error: `Vagas esgotadas para "${item.nome}".` },
            { status: 409 }
          );
        }
      }
    }

    // 3. Calcular subtotal original
    const subtotal = itensProcessados.reduce(
      (sum, item) => sum + item.precoUnitario * item.quantidade,
      0
    );

    // 4. Validar Cupom de Desconto (OPCIONAL)
    let cupomId: string | null = null;
    let cupomCodigoFinal: string | null = null;
    let valorDesconto = 0;

    if (cupom_codigo && typeof cupom_codigo === "string" && cupom_codigo.trim()) {
      const codigoNorm = cupom_codigo.trim().toUpperCase();
      const { data: cupom } = await supabaseAdmin!
        .from("cupons")
        .select("id, codigo, tipo, valor, quantidade_maxima, quantidade_utilizada, valor_minimo_pedido, validade, ativo")
        .eq("codigo", codigoNorm)
        .eq("ativo", true)
        .single();

      if (cupom) {
        const expirado = cupom.validade && new Date(cupom.validade) < new Date();
        const esgotado = cupom.quantidade_maxima != null && (cupom.quantidade_utilizada || 0) >= cupom.quantidade_maxima;
        const minimoNaoAtingido = cupom.valor_minimo_pedido && subtotal < Number(cupom.valor_minimo_pedido);

        if (!expirado && !esgotado && !minimoNaoAtingido) {
          cupomId = cupom.id;
          cupomCodigoFinal = cupom.codigo;
          if (cupom.tipo === "porcentagem") {
            valorDesconto = (subtotal * Number(cupom.valor)) / 100;
          } else {
            valorDesconto = Number(cupom.valor);
          }
          valorDesconto = Math.min(valorDesconto, subtotal);
        }
      }
    }

    const valorFinal = Math.max(0, subtotal - valorDesconto);
    const ehGratuito = valorFinal === 0;

    // 5. Consolidar dados do cliente a partir do usuário autenticado (garante integridade total)
    const clienteNome = clienteLogado.nome.trim();
    const clienteEmail = clienteLogado.email.trim().toLowerCase();
    const clienteTelefone = clienteLogado.telefone?.trim() || null;
    const clienteCpf = clienteLogado.cpf?.replace(/\D/g, "") || null;

    const enderecoEntrega: EnderecoEntrega = {
      cep: clienteLogado.cep,
      rua: clienteLogado.rua,
      numero: clienteLogado.numero,
      complemento: clienteLogado.complemento || null,
      bairro: clienteLogado.bairro,
      cidade: clienteLogado.cidade,
      uf: clienteLogado.uf,
    };

    const orderNsu = `kalapa-${crypto.randomUUID()}`;
    const turmaAtual = await getTurmaAtual();

    const pedidoItensData: PedidoItem[] = itensProcessados.map((item) => ({
      produto_id: item.produto_id,
      nome: item.nome,
      quantidade: item.quantidade,
      preco: item.precoUnitario,
      imagem_url: item.imagem_url || null,
    }));

    // 6. Criar pedido no banco com usuario_id garantido
    const { data: pedido, error: pedidoError } = await supabaseAdmin!
      .from("pedidos")
      .insert({
        order_nsu: orderNsu,
        produto_id: itensProcessados[0]?.produto_id || null,
        usuario_id: clienteLogado.id,
        cliente_nome: clienteNome,
        cliente_email: clienteEmail,
        cliente_telefone: clienteTelefone,
        cliente_cpf: clienteCpf,
        endereco_entrega: enderecoEntrega,
        itens: pedidoItensData,
        beneficiarios: Array.isArray(beneficiarios) ? beneficiarios : [],
        valor: valorFinal,
        valor_desconto: valorDesconto > 0 ? valorDesconto : 0,
        cupom_id: cupomId,
        cupom_codigo: cupomCodigoFinal,
        status: ehGratuito ? "confirmado" : "pendente",
        metodo_pagamento: ehGratuito ? "cupom_gratuito" : null,
      })
      .select("id")
      .single();

    if (pedidoError) {
      console.error("[checkout] Erro ao criar pedido:", pedidoError);
      return NextResponse.json(
        { error: "Erro ao registrar pedido" },
        { status: 500 }
      );
    }

    // Se for retomada de um pedido pendente anterior, cancelar o anterior para evitar duplicidade
    if (pedido_origem_id && typeof pedido_origem_id === "string") {
      try {
        await supabaseAdmin!
          .from("pedidos")
          .update({
            status: "cancelado",
            motivacao: `Substituído por nova tentativa (#${pedido.id})`,
            updated_at: new Date().toISOString(),
          })
          .eq("id", pedido_origem_id)
          .eq("usuario_id", clienteLogado.id)
          .eq("status", "pendente");

        await supabaseAdmin!
          .from("inscricoes")
          .update({ status: "cancelado" })
          .eq("pedido_id", pedido_origem_id)
          .eq("status", "pendente");
      } catch (errCancel) {
        console.error("[checkout] Erro ao cancelar pedido anterior substituído:", errCancel);
      }
    }

    // 7. Criar inscrição vinculada se for serviço/vivência
    if (inscricao || itensProcessados.some((i) => i.vagasMaximas != null)) {
      try {
        const { error: inscricaoError } = await supabaseAdmin!.from("inscricoes").insert({
          turma_id: turmaAtual,
          order_nsu: orderNsu,
          pedido_id: pedido.id,
          nome: clienteNome,
          email: clienteEmail,
          telefone: clienteTelefone || "Não informado",
          motivacao: inscricao?.motivacao || "Compra via E-commerce",
          metodo_pagamento: ehGratuito ? "cupom_gratuito" : (inscricao?.metodoPagamento || "infinitepay"),
          valor: valorFinal,
          status: ehGratuito ? "confirmado" : "pendente",
        });

        if (inscricaoError) {
          console.error("[checkout] Erro ao registrar inscricao:", inscricaoError);
        }
      } catch (errInscricao) {
        console.error("[checkout] Falha ao tentar registrar inscrição:", errInscricao);
      }
    }

    // 7.1 Se o pedido for gratuito (100% de desconto), finaliza imediatamente sem chamar InfinitePay
    if (ehGratuito) {
      if (cupomId) {
        try {
          const { data: cupomAtual } = await supabaseAdmin!
            .from("cupons")
            .select("quantidade_utilizada")
            .eq("id", cupomId)
            .single();
          const qtdAtual = cupomAtual?.quantidade_utilizada || 0;
          await supabaseAdmin!
            .from("cupons")
            .update({ quantidade_utilizada: qtdAtual + 1, updated_at: new Date().toISOString() })
            .eq("id", cupomId);
          await supabaseAdmin!.from("cupons_usos").insert({
            cupom_id: cupomId,
            pedido_id: pedido.id,
            usuario_id: clienteLogado.id,
            valor_desconto: valorDesconto,
          });
        } catch (cupomErr) {
          console.error("[checkout] Erro ao registrar baixa do cupom:", cupomErr);
        }
      }

      try {
        const { notifyPagamentoConfirmado, sendConfirmacaoCliente } = await import("@/lib/email");
        const nomeProduto = itensProcessados.map((i) => i.nome).join(", ");
        await notifyPagamentoConfirmado({
          nome: clienteNome,
          email: clienteEmail,
          telefone: clienteTelefone,
          produto: nomeProduto,
          valor: 0,
          metodo: "gratuito",
          orderNsu,
        });
        await sendConfirmacaoCliente({
          nome: clienteNome,
          email: clienteEmail,
          produto: nomeProduto,
          valor: 0,
        });
      } catch (emailErr) {
        console.error("[checkout] Erro ao enviar e-mails de confirmação gratuita:", emailErr);
      }

      return NextResponse.json({
        url: `${SITE_URL}/checkout/sucesso`,
        order_nsu: orderNsu,
        gratuito: true,
      });
    }

    // 8. Montar itens para a InfinitePay
    // Para distribuir o desconto com precisão centavo a centavo nos itens da InfinitePay:
    let infinitePayItems: { quantity: number; price: number; description: string }[] = [];

    if (valorDesconto > 0 && subtotal > 0) {
      const fator = valorFinal / subtotal;
      infinitePayItems = itensProcessados.map((item) => ({
        quantity: item.quantidade,
        price: Math.max(1, Math.round(item.precoUnitario * fator * 100)),
        description: item.nome,
      }));
    } else {
      infinitePayItems = itensProcessados.map((item) => ({
        quantity: item.quantidade,
        price: Math.round(item.precoUnitario * 100),
        description: item.nome,
      }));
    }

    const webhookToken = WEBHOOK_SECRET
      ? crypto.createHmac("sha256", WEBHOOK_SECRET).update(orderNsu).digest("hex")
      : "";

    const webhookUrl = webhookToken
      ? `${SITE_URL}/api/webhook?token=${webhookToken}`
      : `${SITE_URL}/api/webhook`;

    const payload: Record<string, unknown> = {
      handle: INFINITEPAY_HANDLE,
      items: infinitePayItems,
      order_nsu: orderNsu,
      redirect_url: `${SITE_URL}/checkout/sucesso`,
      webhook_url: webhookUrl,
    };

    // 9. Repassar TODOS os dados do cliente para a InfinitePay evitando qualquer retrabalho
    const infiniteCustomer: Record<string, unknown> = {};
    if (clienteNome && clienteNome !== "Participante") infiniteCustomer.name = clienteNome;
    if (clienteEmail && clienteEmail !== "N/A") infiniteCustomer.email = clienteEmail;

    if (clienteTelefone) {
      const formattedPhone = formatPhoneE164(clienteTelefone);
      if (formattedPhone.length >= 12) infiniteCustomer.phone_number = formattedPhone;
    }

    if (clienteCpf) {
      const cleanCpf = clienteCpf.replace(/\D/g, "");
      if (cleanCpf.length === 11) infiniteCustomer.cpf = cleanCpf;
    }

    if (enderecoEntrega) {
      infiniteCustomer.address = {
        street: enderecoEntrega.rua,
        number: enderecoEntrega.numero,
        complement: enderecoEntrega.complemento || "",
        district: enderecoEntrega.bairro,
        city: enderecoEntrega.cidade,
        state: enderecoEntrega.uf,
        zip_code: enderecoEntrega.cep.replace(/\D/g, ""),
      };
    }

    if (Object.keys(infiniteCustomer).length > 0) {
      payload.customer = infiniteCustomer;
    }

    const response = await fetch(INFINITEPAY_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[checkout] Erro da InfinitePay:", data);
      await supabaseAdmin!.from("inscricoes").delete().eq("pedido_id", pedido.id);
      await supabaseAdmin!.from("pedidos").delete().eq("id", pedido.id);
      return NextResponse.json(
        { error: "Erro ao criar link de pagamento", details: data },
        { status: response.status }
      );
    }

    const checkoutUrl = data.url || data.link || data.checkout_url;

    return NextResponse.json({
      url: checkoutUrl,
      order_nsu: orderNsu,
    });
  } catch (error) {
    console.error("[checkout] Erro inesperado:", error);
    return NextResponse.json(
      { error: "Erro ao processar checkout" },
      { status: 500 }
    );
  }
}
