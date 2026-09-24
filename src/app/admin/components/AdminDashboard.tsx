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
} from "lucide-react";

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
            Métricas em tempo real de vendas, vagas e conversão do Instituto Kalapa
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-brand-beige-light p-1 rounded-xl border border-brand-beige flex text-xs font-medium">
            <button
              onClick={() => setPeriodo("7d")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                periodo === "7d"
                  ? "bg-brand-purple text-white shadow-xs font-semibold"
                  : "text-brand-charcoal/60 hover:text-brand-charcoal"
              }`}
            >
              7 dias
            </button>
            <button
              onClick={() => setPeriodo("30d")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                periodo === "30d"
                  ? "bg-brand-purple text-white shadow-xs font-semibold"
                  : "text-brand-charcoal/60 hover:text-brand-charcoal"
              }`}
            >
              30 dias
            </button>
            <button
              onClick={() => setPeriodo("90d")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                periodo === "90d"
                  ? "bg-brand-purple text-white shadow-xs font-semibold"
                  : "text-brand-charcoal/60 hover:text-brand-charcoal"
              }`}
            >
              90 dias
            </button>
            <button
              onClick={() => setPeriodo("total")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
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
            className="p-2 border border-brand-beige rounded-xl hover:bg-brand-beige/40 text-brand-charcoal/70 transition-colors disabled:opacity-50"
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
              {data ? `${data.kpis.totalVagasOcupadas} participantes` : "—"}
            </div>
            <p className="text-[11px] text-brand-charcoal/50 mt-1">
              Nas turmas e vivências ativas
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

      {/* Grid Inferior: Ocupação das Turmas & Central de Recuperação WhatsApp */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Termômetro de Ocupação por Produto */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-brand-beige shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-brand-purple flex items-center gap-2">
                <Flame className="w-4 h-4 text-brand-terracotta" />
                Termômetro de Ocupação & Vendas
              </h3>
              <p className="text-xs text-brand-charcoal/50 mt-0.5">
                Capacidade de vagas e receita por vivência
              </p>
            </div>
            <button
              onClick={() => onNavigateTab("produtos")}
              className="text-xs text-brand-purple font-medium hover:underline flex items-center gap-1"
            >
              Gerenciar <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {data?.produtosRanking.map((prod) => {
              const pct = prod.percentual_ocupacao ?? 0;
              return (
                <div key={prod.id} className="p-3.5 rounded-xl border border-brand-beige hover:border-brand-purple/20 transition-all bg-white">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="text-xs font-bold text-brand-charcoal line-clamp-1">{prod.nome}</h4>
                      <p className="text-[11px] text-brand-charcoal/40 mt-0.5">
                        Faturamento: <strong className="text-brand-purple font-semibold">{formatMoney(prod.receita)}</strong>
                      </p>
                    </div>

                    {prod.vagas_maximas ? (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold whitespace-nowrap ${
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
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-brand-beige text-brand-charcoal/60">
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
            })}
          </div>
        </div>

        {/* Central de Recuperação de Vendas via WhatsApp */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-brand-beige shadow-xs flex flex-col justify-between">
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
                    className="p-3 rounded-xl border border-brand-beige/80 bg-brand-beige-light/40 flex items-center justify-between gap-3 hover:bg-white transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-brand-charcoal truncate">{ped.cliente_nome}</p>
                        <span className="text-[10px] text-brand-charcoal/40">· {formatDateShort(ped.created_at)}</span>
                      </div>
                      <p className="text-[11px] text-brand-charcoal/60 truncate mt-0.5">
                        {ped.produto_nome} · <strong className="text-brand-purple">{formatMoney(ped.valor)}</strong>
                      </p>
                    </div>

                    {ped.telefone_whatsapp ? (
                      <a
                        href={ped.telefone_whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors shrink-0 shadow-xs"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Chamar</span>
                      </a>
                    ) : (
                      <span className="text-[10px] text-brand-charcoal/40 italic shrink-0">Sem tel</span>
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
