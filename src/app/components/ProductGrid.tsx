"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, MessageCircle, Sparkles } from "lucide-react";
import ProductCard, { type Produto } from "./ProductCard";
import type { VagasInfo } from "@/lib/types";
import { isProdutoAgendamento } from "@/lib/agendamento";
import { fetchProdutosPublicosCached, fetchVagasBatchClient } from "@/lib/produtos-client";

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
        let produtosData: Produto[] = await fetchProdutosPublicosCached();

        if (categoria) {
          const normalize = (s: string) =>
            s
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .trim();
          const cat = normalize(categoria);

          const isProdJogo = (p: Produto) => {
            const c = normalize(p.categoria || "");
            const s = normalize(p.slug || "");
            const r = normalize(p.rota_teste || "");
            return (
              c === "jogos" ||
              c === "jogo" ||
              s === "jogos" ||
              s === "jogo" ||
              s.includes("jogo") ||
              s.includes("metamorfose") ||
              r.includes("metamorfose")
            );
          };

          const isProdReceita = (p: Produto) => {
            const c = normalize(p.categoria || "");
            const s = normalize(p.slug || "");
            return c === "receitas" || c === "receita" || s === "receita" || s === "receitas" || s.includes("receita");
          };

          if (cat === "atendimentos" || cat === "atendimento" || cat === "psicoterapia") {
            produtosData = produtosData.filter((p) => {
              const c = normalize(p.categoria || "");
              const s = normalize(p.slug || "");
              return (
                p.atendimento_individual === true ||
                ["atendimentos", "atendimento", "psicoterapia"].includes(c) ||
                ["atendimentos", "atendimento", "psicoterapia", "terapia-adulto", "terapia-infantil"].includes(s) ||
                isProdutoAgendamento(p)
              );
            });
          } else if (cat === "vivencias" || cat === "vivencia") {
            produtosData = produtosData.filter((p) => {
              const c = normalize(p.categoria || "");
              const s = normalize(p.slug || "");
              if (s === "calendario" || c === "calendario") return false;
              if (p.is_teste || p.is_biblioteca || isProdJogo(p) || isProdReceita(p)) return false;
              return (
                ["vivencias", "vivencia"].includes(s) ||
                ["vivencias", "vivencia", "constelacao", "grupos", "grupo", "meditacao"].includes(c)
              );
            });
          } else if (cat === "receitas" || cat === "receita") {
            produtosData = produtosData.filter(isProdReceita);
          } else if (cat === "jogos" || cat === "jogo") {
            produtosData = produtosData.filter(isProdJogo);
          } else if (cat === "testes" || cat === "teste") {
            produtosData = produtosData.filter((p) => {
              if (isProdJogo(p)) return false;
              const c = normalize(p.categoria || "");
              const s = normalize(p.slug || "");
              return (
                p.is_teste === true ||
                c === "testes" ||
                c === "teste" ||
                s === "teste" ||
                s === "testes" ||
                s.startsWith("teste-")
              );
            });
          } else if (
            cat === "biblioteca" ||
            cat === "biblioteca-kalapa" ||
            cat === "guias" ||
            cat === "downloads" ||
            cat === "artigos"
          ) {
            produtosData = produtosData.filter((p) => {
              if (isProdReceita(p) || isProdJogo(p)) return false;
              const c = normalize(p.categoria || "");
              const s = normalize(p.slug || "");
              return (
                p.is_biblioteca === true ||
                Boolean(p.arquivo_url) ||
                ["biblioteca", "biblioteca-kalapa", "guias", "guia", "downloads", "download", "materiais", "artigos", "artigo"].includes(c) ||
                ["biblioteca", "biblioteca-kalapa", "guias", "downloads", "artigos"].includes(s)
              );
            });
          } else if (cat === "empreendedorismo" || cat === "lideranca" || cat === "negocios") {
            produtosData = produtosData.filter((p) => {
              const c = normalize(p.categoria || "");
              const s = normalize(p.slug || "");
              return (
                ["empreendedorismo", "lideranca", "negocios", "cafe"].includes(c) ||
                s.includes("empreendedorismo") ||
                s.includes("lideranca") ||
                s.includes("negocio")
              );
            });
          } else if (cat === "formacao" || cat === "supervisao") {
            produtosData = produtosData.filter((p) => {
              const c = normalize(p.categoria || "");
              const s = normalize(p.slug || "");
              return (
                ["formacao", "supervisao", "cursos", "treinamentos", "formacao-e-supervisao"].includes(c) ||
                s.includes("formacao") ||
                s.includes("supervisao") ||
                s.includes("curso") ||
                s.includes("treinamento")
              );
            });
          } else {
            produtosData = produtosData.filter(
              (p) => normalize(p.categoria || "") === cat || normalize(p.slug || "") === cat
            );
          }
        }

        setProdutos(produtosData);

        const produtosComVagas = produtosData.filter((p) => p.vagas_maximas != null);
        if (produtosComVagas.length > 0) {
          const map = await fetchVagasBatchClient(produtosComVagas.map((p) => p.id));
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
          {categoria === "atendimentos"
            ? "Nenhum atendimento individual disponível no momento"
            : categoria
            ? `Nenhuma vivência encontrada em "${categoria}"`
            : "Novas turmas em preparação"}
        </h3>

        <p className="text-brand-charcoal/65 text-sm mb-6 leading-relaxed">
          {categoria === "atendimentos"
            ? "No momento as vagas para atendimentos individuais estão completas ou em atualização. Fale diretamente com nossa facilitadora para consultar novos horários."
            : categoria
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
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start"
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
