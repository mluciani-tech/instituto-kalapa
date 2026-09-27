/**
 * agendamento-server.ts
 * Funções de agendamento que só podem rodar no servidor (importam nodemailer via email.ts).
 * NÃO importar este arquivo em client components.
 */
import { supabaseAdmin, isAdminConfigured } from "./supabase";
import { formatUtcToLocalDate, formatUtcToLocalTime } from "./agendamento";
import { sendNotificacaoAgendamentoTerapeuta } from "./email";

/**
 * Notifica o terapeuta e/ou administração quando um agendamento for confirmado com sucesso.
 */
export async function notificarTerapeutaPorAgendamentoId(
  appointmentId: string,
  orderNsu?: string | null
): Promise<void> {
  if (!isAdminConfigured() || !appointmentId) return;

  try {
    const { data: appt, error } = await supabaseAdmin!
      .from("appointments")
      .select(`
        id,
        start_time,
        end_time,
        notes,
        status,
        therapists(id, nome, email),
        usuarios(id, nome, email, telefone),
        produtos(id, nome)
      `)
      .eq("id", appointmentId)
      .single();

    if (error || !appt) {
      console.warn("[agendamento] Agendamento não encontrado para notificação:", appointmentId);
      return;
    }

    const inicioFmt = `${formatUtcToLocalDate(appt.start_time)} às ${formatUtcToLocalTime(appt.start_time)}`;
    const fimFmt = formatUtcToLocalTime(appt.end_time);

    // Tipos relacionais do supabase
    const terapeutaData = Array.isArray(appt.therapists) ? appt.therapists[0] : appt.therapists;
    const usuarioData = Array.isArray(appt.usuarios) ? appt.usuarios[0] : appt.usuarios;
    const produtoData = Array.isArray(appt.produtos) ? appt.produtos[0] : appt.produtos;

    await sendNotificacaoAgendamentoTerapeuta({
      destinatarioEmail: terapeutaData?.email || null,
      terapeutaNome: terapeutaData?.nome || "Terapeuta",
      pacienteNome: usuarioData?.nome || "Paciente",
      pacienteEmail: usuarioData?.email || null,
      pacienteTelefone: usuarioData?.telefone || null,
      produtoNome: produtoData?.nome || "Atendimento Individual",
      dataHoraInicio: inicioFmt,
      dataHoraFim: fimFmt,
      orderNsu: orderNsu || null,
      observacoes: appt.notes || null,
    });

    console.log(
      `[agendamento] Notificação disparada para terapeuta: ${terapeutaData?.email || "contato-padrao"}`
    );
  } catch (err) {
    console.error("[agendamento] Erro ao notificar terapeuta:", err);
  }
}
