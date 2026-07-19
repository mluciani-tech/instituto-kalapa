import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";
import { checkAdminAuth } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

// PATCH: editar dados do cliente no pedido + sincronizar inscrição vinculada
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "Supabase não configurado" },
      { status: 500 }
    );
  }

  const { id } = await params;
  const body = await req.json();

  const updates: Record<string, unknown> = {};
  const inscSync: Record<string, unknown> = {};
  const fieldMap: Record<string, string> = {
    nome: "cliente_nome",
    email: "cliente_email",
    telefone: "cliente_telefone",
    status: "status",
  };
  const inscFieldMap: Record<string, string> = {
    nome: "nome",
    email: "email",
    telefone: "telefone",
    status: "status",
  };

  for (const [input, column] of Object.entries(fieldMap)) {
    if (body[input] !== undefined && typeof body[input] === "string" && body[input].trim()) {
      const val = body[input].trim();
      updates[column] = val;
      if (inscFieldMap[input]) {
        inscSync[inscFieldMap[input]] = val;
      }
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "Nenhum campo válido para atualizar" },
      { status: 400 }
    );
  }

  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabaseAdmin!
    .from("pedidos")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[admin/pedidos] Erro ao atualizar:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar pedido" },
      { status: 500 }
    );
  }

  // Sincronizar inscrição vinculada
  if (Object.keys(inscSync).length > 0) {
    const { error: syncError } = await supabaseAdmin!
      .from("inscricoes")
      .update(inscSync)
      .eq("pedido_id", id);

    if (syncError) {
      console.warn("[admin/pedidos] Erro ao sincronizar inscrição:", syncError);
    }
  }

  return NextResponse.json(data);
}

// DELETE: excluir pedido e inscrição vinculada
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "Supabase não configurado" },
      { status: 500 }
    );
  }

  const { id } = await params;

  try {
    // 1. Excluir inscrições vinculadas primeiro por causa da FK (Foreign Key) se houver
    const { error: errorInsc } = await supabaseAdmin!
      .from("inscricoes")
      .delete()
      .eq("pedido_id", id);

    if (errorInsc) {
      console.error("[admin/pedidos] Erro ao excluir inscrição vinculada:", errorInsc);
      return NextResponse.json(
        { error: "Erro ao excluir inscrição vinculada" },
        { status: 500 }
      );
    }

    // 2. Excluir o pedido em si
    const { error: errorPedido } = await supabaseAdmin!
      .from("pedidos")
      .delete()
      .eq("id", id);

    if (errorPedido) {
      console.error("[admin/pedidos] Erro ao excluir pedido:", errorPedido);
      return NextResponse.json(
        { error: "Erro ao excluir pedido" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[admin/pedidos] Erro inesperado ao excluir:", error);
    return NextResponse.json(
      { error: "Erro inesperado ao excluir pedido" },
      { status: 500 }
    );
  }
}

