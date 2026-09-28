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

    // 1. Buscar dados oficiais da Facilitadora cadastrados no painel
    const { data: configRows } = await supabaseAdmin!
      .from("configuracoes")
      .select("chave, valor")
      .in("chave", ["facilitadora_nome", "facilitadora_titulo", "facilitadora_foto", "facilitadora_bio"]);

    const configMap: Record<string, string> = {};
    configRows?.forEach((r: { chave: string; valor: string }) => {
      configMap[r.chave] = r.valor;
    });

    const fotoOficial = configMap["facilitadora_foto"]?.trim();
    const nomeOficial = configMap["facilitadora_nome"]?.trim();
    const tituloOficial = configMap["facilitadora_titulo"]?.trim();
    const bioOficial = configMap["facilitadora_bio"]?.trim();

    // 2. Buscar terapeutas no banco
    const { data: therapists, error } = await supabaseAdmin!
      .from("therapists")
      .select("id, nome, titulo, foto_url, bio, ativo")
      .eq("ativo", true)
      .order("created_at", { ascending: true });

    if (error || !therapists || therapists.length === 0) {
      const fallback = {
        ...TERAPEUTA_PADRAO,
        foto_url: fotoOficial || TERAPEUTA_PADRAO.foto_url,
        nome: nomeOficial || TERAPEUTA_PADRAO.nome,
        titulo: tituloOficial || TERAPEUTA_PADRAO.titulo,
        bio: bioOficial || TERAPEUTA_PADRAO.bio,
      };
      return NextResponse.json([fallback]);
    }

    // 3. Garantir que a terapeuta principal sempre respeite a foto e dados oficiais configurados no Admin
    const merged = therapists.map((t, index) => {
      if (index === 0 || t.id === TERAPEUTA_PADRAO.id) {
        const fotoFinal = fotoOficial || t.foto_url || TERAPEUTA_PADRAO.foto_url;
        const nomeFinal = nomeOficial || t.nome || TERAPEUTA_PADRAO.nome;
        const tituloFinal = tituloOficial || t.titulo || TERAPEUTA_PADRAO.titulo;
        const bioFinal = bioOficial || t.bio || TERAPEUTA_PADRAO.bio;

        // Se a foto no banco estiver diferente da foto oficial configurada, sincroniza em background
        if (fotoOficial && t.foto_url !== fotoOficial) {
          supabaseAdmin!
            .from("therapists")
            .update({ foto_url: fotoOficial, updated_at: new Date().toISOString() })
            .eq("id", t.id)
            .then(
              () => {},
              () => {}
            );
        }

        return {
          ...t,
          foto_url: fotoFinal,
          nome: nomeFinal,
          titulo: tituloFinal,
          bio: bioFinal,
        };
      }
      return t;
    });

    return NextResponse.json(merged);
  } catch (err) {
    console.error("[api/agendamentos/therapists] Erro ao buscar terapeutas:", err);
    return NextResponse.json([TERAPEUTA_PADRAO]);
  }
}
