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

      // Try to find inscription by order_nsu
      let inscricaoId: string | null = null;

      try {
        const { data: inscricoes, error: findError } = await supabaseAdmin!
          .from("inscricoes")
          .select("id")
          .eq("order_nsu", order_nsu)
          .eq("turma_id", turmaAtual)
          .limit(1);

        if (!findError && inscricoes && inscricoes.length > 0) {
          inscricaoId = inscricoes[0].id;
        }
      } catch {
        // order_nsu column might not exist
        console.warn("[webhook] Busca por order_nsu falhou (coluna pode não existir)");
      }

      // Fallback: find last pending inscription for this turma
      if (!inscricaoId) {
        console.warn("[webhook] Usando fallback: última inscrição pendente da turma", turmaAtual);
        const { data: ultimaInscricao } = await supabaseAdmin!
          .from("inscricoes")
          .select("id")
          .eq("turma_id", turmaAtual)
          .eq("status", "confirmada")
          .order("created_at", { ascending: false })
          .limit(1);

        if (ultimaInscricao && ultimaInscricao.length > 0) {
          inscricaoId = ultimaInscricao[0].id;
        }
      }

      if (inscricaoId) {
        const valorReais = paid_amount / 100;
        await supabaseAdmin!.from("inscricoes").update({
          status: "pago",
          metodo_pagamento: capture_method === "pix" ? "pix" : "cartao",
          valor: valorReais,
        }).eq("id", inscricaoId);
        console.log("[webhook] Inscrição atualizada para pago:", inscricaoId);
      } else {
        console.warn("[webhook] Nenhuma inscrição encontrada para atualizar. order_nsu:", order_nsu);
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
