import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";
import { checkAdminAuth } from "@/lib/admin-auth";

const DEFAULT_PER_PAGE = 20;
const ALLOWED_SORT_PEDIDOS = ["cliente_nome", "cliente_email", "valor", "status", "order_nsu", "created_at"];

export async function GET(req: NextRequest) {
  if (!(await checkAdminAuth(req))) {
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

    const produtoId = searchParams.get("produtoId")?.trim() || "";
    const produtoStatus = searchParams.get("produtoStatus")?.trim().toLowerCase() || "";

    // Se filtrar por status do produto e nenhum produto específico foi escolhido
    let filtrarPorIds: string[] | null = null;
    if (produtoStatus === "ativo" || produtoStatus === "ativos" || produtoStatus === "inativo" || produtoStatus === "inativos") {
      const apenasAtivos = produtoStatus.startsWith("ativ");
      const { data: prodsFiltro, error: prodsErr } = await supabaseAdmin!
        .from("produtos")
        .select("id")
        .eq("ativo", apenasAtivos);

      if (prodsErr) {
        console.error("[admin/pedidos] Erro ao buscar produtos por status:", prodsErr);
      }
      filtrarPorIds = (prodsFiltro || []).map((p) => p.id);
    }

    let query = supabaseAdmin!
      .from("pedidos")
      .select(`
        *,
        produtos (id, nome, slug, ativo),
        inscricoes!pedido_id (nome, telefone, motivacao)
      `, { count: "exact" });

    if (produtoId && produtoId !== "todos") {
      query = query.eq("produto_id", produtoId);
    } else if (filtrarPorIds !== null) {
      if (filtrarPorIds.length === 0) {
        // Nenhum produto com esse status, retorna vazio
        return NextResponse.json({
          data: [],
          total: 0,
          page,
          perPage,
          totalPages: 1,
        });
      }
      query = query.in("produto_id", filtrarPorIds);
    }

    if (search) {
      const safe = search.replace(/[(),\\]/g, "");
      query = query.or(`cliente_nome.ilike.%${safe}%,cliente_email.ilike.%${safe}%,order_nsu.ilike.%${safe}%`);
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

    const normalizedData = (data || []).map((pedido) => {
      const inscricao = Array.isArray(pedido.inscricoes) ? pedido.inscricoes[0] : pedido.inscricoes;
      const pedidoNome = typeof pedido.cliente_nome === "string" ? pedido.cliente_nome.trim() : "";
      const nomeInscricao = inscricao?.nome?.trim() || "";
      const nome = nomeInscricao || (pedidoNome && !["participante", "n/a"].includes(pedidoNome.toLowerCase()) ? pedido.cliente_nome : "");

      return {
        ...pedido,
        cliente_nome: nome || "Participante",
        cliente_telefone: inscricao?.telefone || null,
        motivacao: inscricao?.motivacao || null,
        inscricoes: undefined,
      };
    });

    return NextResponse.json({
      data: normalizedData,
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