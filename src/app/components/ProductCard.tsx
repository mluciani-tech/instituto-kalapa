"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Check, ArrowRight, ShoppingBag, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import type { Produto, VagasInfo } from "@/lib/types";
import { isProdutoAgendamento, isProdutoCalendario, permiteCheckoutProduto } from "@/lib/agendamento";

export type { Produto };

import ProductShareMenu from "./ProductShareMenu";

interface ProductCardProps {
  produto: Produto;
  index?: number;
  vagas?: VagasInfo | null;
}

export default function ProductCard({ produto, index = 0, vagas }: ProductCardProps) {
  const router = useRouter();
  const { addItem, clearCart, openDrawer } = useCart();

  const isAgendamento = isProdutoAgendamento(produto);
  const isTeste = Boolean(produto.is_teste);
  const isCalendario = isProdutoCalendario(produto);
  const permiteCheckout = permiteCheckoutProduto(produto);

  const handleEscolher = () => {
    if (isAgendamento) {
      router.push(`/produtos/${produto.id}#agendamento`);
      return;
    }
    // Sincroniza o produto escolhido limpando itens anteriores e inserindo o produto direto
    clearCart();
    addItem({
      id: produto.id,
      slug: produto.slug,
      nome: produto.nome,
      preco: produto.preco,
      imagem_url: produto.imagem_url,
      categoria: produto.categoria,
      is_teste: isTeste,
      rota_teste: produto.rota_teste,
    }, 1);
    sessionStorage.setItem("produto_selecionado", produto.id);
    router.push("/checkout");
  };

  const preco = produto.preco ?? 0;
  const isGratuito = preco <= 0;
  const precoFormatado = isGratuito
    ? "Acesso Livre"
    : preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const temVagasExibiveis = !isTeste && !isAgendamento && permiteCheckout && Boolean(vagas);
  const vagasEsgotadas = temVagasExibiveis && vagas && vagas.restantes <= 0;
  const vagasQuaseEsgotadas = temVagasExibiveis && vagas && vagas.restantes > 0 && vagas.restantes <= 3;

  return (
    <motion.div
      id={`produto-${produto.slug || produto.id}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="scroll-mt-28"
    >
      <div className="group relative overflow-hidden flex flex-col bg-white rounded-2xl border border-[#B8965A]/30 hover:border-[#B8965A]/80 shadow-[0_4px_20px_-4px_rgba(184,150,90,0.12)] hover:shadow-[0_8px_30px_-4px_rgba(184,150,90,0.22)] transition-all duration-300">
          {/* Imagem */}
          <div className="relative h-48 overflow-hidden">
            <Link href={`/produtos/${produto.id}`} className="block w-full h-full">
              {produto.imagem_url ? (
                <Image
                  src={produto.imagem_url}
                  alt={produto.nome}
                  width={400}
                  height={300}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-brand-purple/20 to-brand-terracotta/20 flex items-center justify-center">
                  <span className="text-4xl">✦</span>
                </div>
              )}
            </Link>

            {/* Destaque Tag */}
            {produto.destaque && (
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-brand-terracotta text-white text-xs font-semibold tracking-wide shadow-xs">
                Destaque
              </div>
            )}
          </div>

          {/* Botão de Compartilhar com Popover */}
          <div className="absolute top-3 right-3 z-30">
            <ProductShareMenu produto={produto} variant="circle" />
          </div>

          {/* Conteúdo */}
          <div className="flex flex-col p-6">
            <h3 className="text-xl font-bold text-brand-charcoal mb-2 font-sans">
              <Link
                href={`/produtos/${produto.id}`}
                className="hover:text-brand-purple transition-colors"
              >
                {produto.nome}
              </Link>
            </h3>

            {produto.descricao_curta && (
              <p className="text-sm text-brand-charcoal/60 mb-3">{produto.descricao_curta}</p>
            )}

            {produto.descricao && (
              <ul className="space-y-1 mb-4">
                {produto.descricao.split("\n").filter((l) => l.trim()).map((linha) => (
                  <li key={linha} className="flex items-start gap-2 text-sm text-brand-charcoal/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-terracotta/50 mt-1.5 flex-shrink-0" />
                    {linha}
                  </li>
                ))}
              </ul>
            )}

            {/* Benefícios */}
            {produto.beneficios && produto.beneficios.length > 0 && (
              <ul className="space-y-2 mb-4">
                {produto.beneficios.slice(0, 3).map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-brand-charcoal/70">
                    <Check aria-hidden="true" className="w-4 h-4 text-brand-mint flex-shrink-0 mt-0.5" />
                    {b}
                  </li>
                ))}
              </ul>
            )}

            {/* Indicador de agendamento, teste ou contador de vagas */}
            {isAgendamento ? (
              <div className="mb-4 flex items-center gap-2 text-xs text-brand-charcoal/70 bg-brand-terracotta/10 px-3.5 py-2.5 rounded-xl border border-brand-terracotta/25">
                <Calendar className="w-4 h-4 text-brand-terracotta shrink-0" />
                <span className="font-medium text-brand-charcoal">Sessão individual · Escolha seu horário na agenda</span>
              </div>
            ) : isTeste ? (
              <div className="mb-4 flex items-center justify-between text-xs text-brand-charcoal/80 bg-emerald-50 px-3.5 py-2.5 rounded-xl border border-emerald-200/60">
                <div className="flex items-center gap-1.5 font-medium text-emerald-950">
                  <span>🧠</span>
                  <span>Avaliação Online</span>
                </div>
                {produto.inclui_laudo_pdf !== false && (
                  <span className="text-[11px] font-semibold text-emerald-800 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                    Laudo PDF Incluso
                  </span>
                )}
              </div>
            ) : temVagasExibiveis && vagas && (
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-brand-charcoal/60">
                    Vagas da próxima turma
                  </span>
                  <span className={`font-bold tabular-nums ${vagasEsgotadas ? 'text-red-500' : vagasQuaseEsgotadas ? 'text-brand-terracotta' : 'text-brand-charcoal'}`}>
                    {vagas.preenchidas}/{vagas.maximas}
                  </span>
                </div>
                <div className="w-full bg-brand-charcoal/10 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-[width] duration-500 ${
                      vagasEsgotadas ? 'bg-red-400' : vagasQuaseEsgotadas ? 'bg-brand-terracotta' : 'bg-brand-mint'
                    }`}
                    style={{ width: `${Math.min(Math.max((vagas.preenchidas / (vagas.maximas || 1)) * 100, 0), 100)}%` }}
                  />
                </div>
                <p className={`text-xs mt-1 ${vagasEsgotadas ? 'text-red-500 font-semibold' : vagasQuaseEsgotadas ? 'text-brand-terracotta font-semibold' : 'text-brand-charcoal/45'}`}>
                  {vagasEsgotadas
                    ? 'Turma lotada'
                    : vagasQuaseEsgotadas
                      ? `Última${vagas.restantes === 1 ? '' : 's'} ${vagas.restantes} vaga${vagas.restantes === 1 ? '' : 's'}!`
                      : `Grupos reduzidos — máximo ${vagas.maximas} participantes`
                  }
                </p>
              </div>
            )}

            {/* Preço + CTA ou Modo Informativo */}
            <div className="pt-4 border-t border-brand-charcoal/10">
              {permiteCheckout ? (
                <>
                  <div className="flex items-end gap-1 mb-3">
                    <span className={`font-bold text-brand-charcoal tabular-nums ${isGratuito ? 'text-2xl text-emerald-600' : 'text-3xl'}`}>
                      {precoFormatado}
                    </span>
                    {!isGratuito && (
                      <span className="text-sm text-brand-charcoal/45 mb-1">
                        {isTeste ? "/ avaliação" : "/ sessão"}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    {isAgendamento ? (
                      <Link
                        href={`/produtos/${produto.id}#agendamento`}
                        className="w-full py-3.5 px-4 font-bold text-xs md:text-sm rounded-xl bg-brand-terracotta hover:bg-brand-terracotta-dark text-white shadow-md shadow-brand-terracotta/20 hover:shadow-brand-terracotta/35 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer touch-manipulation"
                      >
                        <Calendar className="w-4 h-4 text-white shrink-0" />
                        <span>Ver Agenda & Horários</span>
                        <ArrowRight className="w-4 h-4 ml-auto shrink-0" />
                      </Link>
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
                              is_teste: isTeste,
                              rota_teste: produto.rota_teste,
                            });
                            openDrawer();
                          }}
                          disabled={!!vagasEsgotadas}
                          className="flex-1 py-3 px-3 font-medium text-xs md:text-sm rounded-xl border border-brand-purple/20 bg-brand-purple/5 hover:bg-brand-purple/10 text-brand-purple transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
                          title={isTeste ? "Adicionar ao carrinho" : "Adicionar à sua lista de reserva"}
                        >
                          <ShoppingBag aria-hidden="true" className="w-4 h-4" />
                          {isTeste ? "Carrinho" : "Reservar"}
                        </button>

                        <button
                          onClick={handleEscolher}
                          disabled={!!vagasEsgotadas}
                          className={`flex-1 py-3 px-4 font-semibold text-xs md:text-sm rounded-xl transition-[background-color,box-shadow,transform] duration-300 flex items-center justify-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta focus-visible:ring-offset-2 ${
                            vagasEsgotadas
                              ? 'bg-brand-charcoal/10 text-brand-charcoal/40 cursor-not-allowed'
                              : 'bg-brand-terracotta hover:bg-brand-terracotta-dark text-white shadow-md shadow-brand-terracotta/20 hover:shadow-brand-terracotta/35 hover:-translate-y-0.5'
                          }`}
                        >
                          {vagasEsgotadas ? 'Turma lotada' : (
                            <>
                              {isTeste ? "Comprar Agora" : "Garantir Vaga"}
                              <ArrowRight aria-hidden="true" className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    href={`/produtos/${produto.id}`}
                    className="w-full py-3 px-4 font-semibold text-xs md:text-sm rounded-xl border border-brand-terracotta/40 bg-brand-terracotta/5 hover:bg-brand-terracotta/15 text-brand-terracotta hover:text-brand-terracotta-dark transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xs hover:-translate-y-0.5 active:scale-[0.98]"
                  >
                    <Calendar className="w-4 h-4 text-brand-terracotta shrink-0" />
                    <span>Ver Detalhes do Evento</span>
                    <ArrowRight className="w-4 h-4 ml-auto shrink-0" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
    </motion.div>
  );
}
