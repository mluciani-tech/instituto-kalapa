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

    // 15 tentativas a cada 15 minutos para evitar bloqueio acidental durante configuracao
    if (!rateLimit(`admin-change-pass:${ip}`, 15, 15 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Muitas tentativas de alteração de senha. Aguarde alguns minutos antes de tentar novamente." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const senhaAtual = typeof body.senhaAtual === "string" ? body.senhaAtual : "";
    const novaSenha = typeof body.novaSenha === "string" ? body.novaSenha : "";
    const confirmarNovaSenha = typeof body.confirmarNovaSenha === "string" ? body.confirmarNovaSenha : "";

    if (!senhaAtual.trim()) {
      return NextResponse.json(
        { error: "A senha atual é obrigatória." },
        { status: 400 }
      );
    }

    if (!novaSenha.trim() || novaSenha.trim().length < 8) {
      return NextResponse.json(
        { error: "A nova senha deve ter no mínimo 8 caracteres." },
        { status: 400 }
      );
    }

    if (novaSenha !== confirmarNovaSenha) {
      return NextResponse.json(
        { error: "A confirmação da nova senha não coincide com a nova senha digitada." },
        { status: 400 }
      );
    }

    if (senhaAtual.trim() === novaSenha.trim()) {
      return NextResponse.json(
        { error: "A nova senha deve ser diferente da senha atual." },
        { status: 400 }
      );
    }

    const isCurrentValid = await verifyAdminPassword(senhaAtual);
    if (!isCurrentValid) {
      return NextResponse.json(
        { error: "A senha atual informada está incorreta. Verifique a credencial digitada." },
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
  } catch (error: any) {
    console.error("[admin/alterar-senha] Erro ao alterar senha:", error);
    return NextResponse.json(
      { error: error?.message || "Erro interno ao atualizar a senha do administrador." },
      { status: 500 }
    );
  }
}
