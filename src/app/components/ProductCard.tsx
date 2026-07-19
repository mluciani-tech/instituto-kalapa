"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import StarBorder from "@/components/ui/star-border";
import type { Produto, VagasInfo } from "@/lib/types";

export type { Produto };

interface ProductCardProps {
  produto: Produto;
  index?: number;
  vagas?: VagasInfo | null;
}

export default function ProductCard({ produto, index = 0, vagas }: ProductCardProps) {
  const router = useRouter();

  const handleEscolher = () => {
    sessionStorage.setItem("produto_selecionado", produto.id);
    router.push("/checkout");
  };

  const precoFormatado = produto.preco.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const vagasEsgotadas = vagas && vagas.restantes <= 0;
  const vagasQuaseEsgotadas = vagas && vagas.restantes > 0 && vagas.restantes <= 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <StarBorder
        color="#B8965A"
        speed="8s"
        thickness={2}
        className="w-full h-full"
      >
        <div className="group relative overflow-hidden flex flex-col bg-white rounded-2xl">
          {/* Imagem */}
          <div className="relative h-48 overflow-hidden">
            {produto.imagem_url ? (
              <img
                src={produto.imagem_url}
                alt={produto.nome}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-brand-purple/20 to-brand-terracotta/20 flex items-center justify-center">
                <span className="text-4xl">✦</span>
              </div>
            )}
            {produto.destaque && (
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-brand-terracotta text-white text-xs font-semibold tracking-wide">
                Destaque
              </div>
            )}
          </div>

          {/* Conteúdo */}
          <div className="flex flex-col flex-1 p-6">
            <h3 className="text-xl font-bold text-brand-charcoal mb-2 font-sans">
              {produto.nome}
            </h3>

            {produto.descricao_curta && (
              <p className="text-sm text-brand-charcoal/60 mb-3">{produto.descricao_curta}</p>
            )}

            {produto.descricao && (
              <p className="text-sm text-brand-charcoal/70 leading-relaxed mb-4 flex-1">
                {produto.descricao}
              </p>
            )}

            {/* Benefícios */}
            {produto.beneficios && produto.beneficios.length > 0 && (
              <ul className="space-y-2 mb-4">
                {produto.beneficios.slice(0, 3).map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-brand-charcoal/70">
                    <Check aria-hidden="true" className="w-4 h-4 text-brand-mint flex-shrink-0 mt-0.5" />
                    {b}
                  </li>
                ))}
              </ul>
            )}

            {/* Contador de vagas */}
            {vagas && (
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-brand-charcoal/60">
                    Vagas da próxima turma
                  </span>
                  <span className={`font-bold tabular-nums ${vagasEsgotadas ? 'text-red-500' : vagasQuaseEsgotadas ? 'text-brand-terracotta' : 'text-brand-charcoal'}`}>
                    {vagas.preenchidas}/{vagas.maximas}
                  </span>
                </div>
                <div className="w-full bg-brand-charcoal/10 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-[width] duration-500 ${
                      vagasEsgotadas ? 'bg-red-400' : vagasQuaseEsgotadas ? 'bg-brand-terracotta' : 'bg-brand-mint'
                    }`}
                    style={{ width: `${(vagas.preenchidas / vagas.maximas) * 100}%` }}
                  />
                </div>
                <p className={`text-xs mt-1 ${vagasEsgotadas ? 'text-red-500 font-semibold' : vagasQuaseEsgotadas ? 'text-brand-terracotta font-semibold' : 'text-brand-charcoal/45'}`}>
                  {vagasEsgotadas
                    ? 'Turma lotada'
                    : vagasQuaseEsgotadas
                      ? `Última${vagas.restantes === 1 ? '' : 's'} ${vagas.restantes} vaga${vagas.restantes === 1 ? '' : 's'}!`
                      : `Grupos reduzidos — máximo ${vagas.maximas} participantes`
                  }
                </p>
              </div>
            )}

            {/* Preço + CTA */}
            <div className="mt-auto pt-4 border-t border-brand-charcoal/10">
              <div className="flex items-end gap-1 mb-3">
                <span className="text-3xl font-bold text-brand-charcoal tabular-nums">
                  {precoFormatado}
                </span>
                <span className="text-sm text-brand-charcoal/45 mb-1">/ sessão</span>
              </div>

              <button
                onClick={handleEscolher}
                disabled={!!vagasEsgotadas}
                className={`w-full py-3 font-semibold rounded-xl transition-[background-color,box-shadow,transform] duration-300 flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta focus-visible:ring-offset-2 ${
                  vagasEsgotadas
                    ? 'bg-brand-charcoal/10 text-brand-charcoal/40 cursor-not-allowed'
                    : 'bg-brand-terracotta hover:bg-brand-terracotta-dark text-white shadow-lg shadow-brand-terracotta/20 hover:shadow-brand-terracotta/35 hover:-translate-y-0.5'
                }`}
              >
                {vagasEsgotadas ? 'Turma lotada' : (
                  <>
                    Escolher
                    <ArrowRight aria-hidden="true" className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </StarBorder>
    </motion.div>
  );
}
