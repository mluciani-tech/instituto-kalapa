import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { EneagramaStatement, ESCALA_NOTAS } from "../data/eneagrama-data";

interface EneagramaQuestionCardProps {
  afirmacaoAtual: EneagramaStatement;
  notaAtual?: number;
  onSelecionarNota: (nota: number) => void;
  onVoltar: () => void;
  onAvancar: () => void;
  podeVoltar: boolean;
  podeAvancar: boolean;
  isUltima: boolean;
  onConcluir: () => void;
}

export default function EneagramaQuestionCard({
  afirmacaoAtual,
  notaAtual,
  onSelecionarNota,
  onVoltar,
  onAvancar,
  podeVoltar,
  podeAvancar,
  isUltima,
  onConcluir,
}: EneagramaQuestionCardProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Card da Afirmação */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-[#E8DEC8]/20 border border-[#E8DEC8] text-center relative overflow-hidden mb-6">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#7D8C6E]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-[#B8965A]/5 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4" />

        <div className="relative">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#F8F4ED] text-[#B8965A] border border-[#E8DEC8] mb-4">
            Afirmação #{afirmacaoAtual.indiceGlobal}
          </span>

          {/* Texto da Afirmação */}
          <h2 className="text-xl sm:text-2xl md:text-2xl font-serif font-normal text-[#1A3C4D] leading-relaxed mb-6 px-2 sm:px-4">
            &ldquo;{afirmacaoAtual.texto}&rdquo;
          </h2>

          <p className="text-xs sm:text-sm text-[#1A3C4D]/60 font-light mb-8 max-w-md mx-auto">
            Avalie o quanto esta frase descrevia a sua forma habitual de agir e reagir (especialmente entre seus 18 e 25 anos):
          </p>

          {/* Escala de 0 a 5 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 sm:gap-3 mb-4">
            {ESCALA_NOTAS.map((item) => {
              const selecionada = notaAtual === item.valor;
              return (
                <button
                  key={item.valor}
                  type="button"
                  onClick={() => onSelecionarNota(item.valor)}
                  className={`flex flex-col items-center justify-between p-3 sm:p-3.5 rounded-2xl border-2 transition-all cursor-pointer group text-center ${
                    selecionada
                      ? "border-[#7D8C6E] bg-[#7D8C6E]/10 shadow-md ring-2 ring-[#7D8C6E]/20 scale-102"
                      : "border-[#E8DEC8] bg-[#FDFBF7] hover:border-[#7D8C6E]/60 hover:bg-white"
                  }`}
                >
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-base sm:text-lg mb-2 transition-colors ${
                      selecionada
                        ? "bg-[#7D8C6E] text-white"
                        : "bg-[#E8DEC8]/40 text-[#1A3C4D] group-hover:bg-[#7D8C6E]/20"
                    }`}
                  >
                    {selecionada ? <Check className="w-5 h-5" /> : item.rotulo}
                  </div>
                  <span
                    className={`text-[11px] sm:text-xs leading-tight transition-colors ${
                      selecionada
                        ? "font-semibold text-[#1A3C4D]"
                        : "text-[#1A3C4D]/75 group-hover:text-[#1A3C4D]"
                    }`}
                  >
                    {item.descricao}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Barra de Navegação Inferior */}
      <div className="flex items-center justify-between gap-4 px-2">
        <button
          type="button"
          onClick={onVoltar}
          disabled={!podeVoltar}
          className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-medium transition-all ${
            podeVoltar
              ? "bg-white border border-[#E8DEC8] text-[#1A3C4D] hover:bg-[#F8F4ED] cursor-pointer shadow-xs"
              : "opacity-40 text-gray-400 border border-gray-200 cursor-not-allowed"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Anterior</span>
        </button>

        {isUltima ? (
          <button
            type="button"
            onClick={onConcluir}
            disabled={typeof notaAtual !== "number"}
            className={`inline-flex items-center gap-2 px-6 sm:px-8 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-md ${
              typeof notaAtual === "number"
                ? "bg-[#7D8C6E] hover:bg-[#6C7B5D] text-white shadow-[#7D8C6E]/20 cursor-pointer"
                : "opacity-50 bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <span>Ver Meu Diagnóstico</span>
            <Check className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onAvancar}
            disabled={!podeAvancar}
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              podeAvancar
                ? "bg-white border border-[#E8DEC8] text-[#1A3C4D] hover:bg-[#F8F4ED] cursor-pointer shadow-xs"
                : "opacity-40 text-gray-400 border border-gray-200 cursor-not-allowed"
            }`}
          >
            <span>Próxima</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
