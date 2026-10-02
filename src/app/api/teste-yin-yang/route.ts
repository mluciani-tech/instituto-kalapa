import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      usuario_id,
      nome,
      email,
      telefone: telefoneInput,
      tipo_resultado,
      pontos_yang,
      pontos_yin,
      respostas,
    } = body;

    if (!nome || !email || !tipo_resultado) {
      return NextResponse.json(
        { error: "Dados obrigatórios não informados (nome, email, tipo_resultado)." },
        { status: 400 }
      );
    }

    if (!isAdminConfigured()) {
      return NextResponse.json(
        { message: "Avaliação recebida, mas banco não configurado." },
        { status: 200 }
      );
    }

    let telefone = telefoneInput || "";

    // Se temos usuario_id e telefone não veio no payload, tenta buscar do cadastro do usuário
    if (usuario_id && !telefone) {
      try {
        const { data: usuario } = await supabaseAdmin!
          .from("usuarios")
          .select("telefone")
          .eq("id", usuario_id)
          .maybeSingle();

        if (usuario?.telefone) {
          telefone = usuario.telefone;
        }
      } catch (err) {
        console.warn("Não foi possível buscar telefone do usuário:", err);
      }
    }

    const { data, error } = await supabaseAdmin!
      .from("avaliacoes_yin_yang")
      .insert({
        usuario_id: usuario_id || null,
        nome: String(nome).trim(),
        email: String(email).trim().toLowerCase(),
        telefone: telefone ? String(telefone).trim() : null,
        tipo_resultado,
        pontos_yang: Number(pontos_yang) || 0,
        pontos_yin: Number(pontos_yin) || 0,
        respostas: respostas || {},
      })
      .select("id")
      .single();

    if (error) {
      console.error("Erro ao salvar avaliação Yin/Yang no banco:", error);
      // Retornamos 200 com status informativo para não travar a experiência do usuário no front-end
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 200 }
      );
    }

    return NextResponse.json({ success: true, id: data?.id }, { status: 201 });
  } catch (err: unknown) {
    console.error("Exceção na rota POST /api/teste-yin-yang:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
