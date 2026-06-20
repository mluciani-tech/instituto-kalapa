import { NextResponse } from "next/server";
import { supabase, supabaseAdmin, isSupabaseConfigured, isAdminConfigured } from "@/lib/supabase";

const VAGAS_PADRAO = 15;
const TURMA_PADRAO = "2025-01";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      preenchidas: 0,
      maximas: VAGAS_PADRAO,
      restantes: VAGAS_PADRAO,
      mock: true,
      message: "Supabase não configurado. Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    });
  }

  try {
    // Buscar configurações dinâmicas
    let vagasMaximas = VAGAS_PADRAO;
    let turmaAtual = TURMA_PADRAO;

    if (isAdminConfigured()) {
      const { data: config } = await supabaseAdmin!
        .from("configuracoes")
        .select("chave, valor")
        .in("chave", ["vagas_maximas", "turma_atual"]);

      config?.forEach((item) => {
        if (item.chave === "vagas_maximas") vagasMaximas = Number(item.valor);
        if (item.chave === "turma_atual") turmaAtual = item.valor;
      });
    }

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
