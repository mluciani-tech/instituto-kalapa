// Envio de e-mails via SMTP Hostinger (ou fallback Resend / Mock)
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";

const EMAIL_FROM = process.env.KALAPA_EMAIL_FROM || "contato@institutokalapa.com.br";
const EMAIL_TO = process.env.KALAPA_EMAIL_TO || "contato@institutokalapa.com.br";

export const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  fromName?: string;
}

export async function getSmtpConfig(): Promise<SmtpConfig | null> {
  // 1. Tentar buscar da tabela configuracoes do Supabase
  if (isAdminConfigured()) {
    try {
      const { data } = await supabaseAdmin!
        .from("configuracoes")
        .select("chave, valor")
        .in("chave", ["smtp_host", "smtp_port", "smtp_user", "smtp_pass", "smtp_from_name"]);

      if (data && data.length > 0) {
        const map: Record<string, string> = {};
        data.forEach((item) => {
          map[item.chave] = item.valor;
        });

        if (map.smtp_host && map.smtp_user && map.smtp_pass) {
          const port = parseInt(map.smtp_port || "465", 10);
          return {
            host: map.smtp_host,
            port,
            secure: port === 465,
            user: map.smtp_user,
            pass: map.smtp_pass,
            fromName: map.smtp_from_name || "INstituto Kalapa",
          };
        }
      }
    } catch (err) {
      console.warn("[email] Erro ao buscar SMTP das configurações:", err);
    }
  }

  // 2. Fallback para variáveis de ambiente
  const envHost = process.env.SMTP_HOST;
  const envUser = process.env.SMTP_USER;
  const envPass = process.env.SMTP_PASS;
  if (envHost && envUser && envPass) {
    const port = parseInt(process.env.SMTP_PORT || "465", 10);
    return {
      host: envHost,
      port,
      secure: port === 465,
      user: envUser,
      pass: envPass,
      fromName: process.env.SMTP_FROM_NAME || "INstituto Kalapa",
    };
  }

  return null;
}

function htmlToText(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<\/p>|<\/div>|<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\n\s*\n\s*\n/g, "\n\n")
    .trim();
}

interface SendEmailOptions {
  fromName?: string;
  text?: string;
}

async function sendEmail(
  to: string,
  subject: string,
  html: string,
  options?: SendEmailOptions
): Promise<{ success: boolean; error?: string }> {
  const textContent = options?.text || htmlToText(html);

  // A. Prioridade 1: SMTP da Hostinger
  const smtp = await getSmtpConfig();
  if (smtp) {
    try {
      const nodemailer = await import("nodemailer");
      const transporter = nodemailer.createTransport({
        host: smtp.host,
        port: smtp.port,
        secure: smtp.secure, // true para porta 465 (SSL)
        auth: {
          user: smtp.user,
          pass: smtp.pass,
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000,
        tls: {
          // Permite conexões seguras sem bloqueios
          rejectUnauthorized: false,
        },
      });

      const fromName = options?.fromName || smtp.fromName || "INstituto Kalapa";
      const sender = `"${fromName}" <${smtp.user}>`;

      await transporter.sendMail({
        from: sender,
        to,
        subject,
        text: textContent,
        html,
        headers: {
          "X-Entity-Ref-ID": `${Date.now()}`,
        },
      });

      console.log(`[email] E-mail enviado com sucesso via SMTP Hostinger para: ${to}`);
      return { success: true };
    } catch (smtpErr: any) {
      console.error("[email] Erro ao enviar via SMTP Hostinger:", smtpErr);
      return { success: false, error: smtpErr?.message || "Falha no envio SMTP Hostinger" };
    }
  }

  // B. Prioridade 2: Resend (caso configurado)
  const apiKey = process.env.RESEND_API_KEY;
  const isResendConfigured = !!apiKey && apiKey !== "re_sua_key_aqui" && apiKey.startsWith("re_");

  if (isResendConfigured) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(apiKey);
      const fromName = options?.fromName || "INstituto Kalapa";
      const { error } = await resend.emails.send({
        from: `${fromName} <${EMAIL_FROM}>`,
        to: [to],
        subject,
        text: textContent,
        html,
      });
      if (error) {
        console.error("[email] Erro do Resend:", error);
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      console.error("[email] Erro inesperado Resend:", err);
      return { success: false, error: err?.message };
    }
  }

  // C. Fallback: Log no console (Mock)
  console.log("=========================================");
  console.log("MOCK: E-MAIL NÃO ENVIADO (SMTP Hostinger / Resend não configurados)");
  console.log(`Para: ${to}`);
  console.log(`Assunto: ${subject}`);
  console.log("=========================================");
  return { success: false, error: "Servidor de e-mail SMTP da Hostinger não configurado no sistema." };
}

const baseStyles = `
  font-family: Inter, Arial, sans-serif;
  max-width: 600px; margin: 0 auto;
  background: #F8F4ED; padding: 32px; border-radius: 16px;
`;

/** Notificação para o INstituto: novo pagamento confirmado */
export async function notifyPagamentoConfirmado(params: {
  nome: string;
  email: string;
  telefone: string | null;
  produto: string;
  valor: number;
  metodo: string;
  orderNsu: string;
}): Promise<void> {
  const { nome, email, telefone, produto, valor, metodo, orderNsu } = params;

  const html = `
    <div style="${baseStyles}">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: #1A3C4D; font-size: 24px; margin: 0;">INstituto Kalapa</h1>
        <p style="color: #7D8C6E; font-size: 14px; margin-top: 4px;">Pagamento confirmado</p>
      </div>
      <div style="background: #fff; border-radius: 12px; padding: 24px; margin-bottom: 16px;">
        <h2 style="color: #4A4A4A; font-size: 18px; margin-top: 0;">Dados do participante</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #4A4A4A;">
          <tr><td style="padding: 8px 0; font-weight: 600; width: 140px;">Nome:</td><td style="padding: 8px 0;">${nome}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 600;">E-mail:</td><td style="padding: 8px 0;">${email}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 600;">WhatsApp:</td><td style="padding: 8px 0;">${telefone || "Não informado"}</td></tr>
        </table>
      </div>
      <div style="background: #fff; border-radius: 12px; padding: 24px;">
        <h2 style="color: #4A4A4A; font-size: 18px; margin-top: 0;">Detalhes do pagamento</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #4A4A4A;">
          <tr><td style="padding: 8px 0; font-weight: 600; width: 140px;">Produto:</td><td style="padding: 8px 0;">${produto}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 600;">Método:</td><td style="padding: 8px 0;">${metodo.toUpperCase()}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 600;">Valor:</td><td style="padding: 8px 0;">${formatCurrency(valor)}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 600;">Pedido:</td><td style="padding: 8px 0; font-family: monospace; font-size: 12px;">${orderNsu}</td></tr>
        </table>
      </div>
      <p style="text-align: center; color: #7D8C6E; font-size: 12px; margin-top: 32px;">
        INstituto Kalapa — Transformação Comportamental
      </p>
    </div>
  `;

  await sendEmail(EMAIL_TO, `Pagamento Confirmado — ${nome} (${produto})`, html);
}

/** Confirmação para o CLIENTE: boas-vindas após pagamento */
export async function sendConfirmacaoCliente(params: {
  nome: string;
  email: string;
  produto: string;
  valor: number;
}): Promise<void> {
  const { nome, email, produto, valor } = params;

  const html = `
    <div style="${baseStyles}">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: #1A3C4D; font-size: 24px; margin: 0;">INstituto Kalapa</h1>
        <p style="color: #7D8C6E; font-size: 14px; margin-top: 4px;">Sua vaga está garantida</p>
      </div>
      <div style="background: #fff; border-radius: 12px; padding: 24px; margin-bottom: 16px;">
        <p style="color: #4A4A4A; font-size: 15px; line-height: 1.6; margin-top: 0;">
          Olá, <strong>${nome}</strong>!
        </p>
        <p style="color: #4A4A4A; font-size: 15px; line-height: 1.6;">
          Recebemos a confirmação do seu pagamento de
          <strong>${formatCurrency(valor)}</strong> referente a
          <strong>${produto}</strong>.
        </p>
        <p style="color: #4A4A4A; font-size: 15px; line-height: 1.6;">
          Nossa equipe entrará em contato pelo WhatsApp em breve com todos
          os detalhes. Seja bem-vindo(a) a essa jornada de transformação.
        </p>
      </div>
      <p style="text-align: center; color: #7D8C6E; font-size: 12px; margin-top: 32px;">
        INstituto Kalapa — Transformação Comportamental
      </p>
    </div>
  `;

  await sendEmail(email, "Sua vaga está garantida — INstituto Kalapa", html);
}

/** E-mail de Recuperação de Senha para o CLIENTE */
export async function sendPasswordResetEmail(params: {
  nome: string;
  email: string;
  resetLink: string;
}): Promise<{ success: boolean; error?: string }> {
  const { nome, email, resetLink } = params;

  const text = `Olá, ${nome}!\n\nRecebemos uma solicitação para redefinir a senha de acesso da sua conta no INstituto Kalapa.\n\nPara criar uma nova senha, utilize o link seguro abaixo (válido por 1 hora):\n${resetLink}\n\nCaso o link acima não abra, copie e cole o endereço no seu navegador.\n\nSe você não solicitou a alteração de sua senha, desconsidere este e-mail com total segurança. Nenhuma alteração foi realizada na sua conta.\n\nINstituto Kalapa — Transformação Comportamental & Autoconhecimento`;

  const html = `
    <div style="${baseStyles}">
      <div style="text-align: center; margin-bottom: 28px;">
        <h1 style="color: #1A3C4D; font-size: 24px; margin: 0; font-weight: 800; letter-spacing: -0.5px;">INstituto Kalapa</h1>
        <p style="color: #7D8C6E; font-size: 14px; font-weight: 600; margin-top: 6px;">Recuperação de Senha</p>
      </div>
      <div style="background: #ffffff; border-radius: 14px; padding: 26px; margin-bottom: 18px; border-left: 4px solid #B8965A; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
        <p style="color: #1A3C4D; font-size: 15px; line-height: 1.6; margin-top: 0;">
          Olá, <strong>${nome}</strong>!
        </p>
        <p style="color: #4A4A4A; font-size: 14px; line-height: 1.6;">
          Recebemos uma solicitação para redefinir a senha de acesso da sua conta no INstituto Kalapa.
        </p>
        <div style="background: #FDFBF7; border: 1px solid #EFE8DC; border-radius: 10px; padding: 14px; margin: 18px 0; text-align: center;">
          <p style="color: #8C6D37; font-size: 13px; font-weight: 600; margin: 0 0 14px 0;">
            Este link é seguro e expira em 1 hora.
          </p>
          <div style="margin: 8px 0;">
            <a href="${resetLink}" target="_blank" rel="noopener noreferrer" style="background-color: #B8965A; color: #ffffff; padding: 13px 28px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 14px; display: inline-block; letter-spacing: 0.3px;">
              Criar Nova Senha
            </a>
          </div>
        </div>
        <p style="color: #7A7A7A; font-size: 12px; line-height: 1.5; margin-top: 18px;">
          Caso o botão acima não abra, você também pode copiar e colar o endereço abaixo diretamente no seu navegador:<br/>
          <a href="${resetLink}" style="color: #8C6D37; word-break: break-all; font-size: 11px;">${resetLink}</a>
        </p>
        <hr style="border: none; border-top: 1px solid #EAEAEA; margin: 18px 0;" />
        <p style="color: #999999; font-size: 12px; line-height: 1.5; margin-bottom: 0;">
          Se você não solicitou a alteração de sua senha, desconsidere este e-mail com total segurança. Nenhuma alteração foi realizada na sua conta.
        </p>
      </div>
      <p style="text-align: center; color: #7D8C6E; font-size: 12px; margin-top: 24px;">
        INstituto Kalapa — Transformação Comportamental & Autoconhecimento
      </p>
    </div>
  `;

  return await sendEmail(
    email,
    "Recuperação de Senha — INstituto Kalapa",
    html,
    {
      fromName: "INstituto Kalapa",
      text,
    }
  );
}

/** Notificação para o TERAPEUTA e/ou ADMIN: Novo agendamento confirmado */
export async function sendNotificacaoAgendamentoTerapeuta(params: {
  destinatarioEmail?: string | null;
  terapeutaNome: string;
  pacienteNome: string;
  pacienteEmail?: string | null;
  pacienteTelefone?: string | null;
  produtoNome: string;
  dataHoraInicio: string; // Ex: DD/MM/YYYY às HH:mm
  dataHoraFim: string; // Ex: HH:mm
  orderNsu?: string | null;
  observacoes?: string | null;
}): Promise<{ success: boolean; error?: string }> {
  const {
    destinatarioEmail,
    terapeutaNome,
    pacienteNome,
    pacienteEmail,
    pacienteTelefone,
    produtoNome,
    dataHoraInicio,
    dataHoraFim,
    orderNsu,
    observacoes,
  } = params;

  const toEmail = destinatarioEmail && destinatarioEmail.includes("@") ? destinatarioEmail : EMAIL_TO;
  const telLimpo = (pacienteTelefone || "").replace(/\D/g, "");
  const whatsappUrl = telLimpo ? `https://wa.me/55${telLimpo}` : null;

  const html = `
    <div style="${baseStyles}">
      <div style="text-align: center; margin-bottom: 28px;">
        <h1 style="color: #1A3C4D; font-size: 22px; margin: 0;">INstituto Kalapa</h1>
        <p style="color: #6D28D9; font-size: 14px; font-weight: 600; margin-top: 4px;">🗓️ Novo Agendamento Confirmado!</p>
      </div>

      <div style="background: #ffffff; border-radius: 12px; padding: 22px; margin-bottom: 16px; border-left: 4px solid #6D28D9;">
        <p style="color: #1A3C4D; font-size: 15px; margin: 0 0 12px 0;">
          Olá, <strong>${terapeutaNome}</strong>! Um novo atendimento foi agendado e confirmado para você.
        </p>
        <div style="background: #F3EEFA; border-radius: 8px; padding: 14px; margin-bottom: 8px;">
          <p style="margin: 0; color: #4B2E83; font-weight: 700; font-size: 16px;">
            ⏰ ${dataHoraInicio} até ${dataHoraFim}
          </p>
          <p style="margin: 4px 0 0 0; color: #6D28D9; font-size: 14px;">
            Serviço: <strong>${produtoNome}</strong>
          </p>
        </div>
      </div>

      <div style="background: #ffffff; border-radius: 12px; padding: 22px; margin-bottom: 16px;">
        <h2 style="color: #4A4A4A; font-size: 16px; margin-top: 0; margin-bottom: 14px;">Dados do(a) Paciente</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #4A4A4A;">
          <tr>
            <td style="padding: 6px 0; font-weight: 600; width: 130px;">Nome:</td>
            <td style="padding: 6px 0;"><strong>${pacienteNome}</strong></td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: 600;">Telefone:</td>
            <td style="padding: 6px 0;">
              ${pacienteTelefone || "Não informado"}
              ${whatsappUrl ? ` — <a href="${whatsappUrl}" style="color: #059669; text-decoration: none; font-weight: 600;">Chamar no WhatsApp</a>` : ""}
            </td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: 600;">E-mail:</td>
            <td style="padding: 6px 0;">${pacienteEmail || "Não informado"}</td>
          </tr>
          ${observacoes ? `
          <tr>
            <td style="padding: 6px 0; font-weight: 600;">Observações:</td>
            <td style="padding: 6px 0; color: #9A3412;">${observacoes}</td>
          </tr>` : ""}
          ${orderNsu ? `
          <tr>
            <td style="padding: 6px 0; font-weight: 600;">Pedido:</td>
            <td style="padding: 6px 0; font-family: monospace; font-size: 12px;">#${orderNsu}</td>
          </tr>` : ""}
        </table>
      </div>

      <p style="text-align: center; color: #7D8C6E; font-size: 12px; margin-top: 24px;">
        INstituto Kalapa — Sistema de Gestão de Agenda & Atendimentos
      </p>
    </div>
  `;

  return await sendEmail(toEmail, `🗓️ Novo Agendamento: ${pacienteNome} em ${dataHoraInicio}`, html);
}

