import { NextRequest, NextResponse } from "next/server";
import { getClienteFromRequest } from "@/lib/cliente-auth";
import { createAppointmentHold, cleanExpiredPendingAppointments } from "@/lib/agendamento";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const cliente = await getClienteFromRequest(req);
    if (!cliente) {
      return NextResponse.json(
        { error: "Você precisa estar conectado à sua conta para agendar um horário." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { therapist_id, produto_id, start_time, end_time, notes } = body;

    if (!therapist_id || !start_time || !end_time) {
      return NextResponse.json(
        { error: "Parâmetros obrigatórios ausentes (therapist_id, start_time, end_time)." },
        { status: 400 }
      );
    }

    const result = await createAppointmentHold({
      therapistId: therapist_id,
      patientId: cliente.id,
      produtoId: produto_id,
      startTime: start_time,
      endTime: end_time,
      notes,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 409 });
    }

    return NextResponse.json({
      success: true,
      appointment_id: result.appointmentId,
      message: "Pré-reserva realizada com sucesso (Hold de 15 minutos).",
    });
  } catch (err) {
    console.error("[api/agendamentos] Erro ao criar agendamento:", err);
    return NextResponse.json(
      { error: "Erro interno ao processar agendamento." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const cliente = await getClienteFromRequest(req);
    if (!cliente) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    if (!isAdminConfigured()) {
      return NextResponse.json([]);
    }

    await cleanExpiredPendingAppointments();

    const { data: appointments, error } = await supabaseAdmin!
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
        created_at,
        therapists(id, nome, titulo, foto_url),
        produtos(id, nome, slug, preco),
        pedidos(id, order_nsu, valor, status)
      `)
      .eq("patient_id", cliente.id)
      .order("start_time", { ascending: false });

    if (error) {
      console.error("[api/agendamentos] Erro ao listar agendamentos do cliente:", error);
      return NextResponse.json({ error: "Erro ao buscar agendamentos" }, { status: 500 });
    }

    return NextResponse.json(appointments || []);
  } catch (err) {
    console.error("[api/agendamentos] Erro interno:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
