import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";
import { getClienteFromRequest } from "@/lib/cliente-auth";
import { getVagasInfo } from "@/lib/vagas";

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

    // 1. Buscar pedido garantindo que pertence ao cliente logado
    const { data: pedido, error } = await supabaseAdmin!
      .from("pedidos")
      .select("id, status, usuario_id, cliente_email, itens, produto_id, beneficiarios, cupom_codigo")
      .eq("id", id)
      .single();

    if (error || !pedido) {
      return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
    }

    const ehDono = pedido.usuario_id === cliente.id || pedido.cliente_email === cliente.email;
    if (!ehDono) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    if (pedido.status !== "pendente") {
      return NextResponse.json(
        {
          error:
            pedido.status === "pago"
              ? "Este pedido já foi pago e confirmado."
              : "Este pedido já foi cancelado e não pode ser retomado diretamente.",
        },
        { status: 400 }
      );
    }

    // 2. Extrair itens do pedido
    const rawItens: Array<{ produto_id: string; quantidade: number; nome?: string }> = [];

    if (Array.isArray(pedido.itens) && pedido.itens.length > 0) {
      for (const item of pedido.itens) {
        if (item && item.produto_id) {
          rawItens.push({
            produto_id: item.produto_id,
            quantidade: Number(item.quantidade) || 1,
            nome: item.nome,
          });
        }
      }
    } else if (pedido.produto_id) {
      rawItens.push({
        produto_id: pedido.produto_id,
        quantidade: 1,
      });
    }

    if (rawItens.length === 0) {
      return NextResponse.json(
        { error: "Nenhum produto associado a este pedido." },
        { status: 400 }
      );
    }

    // 3. Validar se cada produto ainda existe, se está ativo e se possui vagas
    const itensValidados = [];

    for (const rawItem of rawItens) {
      const { data: prod, error: prodErr } = await supabaseAdmin!
        .from("produtos")
        .select("id, nome, slug, preco, imagem_url, categoria, vagas_maximas, ativo")
        .eq("id", rawItem.produto_id)
        .single();

      if (prodErr || !prod) {
        return NextResponse.json(
          {
            error: `O produto "${rawItem.nome || "selecionado"}" não foi encontrado no catálogo atual.`,
            disponivel: false,
          },
          { status: 409 }
        );
      }

      if (prod.ativo === false) {
        return NextResponse.json(
          {
            error: `A vivência ou produto "${prod.nome}" foi desativado temporariamente.`,
            disponivel: false,
          },
          { status: 409 }
        );
      }

      if (prod.vagas_maximas != null) {
        const vagasInfo = await getVagasInfo(prod.id);
        if (vagasInfo.restantes < rawItem.quantidade) {
          return NextResponse.json(
            {
              error:
                vagasInfo.restantes <= 0
                  ? `As vagas para "${prod.nome}" esgotaram.`
                  : `Restam apenas ${vagasInfo.restantes} vaga(s) para "${prod.nome}", mas seu pedido solicitava ${rawItem.quantidade}.`,
              disponivel: false,
            },
            { status: 409 }
          );
        }
      }

      itensValidados.push({
        produto_id: prod.id,
        slug: prod.slug || prod.id,
        nome: prod.nome,
        preco: Number(prod.preco) || 0,
        quantidade: rawItem.quantidade,
        imagem_url: prod.imagem_url || null,
        categoria: prod.categoria || null,
      });
    }

    // 4. Retornar dados prontos para o carrinho e checkout
    return NextResponse.json({
      success: true,
      pedido_id: pedido.id,
      itens: itensValidados,
      beneficiarios: pedido.beneficiarios || [],
      cupom_codigo: pedido.cupom_codigo || null,
    });
  } catch (err) {
    console.error("[cliente/pedidos/[id]/retomar] Erro:", err);
    return NextResponse.json({ error: "Erro ao retomar pedido" }, { status: 500 });
  }
}
