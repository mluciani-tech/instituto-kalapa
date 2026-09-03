import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { codigo, subtotal } = await req.json();

    if (!codigo || typeof codigo !== "string" || !codigo.trim()) {
      return NextResponse.json(
        { error: "Informe o código do cupom" },
        { status: 400 }
      );
    }

    if (subtotal == null || isNaN(Number(subtotal)) || Number(subtotal) <= 0) {
      return NextResponse.json(
        { error: "Subtotal do pedido inválido" },
        { status: 400 }
      );
    }

    if (!isAdminConfigured()) {
      return NextResponse.json(
        { error: "Banco de dados não configurado" },
        { status: 500 }
      );
    }

    const codigoNorm = codigo.trim().toUpperCase();
    const valorSubtotal = Number(subtotal);

    const { data: cupom, error } = await supabaseAdmin!
      .from("cupons")
      .select("id, codigo, tipo, valor, quantidade_maxima, quantidade_utilizada, valor_minimo_pedido, validade, ativo")
      .eq("codigo", codigoNorm)
      .single();

    if (error || !cupom) {
      return NextResponse.json(
        { error: "Cupom inválido ou não encontrado." },
        { status: 404 }
      );
    }

    if (!cupom.ativo) {
      return NextResponse.json(
        { error: "Este cupom não está mais ativo." },
        { status: 400 }
      );
    }

    // Checar validade (expiração)
    if (cupom.validade && new Date(cupom.validade) < new Date()) {
      return NextResponse.json(
        { error: "Este cupom expirou." },
        { status: 400 }
      );
    }

    // Checar limite de utilizações
    if (
      cupom.quantidade_maxima != null &&
      (cupom.quantidade_utilizada || 0) >= cupom.quantidade_maxima
    ) {
      return NextResponse.json(
        { error: "Este cupom atingiu o limite máximo de utilizações." },
        { status: 400 }
      );
    }

    // Checar valor mínimo do pedido
    if (cupom.valor_minimo_pedido && valorSubtotal < Number(cupom.valor_minimo_pedido)) {
      return NextResponse.json(
        {
          error: `O valor mínimo para aplicar este cupom é de R$ ${Number(
            cupom.valor_minimo_pedido
          ).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}.`,
        },
        { status: 400 }
      );
    }

    // Calcular desconto
    let desconto = 0;
    if (cupom.tipo === "porcentagem") {
      desconto = (valorSubtotal * Number(cupom.valor)) / 100;
    } else {
      desconto = Number(cupom.valor);
    }

    // Não permitir desconto maior que o subtotal
    desconto = Math.min(desconto, valorSubtotal);
    const totalComDesconto = Math.max(0, valorSubtotal - desconto);

    return NextResponse.json({
      valid: true,
      cupom: {
        id: cupom.id,
        codigo: cupom.codigo,
        tipo: cupom.tipo,
        valor: Number(cupom.valor),
      },
      desconto: Math.round(desconto * 100) / 100,
      totalComDesconto: Math.round(totalComDesconto * 100) / 100,
    });
  } catch (error) {
    console.error("[cupons/validar] Erro:", error);
    return NextResponse.json(
      { error: "Erro ao validar cupom" },
      { status: 500 }
    );
  }
}
