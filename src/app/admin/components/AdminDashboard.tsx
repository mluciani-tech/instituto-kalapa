"use client";

import { useState, useEffect, useCallback } from "react";
import {
  TrendingUp,
  Users,
  CreditCard,
  CheckCircle2,
  DollarSign,
  AlertCircle,
  Clock,
  RefreshCw,
  MessageCircle,
  ArrowUpRight,
  Sparkles,
  PieChart as PieIcon,
  BarChart3,
  Flame,
  Brain,
  Calendar,
  Compass,
  Copy,
  Check,
  Bot,
  Zap,
  Tag,
  Lightbulb,
} from "lucide-react";

interface LinhaNegocioItem {
  receita: number;
  count: number;
  ticketMedio: number;
  percentualReceita: number;
}

interface MonitorTestesData {
  totalCreditosVendidos: number;
  totalCreditosUtilizados: number;
  totalCreditosDisponiveis: number;
  taxaAtivacao: number;
}

interface AICombo {
  titulo: string;
  descricao: string;
  preco_combo: string;
  economia_estimada: string;
  justificativa: string;
}

interface AICopy {
  publico_alvo: string;
  mensagem: string;
}

interface AICupom {
  codigo: string;
  desconto: string;
  objetivo: string;
}

export interface AIInsightData {
  diagnostico: string;
  combos_sugeridos: AICombo[];
  copys_whatsapp: AICopy[];
  cupons_recomendados: AICupom[];
  acoes_prioritarias: string[];
}

interface DashboardData {
  periodo: string;
  kpis: {
    faturamentoPeriodo: number;
    faturamentoTotal: number;
    pedidosPagosPeriodo: number;
    pedidosTotalPeriodo: number;
    ticketMedioPeriodo: number;
    taxaConversaoPeriodo: number;
    totalVagasOcupadas: number;
    totalUsuarios: number;
    totalDescontoPeriodo: number;
    cuponsUsadosPeriodo: number;
  };
  linhasNegocio?: {
    testes: LinhaNegocioItem;
    atendimentos: LinhaNegocioItem;
    vivencias: LinhaNegocioItem;
  };
  monitorTestes?: MonitorTestesData;
  timeline: {
    date: string;
    label: string;
    valor: number;
    pedidos: number;
  }[];
  metodosPagamento: {
    pix: { count: number; valor: number; percentual: number };
    cartao: { count: number; valor: number; percentual: number };
    outros: { count: number; valor: number; percentual: number };
  };
  produtosRanking: {
    id: string;
    nome: string;
    slug: string;
    ativo?: boolean;
    receita: number;
    vagas_maximas: number | null;
    vagas_preenchidas: number;
    percentual_ocupacao: number | null;
    status_ocupacao: "lotada" | "quase_lotada" | "aberta";
  }[];
  pedidosPendentesRecentes: {
    id: string;
    order_nsu: string;
    cliente_nome: string;
    cliente_email: string;
    cliente_telefone: string | null;
    telefone_whatsapp: string | null;
    valor: number;
    produto_nome: string;
    categoria?: "testes" | "atendimentos" | "vivencias";
    created_at: string;
  }[];
  totaisGerais: {
    pedidosPagos: number;
    pedidosPendentes: number;
    pedidosCancelados: number;
  };
}

interface AdminDashboardProps {
  onNavigateTab: (tab: "produtos" | "pedidos" | "participantes" | "cupons" | "usuarios") => void;
}

export default function AdminDashboard({ onNavigateTab }: AdminDashboardProps) {
  const [periodo, setPeriodo] = useState<"7d" | "30d" | "90d" | "total">("30d");
  const [statusProdutoFiltro, setStatusProdutoFiltro] = useState<"todos" | "ativos" | "inativos">("todos");
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tipoGrafico, setTipoGrafico] = useState<"valor" | "pedidos">("valor");
  const [hoveredPoint, setHoveredPoint] = useState<{
    x: number;
    y: number;
    label: string;
    valor: number;
    pedidos: number;
  } | null>(null);

  // Estados de IA & Monetização (Gemini)
  const [aiInsights, setAiInsights] = useState<AIInsightData | null>(null);
  const [aiSource, setAiSource] = useState<"gemini" | "fallback" | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [errorAi, setErrorAi] = useState("");
  const [copiadoIdx, setCopiadoIdx] = useState<number | null>(null);

  const totalProdutos = data?.produtosRanking.length || 0;
  const totalAtivos = data?.produtosRanking.filter((p) => p.ativo !== false).length || 0;
  const totalInativos = data?.produtosRanking.filter((p) => p.ativo === false).length || 0;

  const produtosFiltrados = (data?.produtosRanking || []).filter((p) => {
    if (statusProdutoFiltro === "ativos") return p.ativo !== false;
    if (statusProdutoFiltro === "inativos") return p.ativo === false;
    return true;
  });

  const vagasOcupadasFiltradas = produtosFiltrados.reduce(
    (sum, p) => sum + (p.vagas_preenchidas || 0),
    0
  );

  const receitaProdutosFiltrados = produtosFiltrados.reduce(
    (sum, p) => sum + (p.receita || 0),
    0
  );

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/dashboard?periodo=${periodo}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      } else {
        const errJson = await res.json();
        setError(errJson.error || "Erro ao carregar dados do dashboard");
      }
    } catch {
      setError("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  }, [periodo]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const formatMoney = (val: number) => {
    return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const formatDateShort = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
    } catch {
      return iso;
    }
  };

  // Disparo da IA Gemini para análise de monetização
  const handleGerarInsightsAI = async () => {
    setLoadingAi(true);
    setErrorAi("");
    try {
      const res = await fetch("/api/admin/insights/ai", { method: "POST" });
      const json = await res.json();
      if (res.ok && json.insights) {
        setAiInsights(json.insights);
        setAiSource(json.source || "gemini");
      } else {
        setErrorAi(json.error || "Não foi possível gerar os insights no momento.");
      }
    } catch {
      setErrorAi("Erro de comunicação ao gerar consultoria com IA.");
    } finally {
      setLoadingAi(false);
    }
  };

  const handleCopiarTexto = (texto: string, idx: number) => {
    navigator.clipboard.writeText(texto);
    setCopiadoIdx(idx);
    setTimeout(() => setCopiadoIdx(null), 2500);
  };

  // Coordenadas para o gráfico SVG de linha/área
  const renderSvgTimeline = () => {
    if (!data || !data.timeline || data.timeline.length === 0) return null;

    const points = data.timeline;
    const width = 800;
    const height = 220;
    const paddingX = 40;
    const paddingY = 30;

    const values = points.map((p) => (tipoGrafico === "valor" ? p.valor : p.pedidos));
    const maxValue = Math.max(...values, tipoGrafico === "valor" ? 100 : 5);

    const stepX = (width - paddingX * 2) / Math.max(points.length - 1, 1);

    const coords = points.map((p, i) => {
      const v = tipoGrafico === "valor" ? p.valor : p.pedidos;
      const x = paddingX + i * stepX;
      const y = height - paddingY - (v / maxValue) * (height - paddingY * 2);
      return { x, y, point: p };
    });

    const pathD = coords.reduce((acc, curr, idx) => {
      return idx === 0 ? `M ${curr.x},${curr.y}` : `${acc} L ${curr.x},${curr.y}`;
    }, "");

    const areaD = `${pathD} L ${coords[coords.length - 1].x},${height - paddingY} L ${coords[0].x},${height - paddingY} Z`;

    return (
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-56 sm:h-64 overflow-visible"
        >
          <defs>
            <linearGradient id="kalapaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1A3C4D" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#1A3C4D" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Linhas de grade horizontal */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = height - paddingY - ratio * (height - paddingY * 2);
            const val = ratio * maxValue;
            return (
              <g key={i}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#EFEBE4"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[10px] fill-brand-charcoal/40"
                >
                  {tipoGrafico === "valor" ? `R$ ${Math.round(val)}` : Math.round(val)}
                </text>
              </g>
            );
          })}

          {/* Área preenchida */}
          <path d={areaD} fill="url(#kalapaGrad)" />

          {/* Linha principal */}
          <path
            d={pathD}
            fill="none"
            stroke="#1A3C4D"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Pontos interativos */}
          {coords.map((c, i) => (
            <g key={i} className="cursor-pointer group">
              <circle
                cx={c.x}
                cy={c.y}
                r="4"
                className="fill-white stroke-brand-purple stroke-2 transition-transform duration-200 group-hover:scale-150"
                onMouseEnter={() =>
                  setHoveredPoint({
                    x: c.x,
                    y: c.y,
                    label: c.point.label,
                    valor: c.point.valor,
                    pedidos: c.point.pedidos,
                  })
                }
                onMouseLeave={() => setHoveredPoint(null)}
              />
              {/* Rótulo de data em dias alternados para não poluir */}
              {(points.length <= 14 || i % Math.ceil(points.length / 10) === 0) && (
                <text
                  x={c.x}
                  y={height - 10}
                  textAnchor="middle"
                  className="text-[10px] fill-brand-charcoal/50 select-none font-medium"
                >
                  {c.point.label}
                </text>
              )}
            </g>
          ))}
        </svg>

        {/* Tooltip flutuante */}
        {hoveredPoint && (
          <div
            className="absolute z-20 pointer-events-none bg-brand-purple text-white text-xs rounded-lg py-1.5 px-3 shadow-lg transform -translate-x-1/2 -translate-y-full transition-all"
            style={{
              left: `${(hoveredPoint.x / width) * 100}%`,
              top: `${(hoveredPoint.y / height) * 100}%`,
              marginTop: "-10px",
            }}
          >
            <div className="font-semibold text-brand-beige">{hoveredPoint.label}</div>
            <div className="text-[11px] whitespace-nowrap">
              {formatMoney(hoveredPoint.valor)} · {hoveredPoint.pedidos} pedido(s)
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Topo com Saudação e Seletor de Período */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-brand-beige shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-brand-purple flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-terracotta" />
              Visão Geral & Performance
            </h2>
          </div>
          <p className="text-xs text-brand-charcoal/60 mt-0.5">
            Métricas em tempo real de vendas, vagas e conversão do INstituto Kalapa
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Filtro de Período */}
          <div className="bg-brand-beige-light p-1 rounded-xl border border-brand-beige flex text-xs font-medium">
            <button
              onClick={() => setPeriodo("7d")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                periodo === "7d"
                  ? "bg-brand-purple text-white shadow-xs font-semibold"
                  : "text-brand-charcoal/60 hover:text-brand-charcoal"
              }`}
            >
              7 dias
            </button>
            <button
              onClick={() => setPeriodo("30d")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                periodo === "30d"
                  ? "bg-brand-purple text-white shadow-xs font-semibold"
                  : "text-brand-charcoal/60 hover:text-brand-charcoal"
              }`}
            >
              30 dias
            </button>
            <button
              onClick={() => setPeriodo("90d")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                periodo === "90d"
                  ? "bg-brand-purple text-white shadow-xs font-semibold"
                  : "text-brand-charcoal/60 hover:text-brand-charcoal"
              }`}
            >
              90 dias
            </button>
            <button
              onClick={() => setPeriodo("total")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                periodo === "total"
                  ? "bg-brand-purple text-white shadow-xs font-semibold"
                  : "text-brand-charcoal/60 hover:text-brand-charcoal"
              }`}
            >
              Todo Histórico
            </button>
          </div>

          <button
            onClick={fetchDashboard}
            disabled={loading}
            className="p-2 border border-brand-beige rounded-xl hover:bg-brand-beige/40 text-brand-charcoal/70 transition-colors disabled:opacity-50 cursor-pointer"
            title="Recarregar dados"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchDashboard} className="underline text-xs font-semibold">Tentar novamente</button>
        </div>
      )}

      {/* Grid de Cards de KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Faturamento */}
        <div className="bg-white p-5 rounded-2xl border border-brand-beige shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-brand-charcoal/60">
              {periodo === "total" ? "Faturamento Histórico" : "Faturamento no Período"}
            </span>
            <div className="w-9 h-9 rounded-xl bg-brand-purple/10 flex items-center justify-center text-brand-purple">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-brand-purple tracking-tight">
              {data ? formatMoney(data.kpis.faturamentoPeriodo) : "—"}
            </div>
            {periodo !== "total" && data && (
              <p className="text-[11px] text-brand-charcoal/50 mt-1">
                Total histórico: {formatMoney(data.kpis.faturamentoTotal)}
              </p>
            )}
          </div>
        </div>

        {/* Card 2: Vagas Ocupadas */}
        <div className="bg-white p-5 rounded-2xl border border-brand-beige shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-brand-charcoal/60">
              Vagas Ocupadas
            </span>
            <div className="w-9 h-9 rounded-xl bg-brand-mint/15 flex items-center justify-center text-brand-mint-dark">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-brand-purple tracking-tight">
              {data ? `${vagasOcupadasFiltradas} participantes` : "—"}
            </div>
            <p className="text-[11px] text-brand-charcoal/50 mt-1">
              {statusProdutoFiltro === "todos"
                ? "Nas turmas e vivências (todas)"
                : statusProdutoFiltro === "ativos"
                ? "Nas turmas e vivências ativas"
                : "Nas vivências inativas / encerradas"}
            </p>
          </div>
        </div>

        {/* Card 3: Ticket Médio */}
        <div className="bg-white p-5 rounded-2xl border border-brand-beige shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-brand-charcoal/60">
              Ticket Médio por Venda
            </span>
            <div className="w-9 h-9 rounded-xl bg-brand-terracotta/15 flex items-center justify-center text-brand-terracotta-dark">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-brand-purple tracking-tight">
              {data ? formatMoney(data.kpis.ticketMedioPeriodo) : "—"}
            </div>
            <p className="text-[11px] text-brand-charcoal/50 mt-1">
              {data ? `${data.kpis.pedidosPagosPeriodo} pedido(s) pagos` : "—"}
            </p>
          </div>
        </div>

        {/* Card 4: Taxa de Conversão */}
        <div className="bg-white p-5 rounded-2xl border border-brand-beige shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-brand-charcoal/60">
              Conversão de Checkout
            </span>
            <div className="w-9 h-9 rounded-xl bg-brand-purple-light/50 flex items-center justify-center text-brand-purple">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-brand-purple tracking-tight">
              {data ? `${data.kpis.taxaConversaoPeriodo.toFixed(1)}%` : "—"}
            </div>
            <p className="text-[11px] text-brand-charcoal/50 mt-1">
              {data ? `${data.kpis.pedidosPagosPeriodo} de ${data.kpis.pedidosTotalPeriodo} checkouts` : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Seção: Desempenho por Linha de Negócio & Monitor de Ativação de Testes */}
      {data?.linhasNegocio && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-brand-purple flex items-center gap-2">
                <Compass className="w-4 h-4 text-brand-purple" />
                Mix de Linhas de Negócio & Comercialização
              </h3>
              <p className="text-xs text-brand-charcoal/50 mt-0.5">
                Comparativo de faturamento entre Testes Online, Atendimentos e Vivências
              </p>
            </div>
            {data.monitorTestes && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-brand-purple/10 text-brand-purple border border-brand-purple/20">
                <Brain className="w-3.5 h-3.5" />
                {data.monitorTestes.taxaAtivacao}% dos testes ativados
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card Linha 1: Testes Online */}
            <div className="bg-gradient-to-br from-purple-50/80 to-white p-5 rounded-2xl border border-purple-100 shadow-xs relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-purple-800 uppercase tracking-wider flex items-center gap-1">
                    <Brain className="w-3.5 h-3.5" />
                    Testes Online
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                    {data.linhasNegocio.testes.percentualReceita}% da receita
                  </span>
                </div>
                <div className="text-xl font-bold text-brand-purple mt-3">
                  {formatMoney(data.linhasNegocio.testes.receita)}
                </div>
                <div className="mt-2 space-y-1 text-xs text-brand-charcoal/70">
                  <div className="flex justify-between">
                    <span>Vendas no período:</span>
                    <strong className="text-brand-purple font-semibold">{data.linhasNegocio.testes.count}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Ticket Médio:</span>
                    <strong className="text-brand-purple font-semibold">{formatMoney(data.linhasNegocio.testes.ticketMedio)}</strong>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-2.5 border-t border-purple-100 text-[11px] text-purple-800/80 font-medium">
                🎯 Autonomia & Escala digital 24/7
              </div>
            </div>

            {/* Card Linha 2: Atendimentos Individuais */}
            <div className="bg-gradient-to-br from-amber-50/70 to-white p-5 rounded-2xl border border-amber-100 shadow-xs relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Atendimentos
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                    {data.linhasNegocio.atendimentos.percentualReceita}% da receita
                  </span>
                </div>
                <div className="text-xl font-bold text-brand-purple mt-3">
                  {formatMoney(data.linhasNegocio.atendimentos.receita)}
                </div>
                <div className="mt-2 space-y-1 text-xs text-brand-charcoal/70">
                  <div className="flex justify-between">
                    <span>Vendas no período:</span>
                    <strong className="text-brand-purple font-semibold">{data.linhasNegocio.atendimentos.count}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Ticket Médio:</span>
                    <strong className="text-brand-purple font-semibold">{formatMoney(data.linhasNegocio.atendimentos.ticketMedio)}</strong>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-2.5 border-t border-amber-100 text-[11px] text-amber-800/80 font-medium">
                🌿 Terapias & acompanhamentos 1 a 1
              </div>
            </div>

            {/* Card Linha 3: Vivências & Cursos */}
            <div className="bg-gradient-to-br from-emerald-50/70 to-white p-5 rounded-2xl border border-emerald-100 shadow-xs relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5" />
                    Vivências & Cursos
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {data.linhasNegocio.vivencias.percentualReceita}% da receita
                  </span>
                </div>
                <div className="text-xl font-bold text-brand-purple mt-3">
                  {formatMoney(data.linhasNegocio.vivencias.receita)}
                </div>
                <div className="mt-2 space-y-1 text-xs text-brand-charcoal/70">
                  <div className="flex justify-between">
                    <span>Inscrições no período:</span>
                    <strong className="text-brand-purple font-semibold">{data.linhasNegocio.vivencias.count}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Ticket Médio:</span>
                    <strong className="text-brand-purple font-semibold">{formatMoney(data.linhasNegocio.vivencias.ticketMedio)}</strong>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-2.5 border-t border-emerald-100 text-[11px] text-emerald-800/80 font-medium">
                ✨ Encontros em grupo e imersões
              </div>
            </div>

            {/* Card Monitor de Ativação de Testes */}
            {data.monitorTestes ? (
              <div className="bg-white p-5 rounded-2xl border border-brand-beige shadow-xs relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-brand-charcoal uppercase tracking-wider flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-brand-terracotta" />
                      Ativação de Testes
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-mint/20 text-brand-mint-dark">
                      {data.monitorTestes.taxaAtivacao}% realizada
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xl font-bold text-brand-purple">
                        {data.monitorTestes.totalCreditosUtilizados} / {data.monitorTestes.totalCreditosVendidos}
                      </span>
                      <span className="text-[11px] text-brand-charcoal/50">testes feitos</span>
                    </div>
                    {/* Barra de Ativação */}
                    <div className="w-full bg-brand-beige rounded-full h-2 mt-2 overflow-hidden">
                      <div
                        className="bg-brand-purple h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(data.monitorTestes.taxaAtivacao, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="mt-3 flex justify-between text-xs text-brand-charcoal/70">
                    <span>Disponíveis para uso:</span>
                    <strong className="text-brand-purple font-semibold">
                      {data.monitorTestes.totalCreditosDisponiveis} crédito(s)
                    </strong>
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-brand-beige text-[11px] text-brand-charcoal/60">
                  💡 Clientes com créditos pendentes podem ser convidados a responder via WhatsApp.
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Seção Principal de Gráficos e Ocupação */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de Evolução Temporal (2 colunas) */}
        <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-2xl border border-brand-beige shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-sm font-bold text-brand-purple flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-brand-purple" />
                Evolução de Vendas no Tempo
              </h3>
              <p className="text-xs text-brand-charcoal/50 mt-0.5">
                Distribuição diária de faturamento e inscrições
              </p>
            </div>

            <div className="flex bg-brand-beige-light border border-brand-beige rounded-lg p-0.5 text-xs font-medium self-start">
              <button
                onClick={() => setTipoGrafico("valor")}
                className={`px-3 py-1 rounded-md transition-all ${
                  tipoGrafico === "valor"
                    ? "bg-white text-brand-purple shadow-xs font-semibold"
                    : "text-brand-charcoal/60 hover:text-brand-charcoal"
                }`}
              >
                Receita (R$)
              </button>
              <button
                onClick={() => setTipoGrafico("pedidos")}
                className={`px-3 py-1 rounded-md transition-all ${
                  tipoGrafico === "pedidos"
                    ? "bg-white text-brand-purple shadow-xs font-semibold"
                    : "text-brand-charcoal/60 hover:text-brand-charcoal"
                }`}
              >
                Qtd. Pedidos
              </button>
            </div>
          </div>

          {loading ? (
            <div className="h-60 flex items-center justify-center text-xs text-brand-charcoal/40">
              <RefreshCw className="w-5 h-5 animate-spin mr-2" /> Carregando gráfico...
            </div>
          ) : (
            renderSvgTimeline()
          )}
        </div>

        {/* Mix de Pagamentos e Estatísticas de Conversão (1 coluna) */}
        <div className="space-y-6">
          {/* Card Formas de Pagamento */}
          <div className="bg-white p-5 rounded-2xl border border-brand-beige shadow-xs">
            <h3 className="text-sm font-bold text-brand-purple mb-1 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-brand-terracotta" />
              Mix de Pagamentos
            </h3>
            <p className="text-xs text-brand-charcoal/50 mb-4">
              Preferência dos clientes no período
            </p>

            {data && (
              <div className="space-y-4">
                {/* Barra Segmentada Visual */}
                <div className="w-full h-3 rounded-full bg-brand-beige/50 overflow-hidden flex">
                  <div
                    style={{ width: `${data.metodosPagamento.pix.percentual}%` }}
                    className="bg-brand-mint h-full transition-all duration-500"
                    title={`PIX: ${data.metodosPagamento.pix.percentual}%`}
                  />
                  <div
                    style={{ width: `${data.metodosPagamento.cartao.percentual}%` }}
                    className="bg-brand-purple h-full transition-all duration-500"
                    title={`Cartão: ${data.metodosPagamento.cartao.percentual}%`}
                  />
                  <div
                    style={{ width: `${data.metodosPagamento.outros.percentual}%` }}
                    className="bg-brand-terracotta h-full transition-all duration-500"
                    title={`Outros: ${data.metodosPagamento.outros.percentual}%`}
                  />
                </div>

                {/* Detalhes de Cada Método */}
                <div className="space-y-2.5 pt-1 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-brand-beige-light/60">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-brand-mint" />
                      <span className="font-medium text-brand-charcoal">PIX</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-brand-purple">{data.metodosPagamento.pix.percentual}%</span>
                      <span className="text-brand-charcoal/40 ml-1.5">({formatMoney(data.metodosPagamento.pix.valor)})</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-brand-beige-light/60">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-brand-purple" />
                      <span className="font-medium text-brand-charcoal">Cartão de Crédito</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-brand-purple">{data.metodosPagamento.cartao.percentual}%</span>
                      <span className="text-brand-charcoal/40 ml-1.5">({formatMoney(data.metodosPagamento.cartao.valor)})</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Resumo de Status Geral dos Pedidos */}
          <div className="bg-white p-5 rounded-2xl border border-brand-beige shadow-xs">
            <h3 className="text-sm font-bold text-brand-purple mb-3 flex items-center justify-between">
              <span>Status dos Pedidos</span>
              <button
                onClick={() => onNavigateTab("pedidos")}
                className="text-xs text-brand-purple font-medium hover:underline flex items-center gap-1"
              >
                Ver todos <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </h3>

            {data && (
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 bg-brand-mint/10 border border-brand-mint/20 rounded-xl">
                  <div className="text-lg font-bold text-brand-mint-dark">{data.totaisGerais.pedidosPagos}</div>
                  <div className="text-[10px] text-brand-charcoal/60 mt-0.5">Pagos</div>
                </div>
                <div className="p-3 bg-amber-50 border border-amber-200/60 rounded-xl">
                  <div className="text-lg font-bold text-amber-700">{data.totaisGerais.pedidosPendentes}</div>
                  <div className="text-[10px] text-brand-charcoal/60 mt-0.5">Pendentes</div>
                </div>
                <div className="p-3 bg-red-50 border border-red-200/60 rounded-xl">
                  <div className="text-lg font-bold text-red-600">{data.totaisGerais.pedidosCancelados}</div>
                  <div className="text-[10px] text-brand-charcoal/60 mt-0.5">Cancelados</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Seção Especial: Kalapa Growth AI — Consultoria de Monetização com Gemini */}
      <div className="bg-gradient-to-br from-[#1A3C4D] via-[#224458] to-[#122b37] text-white rounded-3xl p-6 sm:p-7 shadow-sm border border-brand-purple/20 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                <Sparkles className="w-3.5 h-3.5" />
                Kalapa Growth AI
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/10 text-white/80 border border-white/15">
                <Bot className="w-3 h-3 text-cyan-300" />
                Google Gemini 2.5 Flash
              </span>
              {aiSource && (
                <span className="text-[10px] text-white/50">
                  ({aiSource === "gemini" ? "API Conectada" : "Modo Analítico Integrado"})
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-white mt-2">
              Consultoria Estratégica de Monetização & Vendas
            </h3>
            <p className="text-xs text-white/70 max-w-2xl mt-1 leading-relaxed">
              Inteligência Artificial aplicada aos seus dados reais: diagnóstico comercial da esteira de produtos, combos sugeridos de alta conversão, copys acolhedoras de WhatsApp e campanhas de cupons.
            </p>
          </div>

          <button
            onClick={handleGerarInsightsAI}
            disabled={loadingAi}
            className="px-5 py-3 rounded-xl font-bold text-xs bg-[#B8965A] hover:bg-[#a6864c] text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer shrink-0 self-start lg:self-center"
          >
            {loadingAi ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Consultando Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>{aiInsights ? "Atualizar Estratégias de IA" : "Gerar Estratégias de Monetização"}</span>
              </>
            )}
          </button>
        </div>

        {errorAi && (
          <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-xs text-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorAi}</span>
          </div>
        )}

        {/* Estado sem insights gerados ainda */}
        {!aiInsights && !loadingAi && (
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center space-y-2">
            <Bot className="w-8 h-8 text-amber-300 mx-auto opacity-80" />
            <h4 className="text-xs font-bold text-white">Nenhuma consultoria gerada nesta sessão</h4>
            <p className="text-[11px] text-white/60 max-w-md mx-auto">
              Clique no botão dourado acima para que o Gemini analise suas vendas, testes realizados e turmas, cruzando os dados para sugerir ações imediatas de receita.
            </p>
          </div>
        )}

        {/* Estado carregando */}
        {loadingAi && (
          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center space-y-3">
            <div className="w-10 h-10 border-2 border-amber-300 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-semibold text-white">
              Analisando checkouts, testes Yin/Yang, Eneagrama e vivências...
            </p>
            <p className="text-[11px] text-white/50 max-w-md mx-auto">
              O Gemini está identificando oportunidades de cross-sell, precificação de pacotes e redigindo copys humanizadas para o INstituto Kalapa.
            </p>
          </div>
        )}

        {/* Conteúdo com os Insights da IA */}
        {aiInsights && !loadingAi && (
          <div className="space-y-6 pt-2">
            {/* Bloco 1: Diagnóstico Comercial */}
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-5 border border-white/15">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-amber-300 shrink-0" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Diagnóstico Comercial & Posicionamento
                </h4>
              </div>
              <p className="text-xs text-white/90 leading-relaxed whitespace-pre-line">
                {aiInsights.diagnostico}
              </p>
            </div>

            {/* Bloco 2: Combos & Produtos Estratégicos */}
            {aiInsights.combos_sugeridos && aiInsights.combos_sugeridos.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <Tag className="w-4 h-4 text-amber-300" />
                    Combos & Pacotes Sugeridos de Alta Conversão
                  </h4>
                  <span className="text-[10px] text-white/60">Cruzamento de Testes + Atendimentos</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {aiInsights.combos_sugeridos.map((combo, idx) => (
                    <div
                      key={idx}
                      className="bg-white text-brand-charcoal p-4 rounded-2xl border border-brand-beige shadow-xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="text-xs font-bold text-brand-purple leading-snug">{combo.titulo}</h5>
                          {combo.economia_estimada && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 whitespace-nowrap shrink-0">
                              {combo.economia_estimada}
                            </span>
                          )}
                        </div>
                        <div className="mt-2 mb-2 text-sm font-bold text-brand-terracotta">
                          {combo.preco_combo}
                        </div>
                        <p className="text-xs text-brand-charcoal/70 leading-relaxed">
                          {combo.descricao}
                        </p>
                      </div>
                      <div className="mt-3 pt-2.5 border-t border-brand-beige/80 text-[11px] text-brand-charcoal/60 italic">
                        💡 {combo.justificativa}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bloco 3: Copys de WhatsApp Prontas para Envio */}
            {aiInsights.copys_whatsapp && aiInsights.copys_whatsapp.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    Scripts de Conversão para WhatsApp (Tom Acolhedor Kalapa)
                  </h4>
                  <span className="text-[10px] text-white/60">Copie e envie diretamente</span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {aiInsights.copys_whatsapp.map((copy, idx) => (
                    <div
                      key={idx}
                      className="bg-white text-brand-charcoal p-4 rounded-2xl border border-brand-beige shadow-xs flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-[10px] font-bold text-brand-purple uppercase tracking-wider block mb-2">
                          🎯 {copy.publico_alvo}
                        </span>
                        <div className="bg-brand-beige-light/70 p-3 rounded-xl text-xs text-brand-charcoal/80 leading-relaxed whitespace-pre-wrap font-sans border border-brand-beige">
                          {copy.mensagem}
                        </div>
                      </div>
                      <div className="mt-3 flex justify-end">
                        <button
                          onClick={() => handleCopiarTexto(copy.mensagem, idx)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer bg-brand-purple hover:bg-brand-purple-dark text-white"
                        >
                          {copiadoIdx === idx ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-300" />
                              <span>Copiado!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copiar Mensagem</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bloco 4: Cupons Recomendados & Ações Prioritárias */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Cupons */}
              {aiInsights.cupons_recomendados && aiInsights.cupons_recomendados.length > 0 && (
                <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-5 border border-white/15">
                  <h4 className="text-xs font-bold text-amber-300 mb-3 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Campanhas de Cupons Recomendadas
                  </h4>
                  <div className="space-y-2.5">
                    {aiInsights.cupons_recomendados.map((cupom, idx) => (
                      <div
                        key={idx}
                        className="bg-white text-brand-charcoal p-3 rounded-xl border border-brand-beige shadow-xs flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-brand-purple/10 text-brand-purple">
                              {cupom.codigo}
                            </span>
                            <span className="text-xs font-bold text-emerald-700">
                              {cupom.desconto} OFF
                            </span>
                          </div>
                          <p className="text-[11px] text-brand-charcoal/60 mt-1 truncate">
                            {cupom.objetivo}
                          </p>
                        </div>
                        <button
                          onClick={() => onNavigateTab("cupons")}
                          className="text-[11px] text-brand-purple font-semibold hover:underline shrink-0 flex items-center gap-0.5"
                        >
                          Criar <ArrowUpRight className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ações Prioritárias */}
              {aiInsights.acoes_prioritarias && aiInsights.acoes_prioritarias.length > 0 && (
                <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-5 border border-white/15 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-amber-300 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Ações Prioritárias da Semana (Plano Tático)
                    </h4>
                    <div className="space-y-2">
                      {aiInsights.acoes_prioritarias.map((acao, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-white/90">
                          <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="leading-snug">{acao}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/15 text-[11px] text-white/60">
                    ✨ Dica: Aplique pelo menos 2 ações acima para acelerar a monetização do INstituto Kalapa.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Grid Inferior: Ocupação das Turmas & Central de Recuperação WhatsApp */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Termômetro de Ocupação por Produto */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-brand-beige shadow-xs h-fit">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3.5">
            <div>
              <h3 className="text-sm font-bold text-brand-purple flex items-center gap-2">
                <Flame className="w-4 h-4 text-brand-terracotta" />
                Termômetro de Ocupação & Vendas
              </h3>
              <p className="text-xs text-brand-charcoal/50 mt-0.5">
                Capacidade de vagas e receita por vivência ({produtosFiltrados.length} {produtosFiltrados.length === 1 ? "vivência" : "vivências"})
                {receitaProdutosFiltrados > 0 && (
                  <> · Receita: <strong className="text-brand-purple font-semibold">{formatMoney(receitaProdutosFiltrados)}</strong></>
                )}
              </p>
            </div>
            <button
              onClick={() => onNavigateTab("produtos")}
              className="text-xs text-brand-purple font-medium hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto shrink-0"
            >
              Gerenciar <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Filtro Segmentado de Produtos perfeitamente integrado no Card */}
          <div className="mb-4 pb-3.5 border-b border-brand-beige/70 flex items-center justify-between gap-2.5 flex-wrap">
            <div className="bg-brand-beige-light p-1 rounded-xl border border-brand-beige flex items-center text-xs font-medium w-full sm:w-auto">
              <span className="text-[11px] text-brand-charcoal/50 px-2 font-medium hidden xs:inline">
                Produtos:
              </span>
              <button
                onClick={() => setStatusProdutoFiltro("todos")}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg transition-all cursor-pointer text-center ${
                  statusProdutoFiltro === "todos"
                    ? "bg-brand-purple text-white shadow-xs font-semibold"
                    : "text-brand-charcoal/60 hover:text-brand-charcoal"
                }`}
              >
                Todos {totalProdutos > 0 ? `(${totalProdutos})` : ""}
              </button>
              <button
                onClick={() => setStatusProdutoFiltro("ativos")}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg transition-all cursor-pointer text-center ${
                  statusProdutoFiltro === "ativos"
                    ? "bg-brand-purple text-white shadow-xs font-semibold"
                    : "text-brand-charcoal/60 hover:text-brand-charcoal"
                }`}
              >
                Ativos {totalAtivos > 0 ? `(${totalAtivos})` : ""}
              </button>
              <button
                onClick={() => setStatusProdutoFiltro("inativos")}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg transition-all cursor-pointer text-center ${
                  statusProdutoFiltro === "inativos"
                    ? "bg-brand-purple text-white shadow-xs font-semibold"
                    : "text-brand-charcoal/60 hover:text-brand-charcoal"
                }`}
              >
                Inativos {totalInativos > 0 ? `(${totalInativos})` : ""}
              </button>
            </div>

            <span className="text-[11px] text-brand-charcoal/50 font-medium hidden sm:inline">
              {statusProdutoFiltro === "todos"
                ? "Exibindo todos os registros"
                : statusProdutoFiltro === "ativos"
                ? "Exibindo apenas vivências ativas"
                : "Exibindo vivências inativas"}
            </span>
          </div>

          <div className="space-y-3">
            {produtosFiltrados.length === 0 ? (
              <div className="text-center py-8 px-4 bg-brand-beige-light/40 rounded-xl border border-dashed border-brand-beige">
                <p className="text-xs font-medium text-brand-charcoal/60">
                  Nenhuma vivência {statusProdutoFiltro === "inativos" ? "inativa" : statusProdutoFiltro === "ativos" ? "ativa" : ""} encontrada.
                </p>
              </div>
            ) : (
              produtosFiltrados.map((prod) => {
                const pct = prod.percentual_ocupacao ?? 0;
                return (
                  <div key={prod.id} className="p-3.5 rounded-xl border border-brand-beige hover:border-brand-purple/20 transition-all bg-white">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-xs font-bold text-brand-charcoal break-words leading-snug">{prod.nome}</h4>
                          {prod.ativo === false && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-md font-semibold bg-gray-100 text-gray-500 border border-gray-200 shrink-0">
                              Inativo
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-brand-charcoal/50 mt-1">
                          Faturamento: <strong className="text-brand-purple font-semibold">{formatMoney(prod.receita)}</strong>
                        </p>
                      </div>

                      {prod.vagas_maximas ? (
                        <span
                          className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold whitespace-nowrap shrink-0 ${
                            prod.status_ocupacao === "lotada"
                              ? "bg-red-100 text-red-700"
                              : prod.status_ocupacao === "quase_lotada"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-brand-mint/20 text-brand-mint-dark"
                          }`}
                        >
                          {prod.status_ocupacao === "lotada"
                            ? "Turma Lotada"
                            : prod.status_ocupacao === "quase_lotada"
                            ? "Últimas Vagas!"
                            : "Vagas Abertas"}
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-brand-beige text-brand-charcoal/60 shrink-0">
                          Sem limite
                        </span>
                      )}
                    </div>

                    {prod.vagas_maximas ? (
                      <div>
                        <div className="w-full bg-brand-charcoal/10 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              prod.status_ocupacao === "lotada"
                                ? "bg-red-500"
                                : prod.status_ocupacao === "quase_lotada"
                                ? "bg-brand-terracotta"
                                : "bg-brand-mint"
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[11px] text-brand-charcoal/60 mt-1.5">
                          <span>{prod.vagas_preenchidas} de {prod.vagas_maximas} vagas ocupadas</span>
                          <span className="font-semibold text-brand-purple">{pct}%</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-[11px] text-brand-charcoal/60 mt-1">
                        {prod.vagas_preenchidas} inscrição(ões) confirmada(s)
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Central de Recuperação de Vendas via WhatsApp */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-brand-beige shadow-xs h-fit flex flex-col">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-brand-purple flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  Recuperação de Checkouts (Leads Quentes)
                </h3>
                <p className="text-xs text-brand-charcoal/50 mt-0.5">
                  Contate clientes com pagamento pendente com 1 clique
                </p>
              </div>
              <button
                onClick={() => onNavigateTab("pedidos")}
                className="text-xs text-brand-purple font-medium hover:underline flex items-center gap-1"
              >
                Ver todos <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {data?.pedidosPendentesRecentes && data.pedidosPendentesRecentes.length > 0 ? (
              <div className="space-y-3">
                {data.pedidosPendentesRecentes.map((ped) => (
                  <div
                    key={ped.id}
                    className="p-3.5 rounded-xl border border-brand-beige/80 bg-brand-beige-light/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white hover:border-brand-purple/20 transition-all"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <p className="text-xs font-bold text-brand-charcoal break-words">{ped.cliente_nome}</p>
                        <span className="text-[10px] text-brand-charcoal/40 whitespace-nowrap">· {formatDateShort(ped.created_at)}</span>
                        {ped.categoria === "testes" && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-purple-100 text-purple-700 border border-purple-200">
                            🧠 Teste Online
                          </span>
                        )}
                        {ped.categoria === "atendimentos" && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            🗓️ Atendimento
                          </span>
                        )}
                        {ped.categoria === "vivencias" && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            🌿 Vivência
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-brand-charcoal/70 break-words mt-1 leading-relaxed">
                        {ped.produto_nome} · <strong className="text-brand-purple font-semibold">{formatMoney(ped.valor)}</strong>
                      </p>
                    </div>

                    {ped.telefone_whatsapp ? (
                      <a
                        href={ped.telefone_whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shrink-0 shadow-xs self-start sm:self-center"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Chamar</span>
                      </a>
                    ) : (
                      <span className="text-[10px] text-brand-charcoal/40 italic shrink-0 self-start sm:self-center">Sem telefone</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-brand-beige-light/50 rounded-xl border border-dashed border-brand-beige">
                <CheckCircle2 className="w-8 h-8 text-brand-mint mx-auto mb-2 opacity-80" />
                <p className="text-xs font-semibold text-brand-charcoal">Nenhum checkout pendente!</p>
                <p className="text-[11px] text-brand-charcoal/50 mt-1">
                  Todos os pedidos recentes foram confirmados com sucesso.
                </p>
              </div>
            )}
          </div>

          <div className="mt-5 p-3 rounded-xl bg-brand-purple/5 border border-brand-purple/10 text-xs text-brand-charcoal/70 flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-brand-purple shrink-0" />
            <span>
              <strong>Dica Kalapa:</strong> Entrar em contato nas primeiras 2 horas após a tentativa aumenta a taxa de conversão em até 40%.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
