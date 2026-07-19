import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";
import { checkAdminAuth } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

// PATCH: editar dados do participante + sincronizar pedido vinculado
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAdminAuth(req))) {
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
  const pedidoSync: Record<string, unknown> = {};
  const fieldMap: Record<string, string> = {
    nome: "nome",
    email: "email",
    telefone: "telefone",
    status: "status",
  };
  const pedidoFieldMap: Record<string, string> = {
    nome: "cliente_nome",
    email: "cliente_email",
    telefone: "cliente_telefone",
    status: "status",
  };

  for (const [input, column] of Object.entries(fieldMap)) {
    if (body[input] !== undefined && typeof body[input] === "string" && body[input].trim()) {
      const val = body[input].trim();
      updates[column] = val;
      if (pedidoFieldMap[input]) {
        pedidoSync[pedidoFieldMap[input]] = val;
      }
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "Nenhum campo válido para atualizar" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin!
    .from("inscricoes")
    .update(updates)
    .eq("id", id)
    .select("pedido_id")
    .single();

  if (error) {
    console.error("[admin/participantes] Erro ao atualizar:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar participante" },
      { status: 500 }
    );
  }

  // Sincronizar pedido vinculado
  if (data?.pedido_id && Object.keys(pedidoSync).length > 0) {
    pedidoSync.updated_at = new Date().toISOString();
    const { error: syncError } = await supabaseAdmin!
      .from("pedidos")
      .update(pedidoSync)
      .eq("id", data.pedido_id);

    if (syncError) {
      console.warn("[admin/participantes] Erro ao sincronizar pedido:", syncError);
    }
  }

  return NextResponse.json(data);
}
