"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode, CreditCard, ShieldCheck, Check, ExternalLink, Package, ArrowLeft } from "lucide-react";
import type { Produto } from "@/lib/types";

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
    descricao: "Até 3x sem juros",
    icone: <CreditCard className="w-6 h-6" />,
  },
];

export default function Checkout() {
  const [produto, setProduto] = useState<Produto | null>(null);
  const [dadosInscricao, setDadosInscricao] = useState<DadosInscricao | null>(null);
  const [loading, setLoading] = useState(true);
  const [metodoSelecionado, setMetodoSelecionado] = useState("pix");
  const [processando, setProcessando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionData = typeof window !== "undefined"
          ? sessionStorage.getItem("dados_inscricao")
          : null;
        const produtoId = typeof window !== "undefined"
          ? sessionStorage.getItem("produto_selecionado")
          : null;

        if (sessionData) setDadosInscricao(JSON.parse(sessionData));

        if (produtoId) {
          const res = await fetch(`/api/produtos/${produtoId}`);
          if (res.ok) {
            const data = await res.json();
            setProduto(data);
          }
        }
      } catch {
        // Use defaults
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const formatPhoneForInfinitePay = (phone: string): string | null => {
    const numbers = phone.replace(/\D/g, "");
    if (numbers.length < 10) return null;
    if (numbers.startsWith("55")) {
      return `+${numbers}`;
    }
    return `+55${numbers}`;
  };

  const handleFinalizarPagamento = async () => {
    if (!produto) {
      setErro("Nenhum produto selecionado. Volte ao catálogo.");
      return;
    }

    setProcessando(true);
    setErro("");

    const payload = dadosInscricao || {
      nome: "Participante",
      email: "contato@institutokalapa.com.br",
      telefone: "Não informado",
      motivacao: "Acesso direto ao checkout",
    };

    try {
      // Preço e itens são montados no servidor a partir do produto_id —
      // o cliente envia apenas identificação e dados de contato
      const checkoutRes = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          produto_id: produto.id,
          customer: (() => {
            const phone = formatPhoneForInfinitePay(payload.telefone);
            const c: Record<string, string> = { name: payload.nome, email: payload.email };
            if (phone) c.phone_number = phone;
            return c;
          })(),
          inscricao: {
            ...payload,
            metodoPagamento: metodoSelecionado,
            valor: produto.preco,
          },
        }),
      });

      const checkoutData = await checkoutRes.json();

      if (!checkoutRes.ok || !checkoutData.url) {
        setErro(checkoutData.error || "Erro ao criar link de pagamento. Tente novamente.");
        setProcessando(false);
        return;
      }

      // 2. Limpar sessionStorage e redirecionar
      sessionStorage.removeItem("dados_inscricao");
      sessionStorage.removeItem("produto_selecionado");
      window.location.href = checkoutData.url;
    } catch (error) {
      console.error("Erro no checkout:", error);
      setErro("Erro de conexão. Tente novamente.");
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

  if (!produto) {
    return (
      <div className="min-h-screen bg-brand-charcoal flex items-center justify-center text-white">
        <div className="text-center">
          <Package className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Nenhum produto selecionado</h2>
          <p className="text-white/50 mb-6">Volte ao catálogo e escolha um serviço.</p>
          <a
            href="/produtos"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-terracotta hover:bg-brand-terracotta-dark text-white font-semibold rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Ver catálogo
          </a>
        </div>
      </div>
    );
  }

  const preco = produto.preco;

  return (
    <section className="relative min-h-screen py-20 bg-brand-charcoal overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-charcoal via-brand-purple-deep/30 to-brand-charcoal" />
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_30%_50%,#B8965A_1px,transparent_1px)] bg-[length:30px_30px]" />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 md:px-8">
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
            Finalizar <span className="text-gradient">compra</span>
          </h2>
          <p className="mt-3 text-white/50 text-base max-w-xl mx-auto">
            Processamento rápido e seguro via InfinitePay.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key="active-checkout"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid md:grid-cols-2 gap-8"
          >
            {/* Lado esquerdo — Detalhes do produto */}
            <div className="flex flex-col justify-between glass-card-light rounded-2xl p-8 md:p-10">
              <div>
                <div className="mb-6">
                  <span className="text-brand-mint text-sm font-semibold tracking-wider uppercase flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-mint animate-pulse" />
                    {dadosInscricao ? `Compra de ${dadosInscricao.nome}` : "Produto selecionado"}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold text-brand-charcoal mt-2 font-sans">
                    {produto.nome}
                  </h3>
                  {produto.descricao_curta && (
                    <p className="text-brand-charcoal/60 mt-2 leading-relaxed">
                      {produto.descricao_curta}
                    </p>
                  )}
                </div>

                <div className="border-t border-brand-charcoal/10 pt-6">
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-5xl md:text-6xl font-bold text-brand-charcoal">
                      R$ {preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-brand-charcoal/45 text-lg">/ sessão</span>
                  </div>
                  {produto.descricao && (
                    <p className="text-brand-charcoal/60 text-sm leading-relaxed">
                      {produto.descricao}
                    </p>
                  )}
                </div>
              </div>

              <ul className="mt-8 space-y-3">
                {produto.beneficios.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-brand-charcoal/70 text-sm">
                    <Check className="w-4 h-4 text-brand-mint flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Lado direito — Métodos de pagamento */}
            <div className="glass-card-light rounded-2xl p-8 md:p-10 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-brand-charcoal mb-6">
                  Forma de pagamento
                </h3>

                <div className="space-y-3 mb-8">
                  {metodosPagamento.map((metodo) => (
                    <button
                      key={metodo.id}
                      onClick={() => setMetodoSelecionado(metodo.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                        metodoSelecionado === metodo.id
                          ? "border-brand-mint bg-brand-mint/10"
                          : "border-brand-charcoal/10 hover:border-brand-charcoal/20 hover:bg-brand-charcoal/5"
                      }`}
                    >
                      <div
                        className={`${
                          metodoSelecionado === metodo.id
                            ? "text-brand-mint"
                            : "text-brand-charcoal/40"
                        }`}
                      >
                        {metodo.icone}
                      </div>
                      <div className="text-left">
                        <div className="text-brand-charcoal font-medium">{metodo.nome}</div>
                        <div className="text-brand-charcoal/50 text-sm">{metodo.descricao}</div>
                      </div>
                      <div className="ml-auto">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                            metodoSelecionado === metodo.id
                              ? "border-brand-mint"
                              : "border-brand-charcoal/20"
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

                {metodoSelecionado === "cartao" && (
                  <div className="mb-6 p-4 rounded-xl bg-brand-charcoal/5 border border-brand-charcoal/10">
                    <label
                      htmlFor="parcelamento"
                      className="text-brand-charcoal/60 text-sm block mb-2"
                    >
                      Parcelamento
                    </label>
                    <select
                      id="parcelamento"
                      className="w-full bg-white text-brand-charcoal border border-brand-charcoal/10 rounded-lg px-4 py-3.5 text-sm focus:outline-none focus:border-brand-mint transition-colors appearance-none cursor-pointer"
                    >
                      <option value="1">1x de R$ {preco.toFixed(2).replace(".", ",")}</option>
                      <option value="2">2x de R$ {(preco / 2).toFixed(2).replace(".", ",")}</option>
                      <option value="3">3x de R$ {(preco / 3).toFixed(2).replace(".", ",")}</option>
                    </select>
                  </div>
                )}
              </div>

              <div>
                {erro && (
                  <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                    {erro}
                  </div>
                )}

                <button
                  onClick={handleFinalizarPagamento}
                  disabled={processando}
                  className="w-full py-4 bg-brand-terracotta hover:bg-brand-terracotta-dark text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-brand-terracotta/25 hover:shadow-brand-terracotta/40 cursor-pointer disabled:opacity-50 text-sm md:text-base flex items-center justify-center gap-2"
                >
                  {processando ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Redirecionando para pagamento...
                    </>
                  ) : (
                    <>
                      Pagar com InfinitePay
                      <ExternalLink className="w-4 h-4" />
                    </>
                  )}
                </button>

                {dadosInscricao && (
                  <p className="text-brand-charcoal/40 text-center text-[10px] mt-2">
                    Compra de: {dadosInscricao.nome} ({dadosInscricao.email})
                  </p>
                )}

                <div className="mt-6 pt-6 border-t border-brand-charcoal/10 flex items-center justify-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-brand-charcoal/30" />
                  <span className="text-brand-charcoal/40 text-sm tracking-wide">
                    Processamento seguro por{" "}
                    <strong className="text-brand-charcoal/60">InfinitePay</strong>
                  </span>
                </div>

                <div className="mt-6 flex items-center justify-center gap-6 text-brand-charcoal/30 text-xs">
                  <span>SSL Criptografado</span>
                  <span>Dados Protegidos</span>
                  <span>LGPD</span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
