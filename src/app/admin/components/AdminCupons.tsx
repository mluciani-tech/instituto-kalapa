"use client";

import { useState } from "react";
import type { Cupom, Produto } from "@/lib/types";
import { formatDate } from "../lib/format";

type Props = {
  cupons: Cupom[];
  produtos: Produto[];
  onReload: () => Promise<void>;
  onError: (message: string) => void;
};

export default function AdminCupons({ cupons, produtos, onReload, onError }: Props) {
  const [showCupomModal, setShowCupomModal] = useState(false);
  const [cupomEditando, setCupomEditando] = useState<Cupom | null>(null);
  const [cupomForm, setCupomForm] = useState({
    codigo: "",
    tipo: "porcentagem" as "porcentagem" | "fixo",
    valor: "",
    quantidade_maxima: "",
    valor_minimo_pedido: "",
    validade: "",
    ativo: true,
    produto_id: null as string | null,
  });
  const [salvandoCupom, setSalvandoCupom] = useState(false);
  const [cupomSucesso, setCupomSucesso] = useState("");

  const handleSalvarCupom = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvandoCupom(true);
    setCupomSucesso("");
    try {
      const url = cupomEditando ? `/api/admin/cupons/${cupomEditando.id}` : "/api/admin/cupons";
      const method = cupomEditando ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cupomForm),
      });
      if (res.ok) {
        setShowCupomModal(false);
        setCupomEditando(null);
        setCupomSucesso("Cupom salvo com sucesso!");
        await onReload();
        setTimeout(() => setCupomSucesso(""), 3000);
      } else {
        const d = await res.json();
        onError(d.error || "Erro ao salvar cupom");
      }
    } catch {
      onError("Erro ao salvar cupom");
    }
    setSalvandoCupom(false);
  };

  const handleToggleCupomAtivo = async (cupom: Cupom) => {
    const res = await fetch(`/api/admin/cupons/${cupom.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ativo: !cupom.ativo }),
    });
    if (res.ok) await onReload();
  };

  const handleExcluirCupom = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este cupom?")) return;
    const res = await fetch(`/api/admin/cupons/${id}`, { method: "DELETE" });
    if (res.ok) await onReload();
  };

  return (
    <>
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-brand-charcoal">Cupons de Desconto</h2>
                <p className="text-xs text-brand-charcoal/50">Crie e gerencie cupons aplicáveis no checkout</p>
              </div>
              <button
                onClick={() => {
                  setCupomEditando(null);
                  setCupomForm({
                    codigo: "",
                    tipo: "porcentagem",
                    valor: "",
                    quantidade_maxima: "",
                    valor_minimo_pedido: "",
                    validade: "",
                    ativo: true,
                    produto_id: null,
                  });
                  setShowCupomModal(true);
                }}
                className="px-4 py-2 bg-brand-purple text-white text-sm font-medium rounded-lg hover:bg-brand-purple-dark transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                + Novo Cupom
              </button>
            </div>

            {cupomSucesso && (
              <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
                {cupomSucesso}
              </div>
            )}

            <div className="bg-white rounded-xl border border-brand-beige overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-brand-beige-light border-b border-brand-beige text-xs font-semibold text-brand-charcoal/70 uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Código</th>
                      <th className="px-4 py-3">Desconto</th>
                      <th className="px-4 py-3">Utilizações</th>
                      <th className="px-4 py-3">Mínimo</th>
                      <th className="px-4 py-3">Validade</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-beige">
                    {cupons.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-brand-charcoal/50 text-sm">
                          Nenhum cupom cadastrado ainda. Clique em &ldquo;+ Novo Cupom&rdquo; para criar o primeiro.
                        </td>
                      </tr>
                    ) : (
                      cupons.map((c) => {
                        const expirado = c.validade && new Date(c.validade) < new Date();
                        const esgotado = c.quantidade_maxima != null && c.quantidade_utilizada >= c.quantidade_maxima;
                        return (
                          <tr key={c.id} className="hover:bg-brand-beige-light/40 transition-colors">
                            <td className="px-4 py-3 font-mono font-bold text-brand-purple text-sm">
                              {c.codigo}
                            </td>
                            <td className="px-4 py-3 font-medium text-brand-charcoal">
                              {c.tipo === "porcentagem" ? `${c.valor}%` : `R$ ${Number(c.valor).toFixed(2)}`}
                            </td>
                            <td className="px-4 py-3 text-brand-charcoal/70 text-xs">
                              {c.quantidade_utilizada || 0} / {c.quantidade_maxima ? c.quantidade_maxima : "ilimitado"}
                            </td>
                            <td className="px-4 py-3 text-brand-charcoal/70 text-xs">
                              {Number(c.valor_minimo_pedido) > 0 ? `R$ ${Number(c.valor_minimo_pedido).toFixed(2)}` : "—"}
                            </td>
                            <td className="px-4 py-3 text-brand-charcoal/60 text-xs">
                              {c.validade ? formatDate(c.validade) : "Sem expiração"}
                              {expirado && <span className="ml-1 text-red-500 font-semibold">(Expirado)</span>}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                  !c.ativo
                                    ? "bg-gray-100 text-gray-600"
                                    : esgotado
                                    ? "bg-amber-100 text-amber-800"
                                    : expirado
                                    ? "bg-red-100 text-red-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {!c.ativo ? "Inativo" : esgotado ? "Esgotado" : expirado ? "Expirado" : "Ativo"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleToggleCupomAtivo(c)}
                                  className="px-2.5 py-1 text-xs border border-brand-beige rounded-lg hover:bg-brand-beige text-brand-charcoal/70 transition-colors"
                                >
                                  {c.ativo ? "Desativar" : "Ativar"}
                                </button>
                                <button
                                  onClick={() => {
                                    setCupomEditando(c);
                                    setCupomForm({
                                      codigo: c.codigo,
                                      tipo: c.tipo,
                                      valor: c.valor.toString(),
                                      quantidade_maxima: c.quantidade_maxima ? c.quantidade_maxima.toString() : "",
                                      valor_minimo_pedido: c.valor_minimo_pedido ? c.valor_minimo_pedido.toString() : "",
                                      validade: c.validade ? c.validade.slice(0, 16) : "",
                                      ativo: c.ativo,
                                      produto_id: c.produto_id || null,
                                    });
                                    setShowCupomModal(true);
                                  }}
                                  className="px-2.5 py-1 text-xs border border-brand-beige rounded-lg hover:bg-brand-beige text-brand-purple transition-colors"
                                >
                                  Editar
                                </button>
                                <button
                                  onClick={() => handleExcluirCupom(c.id)}
                                  className="px-2.5 py-1 text-xs border border-red-200 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  Excluir
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
      {showCupomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" style={{ overscrollBehavior: "contain" }} role="dialog" aria-modal="true" aria-label="Cupom" onKeyDown={(e) => { if (e.key === "Escape") setShowCupomModal(false); }}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-base font-semibold text-brand-charcoal mb-4">
              {cupomEditando ? "Editar Cupom" : "Novo Cupom de Desconto"}
            </h3>
            <form onSubmit={handleSalvarCupom} className="space-y-3.5">
              <div>
                <label className="text-xs font-medium text-brand-charcoal/70 block mb-1">Código do Cupom *</label>
                <input
                  type="text"
                  required
                  value={cupomForm.codigo}
                  onChange={(e) => setCupomForm({ ...cupomForm, codigo: e.target.value.toUpperCase() })}
                  placeholder="EX: PROMO10"
                  className="w-full border border-brand-beige rounded-lg px-3 py-2 text-sm uppercase font-mono font-bold focus-visible:border-brand-purple"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-brand-charcoal/70 block mb-1">Tipo de Desconto</label>
                  <select
                    value={cupomForm.tipo}
                    onChange={(e) => setCupomForm({ ...cupomForm, tipo: e.target.value as "porcentagem" | "fixo" })}
                    className="w-full border border-brand-beige rounded-lg px-3 py-2 text-sm focus-visible:border-brand-purple"
                  >
                    <option value="porcentagem">Porcentagem (%)</option>
                    <option value="fixo">Valor Fixo (R$)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-brand-charcoal/70 block mb-1">
                    Valor {cupomForm.tipo === "porcentagem" ? "(%)" : "(R$)"} *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={cupomForm.valor}
                    onChange={(e) => setCupomForm({ ...cupomForm, valor: e.target.value })}
                    placeholder={cupomForm.tipo === "porcentagem" ? "10" : "20.00"}
                    className="w-full border border-brand-beige rounded-lg px-3 py-2 text-sm focus-visible:border-brand-purple"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-brand-charcoal/70 block mb-1">Quantidade Máxima</label>
                  <input
                    type="number"
                    min="1"
                    value={cupomForm.quantidade_maxima}
                    onChange={(e) => setCupomForm({ ...cupomForm, quantidade_maxima: e.target.value })}
                    placeholder="Ilimitado"
                    className="w-full border border-brand-beige rounded-lg px-3 py-2 text-sm focus-visible:border-brand-purple"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-brand-charcoal/70 block mb-1">Pedido Mínimo (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={cupomForm.valor_minimo_pedido}
                    onChange={(e) => setCupomForm({ ...cupomForm, valor_minimo_pedido: e.target.value })}
                    placeholder="0.00"
                    className="w-full border border-brand-beige rounded-lg px-3 py-2 text-sm focus-visible:border-brand-purple"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-brand-charcoal/70 block mb-1">Produto *</label>
                <select
                  required
                  value={cupomForm.produto_id || ""}
                  onChange={(e) => setCupomForm({ ...cupomForm, produto_id: e.target.value || null })}
                  className="w-full border border-brand-beige rounded-lg px-3 py-2 text-sm focus-visible:border-brand-purple"
                >
                  <option value="" disabled>Selecione um produto</option>
                  {produtos.map(p => (
                    <option key={p.id} value={p.id}>{p.nome}</option>
                  ))}
                </select>
                <span className="text-[10px] text-brand-charcoal/40 mt-0.5 block">O cupom deve ser atrelado a um produto específico</span>
              </div>

              <div>
                <label className="text-xs font-medium text-brand-charcoal/70 block mb-1">Data e Hora de Validade</label>
                <input
                  type="datetime-local"
                  value={cupomForm.validade}
                  onChange={(e) => setCupomForm({ ...cupomForm, validade: e.target.value })}
                  className="w-full border border-brand-beige rounded-lg px-3 py-2 text-sm focus-visible:border-brand-purple"
                />
                <span className="text-[10px] text-brand-charcoal/40 mt-0.5 block">Deixe em branco para não expirar</span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="cupom-ativo"
                  checked={cupomForm.ativo}
                  onChange={(e) => setCupomForm({ ...cupomForm, ativo: e.target.checked })}
                  className="rounded border-brand-beige text-brand-purple focus:ring-brand-purple"
                />
                <label htmlFor="cupom-ativo" className="text-xs font-medium text-brand-charcoal cursor-pointer">
                  Cupom Ativo para uso
                </label>
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t border-brand-beige">
                <button
                  type="button"
                  onClick={() => setShowCupomModal(false)}
                  className="px-4 py-2 text-xs text-brand-charcoal/60 hover:text-brand-charcoal transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvandoCupom}
                  className="px-4 py-2 text-xs bg-brand-purple text-white rounded-lg hover:bg-brand-purple-dark disabled:opacity-50 transition-colors"
                >
                  {salvandoCupom ? "Salvando..." : "Salvar Cupom"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
