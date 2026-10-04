interface CronotipoProgressIndicatorProps {
  atual: number; // 0 a 5
  total: number; // 6
  onReiniciar: () => void;
}

export default function CronotipoProgressIndicator({
  atual,
  total,
  onReiniciar,
}: CronotipoProgressIndicatorProps) {
  const percentual = Math.round(((atual + 1) / total) * 100);

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 sm:mb-10">
      <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-[#1A3C4D]/70 mb-2.5">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#B8965A] animate-pulse" />
          Pergunta <strong className="text-[#1A3C4D]">{atual + 1}</strong> de {total}
        </span>
        <div className="flex items-center gap-4">
          <span className="text-[#B8965A] font-semibold">{percentual}% concluído</span>
          <button
            type="button"
            onClick={onReiniciar}
            className="text-xs text-[#1A3C4D]/50 hover:text-red-700 transition-colors underline decoration-dotted cursor-pointer"
          >
            Recomeçar
          </button>
        </div>
      </div>

      {/* Barra de Progresso */}
      <div className="w-full h-2.5 bg-[#E8DEC8]/50 rounded-full overflow-hidden p-0.5 border border-[#E8DEC8]">
        <div
          className="h-full bg-gradient-to-r from-[#1A3C4D] via-[#B8965A] to-[#D4AF37] rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentual}%` }}
        />
      </div>
    </div>
  );
}
