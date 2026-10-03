interface EneagramaProgressIndicatorProps {
  atual: number; // 0 a 44
  total: number; // 45
  onReiniciar: () => void;
}

export default function EneagramaProgressIndicator({
  atual,
  total,
  onReiniciar,
}: EneagramaProgressIndicatorProps) {
  const percentual = Math.round(((atual + 1) / total) * 100);

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 sm:mb-10">
      <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-[#1A3C4D]/70 mb-2.5">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#7D8C6E] animate-pulse" />
          Afirmação <strong className="text-[#1A3C4D]">{atual + 1}</strong> de {total}
        </span>
        <div className="flex items-center gap-4">
          <span className="text-[#7D8C6E] font-semibold">{percentual}% concluído</span>
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
          className="h-full bg-gradient-to-r from-[#7D8C6E] to-[#B8965A] rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentual}%` }}
        />
      </div>
    </div>
  );
}
