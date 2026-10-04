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

    const clienteLogado = await getClienteFromRequest(req);
    const activeUserId = clienteLogado?.id || usuario_id || null;
    const activeEmail = clienteLogado?.email || email;

    // Verificar se o usuário possui crédito disponível para realizar o teste Eneagrama
    const { disponivel } = await verificarCreditoDisponivel(
      activeUserId,
      activeEmail,
      "teste-eneagrama"
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
      .from("avaliacoes_eneagrama")
      .insert({
        usuario_id: activeUserId,
        nome: String(nome).trim(),
        email: String(activeEmail).trim().toLowerCase(),
        telefone: telefone ? String(telefone).trim() : null,
        tipos_principais: tipos,
        pontuacoes: pontuacoes || {},
        respostas: respostas || {},
      })
      .select("id")
      .single();

    if (error) {
      console.error("Erro ao salvar avaliação Eneagrama no banco:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 200 });
    }

    // Consumir 1 crédito do teste vinculado a esta avaliação
    if (data?.id) {
      await consumirCreditoTeste(activeUserId, activeEmail, "teste-eneagrama", data.id);
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
