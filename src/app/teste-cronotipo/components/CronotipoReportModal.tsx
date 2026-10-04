"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Printer,
  Sparkles,
  Sunrise,
  SunMedium,
  Moon,
  Clock,
  Brain,
  Shield,
  Activity,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import { ResultadoCronotipoCalculado } from "../lib/calculo-cronotipo";
import {
  CRONOTIPO_REPORTS_MAP,
  CronotipoReportData,
} from "../data/cronotipo-reports-data";

interface CronotipoReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  resultado: ResultadoCronotipoCalculado;
  usuarioNome?: string;
  usuarioEmail?: string;
}

export default function CronotipoReportModal({
  isOpen,
  onClose,
  resultado,
  usuarioNome,
  usuarioEmail,
}: CronotipoReportModalProps) {
  const reportRef = useRef<HTMLDivElement>(null);

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

  const { tipoCronotipo, pontuacaoTotal, info } = resultado;
  const relatorio: CronotipoReportData =
    CRONOTIPO_REPORTS_MAP[tipoCronotipo] || CRONOTIPO_REPORTS_MAP.intermediario;

  const renderIcone = () => {
    switch (tipoCronotipo) {
      case "matutino":
        return <Sunrise className="w-6 h-6 text-[#B8965A]" />;
      case "intermediario":
        return <SunMedium className="w-6 h-6 text-[#7D8C6E]" />;
      case "vespertino":
        return <Moon className="w-6 h-6 text-[#1A3C4D]" />;
    }
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      id="relatorio-impressao-container"
      className="modal-impressao-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static print:overflow-visible"
    >
      <div className="modal-impressao-card relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-[#E8DEC8] my-auto max-h-[94vh] flex flex-col print:max-h-none print:shadow-none print:rounded-none print:border-none print:w-full">
        {/* Barra Superior de Ações (Oculta na Impressão) */}
        <div className="no-print sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[#1A3C4D] text-white border-b border-white/10 print:hidden shrink-0 rounded-t-3xl">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#B8965A]/20 text-[#B8965A]">
              <Sparkles className="w-4 h-4 text-[#B8965A]" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-wider text-[#B8965A] font-semibold">
                Laudo Diagnóstico Circadiano
              </p>
              <h3 className="text-sm font-medium text-white/90">
                {info.nome} ({info.arquetipo})
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#B8965A] hover:bg-[#A38349] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Salvar PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Fechar (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Conteúdo Imprimível do Relatório Clínico */}
        <div
          ref={reportRef}
          className="p-6 sm:p-12 overflow-y-auto print:overflow-visible print:p-0 text-[#1A3C4D] space-y-8 bg-white"
        >
          {/* Cabeçalho Oficial do Laudo */}
          <div className="border-b border-[#E8DEC8] pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#B8965A] font-bold mb-1">
                  <span>INstituto Kalapa</span>
                  <span>•</span>
                  <span>Cronobiologia & Medicina do Ritmo</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-serif font-light text-[#1A3C4D]">
                  Laudo do Cronotipo & Ritmo Biológico
                </h1>
                <p className="text-xs text-[#1A3C4D]/60 mt-0.5">
                  Avaliação individual da preferência circadiana e organização funcional
                </p>
              </div>

              <div className="text-left sm:text-right text-xs text-[#1A3C4D]/70 space-y-0.5">
                <p>
                  <strong>Participante:</strong> {usuarioNome || "Avaliação Individual"}
                </p>
                {usuarioEmail && (
                  <p>
                    <strong>E-mail:</strong> {usuarioEmail}
                  </p>
                )}
                <p>
                  <strong>Data de Emissão:</strong> {dataAtual}
                </p>
              </div>
            </div>
          </div>

          {/* Box de Síntese do Cronotipo */}
          <div
            className="p-6 rounded-2xl border"
            style={{
              backgroundColor: info.corFundo,
              borderColor: info.corBorda,
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DEC8]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white border border-[#E8DEC8] flex items-center justify-center shrink-0">
                  {renderIcone()}
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-serif font-medium text-[#1A3C4D]">
                    {info.nome} ({info.arquetipo})
                  </h2>
                  <p className="text-xs sm:text-sm font-serif italic text-[#B8965A]">
                    {info.subtitulo}
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#1A3C4D]/60 block">
                  Pontuação Total
                </span>
                <span className="text-2xl sm:text-3xl font-serif font-bold text-[#1A3C4D]">
                  {pontuacaoTotal}
                </span>
                <span className="text-xs text-[#1A3C4D]/60 font-light"> / 18 pontos ({info.faixaPontuacao})</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#1A3C4D]/85 leading-relaxed font-light mt-4">
              {info.resumo}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-[#E8DEC8]/60 text-xs">
              <div>
                <strong className="text-[#1A3C4D]">Janela de Pico Cognitivo:</strong>{" "}
                <span className="text-[#1A3C4D]/80">{info.janelaPico}</span>
              </div>
              <div>
                <strong className="text-[#1A3C4D]">Janela de Repouso Recomendada:</strong>{" "}
                <span className="text-[#1A3C4D]/80">{info.horarioSonoIdeal}</span>
              </div>
            </div>
          </div>

          {/* Fundamentação Científica */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-serif font-medium text-[#1A3C4D] border-b border-[#E8DEC8] pb-2">
              1. Fundamentação Fisiológica & Dinâmica Circadiana
            </h3>

            <div className="space-y-3 text-xs sm:text-sm text-[#1A3C4D]/85 leading-relaxed font-light">
              <p>
                <strong>Características:</strong> {relatorio.fundamentacaoCientifica.caracteristicas}
              </p>
              <p>
                <strong>Desafios & Jetlag Social:</strong> {relatorio.fundamentacaoCientifica.desafios}
              </p>
              <p>
                <strong>Tomada de Decisão:</strong> {relatorio.fundamentacaoCientifica.tomadaDeDecisao}
              </p>
              <p>
                <strong>Janela para Estudos e Alerta:</strong> {relatorio.fundamentacaoCientifica.janelaEstudosAlerta}
              </p>
              <p>
                <strong>Saúde Mental e Regulação Emocional:</strong> {relatorio.fundamentacaoCientifica.saudeMentalRegulacao}
              </p>
            </div>
          </div>

          {/* Dossiê Completo: 30 Tópicos de Orientação */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-serif font-medium text-[#1A3C4D] border-b border-[#E8DEC8] pb-2">
              2. Dossiê Completo de Orientação Individual (30 Tópicos)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              {relatorio.topicos.map((t) => (
                <div
                  key={t.numero}
                  className="p-3.5 rounded-xl border border-[#E8DEC8] bg-[#FDFBF7] break-inside-avoid"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-5 h-5 rounded-md bg-[#B8965A]/20 text-[#B8965A] text-[11px] font-bold flex items-center justify-center shrink-0">
                      {t.numero}
                    </span>
                    <h4 className="font-semibold text-[#1A3C4D]">
                      {t.titulo}
                    </h4>
                  </div>
                  <p className="text-[#1A3C4D]/80 font-light leading-relaxed pl-7">
                    {t.conteudo}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Rodapé Institucional */}
          <div className="pt-8 border-t border-[#E8DEC8] text-center text-xs text-[#1A3C4D]/60 space-y-1">
            <p className="font-serif italic text-sm text-[#1A3C4D]/80">
              INstituto Kalapa — Centro Integrativo de Autoconhecimento & Bem-Estar
            </p>
            <p>
              Este laudo possui finalidade educativa e de autoconhecimento circadiano. Documento confidencial.
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
