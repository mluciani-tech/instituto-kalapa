import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";
import { verifyPassword, createClienteSessionToken, setClienteSessionCookie } from "@/lib/cliente-auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    if (!isAdminConfigured()) {
      return NextResponse.json(
        { error: "Banco de dados não configurado" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { email, senha } = body;

    if (!email?.trim() || !senha) {
      return NextResponse.json(
        { error: "E-mail e senha são obrigatórios" },
        { status: 400 }
      );
    }

    const emailNorm = email.trim().toLowerCase();

    const { data: usuario, error } = await supabaseAdmin!
      .from("usuarios")
      .select("id, nome, email, telefone, cpf, senha_hash, cep, rua, numero, complemento, bairro, cidade, uf, ativo, created_at")
      .eq("email", emailNorm)
      .single();

    if (error || !usuario) {
      return NextResponse.json(
        { error: "E-mail ou senha incorretos" },
        { status: 401 }
      );
    }

    if (!usuario.ativo) {
      return NextResponse.json(
        { error: "Esta conta está desativada. Entre em contato com o suporte." },
        { status: 403 }
      );
    }

    const isValid = verifyPassword(senha, usuario.senha_hash);
    if (!isValid) {
      return NextResponse.json(
        { error: "E-mail ou senha incorretos" },
        { status: 401 }
      );
    }

    // Vincular retroativamente pedidos e inscrições anteriores deste e-mail que estavam sem usuario_id
    try {
      if (emailNorm !== "contato@institutokalapa.com.br") {
        await supabaseAdmin!
          .from("pedidos")
          .update({ usuario_id: usuario.id })
          .ilike("cliente_email", emailNorm)
          .is("usuario_id", null);

        await supabaseAdmin!
          .from("inscricoes")
          .update({ usuario_id: usuario.id })
          .ilike("email", emailNorm)
          .is("usuario_id", null);
      }
    } catch (linkErr) {
      console.warn("[auth/login] Erro ao vincular pedidos anteriores:", linkErr);
    }

    // Gerar token de sessão
    const token = createClienteSessionToken(usuario.id, usuario.email);

    // Remove hash do payload de resposta
    const { senha_hash: _, ...usuarioSemSenha } = usuario;

    const response = NextResponse.json({
      success: true,
      usuario: usuarioSemSenha,
    });

    setClienteSessionCookie(response, token);
    return response;
  } catch (error) {
    console.error("[auth/login] Erro no login:", error);
    return NextResponse.json(
      { error: "Erro interno ao processar o login" },
      { status: 500 }
    );
  }
}
