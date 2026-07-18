import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";
import { checkAdminAuth } from "@/lib/admin-auth";

const DEFAULT_PER_PAGE = 20;

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
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    const { data, error, count } = await supabaseAdmin!
      .from("inscricoes")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    const total = count || 0;

    return NextResponse.json({
      data,
      total,
      page,
      perPage,
      totalPages: Math.max(1, Math.ceil(total / perPage)),
    });
  } catch (error) {
    console.error("[admin/participantes] Erro:", error);
    return NextResponse.json(
      { error: "Erro ao buscar participantes" },
      { status: 500 }
    );
  }
}
