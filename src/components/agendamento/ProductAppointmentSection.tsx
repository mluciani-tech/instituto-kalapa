"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Calendar as CalendarIcon, Sparkles, ShieldCheck, ArrowRight, User } from "lucide-react";
import AppointmentCalendar from "./AppointmentCalendar";
import TimeSlotPicker from "./TimeSlotPicker";
import BookingConfirmationModal from "./BookingConfirmationModal";
import type { Produto, Therapist, TimeSlot, Usuario } from "@/lib/types";

interface ProductAppointmentSectionProps {
  produto: Produto;
}

function formatDateStr(d: Date): string {
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getNextWorkingDayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  // Se for sábado (6), pula 2 dias para segunda-feira
  if (d.getDay() === 6) {
    d.setDate(d.getDate() + 2);
  } else if (d.getDay() === 0) {
    // Se for domingo (0), pula 1 dia para segunda-feira
    d.setDate(d.getDate() + 1);
  }
  return formatDateStr(d);
}

export default function ProductAppointmentSection({ produto }: ProductAppointmentSectionProps) {
  // Data inicial: próximo dia útil garantido com slots disponíveis
  const [selectedDate, setSelectedDate] = useState<string>(getNextWorkingDayStr());
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  const [terapeutas, setTerapeutas] = useState<Therapist[]>([]);
  const [terapeutaSelecionada, setTerapeutaSelecionada] = useState<Therapist | null>(null);

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [modalConfirmacaoOpen, setModalConfirmacaoOpen] = useState(false);

  // 1. Carregar usuário logado e lista de terapeutas
  useEffect(() => {
    const fetchInit = async () => {
      try {
        const [userRes, therapistsRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/agendamentos/therapists"),
        ]);

        if (userRes.ok) {
          const ud = await userRes.json();
          if (ud.authenticated && ud.usuario) {
            setUsuario(ud.usuario);
          }
        }

        if (therapistsRes.ok) {
          const td = await therapistsRes.json();
          if (Array.isArray(td) && td.length > 0) {
            setTerapeutas(td);
            setTerapeutaSelecionada(td[0]);
          }
        }
      } catch (err) {
        console.error("[ProductAppointmentSection] Erro inicial:", err);
      }
    };
    fetchInit();
  }, []);

  // 2. Buscar horários livres ao mudar data ou terapeuta
  const fetchSlots = useCallback(async (date: string, therapistId: string) => {
    setLoadingSlots(true);
    setSelectedSlot(null);
    try {
      const res = await fetch(`/api/agendamentos/slots?date=${date}&therapist_id=${therapistId}`);
      if (res.ok) {
        const data = await res.json();
        setSlots(data.slots || []);
      } else {
        setSlots([]);
      }
    } catch {
      setSlots([]);
    }
    setLoadingSlots(false);
  }, []);

  useEffect(() => {
    if (terapeutaSelecionada && selectedDate) {
      fetchSlots(selectedDate, terapeutaSelecionada.id);
    }
  }, [selectedDate, terapeutaSelecionada, fetchSlots]);

  const handleSelectDate = (dateStr: string) => {
    setSelectedDate(dateStr);
  };

  const handleSelectSlot = (slot: TimeSlot) => {
    setSelectedSlot(slot);
  };

  const handleProsseguir = () => {
    if (!selectedSlot || !terapeutaSelecionada) return;
    setModalConfirmacaoOpen(true);
  };

  return (
    <div id="agendamento" className="mt-8 pt-8 border-t border-brand-charcoal/10 scroll-mt-20">
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-terracotta/10 text-brand-terracotta text-xs font-semibold mb-2">
          <CalendarIcon className="w-3.5 h-3.5" />
          <span>Agendamento Direto e Exclusivo</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-brand-charcoal">
          Escolha seu Dia e Horário
        </h2>
        <p className="text-xs sm:text-sm text-brand-charcoal/70 mt-1 max-w-xl">
          Navegue pelo calendário abaixo e selecione o horário mais conveniente. O atendimento será confirmado após a conclusão no checkout.
        </p>
      </div>

      {/* Card da Terapeuta Facilitadora */}
      {terapeutaSelecionada && (
        <div className="mb-6 p-4 rounded-2xl bg-white/60 border border-brand-charcoal/10 flex items-center gap-4">
          <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-brand-purple/10 shrink-0 border border-brand-terracotta/20">
            {terapeutaSelecionada.foto_url ? (
              <Image
                src={terapeutaSelecionada.foto_url}
                alt={terapeutaSelecionada.nome}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-brand-purple">
                <User className="w-6 h-6" />
              </div>
            )}
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-brand-terracotta block">
              Atendimento com
            </span>
            <h3 className="font-bold text-sm text-brand-charcoal">
              {terapeutaSelecionada.nome}
            </h3>
            {terapeutaSelecionada.titulo && (
              <p className="text-xs text-brand-charcoal/60 line-clamp-1">
                {terapeutaSelecionada.titulo}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Grid de Agendamento: Calendário à Esquerda, Slots à Direita */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <AppointmentCalendar
          selectedDate={selectedDate}
          onSelectDate={handleSelectDate}
        />

        <TimeSlotPicker
          slots={slots}
          loading={loadingSlots}
          selectedSlot={selectedSlot}
          onSelectSlot={handleSelectSlot}
          selectedDate={selectedDate}
        />
      </div>

      {/* Barra de Ação Inferior */}
      <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-white border border-brand-charcoal/10 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          {selectedSlot ? (
            <div>
              <span className="text-xs text-brand-charcoal/60">Sessão selecionada:</span>
              <p className="text-sm font-bold text-brand-charcoal">
                {selectedDate.split("-").reverse().join("/")} às {selectedSlot.timeDisplay} ({selectedSlot.timeEndDisplay})
              </p>
            </div>
          ) : (
            <div>
              <span className="text-xs text-brand-charcoal/60">Passo 1 de 2:</span>
              <p className="text-sm font-medium text-brand-charcoal">
                Selecione uma data e um horário disponível acima
              </p>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleProsseguir}
          disabled={!selectedSlot}
          className="w-full sm:w-auto py-3.5 px-6 font-bold text-sm rounded-xl bg-brand-terracotta hover:bg-brand-terracotta-dark text-white shadow-md shadow-brand-terracotta/25 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          <span>Avançar para Reserva</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Modal de Confirmação e Hold */}
      {modalConfirmacaoOpen && selectedSlot && terapeutaSelecionada && (
        <BookingConfirmationModal
          isOpen={modalConfirmacaoOpen}
          onClose={() => setModalConfirmacaoOpen(false)}
          produto={produto}
          terapeuta={terapeutaSelecionada}
          dateStr={selectedDate}
          slot={selectedSlot}
          usuario={usuario}
          onLoginSuccess={(u) => setUsuario(u)}
        />
      )}
    </div>
  );
}
