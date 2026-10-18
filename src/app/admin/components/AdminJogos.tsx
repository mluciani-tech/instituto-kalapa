"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Gamepad2,
  MessageCircle,
  Search,
  RefreshCw,
  Download,
  Eye,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Users,
  Sparkles,
  Scale,
  Compass,
  ExternalLink,
  Calendar,
  Mail,
} from "lucide-react";
import {
  obterCartaPorId,
  QUADRANTES_INFO,
} from "@/app/teste-metamorfose/data/metamorfose-data";
import type { EstadoJornadaMetamorfose } from "@/app/teste-metamorfose/lib/calculo-metamorfose";

export interface PartidaMetamorfose {
  id: string;
  usuario_id?: string | null;
  nome: string;
  email: string;
  telefone: string | null;
  tema_escolhido: string | null;
  cartas_sorteadas?: {
    1?: string;
    2?: string;
    3?: string;
    4?: string;
  } | null;
  predominio_bloco: string | null;
  pontuacoes?: {
    blocoA?: number;
    blocoB?: number;
  } | null;
  respostas?: EstadoJornadaMetamorfose | null;
  created_at: string;
}

interface TotaisJogos {
  total: number;
  leadsUnicos: number;
  blocoA: number;
  blocoB: number;
  transicao: number;
  comTelefone: number;
}

interface AdminJogosProps {
  onNavigateProdutos?: () => void;
}

export default function AdminJogos({ onNavigateProdutos }: AdminJogosProps) {
  const [partidas, setPartidas] = useState<PartidaMetamorfose[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [predominioFiltro, setPredominioFiltro] = useState<string>("todos");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [totais, setTotais] = useState<TotaisJogos>({
    total: 0,
    leadsUnicos: 0,
    blocoA: 0,
    blocoB: 0,
    transicao: 0,
    comTelefone: 0,
  });

  const [selecionada, setSelecionada] = useState<PartidaMetamorfose | null>(null);
  const [paraExcluir, setParaExcluir] = useState<PartidaMetamorfose | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedback, setFeedback] = useState<{
    tipo: "sucesso" | "erro" | "aviso";
    texto: string;
  } | null>(null);

  const fetchPartidas = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (predominioFiltro !== "todos") params.set("predominio", predominioFiltro);
      params.set("page", String(page));
      params.set("perPage", "20");

      const res = await fetch(`/api/admin/jogos-metamorfose?${params.toString()}`);
      if (!res.ok) throw new Error("Falha ao carregar as jornadas do Jogo Sistêmico.");
      const data = await res.json();
      setPartidas(data.avaliacoes || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
      if (data.totais) setTotais(data.totais);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  }, [search, predominioFiltro, page]);

  useEffect(() => {
    const t = setTimeout(fetchPartidas, search ? 250 : 0);
    return () => clearTimeout(t);
  }, [fetchPartidas, search]);

  const handleExcluir = async () => {
    if (!paraExcluir) return;
    setIsDeleting(true);
    try {
      const res = await fetch("/api/admin/jogos-metamorfose", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: paraExcluir.id }),
      });
      if (!res.ok) throw new Error("Erro ao excluir registro do jogo.");
      setParaExcluir(null);
      setFeedback({ tipo: "sucesso", texto: "Jornada excluída com sucesso." });
      await fetchPartidas();
    } catch (err: unknown) {
      setFeedback({
        tipo: "erro",
        texto: err instanceof Error ? err.message : "Erro ao excluir registro.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const gerarLinkWhatsApp = (p: PartidaMetamorfose) => {
    if (!p.telefone) return null;
    let tel = p.telefone.replace(/\D/g, "");
    if (tel.length < 8) return null;
    if (tel.length === 10 || tel.length === 11) tel = `55${tel}`;
    const tema = p.tema_escolhido || "sua jornada sistêmica";
    const msg = encodeURIComponent(
      `Olá ${p.nome}, tudo bem? Sou da equipe do INstituto Kalapa. Vimos que você realizou a jornada d'A Metamorfose da Consciência sobre "${tema}". Como foi para você acessar as cartas e o dossiê fenomenológico? Se quiser conversar ou aprofundar esse tema, estamos à disposição!`
    );
    return `https://wa.me/${tel}?text=${msg}`;
  };

  const renderBadgeBalanca = (p: PartidaMetamorfose) => {
    const ptsA = Number(p.pontuacoes?.blocoA ?? 0);
    const ptsB = Number(p.pontuacoes?.blocoB ?? 0);
    const pred = String(p.predominio_bloco || "").toLowerCase();

    if (ptsA >= 3 || pred.includes("bloco a")) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100/80 text-amber-900 border border-amber-200">
          <span>🌱</span>
          <span>Bloco A — Ancestral ({ptsA}A / {ptsB}B)</span>
        </span>
      );
    }
    if (ptsB >= 3 || pred.includes("bloco b")) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100/80 text-emerald-900 border border-emerald-200">
          <span>🦋</span>
          <span>Bloco B — Adulto ({ptsA}A / {ptsB}B)</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100/80 text-purple-900 border border-purple-200">
        <span>⚖️</span>
        <span>Transição ({ptsA}A / {ptsB}B)</span>
      </span>
    );
  };

  const exportarCSV = () => {
    if (partidas.length === 0) {
      setFeedback({
        tipo: "aviso",
        texto: "Não há registros para exportar no filtro atual.",
      });
      return;
    }
    const cabecalho = [
      "Nome",
      "E-mail",
      "WhatsApp",
      "Tema Escolhido",
      "Cartas (Q1, Q2, Q3, Q4)",
      "Balança",
      "Bloco A",
      "Bloco B",
      "Data",
    ];
    const linhas = partidas.map((p) => {
      const c = p.cartas_sorteadas || p.respostas?.cartasSorteadas || {};
      const cartasStr = [c[1], c[2], c[3], c[4]].filter(Boolean).join(" | ");
      return [
        `"${(p.nome || "").replace(/"/g, '""')}"`,
        `"${p.email || ""}"`,
        `"${p.telefone || ""}"`,
        `"${(p.tema_escolhido || "").replace(/"/g, '""')}"`,
        `"${cartasStr}"`,
        `"${(p.predominio_bloco || "").replace(/"/g, '""')}"`,
        p.pontuacoes?.blocoA ?? 0,
        p.pontuacoes?.blocoB ?? 0,
        `"${new Date(p.created_at).toLocaleString("pt-BR")}"`,
      ];
    });
    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [cabecalho.join(";"), ...linhas.map((l) => l.join(";"))].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `jogos_metamorfose_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-brand-beige shadow-xs">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="w-9 h-9 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center">
              <Gamepad2 className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-bold text-brand-purple">
                  Jogos de Autoconhecimento
                </h1>
                <span className="text-[11px] bg-brand-terracotta/15 text-brand-terracotta font-semibold px-2.5 py-0.5 rounded-full border border-brand-terracotta/25">
                  A Metamorfose da Consciência
                </span>
              </div>
              <p className="text-xs text-brand-charcoal/60 mt-0.5">
                Acompanhe as jornadas realizadas no Jogo Sistêmico, temas trabalhados, cartas sorteadas e dossiês dos participantes.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          {onNavigateProdutos && (
            <button
              type="button"
              onClick={onNavigateProdutos}
              className="px-3.5 py-2 rounded-xl border border-brand-beige bg-brand-beige-light/60 hover:bg-brand-beige text-brand-charcoal text-xs font-semibold transition-colors cursor-pointer"
            >
              Configurar Produto
            </button>
          )}
          <a
            href="/jogo-sistemico"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-purple text-white text-xs font-semibold hover:bg-brand-purple-dark transition-colors shadow-xs"
          >
            <span>Abrir Página do Jogo</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl border border-red-200 bg-red-50 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Cards de KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-brand-beige shadow-xs">
          <p className="text-[11px] uppercase tracking-wider font-semibold text-brand-charcoal/60 mb-1 flex items-center gap-1">
            <Gamepad2 className="w-3.5 h-3.5 text-brand-purple" /> Total de Jornadas
          </p>
          <p className="text-2xl font-bold text-brand-purple">{totais.total}</p>
          <p className="text-[10px] text-brand-charcoal/50 mt-0.5">Partidas concluídas</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-brand-beige shadow-xs">
          <p className="text-[11px] uppercase tracking-wider font-semibold text-brand-charcoal/60 mb-1 flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-brand-terracotta" /> Leads Únicos
          </p>
          <p className="text-2xl font-bold text-brand-charcoal">{totais.leadsUnicos}</p>
          <p className="text-[10px] text-brand-charcoal/50 mt-0.5">Participantes distintos</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-brand-beige shadow-xs">
          <p className="text-[11px] uppercase tracking-wider font-semibold text-amber-800 mb-1 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-amber-600" /> Bloco A (Ancestral)
          </p>
          <p className="text-2xl font-bold text-amber-900">{totais.blocoA}</p>
          <p className="text-[10px] text-brand-charcoal/50 mt-0.5">Emaranhamento / Origem</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-brand-beige shadow-xs">
          <p className="text-[11px] uppercase tracking-wider font-semibold text-emerald-800 mb-1 flex items-center gap-1">
            <Scale className="w-3.5 h-3.5 text-emerald-600" /> Bloco B & Transição
          </p>
          <p className="text-2xl font-bold text-emerald-900">
            {totais.blocoB}{" "}
            <span className="text-xs font-normal text-brand-charcoal/50">
              ({totais.transicao} em 2x2)
            </span>
          </p>
          <p className="text-[10px] text-brand-charcoal/50 mt-0.5">Força Adulta / Travessia</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-brand-beige shadow-xs col-span-2 sm:col-span-1">
          <p className="text-[11px] uppercase tracking-wider font-semibold text-brand-charcoal/60 mb-1 flex items-center gap-1">
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" /> Com WhatsApp
          </p>
          <p className="text-2xl font-bold text-emerald-700">{totais.comTelefone}</p>
          <p className="text-[10px] text-brand-charcoal/50 mt-0.5">Prontos para abordagem</p>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="bg-white p-4 rounded-2xl border border-brand-beige shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-brand-charcoal/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Buscar por nome, e-mail, telefone ou tema..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-brand-beige bg-brand-beige-light/40 focus:bg-white focus:border-brand-purple outline-none transition-all"
            />
          </div>

          <select
            value={predominioFiltro}
            onChange={(e) => {
              setPredominioFiltro(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 text-xs sm:text-sm rounded-xl border border-brand-beige bg-white text-brand-charcoal font-medium outline-none cursor-pointer"
            aria-label="Filtrar por balança energética"
          >
            <option value="todos">Todas as Balanças</option>
            <option value="bloco_a">Predomínio Bloco A (Ancestral)</option>
            <option value="bloco_b">Predomínio Bloco B (Consciência Adulta)</option>
            <option value="transicao">Equilíbrio em Transição (2x2)</option>
          </select>
        </div>

        <div className="flex items-center gap-2 justify-end">
          <button
            type="button"
            onClick={fetchPartidas}
            className="p-2.5 rounded-xl border border-brand-beige hover:bg-brand-beige-light text-brand-charcoal transition-colors cursor-pointer"
            title="Atualizar"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            type="button"
            onClick={exportarCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-purple text-white text-xs font-semibold hover:bg-brand-purple-dark transition-colors shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center justify-between gap-2 border ${
            feedback.tipo === "sucesso"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : feedback.tipo === "aviso"
              ? "bg-amber-50 border-amber-200 text-amber-800"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          <span>{feedback.texto}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="font-bold px-1.5 py-0.5 rounded hover:bg-black/5 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Tabela de Jornadas */}
      <div className="bg-white rounded-2xl border border-brand-beige overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-3 border-brand-purple border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs text-brand-charcoal/60">Carregando jornadas do Jogo...</p>
          </div>
        ) : partidas.length === 0 ? (
          <div className="py-16 text-center text-brand-charcoal/50 space-y-2 px-4">
            <Gamepad2 className="w-9 h-9 mx-auto text-brand-purple/40 mb-1" />
            <p className="text-sm font-semibold text-brand-charcoal/80">
              Nenhuma jornada registrada ainda
            </p>
            <p className="text-xs text-brand-charcoal/50 max-w-md mx-auto">
              Assim que os participantes concluírem A Metamorfose da Consciência, os temas, cartas sorteadas e dossiês aparecerão aqui.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-brand-beige-light/60 border-b border-brand-beige text-brand-charcoal/70 text-[11px] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Data / Hora</th>
                  <th className="py-3.5 px-4">Participante</th>
                  <th className="py-3.5 px-4">Tema da Jornada</th>
                  <th className="py-3.5 px-4">Cartas (I · II · III · IV)</th>
                  <th className="py-3.5 px-4">Balança Energética</th>
                  <th className="py-3.5 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-beige/50">
                {partidas.map((p) => {
                  const zapUrl = gerarLinkWhatsApp(p);
                  const cartasMap = p.cartas_sorteadas || p.respostas?.cartasSorteadas || {};
                  return (
                    <tr key={p.id} className="hover:bg-brand-beige-light/30 transition-colors">
                      <td className="py-3.5 px-4 text-xs text-brand-charcoal/70 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-brand-charcoal/40" />
                          <span>{new Date(p.created_at).toLocaleDateString("pt-BR")}</span>
                          <span className="text-[10px] text-brand-charcoal/50">
                            {new Date(p.created_at).toLocaleTimeString("pt-BR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-brand-charcoal">{p.nome}</p>
                        <a
                          href={`mailto:${p.email}`}
                          className="text-xs text-brand-purple hover:underline inline-flex items-center gap-1 mt-0.5"
                        >
                          <Mail className="w-3 h-3 text-brand-purple/70" />
                          <span>{p.email}</span>
                        </a>
                        {p.telefone && (
                          <span className="block text-[11px] text-brand-charcoal/50 mt-0.5">
                            {p.telefone}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 max-w-[220px]">
                        <p className="text-xs font-medium text-brand-charcoal line-clamp-2">
                          {p.tema_escolhido || "Vivência Sistêmica"}
                        </p>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          {([1, 2, 3, 4] as const).map((q) => {
                            const cId = cartasMap[q];
                            const cartaObj = cId ? obterCartaPorId(cId) : undefined;
                            return (
                              <span
                                key={q}
                                title={
                                  cartaObj
                                    ? `Q${q}: ${cartaObj.id} — ${cartaObj.titulo} (Bloco ${cartaObj.bloco})`
                                    : `Q${q}`
                                }
                                className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-bold border ${
                                  cartaObj?.bloco === "A"
                                    ? "bg-amber-50 text-amber-900 border-amber-200"
                                    : cartaObj?.bloco === "B"
                                    ? "bg-emerald-50 text-emerald-900 border-emerald-200"
                                    : "bg-brand-beige-light text-brand-charcoal/60 border-brand-beige"
                                }`}
                              >
                                {cId || "—"}
                              </span>
                            );
                          })}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">{renderBadgeBalanca(p)}</td>

                      <td className="py-3.5 px-4 whitespace-nowrap text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {zapUrl && (
                            <a
                              href={zapUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                              title="Conversar no WhatsApp"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => setSelecionada(p)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-brand-purple/10 text-brand-purple hover:bg-brand-purple/20 text-xs font-semibold transition-colors cursor-pointer"
                            title="Ver Dossiê Completo"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Dossiê</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setParaExcluir(p)}
                            className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Excluir registro"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-brand-beige flex items-center justify-between text-xs text-brand-charcoal/70">
            <span>
              Página <strong>{page}</strong> de <strong>{totalPages}</strong> ({total} registros)
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                className="p-1.5 rounded-lg border border-brand-beige hover:bg-brand-beige-light disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                className="p-1.5 rounded-lg border border-brand-beige hover:bg-brand-beige-light disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Dossiê Completo da Jornada */}
      {selecionada && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-brand-beige p-6 space-y-5">
            <div className="flex items-start justify-between gap-4 border-b border-brand-beige pb-4">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-brand-terracotta">
                  <Sparkles className="w-3.5 h-3.5" /> Dossiê Fenomenológico — A Metamorfose da Consciência
                </span>
                <h2 className="text-lg font-bold text-brand-purple mt-1">
                  {selecionada.nome}
                </h2>
                <p className="text-xs text-brand-charcoal/60">
                  {selecionada.email}
                  {selecionada.telefone ? ` · ${selecionada.telefone}` : ""} ·{" "}
                  {new Date(selecionada.created_at).toLocaleString("pt-BR")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelecionada(null)}
                className="p-2 rounded-lg hover:bg-brand-beige-light text-brand-charcoal/60 cursor-pointer"
                aria-label="Fechar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tema e Balança */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-brand-beige-light/60 border border-brand-beige">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-charcoal/50 block">
                  Tema Escolhido na Travessia
                </span>
                <p className="text-sm font-bold text-brand-charcoal mt-1">
                  {selecionada.tema_escolhido || "Vivência Sistêmica"}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-brand-beige-light/60 border border-brand-beige">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-charcoal/50 block mb-1">
                  Balança Energética
                </span>
                {renderBadgeBalanca(selecionada)}
                {selecionada.predominio_bloco && (
                  <p className="text-[11px] text-brand-charcoal/70 mt-1.5">
                    {selecionada.predominio_bloco}
                  </p>
                )}
              </div>
            </div>

            {/* As 4 Cartas Sorteadas e Anotações do Caderno */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-purple">
                Cartas Sorteadas & Caderno de Reflexões (4 Quadrantes)
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {([1, 2, 3, 4] as const).map((q) => {
                  const cartasMap =
                    selecionada.cartas_sorteadas ||
                    selecionada.respostas?.cartasSorteadas ||
                    {};
                  const cId = cartasMap[q];
                  const carta = cId ? obterCartaPorId(cId) : undefined;
                  const qInfo = QUADRANTES_INFO[q];
                  const cadernoQ = selecionada.respostas?.caderno?.[q];

                  return (
                    <div
                      key={q}
                      className="p-4 rounded-xl border border-brand-beige bg-white space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-xs font-bold text-brand-purple">
                          Quadrante {["I", "II", "III", "IV"][q - 1]} — {qInfo.nome} ({qInfo.subtituloArquetipico})
                        </span>
                        {carta && (
                          <span
                            className={`text-[11px] px-2 py-0.5 rounded-full font-bold border ${
                              carta.bloco === "A"
                                ? "bg-amber-50 text-amber-900 border-amber-200"
                                : "bg-emerald-50 text-emerald-900 border-emerald-200"
                            }`}
                          >
                            Carta {carta.id} · Bloco {carta.bloco}
                          </span>
                        )}
                      </div>

                      {carta ? (
                        <>
                          <p className="text-sm font-bold text-brand-charcoal">
                            {carta.titulo} — <span className="font-normal italic text-brand-charcoal/70">{carta.subtitulo}</span>
                          </p>
                          <p className="text-xs text-brand-charcoal/80 bg-brand-beige-light/50 p-2.5 rounded-lg border border-brand-beige/70">
                            “{carta.mensagem_completa}”
                          </p>
                        </>
                      ) : (
                        <p className="text-xs text-brand-charcoal/40 italic">
                          Carta não registrada neste quadrante.
                        </p>
                      )}

                      {cadernoQ &&
                        (cadernoQ.resposta1 ||
                          cadernoQ.resposta2 ||
                          cadernoQ.resposta3 ||
                          cadernoQ.ressonanciaCorporal) && (
                          <div className="pt-2 border-t border-brand-beige/60 space-y-1.5 text-xs text-brand-charcoal/80">
                            {cadernoQ.ressonanciaCorporal && (
                              <p>
                                <strong>Ressonância Corporal:</strong> {cadernoQ.ressonanciaCorporal}
                              </p>
                            )}
                            {cadernoQ.resposta1 && (
                              <p>
                                <strong>Reflexão 1:</strong> {cadernoQ.resposta1}
                              </p>
                            )}
                            {cadernoQ.resposta2 && (
                              <p>
                                <strong>Reflexão 2:</strong> {cadernoQ.resposta2}
                              </p>
                            )}
                            {cadernoQ.resposta3 && (
                              <p>
                                <strong>Reflexão 3:</strong> {cadernoQ.resposta3}
                              </p>
                            )}
                          </div>
                        )}
                    </div>
                  );
                })}
              </div>
            </div>

            {selecionada.respostas?.sintesePessoal && (
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 block mb-1">
                  Síntese Pessoal do Participante
                </span>
                <p className="text-xs text-amber-950 whitespace-pre-wrap leading-relaxed">
                  {selecionada.respostas.sintesePessoal}
                </p>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-brand-beige">
              {gerarLinkWhatsApp(selecionada) && (
                <a
                  href={gerarLinkWhatsApp(selecionada)!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chamar no WhatsApp</span>
                </a>
              )}
              <button
                type="button"
                onClick={() => setSelecionada(null)}
                className="px-4 py-2 rounded-xl border border-brand-beige text-xs font-semibold text-brand-charcoal hover:bg-brand-beige-light cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {paraExcluir && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl border border-brand-beige space-y-4">
            <h3 className="text-base font-bold text-brand-charcoal">
              Excluir jornada de {paraExcluir.nome}?
            </h3>
            <p className="text-xs text-brand-charcoal/60 leading-relaxed">
              Esta ação removerá permanentemente o registro desta partida do histórico administrativo.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setParaExcluir(null)}
                className="px-4 py-2 text-xs font-semibold text-brand-charcoal/70 hover:text-brand-charcoal cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleExcluir}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? "Excluindo..." : "Sim, excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
