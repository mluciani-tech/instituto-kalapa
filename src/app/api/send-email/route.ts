import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_FROM = process.env.KALAPA_EMAIL_FROM || "contato@institutokalapa.com.br";
const EMAIL_TO = process.env.KALAPA_EMAIL_TO || "contato@institutokalapa.com.br";
const TURMA_ATUAL = "2025-01";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nome, email, telefone, motivacao, metodoPagamento, valor } = body;

    if (isSupabaseConfigured()) {
      const { error: insertError } = await supabase!.from("inscricoes").insert({
        turma_id: TURMA_ATUAL,
        nome,
        email,
        telefone,
        motivacao,
        metodo_pagamento: metodoPagamento,
        valor,
        status: "confirmada",
      });

      if (insertError) {
        console.error("[send-email] Erro ao inserir no Supabase:", insertError);
      }
    }

    const html = `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #FAF8F5; padding: 32px; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #673de6; font-size: 24px; margin: 0;">Instituto Kalapa</h1>
          <p style="color: #727586; font-size: 14px; margin-top: 4px;">Nova inscrição + Pagamento confirmado</p>
        </div>

        <div style="background: #fff; border-radius: 12px; padding: 24px; margin-bottom: 16px;">
          <h2 style="color: #282D30; font-size: 18px; margin-top: 0;">Dados do participante</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #36344d;">
            <tr><td style="padding: 8px 0; font-weight: 600; width: 140px;">Nome:</td><td style="padding: 8px 0;">${nome}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: 600;">E-mail:</td><td style="padding: 8px 0;">${email}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: 600;">WhatsApp:</td><td style="padding: 8px 0;">${telefone}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: 600;">Motivação:</td><td style="padding: 8px 0;">${motivacao}</td></tr>
          </table>
        </div>

        <div style="background: #fff; border-radius: 12px; padding: 24px;">
          <h2 style="color: #282D30; font-size: 18px; margin-top: 0;">Detalhes do pagamento</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #36344d;">
            <tr><td style="padding: 8px 0; font-weight: 600; width: 140px;">Método:</td><td style="padding: 8px 0;">${metodoPagamento?.toUpperCase()}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: 600;">Valor:</td><td style="padding: 8px 0;">R$ ${valor},00</td></tr>
            <tr><td style="padding: 8px 0; font-weight: 600;">Status:</td><td style="padding: 8px 0; color: #00b090; font-weight: 600;">✓ Processado via InfinitePay</td></tr>
          </table>
        </div>

        <p style="text-align: center; color: #727586; font-size: 12px; margin-top: 32px;">
          Instituto Kalapa — Transformação Comportamental
        </p>
      </div>
    `;

    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "re_sua_key_aqui") {
      console.warn("[send-email] RESEND_API_KEY não configurada — logando no console ao invés de enviar.");
      console.log("=========================================");
      console.log("MOCK: ENVIANDO E-MAIL DE CONFIRMAÇÃO");
      console.log(`Destinatário: ${EMAIL_TO}`);
      console.log(`Participante: ${nome} | ${email} | ${telefone}`);
      console.log(`Pagamento: ${metodoPagamento?.toUpperCase()} — R$ ${valor},00`);
      console.log("=========================================");

      return NextResponse.json({
        success: true,
        message: "E-mail simulado (RESEND_API_KEY não configurada). Dados logados no console.",
        mock: true,
      });
    }

    const { data, error } = await resend.emails.send({
      from: `Instituto Kalapa <${EMAIL_FROM}>`,
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
