import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";
import { getTurmaAtual, getVagasMaximas, countInscricoesPagas } from "@/lib/vagas";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { produto_id, inscricao } = body;

    if (!produto_id) {
      return NextResponse.json(
        { error: "produto_id é obrigatório" },
        { status: 400 }
      );
    }

    if (!isAdminConfigured()) {
      return NextResponse.json(
        { error: "Supabase não configurado" },
        { status: 500 }
      );
    }

    // 1. Buscar produto
    const { data: produto, error: produtoError } = await supabaseAdmin!
      .from("produtos")
      .select("id, nome, preco, vagas_maximas, ativo")
      .eq("id", produto_id)
      .eq("ativo", true)
      .single();

    if (produtoError || !produto) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    // 2. Verificar vagas
    if (produto.vagas_maximas != null) {
      const [maximas, preenchidas] = await Promise.all([
        getVagasMaximas(produto.id),
        countInscricoesPagas(produto.id),
      ]);

      if (preenchidas >= maximas) {
        return NextResponse.json(
          { error: "Turma lotada. Entre em contato para a próxima turma." },
          { status: 409 }
        );
      }
    }

    // 3. Criar pedido — status "confirmado" (sem pagamento)
    const orderNsu = `kalapa-${crypto.randomUUID()}`;
    const turmaAtual = await getTurmaAtual();

    const { data: pedido, error: pedidoError } = await supabaseAdmin!
      .from("pedidos")
      .insert({
        order_nsu: orderNsu,
        produto_id: produto.id,
        cliente_nome: inscricao?.nome || "N/A",
        cliente_email: inscricao?.email || "N/A",
        cliente_telefone: inscricao?.telefone || null,
        valor: 0,
        status: "confirmado",
        metodo_pagamento: "gratuito",
      })
      .select("id")
      .single();

    if (pedidoError) {
      console.error("[checkout-gratuito] Erro ao criar pedido:", pedidoError);
      return NextResponse.json(
        { error: "Erro ao registrar inscrição" },
        { status: 500 }
      );
    }

    // 4. Criar inscrição — status "confirmado"
    if (inscricao) {
      const { error: inscricaoError } = await supabaseAdmin!
        .from("inscricoes")
        .insert({
          turma_id: turmaAtual,
          order_nsu: orderNsu,
          pedido_id: pedido.id,
          nome: inscricao.nome,
          email: inscricao.email,
          telefone: inscricao.telefone,
          motivacao: inscricao.motivacao || null,
          metodo_pagamento: "gratuito",
          valor: 0,
          status: "confirmado",
        });

      if (inscricaoError) {
        console.error("[checkout-gratuito] Erro ao criar inscrição:", inscricaoError);
      }
    }

    return NextResponse.json({
      order_nsu: orderNsu,
      gratuito: true,
    });
  } catch (error) {
    console.error("[checkout-gratuito] Erro inesperado:", error);
    return NextResponse.json(
      { error: "Erro ao processar inscrição" },
      { status: 500 }
    );
  }
}
