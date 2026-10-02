"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import {
  Sparkles,
  Flame,
  Droplets,
  MessageCircle,
  Mail,
  Search,
  RefreshCw,
  Download,
  Calendar,
  User,
  Eye,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import type { AvaliacaoYinYang } from "@/lib/types";
import { YIN_YANG_PERGUNTAS } from "@/app/teste-yin-yang/data/yin-yang-data";

export default function AdminAvaliacoesYinYang() {
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoYinYang[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState<"todos" | "yang" | "yin">("todos");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [totaisPorTipo, setTotaisPorTipo] = useState({
    total: 0,
    yang: 0,
    yin: 0,
    comTelefone: 0,
  });

  const [avaliacaoSelecionada, setAvaliacaoSelecionada] = useState<AvaliacaoYinYang | null>(null);
  const [avaliacaoParaExcluir, setAvaliacaoParaExcluir] = useState<AvaliacaoYinYang | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPending, startTransition] = useTransition();

  const fetchAvaliacoes = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (tipoFiltro !== "todos") params.set("tipo", tipoFiltro);
      params.set("page", String(page));
      params.set("perPage", "20");

      const res = await fetch(`/api/admin/avaliacoes-yin-yang?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Falha ao carregar as avaliações.");
      }
      const data = await res.json();
      setAvaliacoes(data.avaliacoes || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
      if (data.totaisPorTipo) {
        setTotaisPorTipo(data.totaisPorTipo);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  }, [search, tipoFiltro, page]);

  useEffect(() => {
    fetchAvaliacoes();
  }, [fetchAvaliacoes]);

  const handleExcluir = async () => {
    if (!avaliacaoParaExcluir) return;
    setIsDeleting(true);
    try {
      const res = await fetch("/api/admin/avaliacoes-yin-yang", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: avaliacaoParaExcluir.id }),
      });
      if (!res.ok) {
        throw new Error("Erro ao excluir avaliação.");
      }
      setAvaliacaoParaExcluir(null);
      await fetchAvaliacoes();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Erro ao excluir.");
    } finally {
      setIsDeleting(false);
    }
  };

  const exportarCSV = () => {
    if (avaliacoes.length === 0) {
      alert("Não há registros para exportar no filtro atual.");
      return;
    }

    const headers = [
      "Data e Hora",
      "Nome",
      "E-mail",
      "Telefone",
      "Diagnóstico",
      "Pontos Yang",
      "Pontos Yin",
    ];

    const rows = avaliacoes.map((av) => [
      `"${new Date(av.created_at).toLocaleString("pt-BR")}"`,
      `"${(av.nome || "").replace(/"/g, '""')}"`,
      `"${(av.email || "").replace(/"/g, '""')}"`,
      `"${(av.telefone || "").replace(/"/g, '""')}"`,
      `"${av.tipo_resultado.toUpperCase()}"`,
      av.pontos_yang,
      av.pontos_yin,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(";"), ...rows.map((e) => e.join(";"))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `avaliacoes-yin-yang-${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getWhatsAppLink = (av: AvaliacaoYinYang) => {
    if (!av.telefone) return null;
    const cleanPhone = av.telefone.replace(/\D/g, "");
    if (cleanPhone.length < 10) return null;

    const fullPhone = cleanPhone.startsWith("55") ? cleanPhone : `55${cleanPhone}`;
    const primeiroNome = (av.nome || "Participante").split(" ")[0];
    const diagnosticoTexto =
      av.tipo_resultado === "yang"
        ? "Yang (Predominância de Fogo & Atividade)"
        : "Yin (Predominância de Frio & Recolhimento)";

    const mensagem = `Olá ${primeiroNome}! Aqui é do INstituto Kalapa. Vimos que você concluiu sua autoavaliação energética com resultado ${diagnosticoTexto}. Como você tem se sentido e como podemos te apoiar em seu processo de cuidado e saúde?`;

    return `https://wa.me/${fullPhone}?text=${encodeURIComponent(mensagem)}`;
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-brand-purple">
              Avaliações Yin/Yang
            </h1>
            <span className="text-xs bg-brand-terracotta/15 text-brand-terracotta font-semibold px-2.5 py-0.5 rounded-full">
              Leads & Diagnósticos
            </span>
          </div>
          <p className="text-xs sm:text-sm text-brand-charcoal/60 mt-0.5">
            Participantes que realizaram a autoavaliação, com diagnóstico clínico e contatos para acompanhamento terapêutico.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchAvaliacoes}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl border border-brand-beige bg-white text-xs font-medium text-brand-charcoal hover:bg-brand-beige/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Atualizar lista"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Atualizar</span>
          </button>
          <button
            type="button"
            onClick={exportarCSV}
            className="px-4 py-2 rounded-xl bg-brand-purple text-white text-xs font-semibold hover:bg-brand-purple-dark transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Cards de Métricas / KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-beige shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-brand-charcoal/60">Total Avaliações</span>
            <div className="w-8 h-8 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-brand-purple">{totaisPorTipo.total}</p>
          <p className="text-[11px] text-brand-charcoal/50 mt-1">Relatórios gerados no total</p>
        </div>

        {/* Predominância Yang */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-orange-200/80 shadow-xs bg-gradient-to-br from-white to-orange-50/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-orange-950/70">Predom. Yang (Fogo)</span>
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl sm:text-3xl font-bold text-orange-900">{totaisPorTipo.yang}</p>
            <span className="text-xs font-semibold text-orange-700">
              {totaisPorTipo.total > 0
                ? `${Math.round((totaisPorTipo.yang / totaisPorTipo.total) * 100)}%`
                : "0%"}
            </span>
          </div>
          <p className="text-[11px] text-orange-900/60 mt-1">Aceleração e calor corporal</p>
        </div>

        {/* Predominância Yin */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-200/80 shadow-xs bg-gradient-to-br from-white to-emerald-50/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-emerald-950/70">Predom. Yin (Frio)</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl sm:text-3xl font-bold text-emerald-900">{totaisPorTipo.yin}</p>
            <span className="text-xs font-semibold text-emerald-700">
              {totaisPorTipo.total > 0
                ? `${Math.round((totaisPorTipo.yin / totaisPorTipo.total) * 100)}%`
                : "0%"}
            </span>
          </div>
          <p className="text-[11px] text-emerald-900/60 mt-1">Recolhimento e sensibilidade ao frio</p>
        </div>

        {/* Leads com WhatsApp */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-beige shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-brand-charcoal/60">Contatos WhatsApp</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <MessageCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl sm:text-3xl font-bold text-brand-charcoal">
              {totaisPorTipo.comTelefone}
            </p>
            <span className="text-xs font-semibold text-emerald-700">
              {totaisPorTipo.total > 0
                ? `${Math.round((totaisPorTipo.comTelefone / totaisPorTipo.total) * 100)}%`
                : "0%"}
            </span>
          </div>
          <p className="text-[11px] text-brand-charcoal/50 mt-1">Leads prontos para abordagem</p>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-white p-4 rounded-2xl border border-brand-beige flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-brand-charcoal/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Buscar por nome, e-mail ou telefone..."
            className="w-full pl-9 pr-3.5 py-2 border border-brand-beige rounded-xl text-xs sm:text-sm focus-visible:ring-2 focus-visible:ring-brand-purple/20 focus-visible:border-brand-purple"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-brand-beige-light p-1 rounded-xl shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => {
              setTipoFiltro("todos");
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              tipoFiltro === "todos"
                ? "bg-white text-brand-purple shadow-xs font-bold"
                : "text-brand-charcoal/70 hover:text-brand-charcoal"
            }`}
          >
            Todos ({totaisPorTipo.total})
          </button>
          <button
            type="button"
            onClick={() => {
              setTipoFiltro("yang");
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
              tipoFiltro === "yang"
                ? "bg-orange-100 text-orange-900 shadow-xs font-bold"
                : "text-brand-charcoal/70 hover:text-brand-charcoal"
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-orange-600" />
            <span>Yang ({totaisPorTipo.yang})</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setTipoFiltro("yin");
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
              tipoFiltro === "yin"
                ? "bg-emerald-100 text-emerald-900 shadow-xs font-bold"
                : "text-brand-charcoal/70 hover:text-brand-charcoal"
            }`}
          >
            <Droplets className="w-3.5 h-3.5 text-emerald-600" />
            <span>Yin ({totaisPorTipo.yin})</span>
          </button>
        </div>
      </div>

      {/* Tabela de Leads */}
      <div className="bg-white rounded-2xl border border-brand-beige overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-3 border-brand-purple border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs text-brand-charcoal/60">Carregando avaliações...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600 space-y-2">
            <AlertCircle className="w-6 h-6 mx-auto text-red-500" />
            <p className="text-sm font-medium">{error}</p>
            <button
              onClick={fetchAvaliacoes}
              className="px-4 py-1.5 rounded-lg bg-red-100 text-xs font-semibold text-red-800 hover:bg-red-200"
            >
              Tentar novamente
            </button>
          </div>
        ) : avaliacoes.length === 0 ? (
          <div className="py-16 text-center text-brand-charcoal/50 space-y-2">
            <Sparkles className="w-8 h-8 mx-auto text-brand-beige mb-1" />
            <p className="text-sm font-medium text-brand-charcoal/70">Nenhuma avaliação encontrada</p>
            <p className="text-xs max-w-sm mx-auto">
              Quando os usuários realizarem o teste Yin/Yang no site, os relatórios aparecerão automaticamente aqui com contatos para prospecção.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-brand-beige-light/60 border-b border-brand-beige text-brand-charcoal/70 text-[11px] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Data / Hora</th>
                  <th className="py-3.5 px-4">Participante</th>
                  <th className="py-3.5 px-4">Telefone / WhatsApp</th>
                  <th className="py-3.5 px-4">Diagnóstico</th>
                  <th className="py-3.5 px-4">Placar</th>
                  <th className="py-3.5 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-beige/50">
                {avaliacoes.map((av) => {
                  const whatsUrl = getWhatsAppLink(av);
                  const isYang = av.tipo_resultado === "yang";

                  return (
                    <tr key={av.id} className="hover:bg-brand-beige-light/30 transition-colors">
                      {/* Data */}
                      <td className="py-3.5 px-4 text-xs text-brand-charcoal/70 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-brand-charcoal/40" />
                          <span>{new Date(av.created_at).toLocaleDateString("pt-BR")}</span>
                          <span className="text-[10px] text-brand-charcoal/50">
                            {new Date(av.created_at).toLocaleTimeString("pt-BR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </td>

                      {/* Nome & Email */}
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-brand-charcoal">{av.nome}</p>
                        <a
                          href={`mailto:${av.email}`}
                          className="text-xs text-brand-purple hover:underline inline-flex items-center gap-1 mt-0.5"
                        >
                          <Mail className="w-3 h-3 text-brand-purple/70" />
                          <span>{av.email}</span>
                        </a>
                      </td>

                      {/* WhatsApp / Telefone */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {whatsUrl ? (
                          <a
                            href={whatsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold transition-all group"
                            title="Abrir WhatsApp com mensagem acolhedora pré-formatada"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
                            <span>{av.telefone}</span>
                          </a>
                        ) : av.telefone ? (
                          <span className="text-xs text-brand-charcoal/70">{av.telefone}</span>
                        ) : (
                          <span className="text-xs text-brand-charcoal/40 italic">Não informado</span>
                        )}
                      </td>

                      {/* Diagnóstico */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {isYang ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 border border-orange-200">
                            <Flame className="w-3.5 h-3.5 text-orange-600" /> Yang (Fogo)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <Droplets className="w-3.5 h-3.5 text-emerald-600" /> Yin (Frescor)
                          </span>
                        )}
                      </td>

                      {/* Placar */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-xs font-medium">
                          <span className="text-orange-700">🔥 {av.pontos_yang}</span>
                          <span className="text-brand-charcoal/30">/</span>
                          <span className="text-emerald-700">🌊 {av.pontos_yin}</span>
                        </div>
                      </td>

                      {/* Ações */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setAvaliacaoSelecionada(av)}
                            className="p-1.5 rounded-lg text-brand-purple hover:bg-brand-purple/10 transition-colors"
                            title="Ver detalhes das respostas"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setAvaliacaoParaExcluir(av)}
                            className="p-1.5 rounded-lg text-brand-charcoal/50 hover:bg-red-50 hover:text-red-600 transition-colors"
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
              Mostrando página <strong>{page}</strong> de <strong>{totalPages}</strong> ({total} registros)
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 rounded-lg border border-brand-beige hover:bg-brand-beige/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Anterior
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1.5 rounded-lg border border-brand-beige hover:bg-brand-beige/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
              >
                Próxima <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Detalhes da Avaliação */}
      {avaliacaoSelecionada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-brand-beige my-auto max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-brand-beige shrink-0">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-terracotta">
                  Detalhamento da Autoavaliação
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-brand-purple">
                  {avaliacaoSelecionada.nome}
                </h3>
                <p className="text-xs text-brand-charcoal/60 mt-0.5">
                  Realizada em {new Date(avaliacaoSelecionada.created_at).toLocaleString("pt-BR")}
                </p>
              </div>
              <button
                onClick={() => setAvaliacaoSelecionada(null)}
                className="p-2 rounded-xl text-brand-charcoal/50 hover:bg-brand-beige/30 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Resumo do Participante */}
            <div className="my-4 p-4 rounded-xl bg-brand-beige-light border border-brand-beige/70 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs shrink-0">
              <div>
                <span className="text-brand-charcoal/50 block font-medium">Diagnóstico</span>
                <span className="font-bold text-brand-charcoal flex items-center gap-1 mt-0.5">
                  {avaliacaoSelecionada.tipo_resultado === "yang" ? (
                    <>🔥 Yang ({avaliacaoSelecionada.pontos_yang} pts)</>
                  ) : (
                    <>🌊 Yin ({avaliacaoSelecionada.pontos_yin} pts)</>
                  )}
                </span>
              </div>
              <div>
                <span className="text-brand-charcoal/50 block font-medium">E-mail</span>
                <span className="font-medium text-brand-purple truncate block mt-0.5">
                  {avaliacaoSelecionada.email}
                </span>
              </div>
              <div>
                <span className="text-brand-charcoal/50 block font-medium">WhatsApp</span>
                <span className="font-medium text-brand-charcoal block mt-0.5">
                  {avaliacaoSelecionada.telefone || "Não cadastrado"}
                </span>
              </div>
            </div>

            {/* Lista das 15 Respostas */}
            <div className="overflow-y-auto space-y-2.5 flex-1 pr-1 text-xs">
              <h4 className="font-semibold text-brand-charcoal text-xs sticky top-0 bg-white py-1">
                Respostas das 15 Dimensões Clínicas:
              </h4>
              {YIN_YANG_PERGUNTAS.map((pergunta) => {
                const resp = avaliacaoSelecionada.respostas?.[pergunta.id];
                const ladoEscolhido =
                  resp === "yang" ? pergunta.ladoYang : resp === "yin" ? pergunta.ladoYin : null;

                return (
                  <div
                    key={pergunta.id}
                    className="p-3 rounded-xl border border-brand-beige/60 bg-[#FDFBF7]"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-brand-charcoal flex items-center gap-1.5">
                        <span>{pergunta.icone}</span>
                        <span>
                          #{pergunta.id} {pergunta.categoria}
                        </span>
                      </span>
                      {resp === "yang" ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-800">
                          +1 Yang
                        </span>
                      ) : resp === "yin" ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          +1 Yin
                        </span>
                      ) : (
                        <span className="text-[10px] text-brand-charcoal/40 italic">Sem resposta</span>
                      )}
                    </div>
                    {ladoEscolhido && (
                      <div className="text-[11px] text-brand-charcoal/80 mt-1 pl-5">
                        <strong>{ladoEscolhido.titulo}:</strong> {ladoEscolhido.descricao}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-brand-beige mt-4 flex items-center justify-between shrink-0">
              {getWhatsAppLink(avaliacaoSelecionada) ? (
                <a
                  href={getWhatsAppLink(avaliacaoSelecionada)!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chamar no WhatsApp</span>
                </a>
              ) : (
                <div />
              )}
              <button
                type="button"
                onClick={() => setAvaliacaoSelecionada(null)}
                className="px-5 py-2.5 rounded-xl bg-brand-charcoal text-white text-xs font-medium hover:bg-brand-charcoal/80 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {avaliacaoParaExcluir && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-brand-beige text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-brand-charcoal">Excluir Avaliação?</h3>
              <p className="text-xs text-brand-charcoal/70 mt-1">
                Tem certeza que deseja apagar a avaliação de <strong>{avaliacaoParaExcluir.nome}</strong>? Esta ação não pode ser desfeita.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAvaliacaoParaExcluir(null)}
                className="flex-1 py-2.5 rounded-xl border border-brand-beige text-xs font-medium text-brand-charcoal hover:bg-brand-beige/20"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleExcluir}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors disabled:opacity-50"
              >
                {isDeleting ? "Excluindo..." : "Sim, Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
