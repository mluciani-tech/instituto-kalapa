import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";
import { checkAdminAuth } from "@/lib/admin-auth";
import { hashPassword } from "@/lib/cliente-auth";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAdminAuth(req))) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "Supabase não configurado" }, { status: 500 });
  }

  const { id } = await params;

  const { data: usuario, error: userError } = await supabaseAdmin!
    .from("usuarios")
    .select("id, nome, email, telefone, cpf, cep, rua, numero, complemento, bairro, cidade, uf, ativo, created_at, updated_at")
    .eq("id", id)
    .single();

  if (userError || !usuario) {
    return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
  }

  // Buscar pedidos do usuário
  const { data: pedidos } = await supabaseAdmin!
    .from("pedidos")
    .select("id, order_nsu, valor, status, metodo_pagamento, itens, created_at, receipt_url, produtos(nome)")
    .eq("usuario_id", id)
    .order("created_at", { ascending: false });

  return NextResponse.json({
    usuario,
    pedidos: pedidos || [],
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAdminAuth(req))) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "Supabase não configurado" }, { status: 500 });
  }

  const { id } = await params;
  const body = await req.json();

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (body.nome !== undefined) updateData.nome = body.nome.trim();
  if (body.email !== undefined) updateData.email = body.email.trim().toLowerCase();
  if (body.telefone !== undefined) updateData.telefone = body.telefone.replace(/\D/g, "");
  if (body.cpf !== undefined) updateData.cpf = body.cpf.replace(/\D/g, "");
  if (body.cep !== undefined) updateData.cep = body.cep.replace(/\D/g, "");
  if (body.rua !== undefined) updateData.rua = body.rua.trim();
  if (body.numero !== undefined) updateData.numero = body.numero.trim();
  if (body.complemento !== undefined) updateData.complemento = body.complemento?.trim() || null;
  if (body.bairro !== undefined) updateData.bairro = body.bairro.trim();
  if (body.cidade !== undefined) updateData.cidade = body.cidade.trim();
  if (body.uf !== undefined) updateData.uf = body.uf.trim().toUpperCase().slice(0, 2);
  if (body.ativo !== undefined) updateData.ativo = Boolean(body.ativo);

  // Reset de senha diretamente pelo Admin
  if (body.nova_senha) {
    if (body.nova_senha.length < 6) {
      return NextResponse.json(
        { error: "A nova senha deve ter no mínimo 6 caracteres" },
        { status: 400 }
      );
    }
    updateData.senha_hash = hashPassword(body.nova_senha);
    updateData.reset_token = null;
    updateData.reset_token_expira = null;
  }

  const { data, error } = await supabaseAdmin!
    .from("usuarios")
    .update(updateData)
    .eq("id", id)
    .select("id, nome, email, telefone, cpf, cep, rua, numero, complemento, bairro, cidade, uf, ativo, updated_at")
    .single();

  if (error) {
    console.error("[admin/usuarios/[id]] Erro ao atualizar usuário:", error);
    return NextResponse.json({ error: "Erro ao atualizar usuário" }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAdminAuth(req))) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "Supabase não configurado" }, { status: 500 });
  }

  const { id } = await params;

  // Ao deletar o usuário, a integridade referencial com pedidos manterá os pedidos preservados
  // (usuario_id vira NULL devido a ON DELETE SET NULL)
  const { error } = await supabaseAdmin!
    .from("usuarios")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("[admin/usuarios/[id]] Erro ao excluir usuário:", error);
    return NextResponse.json({ error: "Erro ao excluir usuário" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
