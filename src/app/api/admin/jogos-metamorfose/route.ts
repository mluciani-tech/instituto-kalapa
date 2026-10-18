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
    leadsUnicos: 0,
    blocoA: 0,
    blocoB: 0,
    transicao: 0,
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
    const predominioParam = searchParams.get("predominio")?.trim().toLowerCase() || "todos";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const perPage = Math.max(1, parseInt(searchParams.get("perPage") || "20", 10));

    // 1. Totais globais
    let totais = totaisVazios;
    try {
      const { data: todos } = await supabaseAdmin!
        .from("avaliacoes_metamorfose")
        .select("id, email, telefone, predominio_bloco, pontuacoes");

      if (todos) {
        let blocoA = 0;
        let blocoB = 0;
        let transicao = 0;
        const emailsSet = new Set<string>();

        for (const r of todos) {
          if (r.email) emailsSet.add(String(r.email).toLowerCase().trim());
          const pts = (r.pontuacoes || {}) as { blocoA?: number; blocoB?: number };
          const pA = Number(pts.blocoA ?? 0);
          const pB = Number(pts.blocoB ?? 0);
          const pred = String(r.predominio_bloco || "").toLowerCase();

          if (pA >= 3 || pred.includes("bloco a")) {
            blocoA += 1;
          } else if (pB >= 3 || pred.includes("bloco b")) {
            blocoB += 1;
          } else {
            transicao += 1;
          }
        }

        totais = {
          total: todos.length,
          leadsUnicos: emailsSet.size,
          blocoA,
          blocoB,
          transicao,
          comTelefone: todos.filter(
            (r) => r.telefone && String(r.telefone).trim().length >= 8
          ).length,
        };
      }
    } catch (err) {
      console.warn("Aviso ao buscar métricas de Jogos (avaliacoes_metamorfose):", err);
    }

    // 2. Consulta filtrada e paginada
    let query = supabaseAdmin!
      .from("avaliacoes_metamorfose")
      .select("*", { count: "exact" });

    if (predominioParam === "bloco_a") {
      query = query.ilike("predominio_bloco", "%Bloco A%");
    } else if (predominioParam === "bloco_b") {
      query = query.ilike("predominio_bloco", "%Bloco B%");
    } else if (predominioParam === "transicao") {
      query = query.ilike("predominio_bloco", "%Equilíbrio%");
    }

    if (search) {
      query = query.or(
        `nome.ilike.%${search}%,email.ilike.%${search}%,telefone.ilike.%${search}%,tema_escolhido.ilike.%${search}%`
      );
    }

    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    const { data: avaliacoes, count, error } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Erro ao listar partidas de Metamorfose no admin:", error);
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
    console.error("Exceção na rota GET /api/admin/jogos-metamorfose:", err);
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
      .from("avaliacoes_metamorfose")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Erro ao excluir partida de Metamorfose:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("Exceção na rota DELETE /api/admin/jogos-metamorfose:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
