import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("[webhook] Pagamento recebido:", JSON.stringify(body, null, 2));

    const {
      invoice_slug,
      amount,
      paid_amount,
      installments,
      capture_method,
      transaction_nsu,
      order_nsu,
      receipt_url,
      items,
    } = body;

    if (isAdminConfigured() && order_nsu) {
      const { error } = await supabaseAdmin!.from("inscricoes").update({
        status: "pago",
        metodo_pagamento: capture_method === "pix" ? "pix" : "cartao",
        valor: Math.round(paid_amount / 100),
      }).eq("turma_id", "2025-01");

      if (error) {
        console.error("[webhook] Erro ao atualizar inscricao:", error);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[webhook] Erro:", error);
    return NextResponse.json(
      { error: "Erro ao processar webhook" },
      { status: 500 }
    );
  }
}
