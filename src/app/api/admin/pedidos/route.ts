import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";
import { checkAdminAuth } from "@/lib/admin-auth";

const DEFAULT_PER_PAGE = 20;
const ALLOWED_SORT_PEDIDOS = ["cliente_nome", "cliente_email", "valor", "status", "order_nsu", "created_at"];

export async function GET(req: NextRequest) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "Banco não configurado (service_role key ausente)" },
      { status: 500 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1") || 1);
    const perPage = Math.min(100, Math.max(1, parseInt(searchParams.get("perPage") || String(DEFAULT_PER_PAGE)) || DEFAULT_PER_PAGE));
    const search = searchParams.get("search")?.trim() || "";
    const sortKey = searchParams.get("sort") || "created_at";
    const sortDir = (searchParams.get("dir") || "desc").toLowerCase() === "asc" ? "asc" : "desc";

    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    let query = supabaseAdmin!
      .from("pedidos")
      .select(`
        *,
        produtos (nome, slug)
      `, { count: "exact" });

    if (search) {
      query = query.or(`cliente_nome.ilike.%${search}%,cliente_email.ilike.%${search}%,order_nsu.ilike.%${search}%`);
    }

    const sortColumn = ALLOWED_SORT_PEDIDOS.includes(sortKey) ? sortKey : "created_at";
    query = query.order(sortColumn, { ascending: sortDir === "asc" }).range(from, to);

    const { data, error, count } = await query;

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
  } catch (error) {
    console.error("[admin/pedidos] Erro:", error);
    return NextResponse.json(
      { error: "Erro ao buscar pedidos" },
      { status: 500 }
    );
  }
}