import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/admin-auth";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";
import { getPublicConfig } from "@/lib/config";

export const dynamic = "force-dynamic";

// GET: Buscar configurações (público — usado na landing page)
export async function GET() {
  const config = await getPublicConfig();
  return NextResponse.json(config);
}

// PUT: Atualizar configurações (apenas admin autenticado)
export async function PUT(req: NextRequest) {
  if (!(await checkAdminAuth(req))) {
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

    // Se estiver atualizando dados da Facilitadora, sincroniza automaticamente com o registro padrão em therapists
    if (["facilitadora_foto", "facilitadora_nome", "facilitadora_titulo", "facilitadora_bio"].includes(chave)) {
      const fieldMap: Record<string, string> = {
        facilitadora_foto: "foto_url",
        facilitadora_nome: "nome",
        facilitadora_titulo: "titulo",
        facilitadora_bio: "bio",
      };
      const therapistField = fieldMap[chave];
      if (therapistField) {
        supabaseAdmin!
          .from("therapists")
          .update({ [therapistField]: String(valor), updated_at: new Date().toISOString() })
          .eq("id", "e7f53a4e-1288-4e89-b051-5b7415444b01")
          .then(
            () => {},
            (e: unknown) => console.error("[config] Erro ao sincronizar therapist:", e)
          );
      }
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
