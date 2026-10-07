import { LealdadeQuestion } from "../data/lealdades-data";

interface LealdadesQuestionCardProps {
  questao: LealdadeQuestion;
  onResponder: (letra: string) => void;
}

export default function LealdadesQuestionCard({
  questao,
  onResponder,
}: LealdadesQuestionCardProps) {
  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-[2rem] p-6 sm:p-10 lg:p-12 shadow-xl shadow-[#E8DEC8]/30 border border-[#E8DEC8] animate-fadeIn">
      <div className="mb-8">
        <span className="inline-block px-3 py-1 rounded-full bg-[#B8965A]/10 text-[#B8965A] text-xs font-bold tracking-widest uppercase mb-4 border border-[#B8965A]/20">
          {questao.tema}
        </span>
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif text-[#1A3C4D] leading-tight text-center sm:text-left">
          {questao.pergunta}
        </h3>
      </div>

      <div className="space-y-3">
        {questao.opcoes.map((opcao) => (
          <button
            key={opcao.letra}
            onClick={() => onResponder(opcao.letra)}
            className="w-full text-left p-4 sm:p-5 rounded-2xl border-2 border-[#E8DEC8] hover:border-[#B8965A] hover:bg-[#FDFBF7] transition-all group flex gap-4 cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#B8965A]/20"
          >
            <div className="w-8 h-8 rounded-full bg-[#F8F4ED] text-[#1A3C4D] font-serif font-bold flex items-center justify-center shrink-0 border border-[#E8DEC8] group-hover:bg-[#B8965A] group-hover:text-white group-hover:border-[#B8965A] transition-colors">
              {opcao.letra}
            </div>
            <p className="text-sm sm:text-base text-[#1A3C4D]/80 leading-relaxed font-light flex-1">
              {opcao.texto}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
