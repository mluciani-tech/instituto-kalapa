"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import ProductCard, { type Produto } from "./ProductCard";
import type { VagasInfo } from "@/lib/types";

export default function ProductHighlights() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [vagasMap, setVagasMap] = useState<Record<string, VagasInfo>>({});

  useEffect(() => {
    fetch("/api/produtos")
      .then((r) => r.json())
      .then(async (data: Produto[]) => {
        const destaques = data.filter((p: Produto) => p.destaque);
        setProdutos(destaques);

        // Fetch vagas only for products with vagas_maximas defined
        const produtosComVagas = destaques.filter((p) => p.vagas_maximas != null);
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
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (produtos.length === 0) return null;

  return (
    <section className="py-20 bg-brand-offwhite">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-purple/10 text-brand-purple text-sm font-semibold tracking-wide mb-4">
            <Sparkles aria-hidden="true" className="w-4 h-4" />
            Em destaque
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-brand-charcoal font-sans">
            Nossos serviços
          </h2>
          <p className="mt-3 text-brand-charcoal/60 text-lg max-w-xl mx-auto">
            Encontre a experiência que mais ressoa com o seu momento.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {produtos.slice(0, 3).map((produto, index) => (
            <ProductCard
              key={produto.id}
              produto={produto}
              index={index}
              vagas={produto.vagas_maximas != null ? vagasMap[produto.id] || null : null}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <a
            href="/produtos"
            className="inline-flex items-center gap-2 px-3 py-2.5 -mx-3 rounded-lg text-brand-purple font-semibold hover:text-brand-purple-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple focus-visible:ring-offset-2 focus-visible:ring-offset-brand-offwhite"
          >
            Ver todos os serviços
            <ArrowRight aria-hidden="true" className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
