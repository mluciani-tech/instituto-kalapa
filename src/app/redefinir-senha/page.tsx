"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

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
      <div className="w-full max-w-md bg-[#161B22] border border-white/10 rounded-2xl p-8 text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-white mb-2">Token inválido ou ausente</h2>
        <p className="text-xs text-white/50 mb-6">
          O link de redefinição que você acessou é inválido. Por favor, solicite um novo link.
        </p>
        <Link
          href="/login"
          className="inline-block px-5 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-medium rounded-xl transition-all"
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
      <div className="w-full max-w-md bg-[#161B22] border border-white/10 rounded-2xl p-8 text-center shadow-2xl">
        <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-white mb-2">Senha alterada com sucesso!</h2>
        <p className="text-xs text-white/50 mb-6">
          Sua senha foi redefinida com segurança. Você já pode fazer login na sua conta.
        </p>
        <Link
          href="/login"
          className="w-full py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold rounded-xl transition-all inline-block"
        >
          Ir para Login
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-[#161B22] border border-white/10 rounded-2xl p-8 shadow-2xl">
      <div className="text-center mb-6">
        <h1 className="text-lg font-semibold text-white">Criar nova senha</h1>
        <p className="text-xs text-white/50 mt-1">
          Digite e confirme sua nova senha de acesso.
        </p>
      </div>

      {erro && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
          {erro}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-white/70 block mb-1.5">
            Nova senha *
          </label>
          <input
            type="password"
            required
            minLength={8}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Mínimo de 8 caracteres"
            className="w-full bg-[#0D1117] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#7C3AED]"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-white/70 block mb-1.5">
            Confirmar nova senha *
          </label>
          <input
            type="password"
            required
            minLength={8}
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            placeholder="Repita a nova senha"
            className="w-full bg-[#0D1117] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#7C3AED]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 text-white font-medium text-sm rounded-xl transition-all shadow-lg shadow-purple-900/30 cursor-pointer"
        >
          {loading ? "Salvando..." : "Redefinir senha"}
        </button>
      </form>
    </div>
  );
}

export default function RedefinirSenhaPage() {
  return (
    <div className="min-h-screen bg-[#0F1217] text-white flex flex-col justify-center items-center px-4 py-12">
      <Suspense fallback={<div className="text-white/50 text-sm">Carregando...</div>}>
        <RedefinirSenhaContent />
      </Suspense>
    </div>
  );
}
