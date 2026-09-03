"use client";

import { useState, useEffect } from "react";
import {
  ShieldCheck,
  ExternalLink,
  Package,
  ArrowLeft,
  CheckCircle2,
  Tag,
  User,
  MapPin,
  LogIn,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import type { Produto, Usuario } from "@/lib/types";

export default function Checkout() {
  const { items: cartItems, clearCart, subtotal: cartSubtotal } = useCart();
  const [produto, setProduto] = useState<Produto | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [processando, setProcessando] = useState(false);
  const [erro, setErro] = useState("");

  // Formulário para visitante (se não estiver logado)
  const [guestForm, setGuestForm] = useState({
    nome: "",
    email: "",
    telefone: "",
  });

  // Cupom de desconto opcional
  const [cupomInput, setCupomInput] = useState("");
  const [validandoCupom, setValidandoCupom] = useState(false);
  const [cupomErro, setCupomErro] = useState("");
  const [cupomAplicado, setCupomAplicado] = useState<{
    codigo: string;
    desconto: number;
    totalComDesconto: number;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Verificar se usuário está logado
        const authRes = await fetch("/api/auth/me");
        if (authRes.ok) {
          const authData = await authRes.json();
          if (authData.authenticated && authData.usuario) {
            setUsuario(authData.usuario);
          }
        }

        // 2. Se não houver itens no carrinho, buscar produto individual da sessão
        const produtoId = typeof window !== "undefined"
          ? sessionStorage.getItem("produto_selecionado")
          : null;

        if (produtoId) {
          const res = await fetch(`/api/produtos/${produtoId}`);
          if (res.ok) {
            const data = await res.json();
            setProduto(data);
          }
        }
      } catch {
        // ignore
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const isCartCheckout = cartItems.length > 0;
  const subtotal = isCartCheckout
    ? cartSubtotal
    : (produto?.preco ?? 0);

  const valorDesconto = cupomAplicado?.desconto || 0;
  const totalFinal = Math.max(0, subtotal - valorDesconto);

  // Aplicar cupom de desconto (opcional)
  const handleAplicarCupom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cupomInput.trim()) return;
    setCupomErro("");
    setValidandoCupom(true);

    try {
      const res = await fetch("/api/cupons/validar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          codigo: cupomInput.trim(),
          subtotal,
        }),
      });

      const data = await res.json();

      if (res.ok && data.valid) {
        setCupomAplicado({
          codigo: data.cupom.codigo,
          desconto: data.desconto,
          totalComDesconto: data.totalComDesconto,
        });
        setCupomInput("");
      } else {
        setCupomErro(data.error || "Cupom inválido ou expirado.");
      }
    } catch {
      setCupomErro("Erro ao validar cupom.");
    }
    setValidandoCupom(false);
  };

  const handleRemoverCupom = () => {
    setCupomAplicado(null);
    setCupomErro("");
  };

  // Finalizar pagamento
  const handleFinalizarPagamento = async () => {
    if (!isCartCheckout && !produto) {
      setErro("Nenhum produto selecionado. Escolha um produto no catálogo.");
      return;
    }

    if (!usuario) {
      if (!guestForm.nome.trim()) {
        setErro("Informe seu nome ou faça login para continuar.");
        return;
      }
      if (guestForm.telefone.replace(/\D/g, "").length < 10) {
        setErro("Informe um telefone com DDD válido.");
        return;
      }
    }

    setProcessando(true);
    setErro("");

    try {
      const bodyPayload: Record<string, unknown> = {
        cupom_codigo: cupomAplicado?.codigo || null,
      };

      if (isCartCheckout) {
        bodyPayload.itens = cartItems.map((i) => ({
          produto_id: i.produto_id,
          quantidade: i.quantidade,
        }));
      } else if (produto) {
        bodyPayload.produto_id = produto.id;
      }

      if (!usuario) {
        bodyPayload.customer = {
          name: guestForm.nome.trim(),
          email: guestForm.email.trim() || "contato@institutokalapa.com.br",
          phone_number: guestForm.telefone.trim(),
        };
      }

      const checkoutRes = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload),
      });

      const checkoutData = await checkoutRes.json();

      if (!checkoutRes.ok || !checkoutData.url) {
        setErro(checkoutData.error || "Erro ao gerar link de pagamento.");
        setProcessando(false);
        return;
      }

      if (isCartCheckout) clearCart();
      sessionStorage.removeItem("produto_selecionado");
      window.location.href = checkoutData.url;
    } catch (error) {
      console.error("Erro no checkout:", error);
      setErro("Falha de conexão. Tente novamente.");
      setProcessando(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-charcoal relative flex items-center justify-center text-white">
        <div className="absolute inset-0 cinematic-gradient" />
        <div className="w-10 h-10 border-4 border-brand-terracotta border-t-transparent rounded-full animate-spin relative z-10" />
      </div>
    );
  }

  if (!isCartCheckout && !produto) {
    return (
      <div className="min-h-screen bg-brand-charcoal relative flex items-center justify-center text-white px-4">
        <div className="absolute inset-0 cinematic-gradient" />
        <div className="relative z-10 text-center max-w-md mx-auto glass-card rounded-2xl p-8 border border-white/10">
          <Package className="w-14 h-14 text-white/30 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Nenhum produto selecionado</h2>
          <p className="text-white/50 text-xs mb-6">
            Seu carrinho está vazio e nenhum produto foi selecionado para compra.
          </p>
          <Link
            href="/produtos"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-terracotta hover:bg-brand-terracotta-dark text-white font-semibold text-xs rounded-xl transition-all shadow-lg shadow-brand-terracotta/25"
          >
            <ArrowLeft className="w-4 h-4" />
            Explorar catálogo completo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="relative min-h-screen py-24 md:py-32 bg-brand-charcoal text-white flex items-center justify-center font-sans">
      {/* Background Cinematográfico Kalapa */}
      <div className="absolute inset-0 cinematic-gradient opacity-95 pointer-events-none" />
      <div className="absolute inset-0 cinematic-overlay opacity-60 pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-terracotta/15 text-brand-terracotta text-xs font-semibold tracking-wide mb-3 border border-brand-terracotta/25">
            <ShieldCheck className="w-4 h-4" />
            Checkout Seguro InfinitePay
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Finalizar Pedido
          </h1>
          <p className="mt-1 text-white/50 text-xs md:text-sm">
            Seus dados são protegidos com criptografia de ponta a ponta
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-8">
          {/* LADO ESQUERDO: RESUMO DOS PRODUTOS & VALORES (7 cols) */}
          <div className="md:col-span-7 glass-card border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                <h2 className="text-xs font-bold uppercase tracking-wider text-brand-terracotta">
                  {isCartCheckout ? `Itens do Carrinho (${cartItems.length})` : "Produto Selecionado"}
                </h2>
                <Link
                  href="/produtos"
                  className="text-xs text-white/50 hover:text-white transition-colors"
                >
                  + Adicionar mais
                </Link>
              </div>

              {/* Lista de itens */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {isCartCheckout ? (
                  cartItems.map((item) => (
                    <div
                      key={item.produto_id}
                      className="p-3 bg-white/[0.04] border border-white/10 rounded-xl flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {item.imagem_url ? (
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-white/10">
                            <Image src={item.imagem_url} alt={item.nome} fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/10 text-white/30">
                            <Package className="w-5 h-5" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-white truncate">{item.nome}</p>
                          <p className="text-[11px] text-white/50">Qtd: {item.quantidade}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-bold text-brand-terracotta">
                          R$ {(item.preco * item.quantidade).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  produto && (
                    <div className="p-4 bg-white/[0.04] border border-white/10 rounded-xl">
                      <h3 className="text-base font-bold text-white mb-1">{produto.nome}</h3>
                      {produto.descricao_curta && (
                        <p className="text-xs text-white/60 mb-3">{produto.descricao_curta}</p>
                      )}
                      <p className="text-lg font-bold text-brand-terracotta">
                        R$ {subtotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  )
                )}
              </div>

              {/* CAMPO DE CUPOM OPCIONAL */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <label className="text-xs font-medium text-white/70 block mb-2 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-brand-terracotta" />
                  Possui cupom de desconto? (Opcional)
                </label>

                {cupomAplicado ? (
                  <div className="p-3 rounded-xl bg-brand-mint/20 border border-brand-mint/30 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-brand-mint font-mono">
                        {cupomAplicado.codigo}
                      </span>
                      <span className="text-xs text-brand-mint/90 ml-2">
                        - R$ {valorDesconto.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} aplicado!
                      </span>
                    </div>
                    <button
                      onClick={handleRemoverCupom}
                      className="text-xs text-red-300 hover:text-red-200 font-medium transition-colors cursor-pointer"
                    >
                      Remover
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleAplicarCupom} className="flex gap-2">
                    <input
                      type="text"
                      value={cupomInput}
                      onChange={(e) => setCupomInput(e.target.value.toUpperCase())}
                      placeholder="Código do cupom"
                      className="flex-1 bg-white/5 border border-white/15 focus:border-brand-terracotta focus:ring-1 focus:ring-brand-terracotta rounded-xl px-3.5 py-2.5 text-xs text-white uppercase font-mono placeholder-white/25 outline-none"
                    />
                    <button
                      type="submit"
                      disabled={validandoCupom || !cupomInput.trim()}
                      className="px-4 py-2.5 bg-brand-terracotta hover:bg-brand-terracotta-dark disabled:opacity-40 text-xs font-semibold text-white rounded-xl transition-colors cursor-pointer"
                    >
                      {validandoCupom ? "Validando..." : "Aplicar"}
                    </button>
                  </form>
                )}

                {cupomErro && (
                  <p className="text-[11px] text-red-400 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {cupomErro}
                  </p>
                )}
              </div>
            </div>

            {/* Totalizador */}
            <div className="mt-6 pt-4 border-t border-white/10 space-y-1.5">
              <div className="flex justify-between text-xs text-white/60">
                <span>Subtotal</span>
                <span>R$ {subtotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
              </div>
              {valorDesconto > 0 && (
                <div className="flex justify-between text-xs text-brand-mint font-medium">
                  <span>Desconto cupom</span>
                  <span>- R$ {valorDesconto.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/10">
                <span>Total a pagar</span>
                <span className="text-brand-terracotta font-bold text-lg">
                  R$ {totalFinal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* LADO DIREITO: DADOS DO CLIENTE & BOTÃO DE PAGAMENTO (5 cols) */}
          <div className="md:col-span-5 glass-card border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-2xl">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-brand-terracotta pb-4 mb-4 border-b border-white/10">
                Identificação do Pagamento
              </h2>

              {/* SE USUÁRIO LOGADO: ZERO PREENCHIMENTO MANUAL */}
              {usuario ? (
                <div className="space-y-3">
                  <div className="p-4 bg-white/[0.04] border border-brand-terracotta/30 rounded-xl">
                    <div className="flex items-center gap-2 text-xs font-semibold text-brand-terracotta mb-2">
                      <User className="w-4 h-4" />
                      Conta Conectada
                    </div>
                    <p className="text-sm font-bold text-white">{usuario.nome}</p>
                    <p className="text-xs text-white/60">{usuario.email}</p>
                    <p className="text-xs text-white/60">Tel: {usuario.telefone}</p>
                    <p className="text-xs text-white/40 font-mono mt-1">CPF: {usuario.cpf}</p>
                  </div>

                  <div className="p-4 bg-white/[0.04] border border-white/10 rounded-xl">
                    <div className="flex items-center gap-2 text-xs font-semibold text-white/70 mb-2">
                      <MapPin className="w-4 h-4 text-brand-terracotta" />
                      Endereço
                    </div>
                    <p className="text-xs text-white/90">
                      {usuario.rua}, {usuario.numero} {usuario.complemento ? `(${usuario.complemento})` : ""}
                    </p>
                    <p className="text-xs text-white/60">
                      {usuario.bairro} — {usuario.cidade}/{usuario.uf}
                    </p>
                    <p className="text-xs text-white/40 font-mono">CEP: {usuario.cep}</p>
                  </div>

                  <p className="text-[11px] text-brand-mint flex items-center gap-1.5 pt-1">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    Seus dados serão repassados automaticamente à InfinitePay sem necessidade de digitação.
                  </p>
                </div>
              ) : (
                /* SE VISITANTE NÃO LOGADO: CONVITE DE LOGIN OU DADOS RÁPIDOS */
                <div className="space-y-4">
                  <div className="p-3.5 bg-white/[0.04] border border-brand-terracotta/30 rounded-xl text-center">
                    <p className="text-xs text-white/80 font-medium mb-2">
                      Já é cliente cadastrado?
                    </p>
                    <Link
                      href="/login?redirect=/checkout"
                      className="inline-flex items-center justify-center gap-2 w-full py-2 bg-brand-terracotta/20 hover:bg-brand-terracotta/30 border border-brand-terracotta/40 text-brand-terracotta text-xs font-semibold rounded-xl transition-colors"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      Entrar para finalizar em 1 clique
                    </Link>
                  </div>

                  <div className="relative text-center my-2">
                    <span className="text-[10px] uppercase tracking-wider text-white/40 bg-brand-purple-deep px-2 relative z-10">
                      Ou compre como visitante
                    </span>
                    <div className="absolute inset-x-0 top-2 border-t border-white/10" />
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-white/70 block mb-1">Nome completo *</label>
                      <input
                        type="text"
                        required
                        value={guestForm.nome}
                        onChange={(e) => setGuestForm({ ...guestForm, nome: e.target.value })}
                        placeholder="Seu nome"
                        className="w-full bg-white/5 border border-white/15 focus:border-brand-terracotta focus:ring-1 focus:ring-brand-terracotta rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-white/70 block mb-1">Telefone / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        value={guestForm.telefone}
                        onChange={(e) => setGuestForm({ ...guestForm, telefone: e.target.value })}
                        placeholder="(11) 99999-9999"
                        className="w-full bg-white/5 border border-white/15 focus:border-brand-terracotta focus:ring-1 focus:ring-brand-terracotta rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-white/70 block mb-1">E-mail</label>
                      <input
                        type="email"
                        value={guestForm.email}
                        onChange={(e) => setGuestForm({ ...guestForm, email: e.target.value })}
                        placeholder="seu@email.com"
                        className="w-full bg-white/5 border border-white/15 focus:border-brand-terracotta focus:ring-1 focus:ring-brand-terracotta rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-6">
              {erro && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs">
                  {erro}
                </div>
              )}

              <button
                onClick={handleFinalizarPagamento}
                disabled={processando}
                className="w-full py-4 bg-brand-terracotta hover:bg-brand-terracotta-dark disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-brand-terracotta/25 cursor-pointer flex items-center justify-center gap-2"
              >
                {processando ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Gerando pagamento InfinitePay...
                  </>
                ) : (
                  <>
                    Pagar R$ {totalFinal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    <ExternalLink className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-white/50 text-center">
                <ShieldCheck className="w-4 h-4 text-brand-mint" />
                <span>Processamento oficial e seguro pela InfinitePay</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
