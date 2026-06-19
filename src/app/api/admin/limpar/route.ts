import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";

export async function DELETE(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;

  if (!token || !verifySessionToken(token)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "Banco não configurado (service_role key ausente)" },
      { status: 500 }
    );
  }

  try {
    const { error } = await supabaseAdmin!
      .from("inscricoes")
      .delete()
      .not("id", "is", null);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[admin/limpar] Erro:", error);
    return NextResponse.json(
      { error: "Erro ao limpar banco de dados" },
      { status: 500 }
    );
  }
}
