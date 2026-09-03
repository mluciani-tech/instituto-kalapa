"use client";

import { useCart } from "@/context/CartContext";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    isDrawerOpen,
    closeDrawer,
    subtotal,
    totalItems,
  } = useCart();

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
                Seu Carrinho
              </h2>
              <span className="text-xs bg-brand-terracotta/20 text-brand-terracotta border border-brand-terracotta/30 px-2 py-0.5 rounded-full font-medium">
                {totalItems} {totalItems === 1 ? "item" : "itens"}
              </span>
            </div>
            <button
              onClick={closeDrawer}
              aria-label="Fechar carrinho"
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body / Items list */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-white/30 border border-white/10">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-sm font-semibold text-white/90 mb-1">
                  Seu carrinho está vazio
                </p>
                <p className="text-xs text-white/50 max-w-xs mb-6">
                  Explore nossas vivências e atendimentos para adicionar ao seu carrinho.
                </p>
                <Link
                  href="/produtos"
                  onClick={closeDrawer}
                  className="px-5 py-2.5 bg-brand-terracotta hover:bg-brand-terracotta-dark text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-brand-terracotta/20"
                >
                  Explorar Catálogo
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.produto_id}
                  className="p-3.5 bg-white/[0.04] border border-white/10 rounded-xl flex gap-3.5 items-center"
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

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-white/15 rounded-lg bg-white/5 overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.produto_id, item.quantidade - 1)}
                          className="p-1 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                          aria-label="Diminuir quantidade"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-white min-w-[20px] text-center">
                          {item.quantidade}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.produto_id, item.quantidade + 1)}
                          className="p-1 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                          aria-label="Aumentar quantidade"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.produto_id)}
                        className="p-1 text-white/30 hover:text-red-400 transition-colors ml-auto cursor-pointer"
                        aria-label="Remover item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
                <span>Finalizar Pedido</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
