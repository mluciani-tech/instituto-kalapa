import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";
import { checkAdminAuth } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!(await checkAdminAuth(req))) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const totaisVazios = { total: 0, porTipo: {} as Record<string, number>, comTelefone: 0 };

  if (!isAdminConfigured()) {
    return NextResponse.json({ avaliacoes: [], total: 0, totalGeral: 0, totais: totaisVazios }, { status: 200 });
  }

  try {
    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get("search")?.trim() || "";
    const tipoParam = searchParams.get("tipo")?.trim() || "todos";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const perPage = Math.max(1, parseInt(searchParams.get("perPage") || "25", 10));

    // 1. Estatísticas globais
    let totais = totaisVazios;
    try {
      const { data: todos } = await supabaseAdmin!
        .from("avaliacoes_eneagrama")
        .select("id, tipos_principais, telefone");

      if (todos) {
        const porTipo: Record<string, number> = {};
        for (let i = 1; i <= 9; i++) porTipo[String(i)] = 0;
        for (const r of todos) {
          const principal = r.tipos_principais?.[0];
          if (principal >= 1 && principal <= 9) porTipo[String(principal)] += 1;
        }
        totais = {
          total: todos.length,
          porTipo,
          comTelefone: todos.filter((r) => r.telefone && r.telefone.trim().length >= 8).length,
        };
      }
    } catch (err) {
      console.warn("Aviso ao buscar métricas do Eneagrama (migration pendente?):", err);
    }

    // 2. Consulta filtrada e paginada
    let query = supabaseAdmin!.from("avaliacoes_eneagrama").select("*", { count: "exact" });

    const tipoNum = Number(tipoParam);
    if (Number.isInteger(tipoNum) && tipoNum >= 1 && tipoNum <= 9) {
      // Inclui avaliações em que o tipo aparece entre os principais (cobre empates)
      query = query.contains("tipos_principais", [tipoNum]);
    }

    if (search) {
      query = query.or(`nome.ilike.%${search}%,email.ilike.%${search}%,telefone.ilike.%${search}%`);
    }

    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    const { data: avaliacoes, count, error } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Erro ao listar avaliações do Eneagrama no admin:", error);
      return NextResponse.json({
        avaliacoes: [],
        total: 0,
        totalGeral: totais.total,
        totais,
        page,
        totalPages: 1,
        erro: error.message,
      });
    }

    const total = count ?? 0;
    return NextResponse.json({
      avaliacoes: avaliacoes || [],
      total,
      totalGeral: totais.total,
      totais,
      page,
      totalPages: Math.max(1, Math.ceil(total / perPage)),
    });
  } catch (err: unknown) {
    console.error("Exceção na rota GET /api/admin/avaliacoes-eneagrama:", err);
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

    const { error } = await supabaseAdmin!.from("avaliacoes_eneagrama").delete().eq("id", id);

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
