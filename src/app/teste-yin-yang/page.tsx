"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  RotateCcw,
  Scale,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Lock,
  UserCheck,
  ShoppingBag,
  CheckCircle2,
  FileText,
  CreditCard,
} from "lucide-react";
import {
  YIN_YANG_PERGUNTAS,
  RESULTADOS_MAP,
  ResultadoInfo,
  YinYangQuestion,
} from "./data/yin-yang-data";
import { calcularPontuacaoYinYang } from "./lib/calculo-mtc";
import TestReportModal from "./components/TestReportModal";
import Footer from "../components/Footer";
import TestShareMenu from "../components/TestShareMenu";
import ProgressIndicator from "./components/ProgressIndicator";
import QuestionCard from "./components/QuestionCard";
import ResultView from "./components/ResultView";
import { useCart } from "@/context/CartContext";

export default function TesteYinYangPage() {
  const { addItem, openDrawer } = useCart();
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [usuario, setUsuario] = useState<{ id: string; nome: string; email?: string } | null>(null);
  const [creditosRestantes, setCreditosRestantes] = useState<number>(0);
  const [produtoTeste, setProdutoTeste] = useState<{
    id: string;
    nome: string;
    slug: string;
    preco: number;
    preco_promocional?: number | null;
    imagem_url?: string | null;
    rota_teste?: string | null;
    orientacoes_pre_teste?: string | null;
    inclui_laudo_pdf?: boolean;
  } | null>(null);

  const [etapa, setEtapa] = useState<"intro" | "teste" | "resultado">("intro");
  const [perguntaAtualIndex, setPerguntaAtualIndex] = useState(0);
  const [respostas, setRespostas] = useState<Record<number, "yang" | "yin">>({});

  const [modalRelatorioAberto, setModalRelatorioAberto] = useState(false);
  const [modalEmpateAberto, setModalEmpateAberto] = useState(false);

  useEffect(() => {
    async function carregarStatus() {
      try {
        setLoadingAuth(true);
        const res = await fetch("/api/testes/credito?slug=teste-yin-yang", { cache: "no-store" });
        const data = await res.json();
        if (data?.authenticated && data.usuario) {
          setUsuario(data.usuario);
        } else {
          setUsuario(null);
        }
        setCreditosRestantes(data?.creditosRestantes || 0);
        if (data?.produto) {
          setProdutoTeste(data.produto);
        }
      } catch (err) {
        console.error("Erro ao verificar créditos do teste:", err);
      } finally {
        setLoadingAuth(false);
      }
    }
    carregarStatus();
  }, []);

  const { totalRespondidas, pontosYang, pontosYin, tipoResultado } = calcularPontuacaoYinYang(respostas);
  const resultadoAtual: ResultadoInfo = RESULTADOS_MAP[tipoResultado];

  useEffect(() => {
    if (etapa === "resultado" && totalRespondidas > 0 && pontosYang === pontosYin) {
      setEtapa("teste");
      setModalEmpateAberto(true);
    }
  }, [etapa, totalRespondidas, pontosYang, pontosYin]);

  const perguntaAtual: YinYangQuestion = YIN_YANG_PERGUNTAS[perguntaAtualIndex];
  const respostaAtual = respostas[perguntaAtual?.id];

  const precoExibicao = produtoTeste
    ? produtoTeste.preco_promocional ?? produtoTeste.preco ?? 47
    : 47;

  const precoFormatado = precoExibicao <= 0 ? "Acesso Livre" : `R$ ${precoExibicao.toFixed(2).replace(".", ",")}`;


  const handleComprarTeste = () => {
    if (produtoTeste) {
      addItem({
        id: produtoTeste.id,
        slug: produtoTeste.slug || "teste-yin-yang",
        nome: produtoTeste.nome || "Teste Yin ou Yang?",
        preco: precoExibicao,
        imagem_url: produtoTeste.imagem_url,
        is_teste: true,
        rota_teste: produtoTeste.rota_teste || "/teste-yin-yang",
      });
      openDrawer();
    } else {
      // Fallback para abrir página de produtos
      window.location.href = "/produtos/teste-yin-yang";
    }
  };

  const handleSelecionarResposta = (opcao: "yang" | "yin") => {
    setRespostas((prev) => ({
      ...prev,
      [perguntaAtual.id]: opcao,
    }));

    if (perguntaAtualIndex < YIN_YANG_PERGUNTAS.length - 1) {
      setTimeout(() => {
        setPerguntaAtualIndex((prev) => prev + 1);
      }, 250);
    }
  };

  const handleConcluirTeste = () => {
    if (pontosYang === pontosYin) {
      setModalEmpateAberto(true);
      return;
    }

    if (usuario && usuario.email) {
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
        .catch((err) => console.error("Erro ao registrar avaliação Yin/Yang:", err));
    }

    setEtapa("resultado");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRefazerPorEmpate = () => {
    setRespostas({});
    setPerguntaAtualIndex(0);
    setEtapa("teste");
    setModalEmpateAberto(false);
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

  const iniciarTeste = () => {
    if (creditosRestantes <= 0) {
      handleComprarTeste();
      return;
    }
    setEtapa("teste");
    setRespostas({});
    setPerguntaAtualIndex(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#1A3C4D] flex flex-col justify-between pt-24 sm:pt-28">
      {/* Top Banner Hero */}
      <section className="relative w-full border-b border-[#E8DEC8]/60 bg-gradient-to-b from-[#F7F3E9] to-[#FDFBF7] py-10 sm:py-16">
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <Image
            src="/images/yin-yang/banner.jpg"
            alt="MTC Yin Yang Harmonia"
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        <div className="absolute top-4 right-4 sm:right-8 z-20">
          <TestShareMenu
            titulo="Yin ou Yang?"
            path="/teste-yin-yang"
            convite="Descubra sua tendência energética com o teste Yin ou Yang? do INstituto Kalapa:"
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
        </div>
      </section>

      {/* Main Content Area */}
      <section className="flex-grow w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {loadingAuth ? (
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-3 border-[#B8965A] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm font-light text-[#1A3C4D]/70">Carregando avaliação energética...</p>
          </div>
        ) : !usuario ? (
          /* Card para Usuário Não Autenticado: Apresentação + CTA de Compra / Login */
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-[#E8DEC8]/20 border border-[#E8DEC8] text-center max-w-2xl mx-auto relative overflow-hidden">
            <div className="w-16 h-16 rounded-full bg-[#B8965A]/10 text-[#B8965A] flex items-center justify-center mx-auto mb-6 border border-[#B8965A]/30">
              <Lock className="w-8 h-8" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-light text-[#1A3C4D] mb-3">
              Avaliação Energética Yin & Yang
            </h2>

            <p className="text-sm sm:text-base text-[#1A3C4D]/75 font-light leading-relaxed mb-6">
              Esta avaliação clínica personalizada inclui o cálculo minucioso das suas tendências, orientações terapêuticas de Medicina Tradicional Chinesa e emissão do{" "}
              <strong>Laudo Clínico Completo em PDF para download</strong> no INstituto Kalapa.
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
                    <span className="text-xs text-[#1A3C4D]/60 font-light">/ avaliação online</span>
                  </div>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#7D8C6E]/15 text-[#7D8C6E] text-xs font-semibold border border-[#7D8C6E]/20 self-start sm:self-center">
                  <CheckCircle2 className="w-4 h-4 text-[#7D8C6E]" />
                  <span>Laudo PDF Incluso</span>
                </div>
              </div>

              <h4 className="text-xs uppercase tracking-wider font-semibold text-[#1A3C4D]/70 mt-5 mb-3">
                O que você terá acesso:
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm text-[#1A3C4D]/85">
                <li className="flex items-start gap-2">
                  <span className="text-[#B8965A] font-bold">•</span>
                  <span><strong>Diagnóstico MTC Completo:</strong> Tendência Fogo (Yang), Frio (Yin) ou Equilíbrio Dinâmico.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#B8965A] font-bold">•</span>
                  <span><strong>Impacto no Sono (Wei Qi):</strong> Análise da circulação de energia e causas de despertares.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#B8965A] font-bold">•</span>
                  <span><strong>Dietoterapia & Fitoterapia:</strong> Alimentos e chás terapêuticos específicos para o seu padrão.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#B8965A] font-bold">•</span>
                  <span><strong>Laudo Clínico em PDF:</strong> Documento completo para download e impressão em formato A4.</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleComprarTeste}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#1A3C4D] text-white text-sm font-medium hover:bg-[#15313F] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Comprar Avaliação ({precoFormatado})</span>
              </button>
              <Link
                href="/login?redirect=/teste-yin-yang"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-[#1A3C4D]/30 text-[#1A3C4D] text-sm font-medium hover:bg-[#F8F4ED] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Já comprou? Fazer Login</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <p className="text-xs text-[#1A3C4D]/50 mt-5">
              Pagamento 100% seguro via InfinitePay (Pix ou Cartão de Crédito).
            </p>
          </div>
        ) : creditosRestantes === 0 ? (
          /* Card Paywall para Usuário Logado Sem Créditos */
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-[#E8DEC8]/20 border border-[#E8DEC8] text-center max-w-2xl mx-auto relative overflow-hidden">
            <div className="w-16 h-16 rounded-full bg-[#B8965A]/15 text-[#B8965A] flex items-center justify-center mx-auto mb-6 border border-[#B8965A]/30">
              <ShoppingBag className="w-8 h-8" />
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#B8965A]/15 text-[#B8965A] mb-3">
              Crédito de Avaliação Necessário
            </span>

            <h2 className="text-2xl sm:text-3xl font-serif font-light text-[#1A3C4D] mb-3">
              Olá, {usuario.nome}
            </h2>

            <p className="text-sm sm:text-base text-[#1A3C4D]/75 font-light leading-relaxed mb-6">
              Você ainda não possui créditos disponíveis para iniciar o teste Yin/Yang. Para desbloquear o questionário e emitir seu Laudo Clínico em PDF, adquira sua avaliação abaixo:
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
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#7D8C6E]/15 text-[#7D8C6E] text-xs font-semibold border border-[#7D8C6E]/20 self-start sm:self-center">
                  <CheckCircle2 className="w-4 h-4 text-[#7D8C6E]" />
                  <span>Laudo PDF Incluso</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#1A3C4D]/80">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#7D8C6E] shrink-0" />
                  <span>Acesso imediato após pagamento</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#7D8C6E] shrink-0" />
                  <span>Laudo Clínico em PDF A4</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#7D8C6E] shrink-0" />
                  <span>Dietoterapia & Fitoterapia MTC</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#7D8C6E] shrink-0" />
                  <span>Histórico salvo na sua conta</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleComprarTeste}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#1A3C4D] text-white text-sm font-medium hover:bg-[#15313F] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Adicionar ao Carrinho ({precoFormatado})</span>
              </button>
              <Link
                href="/conta/pedidos"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-[#1A3C4D]/30 text-[#1A3C4D] text-sm font-medium hover:bg-[#F8F4ED] transition-all flex items-center justify-center gap-2"
              >
                <span>Meus Pedidos</span>
              </Link>
            </div>
            <p className="text-xs text-[#1A3C4D]/50 mt-5">
              Já realizou o pagamento? O crédito é liberado automaticamente após a confirmação do pagamento via InfinitePay.
            </p>
          </div>
        ) : etapa === "intro" ? (
          /* Card de Introdução para Usuário com Crédito Disponível */
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-[#E8DEC8]/20 border border-[#E8DEC8] text-center max-w-2xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#B8965A]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#7D8C6E]/5 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4" />

            <div className="relative">
              {/* Badge de Créditos Disponíveis */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-medium mb-5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>
                  Você possui <strong>{creditosRestantes} crédito{creditosRestantes > 1 ? "s" : ""}</strong> disponível{creditosRestantes > 1 ? "is" : ""} para esta avaliação
                </span>
              </div>

              <h2 className="text-2xl font-serif text-[#1A3C4D] mb-4">Instruções para o Teste</h2>

              {produtoTeste?.orientacoes_pre_teste ? (
                <div className="p-4 rounded-xl bg-[#F8F4ED] border border-[#E8DEC8] text-left mb-6 text-sm text-[#1A3C4D]/85 leading-relaxed">
                  <p className="font-semibold text-[#1A3C4D] mb-1">Orientações do INstituto Kalapa:</p>
                  <p className="whitespace-pre-line">{produtoTeste.orientacoes_pre_teste}</p>
                </div>
              ) : null}

              <ul className="text-left space-y-4 text-sm sm:text-base text-[#1A3C4D]/80 mb-8 max-w-lg mx-auto">
                <li className="flex gap-3">
                  <span className="text-[#B8965A] font-bold mt-0.5">•</span>
                  <span>O teste possui 15 questões sobre hábitos, temperatura, digestão e emoções.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#B8965A] font-bold mt-0.5">•</span>
                  <span>
                    Não pense muito na resposta. Escolha o padrão que <strong>geralmente</strong>{" "}
                    descreve você nos últimos meses (não apenas hoje).
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#B8965A] font-bold mt-0.5">•</span>
                  <span>
                    Ao final, você receberá seu Laudo Clínico em PDF personalizado para download com orientações completas para equilibrar suas energias.
                  </span>
                </li>
              </ul>
              <button
                onClick={iniciarTeste}
                className="w-full sm:w-auto px-10 py-4 rounded-xl bg-[#1A3C4D] text-white font-medium hover:bg-[#15313F] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 mx-auto cursor-pointer"
              >
                <span>Iniciar Avaliação Kalapa</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : etapa === "teste" ? (
          <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-[#E8DEC8]">
            <ProgressIndicator 
              perguntas={YIN_YANG_PERGUNTAS} 
              perguntaAtualIndex={perguntaAtualIndex} 
              respostas={respostas} 
              setPerguntaAtualIndex={setPerguntaAtualIndex} 
            />

            <QuestionCard 
              perguntaAtual={perguntaAtual} 
              respostaAtual={respostaAtual} 
              handleSelecionarResposta={handleSelecionarResposta} 
            />

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
                  Preencha mais {YIN_YANG_PERGUNTAS.length - totalRespondidas} questão(ões) para ver o resultado.
                </div>
              )}
            </div>
          </div>
        ) : (
          <ResultView
            pontosYang={pontosYang}
            pontosYin={pontosYin}
            handleReiniciarTeste={handleReiniciarTeste} 
            resultadoAtual={resultadoAtual}
            tipoResultado={tipoResultado}
            usuario={usuario}
            setModalRelatorioAberto={setModalRelatorioAberto}
          />
        )}
      </section>

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
