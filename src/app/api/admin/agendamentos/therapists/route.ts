import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/admin-auth";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const TERAPEUTA_PADRAO = {
  id: "e7f53a4e-1288-4e89-b051-5b7415444b01",
  nome: "Clatihúcia Capeli",
  titulo: "Facilitadora, Psicóloga, Psicogenealogista, Terapeuta Sistêmica e Transpessoal",
  email: "contato@institutokalapa.com.br",
  telefone: "(11) 99999-9999",
  foto_url: "/foto_10.jpg",
  bio: "Com mais de 10 anos de dedicação ao cuidado emocional e ao desenvolvimento humano, Clatihúcia Capeli conduz vivências e atendimentos que acolhem a dor sem julgamentos.",
  ativo: true,
};

// GET: Buscar terapeutas para o painel administrativo
export async function GET(req: NextRequest) {
  try {
    const isAuthed = await checkAdminAuth(req);
    if (!isAuthed) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    if (!isAdminConfigured()) {
      return NextResponse.json({ therapists: [TERAPEUTA_PADRAO] });
    }

    const { data: therapists, error } = await supabaseAdmin!
      .from("therapists")
      .select("id, nome, titulo, email, telefone, foto_url, bio, ativo")
      .order("created_at", { ascending: true });

    if (error || !therapists || therapists.length === 0) {
      return NextResponse.json({ therapists: [TERAPEUTA_PADRAO] });
    }

    return NextResponse.json({ therapists });
  } catch (err) {
    console.error("[api/admin/agendamentos/therapists] Erro ao listar terapeutas:", err);
    return NextResponse.json({ therapists: [TERAPEUTA_PADRAO] });
  }
}

// PATCH: Atualizar configurações do terapeuta (especialmente email de notificação)
export async function PATCH(req: NextRequest) {
  try {
    const isAuthed = await checkAdminAuth(req);
    if (!isAuthed) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    if (!isAdminConfigured()) {
      return NextResponse.json({ error: "Banco de dados não configurado" }, { status: 500 });
    }

    const body = await req.json();
    const { id, email, telefone, nome, titulo, bio, ativo } = body;

    if (!id) {
      return NextResponse.json({ error: "id do terapeuta é obrigatório" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (email !== undefined) updateData.email = email ? String(email).trim().toLowerCase() : null;
    if (telefone !== undefined) updateData.telefone = telefone ? String(telefone).trim() : null;
    if (nome !== undefined) updateData.nome = String(nome).trim();
    if (titulo !== undefined) updateData.titulo = titulo ? String(titulo).trim() : null;
    if (bio !== undefined) updateData.bio = bio ? String(bio).trim() : null;
    if (ativo !== undefined) updateData.ativo = Boolean(ativo);

    const { data, error } = await supabaseAdmin!
      .from("therapists")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[api/admin/agendamentos/therapists] Erro ao atualizar terapeuta:", error);
      return NextResponse.json({ error: "Erro ao atualizar dados do terapeuta" }, { status: 500 });
    }

    return NextResponse.json({ success: true, therapist: data });
  } catch (err) {
    console.error("[api/admin/agendamentos/therapists] Erro inesperado:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
