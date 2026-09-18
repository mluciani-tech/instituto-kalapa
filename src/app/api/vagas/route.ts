import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase";
import {
  VAGAS_PADRAO,
  TURMA_PADRAO,
  getVagasInfo,
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
      manual: false,
      reais: 0,
      message: "Supabase não configurado.",
    });
  }

  const { searchParams } = new URL(req.url);
  const produtoId = searchParams.get("produto_id");

  try {
    const info = await getVagasInfo(produtoId);
    return NextResponse.json(info);
  } catch (error) {
    console.error("[api/vagas] Erro:", error);
    return NextResponse.json(
      {
        preenchidas: 0,
        maximas: VAGAS_PADRAO,
        restantes: VAGAS_PADRAO,
        turma: TURMA_PADRAO,
        manual: false,
        reais: 0,
        error: "Erro ao buscar vagas",
      },
      { status: 500 }
    );
  }
}
