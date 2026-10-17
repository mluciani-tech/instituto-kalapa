import { useState } from "react";
import {
  FileText,
  ArrowRight,
  Calendar,
  ShoppingBag,
  RotateCcw,
  Sparkles,
  Scale,
  Volume2,
  Clock,
  ChevronDown,
  ChevronUp,
  Heart,
} from "lucide-react";
import {
  ResultadoMetamorfoseCalculado,
  obterFalaConcordanciaCarta,
} from "../lib/calculo-metamorfose";
import SupportNotice from "@/components/SupportNotice";

interface MetamorfoseResultViewProps {
  resultado: ResultadoMetamorfoseCalculado;
  onAbrirRelatorio: () => void;
  onReiniciar?: () => void;
  onComprarNovoTeste?: () => void;
  creditosRestantes?: number;
  dataRealizacao?: string | null;
}

export default function MetamorfoseResultView({
  resultado,
  onAbrirRelatorio,
  onReiniciar,
  onComprarNovoTeste,
  creditosRestantes = 0,
  dataRealizacao,
}: MetamorfoseResultViewProps) {
  const [cartaExpandida, setCartaExpandida] = useState<number | null>(null);
  const { cartas, balanca } = resultado;

  const toggleCarta = (qId: number) => {
    setCartaExpandida((prev) => (prev === qId ? null : qId));
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Banner Informativo de Avaliação Concluída / Histórico */}
      {dataRealizacao && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#1A3C4D]/5 border border-[#B8965A]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs sm:text-sm text-[#1A3C4D]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#B8965A]/15 text-[#B8965A] flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-[#1A3C4D]">
                Vivência realizada em {dataRealizacao}
              </p>
              <p className="text-[#1A3C4D]/70 text-xs">
                Seu Dossiê Completo de 6 páginas A4 com as 4 cartas e suas anotações está disponível para impressão/PDF.
              </p>
            </div>
          </div>

          {creditosRestantes > 0 ? (
            <button
              type="button"
              onClick={onReiniciar}
              className="px-4 py-2.5 rounded-xl bg-[#7D8C6E] hover:bg-[#6C7B5D] text-white text-xs font-semibold transition-all shadow-sm flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>
                Nova Jornada ({creditosRestantes} crédito
                {creditosRestantes > 1 ? "s" : ""})
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onComprarNovoTeste}
              className="px-4 py-2.5 rounded-xl bg-[#B8965A] hover:bg-[#A3834C] text-white text-xs font-semibold transition-all shadow-sm flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Adquirir nova sessão do Jogo</span>
            </button>
          )}
        </div>
      )}

      {/* 1. Card Principal: A Equação Narrativa Contínua da Alma */}
      <div className="bg-white rounded-[2.5rem] p-6 sm:p-10 lg:p-12 shadow-2xl shadow-[#E8DEC8]/40 border border-[#E8DEC8] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#B8965A]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

        <div className="relative z-10 text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold tracking-widest uppercase mb-4 border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Jornada Completa • As 4 Fases Reveladas
          </span>

          <p className="text-xs font-semibold tracking-widest text-[#B8965A] uppercase mb-2">
            {resultado.temaEmSilencio
              ? `${resultado.categoriaTemaLabel} • Tema em Silêncio`
              : resultado.temaDescricao
              ? `${resultado.categoriaTemaLabel}: ${resultado.temaDescricao}`
              : resultado.categoriaTemaLabel}
          </p>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#1A3C4D] leading-tight mb-3">
            O Diagnóstico Narrativo da Sua Alma
          </h1>

          <p className="text-sm sm:text-base text-[#1A3C4D]/70 font-light max-w-2xl mx-auto">
            Ao retirar as quatro cartas ao longo do jogo, você construiu diante de si uma equação narrativa contínua que descreve a trajetória oculta do seu tema desde a raiz até o voo maduro.
          </p>
        </div>

        {/* Pergaminho da Leitura em Voz Alta (Etapa 4 do Manual) */}
        <div className="bg-gradient-to-br from-[#1A3C4D] via-[#142F3D] to-[#0D1E28] text-white rounded-3xl p-6 sm:p-8 lg:p-10 mb-8 border border-[#B8965A]/40 shadow-xl">
          <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-white/15">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#B8965A]/20 text-[#B8965A] flex items-center justify-center shrink-0">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#B8965A]">
                  Etapa 4: Leitura Contínua em Voz Alta
                </h2>
                <p className="text-xs text-[#E8DEC8]/75 font-light">
                  Leia as quatro frases abaixo em sequência contínua e em voz alta, escutando a resposta do seu corpo:
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {([1, 2, 3, 4] as const).map((qId) => {
              const c = cartas[qId];
              return (
                <div
                  key={qId}
                  className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#B8965A]">
                      {qId}. {c.quadrante_nome} — Carta {c.id}: {c.titulo}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                        c.bloco === "A"
                          ? "bg-amber-400/20 text-amber-200 border border-amber-400/30"
                          : "bg-emerald-400/20 text-emerald-200 border border-emerald-400/30"
                      }`}
                    >
                      Bloco {c.bloco}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base font-serif italic text-white leading-relaxed text-justify">
                    «{c.mensagem_completa}»
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. A Balança entre a Ferida (Bloco A) e a Consciência Adulta (Bloco B) */}
        <div className="bg-[#F8F4ED] rounded-3xl p-6 sm:p-8 mb-8 border border-[#E8DEC8]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-[#E8DEC8]">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#B8965A]/15 text-[#B8965A] flex items-center justify-center shrink-0">
                <Scale className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#B8965A]">
                  Etapa 5: A Balança das Forças em Jogo
                </p>
                <h3 className="text-xl sm:text-2xl font-serif font-semibold text-[#1A3C4D]">
                  {balanca.titulo}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="px-3 py-1.5 rounded-xl bg-amber-100/80 text-amber-900 border border-amber-300 text-xs font-bold">
                Bloco A (Ferida): {balanca.totalBlocoA}
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-emerald-100/80 text-emerald-900 border border-emerald-300 text-xs font-bold">
                Bloco B (Adulto): {balanca.totalBlocoB}
              </span>
            </div>
          </div>

          <p className="text-sm sm:text-base text-[#1A3C4D]/85 font-light leading-relaxed mb-5 text-justify">
            {balanca.analiseFenomenologica}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-[#E8DEC8]">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#B8965A] mb-1">
                Pergunta-Chave de Diagnóstico
              </p>
              <p className="text-xs sm:text-sm font-serif italic text-[#1A3C4D]">
                «{balanca.perguntaChave}»
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[#E8DEC8]">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#7D8C6E] mb-1">
                Postura Sistêmica Recomendada
              </p>
              <p className="text-xs sm:text-sm text-[#1A3C4D]/80 font-light leading-relaxed text-justify">
                {balanca.posturaRecomendada}
              </p>
            </div>
          </div>
        </div>

        {/* 3. Revisão detalhada das 4 Cartas Sorteadas (Acordeão) */}
        <div className="mb-8 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#1A3C4D]/70 mb-2">
            Detalhamento das 4 Cartas da Sua Tiragem (Clique para expandir):
          </h3>

          {([1, 2, 3, 4] as const).map((qId) => {
            const c = cartas[qId];
            const aberta = cartaExpandida === qId;
            const fala = obterFalaConcordanciaCarta(c);
            const notas = resultado.caderno[qId];

            return (
              <div
                key={qId}
                className="rounded-2xl border border-[#E8DEC8] bg-[#FDFBF7] overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleCarta(qId)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left hover:bg-[#F8F4ED] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="px-3 py-1 rounded-lg bg-[#1A3C4D] text-white font-serif font-bold text-xs shrink-0">
                      {c.id}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#B8965A]">
                        Quadrante {qId}: {c.quadrante_nome} • Bloco {c.bloco}
                      </p>
                      <h4 className="text-sm sm:text-base font-serif font-semibold text-[#1A3C4D] truncate">
                        {c.titulo} — <span className="font-normal italic text-[#1A3C4D]/70">{c.subtitulo}</span>
                      </h4>
                    </div>
                  </div>
                  {aberta ? (
                    <ChevronUp className="w-4 h-4 text-[#1A3C4D]/60 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#1A3C4D]/60 shrink-0" />
                  )}
                </button>

                {aberta && (
                  <div className="p-4 sm:p-6 pt-0 border-t border-[#E8DEC8]/70 space-y-4 text-xs sm:text-sm text-[#1A3C4D]/85 font-light animate-fadeIn">
                    <div className="pt-4">
                      <p className="font-bold text-[#1A3C4D] text-xs uppercase mb-1">
                        1. Reflexão Sistêmica:
                      </p>
                      <p className="text-justify leading-relaxed">{c.reflexao_sistemica}</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-3.5 rounded-xl bg-white border border-[#E8DEC8]">
                        <p className="font-bold text-[#B8965A] text-xs uppercase mb-1">
                          2. Dinâmica Interna (Na Alma):
                        </p>
                        <p className="text-justify leading-relaxed">{c.dinamica_interna}</p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-white border border-[#E8DEC8]">
                        <p className="font-bold text-[#7D8C6E] text-xs uppercase mb-1">
                          3. Dinâmica Externa (Negócios & Vida):
                        </p>
                        <p className="text-justify leading-relaxed">{c.dinamica_externa}</p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                      <p className="font-bold text-emerald-900 text-xs uppercase mb-1 flex items-center gap-1.5">
                        <Heart className="w-3.5 h-3.5" />
                        Fala de Concordância deste Quadrante:
                      </p>
                      <p className="italic font-serif text-emerald-950">«{fala}»</p>
                    </div>

                    {(notas?.resposta1 ||
                      notas?.resposta2 ||
                      notas?.resposta3 ||
                      notas?.ressonanciaCorporal) && (
                      <div className="p-3.5 rounded-xl bg-[#F8F4ED] border border-[#E8DEC8] space-y-1.5">
                        <p className="font-bold text-[#1A3C4D] text-xs uppercase">
                          Suas Anotações no Caderno:
                        </p>
                        {notas.resposta1 && <p>• <strong>P1:</strong> {notas.resposta1}</p>}
                        {notas.resposta2 && <p>• <strong>P2:</strong> {notas.resposta2}</p>}
                        {notas.resposta3 && <p>• <strong>P3:</strong> {notas.resposta3}</p>}
                        {notas.ressonanciaCorporal && (
                          <p>• <strong>Ressonância Corporal:</strong> {notas.ressonanciaCorporal}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 4. A Sabedoria da Não-Intervenção Imediata (As 72 Horas) */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[#FDFBF7] border border-[#B8965A]/40 mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#B8965A] mb-2">
            <Clock className="w-4 h-4" />
            <span>A Sabedoria da Não-Intervenção Imediata (72 Horas de Silêncio)</span>
          </div>
          <p className="text-xs sm:text-sm text-[#1A3C4D]/80 font-light leading-relaxed text-justify">
            Como ensina Bert Hellinger em <em>A Fonte Não Precisa Perguntar pelo Caminho</em>, as compreensões sistêmicas atuam como sementes na escuridão fértil da alma. Após emitir o seu Dossiê, guarde-o em silêncio. <strong>Não discuta as revelações com terceiros nem tente tomar decisões precipitadas nas próximas 72 horas.</strong> Deixe que a imagem vista atue por si mesma nas camadas profundas da sua consciência. Quando não perturbada pela pressa do ego, a vida sempre encontra o seu próprio curso.
          </p>
        </div>

        {/* CTAs Principais */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={onAbrirRelatorio}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-[#1A3C4D] hover:bg-[#15313F] text-white px-8 py-4 rounded-full font-semibold transition-all hover:shadow-lg hover:shadow-[#1A3C4D]/20 group cursor-pointer"
          >
            <FileText className="w-5 h-5 text-[#B8965A]" />
            <span>Acessar Dossiê Completo em PDF (6 Páginas A4)</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          {creditosRestantes > 0 ? (
            <button
              type="button"
              onClick={onReiniciar}
              className="w-full sm:w-auto flex items-center justify-center gap-2 border border-[#7D8C6E] bg-white hover:bg-[#7D8C6E]/10 text-[#7D8C6E] px-6 py-4 rounded-full font-semibold transition-all cursor-pointer text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Iniciar Nova Tiragem ({creditosRestantes})</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onComprarNovoTeste}
              className="w-full sm:w-auto flex items-center justify-center gap-2 border border-[#B8965A] bg-[#B8965A]/10 hover:bg-[#B8965A]/20 text-[#B8965A] px-6 py-4 rounded-full font-semibold transition-all cursor-pointer text-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Adquirir nova sessão do Jogo</span>
            </button>
          )}
        </div>
      </div>

      <SupportNotice />

      <div className="text-center text-xs text-[#1A3C4D]/40 font-light">
        INstituto Kalapa • Fundamentado em Bert Hellinger, Jan Jacob Stam, Joan Garriga e Maha Lilah
      </div>
    </div>
  );
}
