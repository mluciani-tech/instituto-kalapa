"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  X,
  Printer,
  Sparkles,
  Flame,
  Heart,
  Brain,
  Compass,
  SunMedium,
  CheckCircle2,
  Flower2,
  BookOpen,
  Award,
} from "lucide-react";
import { ResultadoEneagramaCalculado } from "../lib/calculo-eneagrama";
import { ENEAGRAMA_REPORTS_MAP, EneagramaReportData } from "../data/eneagrama-reports-data";

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

  const tipoDominante = resultado.tipoDominante;
  const relatorio: EneagramaReportData =
    ENEAGRAMA_REPORTS_MAP[tipoDominante.numero] || ENEAGRAMA_REPORTS_MAP[1];

  const pontosTipo = resultado.pontuacoesPorLetra[relatorio.letra] || 0;
  const pctTipo = Math.round((pontosTipo / 25) * 100);

  const getCentroIcon = (categoria: string) => {
    switch (categoria) {
      case "instintivo":
        return <Flame className="w-3.5 h-3.5 text-amber-600 inline mr-1" />;
      case "emocional":
        return <Heart className="w-3.5 h-3.5 text-rose-600 inline mr-1" />;
      case "mental":
        return <Brain className="w-3.5 h-3.5 text-blue-600 inline mr-1" />;
      default:
        return <Compass className="w-3.5 h-3.5 text-[#7D8C6E] inline mr-1" />;
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
            <span className="p-1.5 rounded-lg bg-[#7D8C6E]/30 text-[#7D8C6E]">
              <Sparkles className="w-4 h-4 text-emerald-300" />
            </span>
            <div>
              <h2 className="text-sm font-serif font-medium text-white">
                Laudo Diagnóstico Integrativo • Eneagrama & Constelações
              </h2>
              <p className="text-[11px] text-white/70">
                INstituto Kalapa • Relatório Clínico Completo (5 Páginas)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#7D8C6E] hover:bg-[#6C7B5D] text-white text-xs font-semibold rounded-xl transition-all shadow-md cursor-pointer"
              title="Salvar como PDF ou Imprimir"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Salvar em PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Conteúdo Completo Formatado para Tela e Impressão (Exatamente 5 Páginas A4) */}
        <div
          id="relatorio-impressao"
          ref={reportRef}
          className="relatorio-impressao-conteudo p-6 md:p-10 space-y-10 overflow-y-auto text-[#1A3C4D] font-sans print:p-0 print:overflow-visible print:space-y-0"
        >
          {/* ============================================================ */}
          {/* PÁGINA 1: IDENTIDADE, ARQUÉTIPO E SÍNTESE SISTÊMICA          */}
          {/* ============================================================ */}
          <div className="relatorio-pagina print:break-after-page space-y-4 print:space-y-3.5 print:pt-0">
            {/* Cabeçalho Oficial */}
            <div className="border-b border-[#1A3C4D]/20 pb-3 flex items-center justify-between text-[11px] tracking-wide text-[#1A3C4D]/80">
              <span className="font-semibold uppercase tracking-wider">
                INstituto Kalapa — Eneagrama & Abordagem Sistêmica
              </span>
              <span className="font-medium text-[#7D8C6E] uppercase tracking-wider">
                Laudo Diagnóstico Integrativo
              </span>
            </div>

            {/* Dados do Participante & Logo */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-[#F8F4ED]/80 p-3.5 rounded-xl border border-[#E8DEC8]">
              <div>
                <div className="relative w-36 h-8 mb-1">
                  <Image
                    src="/logo-kalapa.png"
                    alt="INstituto Kalapa"
                    fill
                    sizes="144px"
                    priority
                    className="object-contain object-left"
                  />
                </div>
                <p className="text-[10px] text-[#1A3C4D]/65 font-light">
                  Desenvolvimento Humano, Psicologia Transpessoal & Constelações Familiares
                </p>
              </div>
              <div className="text-left sm:text-right text-[11px] space-y-0.5 text-[#1A3C4D]/85">
                <p>
                  <strong>Participante:</strong> {usuarioNome || "Convidado"}
                </p>
                {usuarioEmail && (
                  <p>
                    <strong>E-mail:</strong> {usuarioEmail}
                  </p>
                )}
                <p>
                  <strong>Emissão:</strong> {dataAtual}
                </p>
              </div>
            </div>

            {/* HERO CARD EDITORIAL COM FOTO ARQUETÍPICA DE IA */}
            <div className="bg-white rounded-2xl overflow-hidden border border-[#E8DEC8] shadow-xs p-3.5 print:p-3">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                {/* Imagem do Arquétipo */}
                <div className="relative w-36 h-36 sm:w-44 sm:h-44 shrink-0 rounded-xl overflow-hidden border border-[#E8DEC8] bg-[#1A3C4D]/10">
                  <Image
                    src={relatorio.imagem}
                    alt={relatorio.titulo}
                    fill
                    sizes="(max-width: 640px) 144px, 176px"
                    unoptimized
                    priority
                    className="object-cover"
                  />
                </div>

                {/* Dados Principais do Tipo */}
                <div className="flex-1 space-y-2 text-left">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#7D8C6E]/15 text-[#7D8C6E] border border-[#7D8C6E]/30">
                      {getCentroIcon(relatorio.centroCategoria)}
                      {relatorio.centro}
                    </span>
                    <span className="text-[10px] font-medium text-[#B8965A] uppercase tracking-wider">
                      Perfil Dominante
                    </span>
                  </div>

                  <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#1A3C4D] leading-tight">
                    {relatorio.titulo}
                  </h1>

                  <p className="text-[11px] text-[#1A3C4D]/75 font-light leading-relaxed">
                    {relatorio.subtitulo}
                  </p>

                  {/* Placar e Chave Sistêmica lado a lado */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <div className="bg-[#F8F4ED] p-2.5 rounded-lg border border-[#E8DEC8]">
                      <span className="text-[9px] uppercase tracking-wider text-[#1A3C4D]/60 block">
                        Pontuação Registrada
                      </span>
                      <p className="text-base font-serif font-semibold text-[#7D8C6E] mt-0.5">
                        {pontosTipo}{" "}
                        <span className="text-[11px] font-sans font-normal text-[#1A3C4D]/60">
                          / 25 pts ({pctTipo}%)
                        </span>
                      </p>
                    </div>

                    <div className="bg-emerald-50/80 p-2.5 rounded-lg border border-emerald-200/80 text-emerald-950">
                      <span className="text-[9px] uppercase font-bold tracking-wider text-emerald-800 flex items-center gap-1 block">
                        <SunMedium className="w-3 h-3 text-emerald-600" /> Chave Kalapa
                      </span>
                      <p className="text-[10px] font-light leading-snug line-clamp-2 mt-0.5">
                        {relatorio.chaveSistemicaKalapa}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 1. O Eneagrama como Mapa Psicoespiritual */}
            <div className="space-y-1 print-avoid-break">
              <h3 className="text-xs font-serif font-bold uppercase tracking-wider text-[#1A3C4D] flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#7D8C6E]" />
                1. O Eneagrama como Mapa Psicoespiritual e a Visão Kalapa
              </h3>
              <p className="text-[11px] text-[#1A3C4D]/85 font-light leading-relaxed text-justify">
                O Eneagrama é um mapa dinâmico da consciência humana. No <strong>INstituto Kalapa</strong>, diferenciamos com clareza a <strong>Estrutura do Ego</strong> (a máscara adaptativa de sobrevivência construída na infância diante da vulnerabilidade) e a <strong>Essência</strong> (nossa natureza original incondicionada, habitada por virtudes, liberdade e presença viva). O trabalho de autoconhecimento não busca suprimir o ego, mas iluminá-lo para libertar a Essência.
              </p>
            </div>

            {/* 2. Integração com as Constelações Familiares */}
            <div className="space-y-1 print-avoid-break">
              <h3 className="text-xs font-serif font-bold uppercase tracking-wider text-[#1A3C4D] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#B8965A]" />
                2. Integração do Eneagrama com as Constelações Familiares (Bert Hellinger)
              </h3>
              <p className="text-[11px] text-[#1A3C4D]/85 font-light leading-relaxed text-justify">
                O <strong>INstituto Kalapa</strong> une a sabedoria do Eneagrama às Ordens do Amor de Bert Hellinger (Pertencimento, Ordem/Hierarquia e Equilíbrio entre Dar e Tomar). Compreendemos que as fixações do eneatipo frequentemente representam lealdades inconscientes e tentativas da criança de compensar dores, exclusões ou desordens no sistema familiar ancestral.
              </p>
            </div>

            {/* 3. O Lugar Sistêmico do Tipo */}
            <div className="space-y-1 print-avoid-break">
              <h3 className="text-xs font-serif font-bold uppercase tracking-wider text-[#1A3C4D] flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#7D8C6E]" />
                3. O Lugar Sistêmico do {relatorio.titulo.split("–")[1]?.trim() || relatorio.titulo}
              </h3>
              <div className="p-3 rounded-xl bg-[#F8F4ED]/70 border border-[#E8DEC8] text-[11px] text-[#1A3C4D]/90 space-y-1">
                <p>
                  <strong>{relatorio.lugarSistemicoTitulo}:</strong> {relatorio.lugarSistemicoDescricao}
                </p>
                <p className="italic text-[#1A3C4D]/75">{relatorio.lugarSistemicoImpacto}</p>
              </div>
            </div>

            {/* Rodapé Página 1 */}
            <div className="border-t border-[#1A3C4D]/15 pt-2 flex items-center justify-between text-[9px] text-[#1A3C4D]/50 print-avoid-break">
              <span>Documento Terapêutico de Autoconhecimento — Confidencial</span>
              <span>Página 1 de 5</span>
            </div>
          </div>

          {/* ============================================================ */}
          {/* PÁGINA 2: PERFIL ESTRUTURAL E MATRIZ DIAGNÓSTICA            */}
          {/* ============================================================ */}
          <div className="relatorio-pagina print:break-after-page space-y-4 print:space-y-3.5 print:pt-2">
            {/* Cabeçalho Oficial */}
            <div className="border-b border-[#1A3C4D]/20 pb-2.5 flex items-center justify-between text-[11px] tracking-wide text-[#1A3C4D]/80">
              <span className="font-semibold uppercase tracking-wider">
                INstituto Kalapa — Eneagrama & Abordagem Sistêmica
              </span>
              <span className="font-medium text-[#7D8C6E] uppercase tracking-wider">
                Laudo Diagnóstico Integrativo
              </span>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-[#1A3C4D]">
                Perfil Estrutural e Mecanismos Psíquicos — {relatorio.titulo}
              </h2>
              <p className="text-[11px] text-[#1A3C4D]/80 font-light mt-0.5">
                <strong>Centro de Inteligência Primário:</strong> {relatorio.centro}. Este centro governa como o organismo processa ameaças, decisões vitais e estímulos relacionais, canalizando a energia para padrões defensivos automáticos.
              </p>
            </div>

            {/* 3 Cartões de Dinamismo Psíquico */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 print-avoid-break">
              <div className="p-3 rounded-xl bg-[#F8F4ED] border border-[#E8DEC8] space-y-1">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#B8965A] block">
                  Fixação Mental (Cognição)
                </span>
                <p className="text-[11px] text-[#1A3C4D]/90 font-medium leading-snug">
                  {relatorio.fixacaoMental}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#F8F4ED] border border-[#E8DEC8] space-y-1">
                <span className="text-[9px] font-bold uppercase tracking-wider text-rose-700 block">
                  Paixão Emocional (Combustível)
                </span>
                <p className="text-[11px] text-[#1A3C4D]/90 font-medium leading-snug">
                  {relatorio.paixaoEmocional}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#F8F4ED] border border-[#E8DEC8] space-y-1">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#1A3C4D] block">
                  Mecanismo de Defesa
                </span>
                <p className="text-[11px] text-[#1A3C4D]/90 font-medium leading-snug">
                  {relatorio.mecanismoDefesa}
                </p>
              </div>
            </div>

            {/* MATRIZ DIAGNÓSTICA COMPLETA */}
            <div className="space-y-2 print-avoid-break">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A3C4D] flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#7D8C6E]" />
                MATRIZ DIAGNÓSTICA COMPLETA DO ENEATIPO
              </h3>
              <div className="border border-[#1A3C4D]/25 rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-[#1A3C4D] text-white">
                    <tr>
                      <th className="py-2 px-3 font-semibold w-1/3">Dimensão Psíquica</th>
                      <th className="py-2 px-3 font-semibold w-2/3">Característica / Manifestação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8DEC8]">
                    <tr className="bg-white">
                      <td className="py-2 px-3 font-semibold text-[#1A3C4D]">Centro de Inteligência</td>
                      <td className="py-2 px-3 text-[#1A3C4D]/90 font-light">{relatorio.centro}</td>
                    </tr>
                    <tr className="bg-[#F8F4ED]/50">
                      <td className="py-2 px-3 font-semibold text-[#1A3C4D]">Fixação Mental</td>
                      <td className="py-2 px-3 text-[#1A3C4D]/90 font-light">{relatorio.fixacaoMental}</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="py-2 px-3 font-semibold text-[#1A3C4D]">Paixão Emocional</td>
                      <td className="py-2 px-3 text-[#1A3C4D]/90 font-light">{relatorio.paixaoEmocional}</td>
                    </tr>
                    <tr className="bg-[#F8F4ED]/50">
                      <td className="py-2 px-3 font-semibold text-[#1A3C4D]">Mecanismo de Defesa</td>
                      <td className="py-2 px-3 text-[#1A3C4D]/90 font-light">{relatorio.mecanismoDefesa}</td>
                    </tr>
                    <tr className="bg-emerald-50 text-emerald-950 font-semibold border-y border-emerald-200">
                      <td className="py-2 px-3 text-emerald-900 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-600 inline" /> Virtude da Essência
                      </td>
                      <td className="py-2 px-3 text-emerald-950 font-bold">{relatorio.virtudeEssencia}</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="py-2 px-3 font-semibold text-[#1A3C4D]">Ideia Sagrada</td>
                      <td className="py-2 px-3 text-[#1A3C4D]/90 font-light">{relatorio.ideiaSagrada}</td>
                    </tr>
                    <tr className="bg-[#F8F4ED]/50">
                      <td className="py-2 px-3 font-semibold text-[#1A3C4D]">Medo Fundamental</td>
                      <td className="py-2 px-3 text-[#1A3C4D]/90 font-light">{relatorio.medoFundamental}</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="py-2 px-3 font-semibold text-[#1A3C4D]">Desejo Fundamental</td>
                      <td className="py-2 px-3 text-[#1A3C4D]/90 font-light">{relatorio.desejoFundamental}</td>
                    </tr>
                    <tr className="bg-[#F8F4ED]/50">
                      <td className="py-2 px-3 font-semibold text-[#1A3C4D]">■ Floral de Bach</td>
                      <td className="py-2 px-3 text-[#1A3C4D]/90 font-light">{relatorio.floralBach}</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="py-2 px-3 font-semibold text-[#1A3C4D]">■ Óleo Essencial</td>
                      <td className="py-2 px-3 text-[#1A3C4D]/90 font-light">{relatorio.oleoEssencial}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Rodapé Página 2 */}
            <div className="border-t border-[#1A3C4D]/15 pt-2 flex items-center justify-between text-[9px] text-[#1A3C4D]/50 print-avoid-break">
              <span>Documento Terapêutico de Autoconhecimento — Confidencial</span>
              <span>Página 2 de 5</span>
            </div>
          </div>

          {/* ============================================================ */}
          {/* PÁGINA 3: ORIGEM PSICOLÓGICA E FERIDAS DA INFÂNCIA           */}
          {/* ============================================================ */}
          <div className="relatorio-pagina print:break-after-page space-y-4 print:space-y-3.5 print:pt-2">
            {/* Cabeçalho Oficial */}
            <div className="border-b border-[#1A3C4D]/20 pb-2.5 flex items-center justify-between text-[11px] tracking-wide text-[#1A3C4D]/80">
              <span className="font-semibold uppercase tracking-wider">
                INstituto Kalapa — Eneagrama & Abordagem Sistêmica
              </span>
              <span className="font-medium text-[#7D8C6E] uppercase tracking-wider">
                Laudo Diagnóstico Integrativo
              </span>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-[#1A3C4D]">
                Origem Psicológica e Feridas Primordiais da Infância
              </h2>
              <p className="text-[11px] text-[#1A3C4D]/80 font-light mt-0.5 text-justify">
                A estrutura do ego não surge por acaso: é a cristalização defensiva diante da perda percebida de conexão com o amor incondicional no início da vida.
              </p>
            </div>

            {/* 1. O Cenário de Infância e a Construção da Máscara */}
            <div className="space-y-1.5 p-3 rounded-xl bg-white border-l-4 border-l-[#7D8C6E] border border-[#E8DEC8] shadow-2xs print-avoid-break">
              <h3 className="text-xs font-serif font-bold text-[#1A3C4D]">
                1. O Cenário de Infância e a Construção da Máscara
              </h3>
              <p className="text-[11px] text-[#1A3C4D]/85 font-light leading-relaxed text-justify">
                {relatorio.cenarioInfancia}
              </p>
            </div>

            {/* 2. A Perda da Ideia Sagrada (Sandra Maitri) */}
            <div className="space-y-1.5 p-3 rounded-xl bg-white border-l-4 border-l-[#B8965A] border border-[#E8DEC8] shadow-2xs print-avoid-break">
              <h3 className="text-xs font-serif font-bold text-[#1A3C4D]">
                2. A Perda da Ideia Sagrada (Sandra Maitri)
              </h3>
              <p className="text-[11px] text-[#1A3C4D]/85 font-light leading-relaxed text-justify">
                {relatorio.perdaIdeiaSagrada}
              </p>
            </div>

            {/* 3. O Resgate da Criança Anímica e Pontos de Integração */}
            <div className="space-y-1.5 p-3 rounded-xl bg-white border-l-4 border-l-[#1A3C4D] border border-[#E8DEC8] shadow-2xs print-avoid-break">
              <h3 className="text-xs font-serif font-bold text-[#1A3C4D]">
                3. O Resgate da Criança Anímica e Pontos de Integração
              </h3>
              <p className="text-[11px] text-[#1A3C4D]/85 font-light leading-relaxed text-justify">
                {relatorio.resgateCriancaPontos}
              </p>
            </div>

            {/* Citação Especial de Claudio Naranjo */}
            <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200/90 text-[11px] leading-relaxed text-[#1A3C4D] print-avoid-break">
              <strong className="text-emerald-900 font-semibold block mb-1 text-xs">
                Símbolo da Criança Divina (Claudio Naranjo):
              </strong>
              <p className="italic text-emerald-950 font-serif text-xs">
                &ldquo;{relatorio.simboloCriancaDivina}&rdquo;
              </p>
            </div>

            {/* Rodapé Página 3 */}
            <div className="border-t border-[#1A3C4D]/15 pt-2 flex items-center justify-between text-[9px] text-[#1A3C4D]/50 print-avoid-break">
              <span>Documento Terapêutico de Autoconhecimento — Confidencial</span>
              <span>Página 3 de 5</span>
            </div>
          </div>

          {/* ============================================================ */}
          {/* PÁGINA 4: O LADO LUZ E QUADRO COMPARATIVO EGO VS ESSÊNCIA   */}
          {/* ============================================================ */}
          <div className="relatorio-pagina print:break-after-page space-y-4 print:space-y-3.5 print:pt-2">
            {/* Cabeçalho Oficial */}
            <div className="border-b border-[#1A3C4D]/20 pb-2.5 flex items-center justify-between text-[11px] tracking-wide text-[#1A3C4D]/80">
              <span className="font-semibold uppercase tracking-wider">
                INstituto Kalapa — Eneagrama & Abordagem Sistêmica
              </span>
              <span className="font-medium text-[#7D8C6E] uppercase tracking-wider">
                Laudo Diagnóstico Integrativo
              </span>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-[#1A3C4D]">
                Usando Suas Características a Seu Favor: O Lado Luz do Eneatipo
              </h2>
              <p className="text-[11px] text-[#1A3C4D]/80 font-light mt-0.5 text-justify">
                O objetivo com o Eneagrama não é &apos;destruir&apos; o ego, mas passar do automatismo inconsciente para a consciência desperta e o florescimento das virtudes da Essência.
              </p>
            </div>

            {/* OS 4 SUPERPODERES DO PERFIL CONSCIENTE (GRID 2x2) */}
            <div className="space-y-2 print-avoid-break">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#B8965A] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#B8965A]" />
                Os 4 Superpoderes do Perfil Consciente
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {relatorio.superpoderes.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-[#F8F4ED]/80 border border-[#E8DEC8] flex items-start gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#7D8C6E] shrink-0 mt-0.5" />
                    <span className="text-[11px] font-medium text-[#1A3C4D] leading-snug">
                      {p}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* QUADRO COMPARATIVO EGO VS. ESSÊNCIA */}
            <div className="space-y-2 print-avoid-break">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A3C4D] flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#7D8C6E]" />
                QUADRO COMPARATIVO: MODO REATIVO (EGO) VS. MODO CONSCIENTE (ESSÊNCIA)
              </h3>
              <div className="border border-[#1A3C4D]/25 rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-[#1A3C4D] text-white">
                    <tr>
                      <th className="py-2 px-2.5 font-semibold w-1/4">Dimensão</th>
                      <th className="py-2 px-2.5 font-semibold w-3/8 text-rose-200">
                        Modo Reativo (Ego / Compulsão)
                      </th>
                      <th className="py-2 px-2.5 font-semibold w-3/8 text-emerald-200">
                        Modo Consciente (Essência / Presença)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8DEC8]">
                    {relatorio.quadroComparativo.map((linha, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-[#F8F4ED]/40"}>
                        <td className="py-2 px-2.5 font-semibold text-[#1A3C4D]">{linha.dimensao}</td>
                        <td className="py-2 px-2.5 text-rose-950 font-light bg-rose-50/25 leading-snug">
                          {linha.modoReativo}
                        </td>
                        <td className="py-2 px-2.5 text-emerald-950 font-medium bg-emerald-50/25 leading-snug">
                          {linha.modoConsciente}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Rodapé Página 4 */}
            <div className="border-t border-[#1A3C4D]/15 pt-2 flex items-center justify-between text-[9px] text-[#1A3C4D]/50 print-avoid-break">
              <span>Documento Terapêutico de Autoconhecimento — Confidencial</span>
              <span>Página 4 de 5</span>
            </div>
          </div>

          {/* ============================================================ */}
          {/* PÁGINA 5: PLANO DE DESENVOLVIMENTO, TERAPIAS E AFIRMAÇÃO    */}
          {/* ============================================================ */}
          <div className="relatorio-pagina-final space-y-4 print:space-y-3.5 print:pt-2">
            {/* Cabeçalho Oficial */}
            <div className="border-b border-[#1A3C4D]/20 pb-2.5 flex items-center justify-between text-[11px] tracking-wide text-[#1A3C4D]/80">
              <span className="font-semibold uppercase tracking-wider">
                INstituto Kalapa — Eneagrama & Abordagem Sistêmica
              </span>
              <span className="font-medium text-[#7D8C6E] uppercase tracking-wider">
                Laudo Diagnóstico Integrativo
              </span>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-[#1A3C4D]">
                Plano de Desenvolvimento Pessoal e Terapias Integrativas
              </h2>
            </div>

            {/* 1. Orientação dos Mestres do Eneagrama */}
            <div className="space-y-1.5 print-avoid-break">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#B8965A] flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#B8965A]" />
                1. Orientação dos Mestres do Eneagrama
              </h3>
              <div className="space-y-1.5 text-[11px] text-[#1A3C4D]/90 font-light leading-relaxed">
                <div className="p-2.5 bg-[#F8F4ED]/80 rounded-xl border border-[#E8DEC8]">
                  <strong>• John Bradshaw:</strong>{" "}
                  {relatorio.mestres.bradshaw.replace(/^John Bradshaw.*?:\s*/, "")}
                </div>
                <div className="p-2.5 bg-[#F8F4ED]/80 rounded-xl border border-[#E8DEC8]">
                  <strong>• Helen Palmer:</strong>{" "}
                  {relatorio.mestres.palmer.replace(/^Helen Palmer.*?:\s*/, "")}
                </div>
                <div className="p-2.5 bg-[#F8F4ED]/80 rounded-xl border border-[#E8DEC8]">
                  <strong>• Claudio Naranjo:</strong>{" "}
                  {relatorio.mestres.naranjo.replace(/^Claudio Naranjo.*?:\s*/, "")}
                </div>
              </div>
            </div>

            {/* 2. Guia de Terapias Integrativas (Florais & Aromaterapia) */}
            <div className="space-y-1.5 print-avoid-break">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#7D8C6E] flex items-center gap-1.5">
                <Flower2 className="w-3.5 h-3.5 text-[#7D8C6E]" />
                2. Terapias Integrativas (Floral de Bach & Óleo Essencial)
              </h3>
              <div className="bg-[#F8F4ED]/70 p-3 rounded-xl border border-[#E8DEC8] space-y-1.5 text-[11px]">
                <p>
                  <strong>■ Floral de Bach:</strong> {relatorio.floralBachRecomendado}
                </p>
                <p className="text-[#1A3C4D]/80 font-light">
                  <em>Como atua:</em> {relatorio.floralBachComoAtua}
                </p>
                <div className="border-t border-[#E8DEC8] pt-1.5 mt-1.5">
                  <p>
                    <strong>■ Óleo Essencial (Aromaterapia):</strong> {relatorio.oleoEssencialRecomendado}
                  </p>
                  <p className="text-[#1A3C4D]/80 font-light">
                    <em>Protocolo de Uso:</em> {relatorio.oleoEssencialProtocolo}
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Mensagem Terapêutica Final e Afirmação Kalapa de Presença */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-[11px] leading-relaxed space-y-2 print-avoid-break">
              <p className="text-justify text-[#1A3C4D]">
                {relatorio.mensagemTerapeuticaFinal}
              </p>
              <div className="p-2.5 bg-white rounded-xl border border-emerald-300 text-center">
                <strong className="text-emerald-900 block mb-0.5 uppercase tracking-wider text-[10px]">
                  Afirmação Kalapa de Presença:
                </strong>
                <span className="font-serif italic text-emerald-950 font-semibold text-xs sm:text-sm">
                  &ldquo;{relatorio.afirmacaoKalapa}&rdquo;
                </span>
              </div>
            </div>

            {/* Mapeamento Geral dos 9 Eneatipos */}
            <div className="space-y-1.5 print-avoid-break">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#1A3C4D]/70">
                Mapeamento Geral dos 9 Eneatipos (Pontuações Registradas)
              </h4>
              <div className="grid grid-cols-3 sm:grid-cols-9 gap-1 text-center text-xs">
                {resultado.ranking.map((item) => (
                  <div
                    key={item.tipo.numero}
                    className={`p-1 rounded-lg border ${
                      item.tipo.numero === tipoDominante.numero
                        ? "bg-[#7D8C6E]/20 border-[#7D8C6E] font-bold text-[#1A3C4D]"
                        : "bg-white border-[#E8DEC8] text-[#1A3C4D]/70"
                    }`}
                  >
                    <span className="block text-[8px] uppercase">Tipo {item.tipo.numero}</span>
                    <span className="text-[10px] font-semibold">{item.pontos}p</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rodapé Final Institucional */}
            <div className="border-t border-[#1A3C4D]/15 pt-2.5 space-y-1 print-avoid-break">
              <div className="flex flex-col sm:flex-row items-center justify-between text-[9px] text-[#1A3C4D]/60 gap-1">
                <span>INstituto Kalapa • www.institutokalapa.com.br</span>
                <span>Alameda Tangará, 500 - Cotia - SP</span>
                <span>Documento Terapêutico de Autoconhecimento — Confidencial</span>
              </div>
              <div className="text-right text-[9px] text-[#1A3C4D]/40">
                Página 5 de 5
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
