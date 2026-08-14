"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode, CreditCard, ShieldCheck, Check, ExternalLink, Package, ArrowLeft, CheckCircle2 } from "lucide-react";
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
    descricao: "1x à vista",
    icone: <CreditCard className="w-6 h-6" />,
  },
];

export default function Checkout() {
  const [produto, setProduto] = useState<Produto | null>(null);
  const [dadosInscricao, setDadosInscricao] = useState<DadosInscricao | null>(null);
  const [form, setForm] = useState({ nome: "", email: "", telefone: "", motivacao: "" });
  const [loading, setLoading] = useState(true);
  const [metodoSelecionado, setMetodoSelecionado] = useState("pix");
  const [processando, setProcessando] = useState(false);
  const [erro, setErro] = useState("");

  const formaPagamento = produto?.forma_pagamento_disponivel || "ambos";

  const metodosFiltrados = metodosPagamento.filter((m) => {
    if (formaPagamento === "pix") return m.id === "pix";
    if (formaPagamento === "cartao") return m.id === "cartao";
    return true;
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionData = typeof window !== "undefined"
          ? sessionStorage.getItem("dados_inscricao")
          : null;
        const produtoId = typeof window !== "undefined"
          ? sessionStorage.getItem("produto_selecionado")
          : null;

        if (sessionData) {
          const parsed = JSON.parse(sessionData);
          setDadosInscricao(parsed);
          setForm({ nome: parsed.nome || "", email: parsed.email || "", telefone: parsed.telefone || "", motivacao: parsed.motivacao || "" });
        }

        if (produtoId) {
          const res = await fetch(`/api/produtos/${produtoId}`);
          if (res.ok) {
            const data = await res.json();
            setProduto(data);

            // Ajusta método padrão conforme configuração do produto
            const forma = data.forma_pagamento_disponivel || "ambos";
            if (forma === "pix") setMetodoSelecionado("pix");
            else if (forma === "cartao") setMetodoSelecionado("cartao");
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

    const nomeTrim = form.nome.trim();
    const telefoneTrim = form.telefone.trim();

    if (!nomeTrim) {
      setErro("Informe seu nome para continuar.");
      return;
    }
    if (telefoneTrim.replace(/\D/g, "").length < 10) {
      setErro("Informe um WhatsApp válido com DDD (ex: 11912345678).");
      return;
    }

    setProcessando(true);
    setErro("");

    const payload: DadosInscricao = {
      nome: nomeTrim,
      email: form.email.trim() || "contato@institutokalapa.com.br",
      telefone: telefoneTrim,
      motivacao: form.motivacao.trim() || "Acesso direto ao checkout",
    };

    try {
      if (isGratuito) {
        // Produto gratuito — não chama InfinitePay
        const res = await fetch("/api/checkout-gratuito", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            produto_id: produto.id,
            inscricao: {
              ...payload,
              metodoPagamento: "gratuito",
              valor: 0,
            },
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setErro(data.error || "Erro ao confirmar inscrição. Tente novamente.");
          setProcessando(false);
          return;
        }

        sessionStorage.setItem("dados_inscricao", JSON.stringify(payload));
        sessionStorage.removeItem("produto_selecionado");
        window.location.href = `/checkout/sucesso?order_nsu=${data.order_nsu}`;
        return;
      }

      // Produto pago — fluxo InfinitePay
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

      // 2. Salvar dados e redirecionar
      sessionStorage.setItem("dados_inscricao", JSON.stringify(payload));
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

  const preco = produto.preco ?? 0;
  const isGratuito = preco <= 0;

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
            Finalizar compra
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
                    {isGratuito ? (
                      <span className="text-5xl md:text-6xl font-bold text-brand-mint">
                        Gratuito
                      </span>
                    ) : (
                      <>
                        <span className="text-5xl md:text-6xl font-bold text-brand-charcoal">
                          R$ {preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-brand-charcoal/45 text-lg">/ sessão</span>
                      </>
                    )}
                  </div>
                  {produto.descricao && (
                    <ul className="space-y-1 mt-2">
                      {produto.descricao.split("\n").filter((l) => l.trim()).map((linha) => (
                        <li key={linha} className="flex items-start gap-2 text-brand-charcoal/60 text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-terracotta/50 mt-1.5 flex-shrink-0" />
                          {linha}
                        </li>
                      ))}
                    </ul>
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

            {/* Lado direito — Métodos de pagamento ou confirmação gratuita */}
            <div className="glass-card-light rounded-2xl p-8 md:p-10 flex flex-col justify-between">
              {isGratuito ? (
                /* Produto gratuito — sem pagamento */
                <div className="flex flex-col justify-center text-center py-8">
                  <div className="text-center">
                    <CheckCircle2 className="w-16 h-16 text-brand-mint mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-brand-charcoal mb-2">
                      Inscrição gratuita
                    </h3>
                    <p className="text-brand-charcoal/50 text-sm mb-8 max-w-xs mx-auto">
                      Confirme seus dados para garantir sua vaga.
                    </p>
                  </div>

                  <div className="text-left">
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="text-xs font-medium text-brand-charcoal/70 block mb-1">Nome completo *</label>
                        <input
                          type="text"
                          value={form.nome}
                          onChange={(e) => setForm({ ...form, nome: e.target.value })}
                          placeholder="Seu nome"
                          className="w-full border border-brand-charcoal/15 rounded-lg px-3 py-2 text-sm focus-visible:border-brand-mint focus-visible:ring-2 focus-visible:ring-brand-mint/30 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-brand-charcoal/70 block mb-1">WhatsApp *</label>
                        <input
                          type="tel"
                          value={form.telefone}
                          onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                          placeholder="(11) 91234-5678"
                          className="w-full border border-brand-charcoal/15 rounded-lg px-3 py-2 text-sm focus-visible:border-brand-mint focus-visible:ring-2 focus-visible:ring-brand-mint/30 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-brand-charcoal/70 block mb-1">E-mail (opcional)</label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="voce@email.com"
                          className="w-full border border-brand-charcoal/15 rounded-lg px-3 py-2 text-sm focus-visible:border-brand-mint focus-visible:ring-2 focus-visible:ring-brand-mint/30 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-brand-charcoal/70 block mb-1">Motivação (opcional)</label>
                        <textarea
                          value={form.motivacao}
                          onChange={(e) => setForm({ ...form, motivacao: e.target.value })}
                          placeholder="O que te motiva a participar?"
                          rows={2}
                          className="w-full border border-brand-charcoal/15 rounded-lg px-3 py-2 text-sm focus-visible:border-brand-mint focus-visible:ring-2 focus-visible:ring-brand-mint/30 outline-none resize-none"
                        />
                      </div>
                    </div>

                    {erro && (
                      <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                        {erro}
                      </div>
                    )}

                    <button
                      onClick={handleFinalizarPagamento}
                      disabled={processando}
                      className="w-full py-4 bg-brand-mint hover:bg-brand-mint-dark text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-brand-mint/25 hover:shadow-brand-mint/40 cursor-pointer disabled:opacity-50 text-sm md:text-base flex items-center justify-center gap-2"
                    >
                      {processando ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Confirmando...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-5 h-5" />
                          Confirmar inscrição
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                /* Produto pago — fluxo normal */
                <>
                  <div>
                    <h3 className="text-lg font-semibold text-brand-charcoal mb-4">
                      Seus dados
                    </h3>

                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="text-xs font-medium text-brand-charcoal/70 block mb-1">Nome completo *</label>
                        <input
                          type="text"
                          value={form.nome}
                          onChange={(e) => setForm({ ...form, nome: e.target.value })}
                          placeholder="Seu nome"
                          className="w-full border border-brand-charcoal/15 rounded-lg px-3 py-2 text-sm focus-visible:border-brand-mint focus-visible:ring-2 focus-visible:ring-brand-mint/30 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-brand-charcoal/70 block mb-1">WhatsApp *</label>
                        <input
                          type="tel"
                          value={form.telefone}
                          onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                          placeholder="(11) 91234-5678"
                          className="w-full border border-brand-charcoal/15 rounded-lg px-3 py-2 text-sm focus-visible:border-brand-mint focus-visible:ring-2 focus-visible:ring-brand-mint/30 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-brand-charcoal/70 block mb-1">E-mail (opcional)</label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="voce@email.com"
                          className="w-full border border-brand-charcoal/15 rounded-lg px-3 py-2 text-sm focus-visible:border-brand-mint focus-visible:ring-2 focus-visible:ring-brand-mint/30 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-brand-charcoal/70 block mb-1">Motivação (opcional)</label>
                        <textarea
                          value={form.motivacao}
                          onChange={(e) => setForm({ ...form, motivacao: e.target.value })}
                          placeholder="O que te motiva a participar?"
                          rows={2}
                          className="w-full border border-brand-charcoal/15 rounded-lg px-3 py-2 text-sm focus-visible:border-brand-mint focus-visible:ring-2 focus-visible:ring-brand-mint/30 outline-none resize-none"
                        />
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-brand-charcoal mb-6">
                      Forma de pagamento
                    </h3>

                    <div className="space-y-3 mb-8">
                      {metodosFiltrados.map((metodo) => (
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
                        <span className="text-brand-charcoal/60 text-sm block mb-2">
                          Parcelamento
                        </span>
                        <span className="block text-brand-charcoal font-medium">
                          1x de R$ {preco.toFixed(2).replace(".", ",")}
                          <span className="text-brand-charcoal/50 font-normal"> (à vista)</span>
                        </span>
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

                    {form.nome && (
                      <p className="text-brand-charcoal/40 text-center text-[10px] mt-2">
                        Compra de: {form.nome}
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
                </>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
