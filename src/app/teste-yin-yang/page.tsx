"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Printer,
  CheckCircle2,
  Lock,
  UserCheck,
  ShieldCheck,
  Flame,
  Droplets,
  Scale,
  Moon,
  AlertTriangle,
  Utensils,
  Coffee,
  Wind,
  HeartHandshake,
  Calendar,
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import {
  YIN_YANG_PERGUNTAS,
  RESULTADOS_MAP,
  ResultadoInfo,
  YinYangQuestion,
} from "./data/yin-yang-data";
import TestReportModal from "./components/TestReportModal";
import Footer from "../components/Footer";

export default function TesteYinYangPage() {
  // Estado de autenticação do usuário
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [usuario, setUsuario] = useState<{ id: string; nome: string; email?: string } | null>(null);

  // Estado do teste
  const [etapa, setEtapa] = useState<"intro" | "teste" | "resultado">("intro");
  const [perguntaAtualIndex, setPerguntaAtualIndex] = useState(0);
  const [respostas, setRespostas] = useState<Record<number, "yang" | "yin">>({});

  // Modal do relatório PDF
  const [modalRelatorioAberto, setModalRelatorioAberto] = useState(false);

  // Modal de aviso de empate no teste
  const [modalEmpateAberto, setModalEmpateAberto] = useState(false);

  // Exercício respiratório interativo
  const [respiracaoAtiva, setRespiracaoAtiva] = useState(false);
  const [faseRespiracao, setFaseRespiracao] = useState<"inspira" | "retem" | "expira">("inspira");
  const [tempoFase, setTempoFase] = useState(4);

  // Consulta autenticação
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        const data = await res.json();
        if (data?.authenticated && data.usuario) {
          setUsuario(data.usuario);
        } else {
          setUsuario(null);
        }
      } catch (err) {
        console.error("Erro ao verificar autenticação:", err);
        setUsuario(null);
      } finally {
        setLoadingAuth(false);
      }
    }
    checkAuth();
  }, []);

  // Cálculos de pontuação
  const totalRespondidas = Object.keys(respostas).length;
  const pontosYang = Object.values(respostas).filter((r) => r === "yang").length;
  const pontosYin = Object.values(respostas).filter((r) => r === "yin").length;

  // O diagnóstico final é estritamente Yang ou Yin (empates são bloqueados com obrigatoriedade de refazer o teste)
  let tipoResultado: "yang" | "yin" = "yang";
  if (pontosYang > pontosYin) {
    tipoResultado = "yang";
  } else if (pontosYin > pontosYang) {
    tipoResultado = "yin";
  }

  const resultadoAtual: ResultadoInfo = RESULTADOS_MAP[tipoResultado];

  // Caso esteja em resultado mas haja empate, redireciona para o teste e abre o aviso
  useEffect(() => {
    if (etapa === "resultado" && totalRespondidas > 0 && pontosYang === pontosYin) {
      setEtapa("teste");
      setModalEmpateAberto(true);
    }
  }, [etapa, totalRespondidas, pontosYang, pontosYin]);

  // Resposta selecionada na pergunta atual
  const perguntaAtual: YinYangQuestion = YIN_YANG_PERGUNTAS[perguntaAtualIndex];
  const respostaAtual = respostas[perguntaAtual?.id];

  const handleSelecionarResposta = (opcao: "yang" | "yin") => {
    setRespostas((prev) => ({
      ...prev,
      [perguntaAtual.id]: opcao,
    }));

    // Avança suavemente se não for a última pergunta
    if (perguntaAtualIndex < YIN_YANG_PERGUNTAS.length - 1) {
      setTimeout(() => {
        setPerguntaAtualIndex((prev) => prev + 1);
      }, 250);
    }
  };

  const handleConcluirTeste = () => {
    // Validação estrita: Não é permitido empate no resultado
    if (pontosYang === pontosYin) {
      setModalEmpateAberto(true);
      return;
    }

    // Persiste a avaliação no banco de dados e captura o lead para o admin
    if (usuario) {
      try {
        fetch("/api/teste-yin-yang", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            usuario_id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            tipo_resultado: tipoResultado,
            pontos_yang: pontosYang,
            pontos_yin: pontosYin,
            respostas,
          }),
        }).catch((err) => console.warn("Falha assíncrona ao registrar avaliação:", err));
      } catch (err) {
        console.warn("Erro ao despachar avaliação:", err);
      }
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
    setEtapa("resultado");
  };

  const handleRefazerPorEmpate = () => {
    setModalEmpateAberto(false);
    setRespostas({});
    setPerguntaAtualIndex(0);
    setEtapa("teste");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReiniciarTeste = () => {
    if (window.confirm("Deseja realmente recomeçar o teste? Suas respostas serão apagadas.")) {
      setRespostas({});
      setPerguntaAtualIndex(0);
      setEtapa("teste");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Temporizador para animação da respiração
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
    <main className="min-h-screen bg-[#FDFBF7] text-[#1A3C4D] flex flex-col justify-between pt-24 sm:pt-28">
      {/* Top Banner Hero */}
      <section className="relative w-full border-b border-[#E8DEC8]/60 bg-gradient-to-b from-[#F7F3E9] to-[#FDFBF7] py-10 sm:py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <Image
            src="/images/yin-yang/banner.jpg"
            alt="MTC Yin Yang Harmonia"
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#B8965A]/15 text-[#B8965A] text-xs sm:text-sm font-medium tracking-wide mb-4 backdrop-blur-sm border border-[#B8965A]/25">
            <Sparkles className="w-4 h-4 text-[#B8965A]" />
            <span>Medicina Tradicional Chinesa • Autoavaliação Energética</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-[#1A3C4D] tracking-tight mb-4 leading-tight">
            Yin ou Yang?{" "}
            <span className="italic font-normal text-[#B8965A]">
              Descubra sua tendência energética atual
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#1A3C4D]/80 leading-relaxed font-light">
            Baseado no clássico Cânone do Imperador Amarelo (<em>Huangdi Neijing</em>), este teste
            analisa 15 dimensões fisiológicas e comportamentais para revelar seu estado energético e
            oferecer práticas milenares de equilíbrio.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-6 text-xs text-[#1A3C4D]/70">
            <span className="flex items-center gap-1.5 bg-white/70 px-3 py-1 rounded-full shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#7D8C6E]" /> 15 perguntas práticas
            </span>
            <span className="flex items-center gap-1.5 bg-white/70 px-3 py-1 rounded-full shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#7D8C6E]" /> Relatório Clínico em PDF
            </span>
            <span className="flex items-center gap-1.5 bg-white/70 px-3 py-1 rounded-full shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#7D8C6E]" /> Dietoterapia & Fitoterapia
            </span>
            <span className="flex items-center gap-1.5 bg-white/70 px-3 py-1 rounded-full shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#7D8C6E]" /> Guia Respiratório Ativo
            </span>
          </div>
        </div>
      </section>

      {/* Conteúdo Principal com base no estado de Autenticação */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full flex-1">
        {loadingAuth ? (
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-3 border-[#B8965A] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm font-light text-[#1A3C4D]/70">Carregando avaliação energética...</p>
          </div>
        ) : !usuario ? (
          /* ============================================================== */
          /* CARD DE LOGIN / CADASTRO OBRIGATÓRIO                           */
          /* ============================================================== */
          <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-[#E8DEC8] text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#B8965A]/10 text-[#B8965A] flex items-center justify-center mx-auto mb-6 border border-[#B8965A]/30">
              <Lock className="w-8 h-8" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-light text-[#1A3C4D] mb-3">
              Identifique-se para Realizar o Teste
            </h2>

            <p className="text-sm sm:text-base text-[#1A3C4D]/75 font-light leading-relaxed mb-6">
              Para calcular suas tendências energéticas com precisão e gerar seu{" "}
              <strong>Relatório Clínico em PDF personalizado com seu nome</strong>, é necessário estar
              conectado ao sistema do INstituto Kalapa.
            </p>

            <div className="bg-[#F8F4ED] rounded-xl p-5 mb-8 text-left border border-[#E8DEC8]/80">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-[#1A3C4D]/60 mb-3">
                O que você terá acesso após o teste:
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-[#1A3C4D]/85">
                <li className="flex items-start gap-2">
                  <span className="text-[#B8965A] font-bold">•</span>
                  <span><strong>Diagnóstico completo:</strong> Se sua constituição atual é Fogo (Yang), Frio (Yin) ou Equilíbrio Dinâmico.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#B8965A] font-bold">•</span>
                  <span><strong>Impacto no Sono (Wei Qi):</strong> Entenda a causa profunda de insônias, despertares ou cansaço matinal.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#B8965A] font-bold">•</span>
                  <span><strong>Dietoterapia & Culinária:</strong> Alimentos benéficos, métodos de preparo ideais e o que evitar.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#B8965A] font-bold">•</span>
                  <span><strong>Fitoterapia Tradicional:</strong> Receitas de infusões e chás para restabelecer a harmonia.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#B8965A] font-bold">•</span>
                  <span><strong>PDF com Formato A4:</strong> Baixe ou imprima com apenas um clique para levar ao seu terapeuta ou guardar.</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/login?redirect=/teste-yin-yang"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#1A3C4D] text-white text-sm font-medium hover:bg-[#15313F] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <span>Fazer Login</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/cadastro?redirect=/teste-yin-yang"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#B8965A] text-white text-sm font-medium hover:bg-[#A3834C] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <span>Criar Conta Gratuita</span>
                <UserCheck className="w-4 h-4" />
              </Link>
            </div>

            <p className="text-xs text-[#1A3C4D]/50 mt-5">
              Leva menos de 1 minuto para criar sua conta. Totalmente seguro e sem custos.
            </p>
          </div>
        ) : etapa === "intro" ? (
          /* ============================================================== */
          /* TELA INTRODUTÓRIA (USUÁRIO AUTENTICADO)                        */
          /* ============================================================== */
          <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-[#E8DEC8]">
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#E8DEC8]/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#7D8C6E]/15 text-[#7D8C6E] flex items-center justify-center font-medium">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-[#1A3C4D]/60 uppercase tracking-wider font-semibold">
                    Avaliação Conectada
                  </p>
                  <p className="text-sm sm:text-base font-serif font-medium text-[#1A3C4D]">
                    {usuario.nome}
                  </p>
                </div>
              </div>
              <span className="text-xs text-[#B8965A] font-medium bg-[#B8965A]/10 px-3 py-1 rounded-full border border-[#B8965A]/20">
                15 Questões
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-serif font-light text-[#1A3C4D] mb-4">
                  Como funciona a autoavaliação?
                </h2>
                <div className="space-y-3 text-sm text-[#1A3C4D]/80 font-light leading-relaxed">
                  <p>
                    O Yin e o Yang não são forças estáticas, mas ritmos vivos do nosso corpo. O{" "}
                    <strong>Yang</strong> representa o calor, a atividade motora, a transformação e a
                    mente diurna. O <strong>Yin</strong> representa o frescor, a substância corporal,
                    os fluidos e a capacidade de repousar e regenerar.
                  </p>
                  <p>
                    Em cada uma das 15 perguntas, compare as duas opções e selecione a que mais
                    corresponde ao seu estado predominante nos últimos meses. Não há resposta certa
                    ou errada: todas revelam a sabedoria do seu organismo.
                  </p>
                </div>
              </div>

              <div className="relative h-64 sm:h-72 rounded-xl overflow-hidden shadow-inner border border-[#E8DEC8]">
                <Image
                  src="/images/yin-yang/banner.jpg"
                  alt="Harmonia Yin Yang"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-5">
                  <p className="text-white text-xs sm:text-sm font-serif italic">
                    &ldquo;Quando o Yin e o Yang estão em harmonia, a mente é serena e a energia vital é abundante.&rdquo;
                    <span className="block text-[11px] not-italic text-white/80 font-sans mt-0.5">
                      — Huangdi Neijing (Cânone de Medicina Chinesa)
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#E8DEC8]/60">
              <div className="flex items-center gap-2 text-xs text-[#1A3C4D]/60">
                <ShieldCheck className="w-4 h-4 text-[#7D8C6E]" />
                <span>Seus dados são confidenciais e exclusivos para sua evolução terapêutica</span>
              </div>
              <button
                onClick={() => setEtapa("teste")}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#1A3C4D] text-white text-sm font-medium hover:bg-[#15313F] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Iniciar Avaliação Agora</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : etapa === "teste" ? (
          /* ============================================================== */
          /* QUESTIONÁRIO INTERATIVO (15 QUESTÕES)                          */
          /* ============================================================== */
          <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-[#E8DEC8]">
            {/* Barra de Progresso Superior */}
            <div className="mb-8">
              <div className="flex items-center justify-between text-xs sm:text-sm text-[#1A3C4D]/70 mb-2 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="text-[#B8965A] font-semibold">Questão {perguntaAtualIndex + 1}</span> de {YIN_YANG_PERGUNTAS.length}
                </span>
                <span>{Math.round((totalRespondidas / YIN_YANG_PERGUNTAS.length) * 100)}% respondido</span>
              </div>

              {/* Progress bar visual */}
              <div className="w-full h-2 bg-[#E8DEC8]/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#B8965A] to-[#7D8C6E] transition-all duration-300"
                  style={{
                    width: `${((perguntaAtualIndex + 1) / YIN_YANG_PERGUNTAS.length) * 100}%`,
                  }}
                />
              </div>

              {/* Mini Navegador de Questões */}
              <div className="flex flex-wrap gap-1.5 mt-3 justify-center">
                {YIN_YANG_PERGUNTAS.map((p, idx) => {
                  const respondida = respostas[p.id] !== undefined;
                  const isCurrent = idx === perguntaAtualIndex;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setPerguntaAtualIndex(idx)}
                      className={`w-7 h-7 rounded-lg text-xs font-medium transition-all ${
                        isCurrent
                          ? "bg-[#1A3C4D] text-white ring-2 ring-[#1A3C4D]/30"
                          : respondida
                          ? "bg-[#7D8C6E]/20 text-[#7D8C6E] hover:bg-[#7D8C6E]/30"
                          : "bg-[#F8F4ED] text-[#1A3C4D]/50 hover:bg-[#E8DEC8]/50"
                      }`}
                      title={`Ir para pergunta ${p.id}: ${p.categoria}`}
                    >
                      {p.id}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cabeçalho da Pergunta Atual */}
            <div className="text-center max-w-xl mx-auto mb-8">
              <div className="inline-flex items-center gap-2 text-2xl mb-2">
                <span>{perguntaAtual.icone}</span>
              </div>
              <p className="text-xs uppercase tracking-wider font-semibold text-[#B8965A] mb-1">
                Dimensão #{perguntaAtual.id}
              </p>
              <h2 className="text-2xl sm:text-3xl font-serif font-light text-[#1A3C4D]">
                {perguntaAtual.categoria}
              </h2>
              <p className="text-xs sm:text-sm text-[#1A3C4D]/60 mt-1">
                Qual destes dois padrões descreve melhor como seu corpo ou sua mente funcionam habitualmente?
              </p>
            </div>

            {/* As duas opções (Yang vs Yin) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
              {/* Opção Yang */}
              <button
                type="button"
                onClick={() => handleSelecionarResposta("yang")}
                className={`relative text-left p-6 sm:p-7 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  respostaAtual === "yang"
                    ? "border-[#B8965A] bg-[#B8965A]/5 shadow-md ring-2 ring-[#B8965A]/20"
                    : "border-[#E8DEC8] bg-[#FDFBF7] hover:border-[#B8965A]/60 hover:bg-white"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-orange-100 text-orange-800 border border-orange-200">
                      <Flame className="w-3.5 h-3.5 text-orange-600" /> Tendência Yang
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                        respostaAtual === "yang"
                          ? "border-[#B8965A] bg-[#B8965A] text-white"
                          : "border-[#E8DEC8]"
                      }`}
                    >
                      {respostaAtual === "yang" && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                  </div>
                  <h3 className="text-lg sm:text-xl font-serif font-medium text-[#1A3C4D] mb-2">
                    {perguntaAtual.ladoYang.titulo}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#1A3C4D]/75 font-light leading-relaxed">
                    {perguntaAtual.ladoYang.descricao}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E8DEC8]/50 flex items-center justify-between text-xs text-[#1A3C4D]/50">
                  <span>Natureza: Calor / Atividade</span>
                  <span className="font-semibold text-orange-700">+1 Yang</span>
                </div>
              </button>

              {/* Opção Yin */}
              <button
                type="button"
                onClick={() => handleSelecionarResposta("yin")}
                className={`relative text-left p-6 sm:p-7 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  respostaAtual === "yin"
                    ? "border-[#7D8C6E] bg-[#7D8C6E]/5 shadow-md ring-2 ring-[#7D8C6E]/20"
                    : "border-[#E8DEC8] bg-[#FDFBF7] hover:border-[#7D8C6E]/60 hover:bg-white"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <Droplets className="w-3.5 h-3.5 text-emerald-600" /> Tendência Yin
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                        respostaAtual === "yin"
                          ? "border-[#7D8C6E] bg-[#7D8C6E] text-white"
                          : "border-[#E8DEC8]"
                      }`}
                    >
                      {respostaAtual === "yin" && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                  </div>
                  <h3 className="text-lg sm:text-xl font-serif font-medium text-[#1A3C4D] mb-2">
                    {perguntaAtual.ladoYin.titulo}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#1A3C4D]/75 font-light leading-relaxed">
                    {perguntaAtual.ladoYin.descricao}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E8DEC8]/50 flex items-center justify-between text-xs text-[#1A3C4D]/50">
                  <span>Natureza: Frescor / Recolhimento</span>
                  <span className="font-semibold text-emerald-700">+1 Yin</span>
                </div>
              </button>
            </div>

            {/* Barra de Navegação Inferior */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#E8DEC8]/60">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPerguntaAtualIndex((prev) => Math.max(0, prev - 1))}
                  disabled={perguntaAtualIndex === 0}
                  className="px-4 py-2.5 rounded-xl border border-[#E8DEC8] text-xs sm:text-sm font-medium text-[#1A3C4D] hover:bg-[#F8F4ED] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" /> Anterior
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setPerguntaAtualIndex((prev) =>
                      Math.min(YIN_YANG_PERGUNTAS.length - 1, prev + 1)
                    )
                  }
                  disabled={perguntaAtualIndex === YIN_YANG_PERGUNTAS.length - 1}
                  className="px-4 py-2.5 rounded-xl border border-[#E8DEC8] text-xs sm:text-sm font-medium text-[#1A3C4D] hover:bg-[#F8F4ED] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  Próxima <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Botão de Conclusão */}
              {totalRespondidas === YIN_YANG_PERGUNTAS.length ? (
                <button
                  type="button"
                  onClick={handleConcluirTeste}
                  className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#7D8C6E] text-white text-sm font-medium hover:bg-[#6C7A5E] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer animate-pulse"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Ver Meu Diagnóstico Completo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="text-xs text-[#1A3C4D]/60 text-center sm:text-right">
                  Responda todas as 15 perguntas para desbloquear o relatório ({totalRespondidas}/15)
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ============================================================== */
          /* RESULTADO E DIAGNÓSTICO COMPLETO                               */
          /* ============================================================== */
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
        )}
      </section>

      {/* Modal do Relatório Formatado para Impressão / PDF */}
      <TestReportModal
        isOpen={modalRelatorioAberto}
        onClose={() => setModalRelatorioAberto(false)}
        usuarioNome={usuario?.nome || "Participante"}
        usuarioEmail={usuario?.email}
        pontosYang={pontosYang}
        pontosYin={pontosYin}
        respostas={respostas}
        resultado={resultadoAtual}
      />

      {/* Modal Acolhedor de Aviso de Empate */}
      {modalEmpateAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E8DEC8] text-center my-auto">
            <div className="w-16 h-16 rounded-full bg-[#B8965A]/15 text-[#B8965A] flex items-center justify-center mx-auto mb-5 border border-[#B8965A]/30 shadow-xs">
              <Scale className="w-8 h-8" />
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#B8965A]/15 text-[#B8965A] mb-3">
              <AlertTriangle className="w-3.5 h-3.5" /> Empate Energético Detectado
            </span>

            <h3 className="text-2xl sm:text-3xl font-serif font-light text-[#1A3C4D] mb-3">
              Equivalência Entre Yin e Yang
            </h3>

            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#F8F4ED] border border-[#E8DEC8] text-xs font-semibold text-[#1A3C4D]/80 mb-5">
              <span className="text-orange-700">🔥 Yang: {pontosYang}</span>
              <span className="text-[#B8965A]">•</span>
              <span className="text-emerald-700">🌊 Yin: {pontosYin}</span>
            </div>

            <p className="text-sm text-[#1A3C4D]/80 font-light leading-relaxed mb-4">
              Suas respostas resultaram em uma pontuação <strong>exatamente igual</strong> entre as
              energias Yang e Yin.
            </p>

            <p className="text-xs sm:text-sm text-[#1A3C4D]/75 font-light leading-relaxed mb-6 bg-[#FDFBF7] p-4 rounded-xl border border-[#E8DEC8]/80 text-left">
              Para determinarmos com precisão sua <strong>tendência clínica predominante</strong> e
              gerarmos seu laudo personalizado (com recomendações específicas de sono, dietoterapia e fitoterapia),
              <strong> não é permitido empate na avaliação</strong>.
            </p>

            <button
              type="button"
              onClick={handleRefazerPorEmpate}
              className="w-full py-3.5 px-6 rounded-xl bg-[#1A3C4D] hover:bg-[#15313F] text-white text-sm font-medium transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retomar Avaliação do Início</span>
            </button>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
