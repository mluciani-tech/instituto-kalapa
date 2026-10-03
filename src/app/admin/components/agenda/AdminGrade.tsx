"use client";

import { useState, useEffect, useCallback } from "react";
import { Save } from "lucide-react";
import type { TherapistAvailability } from "@/lib/types";

const WEEKDAYS = [
  { id: 1, name: "Segunda-feira" },
  { id: 2, name: "Terça-feira" },
  { id: 3, name: "Quarta-feira" },
  { id: 4, name: "Quinta-feira" },
  { id: 5, name: "Sexta-feira" },
  { id: 6, name: "Sábado" },
  { id: 0, name: "Domingo" },
];

function formatSlotDuration(minutos: number): string {
  if (!minutos || minutos <= 0) return "1:30hs";
  if (minutos < 60) return `${minutos}min`;
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return m > 0 ? `${h}:${m.toString().padStart(2, "0")}hs` : `${h}h`;
}

export default function AdminGrade({
  setError,
  setSucesso,
}: {
  setError: (msg: string) => void;
  setSucesso: (msg: string) => void;
}) {
  const [loading, setLoading] = useState(true);
  const [grade, setGrade] = useState<{
    [day: number]: {
      ativo: boolean;
      manhaAtivo: boolean;
      manhaInicio: string;
      manhaFim: string;
      tardeAtivo: boolean;
      tardeInicio: string;
      tardeFim: string;
      noiteAtivo: boolean;
      noiteInicio: string;
      noiteFim: string;
      slotMinutos: number;
      bufferMinutos: number;
    };
  }>({
    1: { ativo: true, manhaAtivo: true, manhaInicio: "09:00", manhaFim: "12:00", tardeAtivo: true, tardeInicio: "13:00", tardeFim: "15:00", noiteAtivo: true, noiteInicio: "18:00", noiteFim: "21:00", slotMinutos: 90, bufferMinutos: 0 },
    2: { ativo: true, manhaAtivo: true, manhaInicio: "09:00", manhaFim: "12:00", tardeAtivo: true, tardeInicio: "13:00", tardeFim: "15:00", noiteAtivo: true, noiteInicio: "18:00", noiteFim: "21:00", slotMinutos: 90, bufferMinutos: 0 },
    3: { ativo: true, manhaAtivo: true, manhaInicio: "09:00", manhaFim: "12:00", tardeAtivo: true, tardeInicio: "13:00", tardeFim: "15:00", noiteAtivo: true, noiteInicio: "18:00", noiteFim: "21:00", slotMinutos: 90, bufferMinutos: 0 },
    4: { ativo: true, manhaAtivo: true, manhaInicio: "09:00", manhaFim: "12:00", tardeAtivo: true, tardeInicio: "13:00", tardeFim: "15:00", noiteAtivo: true, noiteInicio: "18:00", noiteFim: "21:00", slotMinutos: 90, bufferMinutos: 0 },
    5: { ativo: true, manhaAtivo: true, manhaInicio: "09:00", manhaFim: "12:00", tardeAtivo: true, tardeInicio: "13:00", tardeFim: "15:00", noiteAtivo: true, noiteInicio: "18:00", noiteFim: "21:00", slotMinutos: 90, bufferMinutos: 0 },
    6: { ativo: false, manhaAtivo: false, manhaInicio: "09:00", manhaFim: "12:00", tardeAtivo: false, tardeInicio: "13:00", tardeFim: "15:00", noiteAtivo: false, noiteInicio: "18:00", noiteFim: "21:00", slotMinutos: 90, bufferMinutos: 0 },
    0: { ativo: false, manhaAtivo: false, manhaInicio: "09:00", manhaFim: "12:00", tardeAtivo: false, tardeInicio: "13:00", tardeFim: "15:00", noiteAtivo: false, noiteInicio: "18:00", noiteFim: "21:00", slotMinutos: 90, bufferMinutos: 0 },
  });
  const [salvandoGrade, setSalvandoGrade] = useState(false);

  const fetchGrade = useCallback(async () => {
    try {
      setLoading(true);
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
              tardeInicio: "13:00",
              tardeFim: "15:00",
              noiteAtivo: false,
              noiteInicio: "18:00",
              noiteFim: "21:00",
              slotMinutos: 90,
              bufferMinutos: 0,
            };
          }

          // Agrupar janelas por dia
          rawAvail.forEach((w) => {
            const d = w.day_of_week;
            novaGrade[d].ativo = true;
            const duracao = (!w.slot_duration_minutes || w.slot_duration_minutes === 50) ? 90 : w.slot_duration_minutes;
            novaGrade[d].slotMinutos = duracao;
            novaGrade[d].bufferMinutos = (w.slot_duration_minutes === 50) ? 0 : (w.buffer_duration_minutes || 0);

            const startHour = parseInt(w.start_time.slice(0, 2), 10);
            if (startHour < 13) {
              novaGrade[d].manhaAtivo = true;
              novaGrade[d].manhaInicio = w.start_time.slice(0, 5);
              novaGrade[d].manhaFim = w.end_time.slice(0, 5);
            } else if (startHour >= 13 && startHour < 17) {
              novaGrade[d].tardeAtivo = true;
              novaGrade[d].tardeInicio = w.start_time.slice(0, 5);
              novaGrade[d].tardeFim = w.end_time.slice(0, 5);
            } else {
              novaGrade[d].noiteAtivo = true;
              novaGrade[d].noiteInicio = w.start_time.slice(0, 5);
              novaGrade[d].noiteFim = w.end_time.slice(0, 5);
            }
          });
          setGrade(novaGrade);
        }
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [grade]);

  useEffect(() => {
    fetchGrade();
  }, [fetchGrade]);

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
            slot_duration_minutes: cfg.slotMinutos || 90,
            buffer_duration_minutes: cfg.bufferMinutos || 0,
            ativo: true,
          });
        }

        if (cfg.noiteAtivo) {
          windows.push({
            day_of_week: day,
            start_time: `${cfg.noiteInicio}:00`,
            end_time: `${cfg.noiteFim}:00`,
            slot_duration_minutes: cfg.slotMinutos || 90,
            buffer_duration_minutes: cfg.bufferMinutos || 0,
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

  if (loading) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-brand-beige">
        <div className="w-8 h-8 border-3 border-brand-purple border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-brand-charcoal/60">Carregando grade...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-brand-beige p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="font-bold text-brand-charcoal">Grade Regular Semanal</h3>
          <p className="text-xs text-brand-charcoal/60">Defina os dias e os 3 turnos (Manhã, Tarde, Noite) em que você atende.</p>
        </div>
        <button
          onClick={handleSalvarGrade}
          disabled={salvandoGrade}
          className="bg-brand-purple hover:bg-brand-charcoal text-white px-5 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm font-semibold touch-manipulation cursor-pointer shrink-0 disabled:opacity-50"
        >
          {salvandoGrade ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>Salvar Grade</span>
        </button>
      </div>

      <div className="space-y-4">
        {WEEKDAYS.map((wd) => {
          const cfg = grade[wd.id];
          return (
            <div
              key={wd.id}
              className={`p-4 rounded-xl border transition-colors ${
                cfg.ativo ? "bg-white border-brand-purple/30 shadow-xs" : "bg-brand-beige-light border-brand-beige/50"
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <input
                  type="checkbox"
                  checked={cfg.ativo}
                  onChange={(e) => setGrade({ ...grade, [wd.id]: { ...cfg, ativo: e.target.checked } })}
                  className="w-4 h-4 text-brand-purple rounded-md focus:ring-brand-purple cursor-pointer"
                />
                <span className={`font-bold ${cfg.ativo ? "text-brand-charcoal" : "text-brand-charcoal/40"}`}>
                  {wd.name}
                </span>
                
                {cfg.ativo && (
                  <div className="ml-auto flex items-center gap-3 bg-brand-beige-light px-3 py-1.5 rounded-lg border border-brand-beige">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-semibold text-brand-charcoal/60 uppercase tracking-wider">Duração:</span>
                      <select
                        value={cfg.slotMinutos}
                        onChange={(e) => setGrade({ ...grade, [wd.id]: { ...cfg, slotMinutos: Number(e.target.value) } })}
                        className="text-xs bg-white border-none py-1 pr-6 font-bold text-brand-purple focus:ring-0 cursor-pointer"
                      >
                        <option value={50}>50 min</option>
                        <option value={60}>1h</option>
                        <option value={90}>1:30hs</option>
                        <option value={120}>2hs</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {cfg.ativo && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-7">
                  {/* Manhã */}
                  <div className={`p-3 rounded-xl border ${cfg.manhaAtivo ? "bg-amber-50 border-amber-200" : "bg-gray-50 border-gray-200"}`}>
                    <label className="flex items-center gap-2 mb-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cfg.manhaAtivo}
                        onChange={(e) => setGrade({ ...grade, [wd.id]: { ...cfg, manhaAtivo: e.target.checked } })}
                        className="w-3.5 h-3.5 text-amber-600 rounded focus:ring-amber-500"
                      />
                      <span className={`text-xs font-bold ${cfg.manhaAtivo ? "text-amber-800" : "text-gray-400"}`}>Turno da Manhã</span>
                    </label>
                    {cfg.manhaAtivo && (
                      <div className="flex items-center gap-2">
                        <input
                          type="time"
                          value={cfg.manhaInicio}
                          onChange={(e) => setGrade({ ...grade, [wd.id]: { ...cfg, manhaInicio: e.target.value } })}
                          className="w-full bg-white border border-amber-200 rounded-lg px-2 py-1.5 text-xs text-amber-900 focus:ring-amber-500 outline-hidden"
                        />
                        <span className="text-amber-700 text-xs">até</span>
                        <input
                          type="time"
                          value={cfg.manhaFim}
                          onChange={(e) => setGrade({ ...grade, [wd.id]: { ...cfg, manhaFim: e.target.value } })}
                          className="w-full bg-white border border-amber-200 rounded-lg px-2 py-1.5 text-xs text-amber-900 focus:ring-amber-500 outline-hidden"
                        />
                      </div>
                    )}
                  </div>

                  {/* Tarde */}
                  <div className={`p-3 rounded-xl border ${cfg.tardeAtivo ? "bg-orange-50 border-orange-200" : "bg-gray-50 border-gray-200"}`}>
                    <label className="flex items-center gap-2 mb-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cfg.tardeAtivo}
                        onChange={(e) => setGrade({ ...grade, [wd.id]: { ...cfg, tardeAtivo: e.target.checked } })}
                        className="w-3.5 h-3.5 text-orange-600 rounded focus:ring-orange-500"
                      />
                      <span className={`text-xs font-bold ${cfg.tardeAtivo ? "text-orange-800" : "text-gray-400"}`}>Turno da Tarde</span>
                    </label>
                    {cfg.tardeAtivo && (
                      <div className="flex items-center gap-2">
                        <input
                          type="time"
                          value={cfg.tardeInicio}
                          onChange={(e) => setGrade({ ...grade, [wd.id]: { ...cfg, tardeInicio: e.target.value } })}
                          className="w-full bg-white border border-orange-200 rounded-lg px-2 py-1.5 text-xs text-orange-900 focus:ring-orange-500 outline-hidden"
                        />
                        <span className="text-orange-700 text-xs">até</span>
                        <input
                          type="time"
                          value={cfg.tardeFim}
                          onChange={(e) => setGrade({ ...grade, [wd.id]: { ...cfg, tardeFim: e.target.value } })}
                          className="w-full bg-white border border-orange-200 rounded-lg px-2 py-1.5 text-xs text-orange-900 focus:ring-orange-500 outline-hidden"
                        />
                      </div>
                    )}
                  </div>

                  {/* Noite */}
                  <div className={`p-3 rounded-xl border ${cfg.noiteAtivo ? "bg-indigo-50 border-indigo-200" : "bg-gray-50 border-gray-200"}`}>
                    <label className="flex items-center gap-2 mb-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cfg.noiteAtivo}
                        onChange={(e) => setGrade({ ...grade, [wd.id]: { ...cfg, noiteAtivo: e.target.checked } })}
                        className="w-3.5 h-3.5 text-indigo-600 rounded focus:ring-indigo-500"
                      />
                      <span className={`text-xs font-bold ${cfg.noiteAtivo ? "text-indigo-800" : "text-gray-400"}`}>Turno da Noite</span>
                    </label>
                    {cfg.noiteAtivo && (
                      <div className="flex items-center gap-2">
                        <input
                          type="time"
                          value={cfg.noiteInicio}
                          onChange={(e) => setGrade({ ...grade, [wd.id]: { ...cfg, noiteInicio: e.target.value } })}
                          className="w-full bg-white border border-indigo-200 rounded-lg px-2 py-1.5 text-xs text-indigo-900 focus:ring-indigo-500 outline-hidden"
                        />
                        <span className="text-indigo-700 text-xs">até</span>
                        <input
                          type="time"
                          value={cfg.noiteFim}
                          onChange={(e) => setGrade({ ...grade, [wd.id]: { ...cfg, noiteFim: e.target.value } })}
                          className="w-full bg-white border border-indigo-200 rounded-lg px-2 py-1.5 text-xs text-indigo-900 focus:ring-indigo-500 outline-hidden"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
