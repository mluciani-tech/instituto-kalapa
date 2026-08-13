import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const produtoId = searchParams.get("produto_id");

    if (!produtoId) {
      return NextResponse.json(
        { error: "produto_id é obrigatório" },
        { status: 400 }
      );
    }

    if (!isAdminConfigured()) {
      return NextResponse.json({ parcelas: [] });
    }

    // Buscar preço do produto
    const { data: produto } = await supabaseAdmin!
      .from("produtos")
      .select("preco")
      .eq("id", produtoId)
      .single();

    const preco = Number(produto?.preco) || 0;

    if (preco <= 0) {
      return NextResponse.json({ parcelas: [] });
    }

    // Política atual: cartão somente à vista (1x) — sem parcelamento.
    // A InfinitePay não permite limitar parcelas via API, então o front
    // exibe apenas 1x e o checkout hospedado decide à parte.
    return NextResponse.json({
      parcelas: [{ qtd: 1, valor: Math.round(preco * 100) / 100, taxa: 0 }],
    });
  } catch (error) {
    console.error("[parcelas] Erro:", error);
    return NextResponse.json({ parcelas: [] });
  }
}
