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
  ShoppingBag,
  CheckCircle2,
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
import { useCart } from "@/context/CartContext";

export default function TesteEneagramaPage() {
  const { addItem, openDrawer } = useCart();
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
    imagem_url?: string | null;
    rota_teste?: string | null;
    orientacoes_pre_teste?: string | null;
    inclui_laudo_pdf?: boolean;
  } | null>(null);

  const [etapa, setEtapa] = useState<"intro" | "teste" | "resultado">("intro");
  const [afirmacaoAtualIndex, setAfirmacaoAtualIndex] = useState(0);
  const [respostas, setRespostas] = useState<Record<string, number>>({});
  const [modalRelatorioAberto, setModalRelatorioAberto] = useState(false);

  useEffect(() => {
    async function carregarStatus() {
      try {
        setLoadingAuth(true);
        const res = await fetch("/api/testes/credito?slug=teste-eneagrama", { cache: "no-store" });
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
        console.error("Erro ao verificar créditos do Eneagrama:", err);
      } finally {
        setLoadingAuth(false);
      }
    }
    carregarStatus();
  }, []);

  const totalQuestoes = AFIRMACOES_ENEAGRAMA.length;
  const afirmacaoAtual: EneagramaStatement = AFIRMACOES_ENEAGRAMA[afirmacaoAtualIndex];
  const notaAtual = respostas[afirmacaoAtual?.id];

  const resultadoCalculado: ResultadoEneagramaCalculado =
    calcularResultadoEneagrama(respostas);

  const precoExibicao = produtoTeste
    ? produtoTeste.preco_promocional ?? produtoTeste.preco ?? 67
    : 67;

  const precoFormatado = precoExibicao <= 0 ? "Acesso Livre" : `R$ ${precoExibicao.toFixed(2).replace(".", ",")}`;


  const handleComprarTeste = () => {
    if (produtoTeste) {
      addItem({
        id: produtoTeste.id,
        slug: produtoTeste.slug || "teste-eneagrama",
        nome: produtoTeste.nome || "Teste de Personalidade do Eneagrama",
        preco: precoExibicao,
        imagem_url: produtoTeste.imagem_url,
        is_teste: true,
        rota_teste: produtoTeste.rota_teste || "/teste-eneagrama",
      });
      openDrawer();
    } else {
      window.location.href = "/produtos/teste-eneagrama";
    }
  };

  const handleSelecionarNota = (nota: number) => {
    setRespostas((prev) => ({
      ...prev,
      [afirmacaoAtual.id]: nota,
    }));

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
        .catch((err) => console.error("Erro ao registrar avaliação do Eneagrama:", err));
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
    if (creditosRestantes <= 0) {
      handleComprarTeste();
      return;
    }
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
          /* Card para Usuário Não Autenticado: Apresentação + CTA de Compra / Login */
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-[#E8DEC8]/20 border border-[#E8DEC8] text-center max-w-2xl mx-auto relative overflow-hidden">
            <div className="w-16 h-16 rounded-full bg-[#7D8C6E]/15 text-[#7D8C6E] flex items-center justify-center mx-auto mb-6 border border-[#7D8C6E]/30">
              <Lock className="w-8 h-8" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-light text-[#1A3C4D] mb-3">
              Avaliação de Personalidade do Eneagrama
            </h2>

            <p className="text-sm sm:text-base text-[#1A3C4D]/75 font-light leading-relaxed mb-6">
              Para mapear seu Tipo Dominante com precisão, acessar seu dossiê comportamental e emitir seu{" "}
              <strong>Laudo Diagnóstico Completo em PDF personalizado</strong> no INstituto Kalapa, adquira sua avaliação abaixo:
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
                  <span><strong>Laudo Clínico em PDF A4:</strong> Documento visual completo pronto para download ou impressão.</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleComprarTeste}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#7D8C6E] text-white text-sm font-medium hover:bg-[#6C7B5D] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Comprar Avaliação ({precoFormatado})</span>
              </button>
              <Link
                href="/login?redirect=/teste-eneagrama"
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
            <div className="w-16 h-16 rounded-full bg-[#7D8C6E]/15 text-[#7D8C6E] flex items-center justify-center mx-auto mb-6 border border-[#7D8C6E]/30">
              <ShoppingBag className="w-8 h-8" />
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#7D8C6E]/15 text-[#7D8C6E] mb-3">
              Crédito de Avaliação Necessário
            </span>

            <h2 className="text-2xl sm:text-3xl font-serif font-light text-[#1A3C4D] mb-3">
              Olá, {usuario.nome}
            </h2>

            <p className="text-sm sm:text-base text-[#1A3C4D]/75 font-light leading-relaxed mb-6">
              Você ainda não possui créditos disponíveis para iniciar o teste do Eneagrama. Para desbloquear o questionário e emitir seu Laudo Diagnóstico Completo em PDF, adquira sua avaliação abaixo:
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
                  <span>Acesso liberado imediatamente</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#7D8C6E] shrink-0" />
                  <span>45 Afirmações com análise analítica</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#7D8C6E] shrink-0" />
                  <span>Laudo Clínico em PDF A4</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#7D8C6E] shrink-0" />
                  <span>Histórico permanente em sua conta</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleComprarTeste}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#7D8C6E] text-white text-sm font-medium hover:bg-[#6C7B5D] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
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
        ) : (
          <>
            {/* ETAPA 1: INTRODUÇÃO E INSTRUÇÕES (COM CRÉDITO DISPONÍVEL) */}
            {etapa === "intro" && (
              <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-[#E8DEC8]/20 border border-[#E8DEC8] text-center max-w-3xl mx-auto relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#7D8C6E]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#B8965A]/5 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4" />

                <div className="relative">
                  {/* Badge de Créditos Disponíveis */}
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-medium mb-5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>
                      Você possui <strong>{creditosRestantes} crédito{creditosRestantes > 1 ? "s" : ""}</strong> disponível{creditosRestantes > 1 ? "is" : ""} para esta avaliação
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-1 text-xs text-[#7D8C6E] font-semibold uppercase tracking-wider mb-2">
                    <Clock className="w-4 h-4" /> Duração estimada: ~6 a 8 minutos
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-serif text-[#1A3C4D] mb-4">
                    Instruções para o Teste
                  </h2>

                  {/* Box de Orientações Customizadas do Admin ou Padrão */}
                  {produtoTeste?.orientacoes_pre_teste ? (
                    <div className="p-4 rounded-xl bg-[#F8F4ED] border border-[#E8DEC8] text-left mb-6 text-sm text-[#1A3C4D]/85 leading-relaxed">
                      <p className="font-semibold text-[#1A3C4D] mb-1">Orientações do INstituto Kalapa:</p>
                      <p className="whitespace-pre-line">{produtoTeste.orientacoes_pre_teste}</p>
                    </div>
                  ) : null}

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
