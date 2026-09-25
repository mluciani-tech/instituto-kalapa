import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";
import { getClienteFromRequest, hashPassword, verifyPassword } from "@/lib/cliente-auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const usuario = await getClienteFromRequest(req);
    if (!usuario) {
      return NextResponse.json(
        { error: "Sessão expirada ou não autenticada. Faça login novamente." },
        { status: 401 }
      );
    }

    if (!isAdminConfigured()) {
      return NextResponse.json(
        { error: "Banco de dados não configurado" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { senhaAtual, novaSenha, confirmarNovaSenha } = body;

    if (!senhaAtual) {
      return NextResponse.json(
        { error: "Por favor, digite sua senha atual" },
        { status: 400 }
      );
    }

    if (!novaSenha || novaSenha.length < 8) {
      return NextResponse.json(
        { error: "A nova senha deve ter no mínimo 8 caracteres" },
        { status: 400 }
      );
    }

    if (novaSenha !== confirmarNovaSenha) {
      return NextResponse.json(
        { error: "A confirmação de senha não coincide com a nova senha" },
        { status: 400 }
      );
    }

    if (senhaAtual === novaSenha) {
      return NextResponse.json(
        { error: "A nova senha deve ser diferente da senha atual" },
        { status: 400 }
      );
    }

    // Buscar a senha_hash atual armazenada
    const { data: dbUser, error: fetchError } = await supabaseAdmin!
      .from("usuarios")
      .select("id, senha_hash")
      .eq("id", usuario.id)
      .single();

    if (fetchError || !dbUser) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    const isValid = verifyPassword(senhaAtual, dbUser.senha_hash);
    if (!isValid) {
      return NextResponse.json(
        { error: "A senha atual digitada está incorreta" },
        { status: 400 }
      );
    }

    const novaSenhaHash = hashPassword(novaSenha);

    const { error: updateError } = await supabaseAdmin!
      .from("usuarios")
      .update({
        senha_hash: novaSenhaHash,
        reset_token: null,
        reset_token_expira: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", usuario.id);

    if (updateError) {
      console.error("[auth/alterar-senha] Erro ao atualizar senha:", updateError);
      return NextResponse.json(
        { error: "Erro ao atualizar senha no banco de dados" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Sua senha foi alterada com sucesso!",
    });
  } catch (error) {
    console.error("[auth/alterar-senha] Erro inesperado:", error);
    return NextResponse.json(
      { error: "Erro interno ao processar a alteração de senha" },
      { status: 500 }
    );
  }
}
