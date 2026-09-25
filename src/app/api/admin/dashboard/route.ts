import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";
import { checkAdminAuth } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!(await checkAdminAuth(req))) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "Supabase não configurado" },
      { status: 500 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const periodo = searchParams.get("periodo") || "30d"; // "7d" | "30d" | "90d" | "total"

    const now = new Date();
    let sinceDate: Date | null = null;
    let daysCount = 30;

    if (periodo === "7d") {
      daysCount = 7;
      sinceDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (periodo === "30d") {
      daysCount = 30;
      sinceDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (periodo === "90d") {
      daysCount = 90;
      sinceDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    } else {
      daysCount = 30; // Para a timeline caso selecione total, mostra os ultimos 30 dias
      sinceDate = null;
    }

    // Buscar dados em paralelo
    const [pedidosRes, produtosRes, usuariosRes] = await Promise.all([
      supabaseAdmin!
        .from("pedidos")
        .select(`
          id,
          order_nsu,
          cliente_nome,
          cliente_email,
          cliente_telefone,
          valor,
          valor_desconto,
          cupom_codigo,
          status,
          metodo_pagamento,
          produto_id,
          itens,
          created_at,
          produtos (id, nome, slug)
        `)
        .order("created_at", { ascending: false }),

      supabaseAdmin!
        .from("produtos")
        .select("id, nome, slug, preco, vagas_maximas, vagas_ocupadas_manual, ativo")
        .order("ordem", { ascending: true }),

      supabaseAdmin!
        .from("usuarios")
        .select("id", { count: "exact", head: true }),
    ]);

    if (pedidosRes.error || produtosRes.error) {
      console.error("[admin/dashboard] Erro ao buscar dados:", pedidosRes.error || produtosRes.error);
      return NextResponse.json({ error: "Erro ao consultar dados" }, { status: 500 });
    }

    const allPedidos = pedidosRes.data || [];
    const allProdutos = produtosRes.data || [];
    const totalUsuarios = usuariosRes.count || 0;

    // Filtrar pedidos no período
    const pedidosPeriodo = sinceDate
      ? allPedidos.filter((p) => new Date(p.created_at) >= sinceDate)
      : allPedidos;

    const pedidosPagosPeriodo = pedidosPeriodo.filter(
      (p) => p.status === "pago" || p.status === "confirmado"
    );
    const pedidosPagosTotal = allPedidos.filter(
      (p) => p.status === "pago" || p.status === "confirmado"
    );

    const faturamentoPeriodo = pedidosPagosPeriodo.reduce((acc, p) => acc + (Number(p.valor) || 0), 0);
    const faturamentoTotal = pedidosPagosTotal.reduce((acc, p) => acc + (Number(p.valor) || 0), 0);

    const countPagosPeriodo = pedidosPagosPeriodo.length;
    const countTotalPeriodo = pedidosPeriodo.length;
    const ticketMedioPeriodo = countPagosPeriodo > 0 ? faturamentoPeriodo / countPagosPeriodo : 0;
    const taxaConversaoPeriodo = countTotalPeriodo > 0 ? (countPagosPeriodo / countTotalPeriodo) * 100 : 0;

    // Métodos de Pagamento (PIX vs Cartão) no período
    let pixCount = 0;
    let pixValor = 0;
    let cartaoCount = 0;
    let cartaoValor = 0;
    let outrosCount = 0;
    let outrosValor = 0;

    for (const p of pedidosPagosPeriodo) {
      const v = Number(p.valor) || 0;
      const m = (p.metodo_pagamento || "").toLowerCase();
      if (m.includes("pix")) {
        pixCount += 1;
        pixValor += v;
      } else if (m.includes("cartao") || m.includes("card") || m.includes("credit")) {
        cartaoCount += 1;
        cartaoValor += v;
      } else {
        outrosCount += 1;
        outrosValor += v;
      }
    }

    const totalMetodos = countPagosPeriodo || 1;
    const metodosPagamento = {
      pix: { count: pixCount, valor: pixValor, percentual: Math.round((pixCount / totalMetodos) * 100) },
      cartao: { count: cartaoCount, valor: cartaoValor, percentual: Math.round((cartaoCount / totalMetodos) * 100) },
      outros: { count: outrosCount, valor: outrosValor, percentual: Math.round((outrosCount / totalMetodos) * 100) },
    };

    // Timeline diária (agrupada por dia)
    const timelineMap: Record<string, { valor: number; pedidos: number }> = {};
    const timelineDays = periodo === "total" ? 30 : daysCount;
    for (let i = timelineDays - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().split("T")[0];
      timelineMap[key] = { valor: 0, pedidos: 0 };
    }

    for (const p of pedidosPagosPeriodo) {
      const day = p.created_at.split("T")[0];
      if (timelineMap[day]) {
        timelineMap[day].valor += Number(p.valor) || 0;
        timelineMap[day].pedidos += 1;
      }
    }

    const timeline = Object.keys(timelineMap)
      .sort()
      .map((dayStr) => {
        const [, m, d] = dayStr.split("-");
        return {
          date: dayStr,
          label: `${d}/${m}`,
          valor: timelineMap[dayStr].valor,
          pedidos: timelineMap[dayStr].pedidos,
        };
      });

    // Desempenho e Lotação de Vagas por Produto
    // Mapear vendas por produto_id
    const vendasPorProduto: Record<string, { receita: number; ingressos: number }> = {};
    for (const p of pedidosPagosTotal) {
      const v = Number(p.valor) || 0;
      if (p.produto_id) {
        if (!vendasPorProduto[p.produto_id]) {
          vendasPorProduto[p.produto_id] = { receita: 0, ingressos: 0 };
        }
        vendasPorProduto[p.produto_id].receita += v;
      }

      if (Array.isArray(p.itens)) {
        for (const item of p.itens as Array<{ produto_id?: string; quantidade?: number; preco?: number }>) {
          if (item?.produto_id) {
            if (!vendasPorProduto[item.produto_id]) {
              vendasPorProduto[item.produto_id] = { receita: 0, ingressos: 0 };
            }
            vendasPorProduto[item.produto_id].ingressos += Number(item.quantidade) || 1;
          }
        }
      }
    }

    let totalVagasOcupadasGeral = 0;

    const produtosRanking = allProdutos.map((prod) => {
      const vInfo = vendasPorProduto[prod.id] || { receita: 0, ingressos: 0 };
      const preenchidasReais = vInfo.ingressos;
      const preenchidas = prod.vagas_ocupadas_manual != null ? prod.vagas_ocupadas_manual : preenchidasReais;
      totalVagasOcupadasGeral += preenchidas;

      const maximas = prod.vagas_maximas || null;
      const percentual = maximas ? Math.min(100, Math.round((preenchidas / maximas) * 100)) : null;
      let statusOcupacao: "lotada" | "quase_lotada" | "aberta" = "aberta";
      if (maximas) {
        if (preenchidas >= maximas) statusOcupacao = "lotada";
        else if (percentual !== null && percentual >= 80) statusOcupacao = "quase_lotada";
      }

      return {
        id: prod.id,
        nome: prod.nome,
        slug: prod.slug,
        ativo: prod.ativo ?? true,
        receita: vInfo.receita,
        vagas_maximas: maximas,
        vagas_preenchidas: preenchidas,
        percentual_ocupacao: percentual,
        status_ocupacao: statusOcupacao,
      };
    }).sort((a, b) => b.receita - a.receita);

    // Pedidos Pendentes Recentes (para recuperação de vendas via WhatsApp)
    const pedidosPendentesRecentes = allPedidos
      .filter((p) => p.status === "pendente")
      .slice(0, 6)
      .map((p) => {
        let telefoneLimpo = (p.cliente_telefone || "").replace(/\D/g, "");
        if (telefoneLimpo.length === 10 || telefoneLimpo.length === 11) {
          telefoneLimpo = `55${telefoneLimpo}`;
        }

        const produtosData = p.produtos as unknown as { nome?: string } | { nome?: string }[] | null;
        const prodObj = Array.isArray(produtosData) ? produtosData[0] : produtosData;
        const itensData = p.itens as unknown as Array<{ nome?: string }> | null;
        const itemObj = Array.isArray(itensData) ? itensData[0] : null;

        const prodNome = prodObj?.nome || itemObj?.nome || "Vivência Kalapa";

        const msg = encodeURIComponent(
          `Olá ${p.cliente_nome || ""}, tudo bem? Sou da equipe do Instituto Kalapa. Vimos seu interesse na vivência "${prodNome}". Ficou com alguma dúvida sobre a inscrição ou pagamento? Posso te ajudar!`
        );

        return {
          id: p.id,
          order_nsu: p.order_nsu,
          cliente_nome: p.cliente_nome || "Cliente",
          cliente_email: p.cliente_email,
          cliente_telefone: p.cliente_telefone,
          telefone_whatsapp: telefoneLimpo ? `https://wa.me/${telefoneLimpo}?text=${msg}` : null,
          valor: Number(p.valor) || 0,
          produto_nome: prodNome,
          created_at: p.created_at,
        };
      });

    // Cupons e Descontos no período
    let totalDescontoPeriodo = 0;
    let cuponsUsadosPeriodo = 0;
    for (const p of pedidosPagosPeriodo) {
      if (p.cupom_codigo) {
        cuponsUsadosPeriodo += 1;
        totalDescontoPeriodo += Number(p.valor_desconto) || 0;
      }
    }

    return NextResponse.json({
      periodo,
      kpis: {
        faturamentoPeriodo,
        faturamentoTotal,
        pedidosPagosPeriodo: countPagosPeriodo,
        pedidosTotalPeriodo: countTotalPeriodo,
        ticketMedioPeriodo,
        taxaConversaoPeriodo,
        totalVagasOcupadas: totalVagasOcupadasGeral,
        totalUsuarios,
        totalDescontoPeriodo,
        cuponsUsadosPeriodo,
      },
      timeline,
      metodosPagamento,
      produtosRanking,
      pedidosPendentesRecentes,
      totaisGerais: {
        pedidosPagos: pedidosPagosTotal.length,
        pedidosPendentes: allPedidos.filter((p) => p.status === "pendente").length,
        pedidosCancelados: allPedidos.filter((p) => p.status === "cancelado").length,
      },
    });
  } catch (error) {
    console.error("[admin/dashboard] Erro inesperado:", error);
    return NextResponse.json({ error: "Erro interno ao processar dashboard" }, { status: 500 });
  }
}
