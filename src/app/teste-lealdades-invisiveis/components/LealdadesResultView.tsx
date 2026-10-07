import { FileText, ArrowRight, CheckCircle2 } from "lucide-react";
import { ResultadoLealdadesCalculado } from "../lib/calculo-lealdades";

interface LealdadesResultViewProps {
  resultado: ResultadoLealdadesCalculado;
  onAbrirRelatorio: () => void;
}

export default function LealdadesResultView({
  resultado,
  onAbrirRelatorio,
}: LealdadesResultViewProps) {
  const perfil = resultado.perfilDominante;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Card de Diagnóstico Principal */}
      <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-2xl shadow-[#E8DEC8]/40 border border-[#E8DEC8] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#B8965A]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        
        <div className="relative z-10 text-center mb-8">
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold tracking-widest uppercase mb-4 border border-emerald-200">
            Diagnóstico Sistêmico Concluído
          </span>
          <h2 className="text-sm font-semibold tracking-widest text-[#B8965A] uppercase mb-2">
            Seu Emaranhamento Dominante:
          </h2>
          <h1 className="text-4xl sm:text-5xl font-serif text-[#1A3C4D] leading-tight mb-4">
            {perfil.nome}
          </h1>
          <p className="text-lg sm:text-xl text-[#1A3C4D]/70 font-light max-w-2xl mx-auto">
            {perfil.subtitulo}
          </p>
        </div>

        <div className="bg-[#F8F4ED] rounded-3xl p-6 sm:p-8 mb-8 border border-[#E8DEC8]">
          <h3 className="text-sm font-bold tracking-widest uppercase text-[#B8965A] mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Raiz Oculta e Amor Cego
          </h3>
          <p className="text-[#1A3C4D]/80 leading-relaxed font-light text-sm sm:text-base">
            {perfil.raizOculta}
          </p>
        </div>

        {/* CTA para Relatório Detalhado */}
        <button
          onClick={onAbrirRelatorio}
          className="w-full sm:w-auto mx-auto flex items-center justify-center gap-2 bg-[#1A3C4D] hover:bg-[#15313F] text-white px-8 py-4 rounded-full font-semibold transition-all hover:shadow-lg hover:shadow-[#1A3C4D]/20 group cursor-pointer"
        >
          <FileText className="w-5 h-5" />
          <span>Acessar Relatório Completo & Caminho de Cura</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="text-center text-xs text-[#1A3C4D]/40 font-light">
        INstituto Kalapa • Baseado no legado de Bert Hellinger
      </div>
    </div>
  );
}
