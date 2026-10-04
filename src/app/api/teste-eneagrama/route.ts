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
      tipos_principais,
      pontuacoes,
      respostas,
    } = body;

    if (
      !nome ||
      !email ||
      !Array.isArray(tipos_principais) ||
      tipos_principais.length === 0
    ) {
      return NextResponse.json(
        { error: "Dados obrigatórios não informados (nome, email, tipos_principais)." },
        { status: 400 }
      );
    }

    const tipos = tipos_principais
      .map((t: unknown) => Number(t))
      .filter((t: number) => Number.isInteger(t) && t >= 1 && t <= 9);

    if (tipos.length === 0) {
      return NextResponse.json({ error: "tipos_principais inválido." }, { status: 400 });
    }

    if (!isAdminConfigured()) {
      return NextResponse.json(
        { message: "Avaliação recebida, mas banco não configurado." },
        { status: 200 }
      );
    }

    let telefone = telefoneInput || "";

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
      .from("avaliacoes_eneagrama")
      .insert({
        usuario_id: usuario_id || null,
        nome: String(nome).trim(),
        email: String(email).trim().toLowerCase(),
        telefone: telefone ? String(telefone).trim() : null,
        tipos_principais: tipos,
        pontuacoes: pontuacoes || {},
        respostas: respostas || {},
      })
      .select("id")
      .single();

    if (error) {
      console.error("Erro ao salvar avaliação Eneagrama no banco:", error);
      // 200 informativo para não travar a experiência do usuário no front-end
      return NextResponse.json({ success: false, error: error.message }, { status: 200 });
    }

    return NextResponse.json({ success: true, id: data?.id }, { status: 201 });
  } catch (err: unknown) {
    console.error("Exceção na rota POST /api/teste-eneagrama:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
