"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { ItemCarrinho } from "@/lib/types";

interface CartContextType {
  items: ItemCarrinho[];
  addItem: (produto: {
    id: string;
    slug?: string;
    nome: string;
    preco?: number | null;
    imagem_url?: string | null;
    categoria?: string | null;
  }, quantidade?: number) => void;
  removeItem: (produto_id: string) => void;
  updateQuantity: (produto_id: string, quantidade: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "kalapa_cart_items_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ItemCarrinho[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Carregar carrinho do localStorage no mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
    setMounted(true);
  }, []);

  // Salvar no localStorage sempre que items mudar
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items, mounted]);

  const addItem = (
    produto: {
      id: string;
      slug?: string;
      nome: string;
      preco?: number | null;
      imagem_url?: string | null;
      categoria?: string | null;
    },
    quantidade = 1
  ) => {
    const precoNum = produto.preco ?? 0;
    setItems((prev) => {
      const existing = prev.find((item) => item.produto_id === produto.id);
      if (existing) {
        return prev.map((item) =>
          item.produto_id === produto.id
            ? { ...item, quantidade: item.quantidade + quantidade }
            : item
        );
      }
      return [
        ...prev,
        {
          produto_id: produto.id,
          slug: produto.slug || produto.id,
          nome: produto.nome,
          preco: precoNum,
          quantidade,
          imagem_url: produto.imagem_url || null,
          categoria: produto.categoria || null,
        },
      ];
    });
    setIsDrawerOpen(true);
  };

  const removeItem = (produto_id: string) => {
    setItems((prev) => prev.filter((item) => item.produto_id !== produto_id));
  };

  const updateQuantity = (produto_id: string, quantidade: number) => {
    if (quantidade <= 0) {
      removeItem(produto_id);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.produto_id === produto_id ? { ...item, quantidade } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantidade, 0);
  const subtotal = items.reduce((sum, item) => sum + item.preco * item.quantidade, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        isDrawerOpen,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
        toggleDrawer: () => setIsDrawerOpen((prev) => !prev),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
