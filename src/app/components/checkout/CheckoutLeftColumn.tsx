import Link from "next/link";
import Image from "next/image";
import { Package, Calendar, Tag, AlertCircle, ArrowRight } from "lucide-react";
import AcompanhanteForm, { AcompanhanteItem } from "./AcompanhanteForm";
import type { Produto } from "@/lib/types";

interface CartItem {
  produto_id: string;
  nome: string;
  slug: string;
  categoria?: string | null;
  preco: number;
  quantidade: number;
  imagem_url?: string | null;
}

interface CheckoutLeftColumnProps {
  isCartCheckout: boolean;
  cartItems: CartItem[];
  produto: Produto | null;
  agendamentoInfo: { id: string; terapeuta: string; data: string; horario: string; } | null;
  agendamentoPendente: boolean;
  atendimentoCartItem: CartItem | null | undefined;
  atendimentoSingle: Produto | null | undefined;
  targetAgendamentoId: string;
  subtotal: number;
  valorDesconto: number;
  totalFinal: number;
  acompanhantes: AcompanhanteItem[];
  setAcompanhantes: React.Dispatch<React.SetStateAction<AcompanhanteItem[]>>;
  formatPhone: (val: string) => string;
  cupomAplicado: { codigo: string; desconto: number; totalComDesconto: number } | null;
  cupomInput: string;
  setCupomInput: React.Dispatch<React.SetStateAction<string>>;
  validandoCupom: boolean;
  cupomErro: string;
  handleAplicarCupom: (e: React.FormEvent) => void;
  handleRemoverCupom: () => void;
}

export default function CheckoutLeftColumn({
  isCartCheckout,
  cartItems,
  produto,
  agendamentoInfo,
  agendamentoPendente,
  atendimentoCartItem,
  atendimentoSingle,
  targetAgendamentoId,
  subtotal,
  valorDesconto,
  totalFinal,
  acompanhantes,
  setAcompanhantes,
  formatPhone,
  cupomAplicado,
  cupomInput,
  setCupomInput,
  validandoCupom,
  cupomErro,
  handleAplicarCupom,
  handleRemoverCupom,
}: CheckoutLeftColumnProps) {
  return (
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

        {/* Card de Agendamento Pré-Reservado se houver */}
        {agendamentoInfo && (
          <div className="mb-4 p-4 rounded-2xl bg-brand-terracotta/10 border border-brand-terracotta/30 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-brand-terracotta/20 flex items-center justify-center text-brand-terracotta shrink-0 mt-0.5">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-terracotta">
                  Horário Pré-Reservado (Hold 15 min)
                </span>
                <span className="text-[10px] bg-brand-terracotta text-white px-2 py-0.5 rounded-full font-bold">
                  Exclusivo
                </span>
              </div>
              <p className="text-xs font-bold text-brand-charcoal mt-0.5">
                Atendimento com {agendamentoInfo.terapeuta}
              </p>
              <p className="text-xs text-brand-charcoal/80">
                🗓️ {agendamentoInfo.data} às {agendamentoInfo.horario} (50 min)
              </p>
            </div>
          </div>
        )}

        {/* Alerta de Horário Não Selecionado se for Atendimento */}
        {agendamentoPendente && (
          <div className="mb-4 p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block">
                Horário não agendado
              </span>
              <p className="text-xs font-bold text-brand-charcoal mt-0.5">
                {atendimentoCartItem?.nome || atendimentoSingle?.nome || "Atendimento Individual"}
              </p>
              <p className="text-xs text-brand-charcoal/70 mt-1 leading-relaxed">
                Este atendimento exige a escolha prévia de um dia e horário na agenda antes do pagamento.
              </p>
              <div className="mt-2.5">
                <Link
                  href={`/produtos/${targetAgendamentoId}#agendamento`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-terracotta hover:bg-brand-terracotta-dark text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Abrir Agenda Disponível</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

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
        <AcompanhanteForm
          acompanhantes={acompanhantes}
          setAcompanhantes={setAcompanhantes}
          formatPhone={formatPhone}
        />

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
  );
}
