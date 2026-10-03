"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Filter, Phone, Mail, XCircle, CheckCircle2 } from "lucide-react";
import type { Appointment } from "@/lib/types";

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

export default function AdminConsultas({
  setError,
  setSucesso,
}: {
  setError: (msg: string) => void;
  setSucesso: (msg: string) => void;
}) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFiltro, setStatusFiltro] = useState<string>("todos");
  const [termoBusca, setTermoBusca] = useState("");

  const [cancelandoAppt, setCancelandoAppt] = useState<Appointment | null>(null);
  const [justificativaCancelamento, setJustificativaCancelamento] = useState("");
  const [salvandoCancelamento, setSalvandoCancelamento] = useState(false);

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/agendamentos");
      if (res.ok) {
        const data = await res.json();
        setAppointments(data.appointments || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

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

  const filteredAppointments = appointments.filter((appt) => {
    if (statusFiltro !== "todos" && appt.status !== statusFiltro) return false;
    if (termoBusca.trim()) {
      const term = termoBusca.toLowerCase();
      // @ts-ignore
      const nomePaciente = appt.usuarios?.nome?.toLowerCase() || "";
      // @ts-ignore
      const emailPaciente = appt.usuarios?.email?.toLowerCase() || "";
      // @ts-ignore
      const telPaciente = appt.usuarios?.telefone || "";
      // @ts-ignore
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
        <p className="text-xs text-brand-charcoal/60">Carregando consultas...</p>
      </div>
    );
  }

  return (
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

                // @ts-ignore
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
                        {/* @ts-ignore */}
                        {appt.usuarios?.nome || "Paciente não identificado"}
                      </span>
                      {appt.notes && (
                        <span className="text-[10px] text-brand-terracotta italic block line-clamp-1" title={appt.notes}>
                          Obs: {appt.notes}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 space-y-0.5">
                      {/* @ts-ignore */}
                      {appt.usuarios?.telefone && (
                        <a
                          href={`https://wa.me/55${telLimpo}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-700 hover:underline flex items-center gap-1 font-medium"
                        >
                          <Phone className="w-3 h-3" />
                          {/* @ts-ignore */}
                          {appt.usuarios.telefone}
                        </a>
                      )}
                      {/* @ts-ignore */}
                      {appt.usuarios?.email && (
                        <span className="text-brand-charcoal/60 flex items-center gap-1">
                          <Mail className="w-3 h-3 text-brand-charcoal/40" />
                          {/* @ts-ignore */}
                          {appt.usuarios.email}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-brand-charcoal block font-medium">
                        {/* @ts-ignore */}
                        {appt.produtos?.nome || "Atendimento Individual"}
                      </span>
                      {/* @ts-ignore */}
                      {appt.pedidos?.order_nsu && (
                        <span className="text-[10px] text-brand-charcoal/50 font-mono">
                          {/* @ts-ignore */}
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
                            onClick={() => handleUpdateStatus(appt.id, "COMPLETED")}
                            className="bg-brand-purple hover:bg-brand-charcoal text-white px-2 py-1.5 rounded-lg transition-colors flex items-center gap-1 text-[10px] font-semibold touch-manipulation cursor-pointer"
                            title="Marcar como concluído"
                          >
                            <CheckCircle2 className="w-3 h-3" /> Concluir
                          </button>
                        )}
                        {(appt.status === "CONFIRMED" || appt.status === "PENDING") && (
                          <button
                            onClick={() => setCancelandoAppt(appt)}
                            className="bg-white border border-brand-beige hover:border-red-300 hover:text-red-700 text-brand-charcoal px-2 py-1.5 rounded-lg transition-colors flex items-center gap-1 text-[10px] font-semibold touch-manipulation cursor-pointer"
                            title="Cancelar consulta"
                          >
                            <XCircle className="w-3 h-3" /> Cancelar
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

      {/* MODAL: Cancelar Consulta */}
      {cancelandoAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-charcoal/80 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-brand-beige overflow-hidden">
            <div className="bg-red-50 p-6 text-center border-b border-red-100">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-red-800">Cancelar Consulta</h3>
              <p className="text-xs text-red-600 mt-1">Esta ação liberará o horário na agenda.</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-brand-beige-light rounded-xl p-3 text-xs border border-brand-beige">
                <p><strong>Paciente:</strong> 
                  {/* @ts-ignore */}
                  {cancelandoAppt.usuarios?.nome || "N/A"}</p>
                <p><strong>Horário:</strong> {formatDateTimeBr(cancelandoAppt.start_time)}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                  Motivo do Cancelamento <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={justificativaCancelamento}
                  onChange={(e) => setJustificativaCancelamento(e.target.value)}
                  placeholder="Ex: Imprevisto do terapeuta, pedido do paciente..."
                  className="w-full border border-brand-beige rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-purple outline-hidden min-h-[80px]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    setCancelandoAppt(null);
                    setJustificativaCancelamento("");
                  }}
                  className="flex-1 py-3 text-sm font-semibold text-brand-charcoal bg-white border border-brand-beige rounded-xl hover:bg-brand-beige-light transition-colors cursor-pointer"
                  disabled={salvandoCancelamento}
                >
                  Voltar
                </button>
                <button
                  onClick={handleSalvarCancelamento}
                  disabled={salvandoCancelamento || !justificativaCancelamento.trim()}
                  className="flex-1 py-3 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {salvandoCancelamento ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Confirmar Cancelamento"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
