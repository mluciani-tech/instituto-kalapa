"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export interface Produto {
  id: string;
  slug: string;
  nome: string;
  descricao: string | null;
  descricao_curta: string | null;
  preco: number;
  imagem_url: string | null;
  beneficios: string[];
  destaque: boolean;
  ativo: boolean;
  ordem: number;
  vagas_maximas: number | null;
}

interface VagasInfo {
  preenchidas: number;
  maximas: number;
  restantes: number;
}

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
      className="group relative glass-card-light rounded-2xl overflow-hidden flex flex-col"
    >
      {/* Imagem */}
      <div className="relative h-48 overflow-hidden">
        {produto.imagem_url ? (
          <img
            src={produto.imagem_url}
            alt={produto.nome}
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
          <p className="text-sm text-gray-500 mb-3">{produto.descricao_curta}</p>
        )}

        {produto.descricao && (
          <p className="text-sm text-gray-600 leading-relaxed mb-4 flex-1">
            {produto.descricao}
          </p>
        )}

        {/* Benefícios */}
        {produto.beneficios && produto.beneficios.length > 0 && (
          <ul className="space-y-2 mb-4">
            {produto.beneficios.slice(0, 3).map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm text-gray-600">
                <Check className="w-4 h-4 text-brand-mint flex-shrink-0 mt-0.5" />
                {b}
              </li>
            ))}
          </ul>
        )}

        {/* Contador de vagas */}
        {vagas && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="text-gray-500">
                Vagas da próxima turma
              </span>
              <span className={`font-bold ${vagasEsgotadas ? 'text-red-500' : vagasQuaseEsgotadas ? 'text-brand-terracotta' : 'text-brand-charcoal'}`}>
                {vagas.preenchidas}/{vagas.maximas}
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  vagasEsgotadas ? 'bg-red-400' : vagasQuaseEsgotadas ? 'bg-brand-terracotta' : 'bg-brand-mint'
                }`}
                style={{ width: `${(vagas.preenchidas / vagas.maximas) * 100}%` }}
              />
            </div>
            <p className={`text-xs mt-1 ${vagasEsgotadas ? 'text-red-500 font-semibold' : vagasQuaseEsgotadas ? 'text-brand-terracotta font-semibold' : 'text-gray-400'}`}>
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
        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-end gap-1 mb-3">
            <span className="text-3xl font-bold text-brand-charcoal">
              {precoFormatado}
            </span>
            <span className="text-sm text-gray-400 mb-1">/ sessão</span>
          </div>

          <button
            onClick={handleEscolher}
            disabled={!!vagasEsgotadas}
            className={`w-full py-3 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
              vagasEsgotadas
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-brand-terracotta hover:bg-brand-terracotta-dark text-white shadow-lg shadow-brand-terracotta/20 hover:shadow-brand-terracotta/35 hover:-translate-y-0.5'
            }`}
          >
            {vagasEsgotadas ? 'Turma lotada' : (
              <>
                Escolher
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
