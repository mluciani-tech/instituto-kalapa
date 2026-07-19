import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase";
import {
  VAGAS_PADRAO,
  TURMA_PADRAO,
  getTurmaAtual,
  getVagasMaximas,
  countInscricoesPagas,
} from "@/lib/vagas";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      preenchidas: 0,
      maximas: VAGAS_PADRAO,
      restantes: VAGAS_PADRAO,
      turma: TURMA_PADRAO,
      mock: true,
      message: "Supabase não configurado.",
    });
  }

  const { searchParams } = new URL(req.url);
  const produtoId = searchParams.get("produto_id");

  try {
    const [maximas, preenchidas, turma] = await Promise.all([
      getVagasMaximas(produtoId),
      countInscricoesPagas(produtoId),
      getTurmaAtual(),
    ]);

    return NextResponse.json({
      preenchidas,
      maximas,
      restantes: Math.max(maximas - preenchidas, 0),
      turma,
    });
  } catch (error) {
    console.error("[api/vagas] Erro:", error);
    return NextResponse.json(
      { preenchidas: 0, maximas: VAGAS_PADRAO, restantes: VAGAS_PADRAO, error: "Erro ao buscar vagas" },
      { status: 500 }
    );
  }
}
