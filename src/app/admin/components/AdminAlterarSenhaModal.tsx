"use client";

import { useState, useId } from "react";
import { KeyRound, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2, X, ShieldCheck, Check, Circle } from "lucide-react";

interface AdminAlterarSenhaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface DiretrizRegra {
  id: string;
  label: string;
  test: (pass: string) => boolean;
}

const DIRETRIZES_SEGURANCA: DiretrizRegra[] = [
  {
    id: "length",
    label: "No mínimo 8 caracteres",
    test: (pass: string) => pass.length >= 8,
  },
  {
    id: "upper",
    label: "Pelo menos uma letra maiúscula (A-Z)",
    test: (pass: string) => /[A-Z]/.test(pass),
  },
  {
    id: "lower",
    label: "Pelo menos uma letra minúscula (a-z)",
    test: (pass: string) => /[a-z]/.test(pass),
  },
  {
    id: "number",
    label: "Pelo menos um número (0-9)",
    test: (pass: string) => /[0-9]/.test(pass),
  },
  {
    id: "special",
    label: "Pelo menos um caractere especial (!@#$%...)",
    test: (pass: string) => /[^A-Za-z0-9]/.test(pass),
  },
];

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

  const senhaAtualId = useId();
  const novaSenhaId = useId();
  const confirmarNovaSenhaId = useId();

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

  // Cálculo de atendimento das diretrizes de segurança
  const totalDiretrizes = DIRETRIZES_SEGURANCA.length;
  const diretrizesAtendidas = DIRETRIZES_SEGURANCA.filter((r) => r.test(novaSenha)).length;
  const senhasCoincidem = Boolean(
    novaSenha && confirmarNovaSenha && novaSenha === confirmarNovaSenha
  );

  // Força da senha
  const getForcaSenha = () => {
    if (!novaSenha) return { score: 0, label: "Não informada", color: "bg-stone-700" };
    if (diretrizesAtendidas <= 2) return { score: 1, label: "Fraca", color: "bg-red-500" };
    if (diretrizesAtendidas === 3) return { score: 2, label: "Razoável", color: "bg-amber-500" };
    if (diretrizesAtendidas === 4) return { score: 3, label: "Boa", color: "bg-yellow-400" };
    return { score: 4, label: "Forte e Segura", color: "bg-emerald-500" };
  };

  const forca = getForcaSenha();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const sAtual = senhaAtual.trim();
    const sNova = novaSenha.trim();
    const sConf = confirmarNovaSenha.trim();

    if (!sAtual) {
      setError("Por favor, digite sua senha atual.");
      return;
    }

    if (!sNova || sNova.length < 8) {
      setError("A nova senha deve ter no mínimo 8 caracteres.");
      return;
    }

    if (sNova !== sConf) {
      setError("A confirmação da nova senha não coincide com a senha digitada.");
      return;
    }

    if (sAtual === sNova) {
      setError("A nova senha deve ser diferente da sua senha atual.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/alterar-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senhaAtual: sAtual,
          novaSenha: sNova,
          confirmarNovaSenha: sConf,
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
      }, 2200);
    } catch (err) {
      console.error("[modal-alterar-senha] Erro:", err);
      setError("Falha na comunicação com o servidor. Tente novamente.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md my-8 bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl p-6 text-white overflow-hidden animate-in fade-in zoom-in-95 duration-200">
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
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-brand-purple/20 border border-brand-purple/30 flex items-center justify-center text-brand-purple-light shrink-0">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-100">Alterar Senha do Admin</h3>
            <p className="text-xs text-stone-400">Atualize sua chave mestra de acesso ao painel</p>
          </div>
        </div>

        {/* Feedback de Sucesso */}
        {success ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30 animate-in zoom-in-75 duration-300">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-emerald-300">Senha Alterada com Sucesso!</h4>
            <p className="text-xs text-stone-300 max-w-xs mx-auto leading-relaxed">
              Sua nova credencial já está ativa no banco de dados e criptografada com scrypt + salt. Sua sessão atual foi renovada automaticamente.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Mensagem de Erro */}
            {error && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                <span className="leading-snug">{error}</span>
              </div>
            )}

            {/* Senha Atual */}
            <div className="space-y-1.5">
              <label htmlFor={senhaAtualId} className="block text-xs font-medium text-stone-300">
                Senha Atual *
              </label>
              <div className="relative">
                <input
                  id={senhaAtualId}
                  name="current-password"
                  autoComplete="current-password"
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
                  aria-label={showSenhaAtual ? "Ocultar senha atual" : "Mostrar senha atual"}
                >
                  {showSenhaAtual ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Nova Senha */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor={novaSenhaId} className="block text-xs font-medium text-stone-300">
                  Nova Senha *
                </label>
                {novaSenha && (
                  <span className="text-[11px] font-semibold text-stone-400">
                    Força: <span className="text-white">{forca.label}</span>
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  id={novaSenhaId}
                  name="new-password"
                  autoComplete="new-password"
                  type={showNovaSenha ? "text" : "password"}
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  placeholder="Mínimo de 8 caracteres com letras e símbolos"
                  disabled={loading}
                  className="w-full bg-stone-950/70 border border-stone-800 focus:border-brand-purple rounded-xl px-3.5 py-2.5 text-sm text-stone-100 placeholder-stone-500 outline-none pr-10 transition focus:ring-1 focus:ring-brand-purple"
                />
                <button
                  type="button"
                  onClick={() => setShowNovaSenha(!showNovaSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200"
                  tabIndex={-1}
                  aria-label={showNovaSenha ? "Ocultar nova senha" : "Mostrar nova senha"}
                >
                  {showNovaSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Barra de Força da Senha */}
              {novaSenha && (
                <div className="h-1.5 w-full bg-stone-800 rounded-full overflow-hidden mt-1.5 flex gap-1">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`h-full flex-1 transition-all duration-300 ${
                        forca.score >= step ? forca.color : "bg-stone-800"
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Checklist Visual das Diretrizes de Segurança */}
              <div className="bg-stone-950/40 border border-stone-800/80 rounded-xl p-3 space-y-1.5 mt-2">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-300 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-mint" />
                  <span>Diretrizes de Segurança da Senha:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px]">
                  {DIRETRIZES_SEGURANCA.map((diretriz) => {
                    const ok = diretriz.test(novaSenha);
                    return (
                      <div
                        key={diretriz.id}
                        className={`flex items-center gap-1.5 transition-colors ${
                          ok ? "text-emerald-400" : "text-stone-400"
                        }`}
                      >
                        {ok ? (
                          <Check className="w-3.5 h-3.5 shrink-0 text-emerald-400 font-bold" />
                        ) : (
                          <Circle className="w-2.5 h-2.5 shrink-0 text-stone-600 ml-0.5" />
                        )}
                        <span>{diretriz.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Confirmar Nova Senha */}
            <div className="space-y-1.5">
              <label htmlFor={confirmarNovaSenhaId} className="block text-xs font-medium text-stone-300">
                Confirmar Nova Senha *
              </label>
              <div className="relative">
                <input
                  id={confirmarNovaSenhaId}
                  name="confirm-new-password"
                  autoComplete="new-password"
                  type={showConfirmarSenha ? "text" : "password"}
                  value={confirmarNovaSenha}
                  onChange={(e) => setConfirmarNovaSenha(e.target.value)}
                  placeholder="Repita exatamente a nova senha"
                  disabled={loading}
                  className="w-full bg-stone-950/70 border border-stone-800 focus:border-brand-purple rounded-xl px-3.5 py-2.5 text-sm text-stone-100 placeholder-stone-500 outline-none pr-10 transition focus:ring-1 focus:ring-brand-purple"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmarSenha(!showConfirmarSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200"
                  tabIndex={-1}
                  aria-label={showConfirmarSenha ? "Ocultar confirmação" : "Mostrar confirmação"}
                >
                  {showConfirmarSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {confirmarNovaSenha && (
                <div
                  className={`flex items-center gap-1.5 text-[11px] mt-1 ${
                    senhasCoincidem ? "text-emerald-400" : "text-amber-400"
                  }`}
                >
                  {senhasCoincidem ? (
                    <>
                      <Check className="w-3.5 h-3.5 font-bold" />
                      <span>As senhas coincidem perfeitamente.</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>As senhas digitadas ainda não coincidem.</span>
                    </>
                  )}
                </div>
              )}
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
                disabled={loading || !senhaAtual || novaSenha.length < 8 || !senhasCoincidem}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-brand-purple hover:bg-brand-purple-light text-white shadow-md shadow-brand-purple/20 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Salvando Nova Senha...</span>
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
