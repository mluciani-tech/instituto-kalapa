"use client";

import { useState, Fragment } from "react";
import type { Pedido, Produto } from "@/lib/types";
import { formatDate } from "../lib/format";
import SortableHeader from "./ui/SortableHeader";

type Props = {
  produtos: Produto[];
  pedidos: Pedido[];
  pedidosTotal: number;
  pedidosTotaisStatus: { todos: number; pago: number; pendente: number; cancelado: number };
  pedidosPage: number;
  pedidosTotalPages: number;
  pedidosSearch: string;
  pedidosStatusFiltro: "todos" | "pago" | "pendente" | "cancelado";
  pedidosProdutoStatusFiltro: "todos" | "ativos" | "inativos";
  pedidosProdutoFiltro: string;
  pedidosSort: { key: string; dir: "asc" | "desc" };
  setPedidosPage: (page: number) => void;
  setPedidosSearch: (search: string) => void;
  setPedidosStatusFiltro: (status: "todos" | "pago" | "pendente" | "cancelado") => void;
  setPedidosProdutoStatusFiltro: (status: "todos" | "ativos" | "inativos") => void;
  setPedidosProdutoFiltro: (filtro: string) => void;
  setPedidosSort: React.Dispatch<React.SetStateAction<{ key: string; dir: "asc" | "desc" }>>;
  fetchPedidos: (
    page?: number,
    prodStatus?: "todos" | "ativos" | "inativos",
    prodId?: string,
    statusFiltro?: "todos" | "pago" | "pendente" | "cancelado"
  ) => Promise<void>;
  onRefreshAll?: () => Promise<void>;
  onError: (message: string) => void;
};

export default function AdminPedidos({
  produtos,
  pedidos,
  pedidosTotal,
  pedidosTotaisStatus,
  pedidosPage,
  pedidosTotalPages,
  pedidosSearch,
  pedidosStatusFiltro,
  pedidosProdutoStatusFiltro,
  pedidosProdutoFiltro,
  pedidosSort,
  setPedidosPage,
  setPedidosSearch,
  setPedidosStatusFiltro,
  setPedidosProdutoStatusFiltro,
  setPedidosProdutoFiltro,
  setPedidosSort,
  fetchPedidos,
  onRefreshAll,
  onError,
}: Props) {
  const [pedidoExpandidoId, setPedidoExpandidoId] = useState<string | null>(null);
  const [pedidoParaExcluir, setPedidoParaExcluir] = useState<string | null>(null);
  const [excluindoPedido, setExcluindoPedido] = useState(false);
  const [editando, setEditando] = useState<{
    id: string;
    nome: string;
    email: string;
    telefone: string;
  } | null>(null);
  const [salvandoEdicao, setSalvandoEdicao] = useState(false);

  const produtosParaPedidos = produtos.filter((p) => {
    if (pedidosProdutoStatusFiltro === "ativos") return p.ativo;
    if (pedidosProdutoStatusFiltro === "inativos") return !p.ativo;
    return true;
  });

  const handleSalvarEdicao = async () => {
    if (!editando) return;
    setSalvandoEdicao(true);
    try {
      const res = await fetch(`/api/admin/pedidos/${editando.id}`, {
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
          await fetchPedidos();
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

  const handleExcluirPedido = async () => {
    if (!pedidoParaExcluir) return;
    setExcluindoPedido(true);
    try {
      const res = await fetch(`/api/admin/pedidos/${pedidoParaExcluir}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setPedidoParaExcluir(null);
        if (onRefreshAll) {
          await onRefreshAll();
        } else {
          await fetchPedidos();
        }
      } else {
        const data = await res.json();
        onError(data.error || "Erro ao excluir pedido");
      }
    } catch {
      onError("Erro ao excluir pedido");
    } finally {
      setExcluindoPedido(false);
    }
  };

  return (
    <>
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-semibold text-brand-charcoal">Pedidos</h2>
            <span className="text-xs bg-brand-beige px-2 py-0.5 rounded-full text-brand-charcoal/70">
              {pedidosTotal} {pedidosTotal === 1 ? "pedido" : "pedidos"}
            </span>
            {pedidosTotaisStatus.todos > 0 && (
              <div className="flex items-center gap-1.5 text-[11px] ml-1">
                <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200 font-medium">
                  {pedidosTotaisStatus.pago} pagos
                </span>
                {pedidosTotaisStatus.pendente > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200 font-medium">
                    {pedidosTotaisStatus.pendente} pendente
                  </span>
                )}
                {pedidosTotaisStatus.cancelado > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 font-medium">
                    {pedidosTotaisStatus.cancelado} cancelado
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {/* Filtro Status de Pagamento */}
            <select
              value={pedidosStatusFiltro}
              onChange={(e) => {
                const novoStatus = e.target.value as "todos" | "pago" | "pendente" | "cancelado";
                setPedidosStatusFiltro(novoStatus);
                setPedidosPage(1);
                void fetchPedidos(1, pedidosProdutoStatusFiltro, pedidosProdutoFiltro, novoStatus);
              }}
              className="px-3 py-2 border border-brand-beige rounded-lg text-sm bg-white text-brand-charcoal font-medium focus-visible:ring-2 focus-visible:ring-brand-purple/30"
              aria-label="Filtrar status do pagamento dos pedidos"
            >
              <option value="todos">Status: Todos ({pedidosTotaisStatus.todos || pedidosTotal})</option>
              <option value="pago">Apenas Pagos ({pedidosTotaisStatus.pago})</option>
              <option value="pendente">Apenas Pendentes ({pedidosTotaisStatus.pendente})</option>
              <option value="cancelado">Apenas Cancelados ({pedidosTotaisStatus.cancelado})</option>
            </select>

            {/* Filtro Status do Produto */}
            <select
              value={pedidosProdutoStatusFiltro}
              onChange={(e) => {
                const novoStatus = e.target.value as "todos" | "ativos" | "inativos";
                setPedidosProdutoStatusFiltro(novoStatus);
                let novoProdFiltro = pedidosProdutoFiltro;
                if (novoProdFiltro) {
                  const prod = produtos.find((p) => p.id === novoProdFiltro);
                  if (novoStatus === "ativos" && !prod?.ativo) novoProdFiltro = "";
                  if (novoStatus === "inativos" && prod?.ativo) novoProdFiltro = "";
                }
                if (novoProdFiltro !== pedidosProdutoFiltro) {
                  setPedidosProdutoFiltro(novoProdFiltro);
                }
                setPedidosPage(1);
                void fetchPedidos(1, novoStatus, novoProdFiltro, pedidosStatusFiltro);
              }}
              className="px-3 py-2 border border-brand-beige rounded-lg text-sm bg-white text-brand-charcoal focus-visible:ring-2 focus-visible:ring-brand-purple/30"
              aria-label="Filtrar status dos produtos em pedidos"
            >
              <option value="todos">Produtos: Todos</option>
              <option value="ativos">Produtos Ativos</option>
              <option value="inativos">Produtos Inativos</option>
            </select>

            {/* Filtro por Produto Específico */}
            <select
              value={pedidosProdutoFiltro}
              onChange={(e) => {
                const novoFiltro = e.target.value;
                setPedidosProdutoFiltro(novoFiltro);
                setPedidosPage(1);
                void fetchPedidos(1, pedidosProdutoStatusFiltro, novoFiltro, pedidosStatusFiltro);
              }}
              className="px-3 py-2 border border-brand-beige rounded-lg text-sm bg-white text-brand-charcoal focus-visible:ring-2 focus-visible:ring-brand-purple/30 max-w-[200px] truncate"
              aria-label="Filtrar por produto"
            >
              <option value="">Todos os produtos</option>
              {produtosParaPedidos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}{!p.ativo ? " (Inativo)" : ""}
                </option>
              ))}
            </select>

            {/* Campo de Busca */}
            <div className="w-full sm:w-56">
              <input
                type="search"
                placeholder="Buscar por nome, e-mail, NSU…"
                value={pedidosSearch}
                onChange={(e) => {
                  setPedidosSearch(e.target.value);
                  setPedidosPage(1);
                  fetchPedidos(1);
                }}
                className="w-full px-3 py-2 border border-brand-beige rounded-lg text-sm bg-white focus-visible:ring-2 focus-visible:ring-brand-purple/30"
                aria-label="Buscar pedidos"
              />
            </div>
          </div>
        </div>
        {pedidos.length === 0 ? (
          <div className="bg-white rounded-xl border border-brand-beige p-8 text-center text-brand-charcoal/40 text-sm">
            Nenhum pedido realizado.
          </div>
        ) : (
          <>
            {/* Cards mobile */}
            <div className="sm:hidden space-y-3">
              {pedidos.map((ped) => (
                <div key={ped.id} className="bg-white rounded-xl border border-brand-beige p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-brand-charcoal text-sm">
                        {ped.cliente_nome}{ped.cliente_telefone ? ` · ${ped.cliente_telefone}` : ""}
                      </p>
                      <p className="text-xs text-brand-charcoal/40 flex items-center gap-1">
                        <span>{ped.produtos?.nome || "—"}</span>
                        {ped.produtos && ped.produtos.ativo === false && (
                          <span className="text-[10px] bg-red-100 text-red-600 px-1 py-0.2 rounded font-normal">Inativo</span>
                        )}
                      </p>
                      {Array.isArray(ped.beneficiarios) && ped.beneficiarios.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setPedidoExpandidoId(pedidoExpandidoId === ped.id ? null : ped.id)}
                          className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-brand-purple/10 text-brand-purple hover:bg-brand-purple/20 transition-colors"
                        >
                          <span>👥 +{ped.beneficiarios.length} acompanhante{ped.beneficiarios.length > 1 ? "s" : ""}</span>
                          <span className="text-[9px] opacity-70">
                            {pedidoExpandidoId === ped.id ? "▲" : "▼"}
                          </span>
                        </button>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      ped.status === "pago" ? "bg-green-100 text-green-700" :
                      ped.status === "pendente" ? "bg-yellow-100 text-yellow-700" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                      {ped.status}
                    </span>
                  </div>

                  {/* Lista de Acompanhantes expandida no mobile */}
                  {Array.isArray(ped.beneficiarios) && ped.beneficiarios.length > 0 && pedidoExpandidoId === ped.id && (
                    <div className="mb-3 p-3 bg-brand-offwhite rounded-xl border border-brand-beige space-y-2 text-xs">
                      <p className="font-bold text-brand-purple uppercase tracking-wider text-[10px]">
                        Participantes Adicionais ({ped.beneficiarios.length})
                      </p>
                      {ped.beneficiarios.map((ben, bIdx) => (
                        <div key={bIdx} className="pb-2 border-b border-brand-beige/70 last:border-0 last:pb-0">
                          <p className="font-semibold text-brand-charcoal">{ben.nome}</p>
                          <p className="text-brand-charcoal/60">{ben.email}</p>
                          <a
                            href={`https://wa.me/${ben.telefone.replace(/\D/g, "").replace(/^0+/, "").replace(/^(55)?/, "55")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-purple font-medium hover:underline inline-block mt-0.5"
                          >
                            WhatsApp: {ben.telefone}
                          </a>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="space-y-1 text-xs text-brand-charcoal/60">
                    <p>{ped.cliente_email}</p>
                    {ped.motivacao && <p className="text-brand-charcoal/50 line-clamp-2">&ldquo;{ped.motivacao}&rdquo;</p>}
                    <p className="font-semibold text-brand-charcoal">
                      R$ {ped.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                    <p className="font-mono text-brand-charcoal/40">{ped.order_nsu}</p>
                    <p className="text-brand-charcoal/40">{formatDate(ped.created_at)}</p>
                    {ped.status === "pendente" && (
                      <button
                        onClick={() => setPedidoParaExcluir(ped.id)}
                        className="mt-2 text-xs text-red-600 hover:underline block cursor-pointer"
                      >
                        Excluir transação
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {/* Tabela desktop */}
            <div className="hidden sm:block bg-white rounded-xl border border-brand-beige overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-brand-beige/50 border-b border-brand-beige">
                      <th className="text-left px-4 py-3">
                        <SortableHeader
                          key="cliente_nome"
                          currentSort={pedidosSort}
                          onSort={(k) => {
                            setPedidosSort((s) => (s.key === k ? { key: k, dir: s.dir === "asc" ? "desc" : "asc" } : { key: k, dir: "asc" }));
                            fetchPedidos(1);
                          }}
                        >
                          Cliente
                        </SortableHeader>
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-brand-charcoal/70">Produto</th>
                      <th className="text-left px-4 py-3">
                        <SortableHeader
                          key="valor"
                          currentSort={pedidosSort}
                          onSort={(k) => {
                            setPedidosSort((s) => (s.key === k ? { key: k, dir: s.dir === "asc" ? "desc" : "asc" } : { key: k, dir: "asc" }));
                            fetchPedidos(1);
                          }}
                        >
                          Valor
                        </SortableHeader>
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-brand-charcoal/70">Motivação</th>
                      <th className="text-left px-4 py-3">
                        <SortableHeader
                          key="status"
                          currentSort={pedidosSort}
                          onSort={(k) => {
                            setPedidosSort((s) => (s.key === k ? { key: k, dir: s.dir === "asc" ? "desc" : "asc" } : { key: k, dir: "asc" }));
                            fetchPedidos(1);
                          }}
                        >
                          Status
                        </SortableHeader>
                      </th>
                      <th className="text-left px-4 py-3">
                        <SortableHeader
                          key="created_at"
                          currentSort={pedidosSort}
                          onSort={(k) => {
                            setPedidosSort((s) => (s.key === k ? { key: k, dir: s.dir === "asc" ? "desc" : "asc" } : { key: k, dir: "asc" }));
                            fetchPedidos(1);
                          }}
                        >
                          Data
                        </SortableHeader>
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-brand-charcoal/70">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedidos.map((ped) => (
                      <Fragment key={ped.id}>
                        <tr className="border-b border-brand-beige/50 hover:bg-brand-beige/30 transition-colors">
                          <td className="px-4 py-3">
                            <span className="font-medium text-brand-charcoal">
                              {ped.cliente_nome}{ped.cliente_telefone ? (
                                <>
                                  {" · "}
                                  <a
                                    href={`https://wa.me/${ped.cliente_telefone.replace(/\D/g, "").replace(/^0+/, "").replace(/^(55)?/, "55")}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-brand-purple hover:underline"
                                  >
                                    {ped.cliente_telefone}
                                  </a>
                                </>
                              ) : ""}
                            </span>
                            <span className="text-xs text-brand-charcoal/40 block">{ped.cliente_email}</span>

                            {/* Badge de acompanhantes */}
                            {Array.isArray(ped.beneficiarios) && ped.beneficiarios.length > 0 && (
                              <button
                                type="button"
                                onClick={() => setPedidoExpandidoId(pedidoExpandidoId === ped.id ? null : ped.id)}
                                className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-brand-purple/10 text-brand-purple hover:bg-brand-purple/20 transition-colors cursor-pointer"
                                title="Clique para ver os dados dos acompanhantes"
                              >
                                <span>👥 +{ped.beneficiarios.length} acompanhante{ped.beneficiarios.length > 1 ? "s" : ""}</span>
                                <span className="text-[9px] opacity-70">
                                  {pedidoExpandidoId === ped.id ? "▲" : "▼"}
                                </span>
                              </button>
                            )}
                          </td>
                          <td className="px-4 py-3 text-brand-charcoal/70">
                            <div className="flex items-center gap-1">
                              <span>{ped.produtos?.nome || "—"}</span>
                              {ped.produtos && ped.produtos.ativo === false && (
                                <span className="text-[10px] bg-red-100 text-red-600 px-1 py-0.2 rounded font-normal">Inativo</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 font-semibold text-brand-charcoal">
                            R$ {ped.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </td>
                          <td className="px-4 py-3 text-brand-charcoal/60 text-xs max-w-[180px] truncate">{ped.motivacao || "—"}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              ped.status === "pago" ? "bg-green-100 text-green-700" :
                              ped.status === "pendente" ? "bg-yellow-100 text-yellow-700" :
                              "bg-gray-100 text-gray-600"
                            }`}>
                              {ped.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-brand-charcoal/50 text-xs">{formatDate(ped.created_at)}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => setEditando({
                                  id: ped.id,
                                  nome: ped.cliente_nome,
                                  email: ped.cliente_email,
                                  telefone: ped.cliente_telefone || "",
                                })}
                                className="px-3 py-1.5 text-xs text-brand-charcoal/70 hover:bg-brand-beige rounded-lg border border-brand-beige transition-colors cursor-pointer"
                              >
                                Editar
                              </button>
                              {ped.status === "pendente" && (
                                <button
                                  onClick={() => setPedidoParaExcluir(ped.id)}
                                  className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors cursor-pointer"
                                >
                                  Excluir
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>

                        {/* Linha expandida de participantes adicionais */}
                        {Array.isArray(ped.beneficiarios) && ped.beneficiarios.length > 0 && pedidoExpandidoId === ped.id && (
                          <tr className="bg-brand-purple/5 border-b border-brand-beige">
                            <td colSpan={7} className="px-6 py-4">
                              <div className="bg-white rounded-xl p-4 border border-brand-purple/20 shadow-xs">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-purple mb-2 flex items-center gap-1.5">
                                  <span>👥 Participantes Adicionais vinculados a este pedido ({ped.beneficiarios.length})</span>
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                  {ped.beneficiarios.map((ben, bIdx) => (
                                    <div key={bIdx} className="p-3 rounded-lg bg-brand-offwhite border border-brand-beige/80 text-xs">
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="font-bold text-brand-charcoal">{ben.nome}</span>
                                        <span className="text-[10px] bg-brand-purple/10 text-brand-purple px-1.5 py-0.5 rounded font-medium">
                                          Acompanhante {bIdx + 1}
                                        </span>
                                      </div>
                                      <p className="text-brand-charcoal/60 truncate">{ben.email}</p>
                                      <div className="mt-1.5 pt-1.5 border-t border-brand-beige flex items-center justify-between">
                                        <span className="text-brand-charcoal/50 text-[11px]">WhatsApp:</span>
                                        <a
                                          href={`https://wa.me/${ben.telefone.replace(/\D/g, "").replace(/^0+/, "").replace(/^(55)?/, "55")}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-brand-purple font-semibold hover:underline"
                                        >
                                          {ben.telefone}
                                        </a>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {pedidosTotalPages > 1 && (
              <div className="flex items-center justify-between mt-4 text-sm">
                <span className="text-brand-charcoal/50">
                  {pedidosTotal} pedidos — página {pedidosPage} de {pedidosTotalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => fetchPedidos(pedidosPage - 1)}
                    disabled={pedidosPage <= 1}
                    className="px-3 py-1.5 rounded-lg border border-brand-beige text-brand-charcoal/70 hover:bg-brand-beige/50 disabled:opacity-40 transition-colors"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => fetchPedidos(pedidosPage + 1)}
                    disabled={pedidosPage >= pedidosTotalPages}
                    className="px-3 py-1.5 rounded-lg border border-brand-beige text-brand-charcoal/70 hover:bg-brand-beige/50 disabled:opacity-40 transition-colors"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de edição de contato do pedido */}
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
              Editar cliente
            </h3>
            <p className="text-xs text-brand-charcoal/50 mb-4">
              Atualize os dados de contato. Compras novas capturam automaticamente da InfinitePay.
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

      {/* Modal de confirmação de exclusão de pedido */}
      {pedidoParaExcluir && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          style={{ overscrollBehavior: "contain" }}
          role="dialog"
          aria-modal="true"
          aria-label="Confirmar exclusão"
          onKeyDown={(e) => {
            if (e.key === "Escape") setPedidoParaExcluir(null);
          }}
        >
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-base font-semibold text-brand-charcoal mb-2">Excluir transação pendente?</h3>
            <p className="text-sm text-brand-charcoal/60 mb-5">
              Esta ação excluirá permanentemente o pedido e quaisquer inscrições associadas. Deseja continuar?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setPedidoParaExcluir(null)}
                className="px-4 py-2 text-sm text-brand-charcoal/60 hover:text-brand-charcoal transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleExcluirPedido}
                disabled={excluindoPedido}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors cursor-pointer"
              >
                {excluindoPedido ? "Excluindo..." : "Excluir permanentemente"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
