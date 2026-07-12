import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";
import { verifySessionToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

function checkAuth(req: NextRequest) {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/admin_session=([^;]+)/);
  if (!match) return false;
  return verifySessionToken(match[1]);
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "Supabase não configurado" },
      { status: 500 }
    );
  }

  const { data, error } = await supabaseAdmin!
    .from("pedidos")
    .select(`
      *,
      produtos (nome, slug)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[admin/pedidos] Erro:", error);
    return NextResponse.json(
      { error: "Erro ao buscar pedidos" },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}
