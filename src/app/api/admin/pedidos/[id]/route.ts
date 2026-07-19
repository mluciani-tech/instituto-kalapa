import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";
import { checkAdminAuth } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

// PATCH: editar dados do cliente no pedido
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
  const fieldMap: Record<string, string> = {
    nome: "cliente_nome",
    email: "cliente_email",
    telefone: "cliente_telefone",
    status: "status",
  };

  for (const [input, column] of Object.entries(fieldMap)) {
    if (body[input] !== undefined && typeof body[input] === "string" && body[input].trim()) {
      updates[column] = body[input].trim();
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

  return NextResponse.json(data);
}
