import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/admin-auth";
import { verifyAdminPassword, setAdminPassword } from "@/lib/admin-password";
import { createSessionTokenForAdmin, invalidateAdminCredentialCache } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    if (!(await checkAdminAuth(req))) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    if (!rateLimit(`admin-change-pass:${ip}`, 5, 15 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Muitas tentativas de alteração de senha. Tente novamente em 15 minutos." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { senhaAtual, novaSenha, confirmarNovaSenha } = body;

    if (!senhaAtual || typeof senhaAtual !== "string") {
      return NextResponse.json(
        { error: "A senha atual é obrigatória." },
        { status: 400 }
      );
    }

    if (!novaSenha || typeof novaSenha !== "string" || novaSenha.length < 8) {
      return NextResponse.json(
        { error: "A nova senha deve ter no mínimo 8 caracteres." },
        { status: 400 }
      );
    }

    if (novaSenha !== confirmarNovaSenha) {
      return NextResponse.json(
        { error: "A confirmação da nova senha não coincide." },
        { status: 400 }
      );
    }

    if (senhaAtual === novaSenha) {
      return NextResponse.json(
        { error: "A nova senha deve ser diferente da senha atual." },
        { status: 400 }
      );
    }

    const isCurrentValid = await verifyAdminPassword(senhaAtual);
    if (!isCurrentValid) {
      return NextResponse.json(
        { error: "A senha atual informada está incorreta." },
        { status: 400 }
      );
    }

    await setAdminPassword(novaSenha);
    invalidateAdminCredentialCache();

    const newToken = await createSessionTokenForAdmin();

    const response = NextResponse.json({
      success: true,
      message: "Senha de administrador atualizada com sucesso!",
    });

    if (newToken) {
      response.cookies.set("admin_session", newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24,
      });
    }

    return response;
  } catch (error) {
    console.error("[admin/alterar-senha] Erro ao alterar senha:", error);
    return NextResponse.json(
      { error: "Erro interno ao atualizar a senha do administrador." },
      { status: 500 }
    );
  }
}
