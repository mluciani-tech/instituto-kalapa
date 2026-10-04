import { Clock, CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react";
import { CronotipoQuestion, CronotipoOption } from "../data/cronotipo-data";

interface CronotipoQuestionCardProps {
  questao: CronotipoQuestion;
  respostaSelecionada?: string; // "A" | "B" | "C"
  onSelecionar: (letra: "A" | "B" | "C") => void;
  onVoltar: () => void;
  onAvancar: () => void;
  isUltima: boolean;
  isPrimeira: boolean;
}

export default function CronotipoQuestionCard({
  questao,
  respostaSelecionada,
  onSelecionar,
  onVoltar,
  onAvancar,
  isUltima,
  isPrimeira,
}: CronotipoQuestionCardProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Cabeçalho da Pergunta */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B8965A]/15 text-[#B8965A] text-xs font-semibold uppercase tracking-wider mb-3 border border-[#B8965A]/25">
          <Clock className="w-3.5 h-3.5 text-[#B8965A]" />
          <span>Dimensão {questao.id} • {questao.dimensao}</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-serif font-light text-[#1A3C4D] leading-snug">
          {questao.enunciado}
        </h2>
        <p className="text-xs sm:text-sm text-[#1A3C4D]/60 mt-2 font-light">
          Escolha a alternativa que melhor representa seu comportamento espontâneo:
        </p>
      </div>

      {/* Lista de Opções */}
      <div className="space-y-3.5 mb-8">
        {questao.opcoes.map((opcao: CronotipoOption) => {
          const selecionada = respostaSelecionada === opcao.letra;

          return (
            <button
              key={opcao.letra}
              type="button"
              onClick={() => onSelecionar(opcao.letra)}
              className={`w-full text-left p-5 sm:p-6 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 group ${
                selecionada
                  ? "border-[#B8965A] bg-white shadow-lg shadow-[#B8965A]/10 ring-2 ring-[#B8965A]/25"
                  : "border-[#E8DEC8] bg-[#FDFBF7] hover:border-[#B8965A]/60 hover:bg-white hover:shadow-sm"
              }`}
            >
              <div className="flex items-center gap-4">
                <span
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-semibold text-sm transition-colors shrink-0 ${
                    selecionada
                      ? "bg-[#1A3C4D] text-[#FAF6EF]"
                      : "bg-[#E8DEC8]/60 text-[#1A3C4D] group-hover:bg-[#B8965A]/20"
                  }`}
                >
                  {opcao.letra}
                </span>
                <span className="text-sm sm:text-base text-[#1A3C4D] font-normal leading-relaxed">
                  {opcao.texto}
                </span>
              </div>

              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
                  selecionada
                    ? "border-[#B8965A] bg-[#B8965A] text-white"
                    : "border-[#E8DEC8] group-hover:border-[#B8965A]/60"
                }`}
              >
                {selecionada && <CheckCircle2 className="w-4 h-4 text-white" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Navegação Inferior */}
      <div className="flex items-center justify-between pt-4 border-t border-[#E8DEC8]/60">
        <button
          type="button"
          onClick={onVoltar}
          disabled={isPrimeira}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
            isPrimeira
              ? "opacity-30 cursor-not-allowed text-[#1A3C4D]/40"
              : "text-[#1A3C4D]/70 hover:text-[#1A3C4D] hover:bg-[#E8DEC8]/30 cursor-pointer"
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Anterior</span>
        </button>

        <button
          type="button"
          onClick={onAvancar}
          disabled={!respostaSelecionada}
          className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            respostaSelecionada
              ? "bg-[#1A3C4D] hover:bg-[#15313F] text-white shadow-md shadow-[#1A3C4D]/15 cursor-pointer"
              : "opacity-40 cursor-not-allowed bg-gray-200 text-gray-400"
          }`}
        >
          <span>{isUltima ? "Ver Resultado" : "Próxima"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
