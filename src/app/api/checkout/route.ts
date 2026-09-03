import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";
import { getTurmaAtual, getVagasMaximas, countInscricoesPagas } from "@/lib/vagas";
import { getClienteFromRequest } from "@/lib/cliente-auth";
import type { PedidoItem, EnderecoEntrega } from "@/lib/types";

export const dynamic = "force-dynamic";

const INFINITEPAY_API = "https://api.checkout.infinitepay.io/links";
const INFINITEPAY_HANDLE = process.env.INFINITEPAY_HANDLE || "kalapa";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://instituto-kalapa.vercel.app";
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "";

function formatPhoneE164(phone: string): string {
  const numbers = (phone || "").replace(/\D/g, "");
  if (!numbers) return "";
  if (numbers.startsWith("55")) return `+${numbers}`;
  return `+55${numbers}`;
}

export async function POST(req: NextRequest) {
  try {
    if (!isAdminConfigured()) {
      return NextResponse.json(
        { error: "Supabase não configurado" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { produto_id, itens: cartItens, customer: customerBody, inscricao, cupom_codigo } = body;

    // Verificar se o cliente está logado via cookie HttpOnly
    const clienteLogado = await getClienteFromRequest(req);

    // 1. Determinar lista de itens do pedido
    const itensProcessados: {
      produto_id: string;
      nome: string;
      quantidade: number;
      precoUnitario: number;
      vagasMaximas: number | null;
      imagem_url?: string | null;
    }[] = [];

    if (Array.isArray(cartItens) && cartItens.length > 0) {
      // Modo Carrinho (multi-produtos)
      for (const item of cartItens) {
        const { data: prod } = await supabaseAdmin!
          .from("produtos")
          .select("id, nome, preco, vagas_maximas, ativo, imagem_url")
          .eq("id", item.produto_id)
          .eq("ativo", true)
          .single();

        if (prod) {
          itensProcessados.push({
            produto_id: prod.id,
            nome: prod.nome,
            quantidade: Number(item.quantidade) || 1,
            precoUnitario: Number(prod.preco) || 0,
            vagasMaximas: prod.vagas_maximas,
            imagem_url: prod.imagem_url,
          });
        }
      }
    } else if (produto_id) {
      // Modo Produto Único / Legado
      const { data: prod, error: produtoError } = await supabaseAdmin!
        .from("produtos")
        .select("id, nome, preco, vagas_maximas, ativo, imagem_url")
        .eq("id", produto_id)
        .eq("ativo", true)
        .single();

      if (produtoError || !prod) {
        return NextResponse.json(
          { error: "Produto não encontrado" },
          { status: 404 }
        );
      }

      itensProcessados.push({
        produto_id: prod.id,
        nome: prod.nome,
        quantidade: 1,
        precoUnitario: Number(prod.preco) || 0,
        vagasMaximas: prod.vagas_maximas,
        imagem_url: prod.imagem_url,
      });
    }

    if (itensProcessados.length === 0) {
      return NextResponse.json(
        { error: "Nenhum produto válido selecionado" },
        { status: 400 }
      );
    }

    // 2. Verificar vagas de vivências no servidor (fecha race condition)
    for (const item of itensProcessados) {
      if (item.vagasMaximas != null) {
        const [maximas, preenchidas] = await Promise.all([
          getVagasMaximas(item.produto_id),
          countInscricoesPagas(item.produto_id),
        ]);

        if (preenchidas >= maximas) {
          return NextResponse.json(
            { error: `Vagas esgotadas para "${item.nome}".` },
            { status: 409 }
          );
        }
      }
    }

    // 3. Calcular subtotal original
    const subtotal = itensProcessados.reduce(
      (sum, item) => sum + item.precoUnitario * item.quantidade,
      0
    );

    // 4. Validar Cupom de Desconto (OPCIONAL)
    let cupomId: string | null = null;
    let cupomCodigoFinal: string | null = null;
    let valorDesconto = 0;

    if (cupom_codigo && typeof cupom_codigo === "string" && cupom_codigo.trim()) {
      const codigoNorm = cupom_codigo.trim().toUpperCase();
      const { data: cupom } = await supabaseAdmin!
        .from("cupons")
        .select("id, codigo, tipo, valor, quantidade_maxima, quantidade_utilizada, valor_minimo_pedido, validade, ativo")
        .eq("codigo", codigoNorm)
        .eq("ativo", true)
        .single();

      if (cupom) {
        const expirado = cupom.validade && new Date(cupom.validade) < new Date();
        const esgotado = cupom.quantidade_maxima != null && (cupom.quantidade_utilizada || 0) >= cupom.quantidade_maxima;
        const minimoNaoAtingido = cupom.valor_minimo_pedido && subtotal < Number(cupom.valor_minimo_pedido);

        if (!expirado && !esgotado && !minimoNaoAtingido) {
          cupomId = cupom.id;
          cupomCodigoFinal = cupom.codigo;
          if (cupom.tipo === "porcentagem") {
            valorDesconto = (subtotal * Number(cupom.valor)) / 100;
          } else {
            valorDesconto = Number(cupom.valor);
          }
          valorDesconto = Math.min(valorDesconto, subtotal);
        }
      }
    }

    const valorFinal = Math.max(0, subtotal - valorDesconto);
    const precoFinalCentavos = Math.round(valorFinal * 100);

    // 5. Consolidar dados do cliente (prioriza conta do usuário autenticado)
    let clienteNome = clienteLogado?.nome || customerBody?.name || inscricao?.nome || "Participante";
    let clienteEmail = clienteLogado?.email || customerBody?.email || inscricao?.email || "N/A";
    let clienteTelefone = clienteLogado?.telefone || customerBody?.phone_number || inscricao?.telefone || null;
    let clienteCpf = clienteLogado?.cpf || customerBody?.document || customerBody?.cpf || null;

    let enderecoEntrega: EnderecoEntrega | null = null;
    if (clienteLogado) {
      enderecoEntrega = {
        cep: clienteLogado.cep,
        rua: clienteLogado.rua,
        numero: clienteLogado.numero,
        complemento: clienteLogado.complemento,
        bairro: clienteLogado.bairro,
        cidade: clienteLogado.cidade,
        uf: clienteLogado.uf,
      };
    } else if (customerBody?.address) {
      enderecoEntrega = customerBody.address;
    }

    const orderNsu = `kalapa-${crypto.randomUUID()}`;
    const turmaAtual = await getTurmaAtual();

    const pedidoItensData: PedidoItem[] = itensProcessados.map((item) => ({
      produto_id: item.produto_id,
      nome: item.nome,
      quantidade: item.quantidade,
      preco: item.precoUnitario,
      imagem_url: item.imagem_url || null,
    }));

    // 6. Criar pedido no banco
    const { data: pedido, error: pedidoError } = await supabaseAdmin!
      .from("pedidos")
      .insert({
        order_nsu: orderNsu,
        produto_id: itensProcessados[0]?.produto_id || null,
        usuario_id: clienteLogado?.id || null,
        cliente_nome: clienteNome,
        cliente_email: clienteEmail,
        cliente_telefone: clienteTelefone,
        cliente_cpf: clienteCpf,
        endereco_entrega: enderecoEntrega,
        itens: pedidoItensData,
        valor: valorFinal,
        valor_desconto: valorDesconto > 0 ? valorDesconto : 0,
        cupom_id: cupomId,
        cupom_codigo: cupomCodigoFinal,
        status: "pendente",
      })
      .select("id")
      .single();

    if (pedidoError) {
      console.error("[checkout] Erro ao criar pedido:", pedidoError);
      return NextResponse.json(
        { error: "Erro ao registrar pedido" },
        { status: 500 }
      );
    }

    // 7. Criar inscrição vinculada se for serviço/vivência
    if (inscricao || itensProcessados.some((i) => i.vagasMaximas != null)) {
      await supabaseAdmin!.from("inscricoes").insert({
        turma_id: turmaAtual,
        order_nsu: orderNsu,
        pedido_id: pedido.id,
        nome: clienteNome,
        email: clienteEmail,
        telefone: clienteTelefone || "Não informado",
        motivacao: inscricao?.motivacao || "Compra via E-commerce",
        metodo_pagamento: inscricao?.metodoPagamento || "infinitepay",
        valor: valorFinal,
        status: "pendente",
      });
    }

    // 8. Montar itens para a InfinitePay
    // Para distribuir o desconto com precisão centavo a centavo nos itens da InfinitePay:
    let infinitePayItems: { quantity: number; price: number; description: string }[] = [];

    if (valorDesconto > 0 && subtotal > 0) {
      const fator = valorFinal / subtotal;
      infinitePayItems = itensProcessados.map((item) => ({
        quantity: item.quantidade,
        price: Math.max(1, Math.round(item.precoUnitario * fator * 100)),
        description: item.nome,
      }));
    } else {
      infinitePayItems = itensProcessados.map((item) => ({
        quantity: item.quantidade,
        price: Math.round(item.precoUnitario * 100),
        description: item.nome,
      }));
    }

    const webhookToken = WEBHOOK_SECRET
      ? crypto.createHmac("sha256", WEBHOOK_SECRET).update(orderNsu).digest("hex")
      : "";

    const webhookUrl = webhookToken
      ? `${SITE_URL}/api/webhook?token=${webhookToken}`
      : `${SITE_URL}/api/webhook`;

    const payload: Record<string, unknown> = {
      handle: INFINITEPAY_HANDLE,
      items: infinitePayItems,
      order_nsu: orderNsu,
      redirect_url: `${SITE_URL}/checkout/sucesso`,
      webhook_url: webhookUrl,
    };

    // 9. Repassar TODOS os dados do cliente para a InfinitePay evitando qualquer retrabalho
    const infiniteCustomer: Record<string, unknown> = {};
    if (clienteNome && clienteNome !== "Participante") infiniteCustomer.name = clienteNome;
    if (clienteEmail && clienteEmail !== "N/A") infiniteCustomer.email = clienteEmail;

    if (clienteTelefone) {
      const formattedPhone = formatPhoneE164(clienteTelefone);
      if (formattedPhone.length >= 12) infiniteCustomer.phone_number = formattedPhone;
    }

    if (clienteCpf) {
      const cleanCpf = clienteCpf.replace(/\D/g, "");
      if (cleanCpf.length === 11) infiniteCustomer.cpf = cleanCpf;
    }

    if (enderecoEntrega) {
      infiniteCustomer.address = {
        street: enderecoEntrega.rua,
        number: enderecoEntrega.numero,
        complement: enderecoEntrega.complemento || "",
        district: enderecoEntrega.bairro,
        city: enderecoEntrega.cidade,
        state: enderecoEntrega.uf,
        zip_code: enderecoEntrega.cep.replace(/\D/g, ""),
      };
    }

    if (Object.keys(infiniteCustomer).length > 0) {
      payload.customer = infiniteCustomer;
    }

    const response = await fetch(INFINITEPAY_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[checkout] Erro da InfinitePay:", data);
      await supabaseAdmin!.from("inscricoes").delete().eq("pedido_id", pedido.id);
      await supabaseAdmin!.from("pedidos").delete().eq("id", pedido.id);
      return NextResponse.json(
        { error: "Erro ao criar link de pagamento", details: data },
        { status: response.status }
      );
    }

    const checkoutUrl = data.url || data.link || data.checkout_url;

    return NextResponse.json({
      url: checkoutUrl,
      order_nsu: orderNsu,
    });
  } catch (error) {
    console.error("[checkout] Erro inesperado:", error);
    return NextResponse.json(
      { error: "Erro ao processar checkout" },
      { status: 500 }
    );
  }
}
