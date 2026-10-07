import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verificarCreditoDisponivel, consumirCreditoTeste, isTesteGratuito } from "@/lib/testes-creditos";
import { getUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { respostas, resultadoCalculado } = await req.json();

    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { data: usuario, error: errorUser } = await supabaseAdmin!
      .from("usuarios")
      .select("id, nome, email, telefone")
      .eq("email", user.email)
      .single();

    if (errorUser || !usuario) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    const gratuito = await isTesteGratuito("teste-lealdades-invisiveis");

    if (!gratuito) {
      const { disponivel } = await verificarCreditoDisponivel(
        usuario.id,
        usuario.email,
        "teste-lealdades-invisiveis"
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

    const { data: insertData, error: errorInsert } = await supabaseAdmin!
      .from("avaliacoes_lealdades")
      .insert({
        usuario_id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        telefone: usuario.telefone || null,
        perfil_dominante: resultadoCalculado.perfilDominante.nome,
        pontuacoes: resultadoCalculado.pontuacoes,
        respostas: respostas,
      })
      .select("id")
      .single();

    if (errorInsert || !insertData) {
      console.error("Erro ao salvar avaliação Lealdades:", errorInsert);
      return NextResponse.json(
        { error: "Falha ao salvar a avaliação" },
        { status: 500 }
      );
    }

    if (!gratuito) {
      await consumirCreditoTeste(usuario.id, usuario.email, "teste-lealdades-invisiveis", insertData.id);
    }

    return NextResponse.json({ success: true, id: insertData.id });
  } catch (error) {
    console.error("Erro no teste Lealdades:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

