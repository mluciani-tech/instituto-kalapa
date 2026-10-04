"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, Printer, Download, Sparkles, CheckCircle2, HeartHandshake, ShieldCheck } from "lucide-react";
import { YIN_YANG_PERGUNTAS, ResultadoInfo } from "../data/yin-yang-data";

interface TestReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  usuarioNome: string;
  usuarioEmail?: string;
  pontosYang: number;
  pontosYin: number;
  respostas: Record<number, "yang" | "yin">;
  resultado: ResultadoInfo;
}

export default function TestReportModal({
  isOpen,
  onClose,
  usuarioNome,
  usuarioEmail,
  pontosYang,
  pontosYin,
  respostas,
  resultado,
}: TestReportModalProps) {
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

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      id="relatorio-impressao-container"
      className="modal-impressao-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static print:overflow-visible"
    >
      {/* Container Principal */}
      <div className="modal-impressao-card relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col print:max-h-none print:shadow-none print:rounded-none print:border-none print:w-full">
        {/* Barra Superior de Ações (Oculta na Impressão) */}
        <div className="no-print sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-brand-charcoal text-white border-b border-white/10 print:hidden shrink-0">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-brand-terracotta/20 text-brand-terracotta">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-white">Relatório de Autoconhecimento Energético</h2>
              <p className="text-[11px] text-white/60">Medicina Tradicional Chinesa & Filosofia Taoista</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-terracotta hover:bg-brand-terracotta-dark text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-brand-terracotta/20 cursor-pointer"
              title="Salvar como PDF ou Imprimir"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Salvar em PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Conteúdo do Relatório Formatado para Impressão */}
        <div
          id="relatorio-impressao"
          ref={reportRef}
          className="relatorio-impressao-conteudo p-6 md:p-10 space-y-8 overflow-y-auto text-brand-charcoal font-sans print:p-0 print:overflow-visible print:space-y-6"
        >
          {/* Cabeçalho Oficial do Relatório */}
          <div className="border-b-2 border-brand-terracotta/30 pb-6 print:pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-xl md:text-2xl font-black text-brand-charcoal tracking-tight font-serif">
                  INstituto Kalapa
                </span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-brand-terracotta/15 text-brand-terracotta font-semibold uppercase tracking-wider">
                  MTC & Autoconhecimento
                </span>
              </div>
              <p className="text-xs text-brand-charcoal/70 mt-1">
                Avaliação de Tendência Energética: <strong>Yin ou Yang?</strong>
              </p>
            </div>

            <div className="text-left sm:text-right text-xs text-brand-charcoal/70 space-y-0.5 bg-brand-beige-light/50 sm:bg-transparent p-3 sm:p-0 rounded-xl w-full sm:w-auto">
              <p className="font-semibold text-brand-charcoal">
                Participante: <span className="text-brand-purple">{usuarioNome}</span>
              </p>
              {usuarioEmail && <p className="text-[11px] text-brand-charcoal/60">{usuarioEmail}</p>}
              <p className="text-[11px] text-brand-charcoal/50">Avaliação realizada em: {dataAtual}</p>
            </div>
          </div>

          {/* Quadro de Diagnóstico & Balança */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch print:grid-cols-3 print:gap-4">
            {/* Card Principal do Diagnóstico */}
            <div className="md:col-span-2 bg-brand-beige-light/40 border border-brand-terracotta/25 rounded-2xl p-5 md:p-6 space-y-3 flex flex-col justify-between print:rounded-xl">
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-brand-terracotta">
                  Resultado Oficial da Autoavaliação
                </span>
                <h3 className="text-lg md:text-xl font-bold text-brand-charcoal mt-1">
                  {resultado.titulo}
                </h3>
                <p className="text-xs text-brand-charcoal/75 mt-1 font-medium italic">
                  {resultado.subtitulo}
                </p>
              </div>

              {/* Barra da Balança Energética */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-brand-terracotta flex items-center gap-1">
                    🔥 Lado Yang: {pontosYang} pontos ({Math.round((pontosYang / 15) * 100)}%)
                  </span>
                  <span className="text-brand-mint-dark flex items-center gap-1">
                    🌊 Lado Yin: {pontosYin} pontos ({Math.round((pontosYin / 15) * 100)}%)
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-brand-beige overflow-hidden flex shadow-inner">
                  <div
                    style={{ width: `${(pontosYang / 15) * 100}%` }}
                    className="bg-brand-terracotta transition-all duration-500"
                  />
                  <div
                    style={{ width: `${(pontosYin / 15) * 100}%` }}
                    className="bg-brand-mint transition-all duration-500"
                  />
                </div>
              </div>
            </div>

            {/* Imagem Editorial Artística (no relatório impresso ou na tela) */}
            <div className="relative rounded-2xl overflow-hidden border border-brand-beige min-h-[160px] md:min-h-full print:min-h-[180px] print:h-44 print:w-full print:rounded-xl">
              <Image
                src={resultado.imagem}
                alt={resultado.titulo}
                fill
                unoptimized
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 300px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
                <span className="text-[10px] text-white/90 font-medium">
                  Harmonia Taoista & Fitoterapia
                </span>
              </div>
            </div>
          </div>

          {/* 1. Compreensão do Estado Atual */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-brand-purple flex items-center gap-2 border-b border-brand-beige pb-1.5">
              <span>🧭</span> 1. Compreendendo Sua Tendência Energética Atual
            </h4>
            <div className="space-y-2 text-xs text-brand-charcoal/80 leading-relaxed">
              {resultado.compreensao.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>

          {/* 2. Como o Excesso Afeta o Sono */}
          <div className="space-y-3 bg-brand-purple/5 p-4 rounded-xl border border-brand-purple/15 print:p-3">
            <h4 className="text-sm font-bold text-brand-purple-deep flex items-center gap-2">
              <span>🌙</span> 2. Como Essa Tendência Afeta o Seu Sono
            </h4>
            <p className="text-xs text-brand-charcoal/80 leading-relaxed italic">
              {resultado.comoAfetaSono.resumo}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {resultado.comoAfetaSono.itens.map((it, i) => (
                <div key={i} className="bg-white p-3 rounded-lg border border-brand-purple/10 space-y-1">
                  <p className="font-bold text-xs text-brand-purple">{it.titulo}</p>
                  <p className="text-[11px] text-brand-charcoal/70 leading-relaxed">{it.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Se não cuidar, pode agravar para... */}
          <div className="space-y-2 bg-amber-50/70 p-4 rounded-xl border border-amber-200 text-xs print:p-3">
            <h4 className="font-bold text-amber-900 flex items-center gap-2 text-xs">
              <span>⚠️</span> 3. Alertas Preventivos: Se não cuidar, o quadro pode evoluir para...
            </h4>
            <p className="text-amber-950/80 leading-relaxed text-[11px]">
              {resultado.riscosSeNaoCuidar.resumo}
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-[11px] text-amber-900 list-disc list-inside">
              {resultado.riscosSeNaoCuidar.itens.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Quebra de Página na Impressão se necessário */}
          <div className="print:break-before-page" />

          {/* 4. Alimentação Terapêutica (Dietoterapia MTC) */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-brand-charcoal flex items-center gap-2 border-b border-brand-beige pb-1.5">
              <span>🍲</span> 4. Dietoterapia Chinesa: Direcionamento da Alimentação
            </h4>
            <p className="text-xs text-brand-charcoal/80 leading-relaxed font-medium">
              {resultado.alimentacao.diretriz}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-1">
                <span className="font-bold text-emerald-800 block">✓ Alimentos Indicados:</span>
                <ul className="text-[11px] text-emerald-950 space-y-1 list-disc list-inside">
                  {resultado.alimentacao.indicados.map((it, i) => (
                    <li key={i}>{it}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-brand-beige-light/70 border border-brand-beige rounded-xl space-y-1">
                <span className="font-bold text-brand-charcoal block">🌿 Temperos Recomendados:</span>
                <ul className="text-[11px] text-brand-charcoal/80 space-y-1 list-disc list-inside">
                  {resultado.alimentacao.temperos.map((it, i) => (
                    <li key={i}>{it}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-red-50/60 border border-red-200 rounded-xl space-y-1">
                <span className="font-bold text-red-800 block">✕ Evitar Temporariamente:</span>
                <ul className="text-[11px] text-red-950 space-y-1 list-disc list-inside">
                  {resultado.alimentacao.evitar.map((it, i) => (
                    <li key={i}>{it}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 5. Chás Indicados para o Dia a Dia */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-brand-charcoal flex items-center gap-2 border-b border-brand-beige pb-1.5">
              <span>🍵</span> 5. Chás & Fitoterapia para Restaurar o Equilíbrio
            </h4>
            <p className="text-xs text-brand-charcoal/70">{resultado.chas.estrategia}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {resultado.chas.lista.map((cha, i) => (
                <div key={i} className="p-3 rounded-xl border border-brand-beige bg-white space-y-1">
                  <p className="font-bold text-brand-purple text-xs">{cha.nome}</p>
                  <p className="text-[11px] text-brand-charcoal/75 leading-relaxed">{cha.beneficio}</p>
                  {cha.preparo && (
                    <p className="text-[10px] text-brand-terracotta-dark font-medium mt-1">
                      💡 <em>Preparo: {cha.preparo}</em>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 6. Respiração Terapêutica Guiada */}
          <div className="p-4 rounded-xl bg-brand-charcoal/5 border border-brand-beige space-y-2 text-xs">
            <h4 className="font-bold text-brand-charcoal flex items-center gap-2 text-sm">
              <span>🫁</span> 6. {resultado.respiracao.nome}
            </h4>
            <p className="text-[11px] text-brand-charcoal/70 italic">
              {resultado.respiracao.subtitulo}
            </p>
            <div className="space-y-1 text-[11px] text-brand-charcoal/80 leading-relaxed pt-1">
              {resultado.respiracao.instrucoes.map((inst, i) => (
                <p key={i}>• {inst}</p>
              ))}
            </div>
          </div>

          {/* 7. Hábitos & Estilo de Vida */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-brand-charcoal flex items-center gap-2 border-b border-brand-beige pb-1">
              <span>☀️</span> 7. Dicas de Hábitos e Estilo de Vida
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {resultado.habitos.map((hab, i) => (
                <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-brand-beige-light/40">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-[11px] text-brand-charcoal/80">{hab}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tabela Resumo das 15 Respostas */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold text-brand-charcoal uppercase tracking-wider text-brand-charcoal/60">
              Mapeamento Detalhado das 15 Categorias Respondidas
            </h4>
            <div className="border border-brand-beige rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-brand-beige-light/80 text-[10px] uppercase font-bold text-brand-charcoal/70 border-b border-brand-beige">
                  <tr>
                    <th className="px-3 py-2">Categoria</th>
                    <th className="px-3 py-2">Sua Tendência Marcada</th>
                    <th className="px-3 py-2 text-right">Polaridade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-beige text-[11px]">
                  {YIN_YANG_PERGUNTAS.map((p) => {
                    const resposta = respostas[p.id];
                    const ehYang = resposta === "yang";
                    return (
                      <tr key={p.id} className="hover:bg-brand-beige-light/30">
                        <td className="px-3 py-1.5 font-medium text-brand-charcoal">
                          {p.icone} {p.categoria}
                        </td>
                        <td className="px-3 py-1.5 text-brand-charcoal/80">
                          {ehYang ? p.ladoYang.titulo : p.ladoYin.titulo}
                        </td>
                        <td className="px-3 py-1.5 text-right font-bold">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] ${
                              ehYang
                                ? "bg-amber-100 text-amber-900"
                                : "bg-emerald-100 text-emerald-900"
                            }`}
                          >
                            {ehYang ? "Yang" : "Yin"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Rodapé Institucional e Chamada para Ação */}
          <div className="pt-6 border-t-2 border-brand-terracotta/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-charcoal/70">
            <div className="space-y-1 text-center sm:text-left">
              <p className="font-bold text-brand-charcoal">
                INstituto Kalapa — Espaço Serena (Cotia - SP)
              </p>
              <p className="text-[11px] text-brand-charcoal/60">
                Vivências em Grupo e Atendimentos Terapêuticos Integrativos de MTC
              </p>
              <p className="text-[10px] text-brand-purple font-mono">
                www.institutokalapa.com.br • WhatsApp: (11) 91745-2732
              </p>
            </div>

            <div className="text-center sm:text-right print:hidden">
              <a
                href="/produtos?categoria=atendimentos"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-brand-charcoal text-white font-semibold text-xs rounded-xl hover:bg-brand-charcoal/90 transition-colors shadow-sm"
              >
                Agendar Consulta de MTC &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
