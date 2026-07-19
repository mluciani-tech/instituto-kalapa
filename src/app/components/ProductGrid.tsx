"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Package } from "lucide-react";
import ProductCard, { type Produto } from "./ProductCard";
import type { VagasInfo } from "@/lib/types";

export default function ProductGrid() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [vagasMap, setVagasMap] = useState<Record<string, VagasInfo>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodRes = await fetch("/api/produtos");
        if (!prodRes.ok) {
          setLoading(false);
          return;
        }
        const produtosData: Produto[] = await prodRes.json();
        setProdutos(produtosData);

        // Fetch vagas for all products
        if (produtosData.length > 0) {
          const vagasResults = await Promise.all(
            produtosData.map((p) =>
              fetch(`/api/vagas?produto_id=${p.id}`)
                .then((r) => r.ok ? r.json() : null)
                .catch(() => null)
            )
          );

          const map: Record<string, VagasInfo> = {};
          produtosData.forEach((p, i) => {
            if (vagasResults[i]) {
              map[p.id] = vagasResults[i];
            }
          });
          setVagasMap(map);
        }
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20" role="status">
        <div aria-hidden="true" className="w-10 h-10 border-4 border-brand-purple border-t-transparent rounded-full animate-spin" />
        <span className="sr-only">Carregando…</span>
      </div>
    );
  }

  if (produtos.length === 0) {
    return (
      <div className="text-center py-20">
        <Package aria-hidden="true" className="w-12 h-12 text-brand-charcoal/25 mx-auto mb-4" />
        <p className="text-brand-charcoal/45 text-lg">Nenhum produto disponível no momento.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {produtos.map((produto, index) => (
        <ProductCard
          key={produto.id}
          produto={produto}
          index={index}
          vagas={vagasMap[produto.id] || null}
        />
      ))}
    </motion.div>
  );
}
