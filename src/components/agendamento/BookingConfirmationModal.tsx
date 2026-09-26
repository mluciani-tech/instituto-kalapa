"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Calendar,
  Clock,
  User,
  ShieldCheck,
  ArrowRight,
  LogIn,
  UserPlus,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { Produto, Therapist, TimeSlot, Usuario } from "@/lib/types";

interface BookingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  produto: Produto;
  terapeuta: Therapist;
  dateStr: string; // YYYY-MM-DD
  slot: TimeSlot;
  usuario: Usuario | null;
  onLoginSuccess: (user: Usuario) => void;
}

function formatDateFriendly(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return new Intl.DateTimeFormat("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  } catch {
    return dateStr;
  }
}

export default function BookingConfirmationModal({
  isOpen,
  onClose,
  produto,
  terapeuta,
  dateStr,
  slot,
  usuario,
  onLoginSuccess,
}: BookingConfirmationModalProps) {
  const router = useRouter();
  const { addItem, clearCart } = useCart();

  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [erro, setErro] = useState("");

  // Auth in-place states se não logado
  const [authTab, setAuthTab] = useState<"login" | "cadastro">("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginSenha, setLoginSenha] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authErro, setAuthErro] = useState("");

  // Cadastro rápido in-place
  const [cadNome, setCadNome] = useState("");
  const [cadEmail, setCadEmail] = useState("");
  const [cadTelefone, setCadTelefone] = useState("");
  const [cadCpf, setCadCpf] = useState("");
  const [cadSenha, setCadSenha] = useState("");

  if (!isOpen) return null;

  const precoFormatado = (produto.preco ?? 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthErro("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, senha: loginSenha }),
      });

      const data = await res.json();
      if (!res.ok || !data.usuario) {
        setAuthErro(data.error || "E-mail ou senha incorretos.");
        setAuthLoading(false);
        return;
      }

      onLoginSuccess(data.usuario);
    } catch {
      setAuthErro("Erro ao conectar com o servidor. Tente novamente.");
    }
    setAuthLoading(false);
  };

  const handleCadastroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthErro("");

    try {
      const res = await fetch("/api/auth/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: cadNome,
          email: cadEmail,
          telefone: cadTelefone,
          cpf: cadCpf,
          senha: cadSenha,
          // CEP e endereço padrão de placeholder se o usuário completar depois no checkout
          cep: "00000-000",
          rua: "Avenida Principal",
          numero: "S/N",
          bairro: "Centro",
          cidade: "São Paulo",
          uf: "SP",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.usuario) {
        setAuthErro(data.error || "Não foi possível criar sua conta. Verifique os dados.");
        setAuthLoading(false);
        return;
      }

      onLoginSuccess(data.usuario);
    } catch {
      setAuthErro("Erro ao realizar cadastro.");
    }
    setAuthLoading(false);
  };

  const handleConfirmarReserva = async () => {
    if (!usuario) {
      setErro("É necessário fazer login ou cadastrar-se para confirmar o horário.");
      return;
    }

    setSubmitting(true);
    setErro("");

    try {
      const res = await fetch("/api/agendamentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          therapist_id: terapeuta.id,
          produto_id: produto.id,
          start_time: slot.startTime,
          end_time: slot.endTime,
          notes,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.appointment_id) {
        setErro(data.error || "Não foi possível reservar este horário. Tente outro slot.");
        setSubmitting(false);
        return;
      }

      // Reserva realizada com sucesso! Guardar referências e direcionar ao Checkout
      const appointmentId = data.appointment_id;

      clearCart();
      addItem(
        {
          id: produto.id,
          slug: produto.slug,
          nome: `${produto.nome} (${slot.timeDisplay} às ${slot.timeEndDisplay})`,
          preco: produto.preco,
          imagem_url: produto.imagem_url,
          categoria: produto.categoria,
          agendamento_id: appointmentId,
          agendamento_inicio: slot.startTime,
          agendamento_fim: slot.endTime,
          terapeuta_nome: terapeuta.nome,
        },
        1
      );

      sessionStorage.setItem("produto_selecionado", produto.id);
      sessionStorage.setItem("agendamento_id", appointmentId);
      sessionStorage.setItem("agendamento_terapeuta", terapeuta.nome);
      sessionStorage.setItem("agendamento_data", dateStr);
      sessionStorage.setItem("agendamento_horario", `${slot.timeDisplay} às ${slot.timeEndDisplay}`);

      onClose();
      router.push("/checkout");
    } catch (err) {
      console.error("[BookingModal] Erro ao reservar:", err);
      setErro("Falha de conexão ao reservar horário. Tente novamente.");
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-charcoal/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-brand-charcoal/10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-brand-charcoal/10 flex items-center justify-between bg-brand-offwhite">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-terracotta/15 flex items-center justify-center text-brand-terracotta">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-brand-charcoal">Confirmar Atendimento</h3>
              <p className="text-xs text-brand-charcoal/60">Hold temporário de 15 minutos na agenda</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-brand-charcoal/40 hover:text-brand-charcoal hover:bg-brand-charcoal/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Card Resumo do Agendamento */}
          <div className="p-4 rounded-2xl bg-brand-offwhite/80 border border-brand-charcoal/10 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-terracotta">
                  {produto.nome}
                </span>
                <h4 className="text-sm font-semibold text-brand-charcoal mt-0.5">
                  Com {terapeuta.nome}
                </h4>
              </div>
              <span className="text-base font-bold text-brand-charcoal tabular-nums">
                {precoFormatado}
              </span>
            </div>

            <div className="pt-2 border-t border-brand-charcoal/10 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 text-brand-charcoal/80">
                <Calendar className="w-4 h-4 text-brand-terracotta shrink-0" />
                <span className="capitalize">{formatDateFriendly(dateStr)}</span>
              </div>
              <div className="flex items-center gap-2 text-brand-charcoal/80">
                <Clock className="w-4 h-4 text-brand-terracotta shrink-0" />
                <span>
                  {slot.timeDisplay} às {slot.timeEndDisplay} (50 min)
                </span>
              </div>
            </div>
          </div>

          {/* Se o usuário NÃO está logado: Formulário de Autenticação Suave */}
          {!usuario ? (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                <span>
                  Identifique-se para garantir este horário exclusivo em seu nome antes de seguir ao pagamento.
                </span>
              </div>

              {/* Tabs Login vs Cadastro */}
              <div className="flex border-b border-brand-charcoal/10">
                <button
                  type="button"
                  onClick={() => {
                    setAuthTab("login");
                    setAuthErro("");
                  }}
                  className={`flex-1 py-2 text-xs font-bold border-b-2 transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                    authTab === "login"
                      ? "border-brand-terracotta text-brand-terracotta"
                      : "border-transparent text-brand-charcoal/50 hover:text-brand-charcoal"
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Já sou cadastrado
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthTab("cadastro");
                    setAuthErro("");
                  }}
                  className={`flex-1 py-2 text-xs font-bold border-b-2 transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                    authTab === "cadastro"
                      ? "border-brand-terracotta text-brand-terracotta"
                      : "border-transparent text-brand-charcoal/50 hover:text-brand-charcoal"
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Criar conta rápida
                </button>
              </div>

              {authErro && (
                <div className="p-2.5 rounded-lg bg-red-50 text-red-700 text-xs border border-red-200">
                  {authErro}
                </div>
              )}

              {authTab === "login" ? (
                <form onSubmit={handleLoginSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-brand-charcoal mb-1">E-mail</label>
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-brand-charcoal/15 bg-white text-xs text-brand-charcoal focus:outline-hidden focus:border-brand-terracotta"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-brand-charcoal mb-1">Senha</label>
                    <input
                      type="password"
                      required
                      value={loginSenha}
                      onChange={(e) => setLoginSenha(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-brand-charcoal/15 bg-white text-xs text-brand-charcoal focus:outline-hidden focus:border-brand-terracotta"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-2.5 rounded-xl bg-brand-purple hover:bg-brand-purple-dark text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {authLoading ? "Entrando..." : "Entrar e Continuar"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleCadastroSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-brand-charcoal mb-1">Nome Completo</label>
                    <input
                      type="text"
                      required
                      value={cadNome}
                      onChange={(e) => setCadNome(e.target.value)}
                      placeholder="Seu nome completo"
                      className="w-full px-3.5 py-2 rounded-xl border border-brand-charcoal/15 bg-white text-xs text-brand-charcoal focus:outline-hidden focus:border-brand-terracotta"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-brand-charcoal mb-1">E-mail</label>
                      <input
                        type="email"
                        required
                        value={cadEmail}
                        onChange={(e) => setCadEmail(e.target.value)}
                        placeholder="seu@email.com"
                        className="w-full px-3.5 py-2 rounded-xl border border-brand-charcoal/15 bg-white text-xs text-brand-charcoal focus:outline-hidden focus:border-brand-terracotta"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-brand-charcoal mb-1">WhatsApp</label>
                      <input
                        type="tel"
                        required
                        value={cadTelefone}
                        onChange={(e) => setCadTelefone(e.target.value)}
                        placeholder="(11) 99999-9999"
                        className="w-full px-3.5 py-2 rounded-xl border border-brand-charcoal/15 bg-white text-xs text-brand-charcoal focus:outline-hidden focus:border-brand-terracotta"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-brand-charcoal mb-1">CPF</label>
                      <input
                        type="text"
                        required
                        value={cadCpf}
                        onChange={(e) => setCadCpf(e.target.value)}
                        placeholder="000.000.000-00"
                        className="w-full px-3.5 py-2 rounded-xl border border-brand-charcoal/15 bg-white text-xs text-brand-charcoal focus:outline-hidden focus:border-brand-terracotta"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-brand-charcoal mb-1">Senha</label>
                      <input
                        type="password"
                        required
                        value={cadSenha}
                        onChange={(e) => setCadSenha(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2 rounded-xl border border-brand-charcoal/15 bg-white text-xs text-brand-charcoal focus:outline-hidden focus:border-brand-terracotta"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-2.5 rounded-xl bg-brand-purple hover:bg-brand-purple-dark text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {authLoading ? "Criando conta..." : "Criar Conta e Continuar"}
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* Usuário já está logado */
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-brand-purple/5 border border-brand-purple/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-brand-purple" />
                  <div>
                    <span className="font-semibold text-brand-charcoal block">{usuario.nome}</span>
                    <span className="text-brand-charcoal/60">{usuario.email}</span>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-brand-mint bg-brand-mint/10 px-2 py-0.5 rounded-full">
                  Paciente Conectado
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-charcoal mb-1.5">
                  Observações ou foco principal para o atendimento (opcional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Se desejar, compartilhe brevemente o motivo da sua busca ou temas prioritários..."
                  className="w-full px-3.5 py-2 rounded-xl border border-brand-charcoal/15 bg-white text-xs text-brand-charcoal focus:outline-hidden focus:border-brand-terracotta"
                />
              </div>

              {erro && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
                  {erro}
                </div>
              )}

              <button
                type="button"
                onClick={handleConfirmarReserva}
                disabled={submitting}
                className="w-full py-3.5 px-5 font-bold text-sm rounded-xl bg-brand-terracotta hover:bg-brand-terracotta-dark text-white shadow-md shadow-brand-terracotta/25 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Bloqueando horário (Hold 15 min)...</span>
                  </>
                ) : (
                  <>
                    <span>Confirmar Reserva e Ir ao Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* Garantias de segurança */}
          <div className="pt-2 text-center">
            <div className="inline-flex items-center gap-1.5 text-[11px] text-brand-charcoal/60">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-mint" />
              <span>Cancelamento autônomo gratuito com até 24h de antecedência</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
