import { YinYangQuestion } from "../data/yin-yang-data";

interface ProgressIndicatorProps {
  perguntas: YinYangQuestion[];
  perguntaAtualIndex: number;
  respostas: Record<number, "yang" | "yin">;
  setPerguntaAtualIndex: (index: number) => void;
}

export default function ProgressIndicator({
  perguntas,
  perguntaAtualIndex,
  respostas,
  setPerguntaAtualIndex,
}: ProgressIndicatorProps) {
  const totalRespondidas = Object.keys(respostas).length;
  const progressPercent = Math.round((totalRespondidas / perguntas.length) * 100);
  const currentPercent = ((perguntaAtualIndex + 1) / perguntas.length) * 100;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between text-xs sm:text-sm text-[#1A3C4D]/70 mb-2 font-medium">
        <span className="flex items-center gap-1.5">
          <span className="text-[#B8965A] font-semibold">Questão {perguntaAtualIndex + 1}</span> de {perguntas.length}
        </span>
        <span>{progressPercent}% respondido</span>
      </div>

      <div className="w-full h-2 bg-[#E8DEC8]/50 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#B8965A] to-[#7D8C6E] transition-all duration-300"
          style={{ width: `${currentPercent}%` }}
        />
      </div>

      <div className="flex flex-wrap gap-1.5 mt-3 justify-center">
        {perguntas.map((p, idx) => {
          const respondida = respostas[p.id] !== undefined;
          const isCurrent = idx === perguntaAtualIndex;
          return (
            <button
              key={p.id}
              onClick={() => setPerguntaAtualIndex(idx)}
              className={`w-7 h-7 rounded-lg text-xs font-medium transition-all ${
                isCurrent
                  ? "bg-[#1A3C4D] text-white ring-2 ring-[#1A3C4D]/30"
                  : respondida
                  ? "bg-[#7D8C6E]/20 text-[#7D8C6E] hover:bg-[#7D8C6E]/30"
                  : "bg-[#F8F4ED] text-[#1A3C4D]/50 hover:bg-[#E8DEC8]/50"
              }`}
              title={`Ir para pergunta ${p.id}: ${p.categoria}`}
            >
              {p.id}
            </button>
          );
        })}
      </div>
    </div>
  );
}
