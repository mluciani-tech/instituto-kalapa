import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";
import { notifyPagamentoConfirmado, sendConfirmacaoCliente } from "@/lib/email";

export const dynamic = "force-dynamic";

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "";

// Placeholders usados quando o comprador não preencheu o formulário
const PLACEHOLDERS = new Set(["N/A", "Participante", "contato@institutokalapa.com.br", "Não informado"]);

function isPlaceholder(value: string | null | undefined): boolean {
  return !value || PLACEHOLDERS.has(value);
}

/** Extrai dados do cliente do payload da InfinitePay (formatos variados) */
function extractCustomer(body: Record<string, unknown>) {
  const customer = (body.customer || body.payer || {}) as Record<string, unknown>;
  const pick = (...keys: string[]): string | null => {
    for (const key of keys) {
      const v = customer[key] ?? body[key];
      if (typeof v === "string" && v.trim()) return v.trim();
    }
    return null;
  };
  return {
    nome: pick("name", "nome", "full_name", "customer_name"),
    email: pick("email", "customer_email"),
    telefone: pick("phone_number", "phone", "telefone", "cellphone", "cell_phone"),
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Verificação de origem: token HMAC por order_nsu (não expõe o secret real na URL)
    if (WEBHOOK_SECRET) {
      const token = req.nextUrl.searchParams.get("token");
      const orderNsu = body.order_nsu;
      if (!orderNsu || !token) {
        console.warn("[webhook] Token ou order_nsu ausente — requisição rejeitada");
        return NextResponse.json(
          { success: false, message: "Não autorizado" },
          { status: 401 }
        );
      }
      const expected = crypto.createHmac("sha256", WEBHOOK_SECRET).update(orderNsu).digest("hex");
      if (!crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected))) {
        console.warn("[webhook] Token HMAC inválido — requisição rejeitada");
        return NextResponse.json(
          { success: false, message: "Não autorizado" },
          { status: 401 }
        );
      }
    } else {
      console.warn("[webhook] WEBHOOK_SECRET não configurado — endpoint sem verificação de origem!");
    }

    console.log("[webhook] Pagamento recebido:", body.order_nsu, body.transaction_nsu);

    const {
      amount,
      paid_amount,
      capture_method,
      transaction_nsu,
      order_nsu,
      receipt_url,
    } = body;

    if (!order_nsu) {
      console.error("[webhook] order_nsu ausente");
      return NextResponse.json(
        { success: false, message: "order_nsu obrigatório" },
        { status: 400 }
      );
    }

    if (!isAdminConfigured()) {
      return NextResponse.json({ success: true, message: null });
    }

    const valorReais = paid_amount ? paid_amount / 100 : amount ? amount / 100 : 0;
    const metodoPagamento = capture_method === "pix" ? "pix" : "cartao";

    // Dados do cliente enviados pela InfinitePay
    const customerData = extractCustomer(body);

    // 1. Buscar pedido pelo order_nsu
    const { data: pedido, error: pedidoError } = await supabaseAdmin!
      .from("pedidos")
      .select("id, status, cliente_nome, cliente_email, cliente_telefone, produtos(nome)")
      .eq("order_nsu", order_nsu)
      .single();

    if (pedidoError || !pedido) {
      console.warn("[webhook] Pedido não encontrado:", order_nsu);
      await fallbackInscricao(order_nsu, valorReais, metodoPagamento, customerData);
      return NextResponse.json({ success: true, message: null });
    }

    // Idempotência: se já está pago, não reprocessar (evita e-mail duplicado)
    if (pedido.status === "pago") {
      console.log("[webhook] Pedido já processado:", pedido.id);
      return NextResponse.json({ success: true, message: null });
    }

    // 2. Atualizar pedido — preencher dados do cliente se eram placeholder
    const pedidoUpdate: Record<string, unknown> = {
      status: "pago",
      metodo_pagamento: metodoPagamento,
      transaction_nsu: transaction_nsu || null,
      receipt_url: receipt_url || null,
      capture_method: capture_method || null,
      valor: valorReais,
      updated_at: new Date().toISOString(),
    };

    if (customerData.nome && isPlaceholder(pedido.cliente_nome)) {
      pedidoUpdate.cliente_nome = customerData.nome;
    }
    if (customerData.email && isPlaceholder(pedido.cliente_email)) {
      pedidoUpdate.cliente_email = customerData.email;
    }
    if (customerData.telefone && isPlaceholder(pedido.cliente_telefone)) {
      pedidoUpdate.cliente_telefone = customerData.telefone;
    }

    await supabaseAdmin!.from("pedidos").update(pedidoUpdate).eq("id", pedido.id);

    console.log("[webhook] Pedido atualizado:", pedido.id);

    // 3. Atualizar inscrição vinculada
    let inscricao: { id: string; nome: string; email: string; telefone: string | null } | null = null;

    const { data: inscricaoPorPedido } = await supabaseAdmin!
      .from("inscricoes")
      .select("id, nome, email, telefone")
      .eq("pedido_id", pedido.id)
      .limit(1)
      .single();

    inscricao = inscricaoPorPedido;

    if (!inscricao) {
      const { data: inscricaoLegado } = await supabaseAdmin!
        .from("inscricoes")
        .select("id, nome, email, telefone")
        .eq("order_nsu", order_nsu)
        .limit(1)
        .single();
      inscricao = inscricaoLegado;
    }

    if (inscricao) {
      const inscricaoUpdate: Record<string, unknown> = {
        status: "pago",
        metodo_pagamento: metodoPagamento,
        valor: valorReais,
      };

      if (customerData.nome && isPlaceholder(inscricao.nome)) {
        inscricaoUpdate.nome = customerData.nome;
      }
      if (customerData.email && isPlaceholder(inscricao.email)) {
        inscricaoUpdate.email = customerData.email;
      }
      if (customerData.telefone && isPlaceholder(inscricao.telefone)) {
        inscricaoUpdate.telefone = customerData.telefone;
      }

      await supabaseAdmin!.from("inscricoes").update(inscricaoUpdate).eq("id", inscricao.id);
      console.log("[webhook] Inscrição atualizada:", inscricao.id);
    }

    // 4. Enviar e-mails (notificação interna + confirmação ao cliente)
    const produtos = pedido.produtos as { nome: string } | { nome: string }[] | null;
    const nomeProduto = Array.isArray(produtos) ? produtos[0]?.nome : produtos?.nome;

    const nomeFinal = (pedidoUpdate.cliente_nome as string) || inscricao?.nome || "Participante";
    const emailFinal = (pedidoUpdate.cliente_email as string) || inscricao?.email || "";
    const telefoneFinal = (pedidoUpdate.cliente_telefone as string) || inscricao?.telefone || null;

    await notifyPagamentoConfirmado({
      nome: nomeFinal,
      email: emailFinal || "Não informado",
      telefone: telefoneFinal,
      produto: nomeProduto || "Serviço",
      valor: valorReais,
      metodo: metodoPagamento,
      orderNsu: order_nsu,
    });

    // Só envia e-mail ao cliente se tivermos um e-mail real
    if (emailFinal && !isPlaceholder(emailFinal)) {
      await sendConfirmacaoCliente({
        nome: nomeFinal,
        email: emailFinal,
        produto: nomeProduto || "Serviço",
        valor: valorReais,
      });
    }

    return NextResponse.json({ success: true, message: null });
  } catch (error) {
    console.error("[webhook] Erro:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao processar webhook" },
      { status: 400 }
    );
  }
}

// Fallback para inscrições legadas (sem pedido vinculado)
async function fallbackInscricao(
  order_nsu: string,
  valorReais: number,
  metodoPagamento: string,
  customerData: { nome: string | null; email: string | null; telefone: string | null }
) {
  try {
    const { data: inscricao } = await supabaseAdmin!
      .from("inscricoes")
      .select("id, nome, email, telefone")
      .eq("order_nsu", order_nsu)
      .limit(1)
      .single();

    if (!inscricao) {
      console.warn("[webhook] Fallback: nenhuma inscrição encontrada para:", order_nsu);
      return;
    }

    const update: Record<string, unknown> = {
      status: "pago",
      metodo_pagamento: metodoPagamento,
      valor: valorReais,
    };

    if (customerData.nome && isPlaceholder(inscricao.nome)) update.nome = customerData.nome;
    if (customerData.email && isPlaceholder(inscricao.email)) update.email = customerData.email;
    if (customerData.telefone && isPlaceholder(inscricao.telefone)) update.telefone = customerData.telefone;

    await supabaseAdmin!.from("inscricoes").update(update).eq("id", inscricao.id);
    console.log("[webhook] Fallback: inscrição atualizada:", inscricao.id);
  } catch (err) {
    console.error("[webhook] Erro no fallback:", err);
  }
}
