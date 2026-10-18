"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Compass,
  BookOpen,
  FileDown,
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

interface RecursoDestaque {
  id: string;
  aba: Exclude<AbaFiltro, "todos">;
  badge: string;
  titulo: string;
  subtitulo: string;
  descricao: string;
  ctaTexto: string;
  href: string;
  corBg: string;
  icone: React.ReactNode;
}

const recursosFixos: RecursoDestaque[] = [
  {
    id: "hub-testes",
    aba: "testes",
    badge: "Autoconhecimento & Diagnóstico",
    titulo: "Testes de Autoconhecimento",
    subtitulo: "Eneagrama, Cronotipo, Yin-Yang e Lealdades Sistêmicas",
    descricao:
      "Avaliações terapêuticas e diagnósticas com emissão de relatório individual detalhado em PDF para mapear seu momento atual.",
    ctaTexto: "Explorar todos os testes",
    href: "/teste-autoconhecimento",
    corBg: "bg-[#EAE8DF]",
    icone: <Compass className="w-5 h-5 text-white" />,
  },
  {
    id: "calendario-kalapa",
    aba: "calendario",
    badge: "Programação Oficial",
    titulo: "Calendário de Encontros",
    subtitulo: "Datas das próximas vivências, grupos e formações",
    descricao:
      "Consulte nossa agenda atualizada de vivências presenciais, grupos terapêuticos, práticas contemplativas e encontros no INstituto Kalapa.",
    ctaTexto: "Ver Calendário",
    href: "/produtos?slug=calendario",
    corBg: "bg-[#EAE8EC]",
    icone: <CalendarDays className="w-5 h-5 text-white" />,
  },
  {
    id: "jogo-metamorfose",
    aba: "jogos",
    badge: "Jogo Sistêmico Interativo",
    titulo: "A Metamorfose da Consciência",
    subtitulo: "Jornada gamificada pelos 4 Quadrantes Sistêmicos",
    descricao:
      "Experiência profunda de autoindagação inspirada nas Constelações e no Eneagrama, com emissão do Dossiê Editorial completo.",
    ctaTexto: "Acessar o Jogo Sistêmico",
    href: "/jogo-sistemico",
    corBg: "bg-[#EFE7DC]",
    icone: <Gamepad2 className="w-5 h-5 text-white" />,
  },
  {
    id: "receitas-vivencias",
    aba: "receitas",
    badge: "Cuidado & Nutrição Consciente",
    titulo: "Receitas das Vivências",
    subtitulo: "Preparos terapêuticos, chás e culinária afetiva do Kalapa",
    descricao:
      "Sabores que acolhem durante nossos encontros presenciais, reunidos para você reproduzir em casa com equilíbrio e presença.",
    ctaTexto: "Ver receitas e preparos",
    href: "/produtos?categoria=receitas",
    corBg: "bg-[#EAE8DF]",
    icone: <Utensils className="w-5 h-5 text-white" />,
  },
  {
    id: "biblioteca-kalapa",
    aba: "biblioteca",
    badge: "Biblioteca Kalapa & PDFs",
    titulo: "Biblioteca Kalapa",
    subtitulo: "Artigos, reflexões, e-books, cadernos e materiais para download",
    descricao:
      "Conteúdos autorais e materiais ricos desenvolvidos para apoiar empreendedores, terapeutas e buscadores em sua prática diária.",
    ctaTexto: "Acessar Biblioteca Kalapa",
    href: "/produtos?categoria=biblioteca",
    corBg: "bg-[#EFE7DC]",
    icone: <BookOpen className="w-5 h-5 text-white" />,
  },
];

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

  const recursosFiltrados = useMemo(() => {
    if (abaAtiva === "todos") return recursosFixos;
    return recursosFixos.filter((r) => r.aba === abaAtiva);
  }, [abaAtiva]);

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

        {/* Cards de Acesso Rápido das Categorias Digitais (Testes, Jogos, Receitas, Artigos, Downloads) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {recursosFiltrados.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.06 }}
              className="h-full"
            >
              <Link
                href={item.href}
                className={`group flex flex-col h-full rounded-2xl p-6 ${item.corBg} border border-black/[0.05] shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-0.5`}
              >
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="w-11 h-11 rounded-full bg-[#485742] flex items-center justify-center shadow-xs">
                    {item.icone}
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-white/70 text-[#214137] border border-black/5">
                    {item.badge}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-semibold text-[#214137] mb-1.5">
                  {item.titulo}
                </h3>
                <p className="text-xs font-semibold text-[#214137]/90 mb-3">
                  {item.subtitulo}
                </p>
                <p className="text-xs text-[#3B4D44]/85 leading-relaxed text-justify mb-6 flex-1">
                  {item.descricao}
                </p>

                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#214137] group-hover:text-[#152B24] mt-auto">
                  <span>{item.ctaTexto}</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Produtos Dinâmicos do Banco (Testes, Biblioteca, Receitas, Jogos, Downloads) */}
        {produtosDinamicosFiltrados.length > 0 && (
          <div className="pt-6 border-t border-[#DFDCD2]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-serif text-2xl font-medium text-[#214137]">
                Itens disponíveis para acesso ou download imediato
              </h3>
              <Link
                href="/produtos?categoria=biblioteca"
                className="text-xs sm:text-sm font-semibold text-[#485742] hover:text-[#214137] inline-flex items-center gap-1.5"
              >
                <span>Ver Biblioteca completa</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

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
          </div>
        )}
      </div>
    </section>
  );
}
