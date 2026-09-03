import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";
import { checkAdminAuth } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAdminAuth(req))) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "Supabase não configurado" }, { status: 500 });
  }

  const { id } = await params;
  const body = await req.json();

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (body.codigo !== undefined) updateData.codigo = body.codigo.trim().toUpperCase();
  if (body.tipo !== undefined) updateData.tipo = body.tipo;
  if (body.valor !== undefined) updateData.valor = Number(body.valor);
  if (body.quantidade_maxima !== undefined) {
    updateData.quantidade_maxima = body.quantidade_maxima ? Number(body.quantidade_maxima) : null;
  }
  if (body.valor_minimo_pedido !== undefined) {
    updateData.valor_minimo_pedido = Number(body.valor_minimo_pedido);
  }
  if (body.validade !== undefined) {
    updateData.validade = body.validade ? new Date(body.validade).toISOString() : null;
  }
  if (body.ativo !== undefined) updateData.ativo = Boolean(body.ativo);

  const { data, error } = await supabaseAdmin!
    .from("cupons")
    .update(updateData)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    console.error("[admin/cupons/[id]] Erro ao atualizar cupom:", error);
    return NextResponse.json({ error: "Erro ao atualizar cupom" }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAdminAuth(req))) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "Supabase não configurado" }, { status: 500 });
  }

  const { id } = await params;

  const { error } = await supabaseAdmin!
    .from("cupons")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("[admin/cupons/[id]] Erro ao excluir cupom:", error);
    return NextResponse.json({ error: "Erro ao excluir cupom" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
