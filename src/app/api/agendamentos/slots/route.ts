import { NextRequest, NextResponse } from "next/server";
import { calculateAvailableSlots } from "@/lib/agendamento";

export const dynamic = "force-dynamic";

const DEFAULT_THERAPIST_ID = "e7f53a4e-1288-4e89-b051-5b7415444b01";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const therapistId = searchParams.get("therapist_id") || DEFAULT_THERAPIST_ID;
    const dateStr = searchParams.get("date"); // YYYY-MM-DD

    if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return NextResponse.json(
        { error: "Parâmetro 'date' inválido. Use o formato YYYY-MM-DD." },
        { status: 400 }
      );
    }

    const slots = await calculateAvailableSlots({
      therapistId,
      dateStr,
    });

    return NextResponse.json({
      date: dateStr,
      therapist_id: therapistId,
      slots,
    });
  } catch (err) {
    console.error("[api/agendamentos/slots] Erro ao calcular slots:", err);
    return NextResponse.json(
      { error: "Erro interno ao processar horários disponíveis." },
      { status: 500 }
    );
  }
}
