import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";
import { checkAdminAuth } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAdminAuth(req))) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { id } = await params;

  const { data, error } = await supabaseAdmin!
    .from("produtos")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Produto não encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json(data);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAdminAuth(req))) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "Supabase não configurado" },
      { status: 500 }
    );
  }

  const { id } = await params;
  const body = await req.json();

  const updates: Record<string, unknown> = {};
  const allowedFields = [
    "slug", "nome", "descricao", "descricao_curta", "preco",
    "imagem_url", "beneficios", "destaque", "ativo", "ordem", "vagas_maximas", "categoria", "forma_pagamento_disponivel",
  ];

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updates[field] = body[field];
    }
  }

  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabaseAdmin!
    .from("produtos")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[admin/produtos] Erro ao atualizar:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar produto" },
      { status: 500 }
    );
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
    return NextResponse.json(
      { error: "Supabase não configurado" },
      { status: 500 }
    );
  }

  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const permanent = searchParams.get("permanent") === "true";

  if (permanent) {
    const { count } = await supabaseAdmin!
      .from("pedidos")
      .select("*", { count: "exact", head: true })
      .eq("produto_id", id);

    if (count && count > 0) {
      return NextResponse.json(
        { error: `Não é possível apagar: este produto tem ${count} pedido(s) vinculado(s).` },
        { status: 409 }
      );
    }

    const { error } = await supabaseAdmin!
      .from("produtos")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("[admin/produtos] Erro ao apagar:", error);
      return NextResponse.json(
        { error: "Erro ao apagar produto" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, permanent: true });
  }

  const { error } = await supabaseAdmin!
    .from("produtos")
    .update({ ativo: false, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error("[admin/produtos] Erro ao desativar:", error);
    return NextResponse.json(
      { error: "Erro ao desativar produto" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
