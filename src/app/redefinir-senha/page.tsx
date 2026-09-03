"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Footer from "../components/Footer";

function RedefinirSenhaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState("");

  if (!token) {
    return (
      <div className="w-full max-w-md glass-card border border-white/10 rounded-2xl p-8 text-center shadow-2xl">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h2 className="text-lg font-bold text-white mb-2">Token inválido ou ausente</h2>
        <p className="text-xs text-white/60 mb-6 leading-relaxed">
          O link de redefinição que você acessou expirou ou é inválido. Por favor, solicite um novo link na página de login.
        </p>
        <Link
          href="/login"
          className="inline-block px-6 py-3 bg-brand-terracotta hover:bg-brand-terracotta-dark text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-brand-terracotta/25"
        >
          Voltar para login
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    if (senha.length < 8) {
      setErro("A nova senha deve ter no mínimo 8 caracteres.");
      return;
    }

    if (senha !== confirmarSenha) {
      setErro("As senhas digitadas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/redefinir-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, senha, confirmarSenha }),
      });

      const data = await res.json();

      if (res.ok) {
        setSucesso(true);
      } else {
        setErro(data.error || "Erro ao redefinir a senha.");
      }
    } catch {
      setErro("Erro de conexão com o servidor.");
    }
    setLoading(false);
  };

  if (sucesso) {
    return (
      <div className="w-full max-w-md glass-card border border-white/10 rounded-2xl p-8 text-center shadow-2xl">
        <CheckCircle2 className="w-12 h-12 text-brand-mint mx-auto mb-4" />
        <h2 className="text-lg font-bold text-white mb-2">Senha alterada com sucesso!</h2>
        <p className="text-xs text-white/60 mb-6 leading-relaxed">
          Sua senha foi redefinida com segurança. Você já pode acessar sua conta normalmente.
        </p>
        <Link
          href="/login"
          className="w-full py-3.5 bg-brand-terracotta hover:bg-brand-terracotta-dark text-white text-xs font-semibold rounded-xl transition-all inline-block shadow-lg shadow-brand-terracotta/25"
        >
          Ir para Login
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md glass-card border border-white/10 rounded-2xl p-8 shadow-2xl">
      <div className="text-center mb-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-terracotta/15 text-brand-terracotta text-xs font-semibold tracking-wide mb-3 border border-brand-terracotta/25">
          ✦ Segurança
        </span>
        <h1 className="text-xl font-bold text-white tracking-tight">Criar nova senha</h1>
        <p className="text-xs text-white/50 mt-1">
          Digite e confirme sua nova senha de acesso.
        </p>
      </div>

      {erro && (
        <div className="mb-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{erro}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-white/70 block mb-1.5">
            Nova senha *
          </label>
          <div className="relative">
            <input
              type="password"
              required
              minLength={8}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Mínimo de 8 caracteres"
              className="w-full bg-white/5 border border-white/15 focus:border-brand-terracotta focus:ring-1 focus:ring-brand-terracotta rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition-all pl-10"
            />
            <Lock className="w-4 h-4 text-white/35 absolute left-3.5 top-3.5" />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-white/70 block mb-1.5">
            Confirmar nova senha *
          </label>
          <div className="relative">
            <input
              type="password"
              required
              minLength={8}
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              placeholder="Repita a nova senha"
              className="w-full bg-white/5 border border-white/15 focus:border-brand-terracotta focus:ring-1 focus:ring-brand-terracotta rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition-all pl-10"
            />
            <Lock className="w-4 h-4 text-white/35 absolute left-3.5 top-3.5" />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-brand-terracotta hover:bg-brand-terracotta-dark disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-brand-terracotta/25 cursor-pointer mt-2 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Salvando...
            </>
          ) : (
            "Redefinir senha"
          )}
        </button>
      </form>
    </div>
  );
}

export default function RedefinirSenhaPage() {
  return (
    <div className="min-h-screen bg-brand-charcoal relative flex flex-col justify-between font-sans">
      {/* Background Cinematográfico Kalapa */}
      <div className="absolute inset-0 cinematic-gradient opacity-95 pointer-events-none" />
      <div className="absolute inset-0 cinematic-overlay opacity-60 pointer-events-none" />

      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-28 md:py-36">
        <Suspense fallback={<div className="text-white/50 text-sm">Carregando...</div>}>
          <RedefinirSenhaContent />
        </Suspense>
      </div>

      <Footer />
    </div>
  );
}
