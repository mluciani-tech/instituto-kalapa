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
      return NextResponse.json({ availability: [] });
    }

    const { searchParams } = new URL(req.url);
    const therapistId = searchParams.get("therapist_id") || DEFAULT_THERAPIST_ID;

    const { data, error } = await supabaseAdmin!
      .from("therapist_availability")
      .select("*")
      .eq("therapist_id", therapistId)
      .order("day_of_week", { ascending: true })
      .order("start_time", { ascending: true });

    if (error) {
      console.error("[api/admin/agendamentos/disponibilidade] Erro:", error);
      return NextResponse.json({ error: "Erro ao buscar grade" }, { status: 500 });
    }

    return NextResponse.json({ availability: data || [] });
  } catch (err) {
    console.error("[api/admin/agendamentos/disponibilidade] Erro:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const isAuthed = await checkAdminAuth(req);
    if (!isAuthed) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    if (!isAdminConfigured()) {
      return NextResponse.json({ error: "Banco de dados não configurado" }, { status: 500 });
    }

    const body = await req.json();
    const therapistId = body.therapist_id || DEFAULT_THERAPIST_ID;
    const windows = body.windows; // Array de { day_of_week, start_time, end_time, slot_duration_minutes, buffer_duration_minutes, ativo }

    if (!Array.isArray(windows)) {
      return NextResponse.json({ error: "'windows' deve ser um array." }, { status: 400 });
    }

    // Deletar grade antiga para esse terapeuta
    const { error: deleteError } = await supabaseAdmin!
      .from("therapist_availability")
      .delete()
      .eq("therapist_id", therapistId);

    if (deleteError) {
      console.error("[api/admin/agendamentos/disponibilidade] Erro ao limpar grade antiga:", deleteError);
      return NextResponse.json({ error: "Falha ao atualizar grade" }, { status: 500 });
    }

    if (windows.length > 0) {
      const inserts = windows.map((w: any) => ({
        therapist_id: therapistId,
        day_of_week: Number(w.day_of_week),
        start_time: w.start_time,
        end_time: w.end_time,
        slot_duration_minutes: Number(w.slot_duration_minutes) || 50,
        buffer_duration_minutes: Number(w.buffer_duration_minutes) || 10,
        ativo: w.ativo !== false,
      }));

      const { error: insertError } = await supabaseAdmin!
        .from("therapist_availability")
        .insert(inserts);

      if (insertError) {
        console.error("[api/admin/agendamentos/disponibilidade] Erro ao inserir grade nova:", insertError);
        return NextResponse.json({ error: "Falha ao gravar nova grade" }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, message: "Grade de horários atualizada com sucesso." });
  } catch (err) {
    console.error("[api/admin/agendamentos/disponibilidade] Erro:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
