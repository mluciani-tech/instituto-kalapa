import { NextRequest, NextResponse } from "next/server";
import { supabase, supabaseAdmin, isSupabaseConfigured, isAdminConfigured } from "@/lib/supabase";

const VAGAS_PADRAO = 15;
const TURMA_PADRAO = "2025-01";

export async function GET(req: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      preenchidas: 0,
      maximas: VAGAS_PADRAO,
      restantes: VAGAS_PADRAO,
      mock: true,
      message: "Supabase não configurado.",
    });
  }

  const { searchParams } = new URL(req.url);
  const produtoId = searchParams.get("produto_id");

  try {
    let turmaAtual = TURMA_PADRAO;
    let vagasMaximas: number | null = null;

    if (isAdminConfigured()) {
      // Busca turma atual
      const { data: config } = await supabaseAdmin!
        .from("configuracoes")
        .select("chave, valor")
        .in("chave", ["turma_atual"]);

      config?.forEach((item) => {
        if (item.chave === "turma_atual") turmaAtual = item.valor;
      });

      // Se tem produto_id, busca o limite específico do produto
      if (produtoId) {
        const { data: produto } = await supabaseAdmin!
          .from("produtos")
          .select("vagas_maximas")
          .eq("id", produtoId)
          .single();

        if (produto?.vagas_maximas != null) {
          vagasMaximas = produto.vagas_maximas;
        }
      }

      // Fallback: se não achou limite no produto, busca global
      if (vagasMaximas == null) {
        const { data: configVagas } = await supabaseAdmin!
          .from("configuracoes")
          .select("valor")
          .eq("chave", "vagas_maximas")
          .single();

        vagasMaximas = configVagas ? Number(configVagas.valor) : VAGAS_PADRAO;
      }
    } else {
      vagasMaximas = VAGAS_PADRAO;
    }

    // Conta inscrições confirmadas
    const { count, error } = await supabase!
      .from("inscricoes")
      .select("*", { count: "exact", head: true })
      .eq("turma_id", turmaAtual)
      .in("status", ["confirmada", "pago"]);

    if (error) throw error;

    const preenchidas = count || 0;
    return NextResponse.json({
      preenchidas,
      maximas: vagasMaximas,
      restantes: Math.max(vagasMaximas - preenchidas, 0),
      turma: turmaAtual,
    });
  } catch (error) {
    console.error("[api/vagas] Erro:", error);
    return NextResponse.json(
      { preenchidas: 0, maximas: VAGAS_PADRAO, restantes: VAGAS_PADRAO, error: "Erro ao buscar vagas" },
      { status: 500 }
    );
  }
}
