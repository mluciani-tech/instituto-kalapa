import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("[webhook] Pagamento recebido:", body.order_nsu, body.transaction_nsu);

    const {
      amount,
      paid_amount,
      capture_method,
      transaction_nsu,
      order_nsu,
      receipt_url,
    } = body;

    if (!order_nsu) {
      console.error("[webhook] order_nsu ausente");
      return NextResponse.json(
        { success: false, message: "order_nsu obrigatório" },
        { status: 400 }
      );
    }

    if (!isAdminConfigured()) {
      return NextResponse.json({ success: true, message: null });
    }

    // 1. Buscar pedido pelo order_nsu
    const { data: pedido, error: pedidoError } = await supabaseAdmin!
      .from("pedidos")
      .select("id, status")
      .eq("order_nsu", order_nsu)
      .single();

    if (pedidoError || !pedido) {
      console.warn("[webhook] Pedido não encontrado:", order_nsu);
      // Fallback: tentar atualizar inscrição direta (legado)
      await fallbackInscricao(order_nsu, paid_amount, capture_method);
      return NextResponse.json({ success: true, message: null });
    }

    // 2. Atualizar pedido
    const valorReais = paid_amount ? paid_amount / 100 : amount ? amount / 100 : 0;

    await supabaseAdmin!.from("pedidos").update({
      status: "pago",
      metodo_pagamento: capture_method === "pix" ? "pix" : "cartao",
      transaction_nsu: transaction_nsu || null,
      receipt_url: receipt_url || null,
      capture_method: capture_method || null,
      valor: valorReais,
      updated_at: new Date().toISOString(),
    }).eq("id", pedido.id);

    console.log("[webhook] Pedido atualizado:", pedido.id);

    // 3. Atualizar inscrição vinculada
    const { data: inscricao } = await supabaseAdmin!
      .from("inscricoes")
      .select("id")
      .eq("pedido_id", pedido.id)
      .limit(1)
      .single();

    if (inscricao) {
      await supabaseAdmin!.from("inscricoes").update({
        status: "pago",
        metodo_pagamento: capture_method === "pix" ? "pix" : "cartao",
        valor: valorReais,
      }).eq("id", inscricao.id);
      console.log("[webhook] Inscrição atualizada:", inscricao.id);
    } else {
      // Fallback: inscrição sem pedido_id, buscar por order_nsu
      const { data: inscricaoLegado } = await supabaseAdmin!
        .from("inscricoes")
        .select("id")
        .eq("order_nsu", order_nsu)
        .limit(1)
        .single();

      if (inscricaoLegado) {
        await supabaseAdmin!.from("inscricoes").update({
          status: "pago",
          metodo_pagamento: capture_method === "pix" ? "pix" : "cartao",
          valor: valorReais,
        }).eq("id", inscricaoLegado.id);
        console.log("[webhook] Inscrição legada atualizada:", inscricaoLegado.id);
      }
    }

    return NextResponse.json({ success: true, message: null });
  } catch (error) {
    console.error("[webhook] Erro:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao processar webhook" },
      { status: 400 }
    );
  }
}

// Fallback para inscrições legadas (sem tabela pedidos)
async function fallbackInscricao(
  order_nsu: string,
  paid_amount: number,
  capture_method: string
) {
  try {
    const { data: inscricao } = await supabaseAdmin!
      .from("inscricoes")
      .select("id")
      .eq("order_nsu", order_nsu)
      .limit(1)
      .single();

    if (inscricao) {
      const valorReais = paid_amount / 100;
      await supabaseAdmin!.from("inscricoes").update({
        status: "pago",
        metodo_pagamento: capture_method === "pix" ? "pix" : "cartao",
        valor: valorReais,
      }).eq("id", inscricao.id);
      console.log("[webhook] Fallback: inscrição atualizada:", inscricao.id);
    } else {
      console.warn("[webhook] Fallback: nenhuma inscrição encontrada para:", order_nsu);
    }
  } catch (err) {
    console.error("[webhook] Erro no fallback:", err);
  }
}
