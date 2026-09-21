"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Package, ArrowLeft, MessageCircle, Sparkles } from "lucide-react";
import ProductCard, { type Produto } from "./ProductCard";
import type { VagasInfo } from "@/lib/types";

interface ProductGridProps {
  categoria?: string | null;
}

export default function ProductGrid({ categoria }: ProductGridProps) {
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
        let produtosData: Produto[] = await prodRes.json();

        if (categoria) {
          const normalize = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          const cat = normalize(categoria);
          produtosData = produtosData.filter(
            (p) => normalize(p.categoria || "") === cat || normalize(p.slug || "") === cat
          );
        }

        setProdutos(produtosData);

        const produtosComVagas = produtosData.filter((p) => p.vagas_maximas != null);
        if (produtosComVagas.length > 0) {
          const vagasResults = await Promise.all(
            produtosComVagas.map((p) =>
              fetch(`/api/vagas?produto_id=${p.id}`)
                .then((r) => r.ok ? r.json() : null)
                .catch(() => null)
            )
          );

          const map: Record<string, VagasInfo> = {};
          produtosComVagas.forEach((p, i) => {
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
  }, [categoria]);

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
      <div className="text-center py-16 px-4 max-w-lg mx-auto bg-white rounded-3xl border border-brand-charcoal/10 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-brand-purple/10 text-brand-purple flex items-center justify-center mx-auto mb-4 border border-brand-purple/20">
          <Sparkles className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-bold text-brand-charcoal mb-2 font-sans">
          {categoria
            ? `Nenhuma vivência encontrada em "${categoria}"`
            : "Novas turmas em preparação"}
        </h3>

        <p className="text-brand-charcoal/65 text-sm mb-6 leading-relaxed">
          {categoria
            ? "No momento não temos turmas com inscrições abertas nesta categoria ou o calendário está sendo atualizado. Explore todas as vivências ativas ou consulte nossa facilitadora."
            : "Nossos grupos são reduzidos e abertos periodicamente. Entre em contato conosco para conhecer a programação e reservar sua vaga antecipadamente."}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {categoria && (
            <Link
              href="/produtos"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-terracotta hover:bg-brand-terracotta-dark text-white text-xs font-bold transition-all shadow-md shadow-brand-terracotta/20 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Ver todos os serviços
            </Link>
          )}

          <a
            href={`https://wa.me/5511917452732?text=${encodeURIComponent(
              categoria
                ? `Olá! Gostaria de saber quando abrem novas turmas para a categoria "${categoria}" no INstituto Kalapa.`
                : "Olá! Gostaria de informações sobre as próximas turmas e vivências no INstituto Kalapa."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-brand-purple/25 bg-brand-purple/5 hover:bg-brand-purple/10 text-brand-purple text-xs font-bold transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-brand-mint" />
            Falar no WhatsApp
          </a>
        </div>
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
          vagas={produto.vagas_maximas != null ? vagasMap[produto.id] || null : null}
        />
      ))}
    </motion.div>
  );
}
