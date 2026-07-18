import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/admin-auth";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";

const DEFAULTS: Record<string, string> = {
  preco_sessao: "97",
  vagas_maximas: "15",
  turma_atual: "2025-01",
};

// GET: Buscar configurações (público — usado na landing page)
export async function GET() {
  if (!isAdminConfigured()) {
    return NextResponse.json(DEFAULTS);
  }

  try {
    const { data, error } = await supabaseAdmin!
      .from("configuracoes")
      .select("chave, valor");

    if (error) {
      // Tabela não existe — retornar defaults
      if (error.message?.includes("does not exist") || error.code === "42P01") {
        console.warn("[config] Tabela configuracoes não existe. Usando valores padrão.");
        return NextResponse.json(DEFAULTS);
      }
      throw error;
    }

    const config: Record<string, string> = { ...DEFAULTS };
    data?.forEach((item) => {
      config[item.chave] = item.valor;
    });

    return NextResponse.json(config);
  } catch (error) {
    console.error("[config] Erro ao buscar configurações:", error);
    return NextResponse.json(DEFAULTS);
  }
}

// PUT: Atualizar configurações (apenas admin autenticado)
export async function PUT(req: NextRequest) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  if (!isAdminConfigured()) {
    return NextResponse.json(
      {
        error: "Variável SUPABASE_SERVICE_ROLE_KEY não configurada no Vercel.",
        hint: "Vá em Settings → Environment Variables, adicione SUPABASE_SERVICE_ROLE_KEY com a service_role key do Supabase, salve para Production, e faça Redeploy.",
      },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { chave, valor } = body;

    if (!chave || valor === undefined) {
      return NextResponse.json(
        { error: "chave e valor são obrigatórios" },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin!
      .from("configuracoes")
      .upsert(
        { chave, valor: String(valor), updated_at: new Date().toISOString() },
        { onConflict: "chave" }
      );

    if (error) {
      if (error.message?.includes("does not exist") || error.code === "42P01") {
        return NextResponse.json(
          {
            error: "Tabela configuracoes não existe no Supabase.",
            hint: "Execute o SQL do arquivo supabase/schema.sql no SQL Editor do Supabase para criar a tabela.",
          },
          { status: 500 }
        );
      }
      throw error;
    }

    return NextResponse.json({ success: true, chave, valor });
  } catch (error) {
    console.error("[config] Erro ao atualizar configuração:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar configuração" },
      { status: 500 }
    );
  }
}
