import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";
import { checkAdminAuth } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!(await checkAdminAuth(req))) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "Supabase não configurado" }, { status: 500 });
  }

  try {
    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get("search")?.trim() || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const perPage = parseInt(searchParams.get("perPage") || "20", 10);

    let query = supabaseAdmin!
      .from("usuarios")
      .select("id, nome, email, telefone, cpf, cep, rua, numero, complemento, bairro, cidade, uf, ativo, created_at, updated_at", { count: "exact" });

    if (search) {
      query = query.or(
        `nome.ilike.%${search}%,email.ilike.%${search}%,cpf.ilike.%${search}%,telefone.ilike.%${search}%`
      );
    }

    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    const { data: usuarios, count, error } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("[admin/usuarios] Erro:", error);
      return NextResponse.json({ error: "Erro ao buscar usuários" }, { status: 500 });
    }

    // Contar pedidos para cada usuário retornado
    const usuariosComContagem = await Promise.all(
      (usuarios || []).map(async (u) => {
        const { count: totalPedidos } = await supabaseAdmin!
          .from("pedidos")
          .select("id", { count: "exact", head: true })
          .eq("usuario_id", u.id);

        return {
          ...u,
          total_pedidos: totalPedidos || 0,
        };
      })
    );

    const total = count || 0;
    const totalPages = Math.ceil(total / perPage);

    return NextResponse.json({
      data: usuariosComContagem,
      total,
      page,
      perPage,
      totalPages,
    });
  } catch (err) {
    console.error("[admin/usuarios] Erro inesperado:", err);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
