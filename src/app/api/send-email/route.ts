import { NextResponse } from "next/server";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";

const EMAIL_FROM = process.env.KALAPA_EMAIL_FROM || "contato@institutokalapa.com.br";
const EMAIL_TO = process.env.KALAPA_EMAIL_TO || "contato@institutokalapa.com.br";

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const getTurmaAtual = async (): Promise<string> => {
  if (!isAdminConfigured()) return "2025-01";
  const { data } = await supabaseAdmin!
    .from("configuracoes")
    .select("valor")
    .eq("chave", "turma_atual")
    .single();
  return data?.valor || "2025-01";
};

const apiKey = process.env.RESEND_API_KEY;
const isResendConfigured =
  apiKey && apiKey !== "re_sua_key_aqui" && apiKey.startsWith("re_");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nome, email, telefone, motivacao, metodoPagamento, valor, order_nsu } = body;

    const turmaAtual = await getTurmaAtual();

    if (isAdminConfigured()) {
      const inscriptionData: Record<string, unknown> = {
        turma_id: turmaAtual,
        nome,
        email,
        telefone,
        motivacao,
        metodo_pagamento: metodoPagamento,
        valor,
        status: "confirmada",
      };

      // Try with order_nsu first
      if (order_nsu) {
        inscriptionData.order_nsu = order_nsu;
      }

      let { error: insertError } = await supabaseAdmin!.from("inscricoes").insert(inscriptionData);

      // If failed (likely missing order_nsu column), retry without it
      if (insertError && order_nsu && insertError.message?.includes("order_nsu")) {
        console.warn("[send-email] Coluna order_nsu não existe yet, inserindo sem ela");
        delete inscriptionData.order_nsu;
        const retry = await supabaseAdmin!.from("inscricoes").insert(inscriptionData);
        if (retry.error) {
          console.error("[send-email] Erro ao inserir no Supabase:", retry.error);
        }
      } else if (insertError) {
        console.error("[send-email] Erro ao inserir no Supabase:", insertError);
      }
    }

    const html = `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #F8F4ED; padding: 32px; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #1A3C4D; font-size: 24px; margin: 0;">INstituto Kalapa</h1>
          <p style="color: #7D8C6E; font-size: 14px; margin-top: 4px;">Nova inscrição + Pagamento confirmado</p>
        </div>

        <div style="background: #fff; border-radius: 12px; padding: 24px; margin-bottom: 16px;">
          <h2 style="color: #4A4A4A; font-size: 18px; margin-top: 0;">Dados do participante</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #4A4A4A;">
            <tr><td style="padding: 8px 0; font-weight: 600; width: 140px;">Nome:</td><td style="padding: 8px 0;">${nome}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: 600;">E-mail:</td><td style="padding: 8px 0;">${email}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: 600;">WhatsApp:</td><td style="padding: 8px 0;">${telefone}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: 600;">Motivação:</td><td style="padding: 8px 0;">${motivacao}</td></tr>
          </table>
        </div>

        <div style="background: #fff; border-radius: 12px; padding: 24px;">
          <h2 style="color: #4A4A4A; font-size: 18px; margin-top: 0;">Detalhes do pagamento</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #4A4A4A;">
            <tr><td style="padding: 8px 0; font-weight: 600; width: 140px;">Método:</td><td style="padding: 8px 0;">${metodoPagamento?.toUpperCase()}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: 600;">Valor:</td><td style="padding: 8px 0;">${formatCurrency(Number(valor))}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: 600;">Status:</td><td style="padding: 8px 0; color: #7D8C6E; font-weight: 600;">✓ Processado via InfinitePay</td></tr>
          </table>
        </div>

        <p style="text-align: center; color: #7D8C6E; font-size: 12px; margin-top: 32px;">
          INstituto Kalapa — Transformação Comportamental
        </p>
      </div>
    `;

    if (!isResendConfigured) {
      console.warn("[send-email] RESEND_API_KEY não configurada — logando no console ao invés de enviar.");
      console.log("=========================================");
      console.log("MOCK: ENVIANDO E-MAIL DE CONFIRMAÇÃO");
      console.log(`Destinatário: ${EMAIL_TO}`);
      console.log(`Participante: ${nome} | ${email} | ${telefone}`);
      console.log(`Pagamento: ${metodoPagamento?.toUpperCase()} — ${formatCurrency(Number(valor))}`);
      console.log("=========================================");

      return NextResponse.json({
        success: true,
        message: "E-mail simulado (RESEND_API_KEY não configurada). Dados logados no console.",
        mock: true,
      });
    }

    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    const { data, error } = await resend.emails.send({
      from: `INstituto Kalapa <${EMAIL_FROM}>`,
      to: [EMAIL_TO],
      subject: `Nova Inscrição + Pagamento — ${nome}`,
      html,
    });

    if (error) {
      console.error("[send-email] Erro do Resend:", error);
      return NextResponse.json(
        { success: false, error: "Erro ao enviar e-mail via Resend" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "E-mail enviado com sucesso",
      data,
    });
  } catch (error) {
    console.error("[send-email] Erro inesperado:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao processar requisição" },
      { status: 500 }
    );
  }
}
