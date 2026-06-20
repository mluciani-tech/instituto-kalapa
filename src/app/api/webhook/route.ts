import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";

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

    console.log("[webhook] Pagamento recebido:", body.order_nsu, body.transaction_nsu);

    const {
      amount,
      paid_amount,
      capture_method,
      transaction_nsu,
      order_nsu,
      receipt_url,
    } = body;

    if (!order_nsu || !transaction_nsu) {
      console.error("[webhook] Dados obrigatórios ausentes:", { order_nsu, transaction_nsu });
      return NextResponse.json(
        { success: false, message: "Dados obrigatórios ausentes" },
        { status: 400 }
      );
    }

    if (isAdminConfigured()) {
      const turmaAtual = await getTurmaAtual();

      // Buscar inscrição pelo order_nsu para atualizar apenas esta
      const { data: inscricoes } = await supabaseAdmin!
        .from("inscricoes")
        .select("id")
        .eq("order_nsu", order_nsu)
        .eq("turma_id", turmaAtual)
        .limit(1);

      if (inscricoes && inscricoes.length > 0) {
        const valorReais = paid_amount / 100;
        await supabaseAdmin!.from("inscricoes").update({
          status: "pago",
          metodo_pagamento: capture_method === "pix" ? "pix" : "cartao",
          valor: valorReais,
        }).eq("id", inscricoes[0].id);
      } else {
        // Fallback: se não encontrou pelo order_nsu, busca a última inscrição pendente da turma
        console.warn("[webhook] Inscrição não encontrada pelo order_nsu:", order_nsu);
        const { data: ultimaInscricao } = await supabaseAdmin!
          .from("inscricoes")
          .select("id")
          .eq("turma_id", turmaAtual)
          .eq("status", "confirmada")
          .order("created_at", { ascending: false })
          .limit(1);

        if (ultimaInscricao && ultimaInscricao.length > 0) {
          const valorReais = paid_amount / 100;
          await supabaseAdmin!.from("inscricoes").update({
            status: "pago",
            metodo_pagamento: capture_method === "pix" ? "pix" : "cartao",
            valor: valorReais,
          }).eq("id", ultimaInscricao[0].id);
        }
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
