import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

interface Parcela {
  qtd: number;
  valor: number;
  taxa?: number;
}

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
      return NextResponse.json({ parcelas: getDefaultParcelas(0) });
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

    // Tentar buscar taxas da InfinitePay
    const infinitePayHandle = process.env.INFINITEPAY_HANDLE || "kalapa";
    try {
      const response = await fetch(
        `https://api.checkout.infinitepay.io/merchants/${infinitePayHandle}/installments`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );

      if (response.ok) {
        const data = await response.json();
        // A API pode retornar as taxas por parcela
        if (data && Array.isArray(data.installments)) {
          const parcelas: Parcela[] = data.installments
            .filter((inst: { installment_number: number }) => inst.installment_number <= 3)
            .map((inst: { installment_number: number; tax_percentage?: number }) => {
              const qtd = inst.installment_number;
              const taxa = inst.tax_percentage || 0;
              const valorComTaxa = (preco * (1 + taxa / 100)) / qtd;
              return {
                qtd,
                valor: Math.round(valorComTaxa * 100) / 100,
                taxa,
              };
            });
          if (parcelas.length > 0) {
            return NextResponse.json({ parcelas });
          }
        }
      }
    } catch {
      // API indisponível — usar fallback
    }

    // Fallback: parcelas sem juros (padrão)
    return NextResponse.json({ parcelas: getDefaultParcelas(preco) });
  } catch (error) {
    console.error("[parcelas] Erro:", error);
    return NextResponse.json({ parcelas: [] });
  }
}

function getDefaultParcelas(preco: number): Parcela[] {
  if (preco <= 0) return [];
  return [
    { qtd: 1, valor: preco },
    { qtd: 2, valor: Math.round((preco / 2) * 100) / 100 },
    { qtd: 3, valor: Math.round((preco / 3) * 100) / 100 },
  ];
}
