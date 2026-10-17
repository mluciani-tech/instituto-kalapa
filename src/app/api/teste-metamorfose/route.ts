import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import {
  verificarCreditoDisponivel,
  consumirCreditoTeste,
  isTesteGratuito,
} from "@/lib/testes-creditos";
import { getClienteFromRequest } from "@/lib/cliente-auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { respostas, resultadoCalculado } = await req.json();

    const clienteLogado = await getClienteFromRequest(req);

    if (!clienteLogado) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { data: usuario, error: errorUser } = await supabaseAdmin!
      .from("usuarios")
      .select("id, nome, email, telefone")
      .eq("email", clienteLogado.email)
      .single();

    if (errorUser || !usuario) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    const gratuito = await isTesteGratuito("teste-metamorfose");

    if (!gratuito) {
      const { disponivel } = await verificarCreditoDisponivel(
        usuario.id,
        usuario.email,
        "teste-metamorfose"
      );

      if (!disponivel) {
        return NextResponse.json(
          {
            error: "Você não possui créditos disponíveis.",
            sem_credito: true,
          },
          { status: 403 }
        );
      }
    }

    const temaFormatado = respostas?.temaEmSilencio
      ? `${resultadoCalculado?.categoriaTemaLabel || "Tema"} (Em Silêncio)`
      : respostas?.temaDescricao
      ? `${resultadoCalculado?.categoriaTemaLabel || "Tema"}: ${respostas.temaDescricao}`
      : resultadoCalculado?.categoriaTemaLabel || "Vivência Sistêmica";

    const { data: insertData, error: errorInsert } = await supabaseAdmin!
      .from("avaliacoes_metamorfose")
      .insert({
        usuario_id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        telefone: usuario.telefone || null,
        tema_escolhido: temaFormatado,
        cartas_sorteadas: respostas?.cartasSorteadas || {},
        predominio_bloco: resultadoCalculado?.balanca?.titulo || null,
        pontuacoes: {
          blocoA: resultadoCalculado?.balanca?.totalBlocoA ?? 0,
          blocoB: resultadoCalculado?.balanca?.totalBlocoB ?? 0,
        },
        respostas: respostas,
      })
      .select("id")
      .single();

    if (errorInsert || !insertData) {
      console.error("Erro ao salvar avaliação Metamorfose:", errorInsert);
      return NextResponse.json(
        { error: "Falha ao salvar a vivência" },
        { status: 500 }
      );
    }

    if (!gratuito) {
      await consumirCreditoTeste(
        usuario.id,
        usuario.email,
        "teste-metamorfose",
        insertData.id
      );
    }

    return NextResponse.json({ success: true, id: insertData.id });
  } catch (error) {
    console.error("Erro no Jogo Sistêmico Metamorfose:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
