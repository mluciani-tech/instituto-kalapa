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
    "imagem_url", "beneficios", "destaque", "ativo", "ordem", "vagas_maximas", "vagas_ocupadas_manual", "categoria", "forma_pagamento_disponivel",
  ];

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updates[field] = body[field];
    }
  }

  const parseIntegerSafely = (val: unknown): number | null => {
    if (val === null || val === undefined || val === "") return null;
    if (typeof val === "number") return isNaN(val) ? null : Math.round(val);
    if (typeof val === "string") {
      const match = val.trim().match(/^(\d+)/);
      return match ? parseInt(match[1], 10) : null;
    }
    return null;
  };

  if (updates.vagas_maximas !== undefined) {
    updates.vagas_maximas = parseIntegerSafely(updates.vagas_maximas);
  }

  if (updates.vagas_ocupadas_manual !== undefined) {
    updates.vagas_ocupadas_manual = parseIntegerSafely(updates.vagas_ocupadas_manual);

    if (updates.vagas_ocupadas_manual !== null) {
      const { data: currentProduct, error: fetchErr } = await supabaseAdmin!
        .from("produtos")
        .select("vagas_ocupadas_manual")
        .eq("id", id)
        .single();

      if (!fetchErr && currentProduct && currentProduct.vagas_ocupadas_manual != null) {
        if ((updates.vagas_ocupadas_manual as number) < currentProduct.vagas_ocupadas_manual) {
          return NextResponse.json(
            {
              error: `O valor do contador (${updates.vagas_ocupadas_manual}) não pode ser menor do que o já existente no banco de dados (${currentProduct.vagas_ocupadas_manual}).`,
            },
            { status: 400 }
          );
        }
      }
    }
  }

  if (updates.slug && typeof updates.slug === "string") {
    updates.slug = updates.slug
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabaseAdmin!
    .from("produtos")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[admin/produtos] Erro ao atualizar:", JSON.stringify(error, null, 2));
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
