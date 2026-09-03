"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  // Modal / estado de recuperação de senha
  const [showEsqueci, setShowEsqueci] = useState(false);
  const [emailRecuperacao, setEmailRecuperacao] = useState("");
  const [recuperando, setRecuperando] = useState(false);
  const [recuperacaoMsg, setRecuperacaoMsg] = useState("");
  const [recuperacaoErro, setRecuperacaoErro] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.error || "Erro ao entrar. Verifique seus dados.");
        setLoading(false);
        return;
      }

      // Redirecionamento inteligente: se veio de checkout ou direto para /conta/pedidos
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get("redirect") || "/conta/pedidos";
      router.push(redirect);
      router.refresh();
    } catch {
      setErro("Falha na conexão. Tente novamente.");
      setLoading(false);
    }
  };

  const handleRecuperarSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecuperacaoErro("");
    setRecuperacaoMsg("");
    setRecuperando(true);

    try {
      const res = await fetch("/api/auth/esqueci-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailRecuperacao }),
      });

      const data = await res.json();

      if (res.ok) {
        setRecuperacaoMsg(data.message || "E-mail de recuperação enviado com sucesso!");
      } else {
        setRecuperacaoErro(data.error || "Erro ao solicitar recuperação.");
      }
    } catch {
      setRecuperacaoErro("Erro de conexão. Tente novamente.");
    }
    setRecuperando(false);
  };

  return (
    <div className="min-h-screen bg-[#0F1217] text-white flex flex-col justify-center items-center px-4 py-12">
      {/* Botão voltar */}
      <div className="w-full max-w-md mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para a loja
        </Link>
      </div>

      <div className="w-full max-w-md bg-[#161B22] border border-white/10 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-6">
          <h1 className="text-lg font-semibold text-white/90">
            Entre na sua conta para continuar
          </h1>
        </div>

        {erro && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            {erro}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-white/70 block mb-1.5">
              E-mail
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full bg-[#0D1117] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-white/70">Senha</label>
              <button
                type="button"
                onClick={() => {
                  setEmailRecuperacao(email);
                  setShowEsqueci(true);
                }}
                className="text-[11px] text-[#A78BFA] hover:text-[#C4B5FD] transition-colors"
              >
                Esqueci minha senha
              </button>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0D1117] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 text-white font-medium text-sm rounded-xl transition-all shadow-lg shadow-purple-900/30 cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-white/50">
          Ainda não tem conta?{" "}
          <Link
            href="/cadastro"
            className="text-[#A78BFA] hover:text-[#C4B5FD] font-medium transition-colors ml-1"
          >
            Cadastre-se
          </Link>
        </div>
      </div>

      {/* Modal / Dialog de Esqueci minha Senha */}
      {showEsqueci && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#161B22] border border-white/10 rounded-2xl p-6 shadow-2xl relative">
            <h3 className="text-base font-semibold text-white mb-2">Recuperar senha</h3>
            <p className="text-xs text-white/50 mb-4">
              Informe seu e-mail cadastrado. Enviaremos um link seguro para você redefinir sua senha.
            </p>

            {recuperacaoMsg ? (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs flex items-start gap-2 mb-4">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{recuperacaoMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleRecuperarSenha} className="space-y-4">
                {recuperacaoErro && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
                    {recuperacaoErro}
                  </div>
                )}
                <div>
                  <label className="text-xs font-medium text-white/70 block mb-1">
                    Seu e-mail cadastrado
                  </label>
                  <input
                    type="email"
                    required
                    value={emailRecuperacao}
                    onChange={(e) => setEmailRecuperacao(e.target.value)}
                    placeholder="voce@email.com"
                    className="w-full bg-[#0D1117] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowEsqueci(false)}
                    className="flex-1 py-2.5 border border-white/10 hover:bg-white/5 text-white/70 text-xs rounded-xl transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={recuperando}
                    className="flex-1 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 text-white text-xs font-medium rounded-xl transition-all"
                  >
                    {recuperando ? "Enviando..." : "Enviar link"}
                  </button>
                </div>
              </form>
            )}

            {recuperacaoMsg && (
              <button
                type="button"
                onClick={() => setShowEsqueci(false)}
                className="w-full py-2.5 bg-white/10 hover:bg-white/15 text-white text-xs rounded-xl transition-colors"
              >
                Fechar
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
