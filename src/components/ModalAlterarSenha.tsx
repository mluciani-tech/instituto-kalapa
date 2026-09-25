"use client";

import { useState, useEffect } from "react";
import { X, Lock, KeyRound, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2, Mail } from "lucide-react";

interface ModalAlterarSenhaProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
}

export default function ModalAlterarSenha({
  isOpen,
  onClose,
  userEmail,
}: ModalAlterarSenhaProps) {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState("");

  const [showSenhaAtual, setShowSenhaAtual] = useState(false);
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const [enviandoLink, setEnviandoLink] = useState(false);
  const [linkEnviado, setLinkEnviado] = useState(false);

  // Limpar formulário quando fechar ou abrir
  useEffect(() => {
    if (isOpen) {
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarNovaSenha("");
      setErro("");
      setSucesso("");
      setLinkEnviado(false);
    }
  }, [isOpen]);

  // Fechar com tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !loading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (!senhaAtual) {
      setErro("Informe sua senha atual.");
      return;
    }

    if (novaSenha.length < 8) {
      setErro("A nova senha deve ter no mínimo 8 caracteres.");
      return;
    }

    if (novaSenha !== confirmarNovaSenha) {
      setErro("A confirmação de senha não confere.");
      return;
    }

    if (senhaAtual === novaSenha) {
      setErro("A nova senha não pode ser igual à senha atual.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/alterar-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senhaAtual,
          novaSenha,
          confirmarNovaSenha,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.error || "Erro ao alterar a senha.");
      } else {
        setSucesso("Senha alterada com sucesso!");
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch {
      setErro("Falha de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleEnviarLinkRecuperacao = async () => {
    if (!userEmail) return;
    setEnviandoLink(true);
    setErro("");
    try {
      const res = await fetch("/api/auth/esqueci-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      });
      if (res.ok) {
        setLinkEnviado(true);
      } else {
        const d = await res.json();
        setErro(d.error || "Erro ao enviar link de recuperação.");
      }
    } catch {
      setErro("Erro de conexão ao solicitar recuperação.");
    } finally {
      setEnviandoLink(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-alterar-senha-title"
    >
      <div className="glass-card rounded-2xl p-6 md:p-8 max-w-md w-full border border-white/15 shadow-2xl relative font-sans text-white">
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          disabled={loading}
          aria-label="Fechar modal"
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cabeçalho */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-brand-terracotta/20 border border-brand-terracotta/30 flex items-center justify-center text-brand-terracotta shrink-0">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 id="modal-alterar-senha-title" className="text-lg font-bold text-white tracking-tight">
              Alterar Senha
            </h3>
            <p className="text-xs text-white/60">
              Defina uma nova senha para sua conta
            </p>
          </div>
        </div>

        {/* Alerta de Sucesso */}
        {sucesso ? (
          <div className="py-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-brand-mint/20 border border-brand-mint/40 text-brand-mint flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-white">{sucesso}</p>
            <p className="text-xs text-white/60">Sua conta já está atualizada com a nova credencial.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {erro && (
              <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-200 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                <span className="leading-tight">{erro}</span>
              </div>
            )}

            {linkEnviado && (
              <div className="p-3.5 rounded-xl bg-brand-mint/15 border border-brand-mint/30 text-brand-mint text-xs flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-tight">
                  Link de redefinição enviado para <strong>{userEmail}</strong>! Verifique sua caixa de entrada.
                </span>
              </div>
            )}

            {/* Senha Atual */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-white/80 block">
                  Senha Atual *
                </label>
                {userEmail && !linkEnviado && (
                  <button
                    type="button"
                    onClick={handleEnviarLinkRecuperacao}
                    disabled={enviandoLink}
                    className="text-[11px] text-brand-terracotta hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Mail className="w-3 h-3" />
                    {enviandoLink ? "Enviando link..." : "Esqueceu a senha atual?"}
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showSenhaAtual ? "text" : "password"}
                  required
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                  placeholder="Digite sua senha atual"
                  className="w-full bg-white/5 border border-white/15 focus:border-brand-terracotta rounded-xl px-3.5 py-2.5 pr-10 text-xs text-white placeholder-white/30 outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowSenhaAtual(!showSenhaAtual)}
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
                >
                  {showSenhaAtual ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Nova Senha */}
            <div>
              <label className="text-xs font-medium text-white/80 block mb-1.5">
                Nova Senha * <span className="text-white/40 font-normal">(mínimo de 8 caracteres)</span>
              </label>
              <div className="relative">
                <input
                  type={showNovaSenha ? "text" : "password"}
                  required
                  minLength={8}
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  placeholder="Digite sua nova senha segura"
                  className="w-full bg-white/5 border border-white/15 focus:border-brand-terracotta rounded-xl px-3.5 py-2.5 pr-10 text-xs text-white placeholder-white/30 outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowNovaSenha(!showNovaSenha)}
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
                >
                  {showNovaSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirmar Nova Senha */}
            <div>
              <label className="text-xs font-medium text-white/80 block mb-1.5">
                Confirmar Nova Senha *
              </label>
              <div className="relative">
                <input
                  type={showConfirmar ? "text" : "password"}
                  required
                  minLength={8}
                  value={confirmarNovaSenha}
                  onChange={(e) => setConfirmarNovaSenha(e.target.value)}
                  placeholder="Repita a nova senha"
                  className="w-full bg-white/5 border border-white/15 focus:border-brand-terracotta rounded-xl px-3.5 py-2.5 pr-10 text-xs text-white placeholder-white/30 outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmar(!showConfirmar)}
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
                >
                  {showConfirmar ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Ações */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-xs text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || novaSenha.length < 8 || !senhaAtual || !confirmarNovaSenha}
                className="px-5 py-2.5 bg-brand-terracotta hover:bg-brand-terracotta-dark text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-brand-terracotta/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    Salvar Nova Senha
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
