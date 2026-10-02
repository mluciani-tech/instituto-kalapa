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
      { avaliacoes: [], total: 0, totalGeral: 0, totaisPorTipo: { total: 0, yang: 0, yin: 0, comTelefone: 0 } },
      { status: 200 }
    );
  }

  try {
    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get("search")?.trim() || "";
    const tipo = searchParams.get("tipo")?.trim() || "todos";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const perPage = Math.max(1, parseInt(searchParams.get("perPage") || "25", 10));

    // 1. Estatísticas globais agregadas
    let totaisPorTipo = { total: 0, yang: 0, yin: 0, comTelefone: 0 };
    try {
      const { data: todosRegistros } = await supabaseAdmin!
        .from("avaliacoes_yin_yang")
        .select("id, tipo_resultado, telefone");

      if (todosRegistros) {
        totaisPorTipo = {
          total: todosRegistros.length,
          yang: todosRegistros.filter((r) => r.tipo_resultado === "yang").length,
          yin: todosRegistros.filter((r) => r.tipo_resultado === "yin").length,
          comTelefone: todosRegistros.filter((r) => r.telefone && r.telefone.trim().length >= 8).length,
        };
      }
    } catch (err) {
      console.warn("Aviso ao buscar métricas globais de avaliações (tabela pode estar vazia ou pendente de migration):", err);
    }

    // 2. Consulta filtrada e paginada
    let query = supabaseAdmin!
      .from("avaliacoes_yin_yang")
      .select("*", { count: "exact" });

    if (tipo === "yang" || tipo === "yin") {
      query = query.eq("tipo_resultado", tipo);
    }

    if (search) {
      query = query.or(
        `nome.ilike.%${search}%,email.ilike.%${search}%,telefone.ilike.%${search}%`
      );
    }

    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    const { data: avaliacoes, count, error } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Erro ao listar avaliações no admin:", error);
      return NextResponse.json({
        avaliacoes: [],
        total: 0,
        totalGeral: totaisPorTipo.total,
        totaisPorTipo,
        page,
        totalPages: 1,
      });
    }

    const total = count ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / perPage));

    return NextResponse.json({
      avaliacoes: avaliacoes || [],
      total,
      totalGeral: totaisPorTipo.total,
      totaisPorTipo,
      page,
      totalPages,
    });
  } catch (err: unknown) {
    console.error("Exceção na rota GET /api/admin/avaliacoes-yin-yang:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro ao carregar avaliações" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await checkAdminAuth(req))) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "Supabase não configurado" }, { status: 500 });
  }

  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
    }

    const { error } = await supabaseAdmin!
      .from("avaliacoes_yin_yang")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro interno" },
      { status: 500 }
    );
  }
}
