import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";
import { getClienteFromRequest } from "@/lib/cliente-auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const cliente = await getClienteFromRequest(req);
    if (!cliente) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    if (!isAdminConfigured()) {
      return NextResponse.json({ error: "Banco de dados não configurado" }, { status: 500 });
    }

    // Buscar pedidos associados ao usuario_id OU ao e-mail do cliente
    const { data: pedidos, error } = await supabaseAdmin!
      .from("pedidos")
      .select("id, order_nsu, valor, valor_desconto, status, metodo_pagamento, capture_method, receipt_url, transaction_nsu, itens, created_at, produtos(nome, slug, imagem_url)")
      .or(`usuario_id.eq.${cliente.id},cliente_email.eq.${cliente.email}`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[cliente/pedidos] Erro ao buscar pedidos:", error);
      return NextResponse.json({ error: "Erro ao buscar pedidos" }, { status: 500 });
    }

    return NextResponse.json(pedidos || []);
  } catch (error) {
    console.error("[cliente/pedidos] Erro inesperado:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
