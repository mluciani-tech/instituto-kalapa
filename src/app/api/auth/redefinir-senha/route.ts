import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";
import { hashPassword } from "@/lib/cliente-auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { token, senha, confirmarSenha } = await req.json();

    if (!token?.trim()) {
      return NextResponse.json(
        { error: "Token de recuperação inválido ou ausente" },
        { status: 400 }
      );
    }

    if (!senha || senha.length < 8) {
      return NextResponse.json(
        { error: "A nova senha deve ter no mínimo 8 caracteres" },
        { status: 400 }
      );
    }

    if (senha !== confirmarSenha) {
      return NextResponse.json(
        { error: "As senhas não coincidem" },
        { status: 400 }
      );
    }

    if (!isAdminConfigured()) {
      return NextResponse.json(
        { error: "Banco de dados não configurado" },
        { status: 500 }
      );
    }

    const { data: usuario, error } = await supabaseAdmin!
      .from("usuarios")
      .select("id, email, reset_token, reset_token_expira")
      .eq("reset_token", token.trim())
      .single();

    if (error || !usuario) {
      return NextResponse.json(
        { error: "Link de recuperação inválido ou expirado. Solicite um novo." },
        { status: 400 }
      );
    }

    if (usuario.reset_token_expira && new Date() > new Date(usuario.reset_token_expira)) {
      return NextResponse.json(
        { error: "Este link de recuperação expirou. Por favor, solicite um novo." },
        { status: 400 }
      );
    }

    const novaSenhaHash = hashPassword(senha);

    await supabaseAdmin!
      .from("usuarios")
      .update({
        senha_hash: novaSenhaHash,
        reset_token: null,
        reset_token_expira: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", usuario.id);

    return NextResponse.json({
      success: true,
      message: "Senha atualizada com sucesso! Agora você já pode entrar com sua nova senha.",
    });
  } catch (error) {
    console.error("[auth/redefinir-senha] Erro:", error);
    return NextResponse.json(
      { error: "Erro ao redefinir a senha" },
      { status: 500 }
    );
  }
}
