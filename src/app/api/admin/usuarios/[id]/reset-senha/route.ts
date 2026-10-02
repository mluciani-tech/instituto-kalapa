import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";
import { checkAdminAuth } from "@/lib/admin-auth";
import { generatePasswordResetToken } from "@/lib/cliente-auth";
import { sendPasswordResetEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

function getBaseUrl(req: NextRequest): string {
  const origin = req.headers.get("origin");
  if (origin && !origin.includes("null")) return origin;

  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") || "https";
  if (host) return `${proto}://${host}`;

  return process.env.NEXT_PUBLIC_SITE_URL || "https://instituto-kalapa.vercel.app";
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await checkAdminAuth(req))) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    if (!isAdminConfigured()) {
      return NextResponse.json({ error: "Banco de dados não configurado" }, { status: 500 });
    }

    const { id } = await params;

    const { data: usuario, error: userError } = await supabaseAdmin!
      .from("usuarios")
      .select("id, nome, email, telefone, ativo")
      .eq("id", id)
      .single();

    if (userError || !usuario) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    if (!usuario.ativo) {
      return NextResponse.json(
        { error: "Este usuário está inativo no sistema. Ative-o antes de gerar a recuperação de senha." },
        { status: 400 }
      );
    }

    const { token, expira } = generatePasswordResetToken();

    const { error: updateError } = await supabaseAdmin!
      .from("usuarios")
      .update({
        reset_token: token,
        reset_token_expira: expira.toISOString(),
      })
      .eq("id", usuario.id);

    if (updateError) {
      console.error("[api/admin/usuarios/reset-senha] Erro ao salvar token:", updateError);
      return NextResponse.json(
        { error: "Erro ao gerar token de recuperação no banco de dados" },
        { status: 500 }
      );
    }

    const baseUrl = getBaseUrl(req);
    const resetLink = `${baseUrl}/redefinir-senha?token=${token}`;

    const emailRes = await sendPasswordResetEmail({
      nome: usuario.nome,
      email: usuario.email,
      resetLink,
    });

    if (!emailRes.success) {
      console.warn("[api/admin/usuarios/reset-senha] Alerta SMTP Hostinger:", emailRes.error);
    }

    return NextResponse.json({
      success: true,
      emailEnviado: emailRes.success,
      emailError: emailRes.error,
      resetLink,
      expiraEm: expira.toISOString(),
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        telefone: usuario.telefone,
      },
      message: emailRes.success
        ? `E-mail de recuperação enviado com sucesso para ${usuario.email}`
        : `Link de redefinição gerado com sucesso! (Aviso SMTP: ${emailRes.error || "falha de envio"}). Você pode copiar o link ou enviar diretamente via WhatsApp.`,
    });
  } catch (err: any) {
    console.error("[api/admin/usuarios/reset-senha] Erro interno:", err);
    return NextResponse.json(
      { error: err?.message || "Erro interno ao processar recuperação de senha" },
      { status: 500 }
    );
  }
}
