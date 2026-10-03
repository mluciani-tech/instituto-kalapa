import { useEffect } from "react";
import Image from "next/image";
import { X, Printer, Compass, Heart, Shield, HelpCircle, CheckCircle2 } from "lucide-react";
import { ResultadoEneagramaCalculado } from "../lib/calculo-eneagrama";

interface EneagramaReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  resultado: ResultadoEneagramaCalculado;
  usuarioNome?: string;
  usuarioEmail?: string;
}

export default function EneagramaReportModal({
  isOpen,
  onClose,
  resultado,
  usuarioNome,
  usuarioEmail,
}: EneagramaReportModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const dataAtual = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const handlePrint = () => {
    window.print();
  };

  const tipo = resultado.tipoDominante;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static print:overflow-visible">
      {/* Container Principal */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-[#E8DEC8] my-auto print:border-none print:shadow-none print:p-0 print:rounded-none">
        {/* Barra Superior Interativa (Oculta na Impressão) */}
        <div className="flex items-center justify-between pb-6 border-b border-[#E8DEC8] mb-8 print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#7D8C6E]" />
            <h2 className="text-base sm:text-lg font-serif font-medium text-[#1A3C4D]">
              Laudo Diagnóstico de Personalidade • Eneagrama
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1A3C4D] hover:bg-[#15313F] text-white text-xs sm:text-sm font-medium transition-all shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Salvar PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
              aria-label="Fechar laudo"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Conteúdo do Laudo Formatado para Impressão */}
        <div className="space-y-8 text-[#1A3C4D]">
          {/* Cabeçalho do Laudo */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DEC8] pb-6">
            <div>
              <div className="relative w-36 h-10 mb-2">
                <Image
                  src="/logo-kalapa.png"
                  alt="INstituto Kalapa"
                  fill
                  className="object-contain object-left"
                />
              </div>
              <p className="text-xs text-[#1A3C4D]/60 font-light">
                Espaço de Acolhimento, Consciência e Desenvolvimento Humano
              </p>
            </div>
            <div className="sm:text-right text-xs text-[#1A3C4D]/70 space-y-1">
              <p>
                <strong>Avaliação:</strong> Teste de Personalidade do Eneagrama
              </p>
              <p>
                <strong>Data de Emissão:</strong> {dataAtual}
              </p>
              {usuarioNome && (
                <p>
                  <strong>Participante:</strong> {usuarioNome}
                </p>
              )}
              {usuarioEmail && (
                <p>
                  <strong>E-mail:</strong> {usuarioEmail}
                </p>
              )}
            </div>
          </div>

          {/* Destaque do Tipo Dominante */}
          <div className="bg-[#F8F4ED] rounded-2xl p-6 border border-[#E8DEC8]">
            <span className="text-xs uppercase font-bold tracking-wider text-[#7D8C6E] block mb-1">
              Resultado Principal • Tipo Dominante
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A3C4D] mb-1">
              {tipo.nome}
            </h1>
            <p className="text-xs sm:text-sm text-[#1A3C4D]/70 font-light italic">
              {tipo.arquetipo}
            </p>
          </div>

          {/* Seções Estruturadas do Eneagrama */}
          <div className="space-y-6">
            {/* 1. Principais Feridas Emocionais */}
            <div className="border-l-4 border-rose-500 pl-4 py-1">
              <h3 className="text-sm font-bold uppercase tracking-wider text-rose-800 mb-1 flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-600" />
                Principais Feridas Emocionais
              </h3>
              <p className="text-xs sm:text-sm text-[#1A3C4D]/85 font-light leading-relaxed">
                {tipo.feridasEmocionais}
              </p>
            </div>

            {/* 2. Mensagens Inconscientes da Infância */}
            <div className="border-l-4 border-amber-500 pl-4 py-1">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-800 mb-1 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-amber-600" />
                Mensagens Inconscientes da Infância
              </h3>
              <p className="text-xs sm:text-sm text-[#1A3C4D]/85 font-light leading-relaxed italic">
                {tipo.mensagensInconscientes}
              </p>
            </div>

            {/* 3. Medos Fundamentais */}
            <div className="border-l-4 border-purple-500 pl-4 py-1">
              <h3 className="text-sm font-bold uppercase tracking-wider text-purple-800 mb-1 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-purple-600" />
                Medos Fundamentais
              </h3>
              <p className="text-xs sm:text-sm text-[#1A3C4D]/85 font-light leading-relaxed">
                {tipo.medosFundamentais}
              </p>
            </div>

            {/* 4. Desejos Fundamentais */}
            <div className="border-l-4 border-blue-500 pl-4 py-1">
              <h3 className="text-sm font-bold uppercase tracking-wider text-blue-800 mb-1 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-blue-600" />
                Desejos Fundamentais
              </h3>
              <p className="text-xs sm:text-sm text-[#1A3C4D]/85 font-light leading-relaxed">
                {tipo.desejosFundamentais}
              </p>
            </div>

            {/* 5. Distorções / Mensagens Perdidas da Infância */}
            <div className="border-l-4 border-emerald-500 pl-4 py-1 bg-emerald-50/40 p-4 rounded-r-xl">
              <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-800 mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Distorções / Mensagens Perdidas da Infância
              </h3>
              <p className="text-sm sm:text-base font-serif italic text-[#1A3C4D] leading-relaxed">
                {tipo.distorcoes}
              </p>
            </div>
          </div>

          {/* Tabela Resumo dos 9 Tipos */}
          <div className="pt-4 border-t border-[#E8DEC8]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A3C4D]/70 mb-3">
              Pontuação Completa nos 9 Tipos do Eneagrama
            </h4>
            <div className="grid grid-cols-3 sm:grid-cols-9 gap-2 text-center text-xs">
              {resultado.ranking.map((item) => (
                <div
                  key={item.tipo.numero}
                  className={`p-2 rounded-xl border ${
                    item.tipo.numero === tipo.numero
                      ? "bg-[#7D8C6E]/15 border-[#7D8C6E] font-bold"
                      : "bg-[#FDFBF7] border-[#E8DEC8]/80"
                  }`}
                >
                  <span className="block text-[10px] text-[#1A3C4D]/60 uppercase">
                    Tipo {item.tipo.numero}
                  </span>
                  <span className="text-sm font-serif">{item.pontos}p</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rodapé institucional do laudo */}
          <div className="pt-6 border-t border-[#E8DEC8] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#1A3C4D]/50 gap-2">
            <span>INstituto Kalapa • www.institutokalapa.com.br</span>
            <span>Alameda Tangará, 500 - Cotia - SP</span>
            <span>Relatório confidencial para fins de autoconhecimento.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
