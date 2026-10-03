"use client";

import { useState } from "react";
import { Calendar, Clock, Shield, Settings } from "lucide-react";

import AdminConsultas from "./agenda/AdminConsultas";
import AdminGrade from "./agenda/AdminGrade";
import AdminBloqueios from "./agenda/AdminBloqueios";
import AdminConfiguracoes from "./agenda/AdminConfiguracoes";

export default function AdminAgenda() {
  const [activeSubTab, setActiveSubTab] = useState<"consultas" | "grade" | "bloqueios" | "configuracoes">("consultas");
  const [error, setError] = useState("");
  const [sucesso, setSucesso] = useState("");

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
      <div className="flex border-b border-brand-beige bg-white rounded-t-2xl px-4 pt-3 gap-2 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveSubTab("consultas")}
          className={`pb-3 px-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 touch-manipulation ${
            activeSubTab === "consultas"
              ? "border-brand-purple text-brand-purple"
              : "border-transparent text-brand-charcoal/50 hover:text-brand-charcoal"
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Consultas & Atendimentos</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("grade")}
          className={`pb-3 px-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 touch-manipulation ${
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
          className={`pb-3 px-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 touch-manipulation ${
            activeSubTab === "bloqueios"
              ? "border-brand-purple text-brand-purple"
              : "border-transparent text-brand-charcoal/50 hover:text-brand-charcoal"
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Bloqueios & Exceções</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("configuracoes")}
          className={`pb-3 px-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 touch-manipulation ${
            activeSubTab === "configuracoes"
              ? "border-brand-purple text-brand-purple"
              : "border-transparent text-brand-charcoal/50 hover:text-brand-charcoal"
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Configurações & Notificações</span>
        </button>
      </div>

      {activeSubTab === "consultas" && <AdminConsultas setError={setError} setSucesso={setSucesso} />}
      {activeSubTab === "grade" && <AdminGrade setError={setError} setSucesso={setSucesso} />}
      {activeSubTab === "bloqueios" && <AdminBloqueios setError={setError} setSucesso={setSucesso} />}
      {activeSubTab === "configuracoes" && <AdminConfiguracoes setError={setError} setSucesso={setSucesso} />}
    </div>
  );
}
