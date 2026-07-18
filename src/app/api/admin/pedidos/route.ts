import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";
import { checkAdminAuth } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const DEFAULT_PER_PAGE = 20;

export async function GET(req: NextRequest) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "Supabase não configurado" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1") || 1);
  const perPage = Math.min(100, Math.max(1, parseInt(searchParams.get("perPage") || String(DEFAULT_PER_PAGE)) || DEFAULT_PER_PAGE));
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  const { data, error, count } = await supabaseAdmin!
    .from("pedidos")
    .select(`
      *,
      produtos (nome, slug)
    `, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("[admin/pedidos] Erro:", error);
    return NextResponse.json(
      { error: "Erro ao buscar pedidos" },
      { status: 500 }
    );
  }

  const total = count || 0;

  return NextResponse.json({
    data,
    total,
    page,
    perPage,
    totalPages: Math.max(1, Math.ceil(total / perPage)),
  });
}
