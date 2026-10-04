import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Printer,
  Calendar,
  Flame,
  Droplets,
  Scale,
  Moon,
  AlertTriangle,
  Utensils,
  Coffee,
  Wind,
  HeartHandshake,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";
import { ResultadoInfo } from "../data/yin-yang-data";

interface ResultViewProps {
  pontosYang: number;
  pontosYin: number;
  handleReiniciarTeste: () => void;
  resultadoAtual: ResultadoInfo;
  tipoResultado: "yang" | "yin";
  usuario: { id: string; nome: string; email?: string } | null;
  setModalRelatorioAberto: (isOpen: boolean) => void;
}

export default function ResultView({
  pontosYang,
  pontosYin,
  handleReiniciarTeste,
  resultadoAtual,
  tipoResultado,
  usuario,
  setModalRelatorioAberto,
}: ResultViewProps) {
  const [respiracaoAtiva, setRespiracaoAtiva] = useState(false);
  const [faseRespiracao, setFaseRespiracao] = useState<"inspira" | "retem" | "expira">("inspira");
  const [tempoFase, setTempoFase] = useState(4);

  useEffect(() => {
    if (!respiracaoAtiva) return;

    const ciclo = resultadoAtual.respiracao.ciclo;
    const duracaoInspira = ciclo.inspira;
    const duracaoRetem = ciclo.retem || 0;
    const duracaoExpira = ciclo.expira;

    let timeoutId: NodeJS.Timeout;

    if (faseRespiracao === "inspira") {
      timeoutId = setTimeout(() => {
        if (duracaoRetem > 0) {
          setFaseRespiracao("retem");
          setTempoFase(duracaoRetem);
        } else {
          setFaseRespiracao("expira");
          setTempoFase(duracaoExpira);
        }
      }, duracaoInspira * 1000);
    } else if (faseRespiracao === "retem") {
      timeoutId = setTimeout(() => {
        setFaseRespiracao("expira");
        setTempoFase(duracaoExpira);
      }, duracaoRetem * 1000);
    } else if (faseRespiracao === "expira") {
      timeoutId = setTimeout(() => {
        setFaseRespiracao("inspira");
        setTempoFase(duracaoInspira);
      }, duracaoExpira * 1000);
    }

    return () => clearTimeout(timeoutId);
  }, [respiracaoAtiva, faseRespiracao, resultadoAtual]);

  const toggleRespiracao = () => {
    if (respiracaoAtiva) {
      setRespiracaoAtiva(false);
    } else {
      setFaseRespiracao("inspira");
      setTempoFase(resultadoAtual.respiracao.ciclo.inspira);
      setRespiracaoAtiva(true);
    }
  };

  return (
    <>
          <div className="space-y-8">
            {/* Banner do Resultado com Destaque e Imagem IA */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E8DEC8]">
              <div className="grid grid-cols-1 md:grid-cols-12">
                <div className="relative h-60 md:h-auto md:col-span-5 bg-[#1A3C4D]">
                  <Image
                    src={resultadoAtual.imagem}
                    alt={resultadoAtual.titulo}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/70 via-black/20 to-transparent flex items-end md:items-center p-6">
                    <div className="text-white">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-white/20 backdrop-blur-md border border-white/30 mb-2">
                        {tipoResultado === "yang" ? (
                          <>
                            <Flame className="w-3.5 h-3.5 text-orange-300" /> Yang Predominante
                          </>
                        ) : tipoResultado === "yin" ? (
                          <>
                            <Droplets className="w-3.5 h-3.5 text-emerald-300" /> Yin Predominante
                          </>
                        ) : (
                          <>
                            <Scale className="w-3.5 h-3.5 text-yellow-300" /> Equilíbrio Dinâmico
                          </>
                        )}
                      </span>
                      <p className="text-xs text-white/80">Avaliação Terapêutica Personalizada</p>
                      <p className="text-sm font-medium text-white">{usuario?.nome}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8 md:col-span-7 flex flex-col justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-wider font-semibold text-[#B8965A]">
                      Diagnóstico Clínico Kalapa
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-serif font-light text-[#1A3C4D] mt-1 mb-2">
                      {resultadoAtual.titulo}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#1A3C4D]/70 font-light mb-6">
                      {resultadoAtual.subtitulo}
                    </p>

                    {/* Placar Energético */}
                    <div className="bg-[#F8F4ED] rounded-xl p-4 border border-[#E8DEC8] mb-6">
                      <div className="flex items-center justify-between text-xs sm:text-sm font-medium mb-2">
                        <span className="flex items-center gap-1 text-orange-700">
                          <Flame className="w-4 h-4" /> Yang: {pontosYang} pts (
                          {Math.round((pontosYang / 15) * 100)}%)
                        </span>
                        <span className="flex items-center gap-1 text-emerald-700">
                          <Droplets className="w-4 h-4" /> Yin: {pontosYin} pts (
                          {Math.round((pontosYin / 15) * 100)}%)
                        </span>
                      </div>
                      <div className="w-full h-3 bg-[#E8DEC8] rounded-full overflow-hidden flex">
                        <div
                          className="bg-orange-500 h-full transition-all duration-500"
                          style={{ width: `${(pontosYang / 15) * 100}%` }}
                        />
                        <div
                          className="bg-emerald-600 h-full transition-all duration-500"
                          style={{ width: `${(pontosYin / 15) * 100}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-[#1A3C4D]/60 text-center mt-2 font-light">
                        {tipoResultado === "yang"
                          ? "Seu fogo metabólico está elevado. O organismo pede desaceleração, resfriamento consciente e hidratação profunda."
                          : tipoResultado === "yin"
                          ? "Sua circulação e calor vital pedem ativação. O organismo necessita de aquecimento, nutrição suave e movimento fluido."
                          : "Você apresenta um equilíbrio harmonioso entre a ação (Yang) e o repouso (Yin). Mantenha a vigilância dos ciclos das estações."}
                      </p>
                    </div>
                  </div>

                  {/* Ações Rápidas: PDF e Refazer */}
                  <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#E8DEC8]/60">
                    <button
                      type="button"
                      onClick={() => setModalRelatorioAberto(true)}
                      className="px-6 py-3 rounded-xl bg-[#1A3C4D] text-white text-xs sm:text-sm font-medium hover:bg-[#15313F] transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Visualizar & Imprimir Relatório em PDF</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleReiniciarTeste}
                      className="px-4 py-3 rounded-xl border border-[#E8DEC8] text-xs sm:text-sm font-medium text-[#1A3C4D]/80 hover:bg-[#F8F4ED] transition-colors flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Refazer Teste</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Compreensão do Estado Atual */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#E8DEC8]">
              <h3 className="text-xl sm:text-2xl font-serif font-light text-[#1A3C4D] mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#B8965A]" />
                Compreendendo o seu Padrão Energético
              </h3>
              <div className="space-y-3 text-sm sm:text-base text-[#1A3C4D]/80 font-light leading-relaxed">
                {resultadoAtual.compreensao.map((paragrafo, idx) => (
                  <p key={idx}>{paragrafo}</p>
                ))}
              </div>
            </div>

            {/* Como Afeta o Sono (Wei Qi) */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#E8DEC8]">
              <div className="flex items-center gap-2 mb-3">
                <Moon className="w-5 h-5 text-[#1A3C4D]" />
                <h3 className="text-xl sm:text-2xl font-serif font-light text-[#1A3C4D]">
                  Como este Padrão Afeta o seu Sono (Wei Qi)
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#1A3C4D]/75 font-light leading-relaxed mb-6 italic">
                {resultadoAtual.comoAfetaSono.resumo}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {resultadoAtual.comoAfetaSono.itens.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#F8F4ED] border border-[#E8DEC8] flex flex-col justify-between"
                  >
                    <h4 className="text-sm font-serif font-medium text-[#1A3C4D] mb-2">
                      {item.titulo}
                    </h4>
                    <p className="text-xs text-[#1A3C4D]/75 font-light leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Riscos a Longo Prazo se Não Cuidar */}
            <div className="bg-amber-50/50 rounded-2xl p-6 sm:p-8 shadow-sm border border-amber-200/80">
              <div className="flex items-center gap-2 mb-2 text-amber-800">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h3 className="text-lg sm:text-xl font-serif font-medium">
                  Sinais de Alerta: Riscos a Longo Prazo se Não Houver Cuidado
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#1A3C4D]/75 font-light leading-relaxed mb-4">
                {resultadoAtual.riscosSeNaoCuidar.resumo}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-[#1A3C4D]/85">
                {resultadoAtual.riscosSeNaoCuidar.itens.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dietoterapia e Fitoterapia (Lado a Lado) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Alimentação */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#E8DEC8]">
                <div className="flex items-center gap-2 mb-4">
                  <Utensils className="w-5 h-5 text-[#7D8C6E]" />
                  <h3 className="text-lg sm:text-xl font-serif font-light text-[#1A3C4D]">
                    Dietoterapia Terapêutica
                  </h3>
                </div>
                <div className="bg-[#F8F4ED] p-3.5 rounded-xl border border-[#E8DEC8] text-xs text-[#1A3C4D]/80 mb-4 font-light">
                  <strong>Diretriz de Preparo:</strong> {resultadoAtual.alimentacao.diretriz}
                </div>

                <div className="space-y-3 text-xs sm:text-sm">
                  <div>
                    <h4 className="font-medium text-[#7D8C6E] text-xs uppercase tracking-wider mb-1">
                      Alimentos Indicados:
                    </h4>
                    <ul className="space-y-1 text-[#1A3C4D]/80 font-light">
                      {resultadoAtual.alimentacao.indicados.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-[#7D8C6E]">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-[#B8965A] text-xs uppercase tracking-wider mb-1">
                      Temperos Terapêuticos:
                    </h4>
                    <p className="text-[#1A3C4D]/80 font-light text-xs sm:text-sm">
                      {resultadoAtual.alimentacao.temperos.join("; ")}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-rose-700 text-xs uppercase tracking-wider mb-1">
                      Evitar ou Reduzir:
                    </h4>
                    <ul className="space-y-1 text-[#1A3C4D]/80 font-light">
                      {resultadoAtual.alimentacao.evitar.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-rose-500">✕</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Chás e Infusões */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#E8DEC8]">
                <div className="flex items-center gap-2 mb-4">
                  <Coffee className="w-5 h-5 text-[#B8965A]" />
                  <h3 className="text-lg sm:text-xl font-serif font-light text-[#1A3C4D]">
                    Fitoterapia & Chás Medicinais
                  </h3>
                </div>
                <p className="text-xs text-[#1A3C4D]/70 font-light mb-4">
                  {resultadoAtual.chas.estrategia}
                </p>

                <div className="space-y-3">
                  {resultadoAtual.chas.lista.map((cha, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#F8F4ED] border border-[#E8DEC8] text-xs sm:text-sm"
                    >
                      <h4 className="font-serif font-medium text-[#1A3C4D] text-sm">
                        {cha.nome}
                      </h4>
                      <p className="text-xs text-[#1A3C4D]/75 font-light mt-0.5">
                        {cha.beneficio}
                      </p>
                      {cha.preparo && (
                        <p className="text-[11px] text-[#B8965A] font-medium mt-1">
                          Modo de Preparo: {cha.preparo}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Prática Respiratória Guiada Interativa */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#E8DEC8]">
              <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <Wind className="w-5 h-5 text-[#7D8C6E]" />
                    <h3 className="text-xl sm:text-2xl font-serif font-light text-[#1A3C4D]">
                      {resultadoAtual.respiracao.nome}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-[#1A3C4D]/70 font-light mt-0.5">
                    {resultadoAtual.respiracao.subtitulo}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={toggleRespiracao}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 transition-all cursor-pointer ${
                    respiracaoAtiva
                      ? "bg-rose-100 text-rose-800 border border-rose-200 hover:bg-rose-200"
                      : "bg-[#7D8C6E] text-white hover:bg-[#6C7A5E] shadow-sm"
                  }`}
                >
                  {respiracaoAtiva ? (
                    <>
                      <Pause className="w-4 h-4" /> Pausar Metrônomo

                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" /> Iniciar Metrônomo Respiratório
                    </>
                  )}
                </button>
              </div>

              {/* Widget Interativo da Respiração */}
              {respiracaoAtiva && (
                <div className="mb-8 p-8 rounded-2xl bg-gradient-to-b from-[#F8F4ED] to-white border border-[#E8DEC8] flex flex-col items-center justify-center text-center">
                  <div className="relative w-44 h-44 flex items-center justify-center mb-4">
                    <div
                      className={`w-36 h-36 rounded-full transition-all ease-in-out border-4 ${
                        faseRespiracao === "inspira"
                          ? "bg-emerald-500/20 border-emerald-500 scale-125 duration-[4000ms]"
                          : faseRespiracao === "retem"
                          ? "bg-amber-500/20 border-amber-500 scale-125 duration-[2000ms]"
                          : "bg-blue-500/20 border-blue-500 scale-75 duration-[8000ms]"
                      }`}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xs uppercase tracking-wider font-semibold text-[#1A3C4D]/60">
                        Fase
                      </span>
                      <span className="text-xl font-serif font-bold text-[#1A3C4D] capitalize">
                        {faseRespiracao === "inspira"
                          ? "Inspire Suave"
                          : faseRespiracao === "retem"
                          ? "Retenha o Ar"
                          : "Expire Lento"}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-[#1A3C4D]/70 font-light max-w-sm">
                    {faseRespiracao === "inspira"
                      ? "Puxe o ar pelo nariz inflando o baixo ventre..."
                      : faseRespiracao === "retem"
                      ? "Mantenha o ar no baixo ventre com serenidade..."
                      : "Solte o ar suavemente pela boca ou nariz, ancorando os pensamentos..."}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-[#1A3C4D]/80 font-light">
                {resultadoAtual.respiracao.instrucoes.map((inst, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#FDFBF7] border border-[#E8DEC8]/80 flex items-start gap-2.5"
                  >
                    <span className="w-5 h-5 rounded-full bg-[#7D8C6E]/20 text-[#7D8C6E] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{inst}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hábitos de Estilo de Vida */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#E8DEC8]">
              <div className="flex items-center gap-2 mb-4">
                <HeartHandshake className="w-5 h-5 text-[#B8965A]" />
                <h3 className="text-lg sm:text-xl font-serif font-light text-[#1A3C4D]">
                  Pilares de Estilo de Vida & Harmonia
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-[#1A3C4D]/85 font-light">
                {resultadoAtual.habitos.map((habito, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#F8F4ED] border border-[#E8DEC8]/80 flex items-start gap-2"
                  >
                    <span className="text-[#B8965A] font-bold">•</span>
                    <span>{habito}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Próximos Passos & CTA Terapêutico */}
            <div className="bg-gradient-to-br from-[#1A3C4D] to-[#122A36] text-white rounded-2xl p-6 sm:p-10 shadow-lg text-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#B8965A]/20 text-[#B8965A] border border-[#B8965A]/30 mb-4">
                <Sparkles className="w-3.5 h-3.5" /> Aprofunde sua Jornada
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-light mb-3">
                Quer apoio personalizado para reequilibrar sua energia?
              </h3>
              <p className="max-w-2xl mx-auto text-xs sm:text-sm text-white/80 font-light leading-relaxed mb-6">
                No INstituto Kalapa, realizamos atendimentos individuais e vivências terapêuticas em
                grupo às quintas-feiras às 19:30, combinando Medicina Chinesa, Constelação Familiar e
                Práticas de Presença.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setModalRelatorioAberto(true)}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white text-[#1A3C4D] text-xs sm:text-sm font-medium hover:bg-neutral-100 transition-all shadow flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-[#1A3C4D]" />
                  <span>Baixar / Imprimir Relatório em PDF</span>
                </button>
                <Link
                  href="/terapias"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#B8965A] text-white text-xs sm:text-sm font-medium hover:bg-[#A3834C] transition-all shadow flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Conhecer Terapias & Encontros</span>
                </Link>
              </div>
            </div>
          </div>
    </>
  );
}
