import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";
import { checkAdminAuth } from "@/lib/admin-auth";

interface InscricaoRow {
  id: string;
  turma_id: string;
  order_nsu?: string | null;
  nome: string;
  email: string;
  telefone: string;
  cpf?: string | null;
  motivacao?: string | null;
  metodo_pagamento?: string | null;
  valor: number;
  status: string;
  created_at: string;
  pedidos?: {
    id: string;
    cliente_nome?: string | null;
    cliente_telefone?: string | null;
    cliente_cpf?: string | null;
    cliente_documento?: string | null;
    usuario_id?: string | null;
    status?: string | null;
    produto_id?: string | null;
    produtos?: { id?: string; nome?: string; ativo?: boolean } | { id?: string; nome?: string; ativo?: boolean }[] | null;
  } | {
    id: string;
    cliente_nome?: string | null;
    cliente_telefone?: string | null;
    cliente_cpf?: string | null;
    cliente_documento?: string | null;
    usuario_id?: string | null;
    status?: string | null;
    produto_id?: string | null;
    produtos?: { id?: string; nome?: string; ativo?: boolean } | { id?: string; nome?: string; ativo?: boolean }[] | null;
  }[] | null;
}

const DEFAULT_PER_PAGE = 20;
const ALLOWED_SORT_PARTICIPANTES = ["nome", "email", "telefone", "turma_id", "metodo_pagamento", "created_at"];

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
    const produtoId = searchParams.get("produtoId")?.trim() || "";
    const produtoStatus = searchParams.get("produtoStatus")?.trim().toLowerCase() || "";
    const statusParam = searchParams.get("status")?.trim() || "";
    const isAll = searchParams.get("all") === "true";

    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    let filtrarPorIds: string[] | null = null;
    if (produtoStatus === "ativo" || produtoStatus === "ativos" || produtoStatus === "inativo" || produtoStatus === "inativos") {
      const apenasAtivos = produtoStatus.startsWith("ativ");
      const { data: prodsFiltro, error: prodsErr } = await supabaseAdmin!
        .from("produtos")
        .select("id")
        .eq("ativo", apenasAtivos);

      if (prodsErr) {
        console.error("[admin/participantes] Erro ao buscar produtos por status:", prodsErr);
      }
      filtrarPorIds = (prodsFiltro || []).map((p) => p.id);
    }

    const precisaJoinInner = (produtoId && produtoId !== "todos") || (filtrarPorIds !== null);
    const joinPrefix = precisaJoinInner ? "pedidos!inner!pedido_id" : "pedidos!pedido_id";
    const selectQuery = `
      *,
      ${joinPrefix} (
        id,
        cliente_nome,
        cliente_telefone,
        cliente_cpf,
        cliente_documento,
        usuario_id,
        status,
        produto_id,
        produtos (id, nome, ativo)
      )
    `;

    let query = supabaseAdmin!
      .from("inscricoes")
      .select(selectQuery, { count: "exact" });

    if (produtoId && produtoId !== "todos") {
      query = query.eq("pedidos.produto_id", produtoId);
    } else if (filtrarPorIds !== null) {
      if (filtrarPorIds.length === 0) {
        return NextResponse.json({
          data: [],
          total: 0,
          page: isAll ? 1 : page,
          perPage: isAll ? 0 : perPage,
          totalPages: 1,
        });
      }
      query = query.in("pedidos.produto_id", filtrarPorIds);
    }

    if (search) {
      const safe = search.replace(/[(),\\]/g, "");
      query = query.or(`nome.ilike.%${safe}%,email.ilike.%${safe}%,telefone.ilike.%${safe}%,turma_id.ilike.%${safe}%`);
    }

    const sortColumn = ALLOWED_SORT_PARTICIPANTES.includes(sortKey) ? sortKey : "created_at";
    query = query.order(sortColumn, { ascending: sortDir === "asc" });

    if (!isAll) {
      query = query.range(from, to);
    } else {
      query = query.limit(1000);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    const rows = (data as unknown as InscricaoRow[]) || [];

    // Buscar CPFs de usuários cadastrados caso não estejam salvos diretamente no pedido
    const missingCpfUsuarioIds = rows
      .map((inscricao) => {
        const pedido = Array.isArray(inscricao.pedidos) ? inscricao.pedidos[0] : inscricao.pedidos;
        return !pedido?.cliente_cpf && !pedido?.cliente_documento && pedido?.usuario_id ? (pedido.usuario_id as string) : null;
      })
      .filter((id): id is string => Boolean(id));

    const usuarioCpfMap: Record<string, string> = {};
    if (missingCpfUsuarioIds.length > 0) {
      const { data: usuariosData } = await supabaseAdmin!
        .from("usuarios")
        .select("id, cpf")
        .in("id", missingCpfUsuarioIds);

      if (usuariosData) {
        for (const u of (usuariosData as { id: string; cpf?: string | null }[])) {
          if (u.cpf) usuarioCpfMap[u.id] = u.cpf;
        }
      }
    }

    let normalizedData = rows.map((inscricao) => {
      const pedido = Array.isArray(inscricao.pedidos) ? inscricao.pedidos[0] : inscricao.pedidos;
      const inscricaoNome = typeof inscricao.nome === "string" ? inscricao.nome.trim() : "";
      const pedidoNome = pedido?.cliente_nome?.trim() || "";
      const nome = (inscricaoNome && !["participante", "n/a"].includes(inscricaoNome.toLowerCase())
        ? inscricao.nome
        : pedidoNome || inscricao.nome || "Participante");
      const telefone = inscricao.telefone?.trim() || pedido?.cliente_telefone?.trim() || "";
      
      const produtoObj = Array.isArray(pedido?.produtos) ? pedido.produtos[0] : pedido?.produtos;
      const produtoNome = produtoObj?.nome || "";
      const produtoAtivo = produtoObj?.ativo;
      const prodId = pedido?.produto_id || produtoObj?.id || null;

      const rawCpf = inscricao.cpf || pedido?.cliente_cpf || pedido?.cliente_documento || (pedido?.usuario_id ? usuarioCpfMap[pedido.usuario_id] : null) || null;
      const cpf = typeof rawCpf === "string" ? rawCpf.trim() : null;

      const statusPedido = pedido?.status || inscricao.status || "";
      return {
        ...inscricao,
        nome,
        telefone,
        cpf,
        produto: produtoNome,
        produto_ativo: produtoAtivo,
        produto_id: prodId,
        status: statusPedido,
        pedidos: undefined,
      };
    });

    if (statusParam && statusParam !== "todos") {
      if (statusParam === "pago" || statusParam === "confirmados") {
        normalizedData = normalizedData.filter((p) =>
          ["pago", "confirmado", "confirmada"].includes((p.status || "").toLowerCase())
        );
      } else {
        normalizedData = normalizedData.filter(
          (p) => (p.status || "").toLowerCase() === statusParam.toLowerCase()
        );
      }
    }

    const total = isAll ? normalizedData.length : (count || 0);

    return NextResponse.json({
      data: normalizedData,
      total,
      page: isAll ? 1 : page,
      perPage: isAll ? normalizedData.length : perPage,
      totalPages: isAll ? 1 : Math.max(1, Math.ceil(total / perPage)),
    });
  } catch (error) {
    console.error("[admin/participantes] Erro:", error);
    return NextResponse.json(
      { error: "Erro ao buscar participantes" },
      { status: 500 }
    );
  }
}