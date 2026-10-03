import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Printer,
  RotateCcw,
  Heart,
  Shield,
  HelpCircle,
  Compass,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { EneagramaTipo } from "../data/eneagrama-data";
import { ResultadoEneagramaCalculado } from "../lib/calculo-eneagrama";

interface EneagramaResultViewProps {
  resultado: ResultadoEneagramaCalculado;
  onReiniciar: () => void;
  onAbrirRelatorio: () => void;
  usuario: { id: string; nome: string; email?: string } | null;
}

export default function EneagramaResultView({
  resultado,
  onReiniciar,
  onAbrirRelatorio,
  usuario,
}: EneagramaResultViewProps) {
  const [tipoSelecionado, setTipoSelecionado] = useState<EneagramaTipo>(
    resultado.tipoDominante
  );

  const { isEmpate, empates, ranking, pontuacaoMaxima } = resultado;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-10">
      {/* Topo do Resultado */}
      <div className="text-center relative">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#7D8C6E]/15 text-[#7D8C6E] text-xs sm:text-sm font-semibold tracking-wide mb-4 border border-[#7D8C6E]/30">
          <Sparkles className="w-4 h-4" />
          <span>Diagnóstico Concluído • Mapeamento do Eneagrama</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-[#1A3C4D] tracking-tight mb-4">
          {usuario?.nome ? `Olá, ${usuario.nome}. ` : ""}
          Seu Tipo Dominante é o{" "}
          <span className="italic font-normal text-[#7D8C6E]">
            Tipo {tipoSelecionado.numero}
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#1A3C4D]/80 leading-relaxed font-light">
          Identificamos sua essência a partir dos padrões consolidados na juventude.
          Abaixo você encontra a análise aprofundada de suas feridas, medos inconscientes e caminhos de integração.
        </p>
      </div>

      {/* Alerta de Empate (se houver) */}
      {isEmpate && (
        <div className="bg-amber-50 rounded-2xl p-5 sm:p-6 border border-amber-200 text-amber-900 shadow-xs">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-base font-semibold mb-1">
                Empate Técnico Identificado ({pontuacaoMaxima} pontos)
              </h3>
              <p className="text-xs sm:text-sm text-amber-800/90 font-light leading-relaxed mb-4">
                Houve uma pontuação exatamente igual entre mais de um tipo do Eneagrama.
                Recomendamos a leitura dos perfis empatados abaixo para que você identifique qual ferida e medo ressoam mais profundamente com a sua história de vida:
              </p>

              {/* Botões para alternar entre os tipos empatados */}
              <div className="flex flex-wrap gap-2">
                {empates.map((t) => {
                  const ativo = tipoSelecionado.numero === t.numero;
                  return (
                    <button
                      key={t.numero}
                      type="button"
                      onClick={() => setTipoSelecionado(t)}
                      className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                        ativo
                          ? "bg-amber-700 text-white shadow-sm"
                          : "bg-white text-amber-900 border border-amber-300 hover:bg-amber-100"
                      }`}
                    >
                      Tipo {t.numero} ({t.subtitulo})
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Card Principal do Tipo Selecionado */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-[#E8DEC8]/20 border border-[#E8DEC8] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#7D8C6E]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

        <div className="relative space-y-8">
          {/* Header do Tipo */}
          <div className="border-b border-[#E8DEC8]/60 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border mb-3 ${tipoSelecionado.corBadge}`}
              >
                <Compass className="w-3.5 h-3.5" />
                Tipo {tipoSelecionado.numero} • {tipoSelecionado.subtitulo}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#1A3C4D]">
                {tipoSelecionado.nome}
              </h2>
              <p className="text-xs sm:text-sm text-[#1A3C4D]/60 mt-1 font-light italic">
                {tipoSelecionado.arquetipo}
              </p>
            </div>

            <div className="sm:text-right shrink-0">
              <span className="text-xs text-[#1A3C4D]/60 uppercase tracking-wider block">
                Pontuação Total
              </span>
              <span className="text-3xl sm:text-4xl font-serif font-light text-[#7D8C6E]">
                {resultado.pontuacoesPorLetra[tipoSelecionado.letra] || 0}
                <span className="text-sm text-[#1A3C4D]/50 font-sans"> / 25 pts</span>
              </span>
            </div>
          </div>

          {/* Grid de Seções do Relatório Formatado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Principais Feridas Emocionais */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#FDFBF7] border border-[#E8DEC8]">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-800 mb-2.5">
                <Heart className="w-4 h-4 text-rose-600" />
                <span>Principais Feridas Emocionais</span>
              </div>
              <p className="text-xs sm:text-sm text-[#1A3C4D]/85 font-light leading-relaxed">
                {tipoSelecionado.feridasEmocionais}
              </p>
            </div>

            {/* Mensagens Inconscientes da Infância */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#FDFBF7] border border-[#E8DEC8]">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-800 mb-2.5">
                <HelpCircle className="w-4 h-4 text-amber-600" />
                <span>Mensagens Inconscientes da Infância</span>
              </div>
              <p className="text-xs sm:text-sm text-[#1A3C4D]/85 font-light leading-relaxed italic">
                {tipoSelecionado.mensagensInconscientes}
              </p>
            </div>

            {/* Medos Fundamentais */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#FDFBF7] border border-[#E8DEC8]">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-800 mb-2.5">
                <Shield className="w-4 h-4 text-purple-600" />
                <span>Medos Fundamentais</span>
              </div>
              <p className="text-xs sm:text-sm text-[#1A3C4D]/85 font-light leading-relaxed">
                {tipoSelecionado.medosFundamentais}
              </p>
            </div>

            {/* Desejos Fundamentais */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#FDFBF7] border border-[#E8DEC8]">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-800 mb-2.5">
                <Compass className="w-4 h-4 text-blue-600" />
                <span>Desejos Fundamentais</span>
              </div>
              <p className="text-xs sm:text-sm text-[#1A3C4D]/85 font-light leading-relaxed">
                {tipoSelecionado.desejosFundamentais}
              </p>
            </div>
          </div>

          {/* Distorções / Mensagens Perdidas da Infância (Destaque Largo) */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-emerald-50 via-[#F8F4ED] to-emerald-50 border border-emerald-200/80">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block mb-2">
              Distorções / Mensagens Perdidas da Infância
            </span>
            <p className="text-base sm:text-lg font-serif italic text-[#1A3C4D] leading-relaxed">
              {tipoSelecionado.distorcoes}
            </p>
            <p className="text-xs text-[#1A3C4D]/60 mt-3 font-light">
              Esta é a verdade essencial que sua criança interior precisava ouvir para relaxar os mecanismos de defesa.
            </p>
          </div>
        </div>
      </div>

      {/* Gráfico da Distribuição dos 9 Tipos */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg shadow-[#E8DEC8]/15 border border-[#E8DEC8]">
        <h3 className="text-lg font-serif font-medium text-[#1A3C4D] mb-1">
          Mapa Completo de Pontuação (Os 9 Tipos)
        </h3>
        <p className="text-xs text-[#1A3C4D]/65 font-light mb-6">
          Nenhum ser humano é uma ilha; você possui traços de vários tipos. Veja como sua pontuação se distribuiu:
        </p>

        <div className="space-y-3.5">
          {ranking.map((item) => {
            const isDominante = item.tipo.numero === tipoSelecionado.numero;
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
                <div className="w-full h-2 bg-[#F8F4ED] rounded-full overflow-hidden border border-[#E8DEC8]/60">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isDominante
                        ? "bg-[#7D8C6E]"
                        : "bg-[#B8965A]/50"
                    }`}
                    style={{ width: `${item.porcentagem}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ações e Próximos Passos */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <button
          type="button"
          onClick={onReiniciar}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-[#E8DEC8] bg-white hover:bg-[#F8F4ED] text-[#1A3C4D] text-xs sm:text-sm font-medium transition-all shadow-xs cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Refazer o Teste</span>
        </button>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onAbrirRelatorio}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-[#7D8C6E] text-[#7D8C6E] hover:bg-[#7D8C6E]/10 text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / Salvar Laudo em PDF</span>
          </button>

          <Link
            href="/produtos?categoria=vivencias"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1A3C4D] hover:bg-[#15313F] text-white text-xs sm:text-sm font-semibold transition-all shadow-md cursor-pointer"
          >
            <span>Vivências Presenciais</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
