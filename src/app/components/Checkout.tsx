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
  Calendar,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import CheckoutLeftColumn from "./checkout/CheckoutLeftColumn";
import CheckoutRightColumn from "./checkout/CheckoutRightColumn";
import type { Produto, Usuario } from "@/lib/types";
import { isProdutoAgendamento } from "@/lib/agendamento";

import AcompanhanteForm, { AcompanhanteItem } from "./checkout/AcompanhanteForm";

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

  const [agendamentoInfo, setAgendamentoInfo] = useState<{
    id: string;
    terapeuta: string;
    data: string;
    horario: string;
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

        // 4. Carregar agendamento pré-reservado se existir
        const savedApptId = typeof window !== "undefined" ? sessionStorage.getItem("agendamento_id") : null;
        const savedTerapeuta = typeof window !== "undefined" ? sessionStorage.getItem("agendamento_terapeuta") : null;
        const savedData = typeof window !== "undefined" ? sessionStorage.getItem("agendamento_data") : null;
        const savedHorario = typeof window !== "undefined" ? sessionStorage.getItem("agendamento_horario") : null;

        if (savedApptId) {
          setAgendamentoInfo({
            id: savedApptId,
            terapeuta: savedTerapeuta || "Clatihúcia Capeli",
            data: savedData ? savedData.split("-").reverse().join("/") : "",
            horario: savedHorario || "",
          });
        }
      } catch {
        // ignore
      }
      setLoading(false);
    };
    fetchData();
  }, []);


  const isCartCheckout = cartItems.length > 0;

  // Verifica se o checkout contém atendimento que exige agendamento prévio
  const atendimentoCartItem = isCartCheckout
    ? cartItems.find((i) => isProdutoAgendamento({ slug: i.slug, categoria: i.categoria, nome: i.nome }))
    : null;
  const atendimentoSingle = !isCartCheckout && produto && isProdutoAgendamento(produto)
    ? produto
    : null;
  const precisaAgendamento = !!(atendimentoCartItem || atendimentoSingle);
  const temAgendamentoValido = !!agendamentoInfo?.id;
  const agendamentoPendente = precisaAgendamento && !temAgendamentoValido;
  const targetAgendamentoId = atendimentoCartItem?.produto_id || atendimentoSingle?.id || "atendimentos";

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
      const itensEnvio = isCartCheckout 
        ? cartItems 
        : (produto ? [{
            produto_id: produto.id,
            slug: produto.slug,
            nome: produto.nome,
            preco: produto.preco || 0,
            quantidade: 1
          }] : []);

      const res = await fetch("/api/cupons/validar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          codigo: cupomInput.trim(),
          subtotal,
          itens: itensEnvio,
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

    if (agendamentoPendente) {
      setErro("Para atendimentos terapêuticos, é obrigatório selecionar uma data e horário na agenda antes do pagamento.");
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

      const agendamentoId = agendamentoInfo?.id
        || (typeof window !== "undefined" ? sessionStorage.getItem("agendamento_id") : null)
        || cartItems.find((i) => i.agendamento_id)?.agendamento_id
        || null;

      const bodyPayload: Record<string, unknown> = {
        cupom_codigo: cupomAplicado?.codigo || null,
        pedido_origem_id: pedidoOrigemId || null,
        agendamento_id: agendamentoId,
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
        sessionStorage.removeItem("agendamento_id");
        sessionStorage.removeItem("agendamento_terapeuta");
        sessionStorage.removeItem("agendamento_data");
        sessionStorage.removeItem("agendamento_horario");
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
          <CheckoutLeftColumn
            isCartCheckout={isCartCheckout}
            cartItems={cartItems}
            produto={produto}
            agendamentoInfo={agendamentoInfo}
            agendamentoPendente={agendamentoPendente}
            atendimentoCartItem={atendimentoCartItem}
            atendimentoSingle={atendimentoSingle}
            targetAgendamentoId={targetAgendamentoId}
            subtotal={subtotal}
            valorDesconto={valorDesconto}
            totalFinal={totalFinal}
            acompanhantes={acompanhantes}
            setAcompanhantes={setAcompanhantes}
            formatPhone={formatPhone}
            cupomAplicado={cupomAplicado}
            cupomInput={cupomInput}
            setCupomInput={setCupomInput}
            validandoCupom={validandoCupom}
            cupomErro={cupomErro}
            handleAplicarCupom={handleAplicarCupom}
            handleRemoverCupom={handleRemoverCupom}
          />
          <CheckoutRightColumn
            usuario={usuario}
            erro={erro}
            agendamentoPendente={agendamentoPendente}
            targetAgendamentoId={targetAgendamentoId}
            handleFinalizarPagamento={handleFinalizarPagamento}
            processando={processando}
            totalFinal={totalFinal}
            isCartCheckout={isCartCheckout}
            cartItems={cartItems}
            produto={produto}
          />
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
