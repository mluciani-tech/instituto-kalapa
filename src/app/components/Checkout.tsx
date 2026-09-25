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
  Users,
  MapPin,
  LogIn,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import type { Produto, Usuario } from "@/lib/types";

interface AcompanhanteItem {
  key: string;
  produto_id: string;
  produto_nome: string;
  indice: number;
  nome: string;
  email: string;
  telefone: string;
}

function formatPhone(val: string): string {
  const digits = val.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export default function Checkout() {
  const { items: cartItems, clearCart, subtotal: cartSubtotal } = useCart();
  const [produto, setProduto] = useState<Produto | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [processando, setProcessando] = useState(false);
  const [redirecionando, setRedirecionando] = useState(false);
  const [erro, setErro] = useState("");

  // Formulário para acompanhantes / participantes extras quando quantidade >= 2
  const [acompanhantes, setAcompanhantes] = useState<AcompanhanteItem[]>([]);

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

        // 3. Pré-carregar cupom salvo se for pedido retomado
        const savedCupom = typeof window !== "undefined"
          ? sessionStorage.getItem("pedido_retomado_cupom")
          : null;
        if (savedCupom) {
          setCupomInput(savedCupom);
        }
      } catch {
        // ignore
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const isCartCheckout = cartItems.length > 0;

  // Sincronizar participantes extras quando quantidade >= 2
  useEffect(() => {
    if (!isCartCheckout) {
      setAcompanhantes((prev) => (prev.length > 0 ? [] : prev));
      return;
    }

    setAcompanhantes((prev) => {
      const necessarios: AcompanhanteItem[] = [];
      let savedBeneficiarios: Array<{ nome?: string; email?: string; telefone?: string; produto_id?: string }> = [];
      try {
        const raw = typeof window !== "undefined" ? sessionStorage.getItem("pedido_retomado_beneficiarios") : null;
        if (raw) savedBeneficiarios = JSON.parse(raw);
      } catch {
        // ignore
      }

      for (const item of cartItems) {
        if (item.quantidade >= 2) {
          const extras = item.quantidade - 1;
          for (let i = 0; i < extras; i++) {
            const key = `${item.produto_id}-${i}`;
            const existente = prev.find((a) => a.key === key);
            const saved = savedBeneficiarios.find((b, idx) => (b.produto_id === item.produto_id || !b.produto_id) && idx === i);
            necessarios.push({
              key,
              produto_id: item.produto_id,
              produto_nome: item.nome,
              indice: i + 1,
              nome: existente?.nome || saved?.nome || "",
              email: existente?.email || saved?.email || "",
              telefone: existente?.telefone || saved?.telefone || "",
            });
          }
        }
      }

      const currentKeys = prev.map((a) => `${a.key}-${a.nome}-${a.email}`).join(",");
      const nextKeys = necessarios.map((a) => `${a.key}-${a.nome}-${a.email}`).join(",");
      return currentKeys !== nextKeys ? necessarios : prev;
    });
  }, [cartItems, isCartCheckout]);

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
    if (processando || redirecionando) return;

    if (!isCartCheckout && !produto) {
      setErro("Nenhum produto selecionado. Escolha um produto no catálogo.");
      return;
    }

    if (!usuario) {
      setErro("Para sua segurança e emissão dos ingressos, faça login ou cadastre-se para continuar.");
      return;
    }

    // Validar dados dos acompanhantes quando há mais de 1 vaga
    for (const ac of acompanhantes) {
      if (!ac.nome.trim()) {
        setErro(`Informe o nome completo do Participante adicional ${ac.indice} (${ac.produto_nome}).`);
        return;
      }
      if (ac.telefone.replace(/\D/g, "").length < 10) {
        setErro(`Informe um WhatsApp/telefone com DDD para o Participante ${ac.indice} (${ac.produto_nome}).`);
        return;
      }
      if (!ac.email.trim() || !ac.email.includes("@")) {
        setErro(`Informe um e-mail válido para o Participante ${ac.indice} (${ac.produto_nome}).`);
        return;
      }
    }

    setProcessando(true);
    setErro("");

    try {
      const pedidoOrigemId = typeof window !== "undefined"
        ? sessionStorage.getItem("pedido_retomado_id")
        : null;

      const bodyPayload: Record<string, unknown> = {
        cupom_codigo: cupomAplicado?.codigo || null,
        pedido_origem_id: pedidoOrigemId || null,
      };

      if (isCartCheckout) {
        bodyPayload.itens = cartItems.map((i) => ({
          produto_id: i.produto_id,
          quantidade: i.quantidade,
        }));
      } else if (produto) {
        bodyPayload.produto_id = produto.id;
      }

      if (acompanhantes.length > 0) {
        bodyPayload.beneficiarios = acompanhantes.map((ac) => ({
          produto_id: ac.produto_id,
          produto_nome: ac.produto_nome,
          nome: ac.nome.trim(),
          email: ac.email.trim(),
          telefone: ac.telefone.trim(),
        }));
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

      setRedirecionando(true);
      clearCart();
      try {
        localStorage.removeItem("kalapa_cart_items_v1");
        sessionStorage.removeItem("produto_selecionado");
        sessionStorage.removeItem("pedido_retomado_id");
        sessionStorage.removeItem("pedido_retomado_beneficiarios");
        sessionStorage.removeItem("pedido_retomado_cupom");
      } catch {
        // ignore
      }

      // Breve pausa para o usuário assimilar o aviso de segurança e transição bancária
      setTimeout(() => {
        window.location.href = checkoutData.url;
      }, 1000);
    } catch (error) {
      console.error("Erro no checkout:", error);
      setErro("Falha de conexão. Tente novamente.");
      setProcessando(false);
      setRedirecionando(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-offwhite relative flex items-center justify-center text-brand-charcoal">
        <div className="w-10 h-10 border-4 border-brand-terracotta border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isCartCheckout && !produto) {
    return (
      <div className="min-h-screen bg-brand-offwhite relative flex items-center justify-center text-brand-charcoal px-4">
        <div className="relative z-10 text-center max-w-md mx-auto bg-white rounded-2xl p-8 border border-brand-charcoal/10 shadow-lg">
          <Package className="w-14 h-14 text-brand-charcoal/30 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2 text-brand-charcoal">Nenhuma vivência selecionada</h2>
          <p className="text-brand-charcoal/60 text-xs mb-6">
            Sua reserva está vazia e nenhuma vivência foi selecionada.
          </p>
          <Link
            href="/produtos"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-terracotta hover:bg-brand-terracotta-dark text-white font-semibold text-xs rounded-xl transition-all shadow-md shadow-brand-terracotta/20"
          >
            <ArrowLeft className="w-4 h-4" />
            Explorar vivências
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="relative min-h-screen py-24 md:py-32 bg-brand-offwhite text-brand-charcoal flex items-center justify-center font-sans">
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-terracotta/10 text-brand-terracotta text-xs font-semibold tracking-wide mb-3 border border-brand-terracotta/20">
            <ShieldCheck className="w-4 h-4" />
            Checkout Seguro InfinitePay
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-brand-charcoal tracking-tight">
            Finalizar Reserva
          </h1>
          <p className="mt-1 text-brand-charcoal/60 text-xs md:text-sm">
            Seus dados são protegidos com criptografia de ponta a ponta
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-8">
          {/* LADO ESQUERDO: RESUMO DOS PRODUTOS & VALORES (7 cols) */}
          <div className="md:col-span-7 bg-white border border-brand-charcoal/10 rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-md">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-brand-charcoal/10">
                <h2 className="text-xs font-bold uppercase tracking-wider text-brand-terracotta">
                  {isCartCheckout ? `Vivências Selecionadas (${cartItems.length})` : "Vivência Selecionada"}
                </h2>
                <Link
                  href="/produtos"
                  className="text-xs text-brand-purple hover:text-brand-purple-dark font-medium transition-colors"
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
                      className="p-3 bg-brand-offwhite/80 border border-brand-charcoal/10 rounded-xl flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {item.imagem_url ? (
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-brand-charcoal/10">
                            <Image src={item.imagem_url} alt={item.nome} fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-brand-charcoal/5 flex items-center justify-center shrink-0 border border-brand-charcoal/10 text-brand-charcoal/40">
                            <Package className="w-5 h-5" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-brand-charcoal truncate">{item.nome}</p>
                          <p className="text-[11px] text-brand-charcoal/60">Qtd: {item.quantidade}</p>
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
                    <div className="p-4 bg-brand-offwhite/80 border border-brand-charcoal/10 rounded-xl">
                      <h3 className="text-base font-bold text-brand-charcoal mb-1">{produto.nome}</h3>
                      {produto.descricao_curta && (
                        <p className="text-xs text-brand-charcoal/60 mb-3">{produto.descricao_curta}</p>
                      )}
                      <p className="text-lg font-bold text-brand-terracotta">
                        R$ {subtotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  )
                )}
              </div>

              {/* PARTICIPANTES ADICIONAIS QUANDO HOUVER COMPRA MÚLTIPLA */}
              {acompanhantes.length > 0 && (
                <div className="mt-6 pt-5 border-t border-brand-charcoal/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-full bg-brand-terracotta/15 flex items-center justify-center text-brand-terracotta shrink-0">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-brand-terracotta">
                        Dados dos Participantes Adicionais ({acompanhantes.length})
                      </h3>
                      <p className="text-[11px] text-brand-charcoal/60">
                        Você selecionou mais de uma vaga. Preencha os dados de quem irá participar:
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {acompanhantes.map((ac) => (
                      <div
                        key={ac.key}
                        className="p-3.5 bg-brand-offwhite rounded-xl border border-brand-charcoal/10 space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-brand-charcoal">
                            Participante {ac.indice} — {ac.produto_nome}
                          </span>
                          <span className="text-[10px] bg-brand-purple/10 text-brand-purple px-2 py-0.5 rounded-full font-medium">
                            Vaga Acompanhante
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          <div>
                            <label className="text-[11px] font-medium text-brand-charcoal/75 block mb-1">
                              Nome Completo *
                            </label>
                            <input
                              type="text"
                              required
                              value={ac.nome}
                              onChange={(e) => {
                                const val = e.target.value;
                                setAcompanhantes((prev) =>
                                  prev.map((item) => (item.key === ac.key ? { ...item, nome: val } : item))
                                );
                              }}
                              placeholder="Nome do participante"
                              className="w-full bg-white border border-brand-charcoal/15 focus:border-brand-terracotta focus:ring-1 focus:ring-brand-terracotta rounded-lg px-3 py-2 text-xs text-brand-charcoal outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-medium text-brand-charcoal/75 block mb-1">
                              WhatsApp / Telefone *
                            </label>
                            <input
                              type="tel"
                              required
                              value={ac.telefone}
                              onChange={(e) => {
                                const val = formatPhone(e.target.value);
                                setAcompanhantes((prev) =>
                                  prev.map((item) => (item.key === ac.key ? { ...item, telefone: val } : item))
                                );
                              }}
                              placeholder="(11) 99999-9999"
                              className="w-full bg-white border border-brand-charcoal/15 focus:border-brand-terracotta focus:ring-1 focus:ring-brand-terracotta rounded-lg px-3 py-2 text-xs text-brand-charcoal outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-medium text-brand-charcoal/75 block mb-1">
                              E-mail *
                            </label>
                            <input
                              type="email"
                              required
                              value={ac.email}
                              onChange={(e) => {
                                const val = e.target.value;
                                setAcompanhantes((prev) =>
                                  prev.map((item) => (item.key === ac.key ? { ...item, email: val } : item))
                                );
                              }}
                              placeholder="email@exemplo.com"
                              className="w-full bg-white border border-brand-charcoal/15 focus:border-brand-terracotta focus:ring-1 focus:ring-brand-terracotta rounded-lg px-3 py-2 text-xs text-brand-charcoal outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CAMPO DE CUPOM OPCIONAL */}
              <div className="mt-6 pt-4 border-t border-brand-charcoal/10">
                <label className="text-xs font-medium text-brand-charcoal/70 block mb-2 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-brand-terracotta" />
                  Possui cupom de desconto? (Opcional)
                </label>

                {cupomAplicado ? (
                  <div className="p-3 rounded-xl bg-brand-mint/10 border border-brand-mint/30 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-brand-mint-dark font-mono">
                        {cupomAplicado.codigo}
                      </span>
                      <span className="text-xs text-brand-mint-dark ml-2">
                        - R$ {valorDesconto.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} aplicado!
                      </span>
                    </div>
                    <button
                      onClick={handleRemoverCupom}
                      className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors cursor-pointer"
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
                      className="flex-1 bg-brand-offwhite border border-brand-charcoal/15 focus:border-brand-terracotta focus:ring-1 focus:ring-brand-terracotta rounded-xl px-3.5 py-2.5 text-xs text-brand-charcoal uppercase font-mono placeholder-brand-charcoal/35 outline-none"
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
                  <p className="text-[11px] text-red-500 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {cupomErro}
                  </p>
                )}
              </div>
            </div>

            {/* Totalizador */}
            <div className="mt-6 pt-4 border-t border-brand-charcoal/10 space-y-1.5">
              <div className="flex justify-between text-xs text-brand-charcoal/65">
                <span>Subtotal</span>
                <span>R$ {subtotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
              </div>
              {valorDesconto > 0 && (
                <div className="flex justify-between text-xs text-brand-mint-dark font-medium">
                  <span>Desconto cupom</span>
                  <span>- R$ {valorDesconto.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-brand-charcoal pt-2 border-t border-brand-charcoal/10">
                <span>Total a pagar</span>
                <span className="text-brand-terracotta font-bold text-lg">
                  R$ {totalFinal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* LADO DIREITO: DADOS DO CLIENTE & BOTÃO DE PAGAMENTO (5 cols) */}
          <div className="md:col-span-5 bg-white border border-brand-charcoal/10 rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-md">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-brand-terracotta pb-4 mb-4 border-b border-brand-charcoal/10">
                Identificação do Pagamento
              </h2>

              {/* SE USUÁRIO LOGADO: ZERO PREENCHIMENTO MANUAL */}
              {usuario ? (
                <div className="space-y-3">
                  <div className="p-4 bg-brand-offwhite border border-brand-terracotta/30 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-xs font-semibold text-brand-terracotta">
                        <User className="w-4 h-4" />
                        Conta Conectada
                      </div>
                      <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                        Autenticado
                      </span>
                    </div>
                    <p className="text-sm font-bold text-brand-charcoal">{usuario.nome}</p>
                    <p className="text-xs text-brand-charcoal/70">{usuario.email}</p>
                    <p className="text-xs text-brand-charcoal/70">Tel: {usuario.telefone}</p>
                    <p className="text-xs text-brand-charcoal/45 font-mono mt-1">CPF: {usuario.cpf}</p>
                  </div>

                  <div className="p-4 bg-brand-offwhite border border-brand-charcoal/10 rounded-xl">
                    <div className="flex items-center gap-2 text-xs font-semibold text-brand-charcoal/80 mb-2">
                      <MapPin className="w-4 h-4 text-brand-terracotta" />
                      Endereço de Cadastro
                    </div>
                    <p className="text-xs text-brand-charcoal/90">
                      {usuario.rua}, {usuario.numero} {usuario.complemento ? `(${usuario.complemento})` : ""}
                    </p>
                    <p className="text-xs text-brand-charcoal/60">
                      {usuario.bairro} — {usuario.cidade}/{usuario.uf}
                    </p>
                    <p className="text-xs text-brand-charcoal/45 font-mono">CEP: {usuario.cep}</p>
                  </div>

                  <div className="p-3 bg-brand-mint/10 border border-brand-mint/20 rounded-xl text-[11px] text-brand-mint-dark flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-brand-mint mt-0.5" />
                    <span>
                      Zero retrabalho: Seus dados estão salvos e serão preenchidos de forma automática na InfinitePay.
                    </span>
                  </div>
                </div>
              ) : (
                /* SE VISITANTE NÃO LOGADO: IDENTIFICAÇÃO OBRIGATÓRIA */
                <div className="space-y-4">
                  <div className="p-5 bg-brand-purple/5 border border-brand-purple/20 rounded-2xl text-center space-y-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-purple/10 text-brand-purple text-xs font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Identificação Obrigatória
                    </span>
                    <h3 className="text-sm font-bold text-brand-charcoal">
                      Conecte-se para finalizar sua compra
                    </h3>
                    <p className="text-xs text-brand-charcoal/70 leading-relaxed">
                      Para emitir seus ingressos com segurança e vincular suas vivências ao seu perfil, é necessário entrar na sua conta ou criar um cadastro rápido.
                    </p>

                    <div className="space-y-2 pt-2">
                      <Link
                        href="/login?redirect=/checkout"
                        className="inline-flex items-center justify-center gap-2 w-full py-3 bg-brand-purple hover:bg-brand-purple-dark text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-brand-purple/20 cursor-pointer"
                      >
                        <LogIn className="w-4 h-4" />
                        Já tenho conta — Fazer Login
                      </Link>

                      <Link
                        href="/cadastro?redirect=/checkout"
                        className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-white border border-brand-purple/30 hover:border-brand-purple text-brand-purple text-xs font-semibold rounded-xl transition-all cursor-pointer"
                      >
                        <User className="w-4 h-4" />
                        Criar cadastro novo (1 minuto)
                      </Link>
                    </div>
                  </div>

                  <div className="p-3 bg-brand-offwhite rounded-xl border border-brand-charcoal/10 space-y-1.5 text-[11px] text-brand-charcoal/65">
                    <p className="flex items-center gap-1.5 font-medium text-brand-charcoal/80">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-terracotta shrink-0" />
                      Seus itens continuam salvos no carrinho
                    </p>
                    <p className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-mint shrink-0" />
                      Cadastre uma única vez e nunca mais redigite seus dados
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-6">
              {erro && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                  {erro}
                </div>
              )}

              {usuario ? (
                <button
                  onClick={handleFinalizarPagamento}
                  disabled={processando}
                  className="w-full py-4 bg-brand-terracotta hover:bg-brand-terracotta-dark disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-brand-terracotta/25 cursor-pointer flex items-center justify-center gap-2"
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
              ) : (
                <Link
                  href="/login?redirect=/checkout"
                  className="w-full py-4 bg-brand-purple hover:bg-brand-purple-dark text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-brand-purple/25 cursor-pointer flex items-center justify-center gap-2 text-center"
                >
                  <LogIn className="w-4 h-4" />
                  Entrar para Pagar R$ {totalFinal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </Link>
              )}

              <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-brand-charcoal/60 text-center">
                <ShieldCheck className="w-4 h-4 text-brand-mint" />
                <span>Processamento oficial e seguro pela InfinitePay</span>
              </div>

              {/* Reassurance WhatsApp callout */}
              <div className="mt-4 pt-3 border-t border-brand-charcoal/10 text-center">
                <a
                  href={`https://wa.me/5511917452732?text=${encodeURIComponent(
                    `Olá! Estou no checkout reservando a vivência "${isCartCheckout ? (cartItems[0]?.nome || "Vivência Kalapa") : (produto?.nome || "Vivência Kalapa")}" e gostaria de tirar uma dúvida.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-brand-purple hover:text-brand-purple-dark font-medium transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Dúvidas sobre a vivência? Fale conosco no WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal de Transição Suave para o Gateway InfinitePay */}
      {(processando || redirecionando) && (
        <div className="fixed inset-0 z-50 bg-brand-charcoal/80 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border border-brand-terracotta/20 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Barra de progresso animada no topo */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-brand-charcoal/10 overflow-hidden">
              <div className="h-full bg-brand-terracotta animate-pulse w-full" />
            </div>

            {/* Ícone de segurança */}
            <div className="w-16 h-16 rounded-2xl bg-brand-terracotta/10 border border-brand-terracotta/25 text-brand-terracotta flex items-center justify-center mx-auto mb-5 shadow-xs">
              <ShieldCheck className="w-8 h-8 animate-pulse" />
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-purple/10 text-brand-purple text-xs font-bold tracking-wide mb-3">
              ✦ Ambiente Bancário Criptografado
            </span>

            <h3 className="text-xl font-bold text-brand-charcoal tracking-tight">
              {redirecionando
                ? "Conectando ao InfinitePay"
                : "Preparando sua Reserva..."}
            </h3>

            <p className="mt-2 text-xs sm:text-sm text-brand-charcoal/70 leading-relaxed">
              {redirecionando
                ? "Você está sendo direcionado com segurança para a plataforma oficial da InfinitePay para concluir o pagamento via Pix ou Cartão."
                : "Estamos registrando os dados da sua vivência com sigilo e preparando seu link oficial de pagamento."}
            </p>

            <div className="my-6 p-3.5 rounded-xl bg-brand-offwhite border border-brand-charcoal/10 flex items-center justify-center gap-3">
              <div className="w-5 h-5 border-2 border-brand-terracotta border-t-transparent rounded-full animate-spin shrink-0" />
              <span className="text-xs font-semibold text-brand-charcoal/80">
                Por favor, não feche nem recarregue esta página...
              </span>
            </div>

            <div className="flex items-center justify-center gap-2 text-[11px] text-brand-charcoal/50">
              <span className="font-semibold text-brand-charcoal/70">INstituto Kalapa</span>
              <span>•</span>
              <span>Checkout Oficial InfinitePay</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
