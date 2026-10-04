"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Sparkles,
  Compass,
  Layers,
  Users,
  MessageCircle,
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  Calendar,
  Mail,
  Repeat,
  Clock,
  Sunrise,
  SunMedium,
  Moon,
} from "lucide-react";
import AdminAvaliacoesYinYang from "./AdminAvaliacoesYinYang";
import AdminAvaliacoesEneagrama from "./AdminAvaliacoesEneagrama";
import AdminAvaliacoesCronotipo from "./AdminAvaliacoesCronotipo";

type Visao = "todos" | "yinyang" | "eneagrama" | "cronotipo";

interface LinhaCombinada {
  id: string;
  teste: "yinyang" | "eneagrama" | "cronotipo";
  nome: string;
  email: string;
  telefone: string | null;
  created_at: string;
  resultado: string;
  detalhe: string;
}

interface Insights {
  yinyang: {
    total: number;
    yang: number;
    yin: number;
    comTelefone: number;
    ultimos7: number;
    ultimos30: number;
    anteriores30: number;
  };
  eneagrama: {
    total: number;
    porTipo: Record<string, number>;
    empates: number;
    tipoMaisComum: number | null;
    comTelefone: number;
    ultimos7: number;
    ultimos30: number;
    anteriores30: number;
  };
  cronotipo: {
    total: number;
    matutino: number;
    intermediario: number;
    vespertino: number;
    comTelefone: number;
    ultimos7: number;
    ultimos30: number;
    anteriores30: number;
  };
  combinado: {
    leadsUnicos: number;
    fizeramAmbos: number;
    fizeramMultiplos?: number;
    comTelefoneUnicos: number;
  };
  recentes: LinhaCombinada[];
  eneagramaDisponivel: boolean;
  cronotipoDisponivel: boolean;
}

function Tendencia({ atual, anterior }: { atual: number; anterior: number }) {
  if (anterior === 0 && atual === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] text-brand-charcoal/50">
        <Minus className="w-3 h-3" /> sem movimento
      </span>
    );
  }
  if (anterior === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
        <TrendingUp className="w-3 h-3" /> novo período
      </span>
    );
  }
  const variacao = Math.round(((atual - anterior) / anterior) * 100);
  if (variacao === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] text-brand-charcoal/50">
        <Minus className="w-3 h-3" /> estável
      </span>
    );
  }
  const subiu = variacao > 0;
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
        subiu ? "text-emerald-700" : "text-red-600"
      }`}
    >
      {subiu ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {subiu ? "+" : ""}
      {variacao}% vs. 30 dias anteriores
    </span>
  );
}

function VisaoGeral({ onAbrirTeste }: { onAbrirTeste: (v: Visao) => void }) {
  const [dados, setDados] = useState<Insights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [testeFiltro, setTesteFiltro] = useState<"todos" | "yinyang" | "eneagrama" | "cronotipo">("todos");

  const carregar = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      const res = await fetch(`/api/admin/avaliacoes/insights?${params.toString()}`);
      if (!res.ok) throw new Error("Falha ao carregar a visão geral das avaliações.");
      setDados(await res.json());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(carregar, search ? 300 : 0);
    return () => clearTimeout(t);
  }, [carregar, search]);

  const totalAvaliacoes =
    (dados?.yinyang.total || 0) +
    (dados?.eneagrama.total || 0) +
    (dados?.cronotipo?.total || 0);

  const ultimos30 =
    (dados?.yinyang.ultimos30 || 0) +
    (dados?.eneagrama.ultimos30 || 0) +
    (dados?.cronotipo?.ultimos30 || 0);

  const anteriores30 =
    (dados?.yinyang.anteriores30 || 0) +
    (dados?.eneagrama.anteriores30 || 0) +
    (dados?.cronotipo?.anteriores30 || 0);

  const ultimos7 =
    (dados?.yinyang.ultimos7 || 0) +
    (dados?.eneagrama.ultimos7 || 0) +
    (dados?.cronotipo?.ultimos7 || 0);

  const linhas = (dados?.recentes || []).filter(
    (r) => testeFiltro === "todos" || r.teste === testeFiltro
  );

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 rounded-2xl border border-red-200 bg-red-50 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* KPIs gerais */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-beige shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-brand-charcoal/60">Total de Avaliações</span>
            <div className="w-8 h-8 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-brand-purple">{totalAvaliacoes}</p>
          <p className="text-[11px] text-brand-charcoal/50 mt-1">
            {dados?.yinyang.total || 0} Yin/Yang · {dados?.eneagrama.total || 0} Eneagrama ·{" "}
            {dados?.cronotipo?.total || 0} Cronotipo
          </p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-beige shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-brand-charcoal/60">Leads Únicos</span>
            <div className="w-8 h-8 rounded-xl bg-brand-terracotta/10 text-brand-terracotta flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-brand-charcoal">
            {dados?.combinado.leadsUnicos || 0}
          </p>
          <p className="text-[11px] text-brand-charcoal/50 mt-1">Pessoas distintas (por e-mail)</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-beige shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-brand-charcoal/60">Fizeram + de 1 teste</span>
            <div className="w-8 h-8 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center">
              <Repeat className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl sm:text-3xl font-bold text-brand-charcoal">
              {dados?.combinado.fizeramMultiplos ?? dados?.combinado.fizeramAmbos ?? 0}
            </p>
            <span className="text-xs font-semibold text-brand-purple">
              {dados && dados.combinado.leadsUnicos > 0
                ? `${Math.round(
                    ((dados.combinado.fizeramMultiplos ?? dados.combinado.fizeramAmbos) /
                      dados.combinado.leadsUnicos) *
                      100
                  )}%`
                : "0%"}
            </span>
          </div>
          <p className="text-[11px] text-brand-charcoal/50 mt-1">Leads mais engajados</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-beige shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-brand-charcoal/60">Leads com WhatsApp</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <MessageCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl sm:text-3xl font-bold text-brand-charcoal">
              {dados?.combinado.comTelefoneUnicos || 0}
            </p>
            <span className="text-xs font-semibold text-emerald-700">
              {dados && dados.combinado.leadsUnicos > 0
                ? `${Math.round(
                    (dados.combinado.comTelefoneUnicos / dados.combinado.leadsUnicos) * 100
                  )}%`
                : "0%"}
            </span>
          </div>
          <p className="text-[11px] text-brand-charcoal/50 mt-1">Prontos para abordagem</p>
        </div>
      </div>

      {/* Comparativo por teste + tendência */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card Yin/Yang */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-beige shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-brand-charcoal flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-terracotta" /> Yin/Yang
            </h3>
            <button
              type="button"
              onClick={() => onAbrirTeste("yinyang")}
              className="text-[11px] font-semibold text-brand-purple hover:underline"
            >
              Ver detalhes →
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-orange-50 border border-orange-100">
              <span className="text-orange-900/70 block">Yang</span>
              <strong className="text-orange-900 text-lg">{dados?.yinyang.yang || 0}</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
              <span className="text-emerald-900/70 block">Yin</span>
              <strong className="text-emerald-900 text-lg">{dados?.yinyang.yin || 0}</strong>
            </div>
          </div>
          <Tendencia
            atual={dados?.yinyang.ultimos30 || 0}
            anterior={dados?.yinyang.anteriores30 || 0}
          />
        </div>

        {/* Card Eneagrama */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-beige shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-brand-charcoal flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-brand-purple" /> Eneagrama
            </h3>
            <button
              type="button"
              onClick={() => onAbrirTeste("eneagrama")}
              className="text-[11px] font-semibold text-brand-purple hover:underline"
            >
              Ver detalhes →
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-brand-purple/5 border border-brand-purple/10">
              <span className="text-brand-charcoal/60 block">Tipo mais comum</span>
              <strong className="text-brand-purple text-lg">
                {dados?.eneagrama.tipoMaisComum ? `Tipo ${dados.eneagrama.tipoMaisComum}` : "—"}
              </strong>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100">
              <span className="text-amber-900/70 block">Empates</span>
              <strong className="text-amber-900 text-lg">{dados?.eneagrama.empates || 0}</strong>
            </div>
          </div>
          <Tendencia
            atual={dados?.eneagrama.ultimos30 || 0}
            anterior={dados?.eneagrama.anteriores30 || 0}
          />
        </div>

        {/* Card Cronotipo */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-beige shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-brand-charcoal flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#B8965A]" /> Cronotipo
            </h3>
            <button
              type="button"
              onClick={() => onAbrirTeste("cronotipo")}
              className="text-[11px] font-semibold text-brand-purple hover:underline"
            >
              Ver detalhes →
            </button>
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-xs text-center">
            <div className="p-2 rounded-xl bg-amber-50 border border-amber-100">
              <span className="text-amber-900/70 block text-[10px]">Cotovia</span>
              <strong className="text-amber-900 text-sm">
                {dados?.cronotipo?.matutino || 0}
              </strong>
            </div>
            <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-100">
              <span className="text-emerald-900/70 block text-[10px]">Urso</span>
              <strong className="text-emerald-900 text-sm">
                {dados?.cronotipo?.intermediario || 0}
              </strong>
            </div>
            <div className="p-2 rounded-xl bg-slate-100 border border-slate-200">
              <span className="text-slate-900/70 block text-[10px]">Coruja</span>
              <strong className="text-slate-900 text-sm">
                {dados?.cronotipo?.vespertino || 0}
              </strong>
            </div>
          </div>
          <Tendencia
            atual={dados?.cronotipo?.ultimos30 || 0}
            anterior={dados?.cronotipo?.anteriores30 || 0}
          />
        </div>

        {/* Card Tendência de Entrada */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-beige shadow-xs space-y-3">
          <h3 className="text-sm font-semibold text-brand-charcoal flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-600" /> Tendência Geral
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-brand-beige-light border border-brand-beige/70">
              <span className="text-brand-charcoal/60 block">Últimos 7 dias</span>
              <strong className="text-brand-charcoal text-lg">{ultimos7}</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-brand-beige-light border border-brand-beige/70">
              <span className="text-brand-charcoal/60 block">Últimos 30 dias</span>
              <strong className="text-brand-charcoal text-lg">{ultimos30}</strong>
            </div>
          </div>
          <Tendencia atual={ultimos30} anterior={anteriores30} />
        </div>
      </div>

      {/* Lista combinada */}
      <div className="bg-white p-4 rounded-2xl border border-brand-beige flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-brand-charcoal/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, e-mail ou telefone..."
            className="w-full pl-9 pr-3.5 py-2 border border-brand-beige rounded-xl text-xs sm:text-sm focus-visible:ring-2 focus-visible:ring-brand-purple/20 focus-visible:border-brand-purple"
          />
        </div>
        <div className="relative shrink-0 self-start sm:self-auto w-full sm:w-44">
          <select
            value={testeFiltro}
            onChange={(e) => setTesteFiltro(e.target.value as any)}
            className="w-full appearance-none bg-brand-beige-light border border-brand-beige text-brand-charcoal text-xs sm:text-sm font-medium py-2 pl-3 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple cursor-pointer transition-colors hover:bg-brand-beige"
            aria-label="Filtrar por teste"
          >
            {[
              ["todos", "Todos os Testes"],
              ["yinyang", "Yin/Yang"],
              ["eneagrama", "Eneagrama"],
              ["cronotipo", "Cronotipo"],
            ].map(([id, label]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-brand-charcoal/50">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-brand-beige overflow-hidden shadow-xs">
        {loading && !dados ? (
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-3 border-brand-purple border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs text-brand-charcoal/60">Carregando avaliações...</p>
          </div>
        ) : linhas.length === 0 ? (
          <div className="py-16 text-center text-brand-charcoal/50 space-y-2">
            <Layers className="w-8 h-8 mx-auto text-brand-beige mb-1" />
            <p className="text-sm font-medium text-brand-charcoal/70">
              Nenhuma avaliação encontrada
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-brand-beige-light/60 border-b border-brand-beige text-brand-charcoal/70 text-[11px] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Data / Hora</th>
                  <th className="py-3.5 px-4">Participante</th>
                  <th className="py-3.5 px-4">Telefone</th>
                  <th className="py-3.5 px-4">Teste</th>
                  <th className="py-3.5 px-4">Resultado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-beige/50">
                {linhas.map((r) => (
                  <tr
                    key={`${r.teste}-${r.id}`}
                    className="hover:bg-brand-beige-light/30 transition-colors"
                  >
                    <td className="py-3.5 px-4 text-xs text-brand-charcoal/70 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-brand-charcoal/40" />
                        <span>{new Date(r.created_at).toLocaleDateString("pt-BR")}</span>
                        <span className="text-[10px] text-brand-charcoal/50">
                          {new Date(r.created_at).toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-brand-charcoal">{r.nome}</p>
                      <a
                        href={`mailto:${r.email}`}
                        className="text-xs text-brand-purple hover:underline inline-flex items-center gap-1 mt-0.5"
                      >
                        <Mail className="w-3 h-3 text-brand-purple/70" />
                        <span>{r.email}</span>
                      </a>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-xs text-brand-charcoal/70">
                      {r.telefone || (
                        <span className="italic text-brand-charcoal/40">Não informado</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onAbrirTeste(r.teste)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border cursor-pointer ${
                          r.teste === "yinyang"
                            ? "bg-brand-terracotta/10 text-brand-terracotta border-brand-terracotta/25"
                            : r.teste === "cronotipo"
                            ? "bg-amber-100/70 text-amber-900 border-amber-200"
                            : "bg-brand-purple/10 text-brand-purple border-brand-purple/20"
                        }`}
                        title="Abrir a lista completa deste teste"
                      >
                        {r.teste === "yinyang" ? (
                          <Sparkles className="w-3.5 h-3.5" />
                        ) : r.teste === "cronotipo" ? (
                          <Clock className="w-3.5 h-3.5 text-[#B8965A]" />
                        ) : (
                          <Compass className="w-3.5 h-3.5" />
                        )}
                        {r.teste === "yinyang"
                          ? "Yin/Yang"
                          : r.teste === "cronotipo"
                          ? "Cronotipo"
                          : "Eneagrama"}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-semibold text-brand-charcoal">{r.resultado}</span>
                      <span className="block text-[11px] text-brand-charcoal/50">
                        {r.detalhe}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {dados && dados.recentes.length >= 100 && (
          <div className="p-3 border-t border-brand-beige text-[11px] text-brand-charcoal/50 text-center">
            Exibindo os 100 registros mais recentes. Use as abas específicas para ver a lista
            completa.
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminAvaliacoes() {
  const [visao, setVisao] = useState<Visao>("todos");

  const abas: { id: Visao; label: string; icon: React.ElementType }[] = [
    { id: "todos", label: "Todos", icon: Layers },
    { id: "yinyang", label: "Yin/Yang", icon: Sparkles },
    { id: "eneagrama", label: "Eneagrama", icon: Compass },
    { id: "cronotipo", label: "Cronotipo", icon: Clock },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-brand-purple">Avaliações</h1>
            <span className="text-xs bg-brand-terracotta/15 text-brand-terracotta font-semibold px-2.5 py-0.5 rounded-full">
              Leads & Diagnósticos
            </span>
          </div>
          <p className="text-xs sm:text-sm text-brand-charcoal/60 mt-0.5">
            Analise cada teste separadamente ou veja a visão geral com insights de todos os
            participantes.
          </p>
        </div>

        <div className="relative self-start sm:self-auto shrink-0 w-full sm:w-52">
          <select
            value={visao}
            onChange={(e) => setVisao(e.target.value as Visao)}
            className="w-full appearance-none bg-brand-beige-light border border-brand-beige text-brand-charcoal text-sm font-semibold py-2.5 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple cursor-pointer transition-colors hover:bg-brand-beige"
            aria-label="Selecionar teste"
          >
            {abas.map(({ id, label }) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-brand-charcoal/50">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      {visao === "todos" && <VisaoGeral onAbrirTeste={setVisao} />}
      {visao === "yinyang" && <AdminAvaliacoesYinYang />}
      {visao === "eneagrama" && <AdminAvaliacoesEneagrama />}
      {visao === "cronotipo" && <AdminAvaliacoesCronotipo />}
    </div>
  );
}
