// Envio de e-mails via Resend (server-side apenas).
// Sem RESEND_API_KEY configurada, apenas loga no console (mock).

const EMAIL_FROM = process.env.KALAPA_EMAIL_FROM || "contato@institutokalapa.com.br";
const EMAIL_TO = process.env.KALAPA_EMAIL_TO || "contato@institutokalapa.com.br";

const apiKey = process.env.RESEND_API_KEY;
const isResendConfigured =
  !!apiKey && apiKey !== "re_sua_key_aqui" && apiKey.startsWith("re_");

export const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  if (!isResendConfigured) {
    console.log("=========================================");
    console.log("MOCK: E-MAIL NÃO ENVIADO (RESEND_API_KEY ausente)");
    console.log(`Para: ${to}`);
    console.log(`Assunto: ${subject}`);
    console.log("=========================================");
    return;
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: `INstituto Kalapa <${EMAIL_FROM}>`,
      to: [to],
      subject,
      html,
    });
    if (error) {
      console.error("[email] Erro do Resend:", error);
    }
  } catch (err) {
    console.error("[email] Erro inesperado:", err);
  }
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
