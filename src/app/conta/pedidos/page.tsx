"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, Package, Loader2, XCircle, KeyRound, ShoppingBag, AlertCircle, Calendar, Clock, Phone } from "lucide-react";
import Footer from "../../components/Footer";
import ModalAlterarSenha from "@/components/ModalAlterarSenha";
import { useCart } from "@/context/CartContext";
import type { Pedido, Usuario, Appointment } from "@/lib/types";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(iso));
}

export default function MeusPedidosPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [agendamentos, setAgendamentos] = useState<Appointment[]>([]);
  const [activeTab, setActiveTab] = useState<"pedidos" | "consultas">("pedidos");
  const [loading, setLoading] = useState(true);
  const [cancelandoId, setCancelandoId] = useState<string | null>(null);
  const [cancelandoApptId, setCancelandoApptId] = useState<string | null>(null);
  const [retomandoId, setRetomandoId] = useState<string | null>(null);
  const [erroRetomada, setErroRetomada] = useState<{ [pedidoId: string]: string }>({});
  const [modalSenhaOpen, setModalSenhaOpen] = useState(false);
  const { setCartItems } = useCart();

  const fetchPedidos = useCallback(async () => {
    try {
      const authRes = await fetch("/api/auth/me");
      if (!authRes.ok) {
        router.push("/login?redirect=/conta/pedidos");
        return;
      }
      const authData = await authRes.json();
      if (!authData.authenticated || !authData.usuario) {
        router.push("/login?redirect=/conta/pedidos");
        return;
      }
      setUsuario(authData.usuario);

      const [pedidosRes, apptsRes] = await Promise.all([
        fetch("/api/cliente/pedidos"),
        fetch("/api/agendamentos"),
      ]);

      if (pedidosRes.ok) {
        const data = await pedidosRes.json();
        setPedidos(data);
      }

      if (apptsRes.ok) {
        const apptData = await apptsRes.json();
        setAgendamentos(apptData || []);
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }, [router]);


  useEffect(() => {
    fetchPedidos();
  }, [fetchPedidos]);

  const handleCancelarPedido = async (id: string) => {
    if (!confirm("Deseja realmente cancelar este pedido pendente?")) return;
    setCancelandoId(id);
    try {
      const res = await fetch(`/api/cliente/pedidos/${id}/cancelar`, {
        method: "POST",
      });
      if (res.ok) {
        await fetchPedidos();
      } else {
        const d = await res.json();
        alert(d.error || "Erro ao cancelar pedido");
      }
    } catch {
      alert("Erro ao cancelar pedido");
    }
    setCancelandoId(null);
  };

  const handleCancelarAgendamento = async (id: string) => {
    if (!confirm("Deseja realmente cancelar este atendimento? O horário será liberado na agenda.")) return;
    setCancelandoApptId(id);
    try {
      const res = await fetch(`/api/agendamentos/${id}/cancelar`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        alert("Atendimento cancelado com sucesso.");
        await fetchPedidos();
      } else {
        alert(data.error || "Erro ao cancelar atendimento.");
      }
    } catch {
      alert("Erro ao conectar com o servidor.");
    }
    setCancelandoApptId(null);
  };


  const handleRetomarPedido = async (pedidoId: string) => {
    setRetomandoId(pedidoId);
    setErroRetomada((prev) => ({ ...prev, [pedidoId]: "" }));
    try {
      const res = await fetch(`/api/cliente/pedidos/${pedidoId}/retomar`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setErroRetomada((prev) => ({
          ...prev,
          [pedidoId]: data.error || "Não foi possível retomar este pedido.",
        }));
        setRetomandoId(null);
        return;
      }

      // Guardar pedido_origem_id na sessão para vincular e substituir ao finalizar o checkout
      if (typeof window !== "undefined") {
        sessionStorage.setItem("pedido_retomado_id", pedidoId);
        if (data.beneficiarios && data.beneficiarios.length > 0) {
          sessionStorage.setItem("pedido_retomado_beneficiarios", JSON.stringify(data.beneficiarios));
        } else {
          sessionStorage.removeItem("pedido_retomado_beneficiarios");
        }
        if (data.cupom_codigo) {
          sessionStorage.setItem("pedido_retomado_cupom", data.cupom_codigo);
        } else {
          sessionStorage.removeItem("pedido_retomado_cupom");
        }
      }

      // Atualizar itens no carrinho global
      setCartItems(data.itens);

      // Redirecionar para o Checkout
      router.push("/checkout");
    } catch {
      setErroRetomada((prev) => ({
        ...prev,
        [pedidoId]: "Erro de conexão ao retomar pedido. Tente novamente.",
      }));
      setRetomandoId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-charcoal relative flex items-center justify-center text-white">
        <div className="absolute inset-0 cinematic-gradient" />
        <Loader2 className="w-10 h-10 animate-spin text-brand-terracotta relative z-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-charcoal relative flex flex-col justify-between font-sans">
      {/* Background Cinematográfico Kalapa */}
      <div className="absolute inset-0 cinematic-gradient opacity-95 pointer-events-none" />
      <div className="absolute inset-0 cinematic-overlay opacity-60 pointer-events-none" />

      <div className="relative z-10 flex-1 pt-28 pb-16 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Barra Superior */}
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-medium text-white/50 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para a loja
            </Link>

            {usuario && (
              <div className="flex items-center gap-3">
                <span className="text-xs text-white/60 hidden sm:inline">
                  Conectado como <strong className="text-brand-terracotta font-semibold">{usuario.nome.split(" ")[0]}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setModalSenhaOpen(true)}
                  className="px-3 py-1.5 text-xs font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5 text-brand-terracotta" />
                  Alterar Senha
                </button>
              </div>
            )}
          </div>

          {/* Título com estilo Kalapa */}
          <div className="mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/70 text-xs font-semibold tracking-wide mb-3 border border-white/10">
              ✦ Área do Cliente
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Minha Conta
            </h1>
            <p className="text-xs md:text-sm text-white/50 mt-1">
              Acompanhe suas inscrições, vivências, agendamentos terapêuticos e comprovantes
            </p>
          </div>

          {/* Sub-Tabs: Pedidos vs Consultas */}
          <div className="flex gap-2 mb-6 border-b border-white/10 pb-3">
            <button
              type="button"
              onClick={() => setActiveTab("pedidos")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "pedidos"
                  ? "bg-brand-terracotta text-white shadow-md shadow-brand-terracotta/20"
                  : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Meus Pedidos ({pedidos.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("consultas")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "consultas"
                  ? "bg-brand-terracotta text-white shadow-md shadow-brand-terracotta/20"
                  : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Minhas Consultas & Atendimentos ({agendamentos.length})</span>
            </button>
          </div>

          {activeTab === "pedidos" ? (
            /* Lista de cards */
            pedidos.length === 0 ? (
              <div className="glass-card border border-white/10 rounded-2xl p-12 text-center shadow-xl">
                <Package className="w-14 h-14 text-white/25 mx-auto mb-4" />
                <h2 className="text-base font-semibold text-white mb-1">
                  Nenhum pedido encontrado
                </h2>

              <p className="text-xs text-white/50 max-w-sm mx-auto mb-6">
                Você ainda não realizou nenhum pedido no INstituto Kalapa. Conheça nossas vivências e atendimentos.
              </p>
              <Link
                href="/produtos"
                className="inline-block px-6 py-3 bg-brand-terracotta hover:bg-brand-terracotta-dark text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-brand-terracotta/20"
              >
                Explorar Catálogo
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {pedidos.map((p, idx) => {
                const numeroExibicao = p.order_nsu?.startsWith("kalapa-")
                  ? p.order_nsu.slice(-6).toUpperCase()
                  : `${pedidos.length - idx}`;

                const isPago = p.status === "pago";
                const isPendente = p.status === "pendente";
                const isCancelado = p.status === "cancelado";

                const itens = p.itens && p.itens.length > 0
                  ? p.itens
                  : [{
                      nome: p.produtos?.nome || "Vivência Terapêutica",
                      quantidade: 1,
                      preco: p.valor,
                    }];

                return (
                  <div
                    key={p.id}
                    className="glass-card border border-white/10 rounded-2xl p-6 md:p-7 shadow-xl transition-all hover:border-white/20"
                  >
                    {/* Linha superior: Pedido # + Data + Status Pill */}
                    <div className="flex items-start justify-between gap-4 pb-4">
                      <div>
                        <h2 className="text-base font-bold text-white tracking-tight">
                          Pedido #{numeroExibicao}
                        </h2>
                        <p className="text-xs text-white/50 mt-0.5 font-mono">
                          {formatDate(p.created_at)}
                        </p>
                      </div>

                      <div>
                        {isPago && (
                          <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold bg-brand-mint/20 text-brand-mint border border-brand-mint/30">
                            Pago
                          </span>
                        )}
                        {isPendente && (
                          <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold bg-brand-terracotta/20 text-brand-terracotta border border-brand-terracotta/30">
                            Pendente
                          </span>
                        )}
                        {isCancelado && (
                          <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold bg-white/10 text-white/50 border border-white/10">
                            Cancelado
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Linha intermediária: Relação de itens */}
                    <div className="py-3 border-t border-white/10 space-y-2">
                      {itens.map((item, i) => (
                        <p key={i} className="text-sm text-white/80">
                          {item.nome} × {item.quantidade} — <span className="font-semibold text-white">R$ {(item.preco * item.quantidade).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                        </p>
                      ))}
                    </div>

                    {/* Linha inferior: Total em terracota/gold + Ações */}
                    <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="text-sm font-medium text-white/80">
                        Total:{" "}
                        <span className="text-brand-terracotta font-bold text-base">
                          R$ {Number(p.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                        {p.valor_desconto && Number(p.valor_desconto) > 0 ? (
                          <span className="text-xs text-brand-mint ml-2 font-normal">
                            (desconto de R$ {Number(p.valor_desconto).toFixed(2)})
                          </span>
                        ) : null}
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {isPendente && (
                          <>
                            <button
                              onClick={() => handleCancelarPedido(p.id)}
                              disabled={cancelandoId === p.id || retomandoId === p.id}
                              className="px-3 py-1.5 text-xs text-red-300 hover:text-red-200 hover:bg-red-500/15 border border-red-500/20 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              {cancelandoId === p.id ? "Cancelando..." : "Cancelar pedido"}
                            </button>

                            <button
                              onClick={() => handleRetomarPedido(p.id)}
                              disabled={retomandoId === p.id || cancelandoId === p.id}
                              className="px-4 py-1.5 text-xs font-semibold text-white bg-brand-terracotta hover:bg-brand-terracotta-dark border border-brand-terracotta/40 rounded-xl transition-all shadow-md shadow-brand-terracotta/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                            >
                              {retomandoId === p.id ? (
                                <>
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  <span>Verificando...</span>
                                </>
                              ) : (
                                <>
                                  <ShoppingBag className="w-3.5 h-3.5" />
                                  <span>Continuar compra</span>
                                </>
                              )}
                            </button>
                          </>
                        )}

                        {isPago && p.receipt_url && (
                          <a
                            href={p.receipt_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-1.5 text-xs text-brand-terracotta hover:text-white hover:bg-brand-terracotta/20 border border-brand-terracotta/30 rounded-xl transition-colors inline-flex items-center gap-1.5 font-medium"
                          >
                            Ver comprovante
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Mensagem de indisponibilidade ou erro na retomada */}
                    {erroRetomada[p.id] && (
                      <div className="mt-3 p-3 rounded-xl bg-red-500/10 border border-red-500/25 flex items-start gap-2.5 text-xs text-red-300 animate-in fade-in">
                        <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-semibold text-red-200">Não foi possível continuar esta compra:</p>
                          <p className="mt-0.5 text-red-300/90">{erroRetomada[p.id]}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            )
          ) : (
            /* Lista de Consultas do Cliente */
            agendamentos.length === 0 ? (
              <div className="glass-card border border-white/10 rounded-2xl p-12 text-center shadow-xl">
                <Calendar className="w-14 h-14 text-white/25 mx-auto mb-4" />
                <h2 className="text-base font-semibold text-white mb-1">
                  Nenhum atendimento agendado
                </h2>
                <p className="text-xs text-white/50 max-w-sm mx-auto mb-6">
                  Você ainda não possui atendimentos individuais marcados. Escolha uma data e horário disponível com a facilitadora.
                </p>
                <Link
                  href="/produtos/atendimentos"
                  className="inline-block px-6 py-3 bg-brand-terracotta hover:bg-brand-terracotta-dark text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-brand-terracotta/20 cursor-pointer"
                >
                  Agendar Atendimento
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {agendamentos.map((appt) => {
                  const startMs = new Date(appt.start_time).getTime();
                  const nowMs = Date.now();
                  const diffHours = (startMs - nowMs) / (1000 * 60 * 60);
                  const isCancelavel = (appt.status === "CONFIRMED" || appt.status === "PENDING") && diffHours >= 24;
                  const isEmBreve = (appt.status === "CONFIRMED" || appt.status === "PENDING") && diffHours < 24 && diffHours > 0;

                  const statusColors: Record<string, string> = {
                    CONFIRMED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                    PENDING: "bg-amber-500/10 text-amber-400 border-amber-500/20",
                    COMPLETED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
                    CANCELED: "bg-rose-500/10 text-rose-400 border-rose-500/20",
                  };
                  const statusLabels: Record<string, string> = {
                    CONFIRMED: "Confirmado",
                    PENDING: "Aguardando Pagamento",
                    COMPLETED: "Atendimento Realizado",
                    CANCELED: "Cancelado",
                  };

                  return (
                    <div
                      key={appt.id}
                      className="glass-card border border-white/10 rounded-2xl p-5 md:p-6 shadow-xl transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-wider text-brand-terracotta block">
                            Atendimento Individual
                          </span>
                          <h3 className="text-base font-bold text-white mt-0.5">
                            Com {appt.therapists?.nome || "Clatihúcia Capeli"}
                          </h3>
                        </div>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${
                            statusColors[appt.status] || "bg-white/10 text-white"
                          }`}
                        >
                          {statusLabels[appt.status] || appt.status}
                        </span>
                      </div>

                      <div className="py-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-white/80">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-brand-terracotta shrink-0" />
                          <span className="capitalize">
                            {new Intl.DateTimeFormat("pt-BR", {
                              timeZone: "America/Sao_Paulo",
                              weekday: "long",
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            }).format(new Date(appt.start_time))}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-brand-terracotta shrink-0" />
                          <span>
                            {new Intl.DateTimeFormat("pt-BR", {
                              timeZone: "America/Sao_Paulo",
                              hour: "2-digit",
                              minute: "2-digit",
                            }).format(new Date(appt.start_time))}{" "}
                            às{" "}
                            {new Intl.DateTimeFormat("pt-BR", {
                              timeZone: "America/Sao_Paulo",
                              hour: "2-digit",
                              minute: "2-digit",
                            }).format(new Date(appt.end_time))}{" "}
                            (50 min)
                          </span>
                        </div>
                      </div>

                      {appt.notes && (
                        <p className="text-xs text-white/50 italic mb-3">
                          Obs: {appt.notes}
                        </p>
                      )}

                      {appt.cancellation_reason && (
                        <p className="text-xs text-rose-400 mb-3">
                          Motivo do cancelamento: {appt.cancellation_reason}
                        </p>
                      )}

                      <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="text-[11px] text-white/50">
                          {isCancelavel ? (
                            <span>Cancelamento autônomo disponível até 24h antes da sessão.</span>
                          ) : isEmBreve ? (
                            <span className="text-amber-300">
                              Faltam menos de 24h. Para remarcações emergenciais, contate o suporte.
                            </span>
                          ) : null}
                        </div>

                        <div className="flex items-center gap-2">
                          {isCancelavel && (
                            <button
                              type="button"
                              disabled={cancelandoApptId === appt.id}
                              onClick={() => handleCancelarAgendamento(appt.id)}
                              className="px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/30 rounded-xl transition-colors font-medium cursor-pointer disabled:opacity-50"
                            >
                              {cancelandoApptId === appt.id ? "Cancelando..." : "Cancelar Consulta"}
                            </button>
                          )}

                          {isEmBreve && (
                            <a
                              href="https://wa.me/5511999999999?text=Olá,%20preciso%20de%20ajuda%20com%20meu%20atendimento"
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 text-xs text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 border border-emerald-500/30 rounded-xl transition-colors font-medium flex items-center gap-1.5 cursor-pointer"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              Falar no WhatsApp
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}
        </div>
      </div>


      {usuario && (
        <ModalAlterarSenha
          isOpen={modalSenhaOpen}
          onClose={() => setModalSenhaOpen(false)}
          userEmail={usuario.email}
        />
      )}

      <Footer />
    </div>
  );
}
