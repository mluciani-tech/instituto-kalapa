"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Suspense, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight, Sparkles, Package, Clock, AlertCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface PedidoPublico {
  order_nsu: string;
  valor: number;
  status: string;
  metodo_pagamento: string | null;
  capture_method: string | null;
  receipt_url: string | null;
  itens?: {
    produto_id: string;
    nome: string;
    slug?: string;
    quantidade: number;
    is_teste?: boolean;
    rota_teste?: string | null;
  }[];
  produtos: {
    nome: string;
    slug: string;
    is_teste?: boolean;
    rota_teste?: string | null;
  } | null;
}

function SucessoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart, closeDrawer } = useCart();
  const [pedido, setPedido] = useState<PedidoPublico | null>(null);
  const [naoEncontrado, setNaoEncontrado] = useState(false);

  // Garantir que o carrinho e drawer estejam sempre limpos/fechados ao chegar na tela de sucesso
  useEffect(() => {
    clearCart();
    closeDrawer();
    try {
      localStorage.removeItem("kalapa_cart_items_v1");
      sessionStorage.removeItem("produto_selecionado");
    } catch {
      // ignore
    }
  }, [clearCart, closeDrawer]);

  const receiptUrl = searchParams.get("receipt_url");
  const orderNsu = searchParams.get("order_nsu");
  const captureMethod = searchParams.get("capture_method");
  const transactionNsu = searchParams.get("transaction_nsu");
  const rotaTesteQuery = searchParams.get("rota_teste");
  const isTesteQuery = searchParams.get("is_teste") === "1";

  const fetchPedido = useCallback(() => {
    if (!orderNsu) return;

    fetch(`/api/pedido?order_nsu=${encodeURIComponent(orderNsu)}`)
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

  // Enquanto pendente, re-verifica a cada 1.5s para reação instantânea ao retorno da InfinitePay
  useEffect(() => {
    if (!orderNsu || (pedido && pedido.status !== "pendente")) return;

    const interval = setInterval(fetchPedido, 1500);
    return () => clearInterval(interval);
  }, [pedido, orderNsu, fetchPedido]);

  const metodoLabel =
    pedido?.metodo_pagamento === "pix"
      ? "Pix"
      : captureMethod === "credit_card" || pedido?.capture_method === "credit_card"
      ? "Cartão de Crédito"
      : "Pagamento";

  const valor = pedido?.valor || 0;
  const nomeProduto = pedido?.produtos?.nome || (isTesteQuery ? "Avaliação de Autoconhecimento" : "Serviço");
  const pago = pedido?.status === "pago" || Boolean(transactionNsu && receiptUrl);

  // Verificar se o pedido possui teste de autoconhecimento
  const itensTeste = pedido?.itens?.filter(
    (it) => it.is_teste || it.slug?.startsWith("teste-") || it.rota_teste
  ) || [];

  const primeiroTeste = itensTeste[0] || (pedido?.produtos?.is_teste ? {
    nome: pedido.produtos.nome,
    slug: pedido.produtos.slug,
    rota_teste: pedido.produtos.rota_teste,
    is_teste: true,
  } : isTesteQuery ? {
    nome: "Avaliação de Autoconhecimento",
    slug: (rotaTesteQuery || "").replace(/^\//, ""),
    rota_teste: rotaTesteQuery || "/teste-cronotipo",
    is_teste: true,
  } : null);

  const rotaTesteDestino = primeiroTeste?.rota_teste || (primeiroTeste?.slug ? `/${primeiroTeste.slug}` : "/teste-autoconhecimento");

  const handleClickIniciar = () => {
    router.push(`${rotaTesteDestino}?iniciar=1`);
  };

  return (
    <section className="relative min-h-screen pt-28 pb-16 md:pt-36 md:pb-24 bg-brand-charcoal overflow-hidden flex items-center justify-center">
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

          {/* Card Especial de Teste Disponível */}
          {pago && primeiroTeste && (
            <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-amber-500/15 via-[#B8965A]/20 to-emerald-500/15 border border-[#B8965A]/40 text-center shadow-lg animate-in fade-in duration-300">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#B8965A]/20 flex items-center justify-center text-[#B8965A]">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <p className="text-lg font-serif font-bold text-white mb-1">
                Sua Avaliação Está Liberada!
              </p>
              <p className="text-xs sm:text-sm text-white/80 mb-3 max-w-md mx-auto">
                Seu crédito para <strong>{primeiroTeste.nome}</strong> já foi liberado no sistema do INstituto Kalapa.
              </p>


              <div className="flex justify-center">
                <Link
                  href={`${rotaTesteDestino}?iniciar=1`}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#B8965A] to-[#A3834C] hover:from-[#A3834C] hover:to-[#8E713F] text-white text-sm font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] cursor-pointer"
                >
                  <span>Iniciar Teste Agora</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

          <p className="text-white/40 text-sm mt-6 leading-relaxed">
            {pago
              ? primeiroTeste
                ? "Seus créditos de avaliação foram adicionados à sua conta no INstituto Kalapa. Você pode realizar o teste imediatamente ou quando for mais conveniente."
                : "Sua vaga está garantida. Nossa equipe entrará em contato pelo WhatsApp em breve."
              : "Assim que o pagamento for confirmado, você receberá um e-mail e seu acesso será liberado."}
          </p>

          {/* Card Acompanhar Pedido */}
          <div className="mt-6 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center">
            <p className="text-sm font-semibold text-white mb-1">
              Deseja acompanhar o andamento do seu pedido?
            </p>
            <p className="text-xs text-white/60 mb-4">
              Você pode visualizar o status em tempo real e comprovante na sua área do cliente.
            </p>
            <Link
              href="/conta/pedidos"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-purple-900/40 cursor-pointer"
            >
              Acompanhar meu pedido
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
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
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/15 text-white text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer"
            >
              Voltar para Home
            </Link>
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
