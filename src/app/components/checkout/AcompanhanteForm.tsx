import React from "react";
import { Users } from "lucide-react";

export interface AcompanhanteItem {
  key: string;
  produto_id: string;
  produto_nome: string;
  indice: number;
  nome: string;
  email: string;
  telefone: string;
}

interface AcompanhanteFormProps {
  acompanhantes: AcompanhanteItem[];
  setAcompanhantes: React.Dispatch<React.SetStateAction<AcompanhanteItem[]>>;
  formatPhone: (val: string) => string;
}

export default function AcompanhanteForm({
  acompanhantes,
  setAcompanhantes,
  formatPhone,
}: AcompanhanteFormProps) {
  if (acompanhantes.length === 0) return null;

  return (
    <div className="mt-6 pt-5 border-t border-brand-charcoal/10">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-full bg-brand-terracotta/15 flex items-center justify-center text-brand-terracotta shrink-0">
          <Users className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-terracotta">
            Dados dos Participantes Adicionais ({acompanhantes.length})
          </h3>
          <p className="text-[11px] text-brand-charcoal/60">
            Você selecionou mais de uma vaga. Preencha os dados de quem irá participar:
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {acompanhantes.map((ac) => (
          <div
            key={ac.key}
            className="p-3.5 bg-brand-offwhite rounded-xl border border-brand-charcoal/10 space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-brand-charcoal">
                Participante {ac.indice} — {ac.produto_nome}
              </span>
              <span className="text-[10px] bg-brand-purple/10 text-brand-purple px-2 py-0.5 rounded-full font-medium">
                Vaga Acompanhante
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="text-[11px] font-medium text-brand-charcoal/75 block mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={ac.nome}
                  onChange={(e) => {
                    const val = e.target.value;
                    setAcompanhantes((prev) =>
                      prev.map((item) => (item.key === ac.key ? { ...item, nome: val } : item))
                    );
                  }}
                  placeholder="Nome do participante"
                  className="w-full bg-white border border-brand-charcoal/15 focus:border-brand-terracotta focus:ring-1 focus:ring-brand-terracotta rounded-lg px-3 py-2 text-xs text-brand-charcoal outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-brand-charcoal/75 block mb-1">
                  WhatsApp / Telefone *
                </label>
                <input
                  type="tel"
                  required
                  value={ac.telefone}
                  onChange={(e) => {
                    const val = formatPhone(e.target.value);
                    setAcompanhantes((prev) =>
                      prev.map((item) => (item.key === ac.key ? { ...item, telefone: val } : item))
                    );
                  }}
                  placeholder="(11) 99999-9999"
                  className="w-full bg-white border border-brand-charcoal/15 focus:border-brand-terracotta focus:ring-1 focus:ring-brand-terracotta rounded-lg px-3 py-2 text-xs text-brand-charcoal outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-brand-charcoal/75 block mb-1">
                  E-mail *
                </label>
                <input
                  type="email"
                  required
                  value={ac.email}
                  onChange={(e) => {
                    const val = e.target.value;
                    setAcompanhantes((prev) =>
                      prev.map((item) => (item.key === ac.key ? { ...item, email: val } : item))
                    );
                  }}
                  placeholder="email@exemplo.com"
                  className="w-full bg-white border border-brand-charcoal/15 focus:border-brand-terracotta focus:ring-1 focus:ring-brand-terracotta rounded-lg px-3 py-2 text-xs text-brand-charcoal outline-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
