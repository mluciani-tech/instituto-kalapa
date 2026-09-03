"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowLeft, Loader2, AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react";
import Footer from "../components/Footer";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  // Modal Esqueci minha senha
  const [modalEsqueci, setModalEsqueci] = useState(false);
  const [emailRecuperacao, setEmailRecuperacao] = useState("");
  const [enviandoRecuperacao, setEnviandoRecuperacao] = useState(false);
  const [msgRecuperacao, setMsgRecuperacao] = useState("");
  const [erroRecuperacao, setErroRecuperacao] = useState("");

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
        setErro(data.error || "E-mail ou senha incorretos.");
        setLoading(false);
        return;
      }

      // Redireciona para o checkout se veio de lá, ou para a conta
      const searchParams = new URLSearchParams(window.location.search);
      const redirect = searchParams.get("redirect") || "/conta/pedidos";
      router.push(redirect);
      router.refresh();
    } catch {
      setErro("Erro ao tentar conectar. Tente novamente.");
      setLoading(false);
    }
  };

  const handleRecuperarSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    setErroRecuperacao("");
    setMsgRecuperacao("");
    setEnviandoRecuperacao(true);

    try {
      const res = await fetch("/api/auth/esqueci-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailRecuperacao }),
      });

      const data = await res.json();

      if (res.ok) {
        setMsgRecuperacao(data.message || "E-mail de recuperação enviado com sucesso!");
      } else {
        setErroRecuperacao(data.error || "Erro ao solicitar recuperação.");
      }
    } catch {
      setErroRecuperacao("Erro ao conectar com o servidor.");
    }
    setEnviandoRecuperacao(false);
  };

  return (
    <div className="min-h-screen bg-brand-charcoal relative flex flex-col justify-between font-sans">
      {/* Background Cinematográfico Kalapa */}
      <div className="absolute inset-0 cinematic-gradient opacity-95 pointer-events-none" />
      <div className="absolute inset-0 cinematic-overlay opacity-60 pointer-events-none" />

      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-28 md:py-36">
        <div className="w-full max-w-md">
          {/* Voltar */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-white/50 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para a loja
          </Link>

          {/* Card Principal de Login */}
          <div className="glass-card rounded-2xl p-7 md:p-9 border border-white/10 shadow-2xl">
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-terracotta/15 text-brand-terracotta text-xs font-semibold tracking-wide mb-3 border border-brand-terracotta/25">
                <ShieldCheck className="w-3.5 h-3.5" />
                Área Segura
              </span>
              <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                Entre na sua conta para continuar
              </h1>
              <p className="text-xs text-white/50 mt-1">
                Acesse seus pedidos, inscrições e realize compras com 1 clique
              </p>
            </div>

            {erro && (
              <div className="mb-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{erro}</span>
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
                    className="w-full bg-white/5 border border-white/15 focus:border-brand-terracotta focus:ring-1 focus:ring-brand-terracotta rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition-all pl-10"
                  />
                  <Mail className="w-4 h-4 text-white/35 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-white/70">
                    Senha
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setEmailRecuperacao(email);
                      setModalEsqueci(true);
                    }}
                    className="text-xs text-brand-terracotta hover:underline transition-colors cursor-pointer"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/15 focus:border-brand-terracotta focus:ring-1 focus:ring-brand-terracotta rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition-all pl-10"
                  />
                  <Lock className="w-4 h-4 text-white/35 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-brand-terracotta hover:bg-brand-terracotta-dark text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-brand-terracotta/20 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-white/10 text-center">
              <p className="text-xs text-white/60">
                Ainda não tem conta?{" "}
                <Link
                  href="/cadastro"
                  className="text-brand-terracotta hover:underline font-semibold transition-colors"
                >
                  Cadastre-se
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Esqueci Minha Senha */}
      {modalEsqueci && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="glass-card rounded-2xl p-6 md:p-8 max-w-sm w-full border border-white/15 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Recuperar Senha</h3>
            <p className="text-xs text-white/60 mb-4 leading-relaxed">
              Informe seu e-mail cadastrado. Enviaremos um link seguro para você redefinir sua senha.
            </p>

            {msgRecuperacao ? (
              <div className="space-y-4">
                <div className="p-3.5 bg-brand-mint/20 border border-brand-mint/30 rounded-xl text-brand-mint text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{msgRecuperacao}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setModalEsqueci(false);
                    setMsgRecuperacao("");
                  }}
                  className="w-full py-2.5 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            ) : (
              <form onSubmit={handleRecuperarSenha} className="space-y-3.5">
                {erroRecuperacao && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs">
                    {erroRecuperacao}
                  </div>
                )}
                <div>
                  <label className="text-xs font-medium text-white/70 block mb-1">E-mail</label>
                  <input
                    type="email"
                    required
                    value={emailRecuperacao}
                    onChange={(e) => setEmailRecuperacao(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full bg-white/5 border border-white/15 focus:border-brand-terracotta rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/30 outline-none"
                  />
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setModalEsqueci(false);
                      setErroRecuperacao("");
                    }}
                    className="px-3.5 py-2 text-xs text-white/60 hover:text-white transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={enviandoRecuperacao}
                    className="px-4 py-2 bg-brand-terracotta hover:bg-brand-terracotta-dark text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {enviandoRecuperacao ? "Enviando..." : "Enviar link"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
