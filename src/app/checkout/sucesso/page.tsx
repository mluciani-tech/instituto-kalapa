"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight, Sparkles } from "lucide-react";

function SucessoContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [preco, setPreco] = useState(97);

  const receiptUrl = searchParams.get("receipt_url");
  const orderNsu = searchParams.get("order_nsu");
  const captureMethod = searchParams.get("capture_method");

  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then((data) => {
        if (data.preco_sessao) setPreco(Number(data.preco_sessao));
      })
      .catch(() => {});
  }, []);

  const metodoLabel =
    captureMethod === "pix"
      ? "Pix"
      : captureMethod === "credit_card"
      ? "Cartão de Crédito"
      : "Pagamento";

  return (
    <section className="relative min-h-screen py-20 bg-brand-charcoal overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-charcoal via-brand-purple-deep/30 to-brand-charcoal" />

      <div className="relative z-10 w-full max-w-2xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="glass-card rounded-2xl p-8 md:p-12 text-center border border-brand-mint/30 shadow-2xl"
        >
          <div className="absolute top-4 right-4 text-brand-mint/40 animate-pulse">
            <Sparkles className="w-8 h-8" />
          </div>

          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-brand-mint/20 flex items-center justify-center shadow-lg">
            <Check className="w-10 h-10 text-brand-mint" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Pagamento Confirmado!
          </h1>

          <p className="text-white/70 text-lg mb-2">
            Seja bem-vindo(a) ao grupo do Instituto Kalapa.
          </p>

          <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10 text-left">
            <h2 className="text-sm font-semibold text-white/60 mb-3 uppercase tracking-wide">
              Detalhes do pagamento
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/50">Método</span>
                <span className="text-white font-medium">{metodoLabel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Valor</span>
                <span className="text-white font-medium">R$ {preco.toLocaleString("pt-BR")},00</span>
              </div>
              {orderNsu && (
                <div className="flex justify-between">
                  <span className="text-white/50">Pedido</span>
                  <span className="text-white/70 font-mono text-xs">{orderNsu}</span>
                </div>
              )}
            </div>
          </div>

          <p className="text-white/40 text-sm mt-6 leading-relaxed">
            Sua vaga está garantida. Nossa equipe entrará em contato pelo WhatsApp em breve.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            {receiptUrl && (
              <a
                href={receiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white/10 hover:bg-white/15 text-white text-sm font-medium rounded-xl transition-all duration-200 border border-white/10 hover:border-white/20"
              >
                Ver comprovante
              </a>
            )}
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-terracotta hover:bg-brand-terracotta-dark text-white text-sm font-medium rounded-xl transition-all duration-200"
            >
              Voltar para Home
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function CheckoutSucessoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-brand-charcoal flex items-center justify-center text-white">
          <div className="w-12 h-12 border-4 border-brand-mint border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SucessoContent />
    </Suspense>
  );
}
