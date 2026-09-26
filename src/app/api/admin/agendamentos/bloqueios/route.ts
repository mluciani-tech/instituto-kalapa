import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/admin-auth";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const DEFAULT_THERAPIST_ID = "e7f53a4e-1288-4e89-b051-5b7415444b01";

export async function GET(req: NextRequest) {
  try {
    const isAuthed = await checkAdminAuth(req);
    if (!isAuthed) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    if (!isAdminConfigured()) {
      return NextResponse.json({ blocks: [] });
    }

    const { searchParams } = new URL(req.url);
    const therapistId = searchParams.get("therapist_id") || DEFAULT_THERAPIST_ID;

    const { data: blocks, error } = await supabaseAdmin!
      .from("therapist_blocks")
      .select("*")
      .eq("therapist_id", therapistId)
      .order("start_time", { ascending: false });

    if (error) {
      console.error("[api/admin/agendamentos/bloqueios] Erro:", error);
      return NextResponse.json({ error: "Erro ao buscar bloqueios" }, { status: 500 });
    }

    return NextResponse.json({ blocks: blocks || [] });
  } catch (err) {
    console.error("[api/admin/agendamentos/bloqueios] Erro:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const isAuthed = await checkAdminAuth(req);
    if (!isAuthed) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    if (!isAdminConfigured()) {
      return NextResponse.json({ error: "Banco de dados não configurado" }, { status: 500 });
    }

    const body = await req.json();
    const { therapist_id, start_time, end_time, reason } = body;

    if (!start_time || !end_time) {
      return NextResponse.json(
        { error: "start_time e end_time são obrigatórios" },
        { status: 400 }
      );
    }

    const therapistId = therapist_id || DEFAULT_THERAPIST_ID;

    const { data: block, error } = await supabaseAdmin!
      .from("therapist_blocks")
      .insert({
        therapist_id: therapistId,
        start_time: new Date(start_time).toISOString(),
        end_time: new Date(end_time).toISOString(),
        reason: reason || "Bloqueio de agenda",
      })
      .select("*")
      .single();

    if (error || !block) {
      console.error("[api/admin/agendamentos/bloqueios] Erro ao criar bloqueio:", error);
      return NextResponse.json({ error: "Falha ao criar bloqueio" }, { status: 500 });
    }

    return NextResponse.json({ success: true, block });
  } catch (err) {
    console.error("[api/admin/agendamentos/bloqueios] Erro:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const isAuthed = await checkAdminAuth(req);
    if (!isAuthed) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    if (!isAdminConfigured()) {
      return NextResponse.json({ error: "Banco de dados não configurado" }, { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Parâmetro 'id' é obrigatório" }, { status: 400 });
    }

    const { error } = await supabaseAdmin!
      .from("therapist_blocks")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("[api/admin/agendamentos/bloqueios] Erro ao remover bloqueio:", error);
      return NextResponse.json({ error: "Falha ao excluir bloqueio" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Bloqueio removido com sucesso." });
  } catch (err) {
    console.error("[api/admin/agendamentos/bloqueios] Erro:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
