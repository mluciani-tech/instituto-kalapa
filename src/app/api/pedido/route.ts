import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const orderNsu = req.nextUrl.searchParams.get("order_nsu");

  if (!orderNsu) {
    return NextResponse.json(
      { error: "order_nsu é obrigatório" },
      { status: 400 }
    );
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
    .eq("order_nsu", orderNsu)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Pedido não encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json(data);
}
