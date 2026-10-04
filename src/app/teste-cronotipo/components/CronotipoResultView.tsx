"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Printer,
  RotateCcw,
  SunMedium,
  Moon,
  Sunrise,
  Clock,
  Brain,
  Shield,
  Activity,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Award,
  ChevronRight,
  Flame,
  Droplets,
  HelpCircle,
} from "lucide-react";
import { ResultadoCronotipoCalculado } from "../lib/calculo-cronotipo";
import {
  CRONOTIPO_REPORTS_MAP,
  CronotipoReportData,
} from "../data/cronotipo-reports-data";
import TestShareMenu from "@/app/components/TestShareMenu";

interface CronotipoResultViewProps {
  resultado: ResultadoCronotipoCalculado;
  onReiniciar: () => void;
  onAbrirRelatorio: () => void;
  usuario: { id: string; nome: string; email?: string } | null;
}

type TabKey = "neurobiologia" | "orientacoes" | "respostas";

export default function CronotipoResultView({
  resultado,
  onReiniciar,
  onAbrirRelatorio,
  usuario,
}: CronotipoResultViewProps) {
  const [tabAtiva, setTabAtiva] = useState<TabKey>("neurobiologia");

  const { tipoCronotipo, pontuacaoTotal, info, respostasDetalhadas } = resultado;
  const relatorio: CronotipoReportData =
    CRONOTIPO_REPORTS_MAP[tipoCronotipo] || CRONOTIPO_REPORTS_MAP.intermediario;

  const renderIcone = () => {
    switch (tipoCronotipo) {
      case "matutino":
        return <Sunrise className="w-8 h-8 text-[#B8965A]" />;
      case "intermediario":
        return <SunMedium className="w-8 h-8 text-[#7D8C6E]" />;
      case "vespertino":
        return <Moon className="w-8 h-8 text-[#1A3C4D]" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Card Principal de Destaque */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-[#E8DEC8]/25 border border-[#E8DEC8] relative overflow-hidden">
        {/* Glow de fundo */}
        <div
          className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none opacity-20"
          style={{ backgroundColor: info.corPrimaria }}
        />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[#E8DEC8]">
          <div className="flex items-start gap-4 sm:gap-5">
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shrink-0 shadow-md border"
              style={{
                backgroundColor: info.corFundo,
                borderColor: info.corBorda,
              }}
            >
              {renderIcone()}
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2 bg-[#B8965A]/15 text-[#B8965A] border border-[#B8965A]/25">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Perfil Circadiano Dominante</span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-light text-[#1A3C4D] leading-tight">
                {info.nome} <span className="font-normal italic">({info.arquetipo})</span>
              </h1>
              <p className="text-sm sm:text-base font-serif italic text-[#B8965A] mt-1">
                {info.subtitulo}
              </p>
            </div>
          </div>

          <div className="flex md:flex-col items-center md:items-end justify-between gap-2 bg-[#F8F4ED] md:bg-transparent p-4 md:p-0 rounded-2xl border md:border-0 border-[#E8DEC8]">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#1A3C4D]/60">
              Pontuação Obtida
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-serif font-bold text-[#1A3C4D]">
                {pontuacaoTotal}
              </span>
              <span className="text-sm text-[#1A3C4D]/60 font-light">/ 18 pts</span>
            </div>
            <span className="text-[11px] font-medium text-[#B8965A]">
              Faixa: {info.faixaPontuacao}
            </span>
          </div>
        </div>

        {/* Régua / Termômetro Circadiano */}
        <div className="py-6 sm:py-8">
          <div className="flex items-center justify-between text-xs text-[#1A3C4D]/70 font-medium mb-2.5">
            <span className="flex items-center gap-1 text-[#1A3C4D]">
              <Moon className="w-3.5 h-3.5 text-[#1A3C4D]" /> Vespertino (6-9 pts)
            </span>
            <span className="flex items-center gap-1 text-[#7D8C6E]">
              <SunMedium className="w-3.5 h-3.5 text-[#7D8C6E]" /> Intermediário (10-14 pts)
            </span>
            <span className="flex items-center gap-1 text-[#B8965A]">
              <Sunrise className="w-3.5 h-3.5 text-[#B8965A]" /> Matutino (15-18 pts)
            </span>
          </div>

          <div className="relative w-full h-4 bg-[#E8DEC8]/50 rounded-full overflow-hidden p-0.5 border border-[#E8DEC8]">
            <div className="w-full h-full rounded-full bg-gradient-to-r from-[#1A3C4D] via-[#7D8C6E] to-[#B8965A]" />
          </div>

          {/* Marcador da pontuação do participante */}
          <div className="relative w-full h-6 mt-1">
            <div
              className="absolute top-0 -translate-x-1/2 flex flex-col items-center transition-all duration-500"
              style={{ left: `${resultado.porcentagemEscala}%` }}
            >
              <div className="w-0 h-0 border-x-4 border-x-transparent border-b-6 border-b-[#1A3C4D]" />
              <span className="text-[11px] font-bold text-white bg-[#1A3C4D] px-2 py-0.5 rounded-full shadow-xs whitespace-nowrap">
                Você: {pontuacaoTotal} pts
              </span>
            </div>
          </div>
        </div>

        {/* 3 Métricas Circadianas Chave */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#E8DEC8]">
          <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#E8DEC8]/80">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#1A3C4D]/70 uppercase tracking-wider mb-1">
              <Clock className="w-4 h-4 text-[#B8965A]" />
              <span>Janela de Pico Cognitivo</span>
            </div>
            <p className="text-base font-serif font-medium text-[#1A3C4D]">
              {info.janelaPico}
            </p>
            <p className="text-xs text-[#1A3C4D]/60 mt-1 font-light">
              Foco máximo, raciocínio e alta complexidade.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#E8DEC8]/80">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#1A3C4D]/70 uppercase tracking-wider mb-1">
              <Moon className="w-4 h-4 text-[#7D8C6E]" />
              <span>Janela de Repouso Ideal</span>
            </div>
            <p className="text-base font-serif font-medium text-[#1A3C4D]">
              {info.horarioSonoIdeal}
            </p>
            <p className="text-xs text-[#1A3C4D]/60 mt-1 font-light">
              Preserva a sincronia neuro-hormonal.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#E8DEC8]/80">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#1A3C4D]/70 uppercase tracking-wider mb-1">
              <Brain className="w-4 h-4 text-[#1A3C4D]" />
              <span>Tomada de Decisão</span>
            </div>
            <p className="text-base font-serif font-medium text-[#1A3C4D]">
              {tipoCronotipo === "matutino"
                ? "Manhã & Primeiras Horas"
                : tipoCronotipo === "vespertino"
                ? "Final da Tarde & Noite"
                : "Meio da Manhã às 16h"}
            </p>
            <p className="text-xs text-[#1A3C4D]/60 mt-1 font-light">
              Pico de alerta no córtex pré-frontal.
            </p>
          </div>
        </div>

        {/* Botões de Ação Imediata */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-[#E8DEC8]">
          <button
            type="button"
            onClick={onAbrirRelatorio}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#1A3C4D] hover:bg-[#15313F] text-white text-sm font-semibold transition-all duration-200 shadow-md shadow-[#1A3C4D]/15 flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-[#B8965A]" />
            <span>Acessar Dossiê Completo (30 Tópicos & PDF)</span>
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <TestShareMenu
              variant="button"
              titulo={`Meu Cronotipo é ${info.nome} (${info.arquetipo})!`}
              path="/teste-cronotipo"
              convite={`Fiz o teste de Ritmo Biológico no INstituto Kalapa e meu resultado foi ${info.nome} (${info.arquetipo}) com ${pontuacaoTotal} pontos:`}
            />

            <button
              type="button"
              onClick={onReiniciar}
              className="p-3 rounded-2xl border border-[#E8DEC8] text-[#1A3C4D]/70 hover:text-[#1A3C4D] hover:bg-[#F8F4ED] transition-colors cursor-pointer"
              title="Refazer teste"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Navegação por Abas para Aprofundamento */}
      <div className="bg-white rounded-3xl p-6 sm:p-9 shadow-lg shadow-[#E8DEC8]/20 border border-[#E8DEC8]">
        <div className="flex border-b border-[#E8DEC8] gap-4 sm:gap-8 overflow-x-auto pb-px mb-6 scrollbar-none">
          <button
            type="button"
            onClick={() => setTabAtiva("neurobiologia")}
            className={`pb-3 text-xs sm:text-sm font-medium transition-colors border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              tabAtiva === "neurobiologia"
                ? "border-[#B8965A] text-[#1A3C4D] font-semibold"
                : "border-transparent text-[#1A3C4D]/60 hover:text-[#1A3C4D]"
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>Fundamentação & Neurobiologia</span>
          </button>

          <button
            type="button"
            onClick={() => setTabAtiva("orientacoes")}
            className={`pb-3 text-xs sm:text-sm font-medium transition-colors border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              tabAtiva === "orientacoes"
                ? "border-[#B8965A] text-[#1A3C4D] font-semibold"
                : "border-transparent text-[#1A3C4D]/60 hover:text-[#1A3C4D]"
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Guia Rápido dos Tópicos</span>
          </button>

          <button
            type="button"
            onClick={() => setTabAtiva("respostas")}
            className={`pb-3 text-xs sm:text-sm font-medium transition-colors border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              tabAtiva === "respostas"
                ? "border-[#B8965A] text-[#1A3C4D] font-semibold"
                : "border-transparent text-[#1A3C4D]/60 hover:text-[#1A3C4D]"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Suas 6 Respostas</span>
          </button>
        </div>

        {/* Conteúdo Aba 1: Neurobiologia */}
        {tabAtiva === "neurobiologia" && (
          <div className="space-y-6 text-sm text-[#1A3C4D]/80 leading-relaxed font-light">
            <div className="p-5 rounded-2xl bg-[#F8F4ED] border border-[#E8DEC8]">
              <h3 className="text-base font-serif font-medium text-[#1A3C4D] mb-2">
                Características Fisiológicas
              </h3>
              <p>{relatorio.fundamentacaoCientifica.caracteristicas}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-5 rounded-2xl border border-[#E8DEC8] bg-[#FDFBF7]">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[#B8965A] mb-1.5 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" /> Desafios & Jetlag Social
                </h4>
                <p className="text-xs sm:text-sm">{relatorio.fundamentacaoCientifica.desafios}</p>
              </div>

              <div className="p-5 rounded-2xl border border-[#E8DEC8] bg-[#FDFBF7]">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[#B8965A] mb-1.5 flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5" /> Tomada de Decisão
                </h4>
                <p className="text-xs sm:text-sm">{relatorio.fundamentacaoCientifica.tomadaDeDecisao}</p>
              </div>

              <div className="p-5 rounded-2xl border border-[#E8DEC8] bg-[#FDFBF7]">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[#B8965A] mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Janela para Estudos e Alerta
                </h4>
                <p className="text-xs sm:text-sm">{relatorio.fundamentacaoCientifica.janelaEstudosAlerta}</p>
              </div>

              <div className="p-5 rounded-2xl border border-[#E8DEC8] bg-[#FDFBF7]">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[#B8965A] mb-1.5 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" /> Saúde Mental & Regulação Emocional
                </h4>
                <p className="text-xs sm:text-sm">{relatorio.fundamentacaoCientifica.saudeMentalRegulacao}</p>
              </div>
            </div>
          </div>
        )}

        {/* Conteúdo Aba 2: Orientações Práticas */}
        {tabAtiva === "orientacoes" && (
          <div className="space-y-4">
            <p className="text-xs sm:text-sm text-[#1A3C4D]/70 font-light mb-4">
              Apresentamos abaixo alguns dos 30 tópicos de cuidado integral. Para a leitura de todas as 30 diretrizes com impressão, abra o Dossiê Completo.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatorio.topicos.slice(0, 10).map((t) => (
                <div
                  key={t.numero}
                  className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#E8DEC8] hover:border-[#B8965A]/50 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-6 h-6 rounded-lg bg-[#B8965A]/15 text-[#B8965A] text-xs font-bold flex items-center justify-center">
                      {t.numero}
                    </span>
                    <h4 className="text-xs sm:text-sm font-semibold text-[#1A3C4D]">
                      {t.titulo}
                    </h4>
                  </div>
                  <p className="text-xs text-[#1A3C4D]/80 font-light leading-relaxed pl-8">
                    {t.conteudo}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-4 text-center">
              <button
                type="button"
                onClick={onAbrirRelatorio}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#B8965A] hover:underline cursor-pointer"
              >
                <span>Ver os 30 tópicos e imprimir o relatório completo em PDF</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Conteúdo Aba 3: Suas Respostas */}
        {tabAtiva === "respostas" && (
          <div className="space-y-3">
            {respostasDetalhadas.map((r) => (
              <div
                key={r.questaoId}
                className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#E8DEC8] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <span className="text-[11px] font-semibold text-[#B8965A] uppercase tracking-wider block mb-0.5">
                    Questão {r.questaoId} • {r.dimensao}
                  </span>
                  <p className="text-xs sm:text-sm font-serif text-[#1A3C4D]">
                    {r.enunciado}
                  </p>
                  <p className="text-xs text-[#1A3C4D]/80 font-light mt-1">
                    Sua resposta: <strong>Opção {r.opcaoLetra})</strong> {r.opcaoTexto}
                  </p>
                </div>

                <div className="shrink-0 self-start sm:self-center">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#1A3C4D]/10 text-[#1A3C4D]">
                    +{r.pontos} {r.pontos === 1 ? "ponto" : "pontos"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Convite para Vivências e Integração */}
      <div className="bg-[#F8F4ED] rounded-3xl p-6 sm:p-8 border border-[#E8DEC8] flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-base sm:text-lg font-serif font-medium text-[#1A3C4D] mb-1">
            Integre seus Ritmos no INstituto Kalapa
          </h3>
          <p className="text-xs sm:text-sm text-[#1A3C4D]/75 font-light leading-relaxed">
            Descubra também seu perfil energético no teste Yin-Yang e seu eneatipo de personalidade para uma visão sistêmica completa de seu corpo e mente.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/teste-autoconhecimento"
            className="px-5 py-3 rounded-xl bg-white border border-[#E8DEC8] text-xs font-semibold text-[#1A3C4D] hover:bg-[#FDFBF7] transition-colors"
          >
            Outros Testes
          </Link>
          <button
            type="button"
            onClick={onAbrirRelatorio}
            className="px-5 py-3 rounded-xl bg-[#B8965A] text-white text-xs font-semibold hover:bg-[#A38349] transition-colors shadow-xs"
          >
            Emitir Laudo PDF
          </button>
        </div>
      </div>
    </div>
  );
}
