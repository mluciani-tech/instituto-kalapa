import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";
import { generatePasswordResetToken } from "@/lib/cliente-auth";
import { sendPasswordResetEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://instituto-kalapa.vercel.app";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email?.trim() || !email.includes("@")) {
      return NextResponse.json(
        { error: "Informe um e-mail válido" },
        { status: 400 }
      );
    }

    if (!isAdminConfigured()) {
      return NextResponse.json(
        { error: "Banco de dados não configurado" },
        { status: 500 }
      );
    }

    const emailNorm = email.trim().toLowerCase();

    const { data: usuario } = await supabaseAdmin!
      .from("usuarios")
      .select("id, nome, email, ativo")
      .eq("email", emailNorm)
      .single();

    // Sempre retorna sucesso para evitar enumeração de usuários
    if (!usuario || !usuario.ativo) {
      return NextResponse.json({
        success: true,
        message: "Se o e-mail estiver cadastrado, você receberá o link de recuperação.",
      });
    }

    const { token, expira } = generatePasswordResetToken();

    await supabaseAdmin!
      .from("usuarios")
      .update({
        reset_token: token,
        reset_token_expira: expira.toISOString(),
      })
      .eq("id", usuario.id);

    const resetLink = `${SITE_URL}/redefinir-senha?token=${token}`;

    await sendPasswordResetEmail({
      nome: usuario.nome,
      email: usuario.email,
      resetLink,
    });

    return NextResponse.json({
      success: true,
      message: "Se o e-mail estiver cadastrado, você receberá o link de recuperação.",
    });
  } catch (error) {
    console.error("[auth/esqueci-senha] Erro:", error);
    return NextResponse.json(
      { error: "Erro ao processar solicitação de recuperação de senha" },
      { status: 500 }
    );
  }
}
