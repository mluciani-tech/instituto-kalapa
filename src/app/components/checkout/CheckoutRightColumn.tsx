import Link from "next/link";
import { User, MapPin, CheckCircle2, ShieldCheck, LogIn, AlertCircle, Calendar, ArrowRight, ExternalLink } from "lucide-react";
import type { Usuario, Produto } from "@/lib/types";

interface CartItem {
  produto_id: string;
  nome: string;
  slug: string;
  categoria?: string | null;
  preco: number;
  quantidade: number;
  imagem_url?: string | null;
}

interface CheckoutRightColumnProps {
  usuario: Usuario | null;
  erro: string;
  agendamentoPendente: boolean;
  targetAgendamentoId: string;
  handleFinalizarPagamento: () => void;
  processando: boolean;
  totalFinal: number;
  isCartCheckout: boolean;
  cartItems: CartItem[];
  produto: Produto | null;
}

export default function CheckoutRightColumn({
  usuario,
  erro,
  agendamentoPendente,
  targetAgendamentoId,
  handleFinalizarPagamento,
  processando,
  totalFinal,
  isCartCheckout,
  cartItems,
  produto,
}: CheckoutRightColumnProps) {
  return (
    <div className="md:col-span-5 bg-white border border-brand-charcoal/10 rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-md">
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-brand-terracotta pb-4 mb-4 border-b border-brand-charcoal/10">
          Identificação do Pagamento
        </h2>

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

        {agendamentoPendente ? (
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs">
              <p className="font-bold flex items-center gap-1.5 mb-1">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                Agendamento Obrigatório Antes do Pagamento
              </p>
              <p className="leading-relaxed">
                Para este atendimento terapêutico individual, você deve primeiro escolher o dia e horário na agenda da terapeuta.
              </p>
            </div>
            <Link
              href={`/produtos/${targetAgendamentoId}#agendamento`}
              className="w-full py-4 bg-brand-terracotta hover:bg-brand-terracotta-dark text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-brand-terracotta/25 cursor-pointer flex items-center justify-center gap-2 text-center"
            >
              <Calendar className="w-4 h-4" />
              <span>Escolher Data e Horário na Agenda</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : usuario ? (
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
  );
}
