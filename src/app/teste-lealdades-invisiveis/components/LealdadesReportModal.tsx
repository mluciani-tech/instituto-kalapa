import { X, CheckCircle2, Heart, ArrowRight } from "lucide-react";
import { ResultadoLealdadesCalculado } from "../lib/calculo-lealdades";

interface LealdadesReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  resultado: ResultadoLealdadesCalculado;
}

export default function LealdadesReportModal({
  isOpen,
  onClose,
  resultado,
}: LealdadesReportModalProps) {
  if (!isOpen) return null;

  const perfil = resultado.perfilDominante;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative bg-[#FDFBF7] w-full max-w-4xl max-h-[90vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-slideUp">
        
        {/* Header Fixo */}
        <div className="shrink-0 border-b border-[#E8DEC8] px-6 py-5 flex items-center justify-between bg-white z-10">
          <div>
            <h2 className="text-xl font-serif font-bold text-[#1A3C4D]">Mapa de Cura Sistêmica</h2>
            <p className="text-xs text-[#1A3C4D]/60 font-light">
              Perfil: {perfil.nome}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-[#1A3C4D]/40 hover:text-[#1A3C4D] hover:bg-[#F8F4ED] rounded-full transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Conteúdo Rolável */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10 custom-scrollbar">
          <div className="max-w-3xl mx-auto space-y-10">

            <section>
              <h3 className="text-sm font-bold tracking-widest uppercase text-[#B8965A] mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Sintomas no Cotidiano
              </h3>
              <p className="text-[#1A3C4D]/80 leading-relaxed font-light bg-white p-5 rounded-2xl border border-[#E8DEC8]">
                {perfil.sintomas}
              </p>
            </section>

            <section>
              <h3 className="text-sm font-bold tracking-widest uppercase text-[#B8965A] mb-4 flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                O Passo Adulto (Má Consciência)
              </h3>
              <p className="text-[#1A3C4D]/80 leading-relaxed font-light bg-white p-5 rounded-2xl border border-[#E8DEC8]">
                {perfil.passoAdulto}
              </p>
            </section>

            <section className="bg-emerald-50 rounded-[2rem] p-6 sm:p-8 border border-emerald-100">
              <h3 className="text-sm font-bold tracking-widest uppercase text-emerald-800 mb-4 flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Exercício Somático e Falas de Cura
              </h3>
              <p className="text-emerald-900/80 leading-relaxed font-light mb-6">
                {perfil.exercicioSomatico.instrucao}
              </p>
              
              <div className="space-y-3">
                {perfil.exercicioSomatico.falas.map((fala, idx) => (
                  <div key={idx} className="flex gap-3 bg-white p-4 rounded-xl border border-emerald-100/50 shadow-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <p className="text-emerald-900 font-medium italic">"{fala}"</p>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </div>

      </div>
    </div>
  );
}

function AlertTriangle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}
