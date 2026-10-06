"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Flame,
  Droplets,
  Compass,
  Clock,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
} from "lucide-react";
import TestShareMenu from "@/app/components/TestShareMenu";
import type { Produto } from "@/lib/types";

interface TesteInfo {
  slug: string;
  rota: string;
  titulo: string;
  badgeCategoria: string;
  badgeCor: string;
  badgeBorda: string;
  iconeCategoria: React.ReactNode;
  tempoEstimado: string;
  resumo: string;
  paragrafosCompletos: string[];
  destaques: string[];
  corDestaque: string;
  corBgDestaque: string;
  corBordaHover: string;
  corBotao: string;
  corBotaoHover: string;
  precoDefault: number;
}

const TESTES_DEFINICOES: TesteInfo[] = [
  {
    slug: "teste-yin-yang",
    rota: "/teste-yin-yang",
    titulo: "A Sabedoria do Yin-Yang & o Equilíbrio Energético",
    badgeCategoria: "MTC • 15 Dimensões",
    badgeCor: "bg-orange-100/80 text-orange-950",
    badgeBorda: "border-orange-200",
    iconeCategoria: (
      <>
        <Flame className="w-3.5 h-3.5 text-orange-600 shrink-0" />
        <Droplets className="w-3.5 h-3.5 text-blue-600 -ml-1 shrink-0" />
      </>
    ),
    tempoEstimado: "~3 min",
    resumo:
      "Fundamentado na Medicina Tradicional Chinesa, este teste mapeia as forças complementares que regem seu corpo, sono, disposição e metabolismo, identificando padrões de predominância e diretrizes para seu equilíbrio vital.",
    paragrafosCompletos: [
      "Fundamentado nos princípios da Medicina Tradicional Chinesa, o Yin-Yang representa a dinâmica de forças complementares que se expressam no corpo, nas emoções, nos comportamentos e na forma como nos relacionamos com a vida.",
      "Este teste observa aspectos como temperatura corporal, digestão, sono, disposição, metabolismo, emoções e respostas diante dos desafios, identificando tendências de predominância Yin ou Yang e possíveis padrões de desequilíbrio energético.",
      "Nosso padrão energético pode se manifestar em diferentes dimensões da vida: na disposição para agir e realizar, na relação com o descanso, na vitalidade, no controle do peso e na busca por realizações pessoais e profissionais.",
      "Na perspectiva da Medicina Tradicional Chinesa, o equilíbrio não é um estado fixo, mas um processo dinâmico de autorregulação. Yin e Yang estão em constante movimento, ajustando-se às transformações do organismo e dos ciclos naturais.",
      "Mais do que classificar, este teste é um convite à observação de si: reconhecer necessidades e favorecer uma relação mais consciente entre corpo, mente e ambiente.",
    ],
    destaques: [
      "15 Dimensões da Medicina Chinesa",
      "Mapeamento térmico, Wei Qi e sono",
      "Orientações de dietoterapia e fitoterapia",
      "Laudo Clínico em PDF A4 incluso",
    ],
    corDestaque: "text-orange-700",
    corBgDestaque: "bg-orange-50/70 border-orange-200/60",
    corBordaHover: "hover:border-orange-300",
    corBotao: "bg-[#1A3C4D] hover:bg-[#15313F]",
    corBotaoHover: "shadow-[#1A3C4D]/15",
    precoDefault: 47,
  },
  {
    slug: "teste-eneagrama",
    rota: "/teste-eneagrama",
    titulo: "A Sabedoria do Eneagrama & a Visão Sistêmica",
    badgeCategoria: "Eneagrama • 45 Dimensões",
    badgeCor: "bg-emerald-100/80 text-emerald-950",
    badgeBorda: "border-emerald-200",
    iconeCategoria: <Compass className="w-3.5 h-3.5 text-emerald-700 shrink-0" />,
    tempoEstimado: "~6 min",
    resumo:
      "Uma das mais profundas ferramentas de autoconhecimento humano. No INstituto Kalapa, integramos o Eneagrama às Constelações Familiares e à Psicologia Transpessoal para revelar seu tipo dominante, motivações inconscientes e caminho de evolução.",
    paragrafosCompletos: [
      "O Eneagrama é uma das ferramentas de autoconhecimento e transformação psicoespiritual mais profundas da psicologia moderna e da sabedoria ancestral.",
      "Longe de ser apenas um sistema de rotulagem comportamental, o Eneagrama atua como um mapa dinâmico da psique humana, revelando a distinção fundamental entre a nossa Essência e a estrutura do Ego.",
      "No INstituto Kalapa, integramos a sabedoria tradicional do Eneagrama com os princípios da Psicologia Transpessoal e Constelações Familiares de Bert Hellinger. Compreendemos que o eneatipo de uma pessoa é moldado na interseção entre a predisposição biológica e as dinâmicas do sistema familiar de origem.",
      "Faça seu teste e se autodesenvolva para transformar ainda mais sua vida com clareza e presença.",
    ],
    destaques: [
      "Identificação do Tipo Dominante (1 a 9)",
      "Mapeamento de fixações egóicas e feridas",
      "Integração sistêmica e transpessoal Kalapa",
      "Laudo Clínico em PDF A4 incluso",
    ],
    corDestaque: "text-[#7D8C6E]",
    corBgDestaque: "bg-[#7D8C6E]/10 border-[#7D8C6E]/20",
    corBordaHover: "hover:border-[#7D8C6E]/60",
    corBotao: "bg-[#7D8C6E] hover:bg-[#6C7B5D]",
    corBotaoHover: "shadow-[#7D8C6E]/20",
    precoDefault: 150,
  },
  {
    slug: "teste-cronotipo",
    rota: "/teste-cronotipo",
    titulo: "A Sabedoria do Cronotipo & o Ritmo Biológico",
    badgeCategoria: "Cronobiologia • 6 Dimensões",
    badgeCor: "bg-amber-100/80 text-amber-950",
    badgeBorda: "border-amber-200",
    iconeCategoria: <Clock className="w-3.5 h-3.5 text-[#B8965A] shrink-0" />,
    tempoEstimado: "~2 min",
    resumo:
      "O cronotipo é a expressão individual do seu relógio biológico. Descubra sua tendência natural circadiana (Cotovia, Urso ou Coruja) para otimizar janelas de energia, foco cognitivo, sono restaurador e tomadas de decisão ao longo do dia.",
    paragrafosCompletos: [
      "O cronotipo é uma expressão individual do nosso relógio biológico, revelando tendências naturais em relação aos horários de sono, vigília, energia, atenção e desempenho ao longo do dia.",
      "Mais do que definir se alguém é 'diurno' ou 'noturno', compreender o cronotipo é reconhecer que cada organismo possui um ritmo próprio, resultante da interação entre biologia, luz solar e rotina social.",
      "Quando conhecemos esse funcionamento, compreendemos melhor padrões de disposição, produtividade e regulação emocional — transformando o que parecia falta de disciplina em consciência corporal.",
      "Faça seu teste e descubra o seu cronotipo no INstituto Kalapa para viver em harmonia com sua natureza biológica.",
    ],
    destaques: [
      "Classificação Circadiana (Cotovia, Urso ou Coruja)",
      "Mapeamento de pico de energia e produtividade",
      "Dossiê personalizado com 30 tópicos",
      "Laudo Clínico em PDF A4 incluso",
    ],
    corDestaque: "text-[#B8965A]",
    corBgDestaque: "bg-[#B8965A]/10 border-[#B8965A]/25",
    corBordaHover: "hover:border-[#B8965A]/60",
    corBotao: "bg-[#1A3C4D] hover:bg-[#15313F]",
    corBotaoHover: "shadow-[#1A3C4D]/15",
    precoDefault: 10,
  },
];

interface TesteCardsGridProps {
  produtosDb?: Produto[];
}

export default function TesteCardsGrid({ produtosDb = [] }: TesteCardsGridProps) {
  const [expandidos, setExpandidos] = useState<Record<string, boolean>>({});

  const toggleExpandir = (slug: string) => {
    setExpandidos((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
      {TESTES_DEFINICOES.map((teste) => {
        // Localiza o produto correspondente no banco de dados para puxar o preço real dinâmico
        const prodDb = produtosDb.find(
          (p) =>
            p.slug === teste.slug ||
            p.slug === teste.slug.replace(/^teste-/, "") ||
            p.rota_teste === teste.rota
        );

        const precoFinal =
          prodDb?.preco_promocional ?? prodDb?.preco ?? teste.precoDefault;
        const precoFormatado =
          precoFinal <= 0
            ? "Acesso Livre"
            : `R$ ${precoFinal.toFixed(2).replace(".", ",")}`;

        const isExpandido = Boolean(expandidos[teste.slug]);

        return (
          <div
            key={teste.slug}
            className={`bg-white rounded-3xl p-6 sm:p-8 shadow-lg shadow-[#E8DEC8]/20 border border-[#E8DEC8] flex flex-col justify-between ${teste.corBordaHover} hover:shadow-xl transition-all duration-300 relative overflow-hidden group`}
          >
            {/* Efeito Glow no fundo */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#B8965A]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:bg-[#B8965A]/10 transition-colors pointer-events-none" />

            <div className="flex-1 flex flex-col">
              {/* Header do Card: Badges e Botão de Compartilhar */}
              <div className="flex items-center justify-between gap-2 mb-4 relative z-10">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap min-w-0">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border shrink-0 ${teste.badgeCor} ${teste.badgeBorda}`}
                  >
                    {teste.iconeCategoria}
                    <span>{teste.badgeCategoria}</span>
                  </span>

                  <span className="whitespace-nowrap inline-flex items-center gap-1 text-xs text-[#1A3C4D]/70 font-light shrink-0 bg-[#F8F4ED] px-2.5 py-1 rounded-full border border-[#E8DEC8]">
                    <Clock className="w-3 h-3 text-[#B8965A]" />
                    <span>{teste.tempoEstimado}</span>
                  </span>
                </div>

                <div className="shrink-0">
                  <TestShareMenu
                    variant="circle"
                    titulo={teste.titulo}
                    path={teste.rota}
                    convite={`Realize a avaliação ${teste.titulo} no INstituto Kalapa:`}
                  />
                </div>
              </div>

              {/* Título do Card */}
              <h2 className="text-xl sm:text-2xl font-serif font-medium text-[#1A3C4D] mb-3 leading-snug">
                {teste.titulo}
              </h2>

              {/* Resumo Conceitual Conciso (Evita buracos de texto e uniformiza os cards) */}
              <p className="text-xs sm:text-sm text-[#1A3C4D]/80 font-light leading-relaxed mb-5 text-left">
                {teste.resumo}
              </p>

              {/* Destaques e Entregáveis do Teste */}
              <div className="mb-5 space-y-2">
                <p className="text-[11px] uppercase tracking-wider font-semibold text-[#1A3C4D]/60 mb-2">
                  O que está incluso:
                </p>
                <div className="space-y-1.5">
                  {teste.destaques.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-xs text-[#1A3C4D]/85"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#B8965A] shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Leitura Detalhada Opcional / Expansível */}
              <div className="mb-5">
                <button
                  type="button"
                  onClick={() => toggleExpandir(teste.slug)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#B8965A] hover:text-[#977843] transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>
                    {isExpandido
                      ? "Ocultar detalhes conceituais"
                      : "Ler fundamentação conceitual"}
                  </span>
                  {isExpandido ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>

                {isExpandido && (
                  <div className="mt-3 p-4 rounded-2xl bg-[#F8F4ED] border border-[#E8DEC8] space-y-2.5 text-xs text-[#1A3C4D]/80 leading-relaxed font-light animate-fadeIn">
                    {teste.paragrafosCompletos.map((paragrafo, i) => (
                      <p key={i}>{paragrafo}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Rodapé do Card: Box de Investimento Dinâmico e Botão de Ação */}
            <div className="pt-4 border-t border-[#E8DEC8]/80 mt-2 space-y-4">
              <div className="flex items-center justify-between gap-3 bg-[#FDFBF7] p-3 rounded-2xl border border-[#E8DEC8]">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[#1A3C4D]/60 block leading-tight">
                    Investimento
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg sm:text-xl font-serif font-bold text-[#1A3C4D]">
                      {precoFormatado}
                    </span>
                    <span className="text-[11px] text-[#1A3C4D]/60 font-light">
                      / avaliação
                    </span>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Laudo PDF</span>
                </span>
              </div>

              <Link
                href={teste.rota}
                className={`w-full py-3.5 px-5 rounded-2xl text-white text-xs sm:text-sm font-semibold transition-all duration-200 shadow-md ${teste.corBotao} ${teste.corBotaoHover} flex items-center justify-center gap-2 group-hover:gap-3 cursor-pointer`}
              >
                <span>Iniciar {teste.titulo.split("&")[0].trim()}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
