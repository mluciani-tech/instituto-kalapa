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
          <div>
            <h2 className="text-xl font-serif font-bold text-[#1A3C4D]">
              Dossiê da Metamorfose da Consciência (6 Páginas A4)
            </h2>
            <p className="text-xs text-[#1A3C4D]/60 font-light mt-1">
              Cartas Sorteadas: {cartas[1].id} • {cartas[2].id} • {cartas[3].id} •{" "}
              {cartas[4].id}
            </p>
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

            <SupportNotice variant="screen" />
          </div>

          {/* ========================================================= */}
          {/* LAYOUT DE IMPRESSÃO A4 (6 PÁGINAS EDITORIAIS) */}
          {/* ========================================================= */}
          <div className="hidden print:block bg-white text-black w-full text-[11.5px] leading-relaxed max-w-[210mm] mx-auto">
            {/* ------------------------------------------------------- */}
            {/* PÁGINA 1: FUNDAMENTAÇÃO, EQUAÇÃO NARRATIVA E BALANÇA */}
            {/* ------------------------------------------------------- */}
            <div className="print:break-after-page space-y-5 pt-2 pb-6">
              <div className="text-center space-y-1.5 mb-5 border-b-2 border-[#B8965A] pb-4">
                <p className="text-[#B8965A] font-bold text-[10px] uppercase tracking-widest">
                  INstituto Kalapa • Desenvolvimento Humano & Abordagem Sistêmica
                </p>
                <h1 className="text-2xl font-serif font-extrabold text-[#1A3C4D]">
                  JOGO SISTÊMICO — A METAMORFOSE DA CONSCIÊNCIA
                </h1>
                <p className="text-[#1A3C4D]/75 italic text-xs">
                  Dossiê Fenomenológico Individual • Fundamentado em Bert Hellinger, Jan Jacob Stam & Joan Garriga
                </p>
              </div>

              {/* Metadados da Sessão */}
              <div className="grid grid-cols-3 gap-3 p-3 bg-[#FDFBF7] border border-[#E8DEC8] text-[11px] print-avoid-break">
                <div>
                  <span className="font-bold text-[#1A3C4D] block uppercase text-[9.5px]">
                    Esfera Investigada:
                  </span>
                  <span>{resultado.categoriaTemaLabel}</span>
                </div>
                <div>
                  <span className="font-bold text-[#1A3C4D] block uppercase text-[9.5px]">
                    Tema Registrado:
                  </span>
                  <span>
                    {resultado.temaEmSilencio
                      ? "Mentalizado em Silêncio"
                      : resultado.temaDescricao || "Vivência Pessoal"}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-[#1A3C4D] block uppercase text-[9.5px]">
                    Data & Tiragem:
                  </span>
                  <span>
                    {dataExibicao} ({cartas[1].id} • {cartas[2].id} •{" "}
                    {cartas[3].id} • {cartas[4].id})
                  </span>
                </div>
              </div>

              {/* Fundamentação Sintética */}
              <div className="space-y-1.5 text-justify print-avoid-break">
                <h2 className="text-[#1A3C4D] font-bold uppercase text-[12px] border-b border-[#1A3C4D] pb-0.5">
                  1. Fundamentação & As Três Leis Sistêmicas
                </h2>
                <p>
                  O <strong>Jogo Sistêmico — A Metamorfose da Consciência</strong> é uma experiência de autoconhecimento desenvolvida pelo <strong>INstituto Kalapa</strong>. Unindo os quatro estágios biológicos da metamorfose (Ovo, Lagarta, Crisálida e Borboleta) às Três Leis Sistêmicas de Bert Hellinger (<strong>1. Pertencimento</strong>, <strong>2. Ordem/Hierarquia</strong> e <strong>3. Equilíbrio entre Dar e Receber</strong>), o jogo convida a alma a abandonar a pressa infantil de manipular acontecimentos e encontrar a força que brota da concordância com a realidade exatamente como ela é.
                </p>
              </div>

              {/* A Equação Narrativa Contínua */}
              <div className="space-y-2 print-avoid-break">
                <h2 className="text-[#1A3C4D] font-bold uppercase text-[12px] border-b border-[#1A3C4D] pb-0.5">
                  2. O Diagnóstico Narrativo Contínuo da Sua Alma
                </h2>
                <p className="text-[11px] text-justify">
                  Ao retirar suas quatro cartas na ordem orgânica da metamorfose, o campo revelou a seguinte equação narrativa contínua (recomenda-se a leitura pausada e em voz alta):
                </p>

                <div className="border border-[#B8965A] bg-[#FDFBF7] p-3.5 space-y-2.5">
                  {([1, 2, 3, 4] as const).map((qId) => {
                    const c = cartas[qId];
                    return (
                      <div key={qId} className="text-justify">
                        <span className="font-bold text-[#1A3C4D] text-[11px]">
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
              <div className="space-y-2 print-avoid-break">
                <h2 className="text-[#1A3C4D] font-bold uppercase text-[12px] border-b border-[#1A3C4D] pb-0.5">
                  3. A Balança entre a Ferida (Bloco A) e a Consciência Adulta (Bloco B)
                </h2>
                <div className="border border-[#7D8C6E] bg-[#F9FBF8] p-3.5 space-y-2 text-justify">
                  <div className="flex justify-between items-center border-b border-[#7D8C6E]/30 pb-1">
                    <strong className="text-[#1A3C4D] text-[12px]">
                      {balanca.titulo}
                    </strong>
                    <span className="text-[10.5px] font-bold text-[#7D8C6E]">
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

              {/* Rodapé Página 1 */}
              <div className="border-t border-gray-300 pt-2 flex justify-between text-[9px] text-gray-500 mt-8 print-avoid-break">
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
                  className="print:break-after-page space-y-4 pt-2 pb-6"
                >
                  {/* Cabeçalho do Quadrante */}
                  <div className="border-b-2 border-[#1A3C4D] pb-3 print-avoid-break">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-[#B8965A] mb-0.5">
                      <span>
                        Quadrante {qId}: {qInfo.nome} • {qInfo.subtituloArquetipico}
                      </span>
                      <span>Pergunta: «{qInfo.perguntaSistemica}»</span>
                    </div>
                    <h2 className="text-xl font-serif font-extrabold text-[#1A3C4D]">
                      [ CARTA {c.id} ] {c.titulo.toUpperCase()}
                    </h2>
                    <p className="text-[11px] text-[#1A3C4D]/80 font-semibold">
                      Bloco {c.bloco} ({c.categoria}) • {c.subtitulo}
                    </p>
                  </div>

                  {/* Frase-Guia */}
                  <div className="p-3 bg-[#FDFBF7] border border-[#B8965A] text-justify print-avoid-break">
                    <strong className="text-[#B8965A] uppercase text-[10px] block mb-0.5">
                      Frase-Guia Revelada no Caderno:
                    </strong>
                    <p className="font-serif italic text-[12.5px] text-[#1A3C4D]">
                      «{c.mensagem_completa}»
                    </p>
                  </div>

                  {/* As 3 Dimensões Analíticas */}
                  <div className="space-y-3 text-justify print-avoid-break">
                    <div>
                      <strong className="text-[#1A3C4D] text-[11.5px] uppercase block mb-0.5">
                        1. Reflexão Sistêmica & Conexão com {qInfo.nome}:
                      </strong>
                      <p>{c.reflexao_sistemica}</p>
                    </div>

                    <div>
                      <strong className="text-[#1A3C4D] text-[11.5px] uppercase block mb-0.5">
                        2. Dinâmica Interna Sistêmica (Na Alma):
                      </strong>
                      <p>{c.dinamica_interna}</p>
                    </div>

                    <div>
                      <strong className="text-[#1A3C4D] text-[11.5px] uppercase block mb-0.5">
                        3. Dinâmica Externa no Mundo Real (Negócios & Vida):
                      </strong>
                      <p>{c.dinamica_externa}</p>
                    </div>
                  </div>

                  {/* 4. Perguntas de Autoindagação e Registro do Caderno */}
                  <div className="border border-gray-300 p-3.5 bg-white space-y-2.5 print-avoid-break">
                    <strong className="text-[#1A3C4D] text-[11.5px] uppercase block border-b border-gray-200 pb-1">
                      4. Perguntas de Autoindagação Fenomenológica & Registro do Participante:
                    </strong>

                    {c.perguntas_autoindagacao.map((pergunta, idx) => {
                      const key = (`resposta${idx + 1}`) as
                        | "resposta1"
                        | "resposta2"
                        | "resposta3";
                      const respostaDigitada = notas[key]?.trim();

                      return (
                        <div key={idx} className="space-y-1 text-justify">
                          <p className="font-semibold text-[#1A3C4D] text-[11px]">
                            • {pergunta}
                          </p>
                          {respostaDigitada ? (
                            <p className="p-2 bg-[#FDFBF7] border-l-2 border-[#B8965A] italic text-[#1A3C4D]">
                              {respostaDigitada}
                            </p>
                          ) : (
                            <div className="space-y-2 pt-1 pb-1">
                              <div className="border-b border-dashed border-gray-300 h-4" />
                              <div className="border-b border-dashed border-gray-300 h-4" />
                            </div>
                          )}
                        </div>
                      );
                    })}

                    <div className="pt-1 text-justify">
                      <p className="font-semibold text-[#1A3C4D] text-[11px]">
                        • Ressonância Corporal (Onde meu corpo sentiu alívio ou aperto ao ler esta carta?):
                      </p>
                      {notas.ressonanciaCorporal?.trim() ? (
                        <p className="p-2 bg-[#FDFBF7] border-l-2 border-[#7D8C6E] italic text-[#1A3C4D] mt-1">
                          {notas.ressonanciaCorporal}
                        </p>
                      ) : (
                        <div className="border-b border-dashed border-gray-300 h-4 mt-1" />
                      )}
                    </div>
                  </div>

                  {/* Exercício Interior da Concordância e Rito de Passagem */}
                  <div className="border border-[#7D8C6E] p-3.5 bg-[#F9FBF8] text-justify print-avoid-break">
                    <strong className="text-[#7D8C6E] text-[11px] uppercase block mb-1">
                      • O Exercício Interior da Concordância ({qInfo.nome}):
                    </strong>
                    <p className="italic font-serif text-[#1A3C4D] font-medium">
                      «{fala}»
                    </p>
                  </div>

                  {/* Rodapé da Página do Quadrante */}
                  <div className="border-t border-gray-300 pt-2 flex justify-between text-[9px] text-gray-500 mt-6 print-avoid-break">
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
            <div className="space-y-5 pt-2 pb-6">
              <div className="space-y-1 border-b-2 border-[#1A3C4D] pb-2 mb-4 print-avoid-break">
                <p className="text-[#B8965A] font-bold text-[10px] uppercase tracking-widest">
                  Fechamento & Prática Pessoal • INstituto Kalapa
                </p>
                <h2 className="text-[#1A3C4D] font-serif font-extrabold uppercase text-lg">
                  INTEGRAÇÃO DA JORNADA COMPLETA & RECOLHIMENTO
                </h2>
              </div>

              {/* Tabela Resumo de Registro e Postura */}
              <div className="space-y-2 print-avoid-break">
                <h3 className="text-[#1A3C4D] font-bold uppercase text-[12px]">
                  1. Quadro Sinóptico da Sua Metamorfose
                </h3>
                <table className="w-full border-collapse border border-gray-300 text-[10.5px]">
                  <thead>
                    <tr className="bg-[#1A3C4D] text-white">
                      <th className="border border-gray-300 p-2 text-left w-1/5">
                        Quadrante
                      </th>
                      <th className="border border-gray-300 p-2 text-left w-1/4">
                        Carta Revelada
                      </th>
                      <th className="border border-gray-300 p-2 text-left">
                         Postura Interior de Concordância
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {([1, 2, 3, 4] as const).map((qId) => {
                      const c = cartas[qId];
                      return (
                        <tr key={qId}>
                          <td className="border border-gray-300 p-2 font-bold bg-[#FDFBF7]">
                            {qId}. {c.quadrante_nome}
                          </td>
                          <td className="border border-gray-300 p-2">
                            <strong>
                              {c.id} — {c.titulo}
                            </strong>
                            <br />
                            <span className="text-[9.5px] text-gray-600">
                              Bloco {c.bloco} • {c.subtitulo}
                            </span>
                          </td>
                          <td className="border border-gray-300 p-2 italic bg-[#F9FBF8] text-justify">
                            «{obterFalaConcordanciaCarta(c)}»
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Espaço para Anotação de Integração Final */}
              <div className="border border-gray-300 p-3.5 bg-white space-y-2.5 print-avoid-break">
                <strong className="text-[#1A3C4D] text-[11.5px] uppercase block">
                  2. Postura de Integração Pessoal (O que posso concordar e soltar hoje?):
                </strong>
                <div className="space-y-2.5 pt-1">
                  <div className="border-b border-dashed border-gray-300 h-4" />
                  <div className="border-b border-dashed border-gray-300 h-4" />
                  <div className="border-b border-dashed border-gray-300 h-4" />
                </div>
              </div>

              {/* A Sabedoria da Não-Intervenção Imediata */}
              <div className="border border-[#B8965A] p-4 bg-[#FDFBF7] text-justify print-avoid-break">
                <h3 className="font-bold text-[#B8965A] uppercase text-[11px] mb-1.5">
                  3. A Sabedoria do Recolhimento e da Não-Intervenção Imediata (As 72 Horas)
                </h3>
                <p className="text-[11px]">
                  Após realizar a tiragem, <strong>não tente formular planos de ação imediatos nem tomar decisões impulsivas nas próximas 72 horas</strong>. Como nos ensina Bert Hellinger em <em>A Fonte Não Precisa Perguntar pelo Caminho</em>, as compreensões sistêmicas atuam como sementes no solo fértil da alma. Quando perturbamos o processo com análises mentais excessivas ou discutimos imediatamente a tiragem com terceiros, roubamos a força do movimento primordial. Guarde este registro em silêncio e confie que a realidade encontrará o seu próprio curso no tempo certo.
                </p>
              </div>

              {/* Diretriz Ética */}
              <div className="border border-[#1A3C4D] p-3.5 text-justify print-avoid-break">
                <h3 className="font-bold text-[#1A3C4D] uppercase text-[10.5px] mb-1">
                  Diretriz Ética e Compromisso com a Experiência Viva — INstituto Kalapa
                </h3>
                <p className="text-[10.5px]">
                  Esta vivência é um instrumento fenomenológico de autopercepção e tomada de consciência. O aprofundamento terapêutico e o desatamento de emaranhamentos familiares ou organizacionais demandam o acompanhamento de um <strong>profissional com formação certificada em Constelação Sistêmica</strong>. Não tome nada aqui como dogma rígido: observe os movimentos da sua alma e escute com honestidade a resposta do seu corpo.
                </p>
              </div>

              {/* Referências Bibliográficas */}
              <div className="space-y-1 print-avoid-break">
                <h3 className="text-[#1A3C4D] font-bold uppercase text-[11px] border-b border-[#1A3C4D] pb-0.5">
                  Bibliografia Estruturante Recomendada
                </h3>
                <ul className="text-[10px] space-y-0.5">
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

              <div className="pt-2 print-avoid-break">
                <SupportNotice variant="print" />
              </div>

              {/* Rodapé Página 6 */}
              <div className="border-t border-gray-300 pt-2 flex justify-between text-[9px] text-gray-500 mt-6 print-avoid-break">
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
