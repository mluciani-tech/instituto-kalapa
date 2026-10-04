import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";
import { getClienteFromRequest } from "@/lib/cliente-auth";
import {
  verificarCreditoDisponivel,
  consumirCreditoTeste,
  isTesteGratuito,
} from "@/lib/testes-creditos";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      usuario_id,
      nome,
      email,
      telefone: telefoneInput,
      pontuacao_total,
      cronotipo,
      nome_cronotipo,
      respostas,
    } = body;

    if (!nome || !email || !cronotipo) {
      return NextResponse.json(
        { error: "Dados obrigatórios não informados (nome, email, cronotipo)." },
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

    const gratuito = await isTesteGratuito("teste-cronotipo");

    if (!gratuito) {
      const { disponivel } = await verificarCreditoDisponivel(
        activeUserId,
        activeEmail,
        "teste-cronotipo"
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
      .from("avaliacoes_cronotipo")
      .insert({
        usuario_id: activeUserId,
        nome: String(nome).trim(),
        email: String(activeEmail).trim().toLowerCase(),
        telefone: telefone ? String(telefone).trim() : null,
        pontuacao_total: Number(pontuacao_total) || 0,
        cronotipo: String(cronotipo).toLowerCase(),
        nome_cronotipo: String(nome_cronotipo || "").trim(),
        respostas: respostas || {},
      })
      .select("id")
      .single();

    if (error) {
      console.error("Erro ao salvar avaliação do Cronotipo no banco:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 200 }
      );
    }

    if (data?.id && !gratuito) {
      await consumirCreditoTeste(
        activeUserId,
        activeEmail,
        "teste-cronotipo",
        data.id
      );
    }

    return NextResponse.json({ success: true, id: data?.id }, { status: 201 });
  } catch (err: unknown) {
    console.error("Exceção na rota POST /api/teste-cronotipo:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
