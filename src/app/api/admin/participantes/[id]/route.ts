import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";
import { checkAdminAuth } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

// PATCH: editar dados de contato do participante
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
  const allowedFields = ["nome", "email", "telefone", "status"];

  for (const field of allowedFields) {
    if (body[field] !== undefined && typeof body[field] === "string" && body[field].trim()) {
      updates[field] = body[field].trim();
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
    .select()
    .single();

  if (error) {
    console.error("[admin/participantes] Erro ao atualizar:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar participante" },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}
