import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";
import { generatePasswordResetToken } from "@/lib/cliente-auth";
import { sendPasswordResetEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

function getBaseUrl(req: NextRequest): string {
  const origin = req.headers.get("origin");
  if (origin && !origin.includes("null")) return origin;

  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") || "https";
  if (host) return `${proto}://${host}`;

  return process.env.NEXT_PUBLIC_SITE_URL || "https://instituto-kalapa.vercel.app";
}

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    if (!rateLimit(`client-forgot-pwd:${ip}`, 5, 15 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Muitas solicitações de recuperação. Tente novamente em 15 minutos." },
        { status: 429 }
      );
    }

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

    const baseUrl = getBaseUrl(req);
    const resetLink = `${baseUrl}/redefinir-senha?token=${token}`;

    const emailRes = await sendPasswordResetEmail({
      nome: usuario.nome,
      email: usuario.email,
      resetLink,
    });

    if (!emailRes.success) {
      console.warn("[auth/esqueci-senha] Alerta: Falha no despacho via SMTP Hostinger:", emailRes.error);
    }

    return NextResponse.json({
      success: true,
      message: "Se o e-mail estiver cadastrado, você receberá o link de recuperação em instantes.",
    });
  } catch (error) {
    console.error("[auth/esqueci-senha] Erro:", error);
    return NextResponse.json(
      { error: "Erro ao processar solicitação de recuperação de senha" },
      { status: 500 }
    );
  }
}
