import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const VAGAS_MAXIMAS = 15;
const TURMA_ATUAL = "2025-01";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      preenchidas: 0,
      maximas: VAGAS_MAXIMAS,
      restantes: VAGAS_MAXIMAS,
      mock: true,
      message: "Supabase não configurado. Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    });
  }

  try {
    const { count, error } = await supabase!
      .from("inscricoes")
      .select("*", { count: "exact", head: true })
      .eq("turma_id", TURMA_ATUAL)
      .eq("status", "confirmada");

    if (error) throw error;

    const preenchidas = count || 0;
    return NextResponse.json({
      preenchidas,
      maximas: VAGAS_MAXIMAS,
      restantes: Math.max(VAGAS_MAXIMAS - preenchidas, 0),
    });
  } catch (error) {
    console.error("[api/vagas] Erro:", error);
    return NextResponse.json(
      { preenchidas: 0, maximas: VAGAS_MAXIMAS, restantes: VAGAS_MAXIMAS, error: "Erro ao buscar vagas" },
      { status: 500 }
    );
  }
}
