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
    "imagem_url", "beneficios", "destaque", "ativo", "ordem", "vagas_maximas", "vagas_ocupadas_manual", "categoria", "forma_pagamento_disponivel", "atendimento_individual", "duracao_minutos",
    "is_teste", "rota_teste", "orientacoes_pre_teste", "inclui_laudo_pdf",
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

  if (updates.duracao_minutos !== undefined) {
    updates.duracao_minutos = parseIntegerSafely(updates.duracao_minutos);
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

  if (updates.atendimento_individual !== undefined) {
    updates.atendimento_individual = Boolean(updates.atendimento_individual);
  }

  if (updates.is_teste !== undefined) {
    updates.is_teste = Boolean(updates.is_teste);
  }

  if (updates.inclui_laudo_pdf !== undefined) {
    updates.inclui_laudo_pdf = Boolean(updates.inclui_laudo_pdf);
  }

  if (updates.rota_teste !== undefined) {
    updates.rota_teste = updates.rota_teste ? String(updates.rota_teste).trim() : null;
  }

  if (updates.orientacoes_pre_teste !== undefined) {
    updates.orientacoes_pre_teste = updates.orientacoes_pre_teste ? String(updates.orientacoes_pre_teste).trim() : null;
  }

  let { data, error } = await supabaseAdmin!
    .from("produtos")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error && (
    error.message?.includes("duracao_minutos") ||
    error.message?.includes("atendimento_individual") ||
    error.message?.includes("is_teste") ||
    error.message?.includes("rota_teste") ||
    error.message?.includes("orientacoes_pre_teste") ||
    error.message?.includes("inclui_laudo_pdf")
  )) {
    console.warn("[admin/produtos] Coluna nova não encontrada no banco ao atualizar. Tentando fallback defensivo.");
    if (error.message?.includes("duracao_minutos")) delete updates.duracao_minutos;
    if (error.message?.includes("atendimento_individual")) delete updates.atendimento_individual;
    if (error.message?.includes("is_teste")) delete updates.is_teste;
    if (error.message?.includes("rota_teste")) delete updates.rota_teste;
    if (error.message?.includes("orientacoes_pre_teste")) delete updates.orientacoes_pre_teste;
    if (error.message?.includes("inclui_laudo_pdf")) delete updates.inclui_laudo_pdf;
    const retry = await supabaseAdmin!
      .from("produtos")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    data = retry.data;
    error = retry.error;
  }

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
