import { useState } from "react";
import {
  BookOpen,
  Sparkles,
  Compass,
  Briefcase,
  PenTool,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  HeartHandshake,
} from "lucide-react";
import { CartaMetamorfose, QUADRANTES_INFO } from "../data/metamorfose-data";
import { AnotacaoQuadranteCaderno } from "../lib/calculo-metamorfose";

interface MetamorfoseCardReadingProps {
  carta: CartaMetamorfose;
  anotacao: AnotacaoQuadranteCaderno;
  onChangeAnotacao: (novaAnotacao: AnotacaoQuadranteCaderno) => void;
  onTrocarCarta: () => void;
  onIrParaRitoDePassagem: () => void;
}

const OPCOES_RESSONANCIA = [
  "Alívio profundo e sensação de ser compreendido",
  "Aperto no peito ou nó na garganta",
  "Peso nos ombros ou cansaço físico reconhecido",
  "Frio no estômago / alerta de realidade",
  "Serenidade e confirmação silenciosa",
];

export default function MetamorfoseCardReading({
  carta,
  anotacao,
  onChangeAnotacao,
  onTrocarCarta,
  onIrParaRitoDePassagem,
}: MetamorfoseCardReadingProps) {
  const [cadernoAberto, setCadernoAberto] = useState(true);
  const qInfo = QUADRANTES_INFO[carta.quadrante_id];
  const isBlocoA = carta.bloco === "A";

  const atualizarCampo = (
    campo: keyof AnotacaoQuadranteCaderno,
    valor: string
  ) => {
    onChangeAnotacao({
      ...anotacao,
      [campo]: valor,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Cabeçalho da Carta Revelada */}
      <div className="bg-white rounded-[2.5rem] p-6 sm:p-10 lg:p-12 border border-[#E8DEC8] shadow-2xl shadow-[#E8DEC8]/40 relative overflow-hidden">
        <div
          className={`absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none ${
            isBlocoA ? "bg-amber-500/10" : "bg-[#7D8C6E]/15"
          }`}
        />

        {/* Topo: Código, Bloco e Ação de Trocar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-[#E8DEC8]">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-3.5 py-1.5 rounded-xl bg-[#1A3C4D] text-white font-serif font-bold text-sm">
              Carta {carta.id}
            </span>
            <span
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
                isBlocoA
                  ? "bg-amber-50 text-amber-900 border-amber-300"
                  : "bg-emerald-50 text-emerald-900 border-emerald-300"
              }`}
            >
              Bloco {carta.bloco} • {carta.categoria}
            </span>
          </div>

          <button
            type="button"
            onClick={onTrocarCarta}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1A3C4D]/55 hover:text-[#B8965A] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Voltar ao leque de {qInfo.nome}</span>
          </button>
        </div>

        {/* Título e Arquétipo */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#B8965A] mb-1">
            Quadrante {carta.quadrante_id}: {carta.quadrante_nome} • {carta.subtitulo}
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#1A3C4D] leading-tight">
            {carta.titulo}
          </h1>
        </div>

        {/* A Frase-Guia Estrutural para o Caderno */}
        <div
          className={`rounded-3xl p-6 sm:p-8 mb-8 border ${
            isBlocoA
              ? "bg-gradient-to-br from-[#FDFBF7] to-amber-50/40 border-[#B8965A]/40"
              : "bg-gradient-to-br from-[#FDFBF7] to-emerald-50/40 border-[#7D8C6E]/40"
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#B8965A] mb-2">
            <PenTool className="w-4 h-4" />
            <span>Frase-Guia Revelada no Campo (Para o seu Caderno)</span>
          </div>
          <p className="text-lg sm:text-xl font-serif italic text-[#1A3C4D] leading-relaxed text-justify">
            «{carta.mensagem_completa}»
          </p>
        </div>

        {/* As 4 Dimensões Analíticas da Carta (Inspiração Maha Lilah) */}
        <div className="space-y-5">
          {/* 1. Reflexão Sistêmica */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#F8F4ED] border border-[#E8DEC8]">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#1A3C4D] mb-2.5 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#B8965A]" />
              <span>1. Reflexão Sistêmica & Conexão com {carta.quadrante_nome}</span>
            </h3>
            <p className="text-sm sm:text-base text-[#1A3C4D]/85 font-light leading-relaxed text-justify">
              {carta.reflexao_sistemica}
            </p>
          </div>

          {/* 2. Dinâmica Interna & 3. Dinâmica Externa lado a lado em telas maiores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E8DEC8] shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#B8965A] mb-2.5 flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#B8965A]" />
                <span>2. Dinâmica Interna (Na Alma)</span>
              </h3>
              <p className="text-sm text-[#1A3C4D]/85 font-light leading-relaxed text-justify">
                {carta.dinamica_interna}
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E8DEC8] shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#7D8C6E] mb-2.5 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#7D8C6E]" />
                <span>3. Dinâmica Externa (Negócios & Vida)</span>
              </h3>
              <p className="text-sm text-[#1A3C4D]/85 font-light leading-relaxed text-justify">
                {carta.dinamica_externa}
              </p>
            </div>
          </div>

          {/* 4. Perguntas de Autoindagação & Caderno Híbrido */}
          <div className="rounded-3xl border border-[#B8965A]/40 bg-[#FDFBF7] overflow-hidden">
            <div className="p-5 sm:p-6 bg-[#F8F4ED] border-b border-[#E8DEC8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#1A3C4D] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#B8965A]" />
                  <span>4. Perguntas de Autoindagação Fenomenológica</span>
                </h3>
                <p className="text-xs text-[#1A3C4D]/65 font-light mt-1">
                  Silencie e responda no seu caderno físico ou registre abaixo para incluir no seu Dossiê em PDF A4.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setCadernoAberto((v) => !v)}
                className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs font-semibold text-[#B8965A] hover:text-[#977843] px-3 py-1.5 rounded-xl bg-white border border-[#E8DEC8] cursor-pointer shrink-0"
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>
                  {cadernoAberto
                    ? "Ocultar campos de escrita"
                    : "Escrever no Caderno Digital"}
                </span>
                {cadernoAberto ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-5">
              {carta.perguntas_autoindagacao.map((pergunta, idx) => {
                const key = (`resposta${idx + 1}`) as
                  | "resposta1"
                  | "resposta2"
                  | "resposta3";
                const valorAtual = anotacao[key] || "";

                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white border border-[#E8DEC8] space-y-2.5"
                  >
                    <p className="text-sm font-medium text-[#1A3C4D] leading-relaxed">
                      <span className="text-[#B8965A] font-bold mr-1.5">
                        {idx + 1}.
                      </span>
                      {pergunta}
                    </p>

                    {cadernoAberto && (
                      <textarea
                        rows={2}
                        value={valorAtual}
                        onChange={(e) => atualizarCampo(key, e.target.value)}
                        placeholder="Escreva aqui sua percepção íntima (ou anote em seu caderno de papel)..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDFBF7] border border-[#E8DEC8] text-xs sm:text-sm text-[#1A3C4D] placeholder:text-[#1A3C4D]/40 focus:outline-none focus:border-[#B8965A] transition-colors resize-y"
                      />
                    )}
                  </div>
                );
              })}

              {/* Ressonância Corporal */}
              {cadernoAberto && (
                <div className="p-4 sm:p-5 rounded-2xl bg-[#F8F4ED] border border-[#E8DEC8] space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1A3C4D]">
                    <HeartHandshake className="w-4 h-4 text-[#7D8C6E]" />
                    <span>
                      Ancoragem Somática: Onde seu corpo sentiu alívio ou aperto ao ler esta carta?
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {OPCOES_RESSONANCIA.map((opcao) => {
                      const ativa = anotacao.ressonanciaCorporal === opcao;
                      return (
                        <button
                          key={opcao}
                          type="button"
                          onClick={() =>
                            atualizarCampo(
                              "ressonanciaCorporal",
                              ativa ? "" : opcao
                            )
                          }
                          className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                            ativa
                              ? "bg-[#1A3C4D] text-white border-[#1A3C4D]"
                              : "bg-white text-[#1A3C4D]/75 border-[#E8DEC8] hover:border-[#B8965A]"
                          }`}
                        >
                          {opcao}
                        </button>
                      );
                    })}
                  </div>

                  <input
                    type="text"
                    value={anotacao.ressonanciaCorporal || ""}
                    onChange={(e) =>
                      atualizarCampo("ressonanciaCorporal", e.target.value)
                    }
                    placeholder="Ou descreva com suas palavras a sensação no corpo (ombros, peito, garganta, respiração)..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8DEC8] text-xs sm:text-sm text-[#1A3C4D] placeholder:text-[#1A3C4D]/40 focus:outline-none focus:border-[#B8965A]"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Botão para avançar ao Rito de Passagem */}
        <div className="mt-8 pt-6 border-t border-[#E8DEC8] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#1A3C4D]/60 font-light">
            Suas escolhas e anotações são salvas automaticamente nesta sessão.
          </p>

          <button
            type="button"
            onClick={onIrParaRitoDePassagem}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#1A3C4D] hover:bg-[#142F3D] text-white font-semibold text-sm sm:text-base transition-all shadow-lg shadow-[#1A3C4D]/20 flex items-center justify-center gap-3 group cursor-pointer"
          >
            <span>
              {carta.quadrante_id < 4
                ? `Realizar Rito de Passagem (${carta.quadrante_nome})`
                : "Concluir e Integrar as 4 Fases"}
            </span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
