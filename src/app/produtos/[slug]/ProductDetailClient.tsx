"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  ArrowRight, 
  ShoppingBag, 
  Check, 
  Sparkles,
  MessageCircle,
  ShieldCheck,
  Calendar
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { Produto, VagasInfo } from "@/lib/types";
import ProductAppointmentSection from "@/components/agendamento/ProductAppointmentSection";
import { isProdutoAgendamento } from "@/lib/agendamento";
import ProductShareMenu from "@/app/components/ProductShareMenu";

interface ProductDetailClientProps {
  produto: Produto;
  vagas: VagasInfo | null;
}

export default function ProductDetailClient({ produto, vagas }: ProductDetailClientProps) {
  const router = useRouter();
  const { addItem, clearCart, openDrawer } = useCart();

  const isAgendamento = isProdutoAgendamento(produto);

  useEffect(() => {
    if (typeof window !== "undefined" && isAgendamento) {
      const hash = window.location.hash;
      if (hash === "#agendamento" || hash === "#agendamento-section") {
        setTimeout(() => {
          const el = document.getElementById("agendamento") || document.getElementById("agendamento-section");
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }, 300);
      }
    }
  }, [isAgendamento]);

  const preco = produto.preco ?? 0;
  const isGratuito = preco <= 0;
  const precoFormatado = isGratuito
    ? "Gratuito"
    : preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const vagasEsgotadas = !isAgendamento && vagas && vagas.restantes <= 0;
  const vagasQuaseEsgotadas = !isAgendamento && vagas && vagas.restantes > 0 && vagas.restantes <= 3;

  const handleComprarAgora = () => {
    clearCart();
    addItem(
      {
        id: produto.id,
        slug: produto.slug,
        nome: produto.nome,
        preco: produto.preco,
        imagem_url: produto.imagem_url,
        categoria: produto.categoria,
      },
      1
    );
    sessionStorage.setItem("produto_selecionado", produto.id);
    router.push("/checkout");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-16">
      {/* Navegação Voltar e Compartilhar */}
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/produtos"
          className="inline-flex items-center gap-2 text-sm text-brand-charcoal/70 hover:text-brand-purple transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para todos os serviços
        </Link>

        {/* Menu de Compartilhamento na barra superior */}
        <ProductShareMenu produto={produto} variant="button" align="right" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Coluna Visual (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-4/3 w-full rounded-2xl border border-[#B8965A]/30 shadow-lg bg-white">
            <div className="relative w-full h-full rounded-2xl overflow-hidden">
              {produto.imagem_url ? (
                <Image
                  src={produto.imagem_url}
                  alt={produto.nome}
                  fill
                  priority
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-brand-purple/20 to-brand-terracotta/20 flex items-center justify-center">
                  <span className="text-6xl">✦</span>
                </div>
              )}
              {produto.destaque && (
                <div className="absolute top-4 left-4 px-3.5 py-1 rounded-full bg-brand-terracotta text-white text-xs font-bold tracking-wide shadow-md">
                  Destaque
                </div>
              )}
            </div>

            {/* Botão de Compartilhar circular no canto da foto */}
            <div className="absolute top-4 right-4 z-20">
              <ProductShareMenu produto={produto} variant="circle" align="right" />
            </div>
          </div>

          {/* Dúvidas via WhatsApp */}
          <div className="p-4 rounded-2xl bg-white border border-brand-terracotta/20 shadow-xs flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-brand-charcoal">
                Dúvidas sobre esta vivência?
              </p>
              <p className="text-[11px] text-brand-charcoal/60 mt-0.5">
                Fale conosco antes de reservar
              </p>
            </div>
            <a
              href={`https://wa.me/5511917452732?text=${encodeURIComponent(
                `Olá! Gostaria de mais informações sobre "${produto.nome}" no INstituto Kalapa.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 px-3 py-2 rounded-xl bg-brand-purple/10 hover:bg-brand-purple/20 text-brand-purple text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5 text-brand-mint" />
              WhatsApp
            </a>
          </div>
        </div>

        {/* Coluna de Informações e Compra (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-brand-charcoal/10 rounded-2xl p-6 sm:p-8 shadow-md">
          <div className="mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-purple/10 text-brand-purple text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              {produto.categoria || "Vivência Terapêutica"}
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-charcoal font-sans tracking-tight">
              {produto.nome}
            </h1>
            {produto.descricao_curta && (
              <p className="mt-2 text-base text-brand-charcoal/70 font-medium">
                {produto.descricao_curta}
              </p>
            )}
          </div>

          {/* Aviso destacado de agendamento obrigatório */}
          {isAgendamento && (
            <div className="mb-6 p-4 rounded-2xl bg-brand-terracotta/10 border border-brand-terracotta/25 flex items-start gap-3.5 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-brand-terracotta/20 flex items-center justify-center text-brand-terracotta shrink-0 mt-0.5">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-brand-charcoal uppercase tracking-wider">
                  Etapa 1: Agendamento Obrigatório
                </h4>
                <p className="text-xs text-brand-charcoal/75 mt-0.5 leading-relaxed">
                  Para este atendimento terapêutico individual, selecione o dia e o horário disponível na agenda abaixo. O pagamento no checkout só ocorre após você confirmar seu horário pré-reservado.
                </p>
              </div>
            </div>
          )}

          {/* Contador de vagas se aplicável */}
          {!isAgendamento && vagas && (
            <div className="mb-6 p-4 rounded-xl bg-brand-offwhite border border-brand-charcoal/10">
              <div className="flex items-center justify-between text-xs sm:text-sm mb-1.5">
                <span className="text-brand-charcoal/70 font-medium">
                  Vagas da próxima turma
                </span>
                <span
                  className={`font-bold tabular-nums ${
                    vagasEsgotadas
                      ? "text-red-500"
                      : vagasQuaseEsgotadas
                      ? "text-brand-terracotta"
                      : "text-brand-charcoal"
                  }`}
                >
                  {vagas.preenchidas}/{vagas.maximas}
                </span>
              </div>
              <div className="w-full bg-brand-charcoal/10 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    vagasEsgotadas
                      ? "bg-red-400"
                      : vagasQuaseEsgotadas
                      ? "bg-brand-terracotta"
                      : "bg-brand-mint"
                  }`}
                  style={{
                    width: `${Math.min(
                      Math.max((vagas.preenchidas / (vagas.maximas || 1)) * 100, 0),
                      100
                    )}%`,
                  }}
                />
              </div>
              <p
                className={`text-xs mt-1.5 ${
                  vagasEsgotadas
                    ? "text-red-500 font-semibold"
                    : vagasQuaseEsgotadas
                    ? "text-brand-terracotta font-semibold"
                    : "text-brand-charcoal/50"
                }`}
              >
                {vagasEsgotadas
                  ? "Turma lotada no momento"
                  : vagasQuaseEsgotadas
                  ? `Últimas ${vagas.restantes} vagas disponíveis!`
                  : `Grupos reduzidos — máximo de ${vagas.maximas} participantes`}
              </p>
            </div>
          )}

          {/* Descrição detalhada */}
          {produto.descricao && (
            <div className="mb-6 space-y-2 text-sm text-brand-charcoal/80 leading-relaxed">
              {produto.descricao.split("\n").filter((l) => l.trim()).map((linha, idx) => (
                <p key={idx}>{linha}</p>
              ))}
            </div>
          )}

          {/* Benefícios */}
          {produto.beneficios && produto.beneficios.length > 0 && (
            <div className="mb-8 pt-4 border-t border-brand-charcoal/10">
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-charcoal/60 mb-3">
                O que está incluído
              </h3>
              <ul className="space-y-2.5">
                {produto.beneficios.map((b, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-brand-charcoal/80">
                    <Check className="w-4 h-4 text-brand-mint shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Preço e Ações de Compra */}
          <div className="pt-6 border-t border-brand-charcoal/10">
            <div className="flex items-baseline gap-2 mb-5">
              <span className="text-3xl sm:text-4xl font-bold text-brand-charcoal tabular-nums">
                {precoFormatado}
              </span>
              {!isGratuito && (
                <span className="text-sm text-brand-charcoal/50">/ sessão</span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {isAgendamento ? (
                <a
                  href="#agendamento"
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById("agendamento") || document.getElementById("agendamento-section");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="flex-1 py-3.5 px-4 sm:px-5 font-bold text-xs sm:text-sm rounded-xl bg-brand-terracotta hover:bg-brand-terracotta-dark text-white shadow-md shadow-brand-terracotta/25 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer touch-manipulation"
                >
                  <Calendar className="w-4 h-4 text-white shrink-0" />
                  <span className="truncate">Escolher Data e Horário na Agenda</span>
                  <ArrowRight className="w-4 h-4 ml-auto shrink-0" />
                </a>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      addItem({
                        id: produto.id,
                        slug: produto.slug,
                        nome: produto.nome,
                        preco: produto.preco,
                        imagem_url: produto.imagem_url,
                        categoria: produto.categoria,
                      });
                      openDrawer();
                    }}
                    disabled={!!vagasEsgotadas}
                    className="flex-1 py-3.5 px-4 font-semibold text-sm rounded-xl border border-brand-purple/30 bg-brand-purple/5 hover:bg-brand-purple/10 text-brand-purple transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Adicionar à Reserva
                  </button>

                  <button
                    type="button"
                    onClick={handleComprarAgora}
                    disabled={!!vagasEsgotadas}
                    className={`flex-1 py-3.5 px-5 font-bold text-sm rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md cursor-pointer ${
                      vagasEsgotadas
                        ? "bg-brand-charcoal/10 text-brand-charcoal/40 cursor-not-allowed"
                        : "bg-brand-terracotta hover:bg-brand-terracotta-dark text-white shadow-brand-terracotta/25 hover:-translate-y-0.5"
                    }`}
                  >
                    {vagasEsgotadas ? (
                      "Turma Lotada"
                    ) : (
                      <>
                        <span>Garantir Vaga</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-brand-charcoal/50 mt-4">
              <ShieldCheck className="w-4 h-4 text-brand-mint" />
              <span>Pagamento seguro e confirmação imediata</span>
            </div>
          </div>
        </div>
      </div>

      {/* Módulo de Agendamento Nativo para Atendimentos Individuais */}
      {isAgendamento && (
        <div id="agendamento-section" className="scroll-mt-10">
          <ProductAppointmentSection produto={produto} />
        </div>
      )}
    </div>
  );
}

