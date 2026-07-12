"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Package } from "lucide-react";
import ProductCard, { type Produto } from "./ProductCard";

interface VagasInfo {
  preenchidas: number;
  maximas: number;
  restantes: number;
}

export default function ProductGrid() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [vagas, setVagas] = useState<VagasInfo | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, vagasRes] = await Promise.all([
          fetch("/api/produtos"),
          fetch("/api/vagas"),
        ]);

        if (prodRes.ok) {
          setProdutos(await prodRes.json());
        }

        if (vagasRes.ok) {
          setVagas(await vagasRes.json());
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
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-brand-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (produtos.length === 0) {
    return (
      <div className="text-center py-20">
        <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-400 text-lg">Nenhum produto disponível no momento.</p>
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
          vagas={vagas}
        />
      ))}
    </motion.div>
  );
}
