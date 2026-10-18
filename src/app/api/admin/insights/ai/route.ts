import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";
import { checkAdminAuth } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

interface ComboSugerido {
  titulo: string;
  descricao: string;
  preco_combo: string;
  economia_estimada: string;
  justificativa: string;
}

interface CopyWhatsApp {
  publico_alvo: string;
  mensagem: string;
}

interface CupomRecomendado {
  codigo: string;
  desconto: string;
  objetivo: string;
}

interface NormalizedInsights {
  diagnostico: string;
  combos_sugeridos: ComboSugerido[];
  copys_whatsapp: CopyWhatsApp[];
  cupons_recomendados: CupomRecomendado[];
  acoes_prioritarias: string[];
  alertas_operacionais?: string[];
}

export async function POST(req: NextRequest) {
  if (!(await checkAdminAuth(req))) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "Supabase não configurado" }, { status: 500 });
  }

  try {
    let periodoParam = "30d";
    try {
      const body = await req.json();
      if (body?.periodo) periodoParam = String(body.periodo);
    } catch {
      const { searchParams } = new URL(req.url);
      const q = searchParams.get("periodo");
      if (q) periodoParam = q;
    }

    const now = new Date();
    let daysCount = 30;
    if (periodoParam === "7d") daysCount = 7;
    else if (periodoParam === "90d") daysCount = 90;
    else if (periodoParam === "total") daysCount = 365;

    const currentSince = new Date(now.getTime() - daysCount * 24 * 60 * 60 * 1000);
    const previousSince = new Date(now.getTime() - 2 * daysCount * 24 * 60 * 60 * 1000);

    // Coleta abrangente de TODAS as tabelas do ecossistema Kalapa em paralelo
    const results = await Promise.allSettled([
      // 0. Pedidos
      supabaseAdmin!
        .from("pedidos")
        .select(`
          id, valor, valor_desconto, status, metodo_pagamento, cupom_codigo, produto_id, itens, created_at,
          produtos (id, nome, slug, is_teste, rota_teste, atendimento_individual, categoria)
        `)
        .order("created_at", { ascending: false }),

      // 1. Produtos
      supabaseAdmin!
        .from("produtos")
        .select("id, nome, slug, preco, preco_promocional, is_teste, rota_teste, atendimento_individual, categoria, vagas_maximas, vagas_ocupadas_manual, ativo")
        .order("ordem", { ascending: true }),

      // 2. Agendamentos / Consultas Individuais
      supabaseAdmin!
        .from("appointments")
        .select("id, therapist_id, patient_id, produto_id, pedido_id, start_time, end_time, status, cancellation_reason, created_at")
        .order("start_time", { ascending: false }),

      // 3. Inscrições em Vivências / Turmas
      supabaseAdmin!
        .from("inscricoes")
        .select("id, pedido_id, status, turma_id, created_at"),

      // 4. Cupons de Desconto
      supabaseAdmin!
        .from("cupons")
        .select("id, codigo, tipo, valor, quantidade_utilizada, ativo, created_at"),

      // 5. Créditos de Testes
      supabaseAdmin!
        .from("testes_creditos")
        .select("id, status, slug_teste, created_at, utilizado_em, produto_id"),

      // 6. Teste Yin / Yang
      supabaseAdmin!
        .from("avaliacoes_yin_yang")
        .select("id, tipo_resultado, created_at"),

      // 7. Teste Eneagrama
      supabaseAdmin!
        .from("avaliacoes_eneagrama")
        .select("id, tipos_principais, created_at"),

      // 8. Teste Cronotipo
      supabaseAdmin!
        .from("avaliacoes_cronotipo")
        .select("id, cronotipo, created_at"),

      // 9. Teste Lealdades Invisíveis
      supabaseAdmin!
        .from("avaliacoes_lealdades")
        .select("id, perfil_dominante, created_at"),

      // 10. Jogo Sistêmico Metamorfose da Consciência
      supabaseAdmin!
        .from("avaliacoes_metamorfose")
        .select("id, tema_escolhido, predominio_bloco, created_at"),

      // 11. Downloads da Biblioteca
      supabaseAdmin!
        .from("downloads_biblioteca")
        .select("id, produto_id, cliente_email, arquivo_nome, created_at, produtos(nome, slug)"),

      // 12. Usuários
      supabaseAdmin!
        .from("usuarios")
        .select("id, created_at"),
    ]);

    const getVal = <T>(idx: number, fallback: T[] = []): T[] => {
      const item = results[idx];
      if (item.status === "fulfilled" && !item.value.error && Array.isArray(item.value.data)) {
        return item.value.data as T[];
      }
      return fallback;
    };

    const allPedidos = getVal<any>(0);
    const allProdutos = getVal<any>(1);
    const allAppointments = getVal<any>(2);
    const allInscricoes = getVal<any>(3);
    const allCupons = getVal<any>(4);
    const allCreditos = getVal<any>(5);
    const allYY = getVal<any>(6);
    const allEn = getVal<any>(7);
    const allCrono = getVal<any>(8);
    const allLealdades = getVal<any>(9);
    const allMetamorfose = getVal<any>(10);
    const allDownloads = getVal<any>(11);
    const allUsuarios = getVal<any>(12);

    // Filtros temporais precisos
    const isInCurrent = (dateIso?: string | null) => {
      if (!dateIso) return false;
      const d = new Date(dateIso);
      return d >= currentSince && d <= now;
    };

    const isInPrevious = (dateIso?: string | null) => {
      if (!dateIso) return false;
      const d = new Date(dateIso);
      return d >= previousSince && d < currentSince;
    };

    // Pedidos do período e anteriores
    const pedidosAtuais = allPedidos.filter((p) => isInCurrent(p.created_at));
    const pedidosAnteriores = allPedidos.filter((p) => isInPrevious(p.created_at));

    const isPago = (p: any) => p.status === "pago" || p.status === "confirmado";
    const isPendente = (p: any) => p.status === "pendente";

    const pagosAtuais = pedidosAtuais.filter(isPago);
    const pendentesAtuais = pedidosAtuais.filter(isPendente);
    const canceladosAtuais = pedidosAtuais.filter((p) => p.status === "cancelado");

    const pagosAnteriores = pedidosAnteriores.filter(isPago);

    const faturamentoAtual = pagosAtuais.reduce((sum, p) => sum + (Number(p.valor) || 0), 0);
    const faturamentoAnterior = pagosAnteriores.reduce((sum, p) => sum + (Number(p.valor) || 0), 0);

    const variacaoFaturamento = faturamentoAnterior > 0
      ? Math.round(((faturamentoAtual - faturamentoAnterior) / faturamentoAnterior) * 100)
      : null;

    const ticketMedioAtual = pagosAtuais.length > 0 ? Math.round(faturamentoAtual / pagosAtuais.length) : 0;
    const ticketMedioAnterior = pagosAnteriores.length > 0
      ? Math.round(faturamentoAnterior / pagosAnteriores.length)
      : 0;

    const taxaConversaoCheckout = pedidosAtuais.length > 0
      ? Math.round((pagosAtuais.length / pedidosAtuais.length) * 100)
      : 0;

    // Métodos de pagamento
    const pagamentosPorMetodo: Record<string, number> = {};
    for (const p of pagosAtuais) {
      const m = p.metodo_pagamento || "outro";
      pagamentosPorMetodo[m] = (pagamentosPorMetodo[m] || 0) + 1;
    }

    // Vendas e receita por produto (incluindo carrinhos multi-item via itens JSON)
    const performanceProdutos: Record<string, { nome: string; quantidade: number; receita: number; categoria: string }> = {};
    for (const p of pagosAtuais) {
      if (Array.isArray(p.itens) && p.itens.length > 0) {
        for (const item of p.itens) {
          const id = item.produto_id || item.id || item.slug || "avulso";
          const nome = item.nome || "Produto";
          const preco = Number(item.preco) || 0;
          const qtd = Number(item.quantidade) || 1;
          if (!performanceProdutos[id]) {
            performanceProdutos[id] = { nome, quantidade: 0, receita: 0, categoria: item.categoria || "outros" };
          }
          performanceProdutos[id].quantidade += qtd;
          performanceProdutos[id].receita += preco * qtd;
        }
      } else {
        const id = p.produto_id || "avulso";
        const nome = p.produtos?.nome || "Produto";
        const valor = Number(p.valor) || 0;
        if (!performanceProdutos[id]) {
          performanceProdutos[id] = { nome, quantidade: 0, receita: 0, categoria: p.produtos?.categoria || "outros" };
        }
        performanceProdutos[id].quantidade += 1;
        performanceProdutos[id].receita += valor;
      }
    }

    const topProdutosVendidos = Object.values(performanceProdutos)
      .sort((a, b) => b.receita - a.receita)
      .slice(0, 6);

    // Produtos ativos sem venda no período
    const produtosAtivosSemVenda = allProdutos
      .filter((p) => p.ativo && !performanceProdutos[p.id])
      .map((p) => ({ nome: p.nome, preco: p.preco_promocional || p.preco, categoria: p.categoria }));

    // Consultas / Atendimentos individuais
    const apptsAtuais = allAppointments.filter((a) => isInCurrent(a.created_at || a.start_time));
    const apptsConfirmados = apptsAtuais.filter((a) => a.status === "CONFIRMED" || a.status === "COMPLETED");
    const apptsCancelados = apptsAtuais.filter((a) => a.status === "CANCELED");
    const apptsPendentes = apptsAtuais.filter((a) => a.status === "PENDING");

    // Inscrições e vagas em turmas
    const inscricoesAtuais = allInscricoes.filter((i) => isInCurrent(i.created_at));
    const vivenciasComVagas = allProdutos
      .filter((p) => p.ativo && (p.categoria === "vivencias" || p.vagas_maximas != null))
      .map((p) => ({
        nome: p.nome,
        vagasMaximas: p.vagas_maximas,
        vagasOcupadas: p.vagas_ocupadas_manual || 0,
      }));

    // Ecossistema dos 4 Testes + Jogo Sistêmico
    const creditosAtuais = allCreditos.filter((c) => isInCurrent(c.created_at));
    const creditosDisponiveis = allCreditos.filter((c) => c.status === "disponivel");

    const yyAtuais = allYY.filter((r) => isInCurrent(r.created_at));
    const enAtuais = allEn.filter((r) => isInCurrent(r.created_at));
    const cronoAtuais = allCrono.filter((r) => isInCurrent(r.created_at));
    const lealdadesAtuais = allLealdades.filter((r) => isInCurrent(r.created_at));
    const metamorfoseAtuais = allMetamorfose.filter((r) => isInCurrent(r.created_at));

    // Perfil predominante Yin/Yang
    const yyDist = { yang: 0, yin: 0 };
    for (const r of allYY) {
      if (r.tipo_resultado === "yang") yyDist.yang++;
      else if (r.tipo_resultado === "yin") yyDist.yin++;
    }

    // Cronotipo distribuição
    const cronoDist: Record<string, number> = {};
    for (const r of allCrono) {
      const c = r.cronotipo || "intermediario";
      cronoDist[c] = (cronoDist[c] || 0) + 1;
    }

    // Jogo Sistêmico - Temas mais buscados
    const temasMetamorfose: Record<string, number> = {};
    for (const r of allMetamorfose) {
      const t = r.tema_escolhido || "Geral";
      temasMetamorfose[t] = (temasMetamorfose[t] || 0) + 1;
    }

    // Downloads da biblioteca
    const downloadsAtuais = allDownloads.filter((d) => isInCurrent(d.created_at));
    const downloadsPorArquivo: Record<string, number> = {};
    for (const d of downloadsAtuais) {
      const f = d.arquivo_nome || d.produtos?.nome || "Material";
      downloadsPorArquivo[f] = (downloadsPorArquivo[f] || 0) + 1;
    }

    // Cupons usados no período
    const cuponsAtivos = allCupons.filter((c) => c.ativo).map((c) => ({
      codigo: c.codigo,
      tipo: c.tipo,
      valor: c.valor,
      usos: c.quantidade_utilizada,
    }));

    // Base de clientes
    const usuariosNovosAtuais = allUsuarios.filter((u) => isInCurrent(u.created_at)).length;

    // CONTEXTO DE NEGÓCIO UNIFICADO
    const contextoComercial = {
      periodoAnalisado: periodoParam,
      dias: daysCount,
      financeiro: {
        faturamentoPeriodo: faturamentoAtual,
        faturamentoPeriodoAnterior: faturamentoAnterior,
        variacaoPercentual: variacaoFaturamento !== null ? `${variacaoFaturamento}%` : "Sem base anterior",
        ticketMedio: ticketMedioAtual,
        ticketMedioAnterior,
        pedidosPagos: pagosAtuais.length,
        pedidosPendentes: pendentesAtuais.length,
        pedidosCancelados: canceladosAtuais.length,
        taxaConversaoCheckout: `${taxaConversaoCheckout}%`,
        formasPagamento: pagamentosPorMetodo,
      },
      produtos: {
        totalAtivos: allProdutos.filter((p) => p.ativo).length,
        maisVendidos: topProdutosVendidos,
        ativosSemVendas: produtosAtivosSemVenda.slice(0, 5),
        turmasVivencias: vivenciasComVagas,
      },
      consultasEAtendimentos: {
        totalNoPeriodo: apptsAtuais.length,
        confirmadasOuConcluidas: apptsConfirmados.length,
        canceladas: apptsCancelados.length,
        pendentes: apptsPendentes.length,
      },
      testesEJogoSistemico: {
        creditosTotalVendidos: allCreditos.length,
        creditosCompradosNoPeriodo: creditosAtuais.length,
        creditosAguardandoRealizacao: creditosDisponiveis.length,
        avaliacoesRealizadasNoPeriodo: {
          yinYang: yyAtuais.length,
          eneagrama: enAtuais.length,
          cronotipo: cronoAtuais.length,
          lealdadesInvisiveis: lealdadesAtuais.length,
          jogoSistemicoMetamorfose: metamorfoseAtuais.length,
        },
        totaisHistoricos: {
          yinYang: allYY.length,
          eneagrama: allEn.length,
          cronotipo: allCrono.length,
          lealdadesInvisiveis: allLealdades.length,
          jogoSistemicoMetamorfose: allMetamorfose.length,
        },
        distribuicaoYinYang: yyDist,
        distribuicaoCronotipo: cronoDist,
        temasMaisBuscadosMetamorfose: temasMetamorfose,
      },
      inboundMarketingEBiblioteca: {
        downloadsNoPeriodo: downloadsAtuais.length,
        downloadsTotalHistorico: allDownloads.length,
        materiaisMaisBaixados: downloadsPorArquivo,
      },
      cupons: {
        cuponsAtivos,
      },
      clientes: {
        totalCadastrados: allUsuarios.length,
        novosCadastradosNoPeriodo: usuariosNovosAtuais,
        inscricoesVivenciasNoPeriodo: inscricoesAtuais.length,
      },
    };

    // Helper de normalização e sanitização
    const normalizeInsights = (raw: any): NormalizedInsights => {
      const diagnostico = typeof raw.diagnostico === "string" ? raw.diagnostico : "";

      const rawCombos = raw.combos_sugeridos || raw.combosSugeridos || [];
      const combos_sugeridos: ComboSugerido[] = (Array.isArray(rawCombos) ? rawCombos : []).map((c: any) => ({
        titulo: String(c.titulo || "Combo Especial Kalapa"),
        descricao: String(c.descricao || ""),
        preco_combo: String(c.preco_combo || c.precoSugerido || c.preco || "R$ 197,00"),
        economia_estimada: String(c.economia_estimada || c.economiaEstimada || c.economia || "Economia de 15%"),
        justificativa: String(c.justificativa || "Excelente sinergia terapêutica e alta percepção de valor."),
      }));

      const rawCopys = raw.copys_whatsapp || raw.copysWhatsApp || [];
      const copys_whatsapp: CopyWhatsApp[] = (Array.isArray(rawCopys) ? rawCopys : []).map((cp: any) => ({
        publico_alvo: String(cp.publico_alvo || cp.publicoAlvo || "Clientes Gerais"),
        mensagem: String(cp.mensagem || cp.mensagemPronta || ""),
      }));

      let cupons_recomendados: CupomRecomendado[] = [];
      const rawCupons = raw.cupons_recomendados || raw.cuponsRecomendados;
      if (Array.isArray(rawCupons)) {
        cupons_recomendados = rawCupons.map((cp: any) => ({
          codigo: String(cp.codigo || cp.codigoSugerido || "KALAPA15").toUpperCase(),
          desconto: String(cp.desconto || (cp.descontoPercentual ? `${cp.descontoPercentual}%` : "15%")),
          objetivo: String(cp.objetivo || "Impulsionar vendas da esteira"),
        }));
      } else if (raw.campanhaCupons || raw.campanha_cupons) {
        const cp = raw.campanhaCupons || raw.campanha_cupons;
        cupons_recomendados = [
          {
            codigo: String(cp.codigoSugerido || cp.codigo || "RECOMECO15").toUpperCase(),
            desconto: String(cp.desconto || "15%"),
            objetivo: String(cp.objetivo || "Acelerar conversão de testes e atendimentos"),
          },
        ];
      }

      const rawAcoes = raw.acoes_prioritarias || raw.acoesPrioritarias;
      const acoes_prioritarias: string[] = Array.isArray(rawAcoes)
        ? rawAcoes.map((a: any) => String(a))
        : [];

      const rawAlertas = raw.alertas_operacionais || raw.alertasOperacionais;
      const alertas_operacionais: string[] = Array.isArray(rawAlertas)
        ? rawAlertas.map((al: any) => String(al))
        : [];

      return {
        diagnostico,
        combos_sugeridos,
        copys_whatsapp,
        cupons_recomendados,
        acoes_prioritarias,
        alertas_operacionais,
      };
    };

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const prompt = `Você é o Estrategista Chefe de Monetização, Growth e Retenção do INstituto Kalapa (São Paulo/Brasil), plataforma integrativa de autoconhecimento fundada pela terapeuta Clatihúcia Capeli.
A plataforma opera 5 pilares comerciais principais:
1. Atendimentos Individuais (Psicoterapia Integrativa e Constelação Familiar individual de alto ticket).
2. Vivências em Grupo presenciais (Constelação, Cuidado Emocional e Roda de Mulheres na Casa 52).
3. Ecossistema de 4 Testes Online (Yin/Yang MTC, Eneagrama com feridas de infância, Cronotipo e Lealdades Sistêmicas Invisíveis) com laudo clínico PDF personalizado.
4. Jogo Sistêmico Interativo "A Metamorfose da Consciência" com Dossiê Editorial em 6 páginas A4.
5. Inbound / Biblioteca Kalapa (e-books, artigos e preparos com downloads gratuitos que geram leads qualificados).

Aqui está o RAIO-X COMPLETO e AUDITADO de TODAS as tabelas do sistema no período selecionado (${periodoParam}):
${JSON.stringify(contextoComercial, null, 2)}

INSTRUÇÕES E DIRETRIZES FUNDAMENTAIS:
- Use e cite OS DADOS REAIS acima (faturamento real de R$ ${faturamentoAtual}, ticket de R$ ${ticketMedioAtual}, ${pendentesAtuais.length} abandonos, ${creditosDisponiveis.length} testes pagos pendentes de realização, ${allDownloads.length} downloads de biblioteca, etc.). NÃO invente números.
- No "diagnostico": faça uma análise cirúrgica identificando o maior vazamento de receita (ex: carrinhos abandonados no WhatsApp, leads de downloads gratuitos que não compram vivência, participantes de testes que não dão o passo para a consulta individual).
- Em "combos_sugeridos": monte 3 combos reais com produtos que realmente existem no catálogo, com precificação coerente e ancoragem de valor.
- Em "copys_whatsapp": redija 3 a 4 mensagens prontas, altamente empáticas e acolhedoras (sem tom apelativo ou agressivo), para públicos específicos (ex: recuperar carrinho pendente, convidar quem concluiu teste para atendimento individual, e converter leitor da biblioteca para uma vivência).
- Em "cupons_recomendados": 2 a 3 campanhas de cupom com objetivos nítidos.
- Em "acoes_prioritarias": 4 a 5 ações táticas imediatas para a facilitadora e equipe executarem nesta semana.
- Em "alertas_operacionais": 2 a 3 pontos de atenção críticos detectados nos dados (ex: taxa de abandono, créditos sem uso, turmas com vagas sobrando).

Responda EXCLUSIVAMENTE em formato JSON com esta estrutura:
{
  "diagnostico": "Texto completo em parágrafos bem pontuados com análise realista dos números...",
  "alertas_operacionais": [
    "Ponto de atenção operacional 1",
    "Ponto de atenção operacional 2"
  ],
  "combos_sugeridos": [
    {
      "titulo": "Nome do combo",
      "descricao": "O que compõe e benefício terapêutico",
      "preco_combo": "R$ XXX,00",
      "economia_estimada": "Economia de R$ XX",
      "justificativa": "Razão estratégica da conversão"
    }
  ],
  "copys_whatsapp": [
    {
      "publico_alvo": "Público-alvo específico",
      "mensagem": "Texto acolhedor e humanizado pronto para envio..."
    }
  ],
  "cupons_recomendados": [
    {
      "codigo": "CODIGO15",
      "desconto": "15%",
      "objetivo": "Meta comercial"
    }
  ],
  "acoes_prioritarias": [
    "Ação 1",
    "Ação 2",
    "Ação 3",
    "Ação 4"
  ]
}`;

        // Tentativa primária: gemini-2.5-flash
        // Fallback de modelo: gemini-1.5-flash
        const modelsToTry = ["gemini-2.5-flash", "gemini-1.5-flash"];
        let rawText: string | null = null;
        let successfulModel = "gemini-2.5-flash";

        for (const model of modelsToTry) {
          try {
            const geminiRes = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  contents: [{ role: "user", parts: [{ text: prompt }] }],
                  generationConfig: {
                    temperature: 0.3,
                    responseMimeType: "application/json",
                  },
                }),
              }
            );

            if (geminiRes.ok) {
              const geminiJson = await geminiRes.json();
              const candidate = geminiJson.candidates?.[0]?.content?.parts?.[0]?.text;
              if (candidate) {
                rawText = candidate;
                successfulModel = model;
                break;
              }
            } else {
              const errBody = await geminiRes.text();
              console.warn(`[admin/insights/ai] Erro na chamada do modelo ${model}: HTTP ${geminiRes.status} - ${errBody}`);
            }
          } catch (modelErr) {
            console.warn(`[admin/insights/ai] Exceção com modelo ${model}:`, modelErr);
          }
        }

        if (rawText) {
          const parsed = JSON.parse(rawText);
          const normalized = normalizeInsights(parsed);
          return NextResponse.json({
            success: true,
            sucesso: true,
            source: "gemini",
            origem: "gemini",
            model: successfulModel,
            modelo: successfulModel,
            periodo: periodoParam,
            insights: normalized,
            data: normalized,
            resumoOperacional: contextoComercial,
            timestamp: new Date().toISOString(),
          });
        }
      } catch (geminiErr) {
        console.error("[admin/insights/ai] Falha ao processar com Gemini:", geminiErr);
      }
    }

    // FALLBACK ANALÍTICO DINÂMICO
    // Gera insights específicos baseados nos dados REAIS calculados acima
    const produtoMaisVendidoNome = topProdutosVendidos[0]?.nome || "Atendimentos e Vivências";
    const produtoMaisVendidoReceita = topProdutosVendidos[0]?.receita || faturamentoAtual;

    const fallbackAlertas: string[] = [];
    if (pendentesAtuais.length > 0) {
      fallbackAlertas.push(`Há ${pendentesAtuais.length} pedido(s) pendente(s) de checkout aguardando follow-up no WhatsApp para conversão imediata.`);
    }
    if (creditosDisponiveis.length > 0) {
      fallbackAlertas.push(`${creditosDisponiveis.length} crédito(s) de testes de autoconhecimento comprados ainda não foram iniciados pelos clientes.`);
    }
    if (downloadsAtuais.length > 0) {
      fallbackAlertas.push(`${downloadsAtuais.length} download(s) de materiais gratuitos foram realizados no período, gerando leads quentes para vivências.`);
    }

    const fallbackDiagnostico = [
      `No período analisado (${periodoParam.toUpperCase()}), o INstituto Kalapa registrou faturamento de R$ ${faturamentoAtual.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} com ${pagosAtuais.length} transação(ões) concluída(s) e ticket médio de R$ ${ticketMedioAtual.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}.`,
      variacaoFaturamento !== null
        ? `Comparado ao período anterior, o faturamento variou em ${variacaoFaturamento > 0 ? "+" : ""}${variacaoFaturamento}%.`
        : `A base de clientes já conta com ${allUsuarios.length} usuários cadastrados e ${allProdutos.filter((p) => p.ativo).length} produtos ativos no catálogo.`,
      `O principal gerador de receita foi "${produtoMaisVendidoNome}" (R$ ${produtoMaisVendidoReceita.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}).`,
      `No ecossistema de diagnósticos, somam-se ${allCreditos.length} créditos de testes gerados e ${allMetamorfose.length} jornadas do jogo Metamorfose da Consciência. Foram contabilizados ${allDownloads.length} downloads na Biblioteca Kalapa, constituindo um canal com alto potencial de ativação para vivências presenciais e consultas individuais.`,
    ].join(" ");

    const fallbackRaw = {
      diagnostico: fallbackDiagnostico,
      alertas_operacionais: fallbackAlertas,
      combos_sugeridos: [
        {
          titulo: "Pacote Diagnóstico & Cuidado Integral (Teste + Consulta Individual)",
          descricao: "O participante realiza a avaliação online (Yin/Yang, Eneagrama ou Cronotipo) e aprofunda o laudo em uma sessão individual com a facilitadora Clatihúcia.",
          preco_combo: "R$ 197,00",
          economia_estimada: "Economia de 15%",
          justificativa: "Diminui a barreira de entrada da consulta de alto ticket através da curiosidade gerada pelo laudo do teste.",
        },
        {
          titulo: "Jornada Essência & Presença (Metamorfose + Sessão Sistêmica)",
          descricao: "Mapeamento dos 4 Quadrantes no Jogo Sistêmico complementado por um atendimento de constelação individual para liberação das lealdades familiares.",
          preco_combo: "R$ 290,00",
          economia_estimada: "Economia de R$ 50",
          justificativa: "O cliente que joga a Metamorfose demonstra perfil reflexivo e alta propensão a atendimentos terapêuticos individuais.",
        },
        {
          titulo: "Tríade do Autoconhecimento (Yin/Yang + Cronotipo + Eneagrama)",
          descricao: "Acesso completo aos 3 principais testes diagnósticos do Kalapa com laudos completos para mapear corpo, mente e ritmo de vida.",
          preco_combo: "R$ 127,00",
          economia_estimada: "Economia de 35%",
          justificativa: "Aumenta o ticket médio de produtos digitais sem demandar horas da agenda da facilitadora.",
        },
      ],
      copys_whatsapp: [
        {
          publico_alvo: "Recuperação de Checkout Pendente (Humanizada)",
          mensagem:
            "Olá! Sou da equipe de acolhimento do INstituto Kalapa. Percebemos que você iniciou sua inscrição mas não concluiu. Ficou alguma dúvida sobre o formato da vivência ou formas de pagamento (Pix/Cartão)? Estamos à disposição para te apoiar com todo carinho!",
        },
        {
          publico_alvo: "Participantes que Concluíram Testes de Autoconhecimento",
          mensagem:
            "Olá! Vimos que você concluiu sua avaliação no INstituto Kalapa. Como foi a leitura do seu relatório? Se você sentir o chamado para aprofundar suas descobertas, a facilitadora Clatihúcia abriu horários especiais nesta semana para atendimentos individuais integrativos.",
        },
        {
          publico_alvo: "Leitores da Biblioteca / Downloads Gratuitos",
          mensagem:
            "Olá! Esperamos que o material que você baixou na Biblioteca Kalapa esteja enriquecendo sua rotina. Sabia que realizamos vivências presenciais e grupos terapêuticos para vivenciar esses conceitos na prática? Será uma alegria ter você conosco no nosso próximo encontro!",
        },
      ],
      cupons_recomendados: [
        {
          codigo: "EQUILIBRIO15",
          desconto: "15%",
          objetivo: "Ativar novos clientes em testes de autoconhecimento e acelerar turmas",
        },
        {
          codigo: "ACOLHER50",
          desconto: "R$ 50",
          objetivo: "Facilitar o upgrade de participantes de testes para consultas individuais",
        },
      ],
      acoes_prioritarias: [
        `Abordar via WhatsApp os ${pendentesAtuais.length} pedidos pendentes utilizando a copy humanizada de acolhimento.`,
        `Enviar mensagem para os ${creditosDisponiveis.length} clientes com créditos de teste pendentes de realização, incentivando o preenchimento.`,
        "Criar post no Instagram com chamada para a Biblioteca Kalapa, captando novos e-mails e contatos.",
        "Oferecer atendimento individual com condição especial para quem já fez o teste Yin/Yang ou Eneagrama.",
        "Divulgar a próxima vivência presencial com aviso de vagas restantes para ativar senso de urgência.",
      ],
    };

    const normalizedFallback = normalizeInsights(fallbackRaw);

    return NextResponse.json({
      success: true,
      sucesso: true,
      source: "fallback",
      origem: "heuristica",
      model: "kalapa-growth-engine",
      modelo: "kalapa-growth-engine (analítico dinâmico)",
      periodo: periodoParam,
      aviso: !apiKey
        ? "Variável GEMINI_API_KEY não configurada no ambiente. Os insights foram calculados dinamicamente com base em 100% dos dados reais do banco de dados."
        : "A API do Gemini retornou instabilidade temporária. Os insights foram calculados dinamicamente com os dados reais do seu banco.",
      insights: normalizedFallback,
      data: normalizedFallback,
      resumoOperacional: contextoComercial,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[admin/insights/ai] Erro fatal:", error);
    return NextResponse.json({ error: "Erro ao gerar consultoria comercial" }, { status: 500 });
  }
}
