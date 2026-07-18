import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";
import { verifySessionToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

function checkAuth(req: NextRequest) {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/admin_session=([^;]+)/);
  if (!match) return false;
  return verifySessionToken(match[1]);
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
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
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "Supabase não configurado" },
      { status: 500 }
    );
  }

  const body = await req.json();
  const { slug, nome, descricao, descricao_curta, preco, imagem_url, beneficios, destaque, ativo, ordem, vagas_maximas } = body;

  if (!slug || !nome || preco === undefined) {
    return NextResponse.json(
      { error: "slug, nome e preco são obrigatórios" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin!
    .from("produtos")
    .insert({
      slug,
      nome,
      descricao: descricao || null,
      descricao_curta: descricao_curta || null,
      preco,
      imagem_url: imagem_url || null,
      beneficios: beneficios || [],
      destaque: destaque || false,
      ativo: ativo !== false,
      ordem: ordem || 0,
      vagas_maximas: vagas_maximas != null ? Number(vagas_maximas) : null,
    })
    .select()
    .single();

  if (error) {
    console.error("[admin/produtos] Erro ao criar:", error);
    return NextResponse.json(
      { error: "Erro ao criar produto", details: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data, { status: 201 });
}
