"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Printer,
  Scale,
  Sparkles,
  BookOpen,
  Heart,
  Clock,
} from "lucide-react";
import {
  ResultadoMetamorfoseCalculado,
  obterFalaConcordanciaCarta,
} from "../lib/calculo-metamorfose";
import { QUADRANTES_INFO } from "../data/metamorfose-data";
import SupportNotice from "@/components/SupportNotice";

interface MetamorfoseReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  resultado: ResultadoMetamorfoseCalculado;
  dataRealizacao?: string | null;
}

export default function MetamorfoseReportModal({
  isOpen,
  onClose,
  resultado,
  dataRealizacao,
}: MetamorfoseReportModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const { cartas, caderno, balanca } = resultado;
  const dataExibicao =
    dataRealizacao ||
    new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date());

  const handlePrint = () => {
    window.print();
  };

  return createPortal(
    <div
      id="relatorio-impressao-container"
      className="modal-impressao-backdrop fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 print:p-0 print:block print:relative print:z-auto print:inset-auto bg-black/60 print:bg-white backdrop-blur-sm print:backdrop-blur-none transition-opacity"
    >
      {/* Modal Principal */}
      <div className="modal-impressao-card relative bg-[#FDFBF7] w-full max-w-4xl max-h-[90vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-slideUp print:shadow-none print:animate-none print:max-h-none print:rounded-none print:w-full print:max-w-none print:bg-white print:overflow-visible">
        {/* Header Fixo (Apenas na tela) */}
        <div className="shrink-0 border-b border-[#E8DEC8] px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between bg-white z-10 gap-4 print:hidden">
          <div className="flex items-center gap-4">
            {/* Logo Kalapa */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-kalapa.png"
              alt="INstituto Kalapa"
              className="h-10 w-auto object-contain shrink-0"
            />
            <div>
              <h2 className="text-xl font-serif font-bold text-[#1A3C4D]">
                Dossiê da Metamorfose da Consciência (6 Páginas A4)
              </h2>
              <p className="text-xs text-[#1A3C4D]/60 font-light mt-0.5">
                Cartas Sorteadas: {cartas[1].id} • {cartas[2].id} • {cartas[3].id} •{" "}
                {cartas[4].id}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
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
              onClick={onClose}
              className="p-2 text-[#1A3C4D]/40 hover:text-[#1A3C4D] hover:bg-[#F8F4ED] rounded-xl transition-colors cursor-pointer"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Conteúdo Rolável */}
        <div
          id="relatorio-impressao"
          className="relatorio-impressao-conteudo flex-1 overflow-y-auto custom-scrollbar print:overflow-visible print:block print:p-0"
        >
          {/* ========================================================= */}
          {/* VISUALIZAÇÃO NA TELA (Oculto na impressão) */}
          {/* ========================================================= */}
          <div className="p-6 sm:p-8 lg:p-10 max-w-3xl mx-auto space-y-8 print:hidden">
            {/* Resumo da Equação Narrativa */}
            <section className="bg-white p-6 rounded-2xl border border-[#E8DEC8] shadow-xs space-y-4">
              <div className="flex items-center justify-between gap-2 border-b border-[#E8DEC8] pb-3">
                <h3 className="text-sm font-bold tracking-widest uppercase text-[#1A3C4D] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#B8965A]" />
                  A Equação Narrativa Contínua da Sua Alma
                </h3>
                <span className="text-xs text-[#1A3C4D]/60">{dataExibicao}</span>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                {([1, 2, 3, 4] as const).map((qId) => {
                  const c = cartas[qId];
                  return (
                    <div
                      key={qId}
                      className="p-3.5 rounded-xl bg-[#FDFBF7] border border-[#E8DEC8]"
                    >
                      <p className="text-[11px] font-bold uppercase text-[#B8965A] mb-1">
                        {qId}. {c.quadrante_nome} ({c.id} — {c.titulo} • Bloco{" "}
                        {c.bloco})
                      </p>
                      <p className="italic font-serif text-[#1A3C4D] text-justify">
                        «{c.mensagem_completa}»
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Balança */}
            <section className="bg-[#F8F4ED] p-6 rounded-2xl border border-[#E8DEC8] space-y-3">
              <h3 className="text-sm font-bold tracking-widest uppercase text-[#B8965A] flex items-center gap-2">
                <Scale className="w-4 h-4" />
                {balanca.titulo}
              </h3>
              <p className="text-xs sm:text-sm text-[#1A3C4D]/85 font-light leading-relaxed text-justify">
                {balanca.analiseFenomenologica}
              </p>
              <p className="text-xs sm:text-sm text-[#1A3C4D] font-medium pt-1">
                <strong>Postura Recomendada:</strong> {balanca.posturaRecomendada}
              </p>
            </section>

            {/* As 4 Cartas Completas */}
            {([1, 2, 3, 4] as const).map((qId) => {
              const c = cartas[qId];
              const notas = caderno[qId];
              const fala = obterFalaConcordanciaCarta(c);

              return (
                <section
                  key={qId}
                  className="bg-white p-6 rounded-2xl border border-[#E8DEC8] shadow-xs space-y-4"
                >
                  <div className="border-b border-[#E8DEC8] pb-3 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#B8965A]">
                        Quadrante {qId}: {c.quadrante_nome} • Bloco {c.bloco}
                      </span>
                      <h4 className="text-lg font-serif font-bold text-[#1A3C4D]">
                        Carta {c.id} — {c.titulo}
                      </h4>
                      <p className="text-xs italic text-[#1A3C4D]/65">
                        {c.subtitulo}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs sm:text-sm text-[#1A3C4D]/85 font-light">
                    <div>
                      <strong className="text-[#1A3C4D] block mb-0.5 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-[#B8965A]" />
                        1. Reflexão Sistêmica:
                      </strong>
                      <p className="text-justify">{c.reflexao_sistemica}</p>
                    </div>
                    <div>
                      <strong className="text-[#1A3C4D] block mb-0.5">
                        2. Dinâmica Interna (Na Alma):
                      </strong>
                      <p className="text-justify">{c.dinamica_interna}</p>
                    </div>
                    <div>
                      <strong className="text-[#1A3C4D] block mb-0.5">
                        3. Dinâmica Externa (Negócios & Vida):
                      </strong>
                      <p className="text-justify">{c.dinamica_externa}</p>
                    </div>
                    <div>
                      <strong className="text-[#1A3C4D] block mb-1">
                        4. Perguntas de Autoindagação & Caderno:
                      </strong>
                      <ul className="space-y-2">
                        {c.perguntas_autoindagacao.map((p, idx) => {
                          const respKey = (`resposta${idx + 1}`) as
                            | "resposta1"
                            | "resposta2"
                            | "resposta3";
                          const respTexto = notas?.[respKey];
                          return (
                            <li
                              key={idx}
                              className="p-3 rounded-xl bg-[#FDFBF7] border border-[#E8DEC8]"
                            >
                              <p className="font-medium text-[#1A3C4D]">{p}</p>
                              {respTexto && (
                                <p className="mt-1 text-emerald-900 italic">
                                  Sua anotação: &ldquo;{respTexto}&rdquo;
                                </p>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                      <strong className="text-emerald-900 text-xs uppercase flex items-center gap-1.5 mb-1">
                        <Heart className="w-3.5 h-3.5" />
                        Exercício Interior da Concordância:
                      </strong>
                      <p className="italic font-serif text-emerald-950">
                        «{fala}»
                      </p>
                    </div>
                  </div>
                </section>
              );
            })}

            <section className="p-5 rounded-2xl bg-[#FDFBF7] border border-[#B8965A]/40">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#B8965A] mb-1.5 flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                Orientação de Fechamento: As 72 Horas de Silêncio
              </h4>
              <p className="text-xs text-[#1A3C4D]/80 font-light text-justify">
                Após concluir as anotações desta jornada, feche o seu caderno e guarde-o em silêncio. Não discuta as revelações com terceiros nem tente tomar decisões precipitadas nas próximas 72 horas. Deixe que a imagem vista atue por si mesma nas camadas profundas da sua consciência.
              </p>
            </section>

            {/* Ficha Técnica & Concepção */}
            <section className="p-5 rounded-2xl bg-white border border-[#E8DEC8] space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#1A3C4D] border-b border-[#E8DEC8] pb-2">
                Ficha Técnica & Concepção
              </h4>
              <div className="text-xs text-[#1A3C4D]/85 space-y-1.5">
                <p>
                  • <strong>Criadora do Jogo:</strong> Clatihúcia Capeli – Consteladora familiar, certificada pela International Systemic Management
                </p>
                <p>
                  • <strong>Programação e Desenvolvimento:</strong> Marcio Luciani
                </p>
              </div>

              <h4 className="text-xs font-bold uppercase tracking-widest text-[#1A3C4D] border-b border-[#E8DEC8] pt-2 pb-2">
                Bibliografias utilizadas para criação do jogo
              </h4>
              <ul className="text-xs text-[#1A3C4D]/85 space-y-1 list-disc pl-4">
                <li>
                  <strong>Hellinger, Bert.</strong>{" "}
                  <em>
                    Ordens do Amor; Ordens da Ajuda; Êxito na Vida, Êxito na Profissão; A Fonte Não Precisa Perguntar Pelo Caminho.
                  </em>
                </li>
                <li>
                  <strong>Stam, Jan Jacob.</strong>{" "}
                  <em>
                    A Alma do Negócio: O Campo Sistêmico nas Organizações.
                  </em>
                </li>
                <li>
                  <strong>Garriga Bacardí, Joan.</strong>{" "}
                  <em>
                    Onde Estão as Moedas? A Chave do Vínculo Entre Pais e Filhos.
                  </em>
                </li>
                <li>
                  <strong>Schützenberger, Anne Ancelin.</strong>{" "}
                  <em>Meus Antepassados! A Família e suas Heranças Ocultas.</em>
                </li>
              </ul>
            </section>

            <SupportNotice variant="screen" />
          </div>

          {/* ========================================================= */}
          {/* LAYOUT DE IMPRESSÃO A4 (6 PÁGINAS EDITORIAIS) */}
          {/* ========================================================= */}
          <div className="hidden print:block bg-white text-black w-full text-[10.5px] leading-relaxed max-w-[210mm] mx-auto">
            {/* ------------------------------------------------------- */}
            {/* PÁGINA 1: FUNDAMENTAÇÃO, EQUAÇÃO NARRATIVA E BALANÇA */}
            {/* ------------------------------------------------------- */}
            <div className="relatorio-pagina print:break-after-page min-h-[260mm] flex flex-col justify-between pt-1 pb-3">
              <div className="space-y-2.5">
                {/* Cabeçalho da Página 1 com Logo no Canto Superior Esquerdo */}
                <div className="flex items-center gap-4 border-b-2 border-[#B8965A] pb-2.5 mb-2 print-avoid-break">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logo-kalapa.png"
                    alt="INstituto Kalapa"
                    className="h-10 w-auto object-contain shrink-0"
                  />
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-[#B8965A] font-bold text-[9px] uppercase tracking-widest leading-none mb-1">
                      INstituto Kalapa • Desenvolvimento Humano & Abordagem Sistêmica
                    </p>
                    <h1 className="text-xl font-serif font-extrabold text-[#1A3C4D] leading-tight">
                      JOGO SISTÊMICO — A METAMORFOSE DA CONSCIÊNCIA
                    </h1>
                    <p className="text-[#1A3C4D]/75 italic text-[10px] leading-tight">
                      Dossiê Fenomenológico Individual • Fundamentado em Bert Hellinger, Jan Jacob Stam & Joan Garriga
                    </p>
                  </div>
                </div>

                {/* Metadados da Sessão */}
                <div className="grid grid-cols-3 gap-2.5 p-2 bg-[#FDFBF7] border border-[#E8DEC8] text-[10px] print-avoid-break">
                  <div>
                    <span className="font-bold text-[#1A3C4D] block uppercase text-[8.5px]">
                      Esfera Investigada:
                    </span>
                    <span>{resultado.categoriaTemaLabel}</span>
                  </div>
                  <div>
                    <span className="font-bold text-[#1A3C4D] block uppercase text-[8.5px]">
                      Tema Registrado:
                    </span>
                    <span>
                      {resultado.temaEmSilencio
                        ? "Mentalizado em Silêncio"
                        : resultado.temaDescricao || "Vivência Pessoal"}
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-[#1A3C4D] block uppercase text-[8.5px]">
                      Data & Tiragem:
                    </span>
                    <span>
                      {dataExibicao} ({cartas[1].id} • {cartas[2].id} •{" "}
                      {cartas[3].id} • {cartas[4].id})
                    </span>
                  </div>
                </div>

                {/* Fundamentação Sintética */}
                <div className="space-y-1 text-justify print-avoid-break">
                  <h2 className="text-[#1A3C4D] font-bold uppercase text-[10.5px] border-b border-[#1A3C4D] pb-0.5">
                    1. Fundamentação & As Três Leis Sistêmicas
                  </h2>
                  <p className="text-[10px] leading-relaxed">
                    O <strong>Jogo Sistêmico — A Metamorfose da Consciência</strong> é uma experiência de autoconhecimento desenvolvida pelo <strong>INstituto Kalapa</strong>. Unindo os quatro estágios biológicos da metamorfose (Ovo, Lagarta, Crisálida e Borboleta) às Três Leis Sistêmicas de Bert Hellinger (<strong>1. Pertencimento</strong>, <strong>2. Ordem/Hierarquia</strong> e <strong>3. Equilíbrio entre Dar e Receber</strong>), o jogo convida a alma a abandonar a pressa infantil de manipular acontecimentos e encontrar a força que brota da concordância com a realidade exatamente como ela é.
                  </p>
                </div>

                {/* A Equação Narrativa Contínua */}
                <div className="space-y-1.5 print-avoid-break">
                  <h2 className="text-[#1A3C4D] font-bold uppercase text-[10.5px] border-b border-[#1A3C4D] pb-0.5">
                    2. O Diagnóstico Narrativo Contínuo da Sua Alma
                  </h2>
                  <p className="text-[9.5px] text-justify leading-relaxed">
                    Ao retirar suas quatro cartas na ordem orgânica da metamorfose, o campo revelou a seguinte equação narrativa contínua (recomenda-se a leitura pausada e em voz alta):
                  </p>

                  <div className="border border-[#B8965A] bg-[#FDFBF7] p-2.5 space-y-1.5">
                    {([1, 2, 3, 4] as const).map((qId) => {
                      const c = cartas[qId];
                      return (
                        <div key={qId} className="text-justify text-[9.5px] leading-snug">
                          <span className="font-bold text-[#1A3C4D]">
                            {qId}. {c.quadrante_nome.toUpperCase()} (Carta {c.id} —{" "}
                            {c.titulo} | Bloco {c.bloco}):{" "}
                          </span>
                          <span className="italic font-serif">
                            «{c.mensagem_completa}»
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* A Balança entre a Ferida e a Consciência Adulta */}
                <div className="space-y-1.5 print-avoid-break">
                  <h2 className="text-[#1A3C4D] font-bold uppercase text-[10.5px] border-b border-[#1A3C4D] pb-0.5">
                    3. A Balança entre a Ferida (Bloco A) e a Consciência Adulta (Bloco B)
                  </h2>
                  <div className="border border-[#7D8C6E] bg-[#F9FBF8] p-2.5 space-y-1.5 text-justify text-[9.5px] leading-relaxed">
                    <div className="flex justify-between items-center border-b border-[#7D8C6E]/30 pb-0.5">
                      <strong className="text-[#1A3C4D] text-[10.5px]">
                        {balanca.titulo}
                      </strong>
                      <span className="text-[9px] font-bold text-[#7D8C6E]">
                        Bloco A: {balanca.totalBlocoA} | Bloco B:{" "}
                        {balanca.totalBlocoB}
                      </span>
                    </div>
                    <p>{balanca.analiseFenomenologica}</p>
                    <p>
                      <strong>• Pergunta-Chave:</strong>{" "}
                      <em>«{balanca.perguntaChave}»</em>
                    </p>
                    <p>
                      <strong>• Postura de Integração:</strong>{" "}
                      {balanca.posturaRecomendada}
                    </p>
                  </div>
                </div>
              </div>

              {/* Rodapé Página 1 */}
              <div className="border-t border-gray-300 pt-1.5 flex justify-between text-[8.5px] text-gray-500 mt-auto print-avoid-break">
                <span>
                  Jogo Sistêmico — A Metamorfose da Consciência • INstituto Kalapa
                </span>
                <span>Página 1 de 6</span>
              </div>
            </div>

            {/* ------------------------------------------------------- */}
            {/* PÁGINAS 2 A 5: UMA PÁGINA PARA CADA QUADRANTE (1 a 4) */}
            {/* ------------------------------------------------------- */}
            {([1, 2, 3, 4] as const).map((qId) => {
              const c = cartas[qId];
              const qInfo = QUADRANTES_INFO[qId];
              const notas = caderno[qId] || {};
              const fala = obterFalaConcordanciaCarta(c);
              const paginaNumero = qId + 1;

              return (
                <div
                  key={qId}
                  className="relatorio-pagina print:break-after-page min-h-[260mm] flex flex-col justify-between pt-1 pb-3"
                >
                  <div className="space-y-2">
                    {/* Cabeçalho do Quadrante com Logo no Canto Superior Esquerdo */}
                    <div className="border-b-2 border-[#1A3C4D] pb-2 flex items-center gap-3 print-avoid-break">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/logo-kalapa.png"
                        alt="INstituto Kalapa"
                        className="h-8 w-auto object-contain shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-[#B8965A]">
                          <span>
                            Quadrante {qId}: {qInfo.nome} • {qInfo.subtituloArquetipico}
                          </span>
                          <span>Pergunta: «{qInfo.perguntaSistemica}»</span>
                        </div>
                        <div className="flex justify-between items-baseline mt-0.5">
                          <h2 className="text-base font-serif font-extrabold text-[#1A3C4D]">
                            [ CARTA {c.id} ] {c.titulo.toUpperCase()}
                          </h2>
                          <span className="text-[10px] text-[#1A3C4D]/80 font-semibold">
                            Bloco {c.bloco} ({c.categoria}) • {c.subtitulo}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Frase-Guia */}
                    <div className="py-1.5 px-2.5 bg-[#FDFBF7] border border-[#B8965A] text-justify print-avoid-break">
                      <strong className="text-[#B8965A] uppercase text-[9px] block mb-0.5">
                        Frase-Guia Revelada no Caderno:
                      </strong>
                      <p className="font-serif italic text-[11px] text-[#1A3C4D] leading-snug">
                        «{c.mensagem_completa}»
                      </p>
                    </div>

                    {/* As 3 Dimensões Analíticas */}
                    <div className="space-y-1.5 text-justify text-[9.5px] leading-relaxed print-avoid-break">
                      <div>
                        <strong className="text-[#1A3C4D] uppercase block mb-0.5">
                          1. Reflexão Sistêmica & Conexão com {qInfo.nome}:
                        </strong>
                        <p>{c.reflexao_sistemica}</p>
                      </div>

                      <div>
                        <strong className="text-[#1A3C4D] uppercase block mb-0.5">
                          2. Dinâmica Interna Sistêmica (Na Alma):
                        </strong>
                        <p>{c.dinamica_interna}</p>
                      </div>

                      <div>
                        <strong className="text-[#1A3C4D] uppercase block mb-0.5">
                          3. Dinâmica Externa no Mundo Real (Negócios & Vida):
                        </strong>
                        <p>{c.dinamica_externa}</p>
                      </div>
                    </div>

                    {/* 4. Perguntas de Autoindagação e Registro do Caderno */}
                    <div className="border border-gray-300 p-2 bg-white space-y-1 print-avoid-break">
                      <strong className="text-[#1A3C4D] text-[9.5px] uppercase block border-b border-gray-200 pb-0.5">
                        4. Perguntas de Autoindagação Fenomenológica & Registro do Participante:
                      </strong>

                      {c.perguntas_autoindagacao.map((pergunta, idx) => {
                        const key = (`resposta${idx + 1}`) as
                          | "resposta1"
                          | "resposta2"
                          | "resposta3";
                        const respostaDigitada = notas[key]?.trim();

                        return (
                          <div key={idx} className="space-y-0.5 text-justify text-[9px]">
                            <p className="font-semibold text-[#1A3C4D]">
                              • {pergunta}
                            </p>
                            {respostaDigitada ? (
                              <p className="p-1 bg-[#FDFBF7] border-l-2 border-[#B8965A] italic text-[#1A3C4D]">
                                {respostaDigitada}
                              </p>
                            ) : (
                              <div className="border-b border-dashed border-gray-300 h-3" />
                            )}
                          </div>
                        );
                      })}

                      <div className="pt-0.5 text-justify text-[9px]">
                        <p className="font-semibold text-[#1A3C4D]">
                          • Ressonância Corporal (Onde meu corpo sentiu alívio ou aperto ao ler esta carta?):
                        </p>
                        {notas.ressonanciaCorporal?.trim() ? (
                          <p className="p-1 bg-[#FDFBF7] border-l-2 border-[#7D8C6E] italic text-[#1A3C4D] mt-0.5">
                            {notas.ressonanciaCorporal}
                          </p>
                        ) : (
                          <div className="border-b border-dashed border-gray-300 h-3 mt-0.5" />
                        )}
                      </div>
                    </div>

                    {/* Exercício Interior da Concordância e Rito de Passagem */}
                    <div className="border border-[#7D8C6E] py-1.5 px-2.5 bg-[#F9FBF8] text-justify print-avoid-break">
                      <strong className="text-[#7D8C6E] text-[9.5px] uppercase block mb-0.5">
                        • O Exercício Interior da Concordância ({qInfo.nome}):
                      </strong>
                      <p className="italic font-serif text-[#1A3C4D] text-[10px] font-medium leading-snug">
                        «{fala}»
                      </p>
                    </div>
                  </div>

                  {/* Rodapé da Página do Quadrante */}
                  <div className="border-t border-gray-300 pt-1.5 flex justify-between text-[8.5px] text-gray-500 mt-auto print-avoid-break">
                    <span>
                      Jogo Sistêmico — A Metamorfose da Consciência • Quadrante{" "}
                      {qId}: {qInfo.nome} • INstituto Kalapa
                    </span>
                    <span>Página {paginaNumero} de 6</span>
                  </div>
                </div>
              );
            })}

            {/* ------------------------------------------------------- */}
            {/* PÁGINA 6: FOLHA DE INTEGRAÇÃO FINAL, 72H E REFERÊNCIAS */}
            {/* ------------------------------------------------------- */}
            <div className="relatorio-pagina-final min-h-[260mm] flex flex-col justify-between pt-1 pb-3">
              <div className="space-y-1.5">
                {/* Cabeçalho Página 6 com Logo no Canto Superior Esquerdo */}
                <div className="border-b-2 border-[#1A3C4D] pb-2 flex items-center gap-3 print-avoid-break">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logo-kalapa.png"
                    alt="INstituto Kalapa"
                    className="h-8 w-auto object-contain shrink-0"
                  />
                  <div className="flex-1">
                    <p className="text-[#B8965A] font-bold text-[9px] uppercase tracking-widest leading-none mb-1">
                      Fechamento & Prática Pessoal • INstituto Kalapa
                    </p>
                    <h2 className="text-[#1A3C4D] font-serif font-extrabold uppercase text-base leading-tight">
                      INTEGRAÇÃO DA JORNADA COMPLETA & RECOLHIMENTO
                    </h2>
                  </div>
                </div>

                {/* Tabela Resumo de Registro e Postura */}
                <div className="space-y-0.5 print-avoid-break">
                  <h3 className="text-[#1A3C4D] font-bold uppercase text-[10px]">
                    1. Quadro Sinóptico da Sua Metamorfose
                  </h3>
                  <table className="w-full border-collapse border border-gray-300 text-[9px]">
                    <thead>
                      <tr className="bg-[#1A3C4D] text-white">
                        <th className="border border-gray-300 p-1 text-left w-1/5">
                          Quadrante
                        </th>
                        <th className="border border-gray-300 p-1 text-left w-1/4">
                          Carta Revelada
                        </th>
                        <th className="border border-gray-300 p-1 text-left">
                          Postura Interior de Concordância
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {([1, 2, 3, 4] as const).map((qId) => {
                        const c = cartas[qId];
                        return (
                          <tr key={qId}>
                            <td className="border border-gray-300 p-1 font-bold bg-[#FDFBF7]">
                              {qId}. {c.quadrante_nome}
                            </td>
                            <td className="border border-gray-300 p-1">
                              <strong>
                                {c.id} — {c.titulo}
                              </strong>
                              <br />
                              <span className="text-[8px] text-gray-600">
                                Bloco {c.bloco} • {c.subtitulo}
                              </span>
                            </td>
                            <td className="border border-gray-300 p-1 italic bg-[#F9FBF8] text-justify leading-snug">
                              «{obterFalaConcordanciaCarta(c)}»
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Espaço para Anotação de Integração Final */}
                <div className="border border-gray-300 p-2 bg-white space-y-0.5 print-avoid-break">
                  <strong className="text-[#1A3C4D] text-[9.5px] uppercase block">
                    2. Postura de Integração Pessoal (O que posso concordar e soltar hoje?):
                  </strong>
                  <div className="space-y-1.5 pt-0.5">
                    <div className="border-b border-dashed border-gray-300 h-3" />
                    <div className="border-b border-dashed border-gray-300 h-3" />
                  </div>
                </div>

                {/* A Sabedoria da Não-Intervenção Imediata */}
                <div className="border border-[#B8965A] p-2 bg-[#FDFBF7] text-justify print-avoid-break">
                  <h3 className="font-bold text-[#B8965A] uppercase text-[9.5px] mb-0.5">
                    3. A Sabedoria do Recolhimento e da Não-Intervenção Imediata (As 72 Horas)
                  </h3>
                  <p className="text-[9px] leading-relaxed">
                    Após realizar a tiragem, <strong>não tente formular planos de ação imediatos nem tomar decisões impulsivas nas próximas 72 horas</strong>. Como nos ensina Bert Hellinger em <em>A Fonte Não Precisa Perguntar pelo Caminho</em>, as compreensões sistêmicas atuam como sementes no solo fértil da alma. Quando perturbamos o processo com análises mentais excessivas ou discutimos imediatamente a tiragem com terceiros, roubamos a força do movimento primordial. Guarde este registro em silêncio e confie que a realidade encontrará o seu próprio curso no tempo certo.
                  </p>
                </div>

                {/* Diretriz Ética */}
                <div className="border border-[#1A3C4D] p-2 text-justify print-avoid-break">
                  <h3 className="font-bold text-[#1A3C4D] uppercase text-[9px] mb-0.5">
                    Diretriz Ética e Compromisso com a Experiência Viva — INstituto Kalapa
                  </h3>
                  <p className="text-[9px] leading-relaxed">
                    Esta vivência é um instrumento fenomenológico de autopercepção e tomada de consciência. O aprofundamento terapêutico e o desatamento de emaranhamentos familiares ou organizacionais demandam o acompanhamento de um <strong>profissional com formação certificada em Constelação Sistêmica</strong>. Não tome nada aqui como dogma rígido: observe os movimentos da sua alma e escute com honestidade a resposta do seu corpo.
                  </p>
                </div>

                {/* Ficha Técnica & Concepção */}
                <div className="space-y-0.5 print-avoid-break">
                  <h3 className="text-[#1A3C4D] font-bold uppercase text-[9.5px] border-b border-[#1A3C4D] pb-0.5">
                    Ficha Técnica & Concepção
                  </h3>
                  <div className="text-[9px] space-y-0.5 text-[#1A3C4D]">
                    <p>
                      • <strong>Criadora do Jogo:</strong> Clatihúcia Capeli – Consteladora familiar, certificada pela International Systemic Management
                    </p>
                    <p>
                      • <strong>Programação e Desenvolvimento:</strong> Marcio Luciani
                    </p>
                  </div>
                </div>

                {/* Bibliografias utilizadas para criação do jogo */}
                <div className="space-y-0.5 print-avoid-break">
                  <h3 className="text-[#1A3C4D] font-bold uppercase text-[9.5px] border-b border-[#1A3C4D] pb-0.5">
                    Bibliografias utilizadas para criação do jogo
                  </h3>
                  <ul className="text-[8.5px] space-y-0.5 leading-snug">
                    <li>
                      • <strong>Hellinger, Bert.</strong>{" "}
                      <em>
                        Ordens do Amor; Ordens da Ajuda; Êxito na Vida, Êxito na Profissão; A Fonte Não Precisa Perguntar Pelo Caminho.
                      </em>
                    </li>
                    <li>
                      • <strong>Stam, Jan Jacob.</strong>{" "}
                      <em>
                        A Alma do Negócio: O Campo Sistêmico nas Organizações.
                      </em>
                    </li>
                    <li>
                      • <strong>Garriga Bacardí, Joan.</strong>{" "}
                      <em>
                        Onde Estão as Moedas? A Chave do Vínculo Entre Pais e Filhos.
                      </em>
                    </li>
                    <li>
                      • <strong>Schützenberger, Anne Ancelin.</strong>{" "}
                      <em>Meus Antepassados! A Família e suas Heranças Ocultas.</em>
                    </li>
                  </ul>
                </div>

                <div className="pt-0.5 print-avoid-break">
                  <SupportNotice variant="print" />
                </div>
              </div>

              {/* Rodapé Página 6 */}
              <div className="border-t border-gray-300 pt-1.5 flex justify-between text-[8.5px] text-gray-500 mt-auto print-avoid-break">
                <span>
                  Jogo Sistêmico — A Metamorfose da Consciência • INstituto Kalapa
                </span>
                <span>Página 6 de 6</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
