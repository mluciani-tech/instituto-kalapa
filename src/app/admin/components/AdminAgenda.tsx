"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  Clock,
  User,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Save,
  Filter,
  Phone,
  Mail,
  Shield,
  Search,
} from "lucide-react";
import type { Appointment, TherapistAvailability, TherapistBlock } from "@/lib/types";

const WEEKDAYS = [
  { id: 1, name: "Segunda-feira" },
  { id: 2, name: "Terça-feira" },
  { id: 3, name: "Quarta-feira" },
  { id: 4, name: "Quinta-feira" },
  { id: 5, name: "Sexta-feira" },
  { id: 6, name: "Sábado" },
  { id: 0, name: "Domingo" },
];

function formatDateTimeBr(isoStr: string) {
  try {
    const d = new Date(isoStr);
    return new Intl.DateTimeFormat("pt-BR", {
      timeZone: "America/Sao_Paulo",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return isoStr;
  }
}

export default function AdminAgenda() {
  const [activeSubTab, setActiveSubTab] = useState<"consultas" | "grade" | "bloqueios">("consultas");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sucesso, setSucesso] = useState("");

  // 1. Consultas State
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [statusFiltro, setStatusFiltro] = useState<string>("todos");
  const [termoBusca, setTermoBusca] = useState("");

  // Modal Cancelamento Terapeuta
  const [cancelandoAppt, setCancelandoAppt] = useState<Appointment | null>(null);
  const [justificativaCancelamento, setJustificativaCancelamento] = useState("");
  const [salvandoCancelamento, setSalvandoCancelamento] = useState(false);

  // 2. Grade de Horários State
  const [grade, setGrade] = useState<{
    [day: number]: {
      ativo: boolean;
      manhaAtivo: boolean;
      manhaInicio: string;
      manhaFim: string;
      tardeAtivo: boolean;
      tardeInicio: string;
      tardeFim: string;
      slotMinutos: number;
      bufferMinutos: number;
    };
  }>({
    1: { ativo: true, manhaAtivo: true, manhaInicio: "09:00", manhaFim: "12:00", tardeAtivo: true, tardeInicio: "14:00", tardeFim: "18:00", slotMinutos: 50, bufferMinutos: 10 },
    2: { ativo: true, manhaAtivo: true, manhaInicio: "09:00", manhaFim: "12:00", tardeAtivo: true, tardeInicio: "14:00", tardeFim: "18:00", slotMinutos: 50, bufferMinutos: 10 },
    3: { ativo: true, manhaAtivo: true, manhaInicio: "09:00", manhaFim: "12:00", tardeAtivo: true, tardeInicio: "14:00", tardeFim: "18:00", slotMinutos: 50, bufferMinutos: 10 },
    4: { ativo: true, manhaAtivo: true, manhaInicio: "09:00", manhaFim: "12:00", tardeAtivo: true, tardeInicio: "14:00", tardeFim: "18:00", slotMinutos: 50, bufferMinutos: 10 },
    5: { ativo: true, manhaAtivo: true, manhaInicio: "09:00", manhaFim: "12:00", tardeAtivo: true, tardeInicio: "14:00", tardeFim: "18:00", slotMinutos: 50, bufferMinutos: 10 },
    6: { ativo: false, manhaAtivo: false, manhaInicio: "09:00", manhaFim: "12:00", tardeAtivo: false, tardeInicio: "14:00", tardeFim: "18:00", slotMinutos: 50, bufferMinutos: 10 },
    0: { ativo: false, manhaAtivo: false, manhaInicio: "09:00", manhaFim: "12:00", tardeAtivo: false, tardeInicio: "14:00", tardeFim: "18:00", slotMinutos: 50, bufferMinutos: 10 },
  });
  const [salvandoGrade, setSalvandoGrade] = useState(false);

  // 3. Bloqueios State
  const [blocks, setBlocks] = useState<TherapistBlock[]>([]);
  const [modalNovoBloqueioOpen, setModalNovoBloqueioOpen] = useState(false);
  const [novoBloqueioData, setNovoBloqueioData] = useState("");
  const [novoBloqueioInicio, setNovoBloqueioInicio] = useState("08:00");
  const [novoBloqueioFim, setNovoBloqueioFim] = useState("18:00");
  const [novoBloqueioDiaInteiro, setNovoBloqueioDiaInteiro] = useState(false);
  const [novoBloqueioMotivo, setNovoBloqueioMotivo] = useState("");
  const [salvandoBloqueio, setSalvandoBloqueio] = useState(false);

  // Carregar Consultas
  const fetchAppointments = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/agendamentos");
      if (res.ok) {
        const data = await res.json();
        setAppointments(data.appointments || []);
      }
    } catch {
      // ignore
    }
  }, []);

  // Carregar Grade Semanal
  const fetchGrade = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/agendamentos/disponibilidade");
      if (res.ok) {
        const data = await res.json();
        const rawAvail: TherapistAvailability[] = data.availability || [];
        if (rawAvail.length > 0) {
          const novaGrade = { ...grade };
          // Resetar
          for (const d of [0, 1, 2, 3, 4, 5, 6]) {
            novaGrade[d] = {
              ativo: false,
              manhaAtivo: false,
              manhaInicio: "09:00",
              manhaFim: "12:00",
              tardeAtivo: false,
              tardeInicio: "14:00",
              tardeFim: "18:00",
              slotMinutos: 50,
              bufferMinutos: 10,
            };
          }

          // Agrupar janelas por dia
          rawAvail.forEach((w) => {
            const d = w.day_of_week;
            novaGrade[d].ativo = true;
            novaGrade[d].slotMinutos = w.slot_duration_minutes || 50;
            novaGrade[d].bufferMinutos = w.buffer_duration_minutes || 10;

            const startHour = parseInt(w.start_time.slice(0, 2), 10);
            if (startHour < 13) {
              novaGrade[d].manhaAtivo = true;
              novaGrade[d].manhaInicio = w.start_time.slice(0, 5);
              novaGrade[d].manhaFim = w.end_time.slice(0, 5);
            } else {
              novaGrade[d].tardeAtivo = true;
              novaGrade[d].tardeInicio = w.start_time.slice(0, 5);
              novaGrade[d].tardeFim = w.end_time.slice(0, 5);
            }
          });
          setGrade(novaGrade);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Carregar Bloqueios
  const fetchBlocks = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/agendamentos/bloqueios");
      if (res.ok) {
        const data = await res.json();
        setBlocks(data.blocks || []);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([fetchAppointments(), fetchGrade(), fetchBlocks()]);
      setLoading(false);
    };
    loadAll();
  }, [fetchAppointments, fetchGrade, fetchBlocks]);

  // Ação: Alterar status de consulta (ex: COMPLETED)
  const handleUpdateStatus = async (apptId: string, novoStatus: "COMPLETED") => {
    if (!confirm(`Deseja marcar este atendimento como CONCLUÍDO?`)) return;
    try {
      const res = await fetch("/api/admin/agendamentos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointment_id: apptId, status: novoStatus }),
      });
      if (res.ok) {
        setSucesso("Status atualizado com sucesso!");
        await fetchAppointments();
      } else {
        const d = await res.json();
        setError(d.error || "Erro ao atualizar status");
      }
    } catch {
      setError("Falha de conexão.");
    }
  };

  // Ação: Cancelar Consulta pela Terapeuta com justificativa
  const handleSalvarCancelamento = async () => {
    if (!cancelandoAppt) return;
    if (!justificativaCancelamento.trim()) {
      setError("Por favor, digite o motivo do cancelamento.");
      return;
    }

    setSalvandoCancelamento(true);
    setError("");

    try {
      const res = await fetch("/api/admin/agendamentos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointment_id: cancelandoAppt.id,
          status: "CANCELED",
          cancellation_reason: justificativaCancelamento.trim(),
        }),
      });

      if (res.ok) {
        setSucesso("Consulta cancelada e horário liberado na agenda.");
        setCancelandoAppt(null);
        setJustificativaCancelamento("");
        await fetchAppointments();
      } else {
        const d = await res.json();
        setError(d.error || "Erro ao cancelar consulta.");
      }
    } catch {
      setError("Falha de conexão ao cancelar.");
    }
    setSalvandoCancelamento(false);
  };

  // Ação: Salvar Grade Semanal
  const handleSalvarGrade = async () => {
    setSalvandoGrade(true);
    setError("");
    setSucesso("");

    try {
      const windows: Array<{
        day_of_week: number;
        start_time: string;
        end_time: string;
        slot_duration_minutes: number;
        buffer_duration_minutes: number;
        ativo: boolean;
      }> = [];

      Object.entries(grade).forEach(([dayKey, cfg]) => {
        const day = Number(dayKey);
        if (!cfg.ativo) return;

        if (cfg.manhaAtivo) {
          windows.push({
            day_of_week: day,
            start_time: `${cfg.manhaInicio}:00`,
            end_time: `${cfg.manhaFim}:00`,
            slot_duration_minutes: cfg.slotMinutos,
            buffer_duration_minutes: cfg.bufferMinutos,
            ativo: true,
          });
        }

        if (cfg.tardeAtivo) {
          windows.push({
            day_of_week: day,
            start_time: `${cfg.tardeInicio}:00`,
            end_time: `${cfg.tardeFim}:00`,
            slot_duration_minutes: cfg.slotMinutos,
            buffer_duration_minutes: cfg.bufferMinutos,
            ativo: true,
          });
        }
      });

      const res = await fetch("/api/admin/agendamentos/disponibilidade", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ windows }),
      });

      if (res.ok) {
        setSucesso("Grade de atendimento salva com sucesso!");
      } else {
        const d = await res.json();
        setError(d.error || "Erro ao salvar grade.");
      }
    } catch {
      setError("Falha ao salvar horários.");
    }
    setSalvandoGrade(false);
  };

  // Ação: Criar Novo Bloqueio
  const handleCriarBloqueio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoBloqueioData) {
      setError("Selecione a data do bloqueio.");
      return;
    }

    setSalvandoBloqueio(true);
    setError("");

    try {
      const startHour = novoBloqueioDiaInteiro ? "00:00:00" : `${novoBloqueioInicio}:00`;
      const endHour = novoBloqueioDiaInteiro ? "23:59:59" : `${novoBloqueioFim}:00`;

      // ISO UTC com offset de Brasília (-03:00)
      const startIso = new Date(`${novoBloqueioData}T${startHour}-03:00`).toISOString();
      const endIso = new Date(`${novoBloqueioData}T${endHour}-03:00`).toISOString();

      const res = await fetch("/api/admin/agendamentos/bloqueios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start_time: startIso,
          end_time: endIso,
          reason: novoBloqueioMotivo.trim() || "Bloqueio manual de agenda",
        }),
      });

      if (res.ok) {
        setSucesso("Bloqueio de agenda criado com sucesso!");
        setModalNovoBloqueioOpen(false);
        setNovoBloqueioData("");
        setNovoBloqueioMotivo("");
        await fetchBlocks();
      } else {
        const d = await res.json();
        setError(d.error || "Erro ao criar bloqueio.");
      }
    } catch {
      setError("Falha de conexão ao criar bloqueio.");
    }
    setSalvandoBloqueio(false);
  };

  // Ação: Excluir Bloqueio
  const handleExcluirBloqueio = async (id: string) => {
    if (!confirm("Deseja remover este bloqueio e liberar os horários na agenda?")) return;
    try {
      const res = await fetch(`/api/admin/agendamentos/bloqueios?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSucesso("Bloqueio removido.");
        await fetchBlocks();
      } else {
        setError("Erro ao remover bloqueio.");
      }
    } catch {
      setError("Falha de conexão.");
    }
  };

  // Filtro de consultas
  const filteredAppointments = appointments.filter((appt) => {
    if (statusFiltro !== "todos" && appt.status !== statusFiltro) return false;
    if (termoBusca.trim()) {
      const term = termoBusca.toLowerCase();
      const nomePaciente = appt.usuarios?.nome?.toLowerCase() || "";
      const emailPaciente = appt.usuarios?.email?.toLowerCase() || "";
      const telPaciente = appt.usuarios?.telefone || "";
      const orderNsu = appt.pedidos?.order_nsu?.toLowerCase() || "";
      return (
        nomePaciente.includes(term) ||
        emailPaciente.includes(term) ||
        telPaciente.includes(term) ||
        orderNsu.includes(term)
      );
    }
    return true;
  });

  if (loading) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-brand-beige">
        <div className="w-8 h-8 border-3 border-brand-purple border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-brand-charcoal/60">Carregando módulo de agenda e atendimentos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Alertas */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError("")} className="font-bold cursor-pointer">&times;</button>
        </div>
      )}
      {sucesso && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs flex items-center justify-between">
          <span>{sucesso}</span>
          <button onClick={() => setSucesso("")} className="font-bold cursor-pointer">&times;</button>
        </div>
      )}

      {/* Sub-navegação */}
      <div className="flex border-b border-brand-beige bg-white rounded-t-2xl px-4 pt-3 gap-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveSubTab("consultas")}
          className={`pb-3 px-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
            activeSubTab === "consultas"
              ? "border-brand-purple text-brand-purple"
              : "border-transparent text-brand-charcoal/50 hover:text-brand-charcoal"
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Consultas & Atendimentos ({appointments.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("grade")}
          className={`pb-3 px-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
            activeSubTab === "grade"
              ? "border-brand-purple text-brand-purple"
              : "border-transparent text-brand-charcoal/50 hover:text-brand-charcoal"
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Grade Semanal de Trabalho</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("bloqueios")}
          className={`pb-3 px-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
            activeSubTab === "bloqueios"
              ? "border-brand-purple text-brand-purple"
              : "border-transparent text-brand-charcoal/50 hover:text-brand-charcoal"
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Bloqueios & Exceções ({blocks.length})</span>
        </button>
      </div>

      {/* =========================================================================
          ABA 1: CONSULTAS E ATENDIMENTOS
          ========================================================================= */}
      {activeSubTab === "consultas" && (
        <div className="bg-white rounded-2xl border border-brand-beige p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 max-w-md bg-brand-beige-light px-3.5 py-2 rounded-xl border border-brand-beige">
              <Search className="w-4 h-4 text-brand-charcoal/40" />
              <input
                type="text"
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                placeholder="Buscar por paciente, e-mail ou telefone..."
                className="bg-transparent border-none text-xs text-brand-charcoal outline-hidden w-full"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-brand-charcoal/50" />
              <select
                value={statusFiltro}
                onChange={(e) => setStatusFiltro(e.target.value)}
                className="text-xs bg-brand-beige-light border border-brand-beige rounded-xl px-3 py-2 text-brand-charcoal outline-hidden"
              >
                <option value="todos">Todos os Status</option>
                <option value="CONFIRMED">Confirmados</option>
                <option value="PENDING">Pendentes (Hold)</option>
                <option value="COMPLETED">Concluídos</option>
                <option value="CANCELED">Cancelados</option>
              </select>
            </div>
          </div>

          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12 text-brand-charcoal/50 text-xs">
              Nenhum agendamento encontrado para os filtros selecionados.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-brand-beige text-brand-charcoal/60 uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-3">Data & Horário</th>
                    <th className="py-3 px-3">Paciente</th>
                    <th className="py-3 px-3">Contato</th>
                    <th className="py-3 px-3">Serviço / Pedido</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-beige/60">
                  {filteredAppointments.map((appt) => {
                    const statusColors: Record<string, string> = {
                      CONFIRMED: "bg-emerald-100 text-emerald-800 border-emerald-300",
                      PENDING: "bg-amber-100 text-amber-800 border-amber-300",
                      COMPLETED: "bg-blue-100 text-blue-800 border-blue-300",
                      CANCELED: "bg-rose-100 text-rose-800 border-rose-300",
                    };
                    const statusLabels: Record<string, string> = {
                      CONFIRMED: "Confirmado",
                      PENDING: "Hold (15 min)",
                      COMPLETED: "Concluído",
                      CANCELED: "Cancelado",
                    };

                    const telLimpo = (appt.usuarios?.telefone || "").replace(/\D/g, "");

                    return (
                      <tr key={appt.id} className="hover:bg-brand-beige-light/50 transition-colors">
                        <td className="py-3.5 px-3">
                          <span className="font-bold text-brand-charcoal block">
                            {formatDateTimeBr(appt.start_time)}
                          </span>
                          <span className="text-[10px] text-brand-charcoal/50">
                            até {formatDateTimeBr(appt.end_time).split(" ")[1]}
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="font-semibold text-brand-charcoal block">
                            {appt.usuarios?.nome || "Paciente não identificado"}
                          </span>
                          {appt.notes && (
                            <span className="text-[10px] text-brand-terracotta italic block line-clamp-1" title={appt.notes}>
                              Obs: {appt.notes}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-3 space-y-0.5">
                          {appt.usuarios?.telefone && (
                            <a
                              href={`https://wa.me/55${telLimpo}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-700 hover:underline flex items-center gap-1 font-medium"
                            >
                              <Phone className="w-3 h-3" />
                              {appt.usuarios.telefone}
                            </a>
                          )}
                          {appt.usuarios?.email && (
                            <span className="text-brand-charcoal/60 flex items-center gap-1">
                              <Mail className="w-3 h-3 text-brand-charcoal/40" />
                              {appt.usuarios.email}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="text-brand-charcoal block font-medium">
                            {appt.produtos?.nome || "Atendimento Individual"}
                          </span>
                          {appt.pedidos?.order_nsu && (
                            <span className="text-[10px] text-brand-charcoal/50 font-mono">
                              #{appt.pedidos.order_nsu}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              statusColors[appt.status] || "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {statusLabels[appt.status] || appt.status}
                          </span>
                          {appt.cancellation_reason && (
                            <span className="text-[10px] text-rose-700 block mt-1 line-clamp-1" title={appt.cancellation_reason}>
                              Motivo: {appt.cancellation_reason}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {appt.status === "CONFIRMED" && (
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus(appt.id, "COMPLETED")}
                                title="Marcar como Concluído"
                                className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors font-semibold"
                              >
                                Concluir
                              </button>
                            )}

                            {appt.status !== "CANCELED" && appt.status !== "COMPLETED" && (
                              <button
                                type="button"
                                onClick={() => {
                                  setCancelandoAppt(appt);
                                  setJustificativaCancelamento("");
                                }}
                                title="Cancelar Agendamento"
                                className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors font-semibold"
                              >
                                Cancelar
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          ABA 2: GRADE SEMANAL (DISPONIBILIDADE)
          ========================================================================= */}
      {activeSubTab === "grade" && (
        <div className="bg-white rounded-2xl border border-brand-beige p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-beige">
            <div>
              <h3 className="font-bold text-sm text-brand-purple">
                Configuração de Janelas de Atendimento Semanal
              </h3>
              <p className="text-xs text-brand-charcoal/60 mt-0.5">
                Defina os dias da semana e turnos em que você realiza atendimentos. O motor gerará os slots automaticamente.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSalvarGrade}
              disabled={salvandoGrade}
              className="py-2.5 px-4 rounded-xl bg-brand-purple hover:bg-brand-purple-dark text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{salvandoGrade ? "Salvando Grade..." : "Salvar Alterações"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {WEEKDAYS.map((wd) => {
              const cfg = grade[wd.id];
              if (!cfg) return null;

              return (
                <div
                  key={wd.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    cfg.ativo
                      ? "bg-brand-beige-light/60 border-brand-terracotta/30"
                      : "bg-gray-50 border-gray-200 opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-brand-charcoal/10">
                    <span className="font-bold text-sm text-brand-charcoal">{wd.name}</span>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                      <input
                        type="checkbox"
                        checked={cfg.ativo}
                        onChange={(e) =>
                          setGrade((prev) => ({
                            ...prev,
                            [wd.id]: { ...prev[wd.id], ativo: e.target.checked },
                          }))
                        }
                        className="rounded-sm accent-brand-terracotta"
                      />
                      <span>{cfg.ativo ? "Dia Ativo" : "Dia Inativo"}</span>
                    </label>
                  </div>

                  {cfg.ativo && (
                    <div className="space-y-3 text-xs">
                      {/* Turno Manhã */}
                      <div className="flex items-center justify-between gap-2">
                        <label className="flex items-center gap-1.5 font-medium text-brand-charcoal/80">
                          <input
                            type="checkbox"
                            checked={cfg.manhaAtivo}
                            onChange={(e) =>
                              setGrade((prev) => ({
                                ...prev,
                                [wd.id]: { ...prev[wd.id], manhaAtivo: e.target.checked },
                              }))
                            }
                            className="rounded-sm accent-brand-terracotta"
                          />
                          <span>Manhã:</span>
                        </label>
                        <div className="flex items-center gap-1">
                          <input
                            type="time"
                            disabled={!cfg.manhaAtivo}
                            value={cfg.manhaInicio}
                            onChange={(e) =>
                              setGrade((prev) => ({
                                ...prev,
                                [wd.id]: { ...prev[wd.id], manhaInicio: e.target.value },
                              }))
                            }
                            className="px-2 py-1 rounded-md border border-brand-charcoal/20 bg-white text-xs disabled:opacity-40"
                          />
                          <span>às</span>
                          <input
                            type="time"
                            disabled={!cfg.manhaAtivo}
                            value={cfg.manhaFim}
                            onChange={(e) =>
                              setGrade((prev) => ({
                                ...prev,
                                [wd.id]: { ...prev[wd.id], manhaFim: e.target.value },
                              }))
                            }
                            className="px-2 py-1 rounded-md border border-brand-charcoal/20 bg-white text-xs disabled:opacity-40"
                          />
                        </div>
                      </div>

                      {/* Turno Tarde */}
                      <div className="flex items-center justify-between gap-2">
                        <label className="flex items-center gap-1.5 font-medium text-brand-charcoal/80">
                          <input
                            type="checkbox"
                            checked={cfg.tardeAtivo}
                            onChange={(e) =>
                              setGrade((prev) => ({
                                ...prev,
                                [wd.id]: { ...prev[wd.id], tardeAtivo: e.target.checked },
                              }))
                            }
                            className="rounded-sm accent-brand-terracotta"
                          />
                          <span>Tarde:</span>
                        </label>
                        <div className="flex items-center gap-1">
                          <input
                            type="time"
                            disabled={!cfg.tardeAtivo}
                            value={cfg.tardeInicio}
                            onChange={(e) =>
                              setGrade((prev) => ({
                                ...prev,
                                [wd.id]: { ...prev[wd.id], tardeInicio: e.target.value },
                              }))
                            }
                            className="px-2 py-1 rounded-md border border-brand-charcoal/20 bg-white text-xs disabled:opacity-40"
                          />
                          <span>às</span>
                          <input
                            type="time"
                            disabled={!cfg.tardeAtivo}
                            value={cfg.tardeFim}
                            onChange={(e) =>
                              setGrade((prev) => ({
                                ...prev,
                                [wd.id]: { ...prev[wd.id], tardeFim: e.target.value },
                              }))
                            }
                            className="px-2 py-1 rounded-md border border-brand-charcoal/20 bg-white text-xs disabled:opacity-40"
                          />
                        </div>
                      </div>

                      {/* Parâmetros de sessão */}
                      <div className="pt-2 border-t border-brand-charcoal/10 flex items-center justify-between text-[11px] text-brand-charcoal/60">
                        <span>Duração: <strong>{cfg.slotMinutos} min</strong></span>
                        <span>Intervalo: <strong>{cfg.bufferMinutos} min</strong></span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          ABA 3: BLOQUEIOS DE AGENDA (FÉRIAS / FOLGAS / EXCEÇÕES)
          ========================================================================= */}
      {activeSubTab === "bloqueios" && (
        <div className="bg-white rounded-2xl border border-brand-beige p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-beige">
            <div>
              <h3 className="font-bold text-sm text-brand-purple">
                Bloqueios Manuais & Exceções de Agenda
              </h3>
              <p className="text-xs text-brand-charcoal/60 mt-0.5">
                Bloqueie dias inteiros ou faixas de horário para férias, consultas médicas ou compromissos.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setModalNovoBloqueioOpen(true)}
              className="py-2.5 px-4 rounded-xl bg-brand-terracotta hover:bg-brand-terracotta-dark text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>+ Novo Bloqueio de Horário</span>
            </button>
          </div>

          {blocks.length === 0 ? (
            <div className="text-center py-12 text-brand-charcoal/50 text-xs">
              Nenhum bloqueio cadastrado no momento. A agenda segue a grade padrão normal.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {blocks.map((blk) => (
                <div
                  key={blk.id}
                  className="p-4 rounded-xl bg-brand-beige-light border border-brand-beige flex items-start justify-between gap-3"
                >
                  <div>
                    <span className="font-bold text-xs text-brand-charcoal block">
                      {blk.reason || "Bloqueio de Agenda"}
                    </span>
                    <span className="text-[11px] text-brand-charcoal/70 block mt-1">
                      Início: {formatDateTimeBr(blk.start_time)}
                    </span>
                    <span className="text-[11px] text-brand-charcoal/70 block">
                      Fim: {formatDateTimeBr(blk.end_time)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleExcluirBloqueio(blk.id)}
                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-100 transition-colors"
                    title="Excluir bloqueio"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL: CANCELAR CONSULTA (TERAPEUTA) */}
      {cancelandoAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-charcoal/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-brand-beige">
            <h3 className="font-bold text-base text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>Justificar Cancelamento</span>
            </h3>
            <p className="text-xs text-brand-charcoal/70">
              Você está cancelando a consulta de{" "}
              <strong>{cancelandoAppt.usuarios?.nome || "Paciente"}</strong> marcada para{" "}
              <strong>{formatDateTimeBr(cancelandoAppt.start_time)}</strong>.
            </p>

            <div>
              <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                Motivo / Justificativa (obrigatório) *
              </label>
              <textarea
                required
                rows={3}
                value={justificativaCancelamento}
                onChange={(e) => setJustificativaCancelamento(e.target.value)}
                placeholder="Ex: Imprevisto de saúde da facilitadora, solicitação de reagendamento..."
                className="w-full p-3 rounded-xl border border-brand-charcoal/20 text-xs text-brand-charcoal focus:outline-hidden focus:border-brand-purple"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCancelandoAppt(null)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-brand-charcoal/70 hover:bg-gray-100"
              >
                Voltar
              </button>
              <button
                type="button"
                disabled={salvandoCancelamento || !justificativaCancelamento.trim()}
                onClick={handleSalvarCancelamento}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors disabled:opacity-50"
              >
                {salvandoCancelamento ? "Cancelando..." : "Confirmar Cancelamento"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: NOVO BLOQUEIO */}
      {modalNovoBloqueioOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-charcoal/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-brand-beige">
            <div className="flex items-center justify-between pb-2 border-b border-brand-beige">
              <h3 className="font-bold text-base text-brand-charcoal">Novo Bloqueio de Horário</h3>
              <button
                type="button"
                onClick={() => setModalNovoBloqueioOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCriarBloqueio} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-brand-charcoal mb-1">Data *</label>
                <input
                  type="date"
                  required
                  value={novoBloqueioData}
                  onChange={(e) => setNovoBloqueioData(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-brand-charcoal/20 bg-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="chkDiaInteiro"
                  checked={novoBloqueioDiaInteiro}
                  onChange={(e) => setNovoBloqueioDiaInteiro(e.target.checked)}
                  className="accent-brand-terracotta"
                />
                <label htmlFor="chkDiaInteiro" className="font-semibold text-brand-charcoal cursor-pointer">
                  Bloquear o dia inteiro
                </label>
              </div>

              {!novoBloqueioDiaInteiro && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-brand-charcoal mb-1">Início</label>
                    <input
                      type="time"
                      value={novoBloqueioInicio}
                      onChange={(e) => setNovoBloqueioInicio(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-brand-charcoal/20 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-brand-charcoal mb-1">Fim</label>
                    <input
                      type="time"
                      value={novoBloqueioFim}
                      onChange={(e) => setNovoBloqueioFim(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-brand-charcoal/20 bg-white"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block font-semibold text-brand-charcoal mb-1">Motivo (opcional)</label>
                <input
                  type="text"
                  value={novoBloqueioMotivo}
                  onChange={(e) => setNovoBloqueioMotivo(e.target.value)}
                  placeholder="Ex: Férias, Viagem, Compromisso médico..."
                  className="w-full px-3 py-2 rounded-xl border border-brand-charcoal/20 bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setModalNovoBloqueioOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-brand-charcoal/70 hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvandoBloqueio}
                  className="px-4 py-2 rounded-xl bg-brand-terracotta hover:bg-brand-terracotta-dark text-white font-bold transition-colors disabled:opacity-50"
                >
                  {salvandoBloqueio ? "Salvando..." : "Criar Bloqueio"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
