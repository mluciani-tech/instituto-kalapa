"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Compass,
  ArrowRight,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Clock,
  ArrowLeft,
  Lock,
  UserCheck,
  BookOpen,
} from "lucide-react";
import {
  AFIRMACOES_ENEAGRAMA,
  ESCALA_NOTAS,
  EneagramaStatement,
} from "./data/eneagrama-data";
import {
  calcularResultadoEneagrama,
  ResultadoEneagramaCalculado,
} from "./lib/calculo-eneagrama";
import EneagramaProgressIndicator from "./components/EneagramaProgressIndicator";
import EneagramaQuestionCard from "./components/EneagramaQuestionCard";
import EneagramaResultView from "./components/EneagramaResultView";
import EneagramaReportModal from "./components/EneagramaReportModal";
import Footer from "../components/Footer";
import TestShareMenu from "../components/TestShareMenu";

export default function TesteEneagramaPage() {
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [usuario, setUsuario] = useState<{
    id: string;
    nome: string;
    email?: string;
  } | null>(null);

  const [etapa, setEtapa] = useState<"intro" | "teste" | "resultado">("intro");
  const [afirmacaoAtualIndex, setAfirmacaoAtualIndex] = useState(0);
  const [respostas, setRespostas] = useState<Record<string, number>>({});
  const [modalRelatorioAberto, setModalRelatorioAberto] = useState(false);

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

  const totalQuestoes = AFIRMACOES_ENEAGRAMA.length;
  const afirmacaoAtual: EneagramaStatement = AFIRMACOES_ENEAGRAMA[afirmacaoAtualIndex];
  const notaAtual = respostas[afirmacaoAtual?.id];

  const resultadoCalculado: ResultadoEneagramaCalculado =
    calcularResultadoEneagrama(respostas);

  const handleSelecionarNota = (nota: number) => {
    setRespostas((prev) => ({
      ...prev,
      [afirmacaoAtual.id]: nota,
    }));

    // Avanço automático suave após seleção
    if (afirmacaoAtualIndex < totalQuestoes - 1) {
      setTimeout(() => {
        setAfirmacaoAtualIndex((prev) => prev + 1);
      }, 250);
    }
  };

  const handleVoltar = () => {
    if (afirmacaoAtualIndex > 0) {
      setAfirmacaoAtualIndex((prev) => prev - 1);
    }
  };

  const handleAvancar = () => {
    if (afirmacaoAtualIndex < totalQuestoes - 1) {
      setAfirmacaoAtualIndex((prev) => prev + 1);
    }
  };

  const handleConcluirTeste = () => {
    if (usuario) {
      const tiposPrincipais = resultadoCalculado.empates.length
        ? resultadoCalculado.empates.map((t) => t.numero)
        : [resultadoCalculado.tipoDominante.numero];
      const pontuacoes = Object.fromEntries(
        resultadoCalculado.ranking.map((r) => [r.tipo.numero, r.pontos])
      );

      fetch("/api/teste-eneagrama", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario_id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          tipos_principais: tiposPrincipais,
          pontuacoes,
          respostas,
        }),
      }).catch((err) => console.error("Erro ao registrar avaliação do Eneagrama:", err));
    }

    setEtapa("resultado");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReiniciarTeste = () => {
    if (
      window.confirm(
        "Deseja realmente recomeçar o teste? Suas respostas atuais serão limpas."
      )
    ) {
      setRespostas({});
      setAfirmacaoAtualIndex(0);
      setEtapa("teste");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const iniciarTeste = () => {
    setRespostas({});
    setAfirmacaoAtualIndex(0);
    setEtapa("teste");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#1A3C4D] flex flex-col justify-between pt-24 sm:pt-28">
      {/* Top Banner Hero */}
      <section className="relative w-full border-b border-[#E8DEC8]/60 bg-gradient-to-b from-[#F7F3E9] to-[#FDFBF7] py-10 sm:py-16">
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_50%_50%,#7D8C6E_1px,transparent_1px)] bg-[length:32px_32px] pointer-events-none" />

        <div className="absolute top-4 right-4 sm:right-8 z-20">
          <TestShareMenu
            titulo="Eneagrama"
            path="/teste-eneagrama"
            convite="Descubra seu Eneatipo com o teste de personalidade do Eneagrama do INstituto Kalapa:"
          />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Link
              href="/teste-autoconhecimento"
              className="inline-flex items-center gap-1.5 text-xs text-[#1A3C4D]/60 hover:text-[#1A3C4D] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Ver todos os testes</span>
            </Link>
            <span className="text-[#E8DEC8]">•</span>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7D8C6E]/15 text-[#7D8C6E] text-xs font-semibold uppercase tracking-wider border border-[#7D8C6E]/25">
              <Compass className="w-3.5 h-3.5 text-[#7D8C6E]" />
              <span>Psicologia Comportamental • Eneagrama</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-[#1A3C4D] tracking-tight mb-4 leading-tight">
            Teste de Personalidade do{" "}
            <span className="italic font-normal text-[#7D8C6E]">Eneagrama</span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#1A3C4D]/80 leading-relaxed font-light">
            Mapeie o seu Tipo Dominante, desvende suas feridas emocionais da infância,
            seus medos fundamentais e os caminhos de integração para sua essência.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="flex-grow w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {loadingAuth ? (
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-3 border-[#7D8C6E] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm font-light text-[#1A3C4D]/70">Carregando avaliação de personalidade...</p>
          </div>
        ) : !usuario ? (
          /* Card de Login / Cadastro Obrigatório */
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-[#E8DEC8]/20 border border-[#E8DEC8] text-center max-w-2xl mx-auto relative overflow-hidden">
            <div className="w-16 h-16 rounded-full bg-[#7D8C6E]/15 text-[#7D8C6E] flex items-center justify-center mx-auto mb-6 border border-[#7D8C6E]/30">
              <Lock className="w-8 h-8" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-light text-[#1A3C4D] mb-3">
              Identifique-se para Realizar o Teste do Eneagrama
            </h2>

            <p className="text-sm sm:text-base text-[#1A3C4D]/75 font-light leading-relaxed mb-6">
              Para mapear seu Tipo Dominante com precisão e gerar seu{" "}
              <strong>Laudo Diagnóstico Completo em PDF personalizado</strong>, é necessário estar
              conectado ao sistema do INstituto Kalapa.
            </p>

            <div className="bg-[#F8F4ED] rounded-xl p-5 mb-8 text-left border border-[#E8DEC8]/80">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-[#1A3C4D]/60 mb-3">
                O que você terá acesso após o teste:
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm text-[#1A3C4D]/85">
                <li className="flex items-start gap-2">
                  <span className="text-[#7D8C6E] font-bold">•</span>
                  <span><strong>Identificação do Tipo Dominante (1 a 9):</strong> Seu padrão arquetípico e motivações profundas.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#7D8C6E] font-bold">•</span>
                  <span><strong>Principais Feridas Emocionais:</strong> As dores da infância que moldaram suas defesas automáticas.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#7D8C6E] font-bold">•</span>
                  <span><strong>Medos e Desejos Fundamentais:</strong> A bússola oculta que rege suas decisões e conflitos.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#7D8C6E] font-bold">•</span>
                  <span><strong>Mensagens Perdidas da Infância:</strong> A verdade curativa necessária para desarmar o ego.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#7D8C6E] font-bold">•</span>
                  <span><strong>Mapa dos 9 Tipos & Laudo em PDF:</strong> Visão integral da sua personalidade pronta para impressão ou download.</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/login?redirect=/teste-eneagrama"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#1A3C4D] text-white text-sm font-medium hover:bg-[#15313F] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Fazer Login</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/cadastro?redirect=/teste-eneagrama"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#7D8C6E] text-white text-sm font-medium hover:bg-[#6C7B5D] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Criar Conta Gratuita</span>
                <UserCheck className="w-4 h-4" />
              </Link>
            </div>

            <p className="text-xs text-[#1A3C4D]/50 mt-5">
              Leva menos de 1 minuto para criar sua conta. Totalmente seguro e confidencial.
            </p>
          </div>
        ) : (
          <>
            {/* ETAPA 1: INTRODUÇÃO E INSTRUÇÕES (AUTENTICADO) */}
            {etapa === "intro" && (
              <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-[#E8DEC8]/20 border border-[#E8DEC8] text-center max-w-3xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#7D8C6E]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#B8965A]/5 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4" />

            <div className="relative">
              <span className="inline-flex items-center gap-1 text-xs text-[#7D8C6E] font-semibold uppercase tracking-wider mb-2">
                <Clock className="w-4 h-4" /> Duração estimada: ~6 a 8 minutos
              </span>

              <h2 className="text-2xl sm:text-3xl font-serif text-[#1A3C4D] mb-4">
                Instruções para o Teste
              </h2>

              {/* Box de Orientações Iniciais */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#F8F4ED] border border-[#E8DEC8] text-left mb-6 space-y-3">
                <p className="text-base sm:text-lg font-serif font-semibold text-[#1A3C4D]">
                  Antes de começar
                </p>
                <p className="text-xs sm:text-sm text-[#1A3C4D]/85 leading-relaxed font-light">
                  Reserve alguns minutos para estar presente.
                </p>
                <p className="text-xs sm:text-sm text-[#1A3C4D]/85 leading-relaxed font-light">
                  Escolha um ambiente tranquilo e confortável, tenha água por perto e, se possível, esteja em um espaço onde não será interrompido. Respire, desacelere e permita-se responder com honestidade, sem buscar a resposta &ldquo;certa&rdquo;.
                </p>
                <p className="text-xs sm:text-sm text-[#1A3C4D]/85 leading-relaxed font-light">
                  <strong className="font-semibold text-[#1A3C4D]">O Eneagrama é uma sabedoria ancestral de autoconhecimento.</strong> Mais do que encontrar um tipo, este é um convite para olhar para si com presença, consciência e curiosidade.
                </p>
                <p className="text-xs sm:text-sm text-[#1A3C4D]/85 leading-relaxed font-light">
                  Não responda como gostaria de ser. Responda como você verdadeiramente se percebe.
                </p>
              </div>

              {/* Escala de Respostas */}
              <div className="text-left mb-8">
                <h3 className="text-xs uppercase tracking-wider font-semibold text-[#1A3C4D]/60 mb-3">
                  Escala de Respostas (atribua uma nota de 0 a 5 para cada item):
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#1A3C4D]/80">
                  {ESCALA_NOTAS.map((item) => (
                    <div
                      key={item.valor}
                      className="flex items-center gap-2.5 p-2 rounded-lg bg-[#FDFBF7] border border-[#E8DEC8]/60"
                    >
                      <span className="w-6 h-6 rounded-md bg-[#7D8C6E]/15 text-[#7D8C6E] font-bold flex items-center justify-center shrink-0">
                        {item.valor}
                      </span>
                      <span>{item.descricao}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={iniciarTeste}
                className="w-full py-4 px-8 rounded-2xl bg-[#7D8C6E] hover:bg-[#6C7B5D] text-white text-base font-semibold transition-all shadow-lg shadow-[#7D8C6E]/20 flex items-center justify-center gap-2 cursor-pointer hover:gap-3"
              >
                <span>Começar Avaliação (45 Afirmações)</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* ETAPA 2: QUESTIONÁRIO INTERATIVO */}
        {etapa === "teste" && (
          <div>
            <EneagramaProgressIndicator
              atual={afirmacaoAtualIndex}
              total={totalQuestoes}
              onReiniciar={handleReiniciarTeste}
            />

            <EneagramaQuestionCard
              afirmacaoAtual={afirmacaoAtual}
              notaAtual={notaAtual}
              onSelecionarNota={handleSelecionarNota}
              onVoltar={handleVoltar}
              onAvancar={handleAvancar}
              podeVoltar={afirmacaoAtualIndex > 0}
              podeAvancar={afirmacaoAtualIndex < totalQuestoes - 1}
              isUltima={afirmacaoAtualIndex === totalQuestoes - 1}
              onConcluir={handleConcluirTeste}
            />
          </div>
        )}

        {/* ETAPA 3: LAUDO E DIAGNÓSTICO FINAL */}
        {etapa === "resultado" && (
          <EneagramaResultView
            resultado={resultadoCalculado}
            onReiniciar={iniciarTeste}
            onAbrirRelatorio={() => setModalRelatorioAberto(true)}
            usuario={usuario}
          />
        )}
          </>
        )}
      </section>

      {/* Modal para Impressão e PDF do Laudo */}
      <EneagramaReportModal
        isOpen={modalRelatorioAberto}
        onClose={() => setModalRelatorioAberto(false)}
        resultado={resultadoCalculado}
        usuarioNome={usuario?.nome}
        usuarioEmail={usuario?.email}
      />

      <Footer />
    </main>
  );
}
