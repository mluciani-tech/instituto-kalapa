"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight, Sparkles, Package, Clock, AlertCircle } from "lucide-react";

interface PedidoPublico {
  order_nsu: string;
  valor: number;
  status: string;
  metodo_pagamento: string | null;
  capture_method: string | null;
  receipt_url: string | null;
  produtos: {
    nome: string;
    slug: string;
  } | null;
}

function SucessoContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [pedido, setPedido] = useState<PedidoPublico | null>(null);
  const [naoEncontrado, setNaoEncontrado] = useState(false);

  const receiptUrl = searchParams.get("receipt_url");
  const orderNsu = searchParams.get("order_nsu");
  const captureMethod = searchParams.get("capture_method");
  const transactionNsu = searchParams.get("transaction_nsu");

  const fetchPedido = useCallback(() => {
    if (!orderNsu) return;

    fetch(`/api/pedido?order_nsu=${orderNsu}`)
      .then((r) => {
        if (!r.ok) {
          setNaoEncontrado(true);
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (data && !data.error) {
          setPedido(data);
        }
      })
      .catch(() => {});
  }, [orderNsu]);

  useEffect(() => {
    fetchPedido();
  }, [fetchPedido]);

  // Enquanto pendente, re-verifica a cada 5s (webhook pode demorar)
  useEffect(() => {
    if (!pedido || pedido.status !== "pendente") return;

    const interval = setInterval(fetchPedido, 5000);
    return () => clearInterval(interval);
  }, [pedido, fetchPedido]);

  const metodoLabel =
    pedido?.metodo_pagamento === "pix"
      ? "Pix"
      : captureMethod === "credit_card" || pedido?.capture_method === "credit_card"
      ? "Cartão de Crédito"
      : "Pagamento";

  const valor = pedido?.valor || 0;
  const nomeProduto = pedido?.produtos?.nome || "Serviço";
  const pago = pedido?.status === "pago";

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

          {naoEncontrado ? (
            <>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center shadow-lg">
                <AlertCircle className="w-10 h-10 text-red-400" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Pedido não encontrado
              </h1>
              <p className="text-white/70 text-lg mb-6">
                Não localizamos este pedido. Se você acabou de pagar, aguarde alguns
                instantes — a confirmação pode demorar um pouco.
              </p>
            </>
          ) : pago ? (
            <>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-brand-mint/20 flex items-center justify-center shadow-lg">
                <Check className="w-10 h-10 text-brand-mint" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Pagamento Confirmado!
              </h1>
              <p className="text-white/70 text-lg mb-2">
                Seja bem-vindo(a) ao INstituto Kalapa.
              </p>
            </>
          ) : (
            <>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-brand-terracotta/20 flex items-center justify-center shadow-lg">
                <Clock className="w-10 h-10 text-brand-terracotta animate-pulse" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Aguardando confirmação
              </h1>
              <p className="text-white/70 text-lg mb-2">
                Recebemos seu pedido e estamos aguardando a confirmação do pagamento.
                Esta página atualiza automaticamente.
              </p>
            </>
          )}

          {/* Produto */}
          <div className="mt-4 flex items-center justify-center gap-2 text-brand-mint">
            <Package className="w-5 h-5" />
            <span className="font-semibold">{nomeProduto}</span>
          </div>

          {/* Detalhes do pagamento */}
          <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10 text-left">
            <h2 className="text-sm font-semibold text-white/60 mb-3 uppercase tracking-wide">
              Detalhes do pedido
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/50">Produto</span>
                <span className="text-white font-medium">{nomeProduto}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Método</span>
                <span className="text-white font-medium">{metodoLabel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Valor</span>
                <span className="text-white font-medium">
                  R$ {valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Status</span>
                <span className={`font-medium ${pago ? "text-brand-mint" : "text-brand-terracotta"}`}>
                  {pago ? "Confirmado" : "Aguardando"}
                </span>
              </div>
              {orderNsu && (
                <div className="flex justify-between">
                  <span className="text-white/50">Pedido</span>
                  <span className="text-white/70 font-mono text-xs">{orderNsu}</span>
                </div>
              )}
              {transactionNsu && (
                <div className="flex justify-between">
                  <span className="text-white/50">Transação</span>
                  <span className="text-white/70 font-mono text-xs">{transactionNsu}</span>
                </div>
              )}
            </div>
          </div>

          <p className="text-white/40 text-sm mt-6 leading-relaxed">
            {pago
              ? "Sua vaga está garantida. Nossa equipe entrará em contato pelo WhatsApp em breve."
              : "Assim que o pagamento for confirmado, você receberá um e-mail e nossa equipe entrará em contato."}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            {pago && (receiptUrl || pedido?.receipt_url) && (
              <a
                href={receiptUrl || pedido?.receipt_url || "#"}
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
