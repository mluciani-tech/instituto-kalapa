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

  const { data, error } = await supabaseAdmin!
    .from("cupons")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[admin/cupons] Erro:", error);
    return NextResponse.json({ error: "Erro ao buscar cupons" }, { status: 500 });
  }

  return NextResponse.json(data || []);
}

export async function POST(req: NextRequest) {
  if (!(await checkAdminAuth(req))) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "Supabase não configurado" }, { status: 500 });
  }

  try {
    const body = await req.json();
    const {
      codigo,
      tipo,
      valor,
      quantidade_maxima,
      valor_minimo_pedido,
      validade,
      ativo,
    } = body;

    if (!codigo?.trim()) {
      return NextResponse.json({ error: "Código do cupom é obrigatório" }, { status: 400 });
    }

    if (valor == null || isNaN(Number(valor)) || Number(valor) <= 0) {
      return NextResponse.json({ error: "Valor do desconto deve ser maior que zero" }, { status: 400 });
    }

    const codigoNorm = codigo.trim().toUpperCase();

    // Checar se já existe código duplicado
    const { data: existente } = await supabaseAdmin!
      .from("cupons")
      .select("id")
      .eq("codigo", codigoNorm)
      .single();

    if (existente) {
      return NextResponse.json({ error: "Já existe um cupom com este código" }, { status: 409 });
    }

    const { data, error } = await supabaseAdmin!
      .from("cupons")
      .insert({
        codigo: codigoNorm,
        tipo: tipo === "fixo" ? "fixo" : "porcentagem",
        valor: Number(valor),
        quantidade_maxima: quantidade_maxima ? Number(quantidade_maxima) : null,
        valor_minimo_pedido: valor_minimo_pedido ? Number(valor_minimo_pedido) : 0,
        validade: validade ? new Date(validade).toISOString() : null,
        ativo: ativo ?? true,
      })
      .select("*")
      .single();

    if (error) {
      console.error("[admin/cupons] Erro ao criar cupom:", error);
      return NextResponse.json({ error: "Erro ao criar cupom" }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("[admin/cupons] Erro inesperado:", err);
    return NextResponse.json({ error: "Erro interno ao processar requisição" }, { status: 500 });
  }
}
