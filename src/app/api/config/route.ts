import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";

// GET: Buscar configurações (público — usado na landing page)
export async function GET() {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "Banco não configurado" },
      { status: 500 }
    );
  }

  try {
    const { data, error } = await supabaseAdmin!
      .from("configuracoes")
      .select("chave, valor");

    if (error) throw error;

    const config: Record<string, string> = {};
    data?.forEach((item) => {
      config[item.chave] = item.valor;
    });

    return NextResponse.json(config);
  } catch (error) {
    console.error("[config] Erro ao buscar configurações:", error);
    return NextResponse.json(
      { error: "Erro ao buscar configurações" },
      { status: 500 }
    );
  }
}

// PUT: Atualizar configurações (apenas admin autenticado)
export async function PUT(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;

  if (!token || !verifySessionToken(token)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "Banco não configurado" },
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

    if (error) throw error;

    return NextResponse.json({ success: true, chave, valor });
  } catch (error) {
    console.error("[config] Erro ao atualizar configuração:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar configuração" },
      { status: 500 }
    );
  }
}
