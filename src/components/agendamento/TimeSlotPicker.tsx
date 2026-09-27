"use client";

import { Clock, AlertCircle } from "lucide-react";
import type { TimeSlot } from "@/lib/types";

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  loading: boolean;
  selectedSlot: TimeSlot | null;
  onSelectSlot: (slot: TimeSlot) => void;
  selectedDate: string;
}

export default function TimeSlotPicker({
  slots,
  loading,
  selectedSlot,
  onSelectSlot,
  selectedDate,
}: TimeSlotPickerProps) {
  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-brand-charcoal/10 shadow-sm flex flex-col items-center justify-center min-h-[220px]">
        <div className="w-7 h-7 border-3 border-brand-terracotta border-t-transparent rounded-full animate-spin mb-3" />
        <span className="text-xs text-brand-charcoal/60">Verificando disponibilidade da agenda...</span>
      </div>
    );
  }

  const availableSlots = slots.filter((s) => s.available);

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-brand-charcoal/10 shadow-sm flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-terracotta" />
            <h4 className="font-semibold text-brand-charcoal text-sm">
              Horários Disponíveis
            </h4>
          </div>
          <span className="text-xs text-brand-charcoal/50">
            {availableSlots.length} {availableSlots.length === 1 ? "vaga livre" : "vagas livres"}
          </span>
        </div>

        {slots.length === 0 ? (
          <div className="text-center py-8 px-4">
            <div className="w-10 h-10 rounded-full bg-brand-charcoal/5 flex items-center justify-center mx-auto mb-2.5">
              <Clock className="w-5 h-5 text-brand-charcoal/30" />
            </div>
            <p className="text-xs text-brand-charcoal/60 leading-relaxed max-w-xs mx-auto">
              Não há atendimentos configurados para este dia da semana. Selecione outra data no calendário.
            </p>
          </div>
        ) : availableSlots.length === 0 ? (
          <div className="text-center py-8 px-4">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-2.5">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-xs text-brand-charcoal/70 font-medium mb-1">
              Todos os horários desta data estão ocupados ou indisponíveis.
            </p>
            <p className="text-[11px] text-brand-charcoal/50 leading-relaxed max-w-xs mx-auto">
              Experimente escolher outro dia ou entre em contato se necessitar de atendimento prioritário.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5 max-h-[260px] overflow-y-auto pr-1 overscroll-contain">
            {slots.map((slot) => {
              const isSelected = selectedSlot?.startTime === slot.startTime;
              const isAvailable = slot.available;

              return (
                <button
                  key={slot.startTime}
                  type="button"
                  disabled={!isAvailable}
                  onClick={() => onSelectSlot(slot)}
                  title={slot.reason || `${slot.timeDisplay} às ${slot.timeEndDisplay}`}
                  aria-label={`Horário das ${slot.timeDisplay} às ${slot.timeEndDisplay}, ${slot.available ? "disponível" : "indisponível"}`}
                  aria-pressed={isSelected}
                  className={`py-2.5 px-2.5 sm:px-3 rounded-xl text-xs font-semibold transition-all flex flex-col items-center justify-center touch-manipulation min-h-[48px] border ${
                    isSelected
                      ? "bg-brand-terracotta text-white border-brand-terracotta shadow-md shadow-brand-terracotta/25 scale-[1.02] active:scale-95 cursor-pointer"
                      : isAvailable
                      ? "bg-white hover:bg-brand-terracotta/10 text-brand-charcoal border-brand-charcoal/15 hover:border-brand-terracotta/50 active:scale-95 cursor-pointer"
                      : "bg-brand-charcoal/5 text-brand-charcoal/30 border-transparent cursor-not-allowed line-through"
                  }`}
                >
                  <span className="text-sm font-bold tabular-nums">{slot.timeDisplay}</span>
                  <span className={`text-[10px] ${isSelected ? "text-white/80" : "text-brand-charcoal/50"}`}>
                    até {slot.timeEndDisplay}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {selectedSlot && (
        <div className="mt-4 pt-3 border-t border-brand-charcoal/10 flex items-center justify-between text-xs">
          <span className="text-brand-charcoal/60">Horário selecionado:</span>
          <span className="font-bold text-brand-terracotta">
            {selectedSlot.timeDisplay} às {selectedSlot.timeEndDisplay} (50 min)
          </span>
        </div>
      )}
    </div>
  );
}
