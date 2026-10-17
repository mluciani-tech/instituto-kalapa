"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  Lock,
  UserCheck,
  BookOpen,
  ShoppingBag,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { obterCartaPorId } from "./data/metamorfose-data";
import {
  EstadoJornadaMetamorfose,
  ESTADO_INICIAL_JORNADA,
  CATEGORIAS_TEMA_LABELS,
  calcularResultadoMetamorfose,
} from "./lib/calculo-metamorfose";
import MetamorfoseProgressHeader from "./components/MetamorfoseProgressHeader";
import MetamorfoseThemeStep from "./components/MetamorfoseThemeStep";
import MetamorfoseQuadrantDeck from "./components/MetamorfoseQuadrantDeck";
import MetamorfoseCardReading from "./components/MetamorfoseCardReading";
import MetamorfoseRiteOfPassage from "./components/MetamorfoseRiteOfPassage";
import MetamorfoseResultView from "./components/MetamorfoseResultView";
import MetamorfoseReportModal from "./components/MetamorfoseReportModal";
import Footer from "../components/Footer";
import { useCart } from "@/context/CartContext";
import { useRegistrarAvaliacao } from "@/lib/testes/use-registrar-avaliacao";
import { useRascunhoTeste } from "@/lib/testes/use-rascunho-teste";
import {
  RascunhoTesteNotice,
  SalvarResultadoBanner,
} from "@/components/testes/TesteStatusNotices";

interface ProdutoTeste {
  id: string;
  nome: string;
  slug: string;
  preco: number;
  preco_promocional?: number | null;
  categoria?: string | null;
  imagem_url?: string | null;
  rota_teste?: string | null;
}

type SubfaseQuadrante = "sorteio" | "leitura" | "rito";

export default function TesteMetamorfosePage() {
  const { clearCart, addItem } = useCart();
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [usuario, setUsuario] = useState<{
    id: string;
    nome: string;
    email?: string;
  } | null>(null);
  const [creditosRestantes, setCreditosRestantes] = useState<number>(0);
  const [produtoTeste, setProdutoTeste] = useState<ProdutoTeste | null>(null);

  const [etapa, setEtapa] = useState<"intro" | "teste" | "resultado">("intro");
  const [quadranteAtual, setQuadranteAtual] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [subfase, setSubfase] = useState<SubfaseQuadrante>("sorteio");
  const [estadoJornada, setEstadoJornada] = useState<EstadoJornadaMetamorfose>(
    ESTADO_INICIAL_JORNADA
  );

  const [dataRealizacao, setDataRealizacao] = useState<string | null>(null);
  const [modalRelatorioAberto, setModalRelatorioAberto] = useState(false);
  const [verificandoManual, setVerificandoManual] = useState(false);

  const onAvaliacaoSalva = useCallback(
    () => setCreditosRestantes((prev) => Math.max(0, prev - 1)),
    []
  );

  const {
    registrar: registrarAvaliacao,
    tentarNovamente: tentarSalvarNovamente,
    salvando: salvandoResultado,
    erro: erroSalvarResultado,
  } = useRegistrarAvaliacao({
    endpoint: "/api/teste-metamorfose",
    onSalvo: onAvaliacaoSalva,
  });

  const {
    rascunho,
    salvar: salvarRascunho,
    limpar: limparRascunho,
  } = useRascunhoTeste<EstadoJornadaMetamorfose>(
    "teste-metamorfose",
    usuario?.id
  );

  // Autosave do rascunho durante a jornada
  useEffect(() => {
    if (etapa === "teste") {
      salvarRascunho(estadoJornada, quadranteAtual);
    }
  }, [etapa, estadoJornada, quadranteAtual, salvarRascunho]);

  const continuarRascunho = () => {
    if (!rascunho) return;
    setEstadoJornada(rascunho.respostas);
    const qSalvo = Math.min(4, Math.max(0, rascunho.indice)) as 0 | 1 | 2 | 3 | 4;
    setQuadranteAtual(qSalvo);
    if (qSalvo >= 1 && rascunho.respostas?.cartasSorteadas?.[qSalvo as 1 | 2 | 3 | 4]) {
      setSubfase("leitura");
    } else {
      setSubfase("sorteio");
    }
    setEtapa("teste");
  };

  const carregarStatus = useCallback(
    async (isManual = false) => {
      try {
        if (isManual) setVerificandoManual(true);
        else if (!usuario) setLoadingAuth(true);

        const params =
          typeof window !== "undefined"
            ? new URLSearchParams(window.location.search)
            : null;
        const isVisualizar = params?.get("visualizar") === "1";
        const avaliacaoId = params?.get("avaliacao_id");

        let url = "/api/testes/credito?slug=teste-metamorfose";
        if (avaliacaoId) {
          url += `&avaliacao_id=${encodeURIComponent(avaliacaoId)}`;
        }

        const res = await fetch(url, { cache: "no-store" });
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

        if (data?.ultimaAvaliacao) {
          const dataIso = data.ultimaAvaliacao.created_at;
          const dataFormatada = dataIso
            ? new Intl.DateTimeFormat("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }).format(new Date(dataIso))
            : null;
          setDataRealizacao(dataFormatada);

          if (creditos === 0 || isVisualizar) {
            if (data.ultimaAvaliacao.respostas) {
              setEstadoJornada(data.ultimaAvaliacao.respostas);
              setEtapa("resultado");
            }
          }
        }

        if (
          params &&
          (params.get("iniciar") === "1" || params.get("sucesso") === "1") &&
          creditos > 0
        ) {
          setEtapa("teste");
          setQuadranteAtual(0);
        }
      } catch (err) {
        console.error("Erro ao verificar auth/créditos Metamorfose:", err);
      } finally {
        setLoadingAuth(false);
        setVerificandoManual(false);
      }
    },
    [usuario]
  );

  useEffect(() => {
    carregarStatus();
  }, [carregarStatus]);

  const temAcesso = creditosRestantes > 0;

  const handleComprar = () => {
    clearCart();
    addItem({
      id: produtoTeste?.id || "teste-metamorfose",
      nome:
        produtoTeste?.nome ||
        "Jogo Sistêmico — A Metamorfose da Consciência",
      preco: produtoTeste?.preco_promocional ?? produtoTeste?.preco ?? 67,
      slug: produtoTeste?.slug || "teste-metamorfose",
      is_teste: true,
      categoria: "testes",
      rota_teste: "/teste-metamorfose",
      imagem_url: produtoTeste?.imagem_url,
    });
    if (produtoTeste?.id) {
      sessionStorage.setItem("produto_selecionado", produtoTeste.id);
    }
    window.location.href = "/checkout";
  };

  const iniciarJornada = () => {
    if (creditosRestantes <= 0) {
      handleComprar();
      return;
    }
    limparRascunho();
    setEstadoJornada(ESTADO_INICIAL_JORNADA);
    setQuadranteAtual(0);
    setSubfase("sorteio");
    setDataRealizacao(null);
    setEtapa("teste");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelecionarCarta = (
    qId: 1 | 2 | 3 | 4,
    cartaId: string
  ) => {
    setEstadoJornada((prev) => ({
      ...prev,
      cartasSorteadas: {
        ...prev.cartasSorteadas,
        [qId]: cartaId,
      },
    }));
    setSubfase("leitura");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTrocarCartaNoQuadrante = (qId: 1 | 2 | 3 | 4) => {
    setEstadoJornada((prev) => {
      const novas = { ...prev.cartasSorteadas };
      delete novas[qId];
      return {
        ...prev,
        cartasSorteadas: novas,
      };
    });
    setSubfase("sorteio");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleConcluirRitoDePassagem = (qId: 1 | 2 | 3 | 4) => {
    if (qId < 4) {
      const proximoQ = (qId + 1) as 2 | 3 | 4;
      setQuadranteAtual(proximoQ);
      setSubfase(
        estadoJornada.cartasSorteadas[proximoQ] ? "leitura" : "sorteio"
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Finalizou os 4 quadrantes!
      const resultadoCalc = calcularResultadoMetamorfose(estadoJornada);
      if (usuario && resultadoCalc) {
        void registrarAvaliacao({
          respostas: estadoJornada,
          resultadoCalculado: resultadoCalc,
        });
      }
      limparRascunho();
      setEtapa("resultado");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const resultadoCalculado =
    etapa === "resultado"
      ? calcularResultadoMetamorfose(estadoJornada)
      : null;

  const cartaQuadranteAtual =
    quadranteAtual >= 1
      ? estadoJornada.cartasSorteadas[quadranteAtual as 1 | 2 | 3 | 4]
        ? obterCartaPorId(
            estadoJornada.cartasSorteadas[quadranteAtual as 1 | 2 | 3 | 4]!
          )
        : undefined
      : undefined;

  const qtdCartasRascunho = rascunho?.respostas?.cartasSorteadas
    ? Object.keys(rascunho.respostas.cartasSorteadas).length
    : 0;

  return (
    <div className="min-h-screen bg-[#FDFBF7] selection:bg-[#B8965A]/20 selection:text-[#1A3C4D] flex flex-col">
      <main className="flex-1 pb-20">
        {/* ===================================================== */}
        {/* TELA DE INTRODUÇÃO & PORTAL DO JOGO */}
        {/* ===================================================== */}
        {etapa === "intro" && (
          <div className="animate-fadeIn">
            <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden px-4">
              <div className="absolute inset-0 bg-[#1A3C4D]">
                <Image
                  src="/images/padrao-kalapa.png"
                  alt="Padrão Kalapa"
                  fill
                  className="object-cover opacity-5 mix-blend-overlay"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#1A3C4D]/50 via-transparent to-[#FDFBF7]" />
              </div>

              <div className="max-w-4xl mx-auto relative z-10 text-center">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#B8965A]/15 text-[#E8DEC8] text-xs sm:text-sm font-semibold tracking-wider uppercase mb-8 border border-[#B8965A]/30">
                  <Sparkles className="w-4 h-4 text-[#B8965A]" />
                  Vivência Sistêmica Interativa • 80 Cartas Fenomenológicas
                </span>

                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-serif text-white leading-tight mb-6">
                  Jogo Sistêmico — A Metamorfose da Consciência
                </h1>

                <p className="text-lg sm:text-xl text-[#E8DEC8]/85 font-light max-w-3xl mx-auto mb-10 leading-relaxed">
                  Unindo os quatro estágios da metamorfose da borboleta (<strong>O Ovo, A Lagarta, A Crisálida e A Borboleta</strong>) às ordens sistêmicas de Bert Hellinger, Jan Jacob Stam e Joan Garriga, investigue a matriz oculta do seu projeto, carreira ou decisão.
                </p>

                {/* Métricas do Jogo */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 max-w-2xl mx-auto mb-12">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-[#B8965A]" />
                    <div className="text-left">
                      <p className="text-white/60 text-xs uppercase tracking-wider font-semibold">
                        Tempo Est.
                      </p>
                      <p className="text-white font-medium">~15 min</p>
                    </div>
                  </div>
                  <div className="hidden sm:block w-px h-12 bg-white/10" />
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-[#B8965A]" />
                    <div className="text-left">
                      <p className="text-white/60 text-xs uppercase tracking-wider font-semibold">
                        Estrutura
                      </p>
                      <p className="text-white font-medium">
                        4 Quadrantes • 80 Cartas
                      </p>
                    </div>
                  </div>
                  <div className="hidden sm:block w-px h-12 bg-white/10" />
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-[#B8965A]" />
                    <div className="text-left">
                      <p className="text-white/60 text-xs uppercase tracking-wider font-semibold">
                        Entregável
                      </p>
                      <p className="text-white font-medium">
                        Dossiê PDF (6 Págs A4)
                      </p>
                    </div>
                  </div>
                </div>

                {rascunho && etapa === "intro" && (
                  <div className="max-w-2xl mx-auto mb-8 text-left">
                    <RascunhoTesteNotice
                      respondidas={qtdCartasRascunho}
                      total={4}
                      onContinuar={continuarRascunho}
                      onRecomecar={limparRascunho}
                    />
                  </div>
                )}

                {/* Box de Acesso / Compra */}
                <div className="flex items-center justify-center gap-4 relative z-20">
                  {loadingAuth ? (
                    <div className="flex items-center gap-3 text-white/50 bg-white/5 px-8 py-4 rounded-full border border-white/10">
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
                      <span className="text-sm font-medium">
                        Verificando acesso...
                      </span>
                    </div>
                  ) : temAcesso ? (
                    <div className="flex flex-col items-center gap-4">
                      <button
                        type="button"
                        onClick={iniciarJornada}
                        className="bg-[#B8965A] hover:bg-[#A3854F] text-white px-10 py-4 rounded-full text-base font-bold transition-all shadow-[0_0_40px_rgba(184,150,90,0.3)] hover:shadow-[0_0_60px_rgba(184,150,90,0.4)] flex items-center gap-3 group cursor-pointer"
                      >
                        Iniciar Vivência Sistêmica
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                      <p className="text-sm text-white/60">
                        Você tem{" "}
                        <strong className="text-white">
                          {creditosRestantes}
                        </strong>{" "}
                        crédito(s) disponível(is)
                      </p>
                    </div>
                  ) : (
                    <div className="bg-white rounded-[2rem] p-6 sm:p-8 max-w-md w-full shadow-2xl mx-auto text-left">
                      <div className="flex items-center gap-3 text-[#1A3C4D] mb-6">
                        <div className="w-12 h-12 rounded-full bg-[#B8965A]/10 flex items-center justify-center shrink-0">
                          <Lock className="w-6 h-6 text-[#B8965A]" />
                        </div>
                        <div>
                          <h3 className="font-serif text-xl font-medium">
                            Acesso à Vivência
                          </h3>
                          <p className="text-sm text-[#1A3C4D]/60 font-light">
                            {usuario
                              ? "Você não possui créditos disponíveis para esta vivência."
                              : "Faça login ou adquira seu acesso para iniciar."}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3 mb-8">
                        <div className="flex items-center justify-between p-4 rounded-2xl border border-[#E8DEC8] bg-[#FDFBF7]">
                          <span className="text-sm text-[#1A3C4D]/70">
                            Valor do Investimento
                          </span>
                          <div className="text-right">
                            {produtoTeste?.preco_promocional ? (
                              <>
                                <span className="text-xs text-[#1A3C4D]/40 line-through mr-2">
                                  R${" "}
                                  {(produtoTeste.preco ?? 67)
                                    .toFixed(2)
                                    .replace(".", ",")}
                                </span>
                                <span className="text-lg font-serif font-bold text-[#1A3C4D]">
                                  R${" "}
                                  {produtoTeste.preco_promocional
                                    .toFixed(2)
                                    .replace(".", ",")}
                                </span>
                              </>
                            ) : (
                              <span className="text-lg font-serif font-bold text-[#1A3C4D]">
                                R${" "}
                                {(produtoTeste?.preco ?? 67)
                                  .toFixed(2)
                                  .replace(".", ",")}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-start gap-2 text-xs text-[#1A3C4D]/65 p-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>
                            Inclui sorteio intuitivo nos 4 Quadrantes, Caderno Híbrido, Ritos de Passagem e Dossiê Completo em PDF (6 páginas A4).
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch gap-3">
                        <button
                          type="button"
                          onClick={handleComprar}
                          className="flex-1 bg-[#1A3C4D] hover:bg-[#15313F] text-white px-6 py-3.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          Adquirir Acesso
                        </button>
                        {!usuario && (
                          <Link
                            href="/login?callbackUrl=/teste-metamorfose"
                            className="flex-1 bg-white hover:bg-[#F8F4ED] text-[#1A3C4D] px-6 py-3.5 rounded-xl text-sm font-semibold transition-all border border-[#E8DEC8] flex items-center justify-center gap-2"
                          >
                            <UserCheck className="w-4 h-4" />
                            Já tenho conta
                          </Link>
                        )}
                      </div>

                      {usuario && (
                        <button
                          type="button"
                          onClick={() => carregarStatus(true)}
                          disabled={verificandoManual}
                          className="w-full mt-4 flex items-center justify-center gap-2 text-xs text-[#1A3C4D]/50 hover:text-[#B8965A] transition-colors py-2 cursor-pointer"
                        >
                          <RefreshCw
                            className={`w-3.5 h-3.5 ${
                              verificandoManual ? "animate-spin" : ""
                            }`}
                          />
                          {verificandoManual
                            ? "Atualizando..."
                            : "Já comprei e quero atualizar"}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ===================================================== */}
        {/* ETAPA DE JOGO / VIVÊNCIA (TEMA + 4 QUADRANTES) */}
        {/* ===================================================== */}
        {etapa === "teste" && (
          <div className="pt-28 pb-20 px-4 animate-fadeIn">
            <MetamorfoseProgressHeader
              quadranteAtual={quadranteAtual}
              cartasSorteadas={estadoJornada.cartasSorteadas}
              temaLabel={CATEGORIAS_TEMA_LABELS[estadoJornada.categoriaTema]}
              temaDescricao={estadoJornada.temaDescricao}
              temaEmSilencio={estadoJornada.temaEmSilencio}
              onReiniciar={iniciarJornada}
            />

            {/* Etapa 1: Definição do Tema */}
            {quadranteAtual === 0 && (
              <MetamorfoseThemeStep
                categoriaTema={estadoJornada.categoriaTema}
                temaDescricao={estadoJornada.temaDescricao}
                temaEmSilencio={estadoJornada.temaEmSilencio}
                onChangeCategoria={(cat) =>
                  setEstadoJornada((prev) => ({
                    ...prev,
                    categoriaTema: cat,
                  }))
                }
                onChangeDescricao={(desc) =>
                  setEstadoJornada((prev) => ({
                    ...prev,
                    temaDescricao: desc,
                  }))
                }
                onChangeSilencio={(silencio) =>
                  setEstadoJornada((prev) => ({
                    ...prev,
                    temaEmSilencio: silencio,
                  }))
                }
                onAvancar={() => {
                  setQuadranteAtual(1);
                  setSubfase(
                    estadoJornada.cartasSorteadas[1] ? "leitura" : "sorteio"
                  );
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            )}

            {/* Quadrantes 1 a 4 */}
            {quadranteAtual >= 1 && (
              <>
                {subfase === "sorteio" && (
                  <MetamorfoseQuadrantDeck
                    quadranteId={quadranteAtual as 1 | 2 | 3 | 4}
                    onSelectCard={(cartaId) =>
                      handleSelecionarCarta(
                        quadranteAtual as 1 | 2 | 3 | 4,
                        cartaId
                      )
                    }
                  />
                )}

                {subfase === "leitura" && cartaQuadranteAtual && (
                  <MetamorfoseCardReading
                    carta={cartaQuadranteAtual}
                    anotacao={
                      estadoJornada.caderno[
                        quadranteAtual as 1 | 2 | 3 | 4
                      ] || {}
                    }
                    onChangeAnotacao={(novaAnotacao) =>
                      setEstadoJornada((prev) => ({
                        ...prev,
                        caderno: {
                          ...prev.caderno,
                          [quadranteAtual]: novaAnotacao,
                        },
                      }))
                    }
                    onTrocarCarta={() =>
                      handleTrocarCartaNoQuadrante(
                        quadranteAtual as 1 | 2 | 3 | 4
                      )
                    }
                    onIrParaRitoDePassagem={() => {
                      setSubfase("rito");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  />
                )}

                {subfase === "rito" && cartaQuadranteAtual && (
                  <MetamorfoseRiteOfPassage
                    carta={cartaQuadranteAtual}
                    onVoltarLeitura={() => {
                      setSubfase("leitura");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    onAvancarProximoQuadrante={() =>
                      handleConcluirRitoDePassagem(
                        quadranteAtual as 1 | 2 | 3 | 4
                      )
                    }
                  />
                )}
              </>
            )}
          </div>
        )}

        {/* ===================================================== */}
        {/* TELA DE SÍNTESE FINAL & EQUAÇÃO NARRATIVA */}
        {/* ===================================================== */}
        {etapa === "resultado" && resultadoCalculado && (
          <div className="pt-28 pb-20 px-4">
            <div className="max-w-4xl mx-auto mb-6">
              <SalvarResultadoBanner
                erro={erroSalvarResultado}
                salvando={salvandoResultado}
                onTentarNovamente={() => void tentarSalvarNovamente()}
              />
            </div>

            <MetamorfoseResultView
              resultado={resultadoCalculado}
              onAbrirRelatorio={() => setModalRelatorioAberto(true)}
              onReiniciar={iniciarJornada}
              onComprarNovoTeste={handleComprar}
              creditosRestantes={creditosRestantes}
              dataRealizacao={dataRealizacao}
            />
          </div>
        )}
      </main>

      <Footer />

      {etapa === "resultado" && resultadoCalculado && (
        <MetamorfoseReportModal
          isOpen={modalRelatorioAberto}
          onClose={() => setModalRelatorioAberto(false)}
          resultado={resultadoCalculado}
          dataRealizacao={dataRealizacao}
        />
      )}
    </div>
  );
}
