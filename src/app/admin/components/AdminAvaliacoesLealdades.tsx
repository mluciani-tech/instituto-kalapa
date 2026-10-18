"use client";

import { useState, useEffect, useCallback } from "react";
import {
  MessageCircle,
  Search,
  RefreshCw,
  Download,
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  HeartHandshake,
  Calendar,
  Mail,
} from "lucide-react";

interface AvaliacaoLealdades {
  id: string;
  usuario_id?: string | null;
  nome: string;
  email: string;
  telefone: string | null;
  perfil_dominante: string;
  pontuacoes?: Record<string, number> | null;
  created_at: string;
}

interface Totais {
  total: number;
  porPerfil: Record<string, number>;
  comTelefone: number;
}

export default function AdminAvaliacoesLealdades() {
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoLealdades[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [totais, setTotais] = useState<Totais>({
    total: 0,
    porPerfil: {},
    comTelefone: 0,
  });

  const [paraExcluir, setParaExcluir] = useState<AvaliacaoLealdades | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedback, setFeedback] = useState<{ tipo: "sucesso" | "erro" | "aviso"; texto: string } | null>(null);

  const fetchAvaliacoes = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      params.set("page", String(page));
      params.set("perPage", "20");

      const res = await fetch(`/api/admin/avaliacoes-lealdades?${params.toString()}`);
      if (!res.ok) throw new Error("Falha ao carregar as avaliações de Lealdades Invisíveis.");
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
  }, [search, page]);

  useEffect(() => {
    fetchAvaliacoes();
  }, [fetchAvaliacoes]);

  const handleExcluir = async () => {
    if (!paraExcluir) return;
    setIsDeleting(true);
    try {
      const res = await fetch("/api/admin/avaliacoes-lealdades", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: paraExcluir.id }),
      });
      if (!res.ok) throw new Error("Erro ao excluir avaliação.");
      setParaExcluir(null);
      setFeedback({ tipo: "sucesso", texto: "Avaliação excluída com sucesso." });
      await fetchAvaliacoes();
    } catch (err: unknown) {
      setFeedback({ tipo: "erro", texto: err instanceof Error ? err.message : "Erro ao excluir avaliação." });
    } finally {
      setIsDeleting(false);
    }
  };

  const exportarCSV = () => {
    if (avaliacoes.length === 0) {
      setFeedback({ tipo: "aviso", texto: "Não há registros para exportar no filtro atual." });
      return;
    }
    const cabecalho = ["Nome", "E-mail", "WhatsApp", "Perfil Dominante", "Data"];
    const linhas = avaliacoes.map((a) => [
      `"${(a.nome || "").replace(/"/g, '""')}"`,
      `"${a.email || ""}"`,
      `"${a.telefone || ""}"`,
      `"${(a.perfil_dominante || "").replace(/"/g, '""')}"`,
      `"${new Date(a.created_at).toLocaleString("pt-BR")}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [cabecalho.join(";"), ...linhas.map((l) => l.join(";"))].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `avaliacoes_lealdades_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  const gerarWhatsApp = (a: AvaliacaoLealdades) => {
    if (!a.telefone) return null;
    let tel = a.telefone.replace(/\D/g, "");
    if (tel.length < 8) return null;
    if (tel.length === 10 || tel.length === 11) tel = `55${tel}`;
    const msg = encodeURIComponent(
      `Olá ${a.nome}, tudo bem? Sou da equipe do INstituto Kalapa. Vimos que você realizou o teste de Lealdades Invisíveis (resultado: ${a.perfil_dominante}). Gostaria de saber como foi para você acessar o seu diagnóstico sistêmico!`
    );
    return `https://wa.me/${tel}?text=${msg}`;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-brand-beige shadow-xs">
          <p className="text-[11px] uppercase tracking-wider font-semibold text-brand-charcoal/60 mb-1">
            Total Avaliações
          </p>
          <p className="text-2xl font-bold text-brand-purple">{totais.total}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-brand-beige shadow-xs">
          <p className="text-[11px] uppercase tracking-wider font-semibold text-brand-terracotta mb-1 flex items-center gap-1">
            <HeartHandshake className="w-3.5 h-3.5" /> Perfil Mais Frequente
          </p>
          <p className="text-base font-bold text-brand-charcoal truncate">
            {Object.entries(totais.porPerfil).sort((a, b) => b[1] - a[1])[0]?.[0] || "—"}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-brand-beige shadow-xs">
          <p className="text-[11px] uppercase tracking-wider font-semibold text-brand-charcoal/60 mb-1 flex items-center gap-1">
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" /> Com WhatsApp
          </p>
          <p className="text-2xl font-bold text-brand-charcoal">{totais.comTelefone}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-brand-beige shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-brand-charcoal/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Buscar por nome, e-mail, telefone ou perfil..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-brand-beige bg-brand-beige-light/40 focus:bg-white focus:border-brand-purple outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2 justify-end">
          <button
            type="button"
            onClick={fetchAvaliacoes}
            className="p-2.5 rounded-xl border border-brand-beige hover:bg-brand-beige-light text-brand-charcoal transition-colors cursor-pointer"
            title="Atualizar"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            type="button"
            onClick={exportarCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-purple text-white text-xs font-semibold hover:bg-brand-purple-dark transition-colors shadow-xs cursor-pointer"
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

      {error && (
        <div className="p-4 rounded-2xl border border-red-200 bg-red-50 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-brand-beige overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-3 border-brand-purple border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs text-brand-charcoal/60">Carregando avaliações...</p>
          </div>
        ) : avaliacoes.length === 0 ? (
          <div className="py-16 text-center text-brand-charcoal/50 space-y-2">
            <HeartHandshake className="w-8 h-8 mx-auto text-brand-beige mb-1" />
            <p className="text-sm font-medium text-brand-charcoal/70">
              Nenhuma avaliação de Lealdades Invisíveis encontrada
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
                  <th className="py-3.5 px-4">Perfil Dominante</th>
                  <th className="py-3.5 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-beige/50">
                {avaliacoes.map((a) => {
                  const zap = gerarWhatsApp(a);
                  return (
                    <tr key={a.id} className="hover:bg-brand-beige-light/30 transition-colors">
                      <td className="py-3.5 px-4 text-xs text-brand-charcoal/70 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-brand-charcoal/40" />
                          <span>{new Date(a.created_at).toLocaleDateString("pt-BR")}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-brand-charcoal">{a.nome}</p>
                        <a
                          href={`mailto:${a.email}`}
                          className="text-xs text-brand-purple hover:underline inline-flex items-center gap-1 mt-0.5"
                        >
                          <Mail className="w-3 h-3 text-brand-purple/70" />
                          <span>{a.email}</span>
                        </a>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-brand-charcoal/70">
                        {a.telefone || <span className="italic text-brand-charcoal/40">Não informado</span>}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-900 border border-rose-200">
                          <HeartHandshake className="w-3.5 h-3.5 text-rose-700" />
                          <span>{a.perfil_dominante}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          {zap && (
                            <a
                              href={zap}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                              title="Chamar no WhatsApp"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => setParaExcluir(a)}
                            className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
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

        {totalPages > 1 && (
          <div className="p-4 border-t border-brand-beige flex items-center justify-between text-xs text-brand-charcoal/70">
            <span>
              Página <strong>{page}</strong> de <strong>{totalPages}</strong> ({total} registros)
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-brand-beige hover:bg-brand-beige-light disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg border border-brand-beige hover:bg-brand-beige-light disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {paraExcluir && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl border border-brand-beige space-y-4">
            <h3 className="text-base font-bold text-brand-charcoal">
              Excluir avaliação de {paraExcluir.nome}?
            </h3>
            <p className="text-xs text-brand-charcoal/60">
              Esta ação removerá o registro permanentemente.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setParaExcluir(null)}
                className="px-4 py-2 text-xs font-semibold text-brand-charcoal/70 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleExcluir}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold disabled:opacity-50 cursor-pointer"
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
