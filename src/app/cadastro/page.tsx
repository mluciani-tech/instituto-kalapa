"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, AlertCircle, CheckCircle2, User, MapPin } from "lucide-react";
import Footer from "../components/Footer";

function maskCPF(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function maskPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }
  return digits
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

function maskCEP(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 8)
    .replace(/(\d{5})(\d)/, "$1-$2");
}

const UFS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

export default function CadastroPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    senha: "",
    confirmarSenha: "",
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    uf: "SP",
  });

  const [buscandoCep, setBuscandoCep] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

  const handleCepBlur = async () => {
    const rawCep = form.cep.replace(/\D/g, "");
    if (rawCep.length !== 8) return;

    setBuscandoCep(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${rawCep}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setForm((prev) => ({
          ...prev,
          rua: data.logradouro || prev.rua,
          bairro: data.bairro || prev.bairro,
          cidade: data.localidade || prev.cidade,
          uf: data.uf || prev.uf,
        }));
      }
    } catch {
      // ignore
    }
    setBuscandoCep(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    if (form.senha.length < 8) {
      setErro("A senha deve ter no mínimo 8 caracteres.");
      return;
    }

    if (form.senha !== form.confirmarSenha) {
      setErro("As senhas não conferem.");
      return;
    }

    const cleanCpf = form.cpf.replace(/\D/g, "");
    if (cleanCpf.length !== 11) {
      setErro("CPF incompleto ou inválido.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.error || "Erro ao realizar cadastro.");
        setLoading(false);
        return;
      }

      setSucesso(true);
      setTimeout(() => {
        router.push("/conta/pedidos");
      }, 1500);
    } catch {
      setErro("Falha de conexão com o servidor.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-charcoal relative flex flex-col justify-between font-sans">
      {/* Background Cinematográfico Kalapa */}
      <div className="absolute inset-0 cinematic-gradient opacity-95 pointer-events-none" />
      <div className="absolute inset-0 cinematic-overlay opacity-60 pointer-events-none" />

      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-28 md:py-36">
        <div className="w-full max-w-2xl">
          {/* Voltar */}
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-xs font-medium text-white/50 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para o Login
          </Link>

          {/* Card Principal de Cadastro */}
          <div className="glass-card rounded-2xl p-7 md:p-10 border border-white/10 shadow-2xl">
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-terracotta/15 text-brand-terracotta text-xs font-semibold tracking-wide mb-3 border border-brand-terracotta/25">
                ✦ Novo Cadastro
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                Crie sua conta no INstituto Kalapa
              </h1>
              <p className="text-xs md:text-sm text-white/50 mt-1">
                Seus dados cadastrais serão reutilizados automaticamente em todas as suas compras
              </p>
            </div>

            {erro && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{erro}</span>
              </div>
            )}

            {sucesso && (
              <div className="mb-6 p-4 rounded-xl bg-brand-mint/20 border border-brand-mint/30 text-brand-mint text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Cadastro realizado com sucesso! Conectando...</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* SEÇÃO 1: DADOS DE ACESSO */}
              <div>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
                  <User className="w-4 h-4 text-brand-terracotta" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-brand-terracotta">
                    Dados de Acesso
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-xs font-medium text-white/70 block mb-1">
                      Nome completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.nome}
                      onChange={(e) => setForm({ ...form, nome: e.target.value })}
                      placeholder="Ex: Maria da Silva"
                      className="w-full bg-white/5 border border-white/15 focus:border-brand-terracotta focus:ring-1 focus:ring-brand-terracotta rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-white/70 block mb-1">
                      E-mail (login) *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="seu@email.com"
                      className="w-full bg-white/5 border border-white/15 focus:border-brand-terracotta focus:ring-1 focus:ring-brand-terracotta rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-white/70 block mb-1">
                      Telefone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.telefone}
                      onChange={(e) => setForm({ ...form, telefone: maskPhone(e.target.value) })}
                      placeholder="(11) 99999-9999"
                      className="w-full bg-white/5 border border-white/15 focus:border-brand-terracotta focus:ring-1 focus:ring-brand-terracotta rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none transition-all"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-medium text-white/70 block mb-1">
                      CPF *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.cpf}
                      onChange={(e) => setForm({ ...form, cpf: maskCPF(e.target.value) })}
                      placeholder="000.000.000-00"
                      className="w-full bg-white/5 border border-white/15 focus:border-brand-terracotta focus:ring-1 focus:ring-brand-terracotta rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none transition-all font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-white/70 block mb-1">
                      Senha * (mínimo 8 caracteres)
                    </label>
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={form.senha}
                      onChange={(e) => setForm({ ...form, senha: e.target.value })}
                      placeholder="••••••••"
                      className="w-full bg-white/5 border border-white/15 focus:border-brand-terracotta focus:ring-1 focus:ring-brand-terracotta rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-white/70 block mb-1">
                      Confirmar senha *
                    </label>
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={form.confirmarSenha}
                      onChange={(e) => setForm({ ...form, confirmarSenha: e.target.value })}
                      placeholder="••••••••"
                      className="w-full bg-white/5 border border-white/15 focus:border-brand-terracotta focus:ring-1 focus:ring-brand-terracotta rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* SEÇÃO 2: ENDEREÇO DE ENTREGA */}
              <div>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
                  <MapPin className="w-4 h-4 text-brand-terracotta" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-brand-terracotta">
                    Endereço
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-medium text-white/70 block mb-1">
                      CEP * {buscandoCep && <span className="text-brand-terracotta text-[10px]">(Buscando...)</span>}
                    </label>
                    <input
                      type="text"
                      required
                      value={form.cep}
                      onBlur={handleCepBlur}
                      onChange={(e) => setForm({ ...form, cep: maskCEP(e.target.value) })}
                      placeholder="00000-000"
                      className="w-full bg-white/5 border border-white/15 focus:border-brand-terracotta focus:ring-1 focus:ring-brand-terracotta rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none transition-all font-mono"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-medium text-white/70 block mb-1">
                      Rua / Avenida *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.rua}
                      onChange={(e) => setForm({ ...form, rua: e.target.value })}
                      placeholder="Ex: Av. Paulista"
                      className="w-full bg-white/5 border border-white/15 focus:border-brand-terracotta focus:ring-1 focus:ring-brand-terracotta rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-white/70 block mb-1">
                      Número *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.numero}
                      onChange={(e) => setForm({ ...form, numero: e.target.value })}
                      placeholder="123"
                      className="w-full bg-white/5 border border-white/15 focus:border-brand-terracotta focus:ring-1 focus:ring-brand-terracotta rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none transition-all"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-medium text-white/70 block mb-1">
                      Complemento (opcional)
                    </label>
                    <input
                      type="text"
                      value={form.complemento}
                      onChange={(e) => setForm({ ...form, complemento: e.target.value })}
                      placeholder="Apto 42, Bloco B"
                      className="w-full bg-white/5 border border-white/15 focus:border-brand-terracotta focus:ring-1 focus:ring-brand-terracotta rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-white/70 block mb-1">
                      Bairro *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.bairro}
                      onChange={(e) => setForm({ ...form, bairro: e.target.value })}
                      placeholder="Bela Vista"
                      className="w-full bg-white/5 border border-white/15 focus:border-brand-terracotta focus:ring-1 focus:ring-brand-terracotta rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-white/70 block mb-1">
                      Cidade *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.cidade}
                      onChange={(e) => setForm({ ...form, cidade: e.target.value })}
                      placeholder="São Paulo"
                      className="w-full bg-white/5 border border-white/15 focus:border-brand-terracotta focus:ring-1 focus:ring-brand-terracotta rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-white/70 block mb-1">
                      UF *
                    </label>
                    <select
                      value={form.uf}
                      onChange={(e) => setForm({ ...form, uf: e.target.value })}
                      className="w-full bg-brand-purple-deep border border-white/15 focus:border-brand-terracotta rounded-xl px-3 py-2.5 text-sm text-white outline-none transition-all"
                    >
                      {UFS.map((uf) => (
                        <option key={uf} value={uf} className="bg-brand-purple-deep text-white">
                          {uf}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-4 bg-brand-terracotta hover:bg-brand-terracotta-dark text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-brand-terracotta/25 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  "Cadastrar e Continuar"
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-white/10 text-center">
              <p className="text-xs text-white/60">
                Já possui uma conta?{" "}
                <Link
                  href="/login"
                  className="text-brand-terracotta hover:underline font-semibold transition-colors"
                >
                  Faça login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
