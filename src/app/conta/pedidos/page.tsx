"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, Package, Loader2, XCircle } from "lucide-react";
import type { Pedido, Usuario } from "@/lib/types";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(iso));
}

export default function MeusPedidosPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelandoId, setCancelandoId] = useState<string | null>(null);

  const fetchPedidos = useCallback(async () => {
    try {
      const authRes = await fetch("/api/auth/me");
      if (!authRes.ok) {
        router.push("/login?redirect=/conta/pedidos");
        return;
      }
      const authData = await authRes.json();
      if (!authData.authenticated || !authData.usuario) {
        router.push("/login?redirect=/conta/pedidos");
        return;
      }
      setUsuario(authData.usuario);

      const pedidosRes = await fetch("/api/cliente/pedidos");
      if (pedidosRes.ok) {
        const data = await pedidosRes.json();
        setPedidos(data);
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }, [router]);

  useEffect(() => {
    fetchPedidos();
  }, [fetchPedidos]);

  const handleCancelarPedido = async (id: string) => {
    if (!confirm("Deseja realmente cancelar este pedido pendente?")) return;
    setCancelandoId(id);
    try {
      const res = await fetch(`/api/cliente/pedidos/${id}/cancelar`, {
        method: "POST",
      });
      if (res.ok) {
        await fetchPedidos();
      } else {
        const d = await res.json();
        alert(d.error || "Erro ao cancelar pedido");
      }
    } catch {
      alert("Erro ao cancelar pedido");
    }
    setCancelandoId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center text-white">
        <Loader2 className="w-10 h-10 animate-spin text-[#7C3AED]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1117] text-white pt-28 pb-16 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para a loja
          </Link>

          {usuario && (
            <span className="text-xs text-white/50">
              Conectado como <strong className="text-white">{usuario.nome.split(" ")[0]}</strong>
            </span>
          )}
        </div>

        {/* Título idêntico ao screenshot 4 */}
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">
          Meus pedidos
        </h1>

        {/* Lista de cards */}
        {pedidos.length === 0 ? (
          <div className="bg-[#161B22] border border-white/10 rounded-2xl p-12 text-center">
            <Package className="w-14 h-14 text-white/20 mx-auto mb-4" />
            <h2 className="text-base font-semibold text-white mb-1">
              Nenhum pedido encontrado
            </h2>
            <p className="text-xs text-white/50 max-w-sm mx-auto mb-6">
              Você ainda não realizou nenhum pedido no INstituto Kalapa. Explore nossas vivências e atendimentos.
            </p>
            <Link
              href="/produtos"
              className="inline-block px-6 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold rounded-xl transition-all"
            >
              Explorar Catálogo
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {pedidos.map((p, idx) => {
              // Gerar número de exibição curto #35, #21 baseado no index reverso ou ID
              const numeroExibicao = p.order_nsu?.startsWith("kalapa-")
                ? p.order_nsu.slice(-6).toUpperCase()
                : `${pedidos.length - idx}`;

              const isPago = p.status === "pago";
              const isPendente = p.status === "pendente";
              const isCancelado = p.status === "cancelado";

              // Itens do pedido
              const itens = p.itens && p.itens.length > 0
                ? p.itens
                : [{
                    nome: p.produtos?.nome || "Vivência Terapêutica",
                    quantidade: 1,
                    preco: p.valor,
                  }];

              return (
                <div
                  key={p.id}
                  className="bg-[#161B22] border border-white/10 rounded-2xl p-6 shadow-xl transition-all hover:border-white/20"
                >
                  {/* Top row: Pedido #ID + Data + Status pill */}
                  <div className="flex items-start justify-between gap-4 pb-4">
                    <div>
                      <h2 className="text-base font-bold text-white">
                        Pedido #{numeroExibicao}
                      </h2>
                      <p className="text-xs text-white/50 mt-0.5">
                        {formatDate(p.created_at)}
                      </p>
                    </div>

                    <div>
                      {isPago && (
                        <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Pago
                        </span>
                      )}
                      {isPendente && (
                        <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          Pendente
                        </span>
                      )}
                      {isCancelado && (
                        <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-medium bg-gray-500/10 text-gray-400 border border-gray-500/20">
                          Cancelado
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Middle row: Itens listados */}
                  <div className="py-3 border-t border-white/5 space-y-1.5">
                    {itens.map((item, i) => (
                      <p key={i} className="text-sm text-white/75">
                        {item.nome} × {item.quantidade} — R$ {(item.preco * item.quantidade).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </p>
                    ))}
                  </div>

                  {/* Bottom row: Total em roxo + Ações */}
                  <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="text-sm font-semibold">
                      Total:{" "}
                      <span className="text-[#A78BFA] font-bold">
                        R$ {Number(p.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                      {p.valor_desconto && Number(p.valor_desconto) > 0 ? (
                        <span className="text-[11px] text-emerald-400 ml-2 font-normal">
                          (desconto de R$ {Number(p.valor_desconto).toFixed(2)})
                        </span>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-2">
                      {isPendente && (
                        <button
                          onClick={() => handleCancelarPedido(p.id)}
                          disabled={cancelandoId === p.id}
                          className="px-3 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          {cancelandoId === p.id ? "Cancelando..." : "Cancelar pedido"}
                        </button>
                      )}

                      {isPago && p.receipt_url && (
                        <a
                          href={p.receipt_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-1.5 text-xs text-[#A78BFA] hover:text-white hover:bg-purple-500/10 border border-purple-500/20 rounded-xl transition-colors inline-flex items-center gap-1.5"
                        >
                          Ver comprovante
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
