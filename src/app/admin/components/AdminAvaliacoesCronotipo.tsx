"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Clock,
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
  Sunrise,
  SunMedium,
  Moon,
  Sparkles,
} from "lucide-react";
import type { AvaliacaoCronotipo } from "@/lib/types";

interface Totais {
  total: number;
  porCronotipo: Record<string, number>;
  comTelefone: number;
}

export default function AdminAvaliacoesCronotipo() {
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoCronotipo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [cronotipoFiltro, setCronotipoFiltro] = useState<string>("todos");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [totais, setTotais] = useState<Totais>({
    total: 0,
    porCronotipo: { matutino: 0, intermediario: 0, vespertino: 0 },
    comTelefone: 0,
  });

  const [selecionada, setSelecionada] = useState<AvaliacaoCronotipo | null>(null);
  const [paraExcluir, setParaExcluir] = useState<AvaliacaoCronotipo | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchAvaliacoes = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (cronotipoFiltro !== "todos") params.set("cronotipo", cronotipoFiltro);
      params.set("page", String(page));
      params.set("perPage", "20");

      const res = await fetch(`/api/admin/avaliacoes-cronotipo?${params.toString()}`);
      if (!res.ok) throw new Error("Falha ao carregar as avaliações do Cronotipo.");
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
  }, [search, cronotipoFiltro, page]);

  useEffect(() => {
    fetchAvaliacoes();
  }, [fetchAvaliacoes]);

  const handleExcluir = async () => {
    if (!paraExcluir) return;
    setIsDeleting(true);
    try {
      const res = await fetch("/api/admin/avaliacoes-cronotipo", {
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

  const badgeCronotipo = (cronotipo: string) => {
    const c = String(cronotipo).toLowerCase();
    if (c === "matutino") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100/80 text-amber-900 border border-amber-200">
          <Sunrise className="w-3.5 h-3.5 text-amber-600" />
          <span>Matutino (Cotovia)</span>
        </span>
      );
    }
    if (c === "vespertino") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-900 border border-slate-300">
          <Moon className="w-3.5 h-3.5 text-[#1A3C4D]" />
          <span>Vespertino (Coruja)</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100/70 text-emerald-900 border border-emerald-200">
        <SunMedium className="w-3.5 h-3.5 text-[#7D8C6E]" />
        <span>Intermediário (Urso)</span>
      </span>
    );
  };

  const exportarCSV = () => {
    if (avaliacoes.length === 0) {
      alert("Não há registros para exportar no filtro atual.");
      return;
    }
    const cabecalho = ["Nome", "E-mail", "WhatsApp", "Cronotipo", "Pontuação", "Data"];
    const linhas = avaliacoes.map((a) => [
      `"${a.nome.replace(/"/g, '""')}"`,
      `"${a.email}"`,
      `"${a.telefone || ""}"`,
      `"${a.cronotipo}"`,
      a.pontuacao_total,
      `"${new Date(a.created_at).toLocaleString("pt-BR")}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [cabecalho.join(";"), ...linhas.map((l) => l.join(";"))].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `avaliacoes_cronotipo_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Cards de Métricas */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-brand-sand shadow-xs">
          <p className="text-[11px] uppercase tracking-wider font-semibold text-brand-charcoal/60 mb-1">
            Total Avaliações
          </p>
          <p className="text-2xl font-serif font-bold text-brand-charcoal">
            {totais.total}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-brand-sand shadow-xs">
          <p className="text-[11px] uppercase tracking-wider font-semibold text-amber-700 mb-1 flex items-center gap-1">
            <Sunrise className="w-3 h-3" /> Cotovia (Matutino)
          </p>
          <p className="text-2xl font-serif font-bold text-brand-charcoal">
            {totais.porCronotipo.matutino || 0}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-brand-sand shadow-xs">
          <p className="text-[11px] uppercase tracking-wider font-semibold text-[#7D8C6E] mb-1 flex items-center gap-1">
            <SunMedium className="w-3 h-3" /> Urso (Interm.)
          </p>
          <p className="text-2xl font-serif font-bold text-brand-charcoal">
            {totais.porCronotipo.intermediario || 0}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-brand-sand shadow-xs">
          <p className="text-[11px] uppercase tracking-wider font-semibold text-[#1A3C4D] mb-1 flex items-center gap-1">
            <Moon className="w-3 h-3" /> Coruja (Vesp.)
          </p>
          <p className="text-2xl font-serif font-bold text-brand-charcoal">
            {totais.porCronotipo.vespertino || 0}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-brand-sand shadow-xs col-span-2 sm:col-span-1">
          <p className="text-[11px] uppercase tracking-wider font-semibold text-brand-charcoal/60 mb-1 flex items-center gap-1">
            <MessageCircle className="w-3 h-3 text-emerald-600" /> Com WhatsApp
          </p>
          <p className="text-2xl font-serif font-bold text-brand-charcoal">
            {totais.comTelefone}
          </p>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="bg-white p-4 rounded-2xl border border-brand-sand shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
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
              placeholder="Buscar por nome, e-mail ou telefone..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-brand-sand bg-brand-cream/20 focus:bg-white focus:border-brand-gold outline-none transition-all"
            />
          </div>

          <select
            value={cronotipoFiltro}
            onChange={(e) => {
              setCronotipoFiltro(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 text-xs sm:text-sm rounded-xl border border-brand-sand bg-white text-brand-charcoal font-medium outline-none cursor-pointer"
          >
            <option value="todos">Todos os Cronotipos</option>
            <option value="matutino">Matutino (Cotovia)</option>
            <option value="intermediario">Intermediário (Urso)</option>
            <option value="vespertino">Vespertino (Coruja)</option>
          </select>
        </div>

        <div className="flex items-center gap-2 justify-end">
          <button
            type="button"
            onClick={fetchAvaliacoes}
            className="p-2.5 rounded-xl border border-brand-sand hover:bg-brand-cream/30 text-brand-charcoal transition-colors cursor-pointer"
            title="Atualizar"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            type="button"
            onClick={exportarCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-navy text-white text-xs font-semibold hover:bg-brand-navy/90 transition-colors shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Tabela de Resultados */}
      <div className="bg-white rounded-2xl border border-brand-sand shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-sm text-brand-charcoal/60">
            Carregando avaliações do Cronotipo...
          </div>
        ) : error ? (
          <div className="py-12 text-center text-sm text-red-600 flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        ) : avaliacoes.length === 0 ? (
          <div className="py-16 text-center text-sm text-brand-charcoal/60">
            Nenhuma avaliação encontrada com os filtros selecionados.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-brand-cream/40 border-b border-brand-sand text-[11px] uppercase tracking-wider text-brand-charcoal/70">
                <tr>
                  <th className="py-3 px-4 font-semibold">Participante</th>
                  <th className="py-3 px-4 font-semibold">Contato</th>
                  <th className="py-3 px-4 font-semibold">Cronotipo</th>
                  <th className="py-3 px-4 font-semibold text-center">Pontos</th>
                  <th className="py-3 px-4 font-semibold">Data</th>
                  <th className="py-3 px-4 font-semibold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-sand/60">
                {avaliacoes.map((av) => {
                  const foneLimpo = (av.telefone || "").replace(/\D/g, "");
                  const linkWhatsapp = foneLimpo
                    ? `https://wa.me/55${foneLimpo}?text=${encodeURIComponent(
                        `Olá ${av.nome}! Vi que você realizou o Teste de Cronotipo no INstituto Kalapa. Como foi sua experiência?`
                      )}`
                    : null;

                  return (
                    <tr key={av.id} className="hover:bg-brand-cream/20 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-brand-charcoal">
                        {av.nome}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <span className="text-brand-charcoal/80 block truncate max-w-[200px]">
                            {av.email}
                          </span>
                          {av.telefone ? (
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] text-brand-charcoal/60">
                                {av.telefone}
                              </span>
                              {linkWhatsapp && (
                                <a
                                  href={linkWhatsapp}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-emerald-700 hover:text-emerald-800 transition-colors"
                                  title="Conversar no WhatsApp"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                          ) : (
                            <span className="text-[11px] text-brand-charcoal/40 italic">
                              Sem telefone
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">{badgeCronotipo(av.cronotipo)}</td>
                      <td className="py-3.5 px-4 text-center font-serif font-bold text-brand-charcoal">
                        {av.pontuacao_total}{" "}
                        <span className="text-[11px] font-normal text-brand-charcoal/50">
                          / 18
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-brand-charcoal/70 text-xs">
                        {new Date(av.created_at).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setSelecionada(av)}
                            className="p-1.5 rounded-lg text-brand-charcoal/70 hover:text-brand-navy hover:bg-brand-sand/40 transition-colors"
                            title="Ver detalhes"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setParaExcluir(av)}
                            className="p-1.5 rounded-lg text-brand-charcoal/50 hover:text-red-700 hover:bg-red-50 transition-colors"
                            title="Excluir"
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
          <div className="p-4 border-t border-brand-sand flex items-center justify-between text-xs text-brand-charcoal/70">
            <span>
              Página {page} de {totalPages} ({total} avaliações)
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-1.5 rounded-lg border border-brand-sand hover:bg-brand-cream/30 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-1.5 rounded-lg border border-brand-sand hover:bg-brand-cream/30 disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Detalhes da Avaliação */}
      {selecionada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto border border-brand-sand shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-brand-sand">
              <div>
                <h3 className="text-lg font-serif font-bold text-brand-charcoal">
                  Avaliação: {selecionada.nome}
                </h3>
                <p className="text-xs text-brand-charcoal/60">{selecionada.email}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelecionada(null)}
                className="p-2 rounded-xl text-brand-charcoal/60 hover:text-brand-charcoal hover:bg-brand-sand/30"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-brand-cream/40 border border-brand-sand">
              <div>
                <p className="text-xs text-brand-charcoal/60 uppercase font-semibold">
                  Cronotipo Identificado
                </p>
                <div className="mt-1">{badgeCronotipo(selecionada.cronotipo)}</div>
              </div>
              <div className="text-right">
                <p className="text-xs text-brand-charcoal/60 uppercase font-semibold">
                  Pontuação
                </p>
                <p className="text-2xl font-serif font-bold text-brand-charcoal">
                  {selecionada.pontuacao_total} / 18 pts
                </p>
              </div>
            </div>

            {/* Respostas das Questões */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-charcoal/70">
                Respostas Registradas
              </h4>
              <div className="space-y-2">
                {Array.isArray(selecionada.respostas) &&
                  selecionada.respostas.map((r: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-brand-cream/20 border border-brand-sand text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-brand-charcoal font-semibold">
                        <span>
                          Q{r.questaoId || idx + 1}: {r.dimensao || ""}
                        </span>
                        <span className="text-brand-gold font-bold">
                          +{r.pontos} pts
                        </span>
                      </div>
                      <p className="text-brand-charcoal/80 font-light">
                        {r.opcaoTexto || r.resposta || JSON.stringify(r)}
                      </p>
                    </div>
                  ))}
              </div>
            </div>

            <div className="pt-3 border-t border-brand-sand flex justify-end">
              <button
                type="button"
                onClick={() => setSelecionada(null)}
                className="px-5 py-2.5 rounded-xl bg-brand-navy text-white text-xs font-semibold hover:bg-brand-navy/90"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {paraExcluir && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full border border-brand-sand shadow-2xl space-y-4">
            <h3 className="text-base font-serif font-bold text-brand-charcoal">
              Excluir Avaliação?
            </h3>
            <p className="text-xs text-brand-charcoal/70 font-light">
              Tem certeza de que deseja remover permanentemente a avaliação de{" "}
              <strong>{paraExcluir.nome}</strong>? Essa ação não pode ser desfeita.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setParaExcluir(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl border border-brand-sand text-xs font-semibold text-brand-charcoal hover:bg-brand-cream/30"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleExcluir}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
