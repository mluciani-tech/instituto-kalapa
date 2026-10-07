"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Heart,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Clock,
  ArrowLeft,
  Lock,
  UserCheck,
  BookOpen,
  ShoppingBag,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import {
  LEALDADES_PERGUNTAS,
} from "./data/lealdades-data";
import {
  calcularResultadoLealdades,
  ResultadoLealdadesCalculado,
} from "./lib/calculo-lealdades";
import LealdadesProgressIndicator from "./components/LealdadesProgressIndicator";
import LealdadesQuestionCard from "./components/LealdadesQuestionCard";
import LealdadesResultView from "./components/LealdadesResultView";
import LealdadesReportModal from "./components/LealdadesReportModal";
import Footer from "../components/Footer";
import TestShareMenu from "../components/TestShareMenu";
import { useCart } from "@/context/CartContext";

export default function TesteLealdadesPage() {
  const { clearCart, addItem, openDrawer } = useCart();
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [usuario, setUsuario] = useState<{
    id: string;
    nome: string;
    email?: string;
  } | null>(null);
  const [creditosRestantes, setCreditosRestantes] = useState<number>(0);
  const [produtoTeste, setProdutoTeste] = useState<any>(null);

  const [etapa, setEtapa] = useState<"intro" | "teste" | "resultado">("intro");
  const [perguntaAtualIndex, setPerguntaAtualIndex] = useState(0);
  const [respostas, setRespostas] = useState<Record<number, string>>({});
  const [modalRelatorioAberto, setModalRelatorioAberto] = useState(false);
  const [verificandoManual, setVerificandoManual] = useState(false);

  const carregarStatus = useCallback(async (isManual = false) => {
    try {
      if (isManual) setVerificandoManual(true);
      else if (!usuario) setLoadingAuth(true);

      const res = await fetch("/api/testes/credito?slug=teste-lealdades-invisiveis", {
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
    } catch (err) {
      console.error("Erro ao verificar auth/créditos", err);
    } finally {
      setLoadingAuth(false);
      setVerificandoManual(false);
    }
  }, [usuario]);

  useEffect(() => {
    carregarStatus();
  }, [carregarStatus]);

  const temAcesso = creditosRestantes > 0;

  const handleComprar = () => {
    if (!produtoTeste) return;
    clearCart();
    addItem({
      id: produtoTeste.id,
      nome: produtoTeste.nome,
      preco: produtoTeste.preco_promocional ?? produtoTeste.preco,
      slug: produtoTeste.slug,
      tipo: "teste",
      imagem_url: produtoTeste.imagem_url,
    });
    openDrawer();
  };

  const iniciarTeste = () => {
    setEtapa("teste");
    setPerguntaAtualIndex(0);
    setRespostas({});
  };

  const handleResponder = async (letra: string) => {
    const novasRespostas = { ...respostas, [perguntaAtualIndex]: letra };
    setRespostas(novasRespostas);

    if (perguntaAtualIndex < LEALDADES_PERGUNTAS.length - 1) {
      setTimeout(() => {
        setPerguntaAtualIndex(perguntaAtualIndex + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 300);
    } else {
      // Fim do teste
      try {
        const resultadoCalc = calcularResultadoLealdades(novasRespostas);
        // Salvar resultado via API
        await fetch("/api/teste-lealdades-invisiveis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            respostas: novasRespostas,
            resultadoCalculado: resultadoCalc,
          }),
        });
        setEtapa("resultado");
        window.scrollTo({ top: 0, behavior: "smooth" });
        carregarStatus(true);
      } catch (err) {
        console.error("Erro ao salvar resultado", err);
        setEtapa("resultado");
      }
    }
  };

  const resultadoCalculado = etapa === "resultado" ? calcularResultadoLealdades(respostas) : null;

  return (
    <div className="min-h-screen bg-[#FDFBF7] selection:bg-[#B8965A]/20 selection:text-[#1A3C4D] flex flex-col">
      <main className="flex-1 pb-20">
        
        {/* Intro */}
        {etapa === "intro" && (
          <div className="animate-fadeIn">
            <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden px-4">
              <div className="absolute inset-0 bg-[#1A3C4D]">
                <Image src="/images/padrao-kalapa.png" alt="Padrão Kalapa" fill className="object-cover opacity-5 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#1A3C4D]/50 via-transparent to-[#FDFBF7]" />
              </div>
              <div className="max-w-4xl mx-auto relative z-10 text-center">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#B8965A]/10 text-[#E8DEC8] text-sm font-semibold tracking-wider uppercase mb-8 border border-[#B8965A]/20">
                  <Heart className="w-4 h-4 text-[#B8965A]" />
                  A Sabedoria das Lealdades Invisíveis
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-serif text-white leading-tight mb-8">
                  Qual é o seu emaranhamento sistêmico?
                </h1>
                <p className="text-lg sm:text-xl text-[#E8DEC8]/80 font-light max-w-3xl mx-auto mb-12 leading-relaxed">
                  Descubra o padrão que atua na sua história. Mapeie as lealdades inconscientes que influenciam silenciosamente suas escolhas.
                </p>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 max-w-2xl mx-auto mb-12">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-[#B8965A]" />
                    <div className="text-left">
                      <p className="text-white/60 text-xs uppercase tracking-wider font-semibold">Tempo Est.</p>
                      <p className="text-white font-medium">~5 min</p>
                    </div>
                  </div>
                  <div className="hidden sm:block w-px h-12 bg-white/10" />
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-[#B8965A]" />
                    <div className="text-left">
                      <p className="text-white/60 text-xs uppercase tracking-wider font-semibold">Questões</p>
                      <p className="text-white font-medium">6 Situações Existenciais</p>
                    </div>
                  </div>
                  <div className="hidden sm:block w-px h-12 bg-white/10" />
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-[#B8965A]" />
                    <div className="text-left">
                      <p className="text-white/60 text-xs uppercase tracking-wider font-semibold">Validade</p>
                      <p className="text-white font-medium">Vitalício</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4 relative z-20">
                  {loadingAuth ? (
                    <div className="flex items-center gap-3 text-white/50 bg-white/5 px-8 py-4 rounded-full border border-white/10">
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
                      <span className="text-sm font-medium">Verificando acesso...</span>
                    </div>
                  ) : temAcesso ? (
                    <div className="flex flex-col items-center gap-4">
                      <button
                        onClick={iniciarTeste}
                        className="bg-[#B8965A] hover:bg-[#A3854F] text-white px-10 py-4 rounded-full text-base font-bold transition-all shadow-[0_0_40px_rgba(184,150,90,0.3)] hover:shadow-[0_0_60px_rgba(184,150,90,0.4)] flex items-center gap-3 group cursor-pointer"
                      >
                        Iniciar Diagnóstico Sistêmico
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                      <p className="text-sm text-white/60">
                        Você tem <strong className="text-white">{creditosRestantes}</strong> crédito(s) disponível(is)
                      </p>
                    </div>
                  ) : (
                    <div className="bg-white rounded-[2rem] p-6 sm:p-8 max-w-md w-full shadow-2xl mx-auto text-left">
                      <div className="flex items-center gap-3 text-[#1A3C4D] mb-6">
                        <div className="w-12 h-12 rounded-full bg-[#B8965A]/10 flex items-center justify-center shrink-0">
                          <Lock className="w-6 h-6 text-[#B8965A]" />
                        </div>
                        <div>
                          <h3 className="font-serif text-xl font-medium">Acesso Fechado</h3>
                          <p className="text-sm text-[#1A3C4D]/60 font-light">
                            {usuario ? "Você não possui créditos para este teste." : "Faça login ou adquira seu acesso."}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3 mb-8">
                        {produtoTeste?.preco != null && (
                          <div className="flex items-center justify-between p-4 rounded-2xl border border-[#E8DEC8] bg-[#FDFBF7]">
                            <span className="text-sm text-[#1A3C4D]/70">Valor do Investimento</span>
                            <div className="text-right">
                              {produtoTeste.preco_promocional ? (
                                <>
                                  <span className="text-xs text-[#1A3C4D]/40 line-through mr-2">
                                    R$ {produtoTeste.preco.toFixed(2).replace(".", ",")}
                                  </span>
                                  <span className="text-lg font-serif font-bold text-[#1A3C4D]">
                                    R$ {produtoTeste.preco_promocional.toFixed(2).replace(".", ",")}
                                  </span>
                                </>
                              ) : (
                                <span className="text-lg font-serif font-bold text-[#1A3C4D]">
                                  R$ {produtoTeste.preco.toFixed(2).replace(".", ",")}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                        <div className="flex items-start gap-2 text-xs text-[#1A3C4D]/60 p-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Inclui Mapa de Cura Sistêmica completo em PDF com exercícios somáticos e falas de cura.</span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch gap-3">
                        <button
                          onClick={handleComprar}
                          className="flex-1 bg-[#1A3C4D] hover:bg-[#15313F] text-white px-6 py-3.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          Adquirir Acesso
                        </button>
                        {!usuario && (
                          <Link
                            href={`/login?callbackUrl=/teste-lealdades-invisiveis`}
                            className="flex-1 bg-white hover:bg-[#F8F4ED] text-[#1A3C4D] px-6 py-3.5 rounded-xl text-sm font-semibold transition-all border border-[#E8DEC8] flex items-center justify-center gap-2"
                          >
                            <UserCheck className="w-4 h-4" />
                            Já tenho conta
                          </Link>
                        )}
                      </div>

                      {usuario && (
                        <button
                          onClick={() => carregarStatus(true)}
                          disabled={verificandoManual}
                          className="w-full mt-4 flex items-center justify-center gap-2 text-xs text-[#1A3C4D]/50 hover:text-[#B8965A] transition-colors py-2"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${verificandoManual ? "animate-spin" : ""}`} />
                          {verificandoManual ? "Atualizando..." : "Já comprei e quero atualizar"}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Teste - Wizard */}
        {etapa === "teste" && (
          <div className="pt-24 pb-20 px-4 animate-fadeIn">
            <LealdadesProgressIndicator 
              atual={perguntaAtualIndex} 
              total={LEALDADES_PERGUNTAS.length} 
              onReiniciar={iniciarTeste} 
            />
            
            <LealdadesQuestionCard 
              questao={LEALDADES_PERGUNTAS[perguntaAtualIndex]}
              onResponder={handleResponder}
            />
          </div>
        )}

        {/* Resultado */}
        {etapa === "resultado" && resultadoCalculado && (
          <div className="pt-24 pb-20 px-4">
            <LealdadesResultView 
              resultado={resultadoCalculado}
              onAbrirRelatorio={() => setModalRelatorioAberto(true)}
            />
          </div>
        )}
      </main>

      <Footer />

      {etapa === "resultado" && resultadoCalculado && (
        <LealdadesReportModal 
          isOpen={modalRelatorioAberto}
          onClose={() => setModalRelatorioAberto(false)}
          resultado={resultadoCalculado}
        />
      )}
    </div>
  );
}
