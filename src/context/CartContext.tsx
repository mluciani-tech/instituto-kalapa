"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
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
    agendamento_id?: string | null;
    agendamento_inicio?: string | null;
    agendamento_fim?: string | null;
    terapeuta_nome?: string | null;
    is_teste?: boolean;
    rota_teste?: string | null;
  }, quantidade?: number) => void;
  removeItem: (produto_id: string) => void;
  updateQuantity: (produto_id: string, quantidade: number) => void;
  clearCart: () => void;
  setCartItems: (items: ItemCarrinho[]) => void;
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
      if (items.length === 0) {
        localStorage.removeItem(CART_STORAGE_KEY);
      } else {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      }
    } catch {
      // ignore
    }
  }, [items, mounted]);

  // Sincronizar abas via evento storage da window
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === CART_STORAGE_KEY) {
        try {
          if (e.newValue) {
            setItems(JSON.parse(e.newValue));
          } else {
            setItems([]);
          }
        } catch {
          setItems([]);
        }
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const addItem = useCallback((
    produto: {
      id: string;
      slug?: string;
      nome: string;
      preco?: number | null;
      imagem_url?: string | null;
      categoria?: string | null;
      agendamento_id?: string | null;
      agendamento_inicio?: string | null;
      agendamento_fim?: string | null;
      terapeuta_nome?: string | null;
      is_teste?: boolean;
      rota_teste?: string | null;
    },
    quantidade = 1
  ) => {
    const precoNum = produto.preco ?? 0;
    setItems((prev) => {
      const existing = prev.find((item) => item.produto_id === produto.id && item.agendamento_id === produto.agendamento_id);
      if (existing) {
        return prev.map((item) =>
          item.produto_id === produto.id && item.agendamento_id === produto.agendamento_id
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
          agendamento_id: produto.agendamento_id || null,
          agendamento_inicio: produto.agendamento_inicio || null,
          agendamento_fim: produto.agendamento_fim || null,
          terapeuta_nome: produto.terapeuta_nome || null,
          is_teste: produto.is_teste || false,
          rota_teste: produto.rota_teste || null,
        },
      ];
    });
    setIsDrawerOpen(true);
  }, []);

  const removeItem = useCallback((produto_id: string) => {
    setItems((prev) => prev.filter((item) => item.produto_id !== produto_id));
  }, []);

  const updateQuantity = useCallback((produto_id: string, quantidade: number) => {
    if (quantidade <= 0) {
      setItems((prev) => prev.filter((item) => item.produto_id !== produto_id));
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.produto_id === produto_id ? { ...item, quantidade } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems((prev) => (prev.length === 0 ? prev : []));
    setIsDrawerOpen(false);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const setCartItems = useCallback((newItems: ItemCarrinho[]) => {
    setItems(newItems);
  }, []);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
  const toggleDrawer = useCallback(() => setIsDrawerOpen((prev) => !prev), []);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantidade, 0),
    [items]
  );
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.preco * item.quantidade, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      setCartItems,
      totalItems,
      subtotal,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      toggleDrawer,
    }),
    [
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      setCartItems,
      totalItems,
      subtotal,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      toggleDrawer,
    ]
  );

  return (
    <CartContext.Provider value={value}>
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
