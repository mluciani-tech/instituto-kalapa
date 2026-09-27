"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell, Calendar, X, ChevronRight, Sparkles } from "lucide-react";

interface AppointmentNotification {
  id: string;
  start_time: string;
  end_time: string;
  created_at: string;
  status: string;
  therapists?: { nome: string; email?: string } | { nome: string; email?: string }[];
  usuarios?: { nome: string; email?: string; telefone?: string } | { nome: string; email?: string; telefone?: string }[];
  produtos?: { nome: string } | { nome: string }[];
}

interface AdminToastNotificationProps {
  onNavigateToAgenda: () => void;
  onNewAppointmentsCountChange?: (count: number) => void;
}

export default function AdminToastNotification({
  onNavigateToAgenda,
  onNewAppointmentsCountChange,
}: AdminToastNotificationProps) {
  const [activeToast, setActiveToast] = useState<AppointmentNotification | null>(null);
  const [unseenCount, setUnseenCount] = useState(0);

  const checkRecentAppointments = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/agendamentos?status=CONFIRMED");
      if (!res.ok) return;

      const data = await res.json();
      const appts: AppointmentNotification[] = data.appointments || [];

      if (appts.length === 0) {
        setUnseenCount(0);
        onNewAppointmentsCountChange?.(0);
        return;
      }

      // Último visto gravado no localStorage
      const lastSeenId = localStorage.getItem("kalapa_admin_last_seen_appt_id");
      const lastDismissedId = sessionStorage.getItem("kalapa_admin_dismissed_toast_id");

      // Buscar agendamentos mais recentes que o último visto ou nas últimas 24h
      const latestAppt = appts[0];

      if (latestAppt) {
        const isNewer = !lastSeenId || latestAppt.id !== lastSeenId;
        const notDismissed = !lastDismissedId || latestAppt.id !== lastDismissedId;

        // Se for um agendamento novo que ainda não exibiu toast nesta sessão
        if (isNewer && notDismissed) {
          setActiveToast(latestAppt);
        }

        // Calcular quantos não foram vistos se houver lastSeenId
        let count = 0;
        if (lastSeenId) {
          const idx = appts.findIndex((a) => a.id === lastSeenId);
          count = idx === -1 ? Math.min(appts.length, 5) : idx;
        } else {
          count = 1;
        }

        setUnseenCount(count);
        onNewAppointmentsCountChange?.(count);
      }
    } catch {
      // ignore
    }
  }, [onNewAppointmentsCountChange]);

  useEffect(() => {
    // Checagem imediata
    checkRecentAppointments();

    // Polling a cada 40 segundos
    const interval = setInterval(checkRecentAppointments, 40000);
    return () => clearInterval(interval);
  }, [checkRecentAppointments]);

  const handleDismiss = () => {
    if (activeToast) {
      sessionStorage.setItem("kalapa_admin_dismissed_toast_id", activeToast.id);
      localStorage.setItem("kalapa_admin_last_seen_appt_id", activeToast.id);
    }
    setActiveToast(null);
  };

  const handleVerConsulta = () => {
    if (activeToast) {
      localStorage.setItem("kalapa_admin_last_seen_appt_id", activeToast.id);
    }
    setActiveToast(null);
    onNavigateToAgenda();
  };

  if (!activeToast) return null;

  const pacienteNome = Array.isArray(activeToast.usuarios)
    ? activeToast.usuarios[0]?.nome
    : activeToast.usuarios?.nome || "Novo Paciente";

  const produtoNome = Array.isArray(activeToast.produtos)
    ? activeToast.produtos[0]?.nome
    : activeToast.produtos?.nome || "Atendimento Individual";

  let dataHoraFmt = "";
  try {
    const d = new Date(activeToast.start_time);
    dataHoraFmt = new Intl.DateTimeFormat("pt-BR", {
      timeZone: "America/Sao_Paulo",
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    dataHoraFmt = activeToast.start_time;
  }

  return (
    <aside
      aria-label="Notificações do Administrador"
      className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-purple-200 p-4 transform transition-all duration-300 ease-out animate-bounce-short hover:scale-[1.02]"
    >
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-xl bg-linear-to-br from-purple-600 to-brand-purple text-white shadow-md shrink-0">
          <Bell className="w-5 h-5 animate-pulse" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-brand-purple">
              <Sparkles className="w-2.5 h-2.5" />
              Novo Agendamento Confirmado!
            </span>
          </div>

          <h4 className="text-sm font-bold text-brand-charcoal truncate">
            {pacienteNome}
          </h4>

          <p className="text-xs text-brand-charcoal/70 line-clamp-1 mt-0.5">
            {produtoNome}
          </p>

          <p className="text-xs font-semibold text-brand-purple mt-1 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {dataHoraFmt}
          </p>

          <div className="flex items-center gap-2 mt-3">
            <button
              type="button"
              onClick={handleVerConsulta}
              className="flex-1 py-1.5 px-3 bg-brand-purple hover:bg-brand-purple-dark text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-sm"
            >
              <span>Ver na Agenda</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className="py-1.5 px-2.5 text-xs font-medium text-brand-charcoal/60 hover:text-brand-charcoal hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              Depois
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          className="text-gray-400 hover:text-gray-600 p-1 rounded-md transition-colors"
          title="Fechar notificação"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
