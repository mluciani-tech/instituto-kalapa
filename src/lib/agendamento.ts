import { supabaseAdmin, isAdminConfigured } from "./supabase";
import type { TimeSlot, TherapistAvailability, TherapistBlock, Appointment } from "./types";

const BRAZIL_OFFSET = "-03:00"; // Fuso horário padrão de Brasília (UTC-3)
const DEFAULT_MIN_ADVANCE_HOURS = 4;
const PENDING_HOLD_MINUTES = 15;

/**
 * Verifica se um produto é um atendimento individual que exige agendamento prévio na agenda.
 * Reconhece variações em categoria, slug e nome de forma case-insensitive e acento-insensível.
 */
export function isProdutoAgendamento(p?: {
  slug?: string | null;
  categoria?: string | null;
  nome?: string | null;
  atendimento_individual?: boolean | null;
} | null): boolean {
  if (!p) return false;

  // Prioridade absoluta para o campo booleano explícito de atendimento individual
  if (p.atendimento_individual !== undefined && p.atendimento_individual !== null) {
    return Boolean(p.atendimento_individual);
  }

  const norm = (s?: string | null) =>
    (s || "")
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const slug = norm(p.slug);
  const cat = norm(p.categoria);
  const nome = norm(p.nome);

  // 1. Categoria é Atendimentos
  if (cat === "atendimentos" || cat === "atendimento") {
    return true;
  }

  // 2. Slug contém terapia, atendimento, sessao, consulta
  if (
    slug.includes("terapia") ||
    slug.includes("atendimento") ||
    slug.includes("sessao") ||
    slug.includes("consulta")
  ) {
    return true;
  }

  // 3. Nome contém referências a atendimentos terapêuticos individuais
  if (
    nome.includes("terapia") ||
    nome.includes("atendimento") ||
    nome.includes("oleacao") ||
    nome.includes("abhyanga") ||
    nome.includes("psicoterapia") ||
    nome.includes("constelacao individual")
  ) {
    return true;
  }

  return false;
}

/**
 * Verifica se um produto é da categoria ou slug de Calendário (programação/evento informativo).
 */
export function isProdutoCalendario(p?: {
  slug?: string | null;
  categoria?: string | null;
} | null): boolean {
  if (!p) return false;
  const norm = (s?: string | null) =>
    (s || "")
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  const cat = norm(p.categoria);
  const slug = norm(p.slug);
  return cat === "calendario" || slug.startsWith("calendario");
}

/**
 * Determina se o produto deve permitir checkout / carrinho de compras.
 * Produtos informativos (como Calendário ou com permite_checkout === false) não têm checkout nem carrinho.
 */
export function permiteCheckoutProduto(p?: {
  slug?: string | null;
  categoria?: string | null;
  permite_checkout?: boolean | null;
} | null): boolean {
  if (!p) return true;
  if (p.permite_checkout === false) return false;
  if (isProdutoCalendario(p)) return false;
  return true;
}

/** Converte data (YYYY-MM-DD) e hora (HH:mm ou HH:mm:ss) para Date UTC considerando o fuso de Brasília */
export function parseLocalToUtc(dateStr: string, timeStr: string): Date {
  const normalizedTime = timeStr.length === 5 ? `${timeStr}:00` : timeStr;
  return new Date(`${dateStr}T${normalizedTime}${BRAZIL_OFFSET}`);
}

/** Formata uma data UTC para o formato HH:mm no fuso de Brasília */
export function formatUtcToLocalTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
}

/** Formata uma data UTC para o formato DD/MM/YYYY no fuso de Brasília */
export function formatUtcToLocalDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

/** Obtém o dia da semana (0 = Domingo a 6 = Sábado) de uma string YYYY-MM-DD no fuso de Brasília */
export function getDayOfWeekFromDateStr(dateStr: string): number {
  const d = parseLocalToUtc(dateStr, "12:00:00");
  const weekdayName = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    weekday: "short",
  }).format(d);

  const map: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  return map[weekdayName] ?? d.getUTCDay();
}

/** Limpa agendamentos PENDING que expiraram (passaram de 15 minutos sem pagamento) */
export async function cleanExpiredPendingAppointments(): Promise<void> {
  if (!isAdminConfigured()) return;
  try {
    const nowIso = new Date().toISOString();
    await supabaseAdmin!
      .from("appointments")
      .update({
        status: "CANCELED",
        cancellation_reason: "Hold de reserva expirado por falta de pagamento",
        canceled_at: nowIso,
        canceled_by: "system",
        updated_at: nowIso,
      })
      .eq("status", "PENDING")
      .lt("expires_at", nowIso);
  } catch (err) {
    console.error("[agendamento] Erro ao limpar holds expirados:", err);
  }
}

/**
 * Calcula os horários livres para uma terapeuta em um dia específico (YYYY-MM-DD).
 * Cruza a grade semanal padrão com bloqueios manuais e agendamentos existentes,
 * respeitando a antecedência mínima de 4 horas.
 */
export async function calculateAvailableSlots(params: {
  therapistId: string;
  dateStr: string; // YYYY-MM-DD
  minAdvanceHours?: number;
  produtoId?: string;
  duracaoMinutos?: number;
}): Promise<TimeSlot[]> {
  if (!isAdminConfigured()) return [];

  const { therapistId, dateStr, minAdvanceHours = DEFAULT_MIN_ADVANCE_HOURS, produtoId, duracaoMinutos } = params;

  // 1. Limpar holds expirados antes do cálculo
  await cleanExpiredPendingAppointments();

  // Determinar duração específica do produto se fornecido
  let overrideDuration: number | null = duracaoMinutos || null;
  if (!overrideDuration && produtoId) {
    try {
      const { data: prod } = await supabaseAdmin!
        .from("produtos")
        .select("duracao_minutos")
        .eq("id", produtoId)
        .maybeSingle();

      if (prod?.duracao_minutos && prod.duracao_minutos > 0) {
        overrideDuration = prod.duracao_minutos;
      }
    } catch {
      // ignore
    }
  }

  // 2. Determinar dia da semana
  const dayOfWeek = getDayOfWeekFromDateStr(dateStr);

  // 3. Buscar grade padrão da terapeuta para aquele dia da semana
  const { data: availabilities, error: availError } = await supabaseAdmin!
    .from("therapist_availability")
    .select("*")
    .eq("therapist_id", therapistId)
    .eq("day_of_week", dayOfWeek)
    .eq("ativo", true)
    .order("start_time", { ascending: true });

  let effectiveAvailabilities: TherapistAvailability[] = availabilities || [];

  if (effectiveAvailabilities.length === 0 && dayOfWeek >= 1 && dayOfWeek <= 5) {
    // Fallback inteligente com 3 turnos (Manhã 09-12, Tarde 13-15, Noite 18-21)
    effectiveAvailabilities = [
      {
        id: "default-manha",
        therapist_id: therapistId,
        day_of_week: dayOfWeek,
        start_time: "09:00:00",
        end_time: "12:00:00",
        slot_duration_minutes: 90,
        buffer_duration_minutes: 0,
        ativo: true,
      },
      {
        id: "default-tarde",
        therapist_id: therapistId,
        day_of_week: dayOfWeek,
        start_time: "13:00:00",
        end_time: "15:00:00",
        slot_duration_minutes: 90,
        buffer_duration_minutes: 0,
        ativo: true,
      },
      {
        id: "default-noite",
        therapist_id: therapistId,
        day_of_week: dayOfWeek,
        start_time: "18:00:00",
        end_time: "21:00:00",
        slot_duration_minutes: 90,
        buffer_duration_minutes: 0,
        ativo: true,
      },
    ];
  }

  if (effectiveAvailabilities.length === 0) {
    return [];
  }


  // 4. Determinar intervalo do dia em UTC (das 00:00 às 23:59:59 horário de Brasília)
  const startOfDayUtc = parseLocalToUtc(dateStr, "00:00:00");
  const endOfDayUtc = parseLocalToUtc(dateStr, "23:59:59");

  // 5. Buscar agendamentos que não estejam cancelados naquele dia
  const nowIso = new Date().toISOString();
  const { data: appointments } = await supabaseAdmin!
    .from("appointments")
    .select("id, start_time, end_time, status, expires_at")
    .eq("therapist_id", therapistId)
    .neq("status", "CANCELED")
    .gte("end_time", startOfDayUtc.toISOString())
    .lte("start_time", endOfDayUtc.toISOString());

  // Filtrar apenas consultas válidas (CONFIRMED/COMPLETED ou PENDING que ainda não expirou)
  const activeAppointments = (appointments || []).filter((a) => {
    if (a.status === "PENDING") {
      if (!a.expires_at) return true;
      return new Date(a.expires_at).getTime() > new Date(nowIso).getTime();
    }
    return true;
  });

  // 6. Buscar bloqueios manuais da terapeuta no período
  const { data: blocks } = await supabaseAdmin!
    .from("therapist_blocks")
    .select("id, therapist_id, start_time, end_time, reason")
    .eq("therapist_id", therapistId)
    .gte("end_time", startOfDayUtc.toISOString())
    .lte("start_time", endOfDayUtc.toISOString());

  const activeBlocks: TherapistBlock[] = blocks || [];

  // 7. Gerar os slots teóricos para cada janela da grade
  const slots: TimeSlot[] = [];
  const nowTime = new Date().getTime();
  const minAdvanceTime = nowTime + minAdvanceHours * 60 * 60 * 1000;

  for (const window of effectiveAvailabilities) {
    const rawSlotMins = window.slot_duration_minutes;
    const effectiveWindowDuration = (!rawSlotMins || rawSlotMins === 50) ? 90 : rawSlotMins;
    const effectiveWindowBuffer = rawSlotMins === 50 ? 0 : (window.buffer_duration_minutes || 0);

    const slotDurationMins = overrideDuration || effectiveWindowDuration;
    const bufferDurationMins = overrideDuration ? 0 : effectiveWindowBuffer;

    const slotDurationMs = slotDurationMins * 60 * 1000;
    const bufferDurationMs = bufferDurationMins * 60 * 1000;
    const totalStepMs = slotDurationMs + bufferDurationMs;

    // Converte horários de início e fim da janela para UTC do dia solicitado
    const windowStart = parseLocalToUtc(dateStr, window.start_time);
    const windowEnd = parseLocalToUtc(dateStr, window.end_time);

    let currentSlotStart = new Date(windowStart.getTime());

    while (currentSlotStart.getTime() + slotDurationMs <= windowEnd.getTime()) {
      const currentSlotEnd = new Date(currentSlotStart.getTime() + slotDurationMs);

      const slotStartIso = currentSlotStart.toISOString();
      const slotEndIso = currentSlotEnd.toISOString();
      const slotStartTime = currentSlotStart.getTime();
      const slotEndTime = currentSlotEnd.getTime();

      let available = true;
      let reason: string | undefined;

      // Validação 1: Antecedência mínima (4 horas)
      if (slotStartTime < minAdvanceTime) {
        available = false;
        reason = "Horário indisponível (antecedência mínima necessária)";
      }

      // Validação 2: Colisão com agendamentos existentes
      if (available) {
        const hasCollision = activeAppointments.some((appt) => {
          const apptStart = new Date(appt.start_time).getTime();
          const apptEnd = new Date(appt.end_time).getTime();
          return slotStartTime < apptEnd && slotEndTime > apptStart;
        });

        if (hasCollision) {
          available = false;
          reason = "Horário já reservado";
        }
      }

      // Validação 3: Colisão com bloqueios manuais da terapeuta
      if (available) {
        const isBlocked = activeBlocks.some((blk) => {
          const blkStart = new Date(blk.start_time).getTime();
          const blkEnd = new Date(blk.end_time).getTime();
          return slotStartTime < blkEnd && slotEndTime > blkStart;
        });

        if (isBlocked) {
          available = false;
          reason = "Horário bloqueado";
        }
      }

      slots.push({
        startTime: slotStartIso,
        endTime: slotEndIso,
        timeDisplay: formatUtcToLocalTime(currentSlotStart),
        timeEndDisplay: formatUtcToLocalTime(currentSlotEnd),
        available,
        reason,
      });

      // Avançar para o próximo slot (Início + Duração + Buffer)
      currentSlotStart = new Date(currentSlotStart.getTime() + totalStepMs);
    }
  }

  return slots;
}

/** Cria um agendamento temporário (Hold de 15 minutos) com validação estrita anti-colisão */
export async function createAppointmentHold(params: {
  therapistId: string;
  patientId: string;
  produtoId?: string;
  startTime: string; // ISO 8601 UTC
  endTime: string; // ISO 8601 UTC
  notes?: string;
}): Promise<{ success: boolean; appointmentId?: string; error?: string }> {
  if (!isAdminConfigured()) {
    return { success: false, error: "Serviço de banco de dados não configurado." };
  }

  const { therapistId, patientId, produtoId, startTime, endTime, notes } = params;

  // 1. Limpar holds expirados antes da tentativa de inserção
  await cleanExpiredPendingAppointments();

  const startIso = new Date(startTime).toISOString();
  const endIso = new Date(endTime).toISOString();
  const nowIso = new Date().toISOString();

  // 2. Verificar antecedência mínima (4 horas)
  const startTimeMs = new Date(startIso).getTime();
  const nowMs = Date.now();
  if (startTimeMs < nowMs + DEFAULT_MIN_ADVANCE_HOURS * 60 * 60 * 1000) {
    return {
      success: false,
      error: `Agendamentos exigem no mínimo ${DEFAULT_MIN_ADVANCE_HOURS} horas de antecedência.`,
    };
  }

  // 3. Verificação de concorrência / colisão atômica:
  // Consulta se há qualquer agendamento ativo ou bloqueio sobrepondo o intervalo
  const { data: overlappingAppointments } = await supabaseAdmin!
    .from("appointments")
    .select("id, status, expires_at")
    .eq("therapist_id", therapistId)
    .neq("status", "CANCELED")
    .lt("start_time", endIso)
    .gt("end_time", startIso);

  const activeOverlap = (overlappingAppointments || []).filter((a) => {
    if (a.status === "PENDING") {
      if (!a.expires_at) return true;
      return new Date(a.expires_at).getTime() > Date.now();
    }
    return true;
  });

  if (activeOverlap.length > 0) {
    return {
      success: false,
      error: "Este horário acabou de ser selecionado por outra pessoa. Por favor, escolha outro slot.",
    };
  }

  // Verificar bloqueios manuais
  const { data: overlappingBlocks } = await supabaseAdmin!
    .from("therapist_blocks")
    .select("id")
    .eq("therapist_id", therapistId)
    .lt("start_time", endIso)
    .gt("end_time", startIso)
    .limit(1);

  if (overlappingBlocks && overlappingBlocks.length > 0) {
    return {
      success: false,
      error: "Este horário foi bloqueado na agenda do profissional.",
    };
  }

  // 4. Inserir agendamento com status PENDING e Hold de 15 minutos
  const expiresAt = new Date(Date.now() + PENDING_HOLD_MINUTES * 60 * 1000).toISOString();

  const { data: newAppt, error: insertError } = await supabaseAdmin!
    .from("appointments")
    .insert({
      therapist_id: therapistId,
      patient_id: patientId,
      produto_id: produtoId || null,
      start_time: startIso,
      end_time: endIso,
      status: "PENDING",
      expires_at: expiresAt,
      notes: notes || null,
    })
    .select("id")
    .single();

  if (insertError || !newAppt) {
    console.error("[agendamento] Erro ao criar hold de consulta:", insertError);
    return {
      success: false,
      error: "Não foi possível reservar este horário no momento. Tente novamente.",
    };
  }

  // Registrar auditoria
  await supabaseAdmin!.from("appointment_logs").insert({
    appointment_id: newAppt.id,
    action: "CREATED_HOLD",
    actor_type: "patient",
    actor_id: patientId,
    details: {
      expires_at: expiresAt,
      start_time: startIso,
      end_time: endIso,
    },
  });

  return {
    success: true,
    appointmentId: newAppt.id,
  };
}

