"use client";

import { useState, useEffect, useCallback } from "react";
import { Shield, Plus, XCircle, Trash2, Calendar, Clock } from "lucide-react";
import type { TherapistBlock } from "@/lib/types";

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

export default function AdminBloqueios({
  setError,
  setSucesso,
}: {
  setError: (msg: string) => void;
  setSucesso: (msg: string) => void;
}) {
  const [loading, setLoading] = useState(true);
  const [blocks, setBlocks] = useState<TherapistBlock[]>([]);
  
  const [modalNovoBloqueioOpen, setModalNovoBloqueioOpen] = useState(false);
  const [novoBloqueioData, setNovoBloqueioData] = useState("");
  const [novoBloqueioInicio, setNovoBloqueioInicio] = useState("08:00");
  const [novoBloqueioFim, setNovoBloqueioFim] = useState("18:00");
  const [novoBloqueioDiaInteiro, setNovoBloqueioDiaInteiro] = useState(false);
  const [novoBloqueioMotivo, setNovoBloqueioMotivo] = useState("");
  const [salvandoBloqueio, setSalvandoBloqueio] = useState(false);

  const fetchBlocks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/agendamentos/bloqueios");
      if (res.ok) {
        const data = await res.json();
        setBlocks(data.blocks || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlocks();
  }, [fetchBlocks]);

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

  if (loading) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-brand-beige">
        <div className="w-8 h-8 border-3 border-brand-purple border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-brand-charcoal/60">Carregando bloqueios...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-brand-beige p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="font-bold text-brand-charcoal flex items-center gap-2">
            <Shield className="w-4 h-4 text-brand-terracotta" />
            Bloqueios e Exceções
          </h3>
          <p className="text-xs text-brand-charcoal/60 mt-1">Feche horários específicos (férias, feriados, imprevistos) para impedir novos agendamentos.</p>
        </div>
        <button
          onClick={() => setModalNovoBloqueioOpen(true)}
          className="bg-brand-charcoal hover:bg-black text-white px-4 py-2 rounded-xl transition-colors flex items-center gap-2 text-xs font-semibold"
        >
          <Plus className="w-4 h-4" /> Novo Bloqueio
        </button>
      </div>

      {blocks.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-brand-beige rounded-xl bg-brand-beige-light/30">
          <Shield className="w-8 h-8 text-brand-charcoal/20 mx-auto mb-2" />
          <p className="text-sm font-semibold text-brand-charcoal/60">Nenhum bloqueio ativo.</p>
          <p className="text-[10px] text-brand-charcoal/40">Sua agenda está operando normalmente conforme a Grade Semanal.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {blocks.map((b) => (
            <div key={b.id} className="bg-rose-50 border border-rose-200 rounded-xl p-4 relative group">
              <button
                onClick={() => handleExcluirBloqueio(b.id)}
                className="absolute top-3 right-3 text-rose-400 hover:text-rose-700 hover:bg-rose-100 p-1.5 rounded-lg transition-colors"
                title="Remover Bloqueio"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              
              <div className="space-y-2 pr-8">
                <div className="flex items-center gap-2 text-rose-800 text-xs font-bold">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {formatDateTimeBr(b.start_time).split(" ")[0]}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-rose-600 text-[11px] font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {formatDateTimeBr(b.start_time).split(" ")[1]} às {formatDateTimeBr(b.end_time).split(" ")[1]}
                  </span>
                </div>
                {b.reason && (
                  <p className="text-[10px] text-rose-700/80 mt-2 line-clamp-2 italic border-t border-rose-200/50 pt-2">
                    &quot;{b.reason}&quot;
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: Novo Bloqueio */}
      {modalNovoBloqueioOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-charcoal/80 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-brand-beige overflow-hidden">
            <div className="p-6 border-b border-brand-beige flex justify-between items-center">
              <h3 className="font-bold text-brand-charcoal flex items-center gap-2">
                <Shield className="w-4 h-4 text-brand-terracotta" />
                Adicionar Bloqueio
              </h3>
              <button onClick={() => setModalNovoBloqueioOpen(false)} className="text-brand-charcoal/40 hover:text-brand-charcoal">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCriarBloqueio} className="p-6 space-y-4 bg-brand-beige-light/30">
              <div>
                <label className="block text-xs font-semibold text-brand-charcoal mb-1">Data do Bloqueio</label>
                <input
                  type="date"
                  required
                  value={novoBloqueioData}
                  onChange={(e) => setNovoBloqueioData(e.target.value)}
                  className="w-full bg-white border border-brand-beige rounded-xl px-3 py-2 text-sm text-brand-charcoal focus:ring-2 focus:ring-brand-purple outline-hidden"
                />
              </div>

              <div className="bg-white p-3 rounded-xl border border-brand-beige">
                <label className="flex items-center gap-2 cursor-pointer mb-3">
                  <input
                    type="checkbox"
                    checked={novoBloqueioDiaInteiro}
                    onChange={(e) => setNovoBloqueioDiaInteiro(e.target.checked)}
                    className="w-4 h-4 text-brand-purple rounded focus:ring-brand-purple"
                  />
                  <span className="text-xs font-bold text-brand-charcoal">Bloquear o dia inteiro (24h)</span>
                </label>

                {!novoBloqueioDiaInteiro && (
                  <div className="flex items-center gap-3 pt-3 border-t border-brand-beige/50">
                    <div className="flex-1">
                      <label className="block text-[10px] font-semibold text-brand-charcoal/60 mb-1 uppercase tracking-wider">Hora Início</label>
                      <input
                        type="time"
                        value={novoBloqueioInicio}
                        onChange={(e) => setNovoBloqueioInicio(e.target.value)}
                        className="w-full bg-brand-beige-light border border-brand-beige rounded-lg px-2 py-1.5 text-xs text-brand-charcoal outline-hidden"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[10px] font-semibold text-brand-charcoal/60 mb-1 uppercase tracking-wider">Hora Fim</label>
                      <input
                        type="time"
                        value={novoBloqueioFim}
                        onChange={(e) => setNovoBloqueioFim(e.target.value)}
                        className="w-full bg-brand-beige-light border border-brand-beige rounded-lg px-2 py-1.5 text-xs text-brand-charcoal outline-hidden"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-charcoal mb-1">Motivo (Visível apenas para você)</label>
                <input
                  type="text"
                  value={novoBloqueioMotivo}
                  onChange={(e) => setNovoBloqueioMotivo(e.target.value)}
                  placeholder="Ex: Feriado, Médico, Imprevisto..."
                  className="w-full bg-white border border-brand-beige rounded-xl px-3 py-2 text-sm text-brand-charcoal focus:ring-2 focus:ring-brand-purple outline-hidden"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={salvandoBloqueio}
                  className="w-full bg-brand-charcoal hover:bg-black text-white py-3 rounded-xl transition-colors font-bold text-sm flex items-center justify-center gap-2"
                >
                  {salvandoBloqueio ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Confirmar Bloqueio"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
