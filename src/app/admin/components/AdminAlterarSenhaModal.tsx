"use client";

import { useState } from "react";
import { KeyRound, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2, X, ShieldCheck } from "lucide-react";

interface AdminAlterarSenhaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AdminAlterarSenhaModal({
  isOpen,
  onClose,
  onSuccess,
}: AdminAlterarSenhaModalProps) {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState("");

  const [showSenhaAtual, setShowSenhaAtual] = useState(false);
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleResetForm = () => {
    setSenhaAtual("");
    setNovaSenha("");
    setConfirmarNovaSenha("");
    setError(null);
    setSuccess(false);
  };

  const handleClose = () => {
    handleResetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!senhaAtual) {
      setError("Informe a senha atual.");
      return;
    }

    if (!novaSenha || novaSenha.length < 8) {
      setError("A nova senha deve ter no mínimo 8 caracteres.");
      return;
    }

    if (novaSenha !== confirmarNovaSenha) {
      setError("A confirmação da nova senha não coincide.");
      return;
    }

    if (senhaAtual === novaSenha) {
      setError("A nova senha deve ser diferente da senha atual.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/alterar-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senhaAtual,
          novaSenha,
          confirmarNovaSenha,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Erro ao atualizar senha. Verifique os dados digitados.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);

      if (onSuccess) {
        onSuccess();
      }

      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      console.error("[modal-alterar-senha] Erro:", err);
      setError("Falha na comunicação com o servidor. Tente novamente.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl p-6 text-white overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Glow decorativo no topo */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-purple via-brand-terracotta to-brand-mint" />

        {/* Botão Fechar */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800 transition"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cabeçalho */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-brand-purple/20 border border-brand-purple/30 flex items-center justify-center text-brand-purple-light">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-stone-100">Alterar Senha do Admin</h3>
            <p className="text-xs text-stone-400">Atualize sua chave mestra de acesso ao painel</p>
          </div>
        </div>

        {/* Feedback de Sucesso */}
        {success ? (
          <div className="py-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-emerald-300">Senha Alterada com Sucesso!</h4>
            <p className="text-xs text-stone-400 max-w-xs mx-auto">
              Sua nova credencial já está ativa no banco de dados. Sua sessão atual foi renovada automaticamente.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Mensagem de Erro */}
            {error && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-950/50 border border-red-800/60 text-red-200 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Senha Atual */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-stone-300">
                Senha Atual
              </label>
              <div className="relative">
                <input
                  type={showSenhaAtual ? "text" : "password"}
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                  placeholder="Digite sua senha atual"
                  disabled={loading}
                  className="w-full bg-stone-950/70 border border-stone-800 focus:border-brand-purple rounded-xl px-3.5 py-2.5 text-sm text-stone-100 placeholder-stone-500 outline-none pr-10 transition focus:ring-1 focus:ring-brand-purple"
                />
                <button
                  type="button"
                  onClick={() => setShowSenhaAtual(!showSenhaAtual)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200"
                  tabIndex={-1}
                >
                  {showSenhaAtual ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Nova Senha */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-stone-300">
                Nova Senha
              </label>
              <div className="relative">
                <input
                  type={showNovaSenha ? "text" : "password"}
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  placeholder="Mínimo de 8 caracteres"
                  disabled={loading}
                  className="w-full bg-stone-950/70 border border-stone-800 focus:border-brand-purple rounded-xl px-3.5 py-2.5 text-sm text-stone-100 placeholder-stone-500 outline-none pr-10 transition focus:ring-1 focus:ring-brand-purple"
                />
                <button
                  type="button"
                  onClick={() => setShowNovaSenha(!showNovaSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200"
                  tabIndex={-1}
                >
                  {showNovaSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-stone-400 mt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-mint" />
                <span>Criptografia forte (scrypt + salt com proteção anti-força bruta)</span>
              </div>
            </div>

            {/* Confirmar Nova Senha */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-stone-300">
                Confirmar Nova Senha
              </label>
              <div className="relative">
                <input
                  type={showConfirmarSenha ? "text" : "password"}
                  value={confirmarNovaSenha}
                  onChange={(e) => setConfirmarNovaSenha(e.target.value)}
                  placeholder="Repita a nova senha"
                  disabled={loading}
                  className="w-full bg-stone-950/70 border border-stone-800 focus:border-brand-purple rounded-xl px-3.5 py-2.5 text-sm text-stone-100 placeholder-stone-500 outline-none pr-10 transition focus:ring-1 focus:ring-brand-purple"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmarSenha(!showConfirmarSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200"
                  tabIndex={-1}
                >
                  {showConfirmarSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Ações */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="px-4 py-2.5 rounded-xl text-xs font-medium text-stone-400 hover:text-white hover:bg-stone-800 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-brand-purple hover:bg-brand-purple-light text-white shadow-md shadow-brand-purple/20 transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Salvando...</span>
                  </>
                ) : (
                  <span>Salvar Nova Senha</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
