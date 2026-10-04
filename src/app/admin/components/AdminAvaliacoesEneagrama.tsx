"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Compass,
  MessageCircle,
  Mail,
  Search,
  RefreshCw,
  Download,
  Calendar,
  Eye,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import type { AvaliacaoEneagrama } from "@/lib/types";
import { ENEAGRAMA_TIPOS_MAP } from "@/app/teste-eneagrama/data/eneagrama-data";

const TIPOS_POR_NUMERO = Object.values(ENEAGRAMA_TIPOS_MAP).sort((a, b) => a.numero - b.numero);

interface Totais {
  total: number;
  porTipo: Record<string, number>;
  comTelefone: number;
}

export default function AdminAvaliacoesEneagrama() {
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoEneagrama[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState<string>("todos");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [totais, setTotais] = useState<Totais>({ total: 0, porTipo: {}, comTelefone: 0 });

  const [selecionada, setSelecionada] = useState<AvaliacaoEneagrama | null>(null);
  const [paraExcluir, setParaExcluir] = useState<AvaliacaoEneagrama | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchAvaliacoes = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (tipoFiltro !== "todos") params.set("tipo", tipoFiltro);
      params.set("page", String(page));
      params.set("perPage", "20");

      const res = await fetch(`/api/admin/avaliacoes-eneagrama?${params.toString()}`);
      if (!res.ok) throw new Error("Falha ao carregar as avaliações do Eneagrama.");
      const data = await res.json();
      setAvaliacoes(data.avaliacoes || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
      if (data.totais) setTotais(data.totais);
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
    if (!paraExcluir) return;
    setIsDeleting(true);
    try {
      const res = await fetch("/api/admin/avaliacoes-eneagrama", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: paraExcluir.id }),
      });
      if (!res.ok) throw new Error("Erro ao excluir avaliação.");
      setParaExcluir(null);
      await fetchAvaliacoes();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Erro ao excluir.");
    } finally {
      setIsDeleting(false);
    }
  };

  const rotuloTipos = (av: AvaliacaoEneagrama) =>
    (av.tipos_principais || []).map((t) => `Tipo ${t}`).join(" / ");

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
      "Tipo(s) Principal(is)",
      ...TIPOS_POR_NUMERO.map((t) => `Pontos Tipo ${t.numero}`),
    ];

    const rows = avaliacoes.map((av) => [
      `"${new Date(av.created_at).toLocaleString("pt-BR")}"`,
      `"${(av.nome || "").replace(/"/g, '""')}"`,
      `"${(av.email || "").replace(/"/g, '""')}"`,
      `"${(av.telefone || "").replace(/"/g, '""')}"`,
      `"${rotuloTipos(av)}"`,
      ...TIPOS_POR_NUMERO.map((t) => av.pontuacoes?.[String(t.numero)] ?? 0),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(";"), ...rows.map((e) => e.join(";"))].join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute(
      "download",
      `avaliacoes-eneagrama-${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getWhatsAppLink = (av: AvaliacaoEneagrama) => {
    if (!av.telefone) return null;
    const cleanPhone = av.telefone.replace(/\D/g, "");
    if (cleanPhone.length < 10) return null;

    const fullPhone = cleanPhone.startsWith("55") ? cleanPhone : `55${cleanPhone}`;
    const primeiroNome = (av.nome || "Participante").split(" ")[0];
    const mensagem = `Olá ${primeiroNome}! Aqui é do INstituto Kalapa. Vimos que você concluiu o teste do Eneagrama com resultado ${rotuloTipos(av)}. Como você tem se sentido ao olhar para esse padrão e como podemos te apoiar no seu processo de autoconhecimento?`;

    return `https://wa.me/${fullPhone}?text=${encodeURIComponent(mensagem)}`;
  };

  const tipoMaisComum =
    totais.total > 0
      ? Object.entries(totais.porTipo).sort((a, b) => b[1] - a[1])[0]
      : null;
  const maxPorTipo = Math.max(1, ...Object.values(totais.porTipo));

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-brand-purple">Avaliações Eneagrama</h2>
            <span className="text-xs bg-brand-terracotta/15 text-brand-terracotta font-semibold px-2.5 py-0.5 rounded-full">
              Leads & Eneatipos
            </span>
          </div>
          <p className="text-xs sm:text-sm text-brand-charcoal/60 mt-0.5">
            Participantes que realizaram o teste do Eneagrama, com eneatipo dominante e contatos para acompanhamento.
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

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-beige shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-brand-charcoal/60">Total Avaliações</span>
            <div className="w-8 h-8 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-brand-purple">{totais.total}</p>
          <p className="text-[11px] text-brand-charcoal/50 mt-1">Laudos gerados no total</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-beige shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-brand-charcoal/60">Tipo mais comum</span>
            <div className="w-8 h-8 rounded-xl bg-brand-terracotta/10 text-brand-terracotta flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-brand-charcoal">
            {tipoMaisComum ? `Tipo ${tipoMaisComum[0]}` : "—"}
          </p>
          <p className="text-[11px] text-brand-charcoal/50 mt-1">
            {tipoMaisComum && totais.total > 0
              ? `${tipoMaisComum[1]} participante(s) · ${Math.round((tipoMaisComum[1] / totais.total) * 100)}%`
              : "Sem dados ainda"}
          </p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-beige shadow-xs col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-brand-charcoal/60">Contatos WhatsApp</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <MessageCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl sm:text-3xl font-bold text-brand-charcoal">{totais.comTelefone}</p>
            <span className="text-xs font-semibold text-emerald-700">
              {totais.total > 0 ? `${Math.round((totais.comTelefone / totais.total) * 100)}%` : "0%"}
            </span>
          </div>
          <p className="text-[11px] text-brand-charcoal/50 mt-1">Leads prontos para abordagem</p>
        </div>
      </div>

      {/* Distribuição por tipo */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-beige shadow-xs">
        <h3 className="text-sm font-semibold text-brand-charcoal mb-3">Distribuição por Eneatipo</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-2">
          {TIPOS_POR_NUMERO.map((t) => {
            const qtd = totais.porTipo[String(t.numero)] || 0;
            return (
              <div key={t.numero} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-brand-charcoal/80 truncate pr-2">
                    Tipo {t.numero} · {t.subtitulo.split(" / ")[0]}
                  </span>
                  <span className="font-semibold text-brand-charcoal">{qtd}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-brand-beige-light overflow-hidden">
                  <div
                    className="h-full rounded-full bg-brand-purple/70"
                    style={{ width: `${(qtd / maxPorTipo) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-2xl border border-brand-beige flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 shadow-xs">
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

        <div className="flex flex-wrap items-center gap-1 bg-brand-beige-light p-1 rounded-xl self-start lg:self-auto">
          {["todos", "1", "2", "3", "4", "5", "6", "7", "8", "9"].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setTipoFiltro(t);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                tipoFiltro === t
                  ? "bg-white text-brand-purple shadow-xs font-bold"
                  : "text-brand-charcoal/70 hover:text-brand-charcoal"
              }`}
            >
              {t === "todos" ? `Todos (${totais.total})` : `Tipo ${t} (${totais.porTipo[t] || 0})`}
            </button>
          ))}
        </div>
      </div>

      {/* Tabela */}
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
            <Compass className="w-8 h-8 mx-auto text-brand-beige mb-1" />
            <p className="text-sm font-medium text-brand-charcoal/70">Nenhuma avaliação encontrada</p>
            <p className="text-xs max-w-sm mx-auto">
              Quando os usuários concluírem o teste do Eneagrama no site, os resultados aparecerão automaticamente aqui.
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
                  <th className="py-3.5 px-4">Eneatipo</th>
                  <th className="py-3.5 px-4">Pontuação</th>
                  <th className="py-3.5 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-beige/50">
                {avaliacoes.map((av) => {
                  const whatsUrl = getWhatsAppLink(av);
                  const principal = av.tipos_principais?.[0];
                  const pontosPrincipal = principal ? av.pontuacoes?.[String(principal)] : undefined;

                  return (
                    <tr key={av.id} className="hover:bg-brand-beige-light/30 transition-colors">
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

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-purple/10 text-brand-purple border border-brand-purple/20">
                          <Compass className="w-3.5 h-3.5" />
                          {rotuloTipos(av)}
                        </span>
                        {(av.tipos_principais?.length || 0) > 1 && (
                          <span className="ml-1.5 text-[10px] text-amber-700 font-semibold">empate</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap text-xs font-medium text-brand-charcoal/80">
                        {pontosPrincipal !== undefined ? `${pontosPrincipal} / 25` : "—"}
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelecionada(av)}
                            className="p-1.5 rounded-lg text-brand-purple hover:bg-brand-purple/10 transition-colors"
                            title="Ver pontuação dos 9 tipos"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setParaExcluir(av)}
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

      {/* Modal de detalhes */}
      {selecionada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-brand-beige my-auto max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-brand-beige shrink-0">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-terracotta">
                  Detalhamento do Eneagrama
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-brand-purple">{selecionada.nome}</h3>
                <p className="text-xs text-brand-charcoal/60 mt-0.5">
                  Realizado em {new Date(selecionada.created_at).toLocaleString("pt-BR")}
                </p>
              </div>
              <button
                onClick={() => setSelecionada(null)}
                className="p-2 rounded-xl text-brand-charcoal/50 hover:bg-brand-beige/30 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-4 p-4 rounded-xl bg-brand-beige-light border border-brand-beige/70 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs shrink-0">
              <div>
                <span className="text-brand-charcoal/50 block font-medium">Eneatipo</span>
                <span className="font-bold text-brand-charcoal mt-0.5 block">{rotuloTipos(selecionada)}</span>
              </div>
              <div>
                <span className="text-brand-charcoal/50 block font-medium">E-mail</span>
                <span className="font-medium text-brand-purple truncate block mt-0.5">{selecionada.email}</span>
              </div>
              <div>
                <span className="text-brand-charcoal/50 block font-medium">WhatsApp</span>
                <span className="font-medium text-brand-charcoal block mt-0.5">
                  {selecionada.telefone || "Não cadastrado"}
                </span>
              </div>
            </div>

            <div className="overflow-y-auto space-y-2.5 flex-1 pr-1 text-xs">
              <h4 className="font-semibold text-brand-charcoal text-xs sticky top-0 bg-white py-1">
                Pontuação nos 9 Eneatipos (máx. 25):
              </h4>
              {TIPOS_POR_NUMERO.map((t) => {
                const pontos = selecionada.pontuacoes?.[String(t.numero)] ?? 0;
                const ehPrincipal = selecionada.tipos_principais?.includes(t.numero);
                return (
                  <div key={t.numero} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className={`${ehPrincipal ? "font-bold text-brand-purple" : "text-brand-charcoal/80"}`}>
                        Tipo {t.numero} – {t.subtitulo}
                      </span>
                      <span className="font-semibold text-brand-charcoal">
                        {pontos} ({Math.round((pontos / 25) * 100)}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-brand-beige-light overflow-hidden">
                      <div
                        className={`h-full rounded-full ${ehPrincipal ? "bg-brand-purple" : "bg-brand-terracotta/45"}`}
                        style={{ width: `${Math.min(100, (pontos / 25) * 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-brand-beige mt-4 flex items-center justify-between shrink-0">
              {getWhatsAppLink(selecionada) ? (
                <a
                  href={getWhatsAppLink(selecionada)!}
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
                onClick={() => setSelecionada(null)}
                className="px-5 py-2.5 rounded-xl bg-brand-charcoal text-white text-xs font-medium hover:bg-brand-charcoal/80 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmação de exclusão */}
      {paraExcluir && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-brand-beige text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-brand-charcoal">Excluir Avaliação?</h3>
              <p className="text-xs text-brand-charcoal/70 mt-1">
                Tem certeza que deseja apagar a avaliação de <strong>{paraExcluir.nome}</strong>? Esta ação não pode ser desfeita.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setParaExcluir(null)}
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
