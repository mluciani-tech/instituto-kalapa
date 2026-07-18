import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";
import { getTurmaAtual, getVagasMaximas, countInscricoesPagas } from "@/lib/vagas";

export const dynamic = "force-dynamic";

const INFINITEPAY_API = "https://api.checkout.infinitepay.io/links";
const INFINITEPAY_HANDLE = process.env.INFINITEPAY_HANDLE || "kalapa";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://instituto-kalapa.vercel.app";
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { produto_id, customer, inscricao } = body;

    if (!produto_id) {
      return NextResponse.json(
        { error: "produto_id é obrigatório" },
        { status: 400 }
      );
    }

    if (!isAdminConfigured()) {
      return NextResponse.json(
        { error: "Supabase não configurado" },
        { status: 500 }
      );
    }

    // 1. Buscar produto no banco — preço SEMPRE vem do servidor,
    //    nunca do cliente (evita adulteração de valor)
    const { data: produto, error: produtoError } = await supabaseAdmin!
      .from("produtos")
      .select("id, nome, preco, vagas_maximas, ativo")
      .eq("id", produto_id)
      .eq("ativo", true)
      .single();

    if (produtoError || !produto) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    // 2. Verificar vagas no servidor (fecha race condition)
    if (produto.vagas_maximas != null) {
      const [maximas, preenchidas] = await Promise.all([
        getVagasMaximas(produto.id),
        countInscricoesPagas(produto.id),
      ]);

      if (preenchidas >= maximas) {
        return NextResponse.json(
          { error: "Turma lotada. Entre em contato para a próxima turma." },
          { status: 409 }
        );
      }
    }

    // 3. order_nsu gerado no servidor — imprevisível
    const orderNsu = `kalapa-${crypto.randomUUID()}`;
    const precoCentavos = Math.round(Number(produto.preco) * 100);
    const turmaAtual = await getTurmaAtual();

    // 4. Criar pedido (status pendente até o webhook confirmar)
    const { data: pedido, error: pedidoError } = await supabaseAdmin!
      .from("pedidos")
      .insert({
        order_nsu: orderNsu,
        produto_id: produto.id,
        cliente_nome: customer?.name || "N/A",
        cliente_email: customer?.email || "N/A",
        cliente_telefone: customer?.phone_number || null,
        valor: precoCentavos / 100,
        status: "pendente",
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

    // 5. Criar inscrição vinculada — status "pendente":
    //    NÃO ocupa vaga até o pagamento ser confirmado
    if (inscricao) {
      const { error: inscricaoError } = await supabaseAdmin!
        .from("inscricoes")
        .insert({
          turma_id: turmaAtual,
          order_nsu: orderNsu,
          pedido_id: pedido.id,
          nome: inscricao.nome,
          email: inscricao.email,
          telefone: inscricao.telefone,
          motivacao: inscricao.motivacao || null,
          metodo_pagamento: inscricao.metodoPagamento || null,
          valor: precoCentavos / 100,
          status: "pendente",
        });

      if (inscricaoError) {
        console.error("[checkout] Erro ao criar inscrição:", inscricaoError);
      }
    }

    // 6. Montar payload InfinitePay com itens do servidor
    const items = [
      {
        quantity: 1,
        price: precoCentavos,
        description: produto.nome,
      },
    ];

    const webhookUrl = WEBHOOK_SECRET
      ? `${SITE_URL}/api/webhook?secret=${WEBHOOK_SECRET}`
      : `${SITE_URL}/api/webhook`;

    const payload: Record<string, unknown> = {
      handle: INFINITEPAY_HANDLE,
      items,
      order_nsu: orderNsu,
      redirect_url: `${SITE_URL}/checkout/sucesso`,
      webhook_url: webhookUrl,
    };

    if (customer) {
      const phoneDigits = (customer.phone_number || "").replace(/\D/g, "");
      if (phoneDigits.length >= 10) {
        payload.customer = customer;
      }
    }

    const response = await fetch(INFINITEPAY_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[checkout] Erro da InfinitePay:", data);
      // Limpar registros órfãos — o pagamento nem foi iniciado
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
