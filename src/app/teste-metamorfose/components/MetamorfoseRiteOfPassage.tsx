import { useState, useEffect } from "react";
import {
  Wind,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Heart,
} from "lucide-react";
import { CartaMetamorfose, QUADRANTES_INFO } from "../data/metamorfose-data";
import { obterFalaConcordanciaCarta } from "../lib/calculo-metamorfose";

interface MetamorfoseRiteOfPassageProps {
  carta: CartaMetamorfose;
  onVoltarLeitura: () => void;
  onAvancarProximoQuadrante: () => void;
}

export default function MetamorfoseRiteOfPassage({
  carta,
  onVoltarLeitura,
  onAvancarProximoQuadrante,
}: MetamorfoseRiteOfPassageProps) {
  const qInfo = QUADRANTES_INFO[carta.quadrante_id];
  const rito = qInfo.ritoDePassagem;
  const falaConcordancia = obterFalaConcordanciaCarta(carta);
  const isBlocoA = carta.bloco === "A";

  const [respirando, setRespirando] = useState(false);
  const [cicloRespiracao, setCicloRespiracao] = useState(0); // 0 a 3
  const [faseAr, setFaseAr] = useState<"inspirar" | "sustentar" | "expirar">("inspirar");

  useEffect(() => {
    if (!respirando) return;
    if (cicloRespiracao >= 3) {
      setRespirando(false);
      return;
    }

    setFaseAr("inspirar");
    const t1 = setTimeout(() => setFaseAr("sustentar"), 3000);
    const t2 = setTimeout(() => setFaseAr("expirar"), 4500);
    const t3 = setTimeout(() => {
      setCicloRespiracao((c) => c + 1);
    }, 8000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [respirando, cicloRespiracao]);

  const iniciarTresRespiracoes = () => {
    setCicloRespiracao(0);
    setRespirando(true);
  };

  const proximoQuadranteNome =
    carta.quadrante_id === 1
      ? "Quadrante 2 — A Lagarta"
      : carta.quadrante_id === 2
      ? "Quadrante 3 — A Crisálida"
      : carta.quadrante_id === 3
      ? "Quadrante 4 — A Borboleta"
      : "Síntese e Integração da Jornada";

  return (
    <div className="max-w-3xl mx-auto animate-fadeIn">
      <div className="bg-gradient-to-b from-[#1A3C4D] to-[#142F3D] text-white rounded-[2.5rem] p-6 sm:p-10 lg:p-12 border border-[#B8965A]/40 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#B8965A]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

        {/* Topo */}
        <div className="relative z-10 flex items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
          <button
            type="button"
            onClick={onVoltarLeitura}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#E8DEC8]/70 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar à Carta {carta.id}</span>
          </button>

          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#B8965A]/20 text-[#E8DEC8] text-xs font-semibold uppercase tracking-widest border border-[#B8965A]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#B8965A]" />
            Rito de Passagem • {carta.quadrante_nome}
          </span>
        </div>

        {/* Título e Introdução do Rito */}
        <div className="relative z-10 text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-white mb-2 leading-snug">
            {rito.titulo}
          </h2>
          <p className="text-xs sm:text-sm uppercase tracking-widest text-[#B8965A] font-semibold mb-5">
            {rito.subtitulo}
          </p>
          <p className="text-sm sm:text-base text-[#E8DEC8]/85 font-light leading-relaxed text-justify">
            {rito.introducao}
          </p>
        </div>

        {/* Exercício Interior da Concordância (Bloco A ou Bloco B) */}
        <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-[#B8965A]/40 mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#B8965A] mb-3">
            <Heart className="w-4 h-4 text-[#B8965A]" />
            <span>
              O Exercício Interior da Concordância (Para a Carta {carta.id} •{" "}
              {isBlocoA ? "Bloco A: Ferida" : "Bloco B: Consciência Adulta"})
            </span>
          </div>

          <p className="text-xs text-[#E8DEC8]/75 mb-3 font-light">
            {isBlocoA
              ? "Não brigue com o seu projeto nem sinta vergonha. Olhe para a lealdade que veio à tona e diga em voz baixa ou internamente:"
              : "Respire fundo e abrace a realidade concreta da matéria. Reconheça internamente:"}
          </p>

          <blockquote className="p-4 sm:p-5 rounded-2xl bg-[#0D1E28]/70 border border-[#B8965A]/30 text-base sm:text-lg font-serif italic text-white leading-relaxed text-center">
            «{falaConcordancia}»
          </blockquote>
        </div>

        {/* Pausa de 3 Respirações Conscientes (Opcional e Suave) */}
        <div className="relative z-10 bg-white/5 rounded-3xl p-5 sm:p-6 border border-white/10 mb-8 text-center">
          <div className="flex flex-col items-center">
            {respirando ? (
              <div className="py-4 flex flex-col items-center">
                <div
                  className={`w-24 h-24 rounded-full border-2 border-[#B8965A] flex items-center justify-center transition-all duration-[3000ms] ${
                    faseAr === "inspirar"
                      ? "scale-125 bg-[#B8965A]/30"
                      : faseAr === "sustentar"
                      ? "scale-125 bg-[#7D8C6E]/30"
                      : "scale-90 bg-white/5"
                  }`}
                >
                  <span className="text-xs font-semibold uppercase tracking-widest text-white">
                    {faseAr === "inspirar"
                      ? "Inspire..."
                      : faseAr === "sustentar"
                      ? "Sustente..."
                      : "Solte..."}
                  </span>
                </div>
                <p className="mt-4 text-xs text-[#E8DEC8]/80">
                  Respiração {Math.min(cicloRespiracao + 1, 3)} de 3 — Deixe a frase repousar na alma.
                </p>
              </div>
            ) : cicloRespiracao >= 3 ? (
              <div className="py-2 flex items-center gap-2 text-emerald-300 text-xs sm:text-sm font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>Três respirações concluídas. Seu campo está pronto para o próximo passo.</span>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs sm:text-sm text-[#E8DEC8]/80 font-light max-w-lg mx-auto">
                  Antes de avançar, o manual convida você a fechar os olhos e realizar <strong>três respirações profundas</strong> para que a frase repouse no corpo.
                </p>
                <button
                  type="button"
                  onClick={iniciarTresRespiracoes}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-[#E8DEC8] text-xs font-semibold border border-white/20 transition-all cursor-pointer"
                >
                  <Wind className="w-4 h-4 text-[#B8965A]" />
                  <span>Guiar 3 Respirações de Ancoragem (~20s)</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Texto de Transição e Próxima Pergunta */}
        <div className="relative z-10 mb-8 p-5 rounded-2xl bg-[#0D1E28]/50 border border-white/10 space-y-2">
          <p className="text-xs sm:text-sm text-[#E8DEC8]/85 font-light leading-relaxed text-justify">
            {rito.textoTransicao}
          </p>
          {rito.proximaPergunta && (
            <p className="text-xs sm:text-sm font-medium text-[#B8965A] pt-1">
              Próxima pergunta condutora: «{rito.proximaPergunta}»
            </p>
          )}
        </div>

        {/* Botão de Avanço */}
        <div className="relative z-10 flex justify-center">
          <button
            type="button"
            onClick={onAvancarProximoQuadrante}
            className="w-full sm:w-auto px-10 py-4 rounded-full bg-[#B8965A] hover:bg-[#A3854F] text-white font-bold text-sm sm:text-base transition-all shadow-[0_0_40px_rgba(184,150,90,0.3)] flex items-center justify-center gap-3 group cursor-pointer"
          >
            <span>Avançar para {proximoQuadranteNome}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
