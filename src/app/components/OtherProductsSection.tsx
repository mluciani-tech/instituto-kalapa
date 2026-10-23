"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Compass,
  BookOpen,
  Utensils,
  Gamepad2,
  CalendarDays,
  ArrowRight,
} from "lucide-react";
import ProductCard, { type Produto } from "./ProductCard";
import type { VagasInfo } from "@/lib/types";
import { fetchProdutosPublicosCached, fetchVagasBatchClient } from "@/lib/produtos-client";

type AbaFiltro = "todos" | "testes" | "calendario" | "jogos" | "receitas" | "biblioteca";

const ABAS: { id: AbaFiltro; label: string; icone: React.ReactNode }[] = [
  { id: "todos", label: "Todos", icone: <Sparkles className="w-4 h-4" /> },
  {
    id: "testes",
    label: "Testes",
    icone: <Compass className="w-4 h-4" />,
  },
  {
    id: "calendario",
    label: "Calendário",
    icone: <CalendarDays className="w-4 h-4" />,
  },
  {
    id: "jogos",
    label: "Jogos de Autoconhecimento",
    icone: <Gamepad2 className="w-4 h-4" />,
  },
  {
    id: "receitas",
    label: "Receitas das Vivências",
    icone: <Utensils className="w-4 h-4" />,
  },
  {
    id: "biblioteca",
    label: "Biblioteca Kalapa",
    icone: <BookOpen className="w-4 h-4" />,
  },
];

const linksDedicadosPorAba: Record<
  Exclude<AbaFiltro, "todos">,
  { label: string; href: string; mensagem: string }
> = {
  testes: {
    label: "Acessar Portal de Testes",
    href: "/teste-autoconhecimento",
    mensagem:
      "Explore todas as avaliações terapêuticas e diagnósticas de autoconhecimento com emissão de relatório individual detalhado em PDF.",
  },
  calendario: {
    label: "Ver Calendário de Encontros",
    href: "/produtos?categoria=calendario",
    mensagem:
      "Consulte nossa agenda atualizada de vivências presenciais, grupos terapêuticos e encontros no INstituto Kalapa.",
  },
  jogos: {
    label: "Jogar Metamorfose da Consciência",
    href: "/jogo-sistemico",
    mensagem:
      "Jornada gamificada de autoindagação inspirada nas Constelações e no Eneagrama, com emissão do Dossiê Editorial completo.",
  },
  receitas: {
    label: "Ver Receitas e Preparos",
    href: "/produtos?categoria=receitas",
    mensagem:
      "Preparos terapêuticos, chás e culinária afetiva das nossas vivências reunidos para você reproduzir em casa.",
  },
  biblioteca: {
    label: "Acessar Biblioteca Kalapa",
    href: "/produtos?categoria=biblioteca",
    mensagem:
      "Artigos autorais, reflexões, e-books e materiais ricos para download desenvolvidos para apoiar sua prática diária.",
  },
};

export function classificarProdutoOutro(p: Produto): Exclude<AbaFiltro, "todos"> | null {
  const norm = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

  const cat = norm(p.categoria || "");
  const slug = norm(p.slug || "");

  if (cat === "calendario" || slug === "calendario" || slug.startsWith("calendario-")) {
    return "calendario";
  }

  if (cat === "receitas" || cat === "receita" || slug.includes("receita")) {
    return "receitas";
  }

  if (
    cat === "jogos" ||
    cat === "jogo" ||
    slug === "jogos" ||
    slug === "jogo" ||
    slug.includes("jogo") ||
    slug.includes("metamorfose") ||
    (p.rota_teste || "").includes("metamorfose")
  ) {
    return "jogos";
  }

  if (
    p.is_teste === true ||
    cat === "testes" ||
    cat === "teste" ||
    slug === "teste" ||
    slug === "testes" ||
    slug.startsWith("teste-")
  ) {
    return "testes";
  }

  if (
    p.is_biblioteca === true ||
    Boolean(p.arquivo_url) ||
    cat === "biblioteca" ||
    cat === "biblioteca-kalapa" ||
    cat === "artigos" ||
    cat === "artigo" ||
    cat === "conteudos" ||
    cat === "conteudo" ||
    cat === "guias" ||
    cat === "guia" ||
    cat === "downloads" ||
    cat === "download" ||
    cat === "materiais" ||
    slug === "biblioteca" ||
    slug === "biblioteca-kalapa"
  ) {
    return "biblioteca";
  }

  return null;
}

export default function OtherProductsSection() {
  const [abaAtiva, setAbaAtiva] = useState<AbaFiltro>("todos");
  const [produtosOutros, setProdutosOutros] = useState<Produto[]>([]);
  const [vagasMap, setVagasMap] = useState<Record<string, VagasInfo>>({});

  useEffect(() => {
    const handleSelecionarAba = (e: Event) => {
      const customEvent = e as CustomEvent<{ aba?: string }>;
      const novaAba = customEvent.detail?.aba as AbaFiltro | undefined;
      if (
        novaAba &&
        ["todos", "testes", "calendario", "jogos", "receitas", "biblioteca"].includes(novaAba)
      ) {
        setAbaAtiva(novaAba);
      }
    };

    window.addEventListener(
      "kalapa:selecionar-aba-conhecimento",
      handleSelecionarAba
    );
    return () => {
      window.removeEventListener(
        "kalapa:selecionar-aba-conhecimento",
        handleSelecionarAba
      );
    };
  }, []);

  useEffect(() => {
    fetchProdutosPublicosCached()
      .then(async (data: Produto[]) => {
        const filtrados = data.filter(
          (p) => classificarProdutoOutro(p) !== null
        );
        setProdutosOutros(filtrados);

        const comVagas = filtrados.filter((p) => p.vagas_maximas != null);
        if (comVagas.length > 0) {
          const map = await fetchVagasBatchClient(comVagas.map((p) => p.id));
          setVagasMap(map);
        }
      })
      .catch(() => {});
  }, []);

  const produtosDinamicosFiltrados = useMemo(() => {
    if (abaAtiva === "todos") return produtosOutros;
    return produtosOutros.filter(
      (p) => classificarProdutoOutro(p) === abaAtiva
    );
  }, [produtosOutros, abaAtiva]);

  return (
    <section
      id="conhecimento-experiencias"
      className="py-12 md:py-16 bg-[#F4F1E8] border-t border-[#E4E0D4] scroll-mt-24"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Cabeçalho da Seção */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#485742]/12 text-[#214137] text-xs sm:text-sm font-semibold tracking-wide mb-4">
            <Sparkles aria-hidden="true" className="w-4 h-4 text-[#485742]" />
            Biblioteca Kalapa & Experiências Digitais
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-[#214137] tracking-tight">
            Testes, Jogos, Receitas e Materiais para Download
          </h2>
          <p className="mt-3 text-[#3B4D44]/80 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Ferramentas práticas de autoconhecimento, jogos sistêmicos, receitas
            das nossas vivências e conteúdos exclusivos para acompanhar sua
            jornada.
          </p>
        </motion.div>

        {/* Abas de Filtro */}
        <div
          role="tablist"
          aria-label="Filtrar outros produtos e conteúdos"
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mb-12"
        >
          {ABAS.map((aba) => {
            const ativa = abaAtiva === aba.id;
            return (
              <button
                key={aba.id}
                type="button"
                role="tab"
                aria-selected={ativa}
                onClick={() => setAbaAtiva(aba.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                  ativa
                    ? "bg-[#485742] text-white shadow-sm"
                    : "bg-[#FDFCF8] text-[#214137] border border-[#DEDAD0] hover:bg-[#EAE8DF]"
                }`}
              >
                {aba.icone}
                <span>{aba.label}</span>
              </button>
            );
          })}
        </div>

        {/* Listagem Direta de Produtos/Materiais */}
        {produtosDinamicosFiltrados.length > 0 ? (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
              {produtosDinamicosFiltrados.map((produto, index) => (
                <ProductCard
                  key={produto.id}
                  produto={produto}
                  index={index}
                  vagas={
                    produto.vagas_maximas != null
                      ? vagasMap[produto.id] || null
                      : null
                  }
                />
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                href={
                  abaAtiva !== "todos" && linksDedicadosPorAba[abaAtiva]
                    ? linksDedicadosPorAba[abaAtiva].href
                    : "/produtos?categoria=biblioteca"
                }
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#485742] hover:text-[#214137] transition-colors"
              >
                <span>
                  {abaAtiva !== "todos" && linksDedicadosPorAba[abaAtiva]
                    ? linksDedicadosPorAba[abaAtiva].label
                    : "Ver Biblioteca completa"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="max-w-xl mx-auto p-8 rounded-2xl bg-[#FDFCF8] border border-[#E6E3D8] text-center shadow-xs">
            <p className="text-sm text-[#3B4D44] mb-4 leading-relaxed">
              {abaAtiva !== "todos" && linksDedicadosPorAba[abaAtiva]
                ? linksDedicadosPorAba[abaAtiva].mensagem
                : "Nenhum conteúdo listado no momento."}
            </p>
            <Link
              href={
                abaAtiva !== "todos" && linksDedicadosPorAba[abaAtiva]
                  ? linksDedicadosPorAba[abaAtiva].href
                  : "/produtos?categoria=biblioteca"
              }
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#485742] text-white text-xs sm:text-sm font-semibold hover:bg-[#3B4736] transition-colors cursor-pointer"
            >
              <span>
                {abaAtiva !== "todos" && linksDedicadosPorAba[abaAtiva]
                  ? linksDedicadosPorAba[abaAtiva].label
                  : "Explorar Biblioteca Kalapa"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
