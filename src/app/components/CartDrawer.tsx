"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Clock, AlertCircle, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Pedido } from "@/lib/types";

export default function CartDrawer() {
  const router = useRouter();
  const {
    items,
    removeItem,
    updateQuantity,
    isDrawerOpen,
    closeDrawer,
    subtotal,
    totalItems,
    setCartItems,
  } = useCart();

  const [pedidoPendente, setPedidoPendente] = useState<Pedido | null>(null);
  const [retomandoId, setRetomandoId] = useState<string | null>(null);
  const [erroRetomada, setErroRetomada] = useState("");

  // Buscar pedidos pendentes caso o carrinho esteja vazio
  useEffect(() => {
    if (!isDrawerOpen || items.length > 0) return;
    let isCancelled = false;

    const checkPendingOrders = async () => {
      try {
        const res = await fetch("/api/cliente/pedidos");
        if (res.ok) {
          const pedidos: Pedido[] = await res.json();
          if (!isCancelled && Array.isArray(pedidos)) {
            const pendente = pedidos.find((p) => p.status === "pendente");
            setPedidoPendente(pendente || null);
          }
        }
      } catch {
        // ignore
      }
    };

    checkPendingOrders();
    return () => {
      isCancelled = true;
    };
  }, [isDrawerOpen, items.length]);

  const handleRetomarPedido = async (pedidoId: string) => {
    setRetomandoId(pedidoId);
    setErroRetomada("");
    try {
      const res = await fetch(`/api/cliente/pedidos/${pedidoId}/retomar`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setErroRetomada(data.error || "Não foi possível retomar esta reserva.");
        setRetomandoId(null);
        return;
      }

      if (typeof window !== "undefined") {
        sessionStorage.setItem("pedido_retomado_id", pedidoId);
        if (data.beneficiarios && data.beneficiarios.length > 0) {
          sessionStorage.setItem("pedido_retomado_beneficiarios", JSON.stringify(data.beneficiarios));
        } else {
          sessionStorage.removeItem("pedido_retomado_beneficiarios");
        }
        if (data.cupom_codigo) {
          sessionStorage.setItem("pedido_retomado_cupom", data.cupom_codigo);
        } else {
          sessionStorage.removeItem("pedido_retomado_cupom");
        }
      }

      setCartItems(data.itens);
      closeDrawer();
      router.push("/checkout");
    } catch {
      setErroRetomada("Erro de conexão ao retomar reserva. Tente novamente.");
      setRetomandoId(null);
    }
  };

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        className="absolute inset-0 bg-black/70 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-brand-purple-deep border-l border-white/10 text-white flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-terracotta" />
              <h2 className="text-base font-semibold text-white tracking-tight">
                Sua Reserva
              </h2>
              <span className="text-xs bg-brand-terracotta/20 text-brand-terracotta border border-brand-terracotta/30 px-2 py-0.5 rounded-full font-medium">
                {totalItems} {totalItems === 1 ? "vivência" : "vivências"}
              </span>
            </div>
            <button
              onClick={closeDrawer}
              aria-label="Fechar reserva"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body / Items list */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-8">
                {pedidoPendente ? (
                  <div className="w-full p-5 bg-white/5 border border-brand-terracotta/30 rounded-2xl text-left shadow-xl space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-terracotta/20 text-brand-terracotta border border-brand-terracotta/30">
                        <Clock className="w-3 h-3 animate-pulse" />
                        Reserva pendente
                      </span>
                      <span className="text-[11px] text-white/50 font-mono">
                        #{pedidoPendente.order_nsu?.startsWith("kalapa-")
                          ? pedidoPendente.order_nsu.slice(-6).toUpperCase()
                          : pedidoPendente.id.slice(0, 6).toUpperCase()}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs text-white/50">Você iniciou uma compra recente:</p>
                      <p className="text-sm font-semibold text-white line-clamp-2">
                        {pedidoPendente.itens?.[0]?.nome || pedidoPendente.produtos?.nome || "Vivência Terapêutica"}
                        {pedidoPendente.itens && pedidoPendente.itens.length > 1 ? ` (+${pedidoPendente.itens.length - 1} item)` : ""}
                      </p>
                      <p className="text-sm text-brand-terracotta font-bold mt-1">
                        Total: R$ {Number(pedidoPendente.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </p>
                    </div>

                    {erroRetomada && (
                      <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/25 flex items-start gap-2 text-xs text-red-300">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-400 mt-0.5" />
                        <span className="flex-1">{erroRetomada}</span>
                      </div>
                    )}

                    <div className="pt-2 flex flex-col gap-2">
                      <button
                        onClick={() => handleRetomarPedido(pedidoPendente.id)}
                        disabled={retomandoId === pedidoPendente.id}
                        className="w-full py-3 px-4 bg-brand-terracotta hover:bg-brand-terracotta-dark text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-brand-terracotta/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {retomandoId === pedidoPendente.id ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Verificando vagas...</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-4 h-4" />
                            <span>Retomar esta reserva</span>
                          </>
                        )}
                      </button>

                      <Link
                        href="/conta/pedidos"
                        onClick={closeDrawer}
                        className="text-center text-[11px] text-white/60 hover:text-white transition-colors py-1.5"
                      >
                        Ver todos os meus pedidos
                      </Link>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-white/30 border border-white/10">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <p className="text-sm font-semibold text-white/90 mb-1">
                      Nenhuma vivência selecionada
                    </p>
                    <p className="text-xs text-white/50 max-w-xs mb-6">
                      Explore nossas vivências e atendimentos para reservar sua vaga.
                    </p>
                    <Link
                      href="/produtos"
                      onClick={closeDrawer}
                      className="px-5 py-2.5 bg-brand-terracotta hover:bg-brand-terracotta-dark text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-brand-terracotta/20"
                    >
                      Explorar Catálogo
                    </Link>
                  </>
                )}
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.produto_id}
                  className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3"
                >
                  {item.imagem_url ? (
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-white/10">
                      <Image
                        src={item.imagem_url}
                        alt={item.nome}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/10 text-white/30">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-semibold text-white truncate">
                      {item.nome}
                    </h3>
                    <p className="text-xs text-brand-terracotta font-bold mt-0.5">
                      R$ {item.preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>

                    {/* Quantity controls with accessible min 44x44px touch targets */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-white/15 rounded-lg bg-white/5 overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.produto_id, item.quantidade - 1)}
                          className="min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                          aria-label="Diminuir quantidade"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-white min-w-[24px] text-center select-none">
                          {item.quantidade}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.produto_id, item.quantidade + 1)}
                          className="min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                          aria-label="Aumentar quantidade"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.produto_id)}
                        className="min-w-[44px] min-h-[44px] flex items-center justify-center text-white/40 hover:text-red-400 transition-colors ml-auto cursor-pointer"
                        aria-label="Remover item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {item.quantidade >= 2 && (
                      <p className="text-[11px] text-brand-terracotta/90 mt-2 flex items-center gap-1.5 font-medium bg-brand-terracotta/10 px-2 py-1 rounded-md border border-brand-terracotta/20">
                        <span>👥</span>
                        <span>{item.quantidade - 1} acompanhante{item.quantidade - 1 > 1 ? "s" : ""} · dados solicitados no checkout</span>
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-5 border-t border-white/10 bg-brand-purple-deep space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Subtotal</span>
                <span className="text-base font-bold text-brand-terracotta">
                  R$ {subtotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>

              <Link
                href="/checkout"
                onClick={closeDrawer}
                className="w-full py-3.5 bg-brand-terracotta hover:bg-brand-terracotta-dark text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-brand-terracotta/25 flex items-center justify-center gap-2"
              >
                <span>Confirmar Reserva</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
