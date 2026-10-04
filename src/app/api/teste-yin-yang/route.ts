import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";
import { getClienteFromRequest } from "@/lib/cliente-auth";
import { verificarCreditoDisponivel, consumirCreditoTeste } from "@/lib/testes-creditos";

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

    const clienteLogado = await getClienteFromRequest(req);
    const activeUserId = clienteLogado?.id || usuario_id || null;
    const activeEmail = clienteLogado?.email || email;

    // Verificar se o usuário possui crédito disponível para realizar o teste Yin/Yang
    const { disponivel } = await verificarCreditoDisponivel(
      activeUserId,
      activeEmail,
      "teste-yin-yang"
    );

    if (!disponivel) {
      return NextResponse.json(
        {
          error:
            "Você não possui créditos disponíveis para realizar esta avaliação no INstituto Kalapa. Por favor, adquira o teste em nossa loja antes de enviar as respostas.",
          sem_credito: true,
        },
        { status: 403 }
      );
    }

    let telefone = telefoneInput || "";

    // Se temos usuario_id e telefone não veio no payload, tenta buscar do cadastro do usuário
    if (activeUserId && !telefone) {
      try {
        const { data: usuario } = await supabaseAdmin!
          .from("usuarios")
          .select("telefone")
          .eq("id", activeUserId)
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
        usuario_id: activeUserId,
        nome: String(nome).trim(),
        email: String(activeEmail).trim().toLowerCase(),
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
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 200 }
      );
    }

    // Consumir 1 crédito do teste vinculado a esta avaliação
    if (data?.id) {
      await consumirCreditoTeste(activeUserId, activeEmail, "teste-yin-yang", data.id);
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
