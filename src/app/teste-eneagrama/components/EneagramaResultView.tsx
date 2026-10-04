"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Printer,
  RotateCcw,
  Compass,
  Heart,
  Shield,
  HelpCircle,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Brain,
  Flame,
  Droplets,
  Feather,
  Flower2,
  Wind,
  Layers,
  BookOpen,
  Award,
  ChevronRight,
  SunMedium
} from "lucide-react";
import { ResultadoEneagramaCalculado } from "../lib/calculo-eneagrama";
import { ENEAGRAMA_REPORTS_MAP, EneagramaReportData } from "../data/eneagrama-reports-data";
import TestShareMenu from "../../components/TestShareMenu";

interface EneagramaResultViewProps {
  resultado: ResultadoEneagramaCalculado;
  onReiniciar: () => void;
  onAbrirRelatorio: () => void;
  usuario: { id: string; nome: string; email?: string } | null;
}

type TabKey = "matriz" | "sistemica" | "ladoluz" | "terapias";

export default function EneagramaResultView({
  resultado,
  onReiniciar,
  onAbrirRelatorio,
  usuario,
}: EneagramaResultViewProps) {
  const [tabAtiva, setTabAtiva] = useState<TabKey>("matriz");

  const tipoDominante = resultado.tipoDominante;
  const relatorio: EneagramaReportData =
    ENEAGRAMA_REPORTS_MAP[tipoDominante.numero] || ENEAGRAMA_REPORTS_MAP[1];

  const { isEmpate, empates, ranking, pontuacaoMaxima } = resultado;

  const getCentroIcon = (categoria: string) => {
    switch (categoria) {
      case "instintivo":
        return <Flame className="w-3.5 h-3.5 text-amber-600" />;
      case "emocional":
        return <Heart className="w-3.5 h-3.5 text-rose-600" />;
      case "mental":
        return <Brain className="w-3.5 h-3.5 text-blue-600" />;
      default:
        return <Compass className="w-3.5 h-3.5 text-[#7D8C6E]" />;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-10">
      {/* Topo do Resultado */}
      <div className="text-center relative">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#7D8C6E]/15 text-[#7D8C6E] text-xs sm:text-sm font-semibold tracking-wide mb-4 border border-[#7D8C6E]/30">
          <Sparkles className="w-4 h-4" />
          <span>Diagnóstico Concluído • INstituto Kalapa</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-[#1A3C4D] tracking-tight mb-3">
          {usuario?.nome ? `Olá, ${usuario.nome}. ` : ""}
          Seu Eneatipo Dominante é o{" "}
          <span className="italic font-normal text-[#7D8C6E]">
            Tipo {relatorio.numero}
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#1A3C4D]/80 leading-relaxed font-light">
          Apresentamos sua síntese clínica e sistêmica completa, integrando a sabedoria do Eneagrama com as Constelações Familiares de Bert Hellinger e terapias integrativas.
        </p>
      </div>

      {/* Alerta de Empate Técnico (se houver) */}
      {isEmpate && (
        <div className="bg-amber-50/90 rounded-2xl p-5 sm:p-6 border border-amber-200 text-amber-900 shadow-xs">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-base font-semibold mb-1">
                Empate Técnico Identificado ({pontuacaoMaxima} pontos)
              </h3>
              <p className="text-xs sm:text-sm text-amber-800/90 font-light leading-relaxed mb-3">
                Você obteve a mesma pontuação máxima em mais de um perfil:{" "}
                <strong>{empates.map((e) => `Tipo ${e.numero}`).join(" e ")}</strong>.
                Exibimos o laudo do Tipo {tipoDominante.numero}. Recomendamos verificar também os aspectos do outro perfil no laudo geral impresso.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hero Banner do Eneatipo Dominante com Imagem de IA e Dados */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-[#E8DEC8]/25 border border-[#E8DEC8]">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Imagem de IA Arquetípica */}
          <div className="relative h-72 sm:h-80 lg:h-auto lg:col-span-5 bg-[#1A3C4D]">
            <Image
              src={relatorio.imagem}
              alt={relatorio.titulo}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/80 via-black/30 to-transparent flex items-end p-6 sm:p-8">
              <div className="text-white space-y-1.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-white/20 backdrop-blur-md border border-white/30">
                  {getCentroIcon(relatorio.centroCategoria)}
                  {relatorio.centro}
                </span>
                <p className="text-xs text-white/80 font-light">Diagnóstico Clínico & Sistêmico</p>
                <h3 className="text-xl sm:text-2xl font-serif text-white font-medium">
                  {relatorio.titulo}
                </h3>
              </div>
            </div>
          </div>

          {/* Painel de Apresentação e Placar */}
          <div className="p-6 sm:p-8 lg:p-10 lg:col-span-7 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#B8965A]">
                  Síntese Terapêutica Kalapa
                </span>
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-[#7D8C6E]/15 text-[#7D8C6E] border border-[#7D8C6E]/30">
                  Pontuação Máxima no Teste
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-light text-[#1A3C4D] mb-2">
                {relatorio.titulo}
              </h2>
              <p className="text-xs sm:text-sm text-[#1A3C4D]/70 font-light mb-6">
                {relatorio.subtitulo}
              </p>

              {/* Placar Numérico */}
              <div className="bg-[#F8F4ED] rounded-2xl p-4 sm:p-5 border border-[#E8DEC8] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#1A3C4D]/60 uppercase tracking-wider block">
                    Pontuação no Tipo Dominante
                  </span>
                  <p className="text-2xl sm:text-3xl font-serif font-light text-[#7D8C6E] mt-0.5">
                    {resultado.pontuacoesPorLetra[relatorio.letra] || 0}{" "}
                    <span className="text-sm font-sans text-[#1A3C4D]/50 font-normal">
                      / 25 pontos ({Math.round(((resultado.pontuacoesPorLetra[relatorio.letra] || 0) / 25) * 100)}%)
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#1A3C4D]/60 uppercase tracking-wider block">
                    Participante
                  </span>
                  <p className="text-sm font-medium text-[#1A3C4D]">
                    {usuario?.nome || "Convidado"}
                  </p>
                </div>
              </div>
            </div>

            {/* Destaque da Chave Sistêmica */}
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block mb-1 flex items-center gap-1.5">
                <SunMedium className="w-4 h-4 text-emerald-600" /> Chave Sistêmica Kalapa
              </span>
              <p className="text-xs sm:text-sm text-emerald-950 font-light leading-relaxed">
                {relatorio.chaveSistemicaKalapa}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navegação por Abas Temáticas */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-[#E8DEC8]/20 border border-[#E8DEC8]">
        {/* Barra de Abas */}
        <div className="flex items-center gap-2 border-b border-[#E8DEC8] pb-4 mb-8 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setTabAtiva("matriz")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
              tabAtiva === "matriz"
                ? "bg-[#1A3C4D] text-white shadow-sm"
                : "bg-[#F8F4ED] text-[#1A3C4D]/70 hover:bg-[#E8DEC8]/50"
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Matriz Psíquica & Perfil</span>
          </button>

          <button
            type="button"
            onClick={() => setTabAtiva("sistemica")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
              tabAtiva === "sistemica"
                ? "bg-[#1A3C4D] text-white shadow-sm"
                : "bg-[#F8F4ED] text-[#1A3C4D]/70 hover:bg-[#E8DEC8]/50"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Visão Sistêmica & Infância</span>
          </button>

          <button
            type="button"
            onClick={() => setTabAtiva("ladoluz")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
              tabAtiva === "ladoluz"
                ? "bg-[#1A3C4D] text-white shadow-sm"
                : "bg-[#F8F4ED] text-[#1A3C4D]/70 hover:bg-[#E8DEC8]/50"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Lado Luz & Superpoderes</span>
          </button>

          <button
            type="button"
            onClick={() => setTabAtiva("terapias")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
              tabAtiva === "terapias"
                ? "bg-[#1A3C4D] text-white shadow-sm"
                : "bg-[#F8F4ED] text-[#1A3C4D]/70 hover:bg-[#E8DEC8]/50"
            }`}
          >
            <Flower2 className="w-4 h-4" />
            <span>Terapias & Presença</span>
          </button>
        </div>

        {/* CONTEÚDO DA ABA 1: MATRIZ PSÍQUICA & PERFIL */}
        {tabAtiva === "matriz" && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h3 className="text-xl font-serif text-[#1A3C4D] mb-1">
                Perfil Estrutural e Mecanismos Psíquicos
              </h3>
              <p className="text-xs sm:text-sm text-[#1A3C4D]/70 font-light">
                O dinamismo das compulsões neuróticas e como o organismo administra energia vital e defesas:
              </p>
            </div>

            {/* Cards do Dinamismo Psíquico */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 rounded-2xl bg-[#FDFBF7] border border-[#E8DEC8]">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-800 mb-2">
                  <Brain className="w-4 h-4 text-amber-600" />
                  <span>Fixação Mental</span>
                </div>
                <p className="text-xs sm:text-sm text-[#1A3C4D]/85 font-light leading-relaxed">
                  {relatorio.fixacaoMental}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FDFBF7] border border-[#E8DEC8]">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-800 mb-2">
                  <Heart className="w-4 h-4 text-rose-600" />
                  <span>Paixão Emocional</span>
                </div>
                <p className="text-xs sm:text-sm text-[#1A3C4D]/85 font-light leading-relaxed">
                  {relatorio.paixaoEmocional}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FDFBF7] border border-[#E8DEC8]">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-800 mb-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span>Mecanismo de Defesa</span>
                </div>
                <p className="text-xs sm:text-sm text-[#1A3C4D]/85 font-light leading-relaxed">
                  {relatorio.mecanismoDefesa}
                </p>
              </div>
            </div>

            {/* Tabela da Matriz Diagnóstica Completa */}
            <div className="border border-[#E8DEC8] rounded-2xl overflow-hidden">
              <div className="bg-[#1A3C4D] text-white px-5 py-3">
                <h4 className="text-sm font-semibold tracking-wide">
                  Matriz Diagnóstica Completa do Eneatipo {relatorio.numero}
                </h4>
              </div>
              <div className="divide-y divide-[#E8DEC8] text-xs sm:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-3 p-4 bg-[#F8F4ED]">
                  <span className="font-semibold text-[#1A3C4D]">Centro de Inteligência</span>
                  <span className="sm:col-span-2 text-[#1A3C4D]/85 font-light">{relatorio.centro}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 p-4 bg-white">
                  <span className="font-semibold text-[#1A3C4D]">Fixação Mental</span>
                  <span className="sm:col-span-2 text-[#1A3C4D]/85 font-light">{relatorio.fixacaoMental}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 p-4 bg-[#F8F4ED]">
                  <span className="font-semibold text-[#1A3C4D]">Paixão Emocional</span>
                  <span className="sm:col-span-2 text-[#1A3C4D]/85 font-light">{relatorio.paixaoEmocional}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 p-4 bg-white">
                  <span className="font-semibold text-[#1A3C4D]">Mecanismo de Defesa</span>
                  <span className="sm:col-span-2 text-[#1A3C4D]/85 font-light">{relatorio.mecanismoDefesa}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 p-4 bg-emerald-50/50">
                  <span className="font-semibold text-emerald-900">Virtude da Essência</span>
                  <span className="sm:col-span-2 text-emerald-950 font-medium">{relatorio.virtudeEssencia}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 p-4 bg-[#F8F4ED]">
                  <span className="font-semibold text-[#1A3C4D]">Ideia Sagrada</span>
                  <span className="sm:col-span-2 text-[#1A3C4D]/85 font-light">{relatorio.ideiaSagrada}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 p-4 bg-white">
                  <span className="font-semibold text-[#1A3C4D]">Medo Fundamental</span>
                  <span className="sm:col-span-2 text-[#1A3C4D]/85 font-light">{relatorio.medoFundamental}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 p-4 bg-[#F8F4ED]">
                  <span className="font-semibold text-[#1A3C4D]">Desejo Fundamental</span>
                  <span className="sm:col-span-2 text-[#1A3C4D]/85 font-light">{relatorio.desejoFundamental}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 p-4 bg-white">
                  <span className="font-semibold text-[#1A3C4D]">Floral de Bach Indicado</span>
                  <span className="sm:col-span-2 text-[#1A3C4D]/85 font-light">{relatorio.floralBach}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 p-4 bg-[#F8F4ED]">
                  <span className="font-semibold text-[#1A3C4D]">Óleo Essencial Recomendado</span>
                  <span className="sm:col-span-2 text-[#1A3C4D]/85 font-light">{relatorio.oleoEssencial}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CONTEÚDO DA ABA 2: VISÃO SISTÊMICA & INFÂNCIA */}
        {tabAtiva === "sistemica" && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h3 className="text-xl font-serif text-[#1A3C4D] mb-1">
                Origem Psicológica, Sistêmica e Feridas Primordiais
              </h3>
              <p className="text-xs sm:text-sm text-[#1A3C4D]/70 font-light">
                Compreensão profunda sob a perspectiva das Constelações Familiares de Bert Hellinger e Sandra Maitri:
              </p>
            </div>

            {/* O Lugar Sistêmico */}
            <div className="p-6 rounded-2xl bg-[#F8F4ED] border border-[#E8DEC8] space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#B8965A]">
                O Lugar Sistêmico no Clan Familiar
              </span>
              <h4 className="text-lg font-serif text-[#1A3C4D]">
                {relatorio.lugarSistemicoTitulo}
              </h4>
              <p className="text-xs sm:text-sm text-[#1A3C4D]/85 font-light leading-relaxed">
                {relatorio.lugarSistemicoDescricao}
              </p>
              <p className="text-xs sm:text-sm text-[#1A3C4D]/70 font-light italic">
                {relatorio.lugarSistemicoImpacto}
              </p>
            </div>

            {/* Cenário de Infância e Perda da Ideia Sagrada */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-[#FDFBF7] border border-[#E8DEC8]">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-800 mb-2.5">
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                  <span>O Cenário de Infância e a Máscara</span>
                </div>
                <p className="text-xs sm:text-sm text-[#1A3C4D]/85 font-light leading-relaxed">
                  {relatorio.cenarioInfancia}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#FDFBF7] border border-[#E8DEC8]">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-800 mb-2.5">
                  <BookOpen className="w-4 h-4 text-purple-600" />
                  <span>A Perda da Ideia Sagrada (Sandra Maitri)</span>
                </div>
                <p className="text-xs sm:text-sm text-[#1A3C4D]/85 font-light leading-relaxed">
                  {relatorio.perdaIdeiaSagrada}
                </p>
              </div>
            </div>

            {/* O Resgate da Criança Anímica e Pontos de Integração */}
            <div className="p-6 rounded-2xl bg-[#FDFBF7] border border-[#E8DEC8] space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#7D8C6E]">
                Caminho de Cura: O Resgate da Criança Anímica
              </span>
              <p className="text-xs sm:text-sm text-[#1A3C4D]/85 font-light leading-relaxed">
                {relatorio.resgateCriancaPontos}
              </p>

              {/* Símbolo da Criança Divina (Naranjo) */}
              <div className="p-4 rounded-xl bg-white border border-[#E8DEC8]/80 text-xs sm:text-sm italic text-[#1A3C4D]/80">
                <strong>Símbolo da Criança Divina (Claudio Naranjo):</strong> &ldquo;{relatorio.simboloCriancaDivina}&rdquo;
              </div>
            </div>
          </div>
        )}

        {/* CONTEÚDO DA ABA 3: O LADO LUZ & SUPERPODERES */}
        {tabAtiva === "ladoluz" && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h3 className="text-xl font-serif text-[#1A3C4D] mb-1">
                Usando Suas Características a Seu Favor: O Lado Luz do Eneatipo
              </h3>
              <p className="text-xs sm:text-sm text-[#1A3C4D]/70 font-light">
                O objetivo não é destruir o ego, mas passar do automatismo inconsciente para a expressão luminosa dos seus dons essenciais.
              </p>
            </div>

            {/* Os 4 Superpoderes do Perfil Consciente */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatorio.superpoderes.map((superpoder, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/70 via-white to-emerald-50/30 border border-emerald-200/80 flex items-start gap-3 shadow-xs"
                >
                  <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0 mt-0.5">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-emerald-950">
                      {superpoder}
                    </h5>
                    <p className="text-xs text-emerald-900/70 mt-0.5 font-light">
                      Potencial elevado quando você atua a partir da presença e da essência.
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quadro Comparativo: Modo Reativo (Ego) vs Modo Consciente (Essência) */}
            <div className="border border-[#E8DEC8] rounded-2xl overflow-hidden">
              <div className="bg-[#1A3C4D] text-white p-4">
                <h4 className="text-sm font-semibold tracking-wide">
                  Quadro Comparativo: Modo Reativo (Ego) vs. Modo Consciente (Essência)
                </h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#F8F4ED] text-[#1A3C4D] border-b border-[#E8DEC8]">
                    <tr>
                      <th className="p-3 sm:p-4 font-semibold w-1/4">Dimensão</th>
                      <th className="p-3 sm:p-4 font-semibold text-rose-900 bg-rose-50/50 w-3/8">
                        Modo Reativo (Ego / Compulsão)
                      </th>
                      <th className="p-3 sm:p-4 font-semibold text-emerald-900 bg-emerald-50/50 w-3/8">
                        Modo Consciente (Essência / Presença)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8DEC8]">
                    {relatorio.quadroComparativo.map((linha, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-[#FDFBF7]"}>
                        <td className="p-3 sm:p-4 font-medium text-[#1A3C4D]">{linha.dimensao}</td>
                        <td className="p-3 sm:p-4 text-rose-950 font-light bg-rose-50/20">{linha.modoReativo}</td>
                        <td className="p-3 sm:p-4 text-emerald-950 font-medium bg-emerald-50/20">{linha.modoConsciente}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* CONTEÚDO DA ABA 4: PLANO TERAPÊUTICO & PRESENÇA */}
        {tabAtiva === "terapias" && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h3 className="text-xl font-serif text-[#1A3C4D] mb-1">
                Plano de Desenvolvimento Pessoal & Terapias Integrativas
              </h3>
              <p className="text-xs sm:text-sm text-[#1A3C4D]/70 font-light">
                Orientações práticas de mestres da psicologia e ferramentas de suporte vibracional:
              </p>
            </div>

            {/* Orientação dos Mestres do Eneagrama */}
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#B8965A] block">
                1. Orientação dos Mestres
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="p-5 rounded-2xl bg-[#FDFBF7] border border-[#E8DEC8] space-y-2">
                  <h5 className="text-xs font-bold text-[#1A3C4D] uppercase tracking-wider">
                    John Bradshaw
                  </h5>
                  <p className="text-xs sm:text-sm text-[#1A3C4D]/80 font-light leading-relaxed">
                    {relatorio.mestres.bradshaw}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#FDFBF7] border border-[#E8DEC8] space-y-2">
                  <h5 className="text-xs font-bold text-[#1A3C4D] uppercase tracking-wider">
                    Helen Palmer
                  </h5>
                  <p className="text-xs sm:text-sm text-[#1A3C4D]/80 font-light leading-relaxed">
                    {relatorio.mestres.palmer}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#FDFBF7] border border-[#E8DEC8] space-y-2">
                  <h5 className="text-xs font-bold text-[#1A3C4D] uppercase tracking-wider">
                    Claudio Naranjo
                  </h5>
                  <p className="text-xs sm:text-sm text-[#1A3C4D]/80 font-light leading-relaxed">
                    {relatorio.mestres.naranjo}
                  </p>
                </div>
              </div>
            </div>

            {/* Terapias Integrativas: Floral e Aromaterapia */}
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#7D8C6E] block">
                2. Guia de Conexão: Terapias Integrativas
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900">
                    <Flower2 className="w-4 h-4 text-amber-600" />
                    <span>Floral de Bach Recomendado</span>
                  </div>
                  <h5 className="text-sm font-semibold text-[#1A3C4D]">
                    {relatorio.floralBachRecomendado}
                  </h5>
                  <p className="text-xs text-[#1A3C4D]/80 font-light leading-relaxed">
                    <strong>Como atua:</strong> {relatorio.floralBachComoAtua}
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-900">
                    <Wind className="w-4 h-4 text-emerald-600" />
                    <span>Aromaterapia (Óleo Essencial)</span>
                  </div>
                  <h5 className="text-sm font-semibold text-[#1A3C4D]">
                    {relatorio.oleoEssencialRecomendado}
                  </h5>
                  <p className="text-xs text-[#1A3C4D]/80 font-light leading-relaxed">
                    <strong>Protocolo de Uso:</strong> {relatorio.oleoEssencialProtocolo}
                  </p>
                </div>
              </div>
            </div>

            {/* Mensagem Terapêutica Final & Afirmação Kalapa */}
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-emerald-50 via-[#F8F4ED] to-emerald-50 border border-emerald-200/80 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
                3. Mensagem Terapêutica Final
              </span>
              <p className="text-sm sm:text-base text-[#1A3C4D] font-light leading-relaxed">
                {relatorio.mensagemTerapeuticaFinal}
              </p>
              <div className="p-4 rounded-xl bg-white border border-emerald-300 text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block mb-1">
                  Afirmação Kalapa de Presença
                </span>
                <p className="text-base sm:text-lg font-serif italic text-emerald-950 font-medium">
                  &ldquo;{relatorio.afirmacaoKalapa}&rdquo;
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mapa Geral de Pontuação (Todos os 9 Tipos) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg shadow-[#E8DEC8]/15 border border-[#E8DEC8]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-lg font-serif font-medium text-[#1A3C4D]">
              Mapa Completo de Pontuação (Os 9 Eneatipos)
            </h3>
            <p className="text-xs text-[#1A3C4D]/65 font-light">
              Distribuição percentual da sua autoavaliação nos 9 padrões do Eneagrama:
            </p>
          </div>
          <span className="text-xs text-[#1A3C4D]/50 font-light self-start sm:self-auto">
            Dominante: <strong>Tipo {tipoDominante.numero}</strong>
          </span>
        </div>

        <div className="space-y-3.5">
          {ranking.map((item) => {
            const isDominante = item.tipo.numero === tipoDominante.numero;
            return (
              <div key={item.tipo.numero} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#1A3C4D] flex items-center gap-1.5">
                    {isDominante && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#7D8C6E]" />
                    )}
                    Tipo {item.tipo.numero} – {item.tipo.subtitulo}
                  </span>
                  <span className="font-semibold text-[#1A3C4D]/80">
                    {item.pontos} / 25 pts ({item.porcentagem}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-[#F8F4ED] rounded-full overflow-hidden border border-[#E8DEC8]/60">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isDominante
                        ? "bg-[#7D8C6E]"
                        : "bg-[#B8965A]/45"
                    }`}
                    style={{ width: `${item.porcentagem}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Botões de Ações e Próximos Passos */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <button
          type="button"
          onClick={onReiniciar}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-[#E8DEC8] bg-white hover:bg-[#F8F4ED] text-[#1A3C4D] text-xs sm:text-sm font-medium transition-all shadow-xs cursor-pointer w-full sm:w-auto justify-center"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Refazer a Avaliação</span>
        </button>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-center sm:justify-end">
          <button
            type="button"
            onClick={onAbrirRelatorio}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-[#7D8C6E] text-[#7D8C6E] hover:bg-[#7D8C6E]/10 text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer w-full sm:w-auto justify-center"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / Salvar Laudo Completo (A4)</span>
          </button>

          <TestShareMenu
            variant="button"
            direction="up"
            titulo="Eneagrama"
            path="/teste-eneagrama"
            convite="Descubra seu Eneatipo com o teste de personalidade do Eneagrama do INstituto Kalapa:"
          />

          <Link
            href="/servicos"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#7D8C6E] hover:bg-[#6C7B5D] text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-[#7D8C6E]/20 cursor-pointer w-full sm:w-auto justify-center"
          >
            <span>Conhecer Terapias Kalapa</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
