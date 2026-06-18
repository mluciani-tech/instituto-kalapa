"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode, CreditCard, ShieldCheck, Check, Sparkles } from "lucide-react";

interface DadosInscricao {
  nome: string;
  email: string;
  telefone: string;
  motivacao: string;
}

const metodosPagamento = [
  {
    id: "pix",
    nome: "Pix",
    descricao: "Aprovação instantânea",
    icone: <QrCode className="w-6 h-6" />,
  },
  {
    id: "cartao",
    nome: "Cartão de Crédito",
    descricao: "Até 12x sem juros",
    icone: <CreditCard className="w-6 h-6" />,
  },
];

export default function Checkout() {
  const [dadosInscricao, setDadosInscricao] = useState<DadosInscricao | null>(null);
  const [loading, setLoading] = useState(true);
  const [metodoSelecionado, setMetodoSelecionado] = useState("pix");
  const [processando, setProcessando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("dados_inscricao");
      if (saved) {
        setDadosInscricao(JSON.parse(saved));
      }
      setLoading(false);
    }
  }, []);

  const handleFinalizarPagamento = async () => {
    setProcessando(true);

    // Se não houver dados no sessionStorage (ex: acesso direto), usamos dados padrão
    const payload = dadosInscricao || {
      nome: "Participante",
      email: "contato@institutokalapa.com.br",
      telefone: "Não informado",
      motivacao: "Acesso direto ao checkout",
    };

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...payload,
          metodoPagamento: metodoSelecionado,
          valor: 97,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSucesso(true);
        sessionStorage.removeItem("dados_inscricao");
      } else {
        alert("Ocorreu um erro ao processar o e-mail. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro no checkout:", error);
      alert("Erro de conexão. Tente novamente.");
    } finally {
      setProcessando(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-charcoal flex items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-brand-mint border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <section className="relative min-h-screen py-20 bg-brand-charcoal overflow-hidden flex items-center justify-center">
      {/* Background cinematográfico */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-charcoal via-brand-purple-deep/30 to-brand-charcoal" />
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_30%_50%,#CC6223_1px,transparent_1px)] bg-[length:30px_30px]" />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 md:px-8">
        {/* Cabeçalho */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-terracotta/20 text-brand-terracotta text-sm font-semibold tracking-wide mb-4">
            <ShieldCheck className="w-4 h-4" />
            Pagamento Seguro
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight max-w-2xl mx-auto font-sans">
            Garanta seu <span className="text-gradient">ingresso</span> para a próxima sessão
          </h2>
          <p className="mt-3 text-white/50 text-base max-w-xl mx-auto">
            Processamento rápido e seguro via InfinitePay. Escolha o melhor método.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {sucesso ? (
            <motion.div
              key="success-checkout"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card rounded-2xl p-8 md:p-12 text-center max-w-2xl mx-auto border border-brand-mint/30 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-4 right-4 text-brand-mint/40 animate-pulse">
                <Sparkles className="w-8 h-8" />
              </div>
              
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-brand-mint/20 flex items-center justify-center shadow-lg">
                <Check className="w-10 h-10 text-brand-mint" />
              </div>
              
              <h3 className="text-3xl font-bold text-white mb-4">
                Pagamento Confirmado!
              </h3>
              <p className="text-white/80 text-lg mb-4">
                Seja bem-vindo(a) ao grupo, <span className="text-brand-mint font-semibold">{dadosInscricao?.nome || "Participante"}</span>.
              </p>
              <p className="text-white/50 text-sm leading-relaxed max-w-md mx-auto mb-8">
                Sua vaga está garantida. Enviamos a notificação de confirmação de inscrição para <strong className="text-white/70">contato@institutokalapa.com.br</strong>. Nossa equipe entrará em contato com você pelo WhatsApp em breve.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => router.push("/")}
                  className="px-6 py-3 bg-white/10 hover:bg-white/15 text-white text-sm font-medium rounded-xl transition-all duration-200 border border-white/10 hover:border-white/20"
                >
                  Voltar para Home
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="active-checkout"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid md:grid-cols-2 gap-8"
            >
              {/* Lado esquerdo — Detalhes do ingresso */}
              <div className="flex flex-col justify-between glass-card rounded-2xl p-8 md:p-10">
                <div>
                  <div className="mb-6">
                    <span className="text-brand-mint text-sm font-semibold tracking-wider uppercase flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-mint animate-pulse" />
                      {dadosInscricao ? `Inscrição ativa para ${dadosInscricao.nome}` : "Ingresso Selecionado"}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mt-2 font-sans">
                      Sessão Terapêutica em Grupo
                    </h3>
                    <p className="text-white/50 mt-2 leading-relaxed">
                      1 encontro a cada 15 dias · Duração de 2h · Grupos reduzidos
                    </p>
                  </div>

                  <div className="border-t border-white/10 pt-6">
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-5xl md:text-6xl font-bold text-white">
                        R$ 97
                      </span>
                      <span className="text-white/40 text-lg">/ sessão</span>
                    </div>
                    <p className="text-white/50 text-sm">
                      Valor por participante. Você pode participar de sessões avulsas ou fazer parte do grupo contínuo.
                    </p>
                  </div>
                </div>

                <ul className="mt-8 space-y-3">
                  {[
                    "Acesso à sessão em grupo ao vivo",
                    "Material de apoio pós-sessão",
                    "Grupo de WhatsApp para suporte entre encontros",
                    "Condições especiais para pacotes mensais",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-white/70 text-sm">
                      <Check className="w-4 h-4 text-brand-mint flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Lado direito — Métodos de pagamento */}
              <div className="glass-card rounded-2xl p-8 md:p-10 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-6">
                    Forma de pagamento
                  </h3>

                  {/* Seleção de método */}
                  <div className="space-y-3 mb-8">
                    {metodosPagamento.map((metodo) => (
                      <button
                        key={metodo.id}
                        onClick={() => setMetodoSelecionado(metodo.id)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                          metodoSelecionado === metodo.id
                            ? "border-brand-mint bg-brand-mint/10"
                            : "border-white/10 hover:border-white/20 hover:bg-white/5"
                        }`}
                      >
                        <div
                          className={`${
                            metodoSelecionado === metodo.id
                              ? "text-brand-mint"
                              : "text-white/40"
                          }`}
                        >
                          {metodo.icone}
                        </div>
                        <div className="text-left">
                          <div className="text-white font-medium">{metodo.nome}</div>
                          <div className="text-white/40 text-sm">{metodo.descricao}</div>
                        </div>
                        <div className="ml-auto">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                              metodoSelecionado === metodo.id
                                ? "border-brand-mint"
                                : "border-white/20"
                            }`}
                          >
                            {metodoSelecionado === metodo.id && (
                              <div className="w-2.5 h-2.5 rounded-full bg-brand-mint" />
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Parcelamento (apenas cartão) */}
                  {metodoSelecionado === "cartao" && (
                    <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
                      <label className="text-white/60 text-sm block mb-2">
                        Parcelamento
                      </label>
                      <select className="w-full bg-transparent text-white border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-mint transition-colors appearance-none cursor-pointer">
                        <option value="1" className="bg-brand-charcoal">1x de R$ 97,00</option>
                        <option value="2" className="bg-brand-charcoal">2x de R$ 48,50</option>
                        <option value="3" className="bg-brand-charcoal">3x de R$ 32,33</option>
                        <option value="4" className="bg-brand-charcoal">4x de R$ 24,25</option>
                        <option value="6" className="bg-brand-charcoal">6x de R$ 16,17</option>
                        <option value="12" className="bg-brand-charcoal">12x de R$ 8,08</option>
                      </select>
                    </div>
                  )}
                </div>

                <div>
                  <button
                    onClick={handleFinalizarPagamento}
                    disabled={processando}
                    className="w-full py-4 bg-brand-terracotta hover:bg-brand-terracotta-dark text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-brand-terracotta/25 hover:shadow-brand-terracotta/40 cursor-pointer disabled:opacity-50 text-sm md:text-base"
                  >
                    {processando ? "Processando..." : "Finalizar Pagamento — R$ 97,00"}
                  </button>

                  {dadosInscricao && (
                    <p className="text-white/30 text-center text-[10px] mt-2">
                      Inscrição de: {dadosInscricao.nome} ({dadosInscricao.email})
                    </p>
                  )}

                  <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-white/30" />
                    <span className="text-white/30 text-sm tracking-wide">
                      Processamento seguro por{" "}
                      <strong className="text-white/50">InfinitePay</strong>
                    </span>
                  </div>

                  <div className="mt-6 flex items-center justify-center gap-6 text-white/20 text-xs">
                    <span>SSL Criptografado</span>
                    <span>Dados Protegidos</span>
                    <span>LGPD</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
