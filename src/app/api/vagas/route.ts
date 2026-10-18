import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase";
import {
  VAGAS_PADRAO,
  TURMA_PADRAO,
  getVagasInfo,
  getVagasInfoBatch,
} from "@/lib/vagas";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const produtoIdsParam = searchParams.get("produto_ids");
  const produtoId = searchParams.get("produto_id");

  if (!isSupabaseConfigured()) {
    if (produtoIdsParam) {
      const ids = produtoIdsParam.split(",").map((s) => s.trim()).filter(Boolean);
      const batchMock: Record<string, unknown> = {};
      for (const id of ids) {
        batchMock[id] = {
          preenchidas: 0,
          maximas: VAGAS_PADRAO,
          restantes: VAGAS_PADRAO,
          turma: TURMA_PADRAO,
          mock: true,
          manual: false,
          reais: 0,
        };
      }
      return NextResponse.json(batchMock);
    }

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

  try {
    if (produtoIdsParam) {
      const ids = produtoIdsParam.split(",").map((s) => s.trim()).filter(Boolean);
      const batchInfo = await getVagasInfoBatch(ids);
      return NextResponse.json(batchInfo);
    }

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
