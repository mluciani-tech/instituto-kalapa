import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";
import { hashPassword, createClienteSessionToken, setClienteSessionCookie } from "@/lib/cliente-auth";

export const dynamic = "force-dynamic";

function sanitizeCpf(cpf: string): string {
  return (cpf || "").replace(/\D/g, "");
}

function sanitizePhone(phone: string): string {
  return (phone || "").replace(/\D/g, "");
}

export async function POST(req: NextRequest) {
  try {
    if (!isAdminConfigured()) {
      return NextResponse.json(
        { error: "Banco de dados não configurado" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const {
      nome,
      email,
      telefone,
      cpf,
      senha,
      confirmarSenha,
      cep,
      rua,
      numero,
      complemento,
      bairro,
      cidade,
      uf,
    } = body;

    // Validações obrigatórias
    if (!nome?.trim()) {
      return NextResponse.json({ error: "Nome completo é obrigatório" }, { status: 400 });
    }
    if (!email?.trim() || !email.includes("@")) {
      return NextResponse.json({ error: "E-mail válido é obrigatório" }, { status: 400 });
    }
    const cleanPhone = sanitizePhone(telefone);
    if (cleanPhone.length < 10) {
      return NextResponse.json({ error: "Telefone / WhatsApp com DDD é obrigatório" }, { status: 400 });
    }
    const cleanCpf = sanitizeCpf(cpf);
    if (cleanCpf.length !== 11) {
      return NextResponse.json({ error: "CPF válido (11 dígitos) é obrigatório" }, { status: 400 });
    }
    if (!senha || senha.length < 8) {
      return NextResponse.json({ error: "A senha deve conter no mínimo 8 caracteres" }, { status: 400 });
    }
    if (senha !== confirmarSenha) {
      return NextResponse.json({ error: "As senhas não coincidem" }, { status: 400 });
    }
    if (!cep?.trim() || sanitizePhone(cep).length < 8) {
      return NextResponse.json({ error: "CEP válido é obrigatório" }, { status: 400 });
    }
    if (!rua?.trim() || !numero?.trim() || !bairro?.trim() || !cidade?.trim() || !uf?.trim()) {
      return NextResponse.json({ error: "Preencha todos os campos obrigatórios do endereço" }, { status: 400 });
    }

    const emailNorm = email.trim().toLowerCase();

    // Checar se e-mail já existe
    const { data: userExistEmail } = await supabaseAdmin!
      .from("usuarios")
      .select("id")
      .eq("email", emailNorm)
      .single();

    if (userExistEmail) {
      return NextResponse.json(
        { error: "Este e-mail já está cadastrado. Faça login ou use outro e-mail." },
        { status: 409 }
      );
    }

    // Checar se CPF já existe
    const { data: userExistCpf } = await supabaseAdmin!
      .from("usuarios")
      .select("id")
      .eq("cpf", cleanCpf)
      .single();

    if (userExistCpf) {
      return NextResponse.json(
        { error: "Este CPF já está cadastrado no sistema." },
        { status: 409 }
      );
    }

    const senhaHash = hashPassword(senha);

    const { data: novoUsuario, error: insertError } = await supabaseAdmin!
      .from("usuarios")
      .insert({
        nome: nome.trim(),
        email: emailNorm,
        telefone: cleanPhone,
        cpf: cleanCpf,
        senha_hash: senhaHash,
        cep: sanitizePhone(cep),
        rua: rua.trim(),
        numero: numero.trim(),
        complemento: complemento?.trim() || null,
        bairro: bairro.trim(),
        cidade: cidade.trim(),
        uf: uf.trim().toUpperCase().slice(0, 2),
        ativo: true,
      })
      .select("id, nome, email, telefone, cpf, cep, rua, numero, complemento, bairro, cidade, uf, created_at")
      .single();

    if (insertError || !novoUsuario) {
      console.error("[auth/cadastro] Erro ao cadastrar usuário:", insertError);
      return NextResponse.json(
        { error: "Não foi possível realizar o cadastro. Tente novamente mais tarde." },
        { status: 500 }
      );
    }

    // Gera token de sessão e seta cookie
    const token = createClienteSessionToken(novoUsuario.id, novoUsuario.email);
    const response = NextResponse.json({
      success: true,
      usuario: novoUsuario,
    });
    setClienteSessionCookie(response, token);

    return response;
  } catch (error) {
    console.error("[auth/cadastro] Erro inesperado:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor ao processar o cadastro" },
      { status: 500 }
    );
  }
}
