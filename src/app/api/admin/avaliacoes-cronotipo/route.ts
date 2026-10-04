import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";
import { checkAdminAuth } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!(await checkAdminAuth(req))) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const totaisVazios = {
    total: 0,
    porCronotipo: {
      matutino: 0,
      intermediario: 0,
      vespertino: 0,
    } as Record<string, number>,
    comTelefone: 0,
  };

  if (!isAdminConfigured()) {
    return NextResponse.json(
      { avaliacoes: [], total: 0, totalGeral: 0, totais: totaisVazios },
      { status: 200 }
    );
  }

  try {
    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get("search")?.trim() || "";
    const cronotipoParam = searchParams.get("cronotipo")?.trim().toLowerCase() || "todos";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const perPage = Math.max(1, parseInt(searchParams.get("perPage") || "25", 10));

    // 1. Totais globais
    let totais = totaisVazios;
    try {
      const { data: todos } = await supabaseAdmin!
        .from("avaliacoes_cronotipo")
        .select("id, cronotipo, telefone");

      if (todos) {
        const porCronotipo: Record<string, number> = {
          matutino: 0,
          intermediario: 0,
          vespertino: 0,
        };
        for (const r of todos) {
          const c = String(r.cronotipo || "").toLowerCase();
          if (c in porCronotipo) porCronotipo[c] += 1;
        }
        totais = {
          total: todos.length,
          porCronotipo,
          comTelefone: todos.filter(
            (r) => r.telefone && r.telefone.trim().length >= 8
          ).length,
        };
      }
    } catch (err) {
      console.warn("Aviso ao buscar métricas do Cronotipo (migration pendente?):", err);
    }

    // 2. Consulta filtrada e paginada
    let query = supabaseAdmin!.from("avaliacoes_cronotipo").select("*", { count: "exact" });

    if (cronotipoParam && cronotipoParam !== "todos") {
      query = query.eq("cronotipo", cronotipoParam);
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
      console.error("Erro ao listar avaliações do Cronotipo no admin:", error);
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

    const totalRegistros = count || 0;
    const totalPages = Math.max(1, Math.ceil(totalRegistros / perPage));

    return NextResponse.json({
      avaliacoes: avaliacoes || [],
      total: totalRegistros,
      totalGeral: totais.total,
      totais,
      page,
      totalPages,
    });
  } catch (err: unknown) {
    console.error("Exceção na rota GET /api/admin/avaliacoes-cronotipo:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await checkAdminAuth(req))) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "Banco de dados não configurado" }, { status: 500 });
  }

  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });
    }

    const { error } = await supabaseAdmin!
      .from("avaliacoes_cronotipo")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Erro ao excluir avaliação do Cronotipo:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("Exceção na rota DELETE /api/admin/avaliacoes-cronotipo:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
