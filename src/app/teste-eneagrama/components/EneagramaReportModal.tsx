"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { X, Printer, Compass, Sparkles } from "lucide-react";
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static print:overflow-visible">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-[#E8DEC8] my-auto max-h-[94vh] flex flex-col print:max-h-none print:shadow-none print:rounded-none print:border-none print:w-full">
        {/* Barra Superior de Ações (Oculta na Impressão) */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[#1A3C4D] text-white border-b border-white/10 print:hidden shrink-0 rounded-t-3xl">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#7D8C6E]/30 text-[#7D8C6E]">
              <Sparkles className="w-4 h-4 text-emerald-300" />
            </span>
            <div>
              <h2 className="text-sm font-serif font-medium text-white">
                Laudo Diagnóstico Integrativo • Eneagrama & Constelações
              </h2>
              <p className="text-[11px] text-white/70">INstituto Kalapa • Relatório Clínico Completo</p>
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

        {/* Conteúdo Completo do Relatório Formatado para Visualização e Impressão (5 Páginas A4) */}
        <div
          ref={reportRef}
          className="p-6 md:p-12 space-y-12 overflow-y-auto text-[#1A3C4D] font-sans print:p-0 print:overflow-visible print:space-y-0"
        >
          {/* ============================================================ */}
          {/* PÁGINA 1: SÍNTESE, CONSTELAÇÕES E LUGAR SISTÊMICO            */}
          {/* ============================================================ */}
          <div className="space-y-6 print:min-h-[1050px] print:pb-10 print:break-after-page flex flex-col justify-between">
            <div className="space-y-6">
              {/* Cabeçalho Oficial */}
              <div className="border-b border-[#1A3C4D]/20 pb-4 flex items-center justify-between text-[11px] tracking-wide text-[#1A3C4D]/80">
                <span className="font-semibold uppercase tracking-wider">
                  INstituto Kalapa — Eneagrama e Constelações Familiares
                </span>
                <span className="font-medium text-[#7D8C6E] uppercase tracking-wider">
                  Relatório Clínico & Diagnóstico
                </span>
              </div>

              {/* Informações do Participante e Logo */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#F8F4ED]/60 p-4 rounded-xl border border-[#E8DEC8]">
                <div>
                  <div className="relative w-36 h-9 mb-1">
                    <Image
                      src="/logo-kalapa.png"
                      alt="INstituto Kalapa"
                      fill
                      className="object-contain object-left"
                    />
                  </div>
                  <p className="text-[11px] text-[#1A3C4D]/60 font-light">
                    Desenvolvimento Humano, Psicologia Transpessoal & Abordagem Sistêmica
                  </p>
                </div>
                <div className="text-left sm:text-right text-xs space-y-0.5 text-[#1A3C4D]/80">
                  <p><strong>Participante:</strong> {usuarioNome || "Convidado"}</p>
                  {usuarioEmail && <p><strong>E-mail:</strong> {usuarioEmail}</p>}
                  <p><strong>Emissão:</strong> {dataAtual}</p>
                  <p><strong>Pontuação no Teste:</strong> {resultado.pontuacoesPorLetra[relatorio.letra] || 0} / 25 pts</p>
                </div>
              </div>

              {/* Banner com Imagem Arquetípica e Título */}
              <div className="relative rounded-2xl overflow-hidden border border-[#E8DEC8] bg-[#1A3C4D]">
                <div className="relative h-44 sm:h-52 w-full">
                  <Image
                    src={relatorio.imagem}
                    alt={relatorio.titulo}
                    fill
                    className="object-cover opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex items-end p-6">
                    <div className="text-white space-y-1">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
                        {relatorio.subtitulo}
                      </span>
                      <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                        {relatorio.titulo}
                      </h1>
                    </div>
                  </div>
                </div>
              </div>

              {/* 1. O Eneagrama como Mapa Psicoespiritual */}
              <div className="space-y-2">
                <h3 className="text-base font-serif font-bold text-[#1A3C4D]">
                  1. O Eneagrama como Mapa Psicoespiritual e a Visão Sistêmica Kalapa
                </h3>
                <p className="text-xs sm:text-sm text-[#1A3C4D]/90 font-light leading-relaxed text-justify">
                  O Eneagrama é um mapa dinâmico da psique humana que vai muito além de uma simples tipologia comportamental. Na abordagem do <strong>INstituto Kalapa</strong>, o sistema é compreendido como uma jornada de diferenciação entre a <strong>Estrutura do Ego</strong> (o mecanismo de defesa construído na infância) e a <strong>Essência</strong> (nossa natureza original incondicionada, recheada de virtudes e presença consciente). O Ego nasce como uma resposta adaptativa de sobrevivência a uma dor ou desconexão primórdia; a Essência é quem realmente somos quando desarmamos as defesas neuróticas.
                </p>
              </div>

              {/* 2. Integração com as Constelações Familiares */}
              <div className="space-y-2">
                <h3 className="text-base font-serif font-bold text-[#1A3C4D]">
                  2. Integração do Eneagrama com as Constelações Familiares (Bert Hellinger)
                </h3>
                <p className="text-xs sm:text-sm text-[#1A3C4D]/90 font-light leading-relaxed text-justify">
                  O <strong>INstituto Kalapa</strong> integra pioneiramente o Eneagrama com a visão das Constelações Familiares de Bert Hellinger. Muitas vezes, a fixação mental e a paixão emocional do eneatipo não são apenas traços individuais, mas sim o reflexo de emaranhamentos sistêmicos e lealdades invisíveis ao clan familiar. Ao respeitarmos as Ordens do Amor (Pertencimento, Hierarquia e Equilíbrio entre Dar e Tomar), percebemos que o ego de cada tipo é a tentativa cega de uma criança amorosa de salvar o seu sistema ou compensar exclusões do passado.
                </p>
              </div>

              {/* 3. O Lugar Sistêmico do Tipo */}
              <div className="space-y-2">
                <h3 className="text-base font-serif font-bold text-[#1A3C4D]">
                  3. O Lugar Sistêmico do {relatorio.titulo.split("–")[1]?.trim() || relatorio.titulo}
                </h3>
                <p className="text-xs sm:text-sm text-[#1A3C4D]/90 font-light leading-relaxed text-justify">
                  <strong>{relatorio.lugarSistemicoTitulo}:</strong> {relatorio.lugarSistemicoDescricao}
                </p>
                <p className="text-xs sm:text-sm text-[#1A3C4D]/80 font-light leading-relaxed text-justify italic">
                  {relatorio.lugarSistemicoImpacto}
                </p>
              </div>

              {/* Box: Chave Sistêmica Kalapa */}
              <div className="p-4 rounded-xl bg-[#F8F4ED] border border-[#7D8C6E]/40 text-xs sm:text-sm leading-relaxed text-[#1A3C4D]">
                <strong className="text-[#7D8C6E] font-semibold block mb-0.5">
                  Chave Sistêmica Kalapa:
                </strong>
                {relatorio.chaveSistemicaKalapa}
              </div>
            </div>

            {/* Rodapé Página 1 */}
            <div className="border-t border-[#1A3C4D]/15 pt-3 flex items-center justify-between text-[10px] text-[#1A3C4D]/50">
              <span>Documento Terapêutico de Autoconhecimento — Confidencial</span>
              <span>Página 1 de 5</span>
            </div>
          </div>

          {/* ============================================================ */}
          {/* PÁGINA 2: PERFIL ESTRUTURAL E MATRIZ DIAGNÓSTICA            */}
          {/* ============================================================ */}
          <div className="space-y-6 print:min-h-[1050px] print:pb-10 print:break-after-page flex flex-col justify-between pt-6 print:pt-0">
            <div className="space-y-6">
              {/* Cabeçalho Oficial */}
              <div className="border-b border-[#1A3C4D]/20 pb-4 flex items-center justify-between text-[11px] tracking-wide text-[#1A3C4D]/80">
                <span className="font-semibold uppercase tracking-wider">
                  INstituto Kalapa — Eneagrama e Constelações Familiares
                </span>
                <span className="font-medium text-[#7D8C6E] uppercase tracking-wider">
                  Relatório Clínico & Diagnóstico
                </span>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1A3C4D]">
                  Perfil Estrutural e Mecanismos Psíquicos — {relatorio.titulo}
                </h2>
                <p className="text-xs sm:text-sm text-[#1A3C4D]/80 font-light mt-1">
                  <strong>Centro de Inteligência:</strong> {relatorio.centro}. Este centro governa como o organismo processa as ameaças, decisões e estímulos do ambiente, direcionando a energia vital para padrões específicos de defesa.
                </p>
              </div>

              {/* Dinamismo das Compulsões e Mecanismos de Defesa */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#B8965A]">
                  Dinamismo das Compulsões e Mecanismos de Defesa
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-[#1A3C4D]/90 font-light leading-relaxed">
                  <li>
                    <strong>• Fixação Mental:</strong> {relatorio.fixacaoMental}
                  </li>
                  <li>
                    <strong>• Paixão Emocional:</strong> {relatorio.paixaoEmocional}
                  </li>
                  <li>
                    <strong>• Mecanismo de Defesa:</strong> {relatorio.mecanismoDefesa}
                  </li>
                </ul>
              </div>

              {/* MATRIZ DIAGNÓSTICA COMPLETA */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A3C4D]">
                  MATRIZ DIAGNÓSTICA COMPLETA DO ENEATIPO
                </h3>
                <div className="border border-[#1A3C4D]/30 rounded-xl overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#1A3C4D] text-white">
                      <tr>
                        <th className="p-3 font-semibold w-1/3">Dimensão Psíquica</th>
                        <th className="p-3 font-semibold w-2/3">Característica / Manifestação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8DEC8]">
                      <tr className="bg-white">
                        <td className="p-3 font-semibold text-[#1A3C4D]">Centro de Inteligência</td>
                        <td className="p-3 text-[#1A3C4D]/90 font-light">{relatorio.centro}</td>
                      </tr>
                      <tr className="bg-[#F8F4ED]/50">
                        <td className="p-3 font-semibold text-[#1A3C4D]">Fixação Mental</td>
                        <td className="p-3 text-[#1A3C4D]/90 font-light">{relatorio.fixacaoMental}</td>
                      </tr>
                      <tr className="bg-white">
                        <td className="p-3 font-semibold text-[#1A3C4D]">Paixão Emocional</td>
                        <td className="p-3 text-[#1A3C4D]/90 font-light">{relatorio.paixaoEmocional}</td>
                      </tr>
                      <tr className="bg-[#F8F4ED]/50">
                        <td className="p-3 font-semibold text-[#1A3C4D]">Mecanismo de Defesa</td>
                        <td className="p-3 text-[#1A3C4D]/90 font-light">{relatorio.mecanismoDefesa}</td>
                      </tr>
                      <tr className="bg-emerald-50/60">
                        <td className="p-3 font-semibold text-emerald-950">Virtude da Essência</td>
                        <td className="p-3 font-semibold text-emerald-950">{relatorio.virtudeEssencia}</td>
                      </tr>
                      <tr className="bg-white">
                        <td className="p-3 font-semibold text-[#1A3C4D]">Ideia Sagrada</td>
                        <td className="p-3 text-[#1A3C4D]/90 font-light">{relatorio.ideiaSagrada}</td>
                      </tr>
                      <tr className="bg-[#F8F4ED]/50">
                        <td className="p-3 font-semibold text-[#1A3C4D]">Medo Fundamental</td>
                        <td className="p-3 text-[#1A3C4D]/90 font-light">{relatorio.medoFundamental}</td>
                      </tr>
                      <tr className="bg-white">
                        <td className="p-3 font-semibold text-[#1A3C4D]">Desejo Fundamental</td>
                        <td className="p-3 text-[#1A3C4D]/90 font-light">{relatorio.desejoFundamental}</td>
                      </tr>
                      <tr className="bg-[#F8F4ED]/50">
                        <td className="p-3 font-semibold text-[#1A3C4D]">■ Floral de Bach</td>
                        <td className="p-3 text-[#1A3C4D]/90 font-light">{relatorio.floralBach}</td>
                      </tr>
                      <tr className="bg-white">
                        <td className="p-3 font-semibold text-[#1A3C4D]">■ Óleo Essencial</td>
                        <td className="p-3 text-[#1A3C4D]/90 font-light">{relatorio.oleoEssencial}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Rodapé Página 2 */}
            <div className="border-t border-[#1A3C4D]/15 pt-3 flex items-center justify-between text-[10px] text-[#1A3C4D]/50">
              <span>Documento Terapêutico de Autoconhecimento — Confidencial</span>
              <span>Página 2 de 5</span>
            </div>
          </div>

          {/* ============================================================ */}
          {/* PÁGINA 3: ORIGEM PSICOLÓGICA E FERIDAS DA INFÂNCIA           */}
          {/* ============================================================ */}
          <div className="space-y-6 print:min-h-[1050px] print:pb-10 print:break-after-page flex flex-col justify-between pt-6 print:pt-0">
            <div className="space-y-6">
              {/* Cabeçalho Oficial */}
              <div className="border-b border-[#1A3C4D]/20 pb-4 flex items-center justify-between text-[11px] tracking-wide text-[#1A3C4D]/80">
                <span className="font-semibold uppercase tracking-wider">
                  INstituto Kalapa — Eneagrama e Constelações Familiares
                </span>
                <span className="font-medium text-[#7D8C6E] uppercase tracking-wider">
                  Relatório Clínico & Diagnóstico
                </span>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1A3C4D]">
                  Origem Psicológica e Feridas Primordiais da Infância
                </h2>
                <p className="text-xs sm:text-sm text-[#1A3C4D]/80 font-light mt-1 text-justify">
                  Nenhum eneatipo nasce por acaso. A estrutura do ego é o resultado do encontro entre o temperamento inato da criança e o ambiente relacional percebido nos primeiros anos de vida.
                </p>
              </div>

              {/* 1. O Cenário de Infância e a Construção da Máscara */}
              <div className="space-y-2">
                <h3 className="text-base font-serif font-bold text-[#1A3C4D]">
                  1. O Cenário de Infância e a Construção da Máscara
                </h3>
                <p className="text-xs sm:text-sm text-[#1A3C4D]/90 font-light leading-relaxed text-justify">
                  {relatorio.cenarioInfancia}
                </p>
              </div>

              {/* 2. A Perda da Ideia Sagrada (Sandra Maitri) */}
              <div className="space-y-2">
                <h3 className="text-base font-serif font-bold text-[#1A3C4D]">
                  2. A Perda da Ideia Sagrada (Sandra Maitri)
                </h3>
                <p className="text-xs sm:text-sm text-[#1A3C4D]/90 font-light leading-relaxed text-justify">
                  {relatorio.perdaIdeiaSagrada}
                </p>
              </div>

              {/* 3. O Resgate da Criança Anímica e Pontos de Integração */}
              <div className="space-y-2">
                <h3 className="text-base font-serif font-bold text-[#1A3C4D]">
                  3. O Resgate da Criança Anímica e Pontos de Integração
                </h3>
                <p className="text-xs sm:text-sm text-[#1A3C4D]/90 font-light leading-relaxed text-justify">
                  {relatorio.resgateCriancaPontos}
                </p>
              </div>

              {/* Box de Citação do Claudio Naranjo */}
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs sm:text-sm leading-relaxed text-[#1A3C4D] italic">
                <strong className="text-emerald-800 font-semibold block mb-0.5 not-italic">
                  Símbolo da Criança Divina (Naranjo):
                </strong>
                &ldquo;{relatorio.simboloCriancaDivina}&rdquo;
              </div>
            </div>

            {/* Rodapé Página 3 */}
            <div className="border-t border-[#1A3C4D]/15 pt-3 flex items-center justify-between text-[10px] text-[#1A3C4D]/50">
              <span>Documento Terapêutico de Autoconhecimento — Confidencial</span>
              <span>Página 3 de 5</span>
            </div>
          </div>

          {/* ============================================================ */}
          {/* PÁGINA 4: O LADO LUZ E QUADRO COMPARATIVO EGO VS ESSÊNCIA   */}
          {/* ============================================================ */}
          <div className="space-y-6 print:min-h-[1050px] print:pb-10 print:break-after-page flex flex-col justify-between pt-6 print:pt-0">
            <div className="space-y-6">
              {/* Cabeçalho Oficial */}
              <div className="border-b border-[#1A3C4D]/20 pb-4 flex items-center justify-between text-[11px] tracking-wide text-[#1A3C4D]/80">
                <span className="font-semibold uppercase tracking-wider">
                  INstituto Kalapa — Eneagrama e Constelações Familiares
                </span>
                <span className="font-medium text-[#7D8C6E] uppercase tracking-wider">
                  Relatório Clínico & Diagnóstico
                </span>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1A3C4D]">
                  Usando Suas Características a Seu Favor: O Lado Luz do Eneatipo
                </h2>
                <p className="text-xs sm:text-sm text-[#1A3C4D]/80 font-light mt-1 text-justify">
                  O objetivo do trabalho com o Eneagrama não é &apos;destruir&apos; o ego, mas sim passar do automatismo inconsciente para o uso consciente das qualidades inatas do seu perfil.
                </p>
              </div>

              {/* Os 4 Superpoderes */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#B8965A]">
                  Os 4 Superpoderes do Perfil Consciente
                </h3>
                <ul className="space-y-1.5 text-xs sm:text-sm text-[#1A3C4D]/90 font-light">
                  {relatorio.superpoderes.map((p, idx) => (
                    <li key={idx}>• {p}</li>
                  ))}
                </ul>
              </div>

              {/* QUADRO COMPARATIVO */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A3C4D]">
                  QUADRO COMPARATIVO: MODO REATIVO (EGO) VS. MODO CONSCIENTE (ESSÊNCIA)
                </h3>
                <div className="border border-[#1A3C4D]/30 rounded-xl overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#1A3C4D] text-white">
                      <tr>
                        <th className="p-2.5 font-semibold w-1/4">Dimensão</th>
                        <th className="p-2.5 font-semibold w-3/8 text-rose-200">Modo Reativo (Ego / Compulsão)</th>
                        <th className="p-2.5 font-semibold w-3/8 text-emerald-200">Modo Consciente (Essência / Presença)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8DEC8]">
                      {relatorio.quadroComparativo.map((linha, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-[#F8F4ED]/40"}>
                          <td className="p-2.5 font-semibold text-[#1A3C4D]">{linha.dimensao}</td>
                          <td className="p-2.5 text-rose-950 font-light bg-rose-50/20">{linha.modoReativo}</td>
                          <td className="p-2.5 text-emerald-950 font-medium bg-emerald-50/20">{linha.modoConsciente}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Rodapé Página 4 */}
            <div className="border-t border-[#1A3C4D]/15 pt-3 flex items-center justify-between text-[10px] text-[#1A3C4D]/50">
              <span>Documento Terapêutico de Autoconhecimento — Confidencial</span>
              <span>Página 4 de 5</span>
            </div>
          </div>

          {/* ============================================================ */}
          {/* PÁGINA 5: PLANO DE DESENVOLVIMENTO, TERAPIAS E AFIRMAÇÃO    */}
          {/* ============================================================ */}
          <div className="space-y-6 print:min-h-[1050px] print:pb-10 flex flex-col justify-between pt-6 print:pt-0">
            <div className="space-y-6">
              {/* Cabeçalho Oficial */}
              <div className="border-b border-[#1A3C4D]/20 pb-4 flex items-center justify-between text-[11px] tracking-wide text-[#1A3C4D]/80">
                <span className="font-semibold uppercase tracking-wider">
                  INstituto Kalapa — Eneagrama e Constelações Familiares
                </span>
                <span className="font-medium text-[#7D8C6E] uppercase tracking-wider">
                  Relatório Clínico & Diagnóstico
                </span>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1A3C4D]">
                  Plano de Desenvolvimento Pessoal e Terapias Integrativas
                </h2>
              </div>

              {/* 1. Orientação dos Mestres do Eneagrama */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#B8965A]">
                  1. Orientação dos Mestres do Eneagrama
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-[#1A3C4D]/90 font-light leading-relaxed">
                  <li>
                    <strong>• John Bradshaw (Volta ao Lar):</strong> {relatorio.mestres.bradshaw.replace(/^John Bradshaw.*?:\s*/, "")}
                  </li>
                  <li>
                    <strong>• Helen Palmer (O Eneagrama):</strong> {relatorio.mestres.palmer.replace(/^Helen Palmer.*?:\s*/, "")}
                  </li>
                  <li>
                    <strong>• Claudio Naranjo (Os Nove Tipos):</strong> {relatorio.mestres.naranjo.replace(/^Claudio Naranjo.*?:\s*/, "")}
                  </li>
                </ul>
              </div>

              {/* 2. Guia de Conexão: Terapias Integrativas */}
              <div className="space-y-2.5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#7D8C6E]">
                  2. Guia de Conexão: Terapias Integrativas (Florais & Aromaterapia)
                </h3>
                <div className="bg-[#F8F4ED]/60 p-4 rounded-xl border border-[#E8DEC8] space-y-2 text-xs sm:text-sm">
                  <p>
                    <strong>■ Floral de Bach Recomendado:</strong> {relatorio.floralBachRecomendado}
                  </p>
                  <p className="text-[#1A3C4D]/80 font-light">
                    <em>Como atua:</em> {relatorio.floralBachComoAtua}
                  </p>
                  <div className="border-t border-[#E8DEC8] pt-2 mt-2">
                    <p>
                      <strong>■ Óleo Essencial (Aromaterapia):</strong> {relatorio.oleoEssencialRecomendado}
                    </p>
                    <p className="text-[#1A3C4D]/80 font-light">
                      <em>Protocolo de Uso:</em> {relatorio.oleoEssencialProtocolo}
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. Mensagem Terapêutica Final e Afirmação de Presença */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A3C4D]">
                  3. Mensagem Terapêutica Final e Afirmação de Presença
                </h3>
                <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs sm:text-sm leading-relaxed space-y-3">
                  <p className="text-justify text-[#1A3C4D]">
                    {relatorio.mensagemTerapeuticaFinal}
                  </p>
                  <div className="p-3 bg-white rounded-xl border border-emerald-300 text-center">
                    <strong className="text-emerald-900 block mb-0.5 uppercase tracking-wider text-[11px]">
                      Afirmação Kalapa de Presença:
                    </strong>
                    <span className="font-serif italic text-emerald-950 font-semibold text-sm sm:text-base">
                      &ldquo;{relatorio.afirmacaoKalapa}&rdquo;
                    </span>
                  </div>
                </div>
              </div>

              {/* Resumo da Pontuação Geral nos 9 Tipos */}
              <div className="pt-2">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#1A3C4D]/60 mb-2">
                  Mapeamento Geral dos 9 Eneatipos (Pontuações Registradas)
                </h4>
                <div className="grid grid-cols-3 sm:grid-cols-9 gap-1.5 text-center text-xs">
                  {resultado.ranking.map((item) => (
                    <div
                      key={item.tipo.numero}
                      className={`p-1.5 rounded-lg border ${
                        item.tipo.numero === tipoDominante.numero
                          ? "bg-[#7D8C6E]/20 border-[#7D8C6E] font-bold text-[#1A3C4D]"
                          : "bg-white border-[#E8DEC8] text-[#1A3C4D]/70"
                      }`}
                    >
                      <span className="block text-[9px] uppercase">Tipo {item.tipo.numero}</span>
                      <span className="text-xs font-semibold">{item.pontos}p</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Rodapé Página 5 e Contato Institucional */}
            <div className="border-t border-[#1A3C4D]/15 pt-3 space-y-1">
              <div className="flex flex-col sm:flex-row items-center justify-between text-[10px] text-[#1A3C4D]/60 gap-1">
                <span>INstituto Kalapa • www.institutokalapa.com.br</span>
                <span>Alameda Tangará, 500 - Cotia - SP</span>
                <span>Documento Terapêutico de Autoconhecimento — Confidencial</span>
              </div>
              <div className="text-right text-[10px] text-[#1A3C4D]/40">
                Página 5 de 5
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
