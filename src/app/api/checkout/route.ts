import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const INFINITEPAY_API = "https://api.checkout.infinitepay.io/links";
const INFINITEPAY_HANDLE = process.env.INFINITEPAY_HANDLE || "kalapa";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://instituto-kalapa.vercel.app";

const getTurmaAtual = async (): Promise<string> => {
  if (!isAdminConfigured()) return "2025-01";
  const { data } = await supabaseAdmin!
    .from("configuracoes")
    .select("valor")
    .eq("chave", "turma_atual")
    .single();
  return data?.valor || "2025-01";
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { produto_id, items, order_nsu, customer, inscricao } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Items são obrigatórios" },
        { status: 400 }
      );
    }

    const orderNsu = order_nsu || `kalapa-${Date.now()}`;

    // 1. Criar pedido no banco (se Supabase configurado)
    if (isAdminConfigured() && produto_id) {
      const turmaAtual = await getTurmaAtual();

      const { error: pedidoError } = await supabaseAdmin!
        .from("pedidos")
        .insert({
          order_nsu: orderNsu,
          produto_id,
          cliente_nome: customer?.name || "N/A",
          cliente_email: customer?.email || "N/A",
          cliente_telefone: customer?.phone_number || null,
          valor: items[0].price / 100,
          status: "pendente",
        });

      if (pedidoError) {
        console.error("[checkout] Erro ao criar pedido:", pedidoError);
      }

      // 2. Criar inscrição vinculada ao pedido
      if (inscricao) {
        // Buscar pedido recém-criado para obter o ID
        const { data: pedido } = await supabaseAdmin!
          .from("pedidos")
          .select("id")
          .eq("order_nsu", orderNsu)
          .single();

        const { error: inscricaoError } = await supabaseAdmin!
          .from("inscricoes")
          .insert({
            turma_id: turmaAtual,
            order_nsu: orderNsu,
            pedido_id: pedido?.id || null,
            nome: inscricao.nome,
            email: inscricao.email,
            telefone: inscricao.telefone,
            motivacao: inscricao.motivacao || null,
            metodo_pagamento: inscricao.metodoPagamento || null,
            valor: inscricao.valor || items[0].price / 100,
            status: "confirmada",
          });

        if (inscricaoError) {
          console.error("[checkout] Erro ao criar inscrição:", inscricaoError);
        }
      }
    }

    // 3. Criar link de pagamento InfinitePay
    const payload: Record<string, unknown> = {
      handle: INFINITEPAY_HANDLE,
      items,
      order_nsu: orderNsu,
      redirect_url: `${SITE_URL}/checkout/sucesso`,
      webhook_url: `${SITE_URL}/api/webhook`,
    };

    if (customer) {
      const phoneDigits = (customer.phone_number || "").replace(/\D/g, "");
      if (phoneDigits.length >= 10) {
        payload.customer = customer;
      }
    }

    const response = await fetch(INFINITEPAY_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[checkout] Erro da InfinitePay:", data);
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
