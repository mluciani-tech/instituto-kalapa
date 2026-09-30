import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/admin-auth";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";

export async function DELETE(req: NextRequest) {
  if (process.env.NODE_ENV === "production" && process.env.ALLOW_ADMIN_RESET !== "true") {
    return NextResponse.json(
      { error: "Ação de limpeza em lote desativada em produção por segurança." },
      { status: 403 }
    );
  }

  if (!(await checkAdminAuth(req))) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "Banco não configurado (service_role key ausente)" },
      { status: 500 }
    );
  }

  try {
    // 1. Excluir inscrições
    const { error: errorInsc } = await supabaseAdmin!
      .from("inscricoes")
      .delete()
      .not("id", "is", null);

    if (errorInsc) throw errorInsc;

    // 2. Excluir usos de cupons para manter integridade referencial
    await supabaseAdmin!
      .from("cupons_usos")
      .delete()
      .not("id", "is", null);

    // 3. Excluir pedidos
    const { error: errorPedidos } = await supabaseAdmin!
      .from("pedidos")
      .delete()
      .not("id", "is", null);

    if (errorPedidos) throw errorPedidos;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[admin/limpar] Erro:", error);
    return NextResponse.json(
      { error: "Erro ao limpar banco de dados" },
      { status: 500 }
    );
  }
}
