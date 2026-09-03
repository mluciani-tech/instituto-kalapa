"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, Package, Loader2, XCircle } from "lucide-react";
import Footer from "../../components/Footer";
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
      <div className="min-h-screen bg-brand-charcoal relative flex items-center justify-center text-white">
        <div className="absolute inset-0 cinematic-gradient" />
        <Loader2 className="w-10 h-10 animate-spin text-brand-terracotta relative z-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-charcoal relative flex flex-col justify-between font-sans">
      {/* Background Cinematográfico Kalapa */}
      <div className="absolute inset-0 cinematic-gradient opacity-95 pointer-events-none" />
      <div className="absolute inset-0 cinematic-overlay opacity-60 pointer-events-none" />

      <div className="relative z-10 flex-1 pt-28 pb-16 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Barra Superior */}
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-medium text-white/50 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para a loja
            </Link>

            {usuario && (
              <span className="text-xs text-white/60">
                Conectado como <strong className="text-brand-terracotta font-semibold">{usuario.nome.split(" ")[0]}</strong>
              </span>
            )}
          </div>

          {/* Título com estilo Kalapa */}
          <div className="mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/70 text-xs font-semibold tracking-wide mb-3 border border-white/10">
              ✦ Área do Cliente
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Meus pedidos
            </h1>
            <p className="text-xs md:text-sm text-white/50 mt-1">
              Acompanhe suas inscrições, vivências, compras e comprovantes de pagamento
            </p>
          </div>

          {/* Lista de cards */}
          {pedidos.length === 0 ? (
            <div className="glass-card border border-white/10 rounded-2xl p-12 text-center shadow-xl">
              <Package className="w-14 h-14 text-white/25 mx-auto mb-4" />
              <h2 className="text-base font-semibold text-white mb-1">
                Nenhum pedido encontrado
              </h2>
              <p className="text-xs text-white/50 max-w-sm mx-auto mb-6">
                Você ainda não realizou nenhum pedido no INstituto Kalapa. Conheça nossas vivências e atendimentos.
              </p>
              <Link
                href="/produtos"
                className="inline-block px-6 py-3 bg-brand-terracotta hover:bg-brand-terracotta-dark text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-brand-terracotta/20"
              >
                Explorar Catálogo
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {pedidos.map((p, idx) => {
                const numeroExibicao = p.order_nsu?.startsWith("kalapa-")
                  ? p.order_nsu.slice(-6).toUpperCase()
                  : `${pedidos.length - idx}`;

                const isPago = p.status === "pago";
                const isPendente = p.status === "pendente";
                const isCancelado = p.status === "cancelado";

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
                    className="glass-card border border-white/10 rounded-2xl p-6 md:p-7 shadow-xl transition-all hover:border-white/20"
                  >
                    {/* Linha superior: Pedido # + Data + Status Pill */}
                    <div className="flex items-start justify-between gap-4 pb-4">
                      <div>
                        <h2 className="text-base font-bold text-white tracking-tight">
                          Pedido #{numeroExibicao}
                        </h2>
                        <p className="text-xs text-white/50 mt-0.5 font-mono">
                          {formatDate(p.created_at)}
                        </p>
                      </div>

                      <div>
                        {isPago && (
                          <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold bg-brand-mint/20 text-brand-mint border border-brand-mint/30">
                            Pago
                          </span>
                        )}
                        {isPendente && (
                          <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold bg-brand-terracotta/20 text-brand-terracotta border border-brand-terracotta/30">
                            Pendente
                          </span>
                        )}
                        {isCancelado && (
                          <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold bg-white/10 text-white/50 border border-white/10">
                            Cancelado
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Linha intermediária: Relação de itens */}
                    <div className="py-3 border-t border-white/10 space-y-2">
                      {itens.map((item, i) => (
                        <p key={i} className="text-sm text-white/80">
                          {item.nome} × {item.quantidade} — <span className="font-semibold text-white">R$ {(item.preco * item.quantidade).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                        </p>
                      ))}
                    </div>

                    {/* Linha inferior: Total em terracota/gold + Ações */}
                    <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="text-sm font-medium text-white/80">
                        Total:{" "}
                        <span className="text-brand-terracotta font-bold text-base">
                          R$ {Number(p.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                        {p.valor_desconto && Number(p.valor_desconto) > 0 ? (
                          <span className="text-xs text-brand-mint ml-2 font-normal">
                            (desconto de R$ {Number(p.valor_desconto).toFixed(2)})
                          </span>
                        ) : null}
                      </div>

                      <div className="flex items-center gap-2">
                        {isPendente && (
                          <button
                            onClick={() => handleCancelarPedido(p.id)}
                            disabled={cancelandoId === p.id}
                            className="px-3.5 py-1.5 text-xs text-red-300 hover:text-red-200 hover:bg-red-500/15 border border-red-500/20 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
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
                            className="px-4 py-1.5 text-xs text-brand-terracotta hover:text-white hover:bg-brand-terracotta/20 border border-brand-terracotta/30 rounded-xl transition-colors inline-flex items-center gap-1.5 font-medium"
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

      <Footer />
    </div>
  );
}
