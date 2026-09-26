"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

interface AppointmentCalendarProps {
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (dateStr: string) => void;
  minDateStr?: string; // YYYY-MM-DD
}

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const MONTH_NAMES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function pad(num: number): string {
  return num.toString().padStart(2, "0");
}

function formatDateStr(year: number, month: number, day: number): string {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

export default function AppointmentCalendar({
  selectedDate,
  onSelectDate,
  minDateStr,
}: AppointmentCalendarProps) {
  // Inicializa o mês exibido baseado na data selecionada ou na data atual
  const initialDate = selectedDate ? new Date(`${selectedDate}T12:00:00-03:00`) : new Date();
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());

  // Data mínima (hoje por padrão)
  const today = new Date();
  const todayStr = formatDateStr(today.getFullYear(), today.getMonth(), today.getDate());
  const effectiveMinDate = minDateStr || todayStr;

  // Primeiro dia do mês e total de dias
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Desabilitar navegação para meses anteriores ao mês atual
  const isCurrentMonthOrPast =
    currentYear < today.getFullYear() ||
    (currentYear === today.getFullYear() && currentMonth <= today.getMonth());

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-brand-charcoal/10 shadow-sm">
      {/* Cabeçalho do Calendário */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-brand-terracotta" />
          <h3 className="font-semibold text-brand-charcoal text-sm sm:text-base capitalize">
            {MONTH_NAMES[currentMonth]} {currentYear}
          </h3>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            disabled={isCurrentMonthOrPast}
            aria-label="Mês anterior"
            className="p-1.5 rounded-lg text-brand-charcoal/60 hover:text-brand-charcoal hover:bg-brand-charcoal/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            aria-label="Próximo mês"
            className="p-1.5 rounded-lg text-brand-charcoal/60 hover:text-brand-charcoal hover:bg-brand-charcoal/5 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Dias da semana */}
      <div className="grid grid-cols-7 gap-1 mb-2 text-center">
        {WEEKDAYS.map((day, idx) => (
          <span
            key={day}
            className={`text-xs font-semibold py-1 ${
              idx === 0 || idx === 6 ? "text-brand-charcoal/40" : "text-brand-charcoal/60"
            }`}
          >
            {day}
          </span>
        ))}
      </div>

      {/* Grade de Dias */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {/* Espaços vazios do início do mês */}
        {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
          <div key={`empty-${idx}`} className="h-9 sm:h-10" />
        ))}

        {/* Dias do mês */}
        {Array.from({ length: daysInMonth }).map((_, idx) => {
          const day = idx + 1;
          const dateStr = formatDateStr(currentYear, currentMonth, day);
          const isSelected = dateStr === selectedDate;
          const isToday = dateStr === todayStr;
          const isPast = dateStr < effectiveMinDate;

          // Fins de semana (Domingo = 0, Sábado = 6)
          const dayOfWeek = new Date(currentYear, currentMonth, day).getDay();
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

          const isDisabled = isPast;

          return (
            <button
              key={dateStr}
              type="button"
              disabled={isDisabled}
              onClick={() => onSelectDate(dateStr)}
              className={`h-9 sm:h-10 rounded-xl text-xs sm:text-sm font-medium transition-all relative flex flex-col items-center justify-center cursor-pointer ${
                isSelected
                  ? "bg-brand-terracotta text-white font-bold shadow-md shadow-brand-terracotta/30 scale-105 z-10"
                  : isToday
                  ? "border border-brand-terracotta text-brand-terracotta font-semibold hover:bg-brand-terracotta/10"
                  : isDisabled
                  ? "text-brand-charcoal/20 cursor-not-allowed bg-transparent"
                  : isWeekend
                  ? "text-brand-charcoal/50 hover:bg-brand-charcoal/5"
                  : "text-brand-charcoal hover:bg-brand-terracotta/10 hover:text-brand-terracotta"
              }`}
            >
              <span>{day}</span>
              {isToday && !isSelected && (
                <span className="w-1 h-1 rounded-full bg-brand-terracotta absolute bottom-1" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legenda sutil */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-brand-charcoal/10 text-[11px] text-brand-charcoal/50">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-terracotta" />
          <span>Selecionado</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full border border-brand-terracotta" />
          <span>Hoje</span>
        </div>
        <span>Horário de Brasília (UTC-3)</span>
      </div>
    </div>
  );
}
