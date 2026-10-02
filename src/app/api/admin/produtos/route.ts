import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";
import { checkAdminAuth } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!(await checkAdminAuth(req))) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "Supabase não configurado" },
      { status: 500 }
    );
  }

  const { data, error } = await supabaseAdmin!
    .from("produtos")
    .select("*")
    .order("ordem", { ascending: true });

  if (error) {
    console.error("[admin/produtos] Erro:", error);
    return NextResponse.json(
      { error: "Erro ao buscar produtos" },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  if (!(await checkAdminAuth(req))) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "Supabase não configurado" },
      { status: 500 }
    );
  }

  const body = await req.json();
  const {
    slug,
    nome,
    descricao,
    descricao_curta,
    preco,
    imagem_url,
    beneficios,
    destaque,
    ativo,
    ordem,
    vagas_maximas,
    vagas_ocupadas_manual,
    categoria,
    forma_pagamento_disponivel,
    atendimento_individual,
    duracao_minutos,
  } = body;

  const cleanSlug = typeof slug === "string"
    ? slug
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
    : "";

  if (!cleanSlug || !nome) {
    return NextResponse.json(
      { error: "slug e nome são obrigatórios" },
      { status: 400 }
    );
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

  const parsedDuracao = parseIntegerSafely(duracao_minutos);

  const insertPayload: Record<string, unknown> = {
    slug: cleanSlug,
    nome,
    descricao: descricao || null,
    descricao_curta: descricao_curta || null,
    preco,
    imagem_url: imagem_url || null,
    beneficios: beneficios || [],
    destaque: destaque || false,
    ativo: ativo !== false,
    ordem: ordem || 0,
    vagas_maximas: parseIntegerSafely(vagas_maximas),
    vagas_ocupadas_manual: parseIntegerSafely(vagas_ocupadas_manual),
    categoria: categoria || null,
    forma_pagamento_disponivel: forma_pagamento_disponivel || "ambos",
    atendimento_individual: Boolean(atendimento_individual),
    duracao_minutos: parsedDuracao !== null ? parsedDuracao : (Boolean(atendimento_individual) ? 90 : null),
  };

  let { data, error } = await supabaseAdmin!
    .from("produtos")
    .insert(insertPayload)
    .select()
    .single();

  // Se alguma coluna ainda não existir no Postgres, tenta fallback defensivo
  if (error && (error.message?.includes("duracao_minutos") || error.message?.includes("atendimento_individual"))) {
    console.warn("[admin/produtos] Coluna nova não encontrada no banco. Tentando fallback defensivo.");
    if (error.message?.includes("duracao_minutos")) delete insertPayload.duracao_minutos;
    if (error.message?.includes("atendimento_individual")) delete insertPayload.atendimento_individual;
    const retry = await supabaseAdmin!
      .from("produtos")
      .insert(insertPayload)
      .select()
      .single();
    data = retry.data;
    error = retry.error;
  }

  if (error) {
    console.error("[admin/produtos] Erro ao criar:", error);
    return NextResponse.json(
      { error: "Erro ao criar produto", details: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data, { status: 201 });
}
