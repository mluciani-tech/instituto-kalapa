"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Clock,
  ArrowRight,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  ArrowLeft,
  Lock,
  UserCheck,
  BookOpen,
  ShoppingBag,
  CheckCircle2,
  Sunrise,
  SunMedium,
  Moon,
  RefreshCw,
} from "lucide-react";
import { QUESTOES_CRONOTIPO, CronotipoQuestion } from "./data/cronotipo-data";
import {
  calcularResultadoCronotipo,
  ResultadoCronotipoCalculado,
} from "./lib/calculo-cronotipo";
import CronotipoProgressIndicator from "./components/CronotipoProgressIndicator";
import CronotipoQuestionCard from "./components/CronotipoQuestionCard";
import CronotipoResultView from "./components/CronotipoResultView";
import CronotipoReportModal from "./components/CronotipoReportModal";
import Footer from "../components/Footer";
import TestShareMenu from "../components/TestShareMenu";
import { useCart } from "@/context/CartContext";

export default function TesteCronotipoPage() {
  const { clearCart, addItem, openDrawer } = useCart();
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [usuario, setUsuario] = useState<{
    id: string;
    nome: string;
    email?: string;
  } | null>(null);
  const [creditosRestantes, setCreditosRestantes] = useState<number>(0);
  const [produtoTeste, setProdutoTeste] = useState<{
    id: string;
    nome: string;
    slug: string;
    preco: number;
    preco_promocional?: number | null;
    categoria?: string | null;
    imagem_url?: string | null;
    rota_teste?: string | null;
    orientacoes_pre_teste?: string | null;
    inclui_laudo_pdf?: boolean;
  } | null>(null);

  const [etapa, setEtapa] = useState<"intro" | "teste" | "resultado">("intro");
  const [questaoAtualIndex, setQuestaoAtualIndex] = useState(0);
  const [respostas, setRespostas] = useState<Record<number, string>>({});
  const [modalRelatorioAberto, setModalRelatorioAberto] = useState(false);
  const [verificandoManual, setVerificandoManual] = useState(false);

  const carregarStatus = useCallback(async (isManual = false) => {
    try {
      if (isManual) setVerificandoManual(true);
      else if (!usuario) setLoadingAuth(true);

      const res = await fetch("/api/testes/credito?slug=teste-cronotipo", {
        cache: "no-store",
      });
      const data = await res.json();
      if (data?.authenticated && data.usuario) {
        setUsuario(data.usuario);
      } else {
        setUsuario(null);
      }
      const creditos = data?.creditosRestantes || 0;
      setCreditosRestantes(creditos);
      if (data?.produto) {
        setProdutoTeste(data.produto);
      }

      if (data?.ultimaAvaliacao && creditos === 0) {
        setRespostas(data.ultimaAvaliacao.respostas);
        setEtapa("resultado");
      }

      // Se o usuário veio com ?iniciar=1 ou ?sucesso=1 e possui créditos, avança direto para o teste!
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        if ((params.get("iniciar") === "1" || params.get("sucesso") === "1") && creditos > 0) {
          setEtapa("teste");
        }
      }
    } catch (err) {
      console.error("Erro ao verificar créditos do Cronotipo:", err);
    } finally {
      setLoadingAuth(false);
      if (isManual) setVerificandoManual(false);
    }
  }, [usuario]);

  useEffect(() => {
    carregarStatus();

    // Re-checar quando a janela ganhar foco (ex: usuário voltou da aba do InfinitePay)
    const handleFocus = () => carregarStatus();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [carregarStatus]);

  // Se o usuário estiver conectado mas ainda sem créditos, tenta re-verificar por até 5 tentativas curtas
  useEffect(() => {
    if (!usuario || creditosRestantes > 0) return;

    let tentativas = 0;
    const interval = setInterval(() => {
      tentativas++;
      if (tentativas > 5) {
        clearInterval(interval);
        return;
      }
      carregarStatus();
    }, 2500);

    return () => clearInterval(interval);
  }, [usuario, creditosRestantes, carregarStatus]);

  const totalQuestoes = QUESTOES_CRONOTIPO.length;
  const questaoAtual: CronotipoQuestion = QUESTOES_CRONOTIPO[questaoAtualIndex];
  const respostaAtual = respostas[questaoAtual?.id];

  const resultadoCalculado: ResultadoCronotipoCalculado =
    calcularResultadoCronotipo(respostas);

  const precoExibicao = produtoTeste
    ? produtoTeste.preco_promocional ?? produtoTeste.preco ?? 10
    : 10;

  const precoFormatado =
    precoExibicao <= 0
      ? "Acesso Livre"
      : `R$ ${precoExibicao.toFixed(2).replace(".", ",")}`;

  const handleComprarTeste = () => {
    if (produtoTeste) {
      clearCart();
      addItem(
        {
          id: produtoTeste.id,
          slug: produtoTeste.slug || "teste-cronotipo",
          nome: produtoTeste.nome || "A Sabedoria do Cronotipo & o Ritmo Biológico",
          preco: precoExibicao,
          imagem_url: produtoTeste.imagem_url,
          categoria: produtoTeste.categoria || "testes",
          is_teste: true,
          rota_teste: produtoTeste.rota_teste || "/teste-cronotipo",
        },
        1
      );
      sessionStorage.setItem("produto_selecionado", produtoTeste.id);
      window.location.href = "/checkout";
    } else {
      window.location.href = "/produtos/teste-cronotipo";
    }
  };

  const handleSelecionarOpcao = (letra: "A" | "B" | "C") => {
    setRespostas((prev) => ({
      ...prev,
      [questaoAtual.id]: letra,
    }));

    if (questaoAtualIndex < totalQuestoes - 1) {
      setTimeout(() => {
        setQuestaoAtualIndex((prev) => prev + 1);
      }, 250);
    }
  };

  const handleVoltar = () => {
    if (questaoAtualIndex > 0) {
      setQuestaoAtualIndex((prev) => prev - 1);
    }
  };

  const handleAvancar = () => {
    if (questaoAtualIndex < totalQuestoes - 1) {
      setQuestaoAtualIndex((prev) => prev + 1);
    } else if (respostaAtual) {
      handleConcluirTeste();
    }
  };

  const handleConcluirTeste = () => {
    if (usuario) {
      fetch("/api/teste-cronotipo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario_id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          pontuacao_total: resultadoCalculado.pontuacaoTotal,
          cronotipo: resultadoCalculado.tipoCronotipo,
          nome_cronotipo: resultadoCalculado.info.nome,
          respostas: resultadoCalculado.respostasDetalhadas,
        }),
      })
        .then(async (res) => {
          if (!res.ok) {
            const errData = await res.json();
            if (errData.sem_credito) {
              alert(
                errData.error ||
                  "Você não possui créditos para realizar este teste no INstituto Kalapa."
              );
            }
          } else {
            setCreditosRestantes((prev) => Math.max(0, prev - 1));
          }
        })
        .catch((err) =>
          console.error("Erro ao registrar avaliação do Cronotipo:", err)
        );
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
      setQuestaoAtualIndex(0);
      setEtapa("teste");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const iniciarTeste = () => {
    if (precoExibicao > 0 && creditosRestantes <= 0) {
      handleComprarTeste();
      return;
    }
    setRespostas({});
    setQuestaoAtualIndex(0);
    setEtapa("teste");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#1A3C4D] flex flex-col justify-between pt-24 sm:pt-28">
      {/* Top Banner Hero */}
      <section className="relative w-full border-b border-[#E8DEC8]/60 bg-gradient-to-b from-[#F7F3E9] to-[#FDFBF7] py-10 sm:py-16">
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_50%_50%,#B8965A_1px,transparent_1px)] bg-[length:32px_32px] pointer-events-none" />

        <div className="absolute top-4 right-4 sm:right-8 z-20">
          <TestShareMenu
            titulo="A Sabedoria do Cronotipo & o Ritmo Biológico"
            path="/teste-cronotipo"
            convite="Descubra seu Cronotipo circadiano (Cotovia, Urso ou Coruja) no INstituto Kalapa:"
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
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B8965A]/15 text-[#B8965A] text-xs font-semibold uppercase tracking-wider border border-[#B8965A]/25">
              <Clock className="w-3.5 h-3.5 text-[#B8965A]" />
              <span>Cronobiologia • 6 Dimensões</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-[#1A3C4D] tracking-tight mb-4 leading-tight">
            A Sabedoria do{" "}
            <span className="italic font-normal text-[#B8965A]">Cronotipo</span> & o Ritmo Biológico
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#1A3C4D]/80 leading-relaxed font-light">
            O cronotipo é uma expressão individual do nosso relógio biológico, revelando tendências naturais em relação aos horários de sono, vigília, energia, atenção e desempenho ao longo do dia.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="flex-grow w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {loadingAuth ? (
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-3 border-[#B8965A] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm font-light text-[#1A3C4D]/70">
              Carregando avaliação circadiana...
            </p>
          </div>
        ) : !usuario && precoExibicao > 0 ? (
          /* Card para Usuário Não Autenticado (quando for teste pago) */
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-[#E8DEC8]/20 border border-[#E8DEC8] text-center max-w-2xl mx-auto relative overflow-hidden">
            <div className="w-16 h-16 rounded-full bg-[#B8965A]/15 text-[#B8965A] flex items-center justify-center mx-auto mb-6 border border-[#B8965A]/30">
              <Lock className="w-8 h-8" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-light text-[#1A3C4D] mb-3">
              Avaliação do Ritmo Biológico & Cronotipo
            </h2>

            <p className="text-sm sm:text-base text-[#1A3C4D]/75 font-light leading-relaxed mb-6">
              Para identificar seu Cronotipo com precisão, acessar seu dossiê comportamental e emitir seu{" "}
              <strong>Laudo Clínico em PDF personalizado</strong> no INstituto Kalapa:
            </p>

            {/* Box de Preço e Benefícios */}
            <div className="bg-[#F8F4ED] rounded-2xl p-6 mb-8 text-left border border-[#E8DEC8]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E8DEC8]">
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#1A3C4D]/60 block mb-1">
                    Investimento por avaliação
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-serif font-bold text-[#1A3C4D]">
                      {precoFormatado}
                    </span>
                    <span className="text-xs text-[#1A3C4D]/60 font-light">
                      / avaliação online
                    </span>
                  </div>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#B8965A]/15 text-[#B8965A] text-xs font-semibold border border-[#B8965A]/20 self-start sm:self-center">
                  <CheckCircle2 className="w-4 h-4 text-[#B8965A]" />
                  <span>Laudo PDF Incluso</span>
                </div>
              </div>

              <h4 className="text-xs uppercase tracking-wider font-semibold text-[#1A3C4D]/70 mt-5 mb-3">
                O que você terá acesso:
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm text-[#1A3C4D]/85">
                <li className="flex items-start gap-2">
                  <span className="text-[#B8965A] font-bold">•</span>
                  <span>
                    <strong>Identificação do Cronotipo:</strong> Cotovia (Matutino), Urso (Intermediário) ou Coruja (Vespertino).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#B8965A] font-bold">•</span>
                  <span>
                    <strong>Mapeamento Circadiano:</strong> Janela de pico cognitivo, horários ideais de sono e tomadas de decisão.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#B8965A] font-bold">•</span>
                  <span>
                    <strong>Dossiê de 30 Tópicos:</strong> Diretrizes para trabalho, estudos, exercícios, alimentação e saúde mental.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#B8965A] font-bold">•</span>
                  <span>
                    <strong>Laudo em PDF A4:</strong> Documento visual pronto para impressão e preservação clínica.
                  </span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleComprarTeste}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#1A3C4D] text-white text-sm font-medium hover:bg-[#15313F] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-[#B8965A]" />
                <span>Adquirir Avaliação • {precoFormatado}</span>
              </button>

              <Link
                href="/login?redirect=/teste-cronotipo"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-[#E8DEC8] text-[#1A3C4D] text-sm font-medium hover:bg-[#FDFBF7] transition-all flex items-center justify-center gap-2"
              >
                <span>Já possuo conta / Entrar</span>
              </Link>
            </div>
          </div>
        ) : creditosRestantes === 0 && precoExibicao > 0 && etapa === "intro" ? (
          /* Card Paywall para Usuário Logado Sem Créditos */
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-[#E8DEC8]/20 border border-[#E8DEC8] text-center max-w-2xl mx-auto relative overflow-hidden">
            <div className="w-16 h-16 rounded-full bg-[#B8965A]/15 text-[#B8965A] flex items-center justify-center mx-auto mb-6 border border-[#B8965A]/30">
              <ShoppingBag className="w-8 h-8" />
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#B8965A]/15 text-[#B8965A] mb-3">
              Crédito de Avaliação Necessário
            </span>

            <h2 className="text-2xl sm:text-3xl font-serif font-light text-[#1A3C4D] mb-3">
              Olá, {usuario?.nome}
            </h2>

            <p className="text-sm sm:text-base text-[#1A3C4D]/75 font-light leading-relaxed mb-6">
              Você ainda não possui créditos disponíveis para iniciar o teste do Cronotipo &amp; Ritmo Biológico. Para desbloquear o questionário e emitir seu Laudo Diagnóstico Completo em PDF, adquira sua avaliação abaixo:
            </p>

            <div className="bg-[#F8F4ED] rounded-2xl p-6 mb-8 text-left border border-[#E8DEC8]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DEC8]">
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#1A3C4D]/60 block mb-1">
                    Investimento por avaliação
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-serif font-bold text-[#1A3C4D]">
                      {precoFormatado}
                    </span>
                    <span className="text-xs text-[#1A3C4D]/60 font-light">/ avaliação online</span>
                  </div>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#B8965A]/15 text-[#B8965A] text-xs font-semibold border border-[#B8965A]/20 self-start sm:self-center">
                  <CheckCircle2 className="w-4 h-4 text-[#B8965A]" />
                  <span>Laudo PDF Incluso</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#1A3C4D]/80">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#B8965A] shrink-0" />
                  <span>Acesso liberado imediatamente</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#B8965A] shrink-0" />
                  <span>Mapeamento circadiano e 6 dimensões</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#B8965A] shrink-0" />
                  <span>Laudo Clínico em PDF A4</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#B8965A] shrink-0" />
                  <span>Histórico permanente em sua conta</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleComprarTeste}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#1A3C4D] text-white text-sm font-medium hover:bg-[#15313F] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-[#B8965A]" />
                <span>Ir para o Pagamento ({precoFormatado})</span>
              </button>
              <button
                type="button"
                onClick={() => carregarStatus(true)}
                disabled={verificandoManual}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-[#B8965A] text-[#1A3C4D] hover:bg-[#B8965A]/10 text-sm font-medium transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 text-[#B8965A] ${verificandoManual ? "animate-spin" : ""}`} />
                <span>{verificandoManual ? "Verificando..." : "Já paguei • Verificar liberação"}</span>
              </button>
              <Link
                href="/conta/pedidos"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-[#1A3C4D]/30 text-[#1A3C4D] text-sm font-medium hover:bg-[#FDFBF7] transition-all flex items-center justify-center gap-2"
              >
                <span>Meus Pedidos</span>
              </Link>
            </div>
            <p className="text-xs text-[#1A3C4D]/50 mt-5">
              Já realizou o pagamento? O crédito é liberado automaticamente após a confirmação do pagamento via InfinitePay.
            </p>
          </div>
        ) : (
          <>
            {etapa === "intro" && (
              /* Tela de Introdução e Início */
              <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-[#E8DEC8]/20 border border-[#E8DEC8] max-w-2xl mx-auto">
                {/* Badge de Créditos Disponíveis */}
                {precoExibicao > 0 && creditosRestantes > 0 && (
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-medium mb-5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>
                      Você possui <strong>{creditosRestantes} crédito{creditosRestantes > 1 ? "s" : ""}</strong> disponível{creditosRestantes > 1 ? "is" : ""} para esta avaliação
                    </span>
                  </div>
                )}

                {usuario && (
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#F8F4ED] border border-[#E8DEC8] mb-6">
                    <div className="w-10 h-10 rounded-full bg-[#1A3C4D] text-white flex items-center justify-center text-sm font-bold shrink-0">
                      {usuario.nome?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-[#1A3C4D] truncate">
                          {usuario.nome}
                        </p>
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#B8965A] bg-[#B8965A]/15 px-2 py-0.5 rounded-full">
                          <UserCheck className="w-3 h-3" /> Conectado
                        </span>
                      </div>
                      <p className="text-xs text-[#1A3C4D]/60 truncate">{usuario.email}</p>
                    </div>
                  </div>
                )}

                {/* Box de Orientações Customizadas do Admin ou Padrão */}
                {produtoTeste?.orientacoes_pre_teste && (
                  <div className="p-4 rounded-xl bg-[#F8F4ED] border border-[#E8DEC8] text-left mb-6 text-sm text-[#1A3C4D]/85 leading-relaxed">
                    <p className="font-semibold text-[#1A3C4D] mb-1">Orientações do INstituto Kalapa:</p>
                    <p className="whitespace-pre-line">{produtoTeste.orientacoes_pre_teste}</p>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-serif font-light text-[#1A3C4D] mb-3">
                    Orientações para o Teste
                  </h2>
                  <p className="text-xs sm:text-sm text-[#1A3C4D]/75 font-light leading-relaxed">
                    Responda pensando em como seu organismo funciona de forma espontânea — especialmente em dias livres ou sem a interferência de alarmes e obrigações sociais rígidas.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#E8DEC8] text-center">
                    <div className="w-10 h-10 rounded-full bg-[#B8965A]/15 text-[#B8965A] flex items-center justify-center mx-auto mb-2 font-bold text-sm">
                      1
                    </div>
                    <h4 className="text-xs font-semibold text-[#1A3C4D] mb-1">
                      6 Perguntas
                    </h4>
                    <p className="text-[11px] text-[#1A3C4D]/70 font-light">
                      Diretas e focadas na sua rotina biológica.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#E8DEC8] text-center">
                    <div className="w-10 h-10 rounded-full bg-[#B8965A]/15 text-[#B8965A] flex items-center justify-center mx-auto mb-2 font-bold text-sm">
                      2
                    </div>
                    <h4 className="text-xs font-semibold text-[#1A3C4D] mb-1">
                      ~2 Minutos
                    </h4>
                    <p className="text-[11px] text-[#1A3C4D]/70 font-light">
                      Avaliação rápida, dinâmica e precisa.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#E8DEC8] text-center">
                    <div className="w-10 h-10 rounded-full bg-[#B8965A]/15 text-[#B8965A] flex items-center justify-center mx-auto mb-2 font-bold text-sm">
                      3
                    </div>
                    <h4 className="text-xs font-semibold text-[#1A3C4D] mb-1">
                      Laudo 30 Tópicos
                    </h4>
                    <p className="text-[11px] text-[#1A3C4D]/70 font-light">
                      Dossiê completo para download e impressão.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={iniciarTeste}
                    className="w-full py-4 px-6 rounded-2xl bg-[#1A3C4D] hover:bg-[#15313F] text-white text-sm font-semibold transition-all duration-200 shadow-md shadow-[#1A3C4D]/15 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Iniciar Avaliação do Cronotipo</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {!usuario && (
                    <div className="text-center">
                      <Link
                        href="/login?redirect=/teste-cronotipo"
                        className="text-xs text-[#1A3C4D]/60 hover:text-[#1A3C4D] underline decoration-dotted"
                      >
                        Deseja salvar seu histórico na sua conta? Faça login antes de começar.
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {etapa === "teste" && (
              /* Tela das Questões */
              <div>
                <CronotipoProgressIndicator
                  atual={questaoAtualIndex}
                  total={totalQuestoes}
                  onReiniciar={handleReiniciarTeste}
                />

                <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-[#E8DEC8]/20 border border-[#E8DEC8]">
                  <CronotipoQuestionCard
                    questao={questaoAtual}
                    respostaSelecionada={respostaAtual}
                    onSelecionar={handleSelecionarOpcao}
                    onVoltar={handleVoltar}
                    onAvancar={handleAvancar}
                    isUltima={questaoAtualIndex === totalQuestoes - 1}
                    isPrimeira={questaoAtualIndex === 0}
                  />
                </div>
              </div>
            )}

            {etapa === "resultado" && (
              /* Tela de Resultado */
              <CronotipoResultView
                resultado={resultadoCalculado}
                onReiniciar={handleReiniciarTeste}
                onAbrirRelatorio={() => setModalRelatorioAberto(true)}
                usuario={usuario}
              />
            )}
          </>
        )}
      </section>

      {/* Modal de Relatório Clínico A4 */}
      {modalRelatorioAberto && (
        <CronotipoReportModal
          isOpen={modalRelatorioAberto}
          onClose={() => setModalRelatorioAberto(false)}
          resultado={resultadoCalculado}
          usuarioNome={usuario?.nome}
          usuarioEmail={usuario?.email}
        />
      )}

      <Footer />
    </main>
  );
}
