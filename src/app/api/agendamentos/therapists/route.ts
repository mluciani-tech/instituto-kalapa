import { NextResponse } from "next/server";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const TERAPEUTA_PADRAO = {
  id: "e7f53a4e-1288-4e89-b051-5b7415444b01",
  nome: "Clatihúcia Capeli",
  titulo: "Facilitadora, Psicóloga, Psicogenealogista, Terapeuta Sistêmica e Transpessoal",
  foto_url: "/foto_10.jpg",
  bio: "Com mais de 10 anos de dedicação ao cuidado emocional e ao desenvolvimento humano, Clatihúcia Capeli conduz vivências e atendimentos que acolhem a dor sem julgamentos.",
  ativo: true,
};

export async function GET() {
  try {
    if (!isAdminConfigured()) {
      return NextResponse.json([TERAPEUTA_PADRAO]);
    }

    const { data: therapists, error } = await supabaseAdmin!
      .from("therapists")
      .select("id, nome, titulo, foto_url, bio, ativo")
      .eq("ativo", true)
      .order("created_at", { ascending: true });

    if (error || !therapists || therapists.length === 0) {
      return NextResponse.json([TERAPEUTA_PADRAO]);
    }

    return NextResponse.json(therapists);
  } catch (err) {
    console.error("[api/agendamentos/therapists] Erro ao buscar terapeutas:", err);
    return NextResponse.json([TERAPEUTA_PADRAO]);
  }
}
