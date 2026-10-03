import { NextRequest, NextResponse } from "next/server";
import { getClienteFromRequest } from "@/lib/cliente-auth";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const CANCEL_LIMIT_HOURS = 24;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cliente = await getClienteFromRequest(req);
    if (!cliente) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    if (!isAdminConfigured()) {
      return NextResponse.json({ error: "Banco de dados não configurado." }, { status: 500 });
    }

    const { id: appointmentId } = await params;

    // 1. Buscar consulta
    const { data: appt, error: apptError } = await supabaseAdmin!
      .from("appointments")
      .select("id, patient_id, start_time, status")
      .eq("id", appointmentId)
      .single();

    if (apptError || !appt) {
      return NextResponse.json({ error: "Agendamento não encontrado." }, { status: 404 });
    }

    // 2. Verificar titularidade
    if (appt.patient_id !== cliente.id) {
      return NextResponse.json({ error: "Acesso negado a este agendamento." }, { status: 403 });
    }

    // 3. Verificar status
    if (appt.status === "CANCELED") {
      return NextResponse.json({ error: "Este agendamento já está cancelado." }, { status: 400 });
    }
    if (appt.status === "COMPLETED") {
      return NextResponse.json({ error: "Consultas já realizadas não podem ser canceladas." }, { status: 400 });
    }

    // 4. Validar antecedência mínima de 24 horas para cancelamento autônomo
    const startMs = new Date(appt.start_time).getTime();
    const nowMs = Date.now();
    const diffHours = (startMs - nowMs) / (1000 * 60 * 60);

    if (diffHours < CANCEL_LIMIT_HOURS) {
      return NextResponse.json(
        {
          error: `Cancelamentos autônomos só são permitidos com pelo menos ${CANCEL_LIMIT_HOURS} horas de antecedência. Para remarcações emergenciais, por favor entre em contato diretamente pelo WhatsApp do INstituto.`,
        },
        { status: 400 }
      );
    }

    // 5. Cancelar agendamento
    const nowIso = new Date().toISOString();
    const { error: updateError } = await supabaseAdmin!
      .from("appointments")
      .update({
        status: "CANCELED",
        canceled_at: nowIso,
        canceled_by: "patient",
        cancellation_reason: "Cancelamento autônomo realizado pelo paciente",
        updated_at: nowIso,
      })
      .eq("id", appointmentId);

    if (updateError) {
      console.error("[api/agendamentos/cancelar] Erro:", updateError);
      return NextResponse.json({ error: "Falha ao cancelar agendamento." }, { status: 500 });
    }

    // 6. Auditoria
    await supabaseAdmin!.from("appointment_logs").insert({
      appointment_id: appointmentId,
      action: "CANCELED_BY_PATIENT",
      actor_type: "patient",
      actor_id: cliente.id,
      details: { canceled_at: nowIso },
    });

    return NextResponse.json({
      success: true,
      message: "Agendamento cancelado com sucesso. O horário foi liberado na agenda.",
    });
  } catch (err) {
    console.error("[api/agendamentos/cancelar] Erro inesperado:", err);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
