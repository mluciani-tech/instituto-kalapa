import { Flame, Droplets, CheckCircle2 } from "lucide-react";
import { YinYangQuestion } from "../data/yin-yang-data";

interface QuestionCardProps {
  perguntaAtual: YinYangQuestion;
  respostaAtual?: "yang" | "yin";
  handleSelecionarResposta: (tipo: "yang" | "yin") => void;
}

export default function QuestionCard({
  perguntaAtual,
  respostaAtual,
  handleSelecionarResposta,
}: QuestionCardProps) {
  return (
    <>
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 text-2xl mb-2">
          <span>{perguntaAtual.icone}</span>
        </div>
        <p className="text-xs uppercase tracking-wider font-semibold text-[#B8965A] mb-1">
          Dimensão #{perguntaAtual.id}
        </p>
        <h2 className="text-2xl sm:text-3xl font-serif font-light text-[#1A3C4D]">
          {perguntaAtual.categoria}
        </h2>
        <p className="text-xs sm:text-sm text-[#1A3C4D]/60 mt-1">
          Qual destes dois padrões descreve melhor como seu corpo ou sua mente funcionam habitualmente?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
        {/* Opção Yang */}
        <button
          type="button"
          onClick={() => handleSelecionarResposta("yang")}
          className={`relative text-left p-6 sm:p-7 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
            respostaAtual === "yang"
              ? "border-[#B8965A] bg-[#B8965A]/5 shadow-md ring-2 ring-[#B8965A]/20"
              : "border-[#E8DEC8] bg-[#FDFBF7] hover:border-[#B8965A]/60 hover:bg-white"
          }`}
        >
          <div>
            <div className="flex items-start justify-between mb-4">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wider bg-orange-100 text-orange-800 border border-orange-200">
                <Flame className="w-4 h-4 text-orange-600" /> {perguntaAtual.ladoYang.titulo}
              </span>
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors shrink-0 mt-0.5 ${
                  respostaAtual === "yang"
                    ? "border-[#B8965A] bg-[#B8965A] text-white"
                    : "border-[#E8DEC8]"
                }`}
              >
                {respostaAtual === "yang" && <CheckCircle2 className="w-4 h-4" />}
              </div>
            </div>
            <p className="text-sm text-[#1A3C4D]/80 font-light leading-relaxed">
              {perguntaAtual.ladoYang.descricao}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E8DEC8]/50 flex items-center justify-between text-xs text-[#1A3C4D]/50">
            <span>Natureza: Calor / Atividade</span>
            <span className="font-semibold text-orange-700">+1 Yang</span>
          </div>
        </button>

        {/* Opção Yin */}
        <button
          type="button"
          onClick={() => handleSelecionarResposta("yin")}
          className={`relative text-left p-6 sm:p-7 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
            respostaAtual === "yin"
              ? "border-[#7D8C6E] bg-[#7D8C6E]/5 shadow-md ring-2 ring-[#7D8C6E]/20"
              : "border-[#E8DEC8] bg-[#FDFBF7] hover:border-[#7D8C6E]/60 hover:bg-white"
          }`}
        >
          <div>
            <div className="flex items-start justify-between mb-4">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
                <Droplets className="w-4 h-4 text-blue-600" /> {perguntaAtual.ladoYin.titulo}
              </span>
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors shrink-0 mt-0.5 ${
                  respostaAtual === "yin"
                    ? "border-[#7D8C6E] bg-[#7D8C6E] text-white"
                    : "border-[#E8DEC8]"
                }`}
              >
                {respostaAtual === "yin" && <CheckCircle2 className="w-4 h-4" />}
              </div>
            </div>
            <p className="text-sm text-[#1A3C4D]/80 font-light leading-relaxed">
              {perguntaAtual.ladoYin.descricao}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E8DEC8]/50 flex items-center justify-between text-xs text-[#1A3C4D]/50">
            <span>Natureza: Frio / Repouso</span>
            <span className="font-semibold text-blue-700">+1 Yin</span>
          </div>
        </button>
      </div>
    </>
  );
}
