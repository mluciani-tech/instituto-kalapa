import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/admin-auth";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";
import { cleanExpiredPendingAppointments } from "@/lib/agendamento";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const isAuthed = await checkAdminAuth(req);
    if (!isAuthed) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    if (!isAdminConfigured()) {
      return NextResponse.json({ appointments: [] });
    }

    await cleanExpiredPendingAppointments();

    const { searchParams } = new URL(req.url);
    const therapistId = searchParams.get("therapist_id");
    const status = searchParams.get("status");
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");

    let query = supabaseAdmin!
      .from("appointments")
      .select(`
        id,
        therapist_id,
        patient_id,
        produto_id,
        pedido_id,
        start_time,
        end_time,
        status,
        expires_at,
        notes,
        cancellation_reason,
        canceled_at,
        canceled_by,
        created_at,
        updated_at,
        therapists(id, nome, titulo, foto_url),
        usuarios(id, nome, email, telefone, cpf),
        produtos(id, nome, slug, preco),
        pedidos(id, order_nsu, valor, status, metodo_pagamento)
      `)
      .order("start_time", { ascending: false });

    if (therapistId) query = query.eq("therapist_id", therapistId);
    if (status && status !== "todos") query = query.eq("status", status);
    if (startDate) query = query.gte("start_time", startDate);
    if (endDate) query = query.lte("start_time", endDate);

    const { data: appointments, error } = await query;

    if (error) {
      console.error("[api/admin/agendamentos] Erro:", error);
      return NextResponse.json({ error: "Erro ao listar agendamentos" }, { status: 500 });
    }

    return NextResponse.json({ appointments: appointments || [] });
  } catch (err) {
    console.error("[api/admin/agendamentos] Erro inesperado:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const isAuthed = await checkAdminAuth(req);
    if (!isAuthed) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    if (!isAdminConfigured()) {
      return NextResponse.json({ error: "Banco de dados não configurado" }, { status: 500 });
    }

    const body = await req.json();
    const { appointment_id, status, cancellation_reason, notes } = body;

    if (!appointment_id || !status) {
      return NextResponse.json(
        { error: "appointment_id e status são obrigatórios" },
        { status: 400 }
      );
    }

    if (status === "CANCELED" && (!cancellation_reason || !cancellation_reason.trim())) {
      return NextResponse.json(
        { error: "É obrigatório fornecer uma justificativa para o cancelamento da consulta." },
        { status: 400 }
      );
    }

    const nowIso = new Date().toISOString();
    const updateData: Record<string, unknown> = {
      status,
      updated_at: nowIso,
    };

    if (notes !== undefined) updateData.notes = notes;

    if (status === "CANCELED") {
      updateData.canceled_at = nowIso;
      updateData.canceled_by = "therapist";
      updateData.cancellation_reason = cancellation_reason.trim();
    }

    const { error } = await supabaseAdmin!
      .from("appointments")
      .update(updateData)
      .eq("id", appointment_id);

    if (error) {
      console.error("[api/admin/agendamentos] Erro ao atualizar status:", error);
      return NextResponse.json({ error: "Falha ao atualizar agendamento" }, { status: 500 });
    }

    // Auditoria
    await supabaseAdmin!.from("appointment_logs").insert({
      appointment_id,
      action: status === "CANCELED" ? "CANCELED_BY_THERAPIST" : `STATUS_UPDATED_${status}`,
      actor_type: "therapist",
      details: { status, cancellation_reason, notes },
    });

    return NextResponse.json({ success: true, message: "Agendamento atualizado com sucesso" });
  } catch (err) {
    console.error("[api/admin/agendamentos] Erro inesperado:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
