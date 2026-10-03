"use client";

import { useState, useCallback } from "react";
import type { Participante, Produto } from "@/lib/types";
import { formatDate, formatCPF } from "../lib/format";
import SortableHeader from "./ui/SortableHeader";

type Props = {
  produtos: Produto[];
  participantes: Participante[];
  participantesTotal: number;
  participantesPage: number;
  participantesTotalPages: number;
  participantesSearch: string;
  participantesProdutoStatusFiltro: "todos" | "ativos" | "inativos";
  participantesProdutoFiltro: string;
  participantesSort: { key: string; dir: "asc" | "desc" };
  setParticipantesPage: (page: number) => void;
  setParticipantesSearch: (search: string) => void;
  setParticipantesProdutoStatusFiltro: (status: "todos" | "ativos" | "inativos") => void;
  setParticipantesProdutoFiltro: (filtro: string) => void;
  setParticipantesSort: React.Dispatch<React.SetStateAction<{ key: string; dir: "asc" | "desc" }>>;
  fetchParticipantes: (
    page?: number,
    prodFiltro?: string,
    prodStatus?: "todos" | "ativos" | "inativos"
  ) => Promise<void>;
  onRefreshAll?: () => Promise<void>;
  onError: (message: string) => void;
};

export default function AdminParticipantes({
  produtos,
  participantes,
  participantesTotal,
  participantesPage,
  participantesTotalPages,
  participantesSearch,
  participantesProdutoStatusFiltro,
  participantesProdutoFiltro,
  participantesSort,
  setParticipantesPage,
  setParticipantesSearch,
  setParticipantesProdutoStatusFiltro,
  setParticipantesProdutoFiltro,
  setParticipantesSort,
  fetchParticipantes,
  onRefreshAll,
  onError,
}: Props) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [clearing, setClearing] = useState(false);

  // Relatório de Convidados para Casa 52
  const [showRelatorioModal, setShowRelatorioModal] = useState(false);
  const [relatorioProdutoId, setRelatorioProdutoId] = useState("");
  const [relatorioApenasPagos, setRelatorioApenasPagos] = useState(true);
  const [relatorioCarregando, setRelatorioCarregando] = useState(false);
  const [relatorioParticipantes, setRelatorioParticipantes] = useState<Participante[]>([]);

  // Edição de contato de participante
  const [editando, setEditando] = useState<{
    id: string;
    nome: string;
    email: string;
    telefone: string;
  } | null>(null);
  const [salvandoEdicao, setSalvandoEdicao] = useState(false);

  const produtosParaInscricoes = produtos.filter((p) => {
    if (participantesProdutoStatusFiltro === "ativos") return p.ativo;
    if (participantesProdutoStatusFiltro === "inativos") return !p.ativo;
    return true;
  });

  const carregarRelatorio = useCallback(
    async (prodId: string, apenasPagos: boolean) => {
      setRelatorioCarregando(true);
      try {
        const params = new URLSearchParams({
          all: "true",
          sort: "nome",
          dir: "asc",
        });
        if (prodId && prodId !== "todos") params.set("produtoId", prodId);
        if (apenasPagos) params.set("status", "confirmados");
        if (participantesProdutoStatusFiltro && participantesProdutoStatusFiltro !== "todos") {
          params.set("produtoStatus", participantesProdutoStatusFiltro);
        }

        const res = await fetch(`/api/admin/participantes?${params.toString()}`);
        if (res.ok) {
          const json = await res.json();
          setRelatorioParticipantes(json.data || []);
        }
      } catch (err) {
        console.error("Erro ao carregar dados do relatório:", err);
      } finally {
        setRelatorioCarregando(false);
      }
    },
    [participantesProdutoStatusFiltro]
  );

  const handleAbrirRelatorio = () => {
    const prodIdInicial = participantesProdutoFiltro || (produtos.length > 0 ? produtos[0].id : "");
    setRelatorioProdutoId(prodIdInicial);
    setShowRelatorioModal(true);
    void carregarRelatorio(prodIdInicial, relatorioApenasPagos);
  };

  const handleClear = async () => {
    setClearing(true);
    try {
      const res = await fetch("/api/admin/limpar", { method: "DELETE" });
      if (res.ok) {
        setShowConfirm(false);
        if (onRefreshAll) {
          await onRefreshAll();
        } else {
          await fetchParticipantes();
        }
      } else {
        onError("Erro ao limpar dados.");
      }
    } catch {
      onError("Erro ao limpar dados.");
    } finally {
      setClearing(false);
    }
  };

  const handleSalvarEdicao = async () => {
    if (!editando) return;
    setSalvandoEdicao(true);
    try {
      const res = await fetch(`/api/admin/participantes/${editando.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: editando.nome,
          email: editando.email,
          telefone: editando.telefone,
        }),
      });

      if (res.ok) {
        setEditando(null);
        if (onRefreshAll) {
          await onRefreshAll();
        } else {
          await fetchParticipantes();
        }
      } else {
        const data = await res.json();
        onError(data.error || "Erro ao salvar edição");
      }
    } catch {
      onError("Erro ao salvar edição");
    } finally {
      setSalvandoEdicao(false);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold text-brand-charcoal">Inscrições</h2>
          <span className="text-xs bg-brand-beige px-2 py-0.5 rounded-full text-brand-charcoal/70">
            {participantesTotal} {participantesTotal === 1 ? "inscrição" : "inscrições"}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Filtro Status do Produto */}
          <select
            value={participantesProdutoStatusFiltro}
            onChange={(e) => {
              const novoStatus = e.target.value as "todos" | "ativos" | "inativos";
              setParticipantesProdutoStatusFiltro(novoStatus);
              let novoProdFiltro = participantesProdutoFiltro;
              if (novoProdFiltro) {
                const prod = produtos.find((p) => p.id === novoProdFiltro);
                if (novoStatus === "ativos" && !prod?.ativo) novoProdFiltro = "";
                if (novoStatus === "inativos" && prod?.ativo) novoProdFiltro = "";
              }
              if (novoProdFiltro !== participantesProdutoFiltro) {
                setParticipantesProdutoFiltro(novoProdFiltro);
              }
              setParticipantesPage(1);
              void fetchParticipantes(1, novoProdFiltro, novoStatus);
            }}
            className="px-3 py-2 border border-brand-beige rounded-lg text-sm bg-white text-brand-charcoal focus-visible:ring-2 focus-visible:ring-brand-purple/30"
            aria-label="Filtrar status dos produtos em inscrições"
          >
            <option value="todos">Status: Todos</option>
            <option value="ativos">Produtos Ativos</option>
            <option value="inativos">Produtos Inativos</option>
          </select>

          {/* Filtro por Produto */}
          <select
            value={participantesProdutoFiltro}
            onChange={(e) => {
              const novoFiltro = e.target.value;
              setParticipantesProdutoFiltro(novoFiltro);
              setParticipantesPage(1);
              void fetchParticipantes(1, novoFiltro, participantesProdutoStatusFiltro);
            }}
            className="px-3 py-2 border border-brand-beige rounded-lg text-sm bg-white text-brand-charcoal focus-visible:ring-2 focus-visible:ring-brand-purple/30 max-w-[200px] truncate"
            aria-label="Filtrar por produto"
          >
            <option value="">Todos os produtos</option>
            {produtosParaInscricoes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}{!p.ativo ? " (Inativo)" : ""}
              </option>
            ))}
          </select>

          {/* Campo de Busca */}
          <div className="w-full sm:w-56">
            <input
              type="search"
              placeholder="Buscar por nome, e-mail…"
              value={participantesSearch}
              onChange={(e) => {
                setParticipantesSearch(e.target.value);
                setParticipantesPage(1);
                fetchParticipantes(1);
              }}
              className="w-full px-3 py-2 border border-brand-beige rounded-lg text-sm bg-white focus-visible:ring-2 focus-visible:ring-brand-purple/30"
              aria-label="Buscar inscrições"
            />
          </div>

          {/* Botão Gerar Relatório / Lista de Convidados */}
          <button
            type="button"
            onClick={handleAbrirRelatorio}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-brand-purple text-white rounded-lg text-sm font-medium hover:bg-brand-purple/90 transition-colors shadow-xs cursor-pointer"
            title="Gerar lista de convidados para impressão ou PDF"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Lista de Convidados (PDF)</span>
          </button>
        </div>
      </div>

      <div className="sm:hidden space-y-3">
        {participantes.length === 0 ? (
          <div className="bg-white rounded-xl border border-brand-beige p-8 text-center text-brand-charcoal/40 text-sm">
            Nenhum participante cadastrado.
          </div>
        ) : (
          participantes.map((p) => (
            <div key={p.id} className="bg-white rounded-xl border border-brand-beige p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium text-brand-charcoal text-sm">{p.nome}</p>
                  <p className="text-xs font-mono text-brand-charcoal/70">CPF: {formatCPF(p.cpf)}</p>
                  <p className="text-xs text-brand-charcoal/40 mt-0.5 flex items-center gap-1">
                    <span>{p.turma_id} · {p.produto || "—"}</span>
                    {p.produto_ativo === false && (
                      <span className="text-[10px] bg-red-100 text-red-600 px-1 py-0.2 rounded font-normal">Inativo</span>
                    )}
                  </p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  p.status === "pago" ? "bg-green-100 text-green-700" :
                  p.status === "pendente" ? "bg-yellow-100 text-yellow-700" :
                  "bg-gray-100 text-gray-600"
                }`}>
                  {p.status}
                </span>
              </div>
              <div className="space-y-1 text-xs text-brand-charcoal/60">
                <p className="truncate">{p.email}</p>
                {p.telefone ? (
                  <a
                    href={`https://wa.me/${p.telefone.replace(/\D/g, "").replace(/^0+/, "").replace(/^(55)?/, "55")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-brand-purple hover:underline"
                  >
                    {p.telefone}
                  </a>
                ) : <p className="font-mono">—</p>}
                {p.motivacao && <p className="text-brand-charcoal/50 line-clamp-2 mt-1">&ldquo;{p.motivacao}&rdquo;</p>}
                <p className="text-brand-charcoal/40 pt-1">{formatDate(p.created_at)}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="hidden sm:block bg-white rounded-xl border border-brand-beige overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brand-beige/50 border-b border-brand-beige">
                <th className="text-left px-4 py-3">
                  <SortableHeader
                    key="nome"
                    currentSort={participantesSort}
                    onSort={(k) => {
                      setParticipantesSort((s) => (s.key === k ? { key: k, dir: s.dir === "asc" ? "desc" : "asc" } : { key: k, dir: "asc" }));
                      fetchParticipantes(1);
                    }}
                  >
                    Nome
                  </SortableHeader>
                </th>
                <th className="text-left px-4 py-3 font-medium text-brand-charcoal/70">CPF</th>
                <th className="text-left px-4 py-3">
                  <SortableHeader
                    key="email"
                    currentSort={participantesSort}
                    onSort={(k) => {
                      setParticipantesSort((s) => (s.key === k ? { key: k, dir: s.dir === "asc" ? "desc" : "asc" } : { key: k, dir: "asc" }));
                      fetchParticipantes(1);
                    }}
                  >
                    E-mail
                  </SortableHeader>
                </th>
                <th className="text-left px-4 py-3 font-medium text-brand-charcoal/70">WhatsApp</th>
                <th className="text-left px-4 py-3 font-medium text-brand-charcoal/70">Produto</th>
                <th className="text-left px-4 py-3 font-medium text-brand-charcoal/70 hidden md:table-cell">Motivação</th>
                <th className="text-left px-4 py-3 font-medium text-brand-charcoal/70 hidden lg:table-cell">Pagamento</th>
                <th className="text-left px-4 py-3">
                  <SortableHeader
                    key="status"
                    currentSort={participantesSort}
                    onSort={(k) => {
                      setParticipantesSort((s) => (s.key === k ? { key: k, dir: s.dir === "asc" ? "desc" : "asc" } : { key: k, dir: "asc" }));
                      fetchParticipantes(1);
                    }}
                  >
                    Status
                  </SortableHeader>
                </th>
                <th className="text-left px-4 py-3">
                  <SortableHeader
                    key="created_at"
                    currentSort={participantesSort}
                    onSort={(k) => {
                      setParticipantesSort((s) => (s.key === k ? { key: k, dir: s.dir === "asc" ? "desc" : "asc" } : { key: k, dir: "asc" }));
                      fetchParticipantes(1);
                    }}
                  >
                    Data
                  </SortableHeader>
                </th>
                <th className="text-left px-4 py-3 font-medium text-brand-charcoal/70">Ações</th>
              </tr>
            </thead>
            <tbody>
              {participantes.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-12 text-brand-charcoal/40">
                    Nenhum participante cadastrado.
                  </td>
                </tr>
              ) : (
                participantes.map((p) => (
                  <tr key={p.id} className="border-b border-brand-beige/50 hover:bg-brand-beige/30 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-medium text-brand-charcoal">{p.nome}</span>
                      <span className="text-xs text-brand-charcoal/40 block">{p.turma_id}</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-brand-charcoal/80 whitespace-nowrap">
                      {formatCPF(p.cpf)}
                    </td>
                    <td className="px-4 py-3 text-brand-charcoal/70">{p.email}</td>
                    <td className="px-4 py-3 font-mono text-xs">
                      {p.telefone ? (
                        <a
                          href={`https://wa.me/${p.telefone.replace(/\D/g, "").replace(/^0+/, "").replace(/^(55)?/, "55")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-purple hover:underline"
                        >
                          {p.telefone}
                        </a>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-3 text-brand-charcoal/70 text-xs">
                      <div className="flex items-center gap-1">
                        <span>{p.produto || "—"}</span>
                        {p.produto_ativo === false && (
                          <span className="text-[10px] bg-red-100 text-red-600 px-1 py-0.2 rounded font-normal">Inativo</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-brand-charcoal/60 text-xs max-w-[200px] truncate hidden md:table-cell">
                      {p.motivacao || "—"}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-xs bg-brand-beige px-2 py-0.5 rounded-full text-brand-charcoal/70">
                        {p.metodo_pagamento?.toUpperCase() || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        p.status === "pago" ? "bg-green-100 text-green-700" :
                        p.status === "pendente" ? "bg-yellow-100 text-yellow-700" :
                        "bg-gray-100 text-gray-600"
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-brand-charcoal/50 text-xs hidden sm:table-cell">{formatDate(p.created_at)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setEditando({
                          id: p.id,
                          nome: p.nome,
                          email: p.email,
                          telefone: p.telefone || "",
                        })}
                        className="px-3 py-1.5 text-xs text-brand-charcoal/70 hover:bg-brand-beige rounded-lg border border-brand-beige transition-colors cursor-pointer"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {participantesTotalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm">
          <span className="text-brand-charcoal/50">
            {participantesTotal} participantes — página {participantesPage} de {participantesTotalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => fetchParticipantes(participantesPage - 1)}
              disabled={participantesPage <= 1}
              className="px-3 py-1.5 rounded-lg border border-brand-beige text-brand-charcoal/70 hover:bg-brand-beige/50 disabled:opacity-40 transition-colors"
            >
              Anterior
            </button>
            <button
              onClick={() => fetchParticipantes(participantesPage + 1)}
              disabled={participantesPage >= participantesTotalPages}
              className="px-3 py-1.5 rounded-lg border border-brand-beige text-brand-charcoal/70 hover:bg-brand-beige/50 disabled:opacity-40 transition-colors"
            >
              Próxima
            </button>
          </div>
        </div>
      )}

      {participantesTotal > 0 && (
        <div className="mt-8 border-t border-brand-beige pt-6">
          <h2 className="text-sm font-medium text-red-700 mb-2">Zona de risco</h2>
          <p className="text-xs text-brand-charcoal/50 mb-3">
            Remove todos os participantes. Use após cada evento.
          </p>
          <button
            onClick={() => setShowConfirm(true)}
            className="bg-red-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
          >
            Limpar banco de dados
          </button>
        </div>
      )}

      {/* Modal de edição de contato do participante */}
      {editando && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          style={{ overscrollBehavior: "contain" }}
          role="dialog"
          aria-modal="true"
          aria-label="Editar contato"
          onKeyDown={(e) => {
            if (e.key === "Escape") setEditando(null);
          }}
        >
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-base font-semibold text-brand-charcoal mb-1">
              Editar participante
            </h3>
            <p className="text-xs text-brand-charcoal/50 mb-4">
              Atualize os dados de contato.
            </p>
            <div className="space-y-3 mb-5">
              <div>
                <label className="text-xs font-medium text-brand-charcoal/70 block mb-1">Nome</label>
                <input
                  type="text"
                  value={editando.nome}
                  onChange={(e) => setEditando({ ...editando, nome: e.target.value })}
                  className="w-full border border-brand-beige rounded-lg px-3 py-2 text-sm focus-visible:border-brand-purple"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-brand-charcoal/70 block mb-1">E-mail</label>
                <input
                  type="email"
                  value={editando.email}
                  onChange={(e) => setEditando({ ...editando, email: e.target.value })}
                  className="w-full border border-brand-beige rounded-lg px-3 py-2 text-sm focus-visible:border-brand-purple"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-brand-charcoal/70 block mb-1">WhatsApp</label>
                <input
                  type="text"
                  value={editando.telefone}
                  onChange={(e) => setEditando({ ...editando, telefone: e.target.value })}
                  className="w-full border border-brand-beige rounded-lg px-3 py-2 text-sm focus-visible:border-brand-purple"
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setEditando(null)}
                className="px-4 py-2 text-sm text-brand-charcoal/60 hover:text-brand-charcoal transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSalvarEdicao}
                disabled={salvandoEdicao || !editando.nome.trim() || !editando.email.trim()}
                className="px-4 py-2 text-sm bg-brand-purple text-white rounded-lg hover:bg-brand-purple-dark disabled:opacity-50 transition-colors cursor-pointer"
              >
                {salvandoEdicao ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmação de limpeza */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          style={{ overscrollBehavior: "contain" }}
          role="dialog"
          aria-modal="true"
          aria-label="Confirmar limpeza"
          onKeyDown={(e) => {
            if (e.key === "Escape") setShowConfirm(false);
          }}
        >
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-base font-semibold text-brand-charcoal mb-2">Limpar todos os dados?</h3>
            <p className="text-sm text-brand-charcoal/60 mb-5">
              Todos os {participantesTotal} participantes serão removidos permanentemente.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-sm text-brand-charcoal/60 hover:text-brand-charcoal transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleClear}
                disabled={clearing}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors cursor-pointer"
              >
                {clearing ? "Limpando..." : "Sim, limpar tudo"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal / Visualização de Relatório - Lista de Convidados Casa 52 */}
      {showRelatorioModal && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 print:p-0 print:bg-white print:static print:inset-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Lista de convidados para Casa 52"
          onKeyDown={(e) => {
            if (e.key === "Escape") setShowRelatorioModal(false);
          }}
        >
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-brand-beige overflow-hidden print:border-none print:shadow-none print:max-w-none print:max-h-none print:w-full print:rounded-none">
            {/* Barra de Ações do Modal (oculta na impressão) */}
            <div className="no-print p-4 border-b border-brand-beige bg-brand-beige-light/70 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">📄</span>
                <div>
                  <h3 className="text-sm font-bold text-brand-charcoal">Lista de Convidados · Casa 52</h3>
                  <p className="text-xs text-brand-charcoal/60">Controle de entrada e recepção dos participantes</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Selecionar Produto dentro do modal */}
                <select
                  value={relatorioProdutoId}
                  onChange={(e) => {
                    const newId = e.target.value;
                    setRelatorioProdutoId(newId);
                    void carregarRelatorio(newId, relatorioApenasPagos);
                  }}
                  className="px-2.5 py-1.5 border border-brand-beige rounded-lg text-xs bg-white font-medium text-brand-charcoal focus-visible:ring-2 focus-visible:ring-brand-purple/30 max-w-[180px] truncate"
                  aria-label="Filtrar por produto no relatório"
                >
                  <option value="">Todos os produtos</option>
                  {produtos.map((prod) => (
                    <option key={prod.id} value={prod.id}>
                      {prod.nome}
                    </option>
                  ))}
                </select>

                {/* Toggle Apenas Pagos */}
                <label className="flex items-center gap-1.5 text-xs text-brand-charcoal cursor-pointer bg-white px-2.5 py-1.5 rounded-lg border border-brand-beige select-none">
                  <input
                    type="checkbox"
                    checked={relatorioApenasPagos}
                    onChange={(e) => {
                      const novoVal = e.target.checked;
                      setRelatorioApenasPagos(novoVal);
                      void carregarRelatorio(relatorioProdutoId, novoVal);
                    }}
                    className="rounded text-brand-purple focus:ring-brand-purple"
                  />
                  <span>Apenas confirmados</span>
                </label>

                {/* Botão Imprimir / Salvar em PDF */}
                <button
                  type="button"
                  onClick={() => window.print()}
                  disabled={relatorioCarregando || relatorioParticipantes.length === 0}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-purple text-white rounded-lg text-xs font-semibold hover:bg-brand-purple/90 transition-colors disabled:opacity-50 shadow-xs cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  <span>Imprimir / PDF</span>
                </button>

                {/* Fechar */}
                <button
                  type="button"
                  onClick={() => setShowRelatorioModal(false)}
                  className="px-3 py-1.5 border border-brand-beige hover:bg-brand-beige/30 rounded-lg text-xs font-medium text-brand-charcoal transition-colors cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            </div>

            {/* Visualização da Folha / Conteúdo Impresso */}
            <div className="overflow-y-auto p-6 print:p-0 print:overflow-visible flex-1 bg-neutral-100/60 print:bg-white">
              <div
                id="relatorio-impressao"
                className="bg-white text-black p-8 rounded-xl shadow-xs border border-gray-200 print:shadow-none print:border-none print:p-0 max-w-3xl mx-auto print:max-w-none print:w-full"
              >
                {/* Cabeçalho Oficial Conforme Requisitos */}
                <div className="border-b-2 border-black pb-4 mb-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-2xl font-bold tracking-tight text-black uppercase">
                        Lista de convidados para Casa 52
                      </h1>
                    </div>
                    <div className="text-right text-xs text-gray-500 font-mono">
                      <p>Emissão: {new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                  </div>

                  {/* Total de Convidados */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-300 text-xs">
                    <div>
                      <span className="text-gray-500">Total de Convidados: </span>
                      <strong className="font-bold text-sm text-black">
                        {relatorioParticipantes.length} {relatorioParticipantes.length === 1 ? "pessoa" : "pessoas"}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Tabela de Convidados com Nome e Sobrenome + CPF */}
                {relatorioCarregando ? (
                  <div className="text-center py-12 text-gray-400 text-sm">Carregando convidados...</div>
                ) : relatorioParticipantes.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 text-sm border border-dashed border-gray-300 rounded-lg">
                    Nenhum participante encontrado para este filtro.
                  </div>
                ) : (
                  <div className="border border-black overflow-hidden">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-100 border-b border-black text-black">
                          <th className="py-2.5 px-2 w-12 text-center font-bold border-r border-black">#</th>
                          <th className="py-2.5 px-3 font-bold border-r border-black">Nome e Sobrenome</th>
                          <th className="py-2.5 px-3 w-44 font-bold border-r border-black">CPF</th>
                          <th className="py-2.5 px-3 w-64 text-center font-bold">Observação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-300">
                        {relatorioParticipantes.map((part, idx) => (
                          <tr key={part.id} className="hover:bg-gray-50 print:hover:bg-transparent">
                            <td className="py-2.5 px-2 text-center text-gray-500 font-mono border-r border-gray-300">
                              {String(idx + 1).padStart(2, "0")}
                            </td>
                            <td className="py-2.5 px-3 font-semibold text-black border-r border-gray-300">
                              {part.nome}
                            </td>
                            <td className="py-2.5 px-3 font-mono text-black whitespace-nowrap border-r border-gray-300">
                              {formatCPF(part.cpf)}
                            </td>
                            <td className="py-2.5 px-3 border-gray-300">
                              <div className="h-6 flex items-end justify-center">
                                <span className="w-full border-b border-gray-300 block"></span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Rodapé da folha impressa */}
                <div className="mt-6 pt-3 border-t border-gray-300 flex justify-between items-center text-[10px] text-gray-500">
                  <span>Casa 52</span>
                  <span>Lista oficial de convidados para entrada</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
