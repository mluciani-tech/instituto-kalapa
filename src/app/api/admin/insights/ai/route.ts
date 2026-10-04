import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";
import { checkAdminAuth } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!(await checkAdminAuth(req))) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "Supabase não configurado" }, { status: 500 });
  }

  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Coleta dados operacionais em paralelo
    const [pedidosRes, produtosRes, avaliacoesYYRes, avaliacoesEnRes, creditosRes] =
      await Promise.all([
        supabaseAdmin!
          .from("pedidos")
          .select("id, valor, status, created_at, itens, produto_id, produtos(nome, slug, is_teste, atendimento_individual)")
          .gte("created_at", thirtyDaysAgo.toISOString()),

        supabaseAdmin!
          .from("produtos")
          .select("id, nome, slug, preco, is_teste, atendimento_individual, vagas_maximas, vagas_ocupadas_manual, ativo")
          .eq("ativo", true),

        supabaseAdmin!
          .from("avaliacoes_yin_yang")
          .select("id, tipo_resultado, created_at"),

        supabaseAdmin!
          .from("avaliacoes_eneagrama")
          .select("id, tipos_principais, created_at"),

        supabaseAdmin!
          .from("testes_creditos")
          .select("id, status, slug_teste"),
      ]);

    const pedidos = pedidosRes.data || [];
    const produtos = produtosRes.data || [];
    const avaliacoesYY = avaliacoesYYRes.data || [];
    const avaliacoesEn = avaliacoesEnRes.data || [];
    const creditos = creditosRes.data || [];

    const pedidosPagos = pedidos.filter((p) => p.status === "pago" || p.status === "confirmado");
    const pedidosPendentes = pedidos.filter((p) => p.status === "pendente");
    const faturamento30d = pedidosPagos.reduce((acc, p) => acc + (Number(p.valor) || 0), 0);
    const ticketMedio30d = pedidosPagos.length > 0 ? Math.round(faturamento30d / pedidosPagos.length) : 0;

    // Resumo para prompt
    const contextoComercial = {
      faturamentoUltimos30Dias: faturamento30d,
      totalPedidosPagos: pedidosPagos.length,
      totalPedidosAbandonados: pedidosPendentes.length,
      ticketMedio: ticketMedio30d,
      totalProdutosAtivos: produtos.length,
      produtosCadastrados: produtos.map((p) => ({
        nome: p.nome,
        preco: p.preco,
        is_teste: p.is_teste,
        atendimento_individual: p.atendimento_individual,
      })),
      totalAvaliacoesYinYangRealizadas: avaliacoesYY.length,
      totalAvaliacoesEneagramaRealizadas: avaliacoesEn.length,
      totalCreditosTestesVendidos: creditos.length,
      creditosTestesAguardandoRealizacao: creditos.filter((c) => c.status === "disponivel").length,
    };

    // Helper de normalização para garantir compatibilidade com o frontend
    const normalizeInsights = (raw: any) => {
      const diagnostico = raw.diagnostico || "";

      const rawCombos = raw.combos_sugeridos || raw.combosSugeridos || [];
      const combos_sugeridos = (Array.isArray(rawCombos) ? rawCombos : []).map((c: any) => ({
        titulo: c.titulo || "",
        descricao: c.descricao || "",
        preco_combo: c.preco_combo || c.precoSugerido || c.preco || "",
        economia_estimada: c.economia_estimada || c.economiaEstimada || c.economia || "",
        justificativa: c.justificativa || "",
      }));

      const rawCopys = raw.copys_whatsapp || raw.copysWhatsApp || [];
      const copys_whatsapp = (Array.isArray(rawCopys) ? rawCopys : []).map((cp: any) => ({
        publico_alvo: cp.publico_alvo || cp.publicoAlvo || "",
        mensagem: cp.mensagem || cp.mensagemPronta || "",
      }));

      let cupons_recomendados: any[] = [];
      const rawCupons = raw.cupons_recomendados || raw.cuponsRecomendados;
      if (Array.isArray(rawCupons)) {
        cupons_recomendados = rawCupons.map((cp: any) => ({
          codigo: cp.codigo || cp.codigoSugerido || "",
          desconto: cp.desconto || (cp.descontoPercentual ? `${cp.descontoPercentual}%` : "15%"),
          objetivo: cp.objetivo || "",
        }));
      } else if (raw.campanhaCupons || raw.campanha_cupons) {
        const cp = raw.campanhaCupons || raw.campanha_cupons;
        cupons_recomendados = [
          {
            codigo: cp.codigoSugerido || cp.codigo || "EQUILIBRIO15",
            desconto: cp.desconto || (cp.descontoPercentual ? `${cp.descontoPercentual}%` : "15%"),
            objetivo: cp.objetivo || "Acelerar vendas de testes e turmas",
          },
        ];
      }

      const acoes_prioritarias = Array.isArray(raw.acoes_prioritarias || raw.acoesPrioritarias)
        ? (raw.acoes_prioritarias || raw.acoesPrioritarias)
        : [];

      return {
        diagnostico,
        combos_sugeridos,
        copys_whatsapp,
        cupons_recomendados,
        acoes_prioritarias,
      };
    };

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const prompt = `Você é o Estrategista Chefe de Monetização e Growth do INstituto Kalapa, plataforma brasileira de vivências integrativas, atendimentos terapêuticos individuais (com a facilitadora Clatihúcia Capeli) e testes de autoconhecimento online (Yin/Yang MTC e Eneagrama).

Dados comerciais recentes do INstituto Kalapa:
${JSON.stringify(contextoComercial, null, 2)}

Sua missão é gerar um plano estratégico de alto impacto para aumentar o faturamento, impulsionar a venda dos testes online (escala), promover o cross-sell para atendimentos individuais de alto ticket e recuperar checkouts abandonados no WhatsApp.

Responda EXCLUSIVAMENTE em formato JSON com esta estrutura exata:
{
  "diagnostico": "Resumo diagnóstico com análise das métricas atuais e oportunidades imediatas de faturamento no INstituto Kalapa.",
  "combos_sugeridos": [
    {
      "titulo": "Nome do combo ou pacote",
      "descricao": "Explicação do que compõe o pacote e como ele ajuda o cliente",
      "preco_combo": "R$ 260,00",
      "economia_estimada": "Economia de R$ 40",
      "justificativa": "Por que esse combo converte bem"
    }
  ],
  "copys_whatsapp": [
    {
      "publico_alvo": "ex: Quem realizou o teste Yin/Yang",
      "mensagem": "Texto pronto e acolhedor para envio no WhatsApp"
    },
    {
      "publico_alvo": "ex: Quem abandonou o checkout",
      "mensagem": "Texto pronto de recuperação empática no WhatsApp"
    }
  ],
  "cupons_recomendados": [
    {
      "codigo": "KALAPA15",
      "desconto": "15%",
      "objetivo": "Objetivo comercial do cupom"
    }
  ],
  "acoes_prioritarias": [
    "Ação 1 recomendada para esta semana",
    "Ação 2 recomendada para esta semana",
    "Ação 3 recomendada para esta semana"
  ]
}`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ role: "user", parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.4,
                responseMimeType: "application/json",
              },
            }),
          }
        );

        if (geminiRes.ok) {
          const geminiJson = await geminiRes.json();
          const rawText = geminiJson.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = JSON.parse(rawText);
            const normalized = normalizeInsights(parsed);
            return NextResponse.json({
              success: true,
              sucesso: true,
              source: "gemini",
              origem: "gemini",
              model: "gemini-2.5-flash",
              modelo: "gemini-2.5-flash",
              insights: normalized,
              data: normalized,
              timestamp: new Date().toISOString(),
            });
          }
        }
      } catch (geminiErr) {
        console.warn("[admin/insights/ai] Falha ao consultar Gemini, usando fallback analítico:", geminiErr);
      }
    }

    // Fallback Analítico Heurístico (quando sem API key ou em caso de indisponibilidade)
    const fallbackRaw = {
      diagnostico: `Atualmente o INstituto Kalapa possui ${produtos.length} produtos ativos e ${creditos.length} créditos de testes gerados. O ticket médio recente é de R$ ${ticketMedio30d || 150},00. Há ${pedidosPendentes.length} pedidos pendentes no WhatsApp que representam receita imediata a ser resgatada através de contato ativo.`,
      combos_sugeridos: [
        {
          titulo: "Pacote Diagnóstico & Cura (Teste Yin/Yang + Consulta MTC)",
          descricao: "O participante realiza a avaliação energética online e aplica as diretrizes alimentares e de sono em uma sessão individual com a facilitadora.",
          preco_combo: "R$ 197,00",
          economia_estimada: "Economia de 15%",
          justificativa: "Diminui a barreira de entrada da consulta individual através da curiosidade gerada pelo laudo do teste.",
        },
        {
          titulo: "Jornada Essência & Presença (Eneagrama + Sessão Sistêmica)",
          descricao: "Mapeamento dos 9 tipos e feridas de infância complementado por uma constelação individual para liberação das lealdades familiares.",
          preco_combo: "R$ 290,00",
          economia_estimada: "Economia de R$ 50",
          justificativa: "Cliente que busca o Eneagrama tem perfil reflexivo e busca aprofundamento sistêmico com alta propensão a atendimentos.",
        },
      ],
      copys_whatsapp: [
        {
          publico_alvo: "Participantes com Teste Yin/Yang Realizado",
          mensagem:
            "Olá! Vimos que você concluiu sua avaliação Yin/Yang no INstituto Kalapa. Como foi a leitura do seu laudo? Se você quiser aprofundar suas orientações de sono e dietoterapia, a facilitadora Clatihúcia tem horários especiais nesta semana para te orientar individualmente!",
        },
        {
          publico_alvo: "Carrinhos de Testes ou Atendimentos Não Concluídos",
          mensagem:
            "Olá! Sou da equipe do INstituto Kalapa. Percebemos que você iniciou sua inscrição mas não concluiu. Ficou alguma dúvida sobre o pagamento via Pix ou Cartão? Estou à disposição para te auxiliar!",
        },
      ],
      cupons_recomendados: [
        {
          codigo: "EQUILIBRIO15",
          desconto: "15%",
          objetivo: "Ativar novos compradores de testes e acelerar preenchimento de turmas",
        },
      ],
      acoes_prioritarias: [
        "Abordar os pedidos pendentes na Central de Recuperação de WhatsApp hoje.",
        "Divulgar a avaliação Yin/Yang e Eneagrama no Instagram direcionando para o catálogo com link direto.",
        "Oferecer atendimento individual como próximo passo para quem já realizou o teste.",
      ],
    };

    const normalizedFallback = normalizeInsights(fallbackRaw);

    return NextResponse.json({
      success: true,
      sucesso: true,
      source: "fallback",
      origem: "heuristica",
      model: "kalapa-growth-engine",
      modelo: "kalapa-growth-engine",
      aviso: !apiKey ? "Configure GEMINI_API_KEY no arquivo .env.local para gerar insights personalizados em tempo real com a IA do Google." : null,
      insights: normalizedFallback,
      data: normalizedFallback,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[admin/insights/ai] Erro:", error);
    return NextResponse.json({ error: "Erro ao gerar insights comerciais" }, { status: 500 });
  }
}
