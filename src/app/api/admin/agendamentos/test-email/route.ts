import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/admin-auth";
import { sendNotificacaoAgendamentoTerapeuta } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const isAuthed = await checkAdminAuth(req);
    if (!isAuthed) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { email } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "E-mail de teste inválido." }, { status: 400 });
    }

    const agora = new Intl.DateTimeFormat("pt-BR", {
      timeZone: "America/Sao_Paulo",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date());

    const res = await sendNotificacaoAgendamentoTerapeuta({
      destinatarioEmail: email,
      terapeutaNome: "Facilitadora / Terapeuta Kalapa",
      pacienteNome: "Paciente Teste do Sistema",
      pacienteEmail: "teste@exemplo.com",
      pacienteTelefone: "(11) 98765-4321",
      produtoNome: "Sessão Terapêutica Individual (Teste de Notificação)",
      dataHoraInicio: agora,
      dataHoraFim: "1h após",
      orderNsu: "TESTE-NOTIF-01",
      observacoes: "Este é um disparo de teste gerado pelo painel administrativo para validar a recepção de alertas de novos agendamentos via SMTP Hostinger.",
    });

    if (!res.success) {
      return NextResponse.json(
        { error: `Erro no servidor SMTP da Hostinger: ${res.error || "Verifique usuário, senha ou porta 465"}` },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, message: `E-mail de teste enviado para ${email}` });
  } catch (err: any) {
    console.error("[api/admin/agendamentos/test-email] Erro:", err);
    return NextResponse.json({ error: err?.message || "Erro interno ao enviar e-mail de teste" }, { status: 500 });
  }
}
