"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";

const UFS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

function maskCpf(val: string) {
  const v = val.replace(/\D/g, "").slice(0, 11);
  if (v.length <= 3) return v;
  if (v.length <= 6) return `${v.slice(0, 3)}.${v.slice(3)}`;
  if (v.length <= 9) return `${v.slice(0, 3)}.${v.slice(3, 6)}.${v.slice(6)}`;
  return `${v.slice(0, 3)}.${v.slice(3, 6)}.${v.slice(6, 9)}-${v.slice(9)}`;
}

function maskPhone(val: string) {
  const v = val.replace(/\D/g, "").slice(0, 11);
  if (v.length <= 2) return v ? `(${v}` : "";
  if (v.length <= 6) return `(${v.slice(0, 2)}) ${v.slice(2)}`;
  if (v.length <= 10) return `(${v.slice(0, 2)}) ${v.slice(2, 6)}-${v.slice(6)}`;
  return `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
}

function maskCep(val: string) {
  const v = val.replace(/\D/g, "").slice(0, 8);
  if (v.length <= 5) return v;
  return `${v.slice(0, 5)}-${v.slice(5)}`;
}

export default function CadastroPage() {
  const router = useRouter();

  // Dados de acesso
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  // Endereço de entrega
  const [cep, setCep] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");

  const [buscandoCep, setBuscandoCep] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = maskCep(e.target.value);
    setCep(formatted);

    const clean = formatted.replace(/\D/g, "");
    if (clean.length === 8) {
      setBuscandoCep(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
        const data = await res.json();
        if (!data.erro) {
          if (data.logradouro) setRua(data.logradouro);
          if (data.bairro) setBairro(data.bairro);
          if (data.localidade) setCidade(data.localidade);
          if (data.uf) setUf(data.uf.toUpperCase());
        }
      } catch {
        // Ignora falha de busca automática
      }
      setBuscandoCep(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    if (senha !== confirmarSenha) {
      setErro("As senhas digitadas não coincidem.");
      return;
    }

    if (senha.length < 8) {
      setErro("A senha deve ter no mínimo 8 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          email,
          telefone,
          cpf,
          senha,
          confirmarSenha,
          cep,
          rua,
          numero,
          complemento,
          bairro,
          cidade,
          uf,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.error || "Erro ao realizar cadastro.");
        setLoading(false);
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const redirect = params.get("redirect") || "/conta/pedidos";
      router.push(redirect);
      router.refresh();
    } catch {
      setErro("Erro de conexão com o servidor. Tente novamente.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1217] text-white py-12 px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl mb-6">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-xs font-medium text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Já tem conta? Fazer login
        </Link>
      </div>

      <div className="w-full max-w-2xl bg-[#161B22] border border-white/10 rounded-2xl p-6 md:p-10 shadow-2xl">
        {erro && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* SEÇÃO 1: DADOS DE ACESSO */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#A78BFA] mb-4">
              Dados de acesso
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-white/70 block mb-1.5">
                  Nome completo *
                </label>
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome completo"
                  className="w-full bg-[#0D1117] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-white/70 block mb-1.5">
                    E-mail (login) *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full bg-[#0D1117] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-white/70 block mb-1.5">
                    Telefone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={telefone}
                    onChange={(e) => setTelefone(maskPhone(e.target.value))}
                    placeholder="(11) 99999-9999"
                    className="w-full bg-[#0D1117] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-white/70 block mb-1.5">
                  CPF *
                </label>
                <input
                  type="text"
                  required
                  value={cpf}
                  onChange={(e) => setCpf(maskCpf(e.target.value))}
                  placeholder="000.000.000-00"
                  className="w-full bg-[#0D1117] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-white/70 block mb-1.5">
                    Senha *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Mínimo de 8 caracteres"
                    className="w-full bg-[#0D1117] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]"
                  />
                  <span className="text-[10px] text-white/40 mt-1 block">
                    Mínimo de 8 caracteres
                  </span>
                </div>
                <div>
                  <label className="text-xs font-medium text-white/70 block mb-1.5">
                    Confirmar senha *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    placeholder="Repita a senha"
                    className="w-full bg-[#0D1117] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SEÇÃO 2: ENDEREÇO DE ENTREGA */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#A78BFA] mb-4">
              Endereço de entrega
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-white/70 block mb-1.5">
                    CEP *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={cep}
                      onChange={handleCepChange}
                      placeholder="00000-000"
                      className="w-full bg-[#0D1117] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#7C3AED]"
                    />
                    {buscandoCep && (
                      <Loader2 className="w-4 h-4 animate-spin text-[#A78BFA] absolute right-3 top-3.5" />
                    )}
                  </div>
                </div>

                <div className="md:col-span-3">
                  <label className="text-xs font-medium text-white/70 block mb-1.5">
                    Rua / Avenida *
                  </label>
                  <input
                    type="text"
                    required
                    value={rua}
                    onChange={(e) => setRua(e.target.value)}
                    placeholder="Nome da rua"
                    className="w-full bg-[#0D1117] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="text-xs font-medium text-white/70 block mb-1.5">
                    Número *
                  </label>
                  <input
                    type="text"
                    required
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    placeholder="123"
                    className="w-full bg-[#0D1117] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-white/70 block mb-1.5">
                    Complemento
                  </label>
                  <input
                    type="text"
                    value={complemento}
                    onChange={(e) => setComplemento(e.target.value)}
                    placeholder="Apto, bloco..."
                    className="w-full bg-[#0D1117] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-white/70 block mb-1.5">
                    Bairro *
                  </label>
                  <input
                    type="text"
                    required
                    value={bairro}
                    onChange={(e) => setBairro(e.target.value)}
                    placeholder="Bairro"
                    className="w-full bg-[#0D1117] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="text-xs font-medium text-white/70 block mb-1.5">
                    Cidade *
                  </label>
                  <input
                    type="text"
                    required
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    placeholder="Cidade"
                    className="w-full bg-[#0D1117] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="text-xs font-medium text-white/70 block mb-1.5">
                    UF *
                  </label>
                  <select
                    required
                    value={uf}
                    onChange={(e) => setUf(e.target.value)}
                    className="w-full bg-[#0D1117] border border-white/10 rounded-xl px-3 py-3 text-sm text-white focus:outline-none focus:border-[#7C3AED]"
                  >
                    <option value="">—</option>
                    {UFS.map((u) => (
                      <option key={u} value={u} className="bg-[#161B22] text-white">
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-purple-900/30 cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Criando conta...
              </>
            ) : (
              "Cadastrar e Continuar"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-white/50">
          Já tem uma conta?{" "}
          <Link
            href="/login"
            className="text-[#A78BFA] hover:text-[#C4B5FD] font-medium transition-colors ml-1"
          >
            Faça login
          </Link>
        </div>
      </div>
    </div>
  );
}
