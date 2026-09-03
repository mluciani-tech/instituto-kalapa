import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";
import { getClienteFromRequest } from "@/lib/cliente-auth";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cliente = await getClienteFromRequest(req);
    if (!cliente) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    if (!isAdminConfigured()) {
      return NextResponse.json({ error: "Banco de dados não configurado" }, { status: 500 });
    }

    const { id } = await params;

    // Buscar pedido garantindo que pertence ao cliente
    const { data: pedido, error } = await supabaseAdmin!
      .from("pedidos")
      .select("id, status, usuario_id, cliente_email")
      .eq("id", id)
      .single();

    if (error || !pedido) {
      return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
    }

    const ehDono = pedido.usuario_id === cliente.id || pedido.cliente_email === cliente.email;
    if (!ehDono) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    if (pedido.status === "pago") {
      return NextResponse.json(
        { error: "Pedidos com pagamento já confirmado não podem ser cancelados diretamente. Entre em contato com o suporte." },
        { status: 400 }
      );
    }

    // Cancelar pedido
    await supabaseAdmin!
      .from("pedidos")
      .update({
        status: "cancelado",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    // Cancelar também a inscrição associada se houver
    await supabaseAdmin!
      .from("inscricoes")
      .update({ status: "cancelada" })
      .eq("pedido_id", id);

    return NextResponse.json({ success: true, message: "Pedido cancelado com sucesso." });
  } catch (err) {
    console.error("[cliente/pedidos/[id]/cancelar] Erro:", err);
    return NextResponse.json({ error: "Erro ao cancelar pedido" }, { status: 500 });
  }
}
