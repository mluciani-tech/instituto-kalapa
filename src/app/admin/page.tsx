"use client";

import { useState, useEffect, useCallback } from "react";

type Participante = {
  id: string;
  turma_id: string;
  nome: string;
  email: string;
  telefone: string;
  motivacao: string | null;
  metodo_pagamento: string | null;
  valor: number;
  status: string;
  created_at: string;
};

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [clearing, setClearing] = useState(false);

  // Configurações de preço
  const [config, setConfig] = useState<Record<string, string>>({});
  const [precoEditando, setPrecoEditando] = useState("");
  const [salvandoPreco, setSalvandoPreco] = useState(false);
  const [precoSucesso, setPrecoSucesso] = useState("");

  // Configurações de vagas
  const [vagasEditando, setVagasEditando] = useState("");
  const [salvandoVagas, setSalvandoVagas] = useState(false);
  const [vagasSucesso, setVagasSucesso] = useState("");

  // Erro de configuração (tabela não existe)
  const [configError, setConfigError] = useState("");

  const formatPrecoDisplay = (value: string) => {
    const num = parseInt(value.replace(/\D/g, ""), 10);
    if (isNaN(num)) return "";
    return num.toLocaleString("pt-BR");
  };

  const handlePrecoChange = (raw: string) => {
    const digits = raw.replace(/\D/g, "");
    setPrecoEditando(digits);
  };

  const checkAuth = useCallback(async () => {
    const res = await fetch("/api/admin/verify");
    if (res.ok) {
      setAuthed(true);
      await Promise.all([fetchParticipantes(), fetchConfig()]);
    } else {
      setAuthed(false);
    }
    setLoading(false);
  }, []);

  const fetchParticipantes = async () => {
    const res = await fetch("/api/admin/participantes");
    if (res.ok) {
      const data = await res.json();
      setParticipantes(data);
    } else {
      setError("Erro ao carregar participantes");
    }
  };

  const fetchConfig = async () => {
    const res = await fetch("/api/config");
    if (res.ok) {
      const data = await res.json();
      setConfig(data);
      setPrecoEditando(data.preco_sessao || "97");
      setVagasEditando(data.vagas_maximas || "15");
    }
  };

  const handleSalvarPreco = async () => {
    setSalvandoPreco(true);
    setPrecoSucesso("");
    setConfigError("");

    const res = await fetch("/api/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chave: "preco_sessao", valor: precoEditando }),
    });

    const data = await res.json();

    if (res.ok) {
      setConfig((prev) => ({ ...prev, preco_sessao: precoEditando }));
      setPrecoSucesso("Preço atualizado com sucesso!");
      setTimeout(() => setPrecoSucesso(""), 3000);
    } else {
      const msg = data.hint ? `${data.error} ${data.hint}` : (data.error || "Erro ao salvar preço");
      setConfigError(msg);
    }
    setSalvandoPreco(false);
  };

  const handleSalvarVagas = async () => {
    setSalvandoVagas(true);
    setVagasSucesso("");
    setConfigError("");

    const res = await fetch("/api/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chave: "vagas_maximas", valor: vagasEditando }),
    });

    const data = await res.json();

    if (res.ok) {
      setConfig((prev) => ({ ...prev, vagas_maximas: vagasEditando }));
      setVagasSucesso("Vagas atualizadas com sucesso!");
      setTimeout(() => setVagasSucesso(""), 3000);
    } else {
      const msg = data.hint ? `${data.error} ${data.hint}` : (data.error || "Erro ao salvar vagas");
      setConfigError(msg);
    }
    setSalvandoVagas(false);
  };

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      setAuthed(true);
      setPassword("");
      await fetchParticipantes();
    } else {
      const data = await res.json();
      setLoginError(data.error || "Senha inválida");
    }
    setLoginLoading(false);
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
    setParticipantes([]);
  };

  const handleClear = async () => {
    setClearing(true);
    const res = await fetch("/api/admin/limpar", { method: "DELETE" });
    if (res.ok) {
      setParticipantes([]);
      setShowConfirm(false);
    } else {
      const data = await res.json();
      setError(data.error || "Erro ao limpar");
    }
    setClearing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-beige-light flex items-center justify-center">
        <p className="text-brand-charcoal/60 text-lg">Carregando...</p>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-brand-beige-light flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-brand-purple">
              Instituto Kalapa
            </h1>
            <p className="text-brand-charcoal/60 mt-1 text-sm">
              Área restrita
            </p>
          </div>

          <form
            onSubmit={handleLogin}
            className="bg-white rounded-xl p-6 shadow-sm border border-brand-beige"
          >
            <label
              htmlFor="admin-password"
              className="block text-sm font-medium text-brand-charcoal mb-1.5"
            >
              Senha de administrador
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-brand-beige rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple"
              placeholder="Digite a senha"
              autoComplete="current-password"
            />

            {loginError && (
              <p className="text-red-600 text-sm mt-2">{loginError}</p>
            )}

            <button
              type="submit"
              disabled={loginLoading || !password}
              className="mt-4 w-full bg-brand-purple text-white py-3 rounded-lg text-sm font-medium hover:bg-brand-purple-dark disabled:opacity-50 transition-colors"
            >
              {loginLoading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-beige-light">
      <header className="bg-white border-b border-brand-beige sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-bold text-brand-purple">
              Instituto Kalapa
            </h1>
            <span className="text-xs text-brand-charcoal/40">Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-brand-charcoal/60">
              {participantes.length} participante{participantes.length !== 1 ? "s" : ""}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-brand-charcoal/50 hover:text-brand-charcoal transition-colors px-3 py-2"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {error && (
          <div role="alert" className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {error}
            <button onClick={() => setError("")} className="float-right font-bold">&times;</button>
          </div>
        )}

        {/* Seção de Configurações */}
        <div className="mb-8 bg-white rounded-xl border border-brand-beige p-6">
          <h2 className="text-base font-semibold text-brand-charcoal mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-purple" />
            Configurações do Site
          </h2>

          {configError && (
            <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
              {configError}
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-6">
            {/* Preço da Sessão */}
            <div className="p-4 rounded-xl bg-brand-beige/30 border border-brand-beige">
              <label
                htmlFor="preco-sessao"
                className="block text-sm font-medium text-brand-charcoal mb-2"
              >
                Preço da Sessão (R$)
              </label>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-charcoal/50 text-sm">
                    R$
                  </span>
                  <input
                    id="preco-sessao"
                    type="text"
                    inputMode="numeric"
                    value={precoEditando ? formatPrecoDisplay(precoEditando) : ""}
                    onChange={(e) => handlePrecoChange(e.target.value)}
                    placeholder="97"
                    className="w-full pl-10 pr-4 py-2.5 border border-brand-beige rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple"
                  />
                </div>
                <button
                  onClick={handleSalvarPreco}
                  disabled={salvandoPreco || precoEditando === config.preco_sessao}
                  className="px-4 py-2.5 bg-brand-purple text-white text-sm font-medium rounded-lg hover:bg-brand-purple-dark disabled:opacity-50 transition-colors whitespace-nowrap"
                >
                  {salvandoPreco ? "Salvando..." : "Salvar"}
                </button>
              </div>
              {precoSucesso && (
                <p className="mt-2 text-xs text-green-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  {precoSucesso}
                </p>
              )}
              <p className="mt-2 text-xs text-brand-charcoal/40">
                Atual: R$ {formatPrecoDisplay(config.preco_sessao || "97")},00 — Atualiza automaticamente na landing page e no checkout
              </p>
            </div>

            {/* Vagas Máximas */}
            <div className="p-4 rounded-xl bg-brand-beige/30 border border-brand-beige">
              <label
                htmlFor="vagas-maximas"
                className="block text-sm font-medium text-brand-charcoal mb-2"
              >
                Vagas Máximas por Turma
              </label>
              <div className="flex items-center gap-3">
                <input
                  id="vagas-maximas"
                  type="number"
                  min="1"
                  step="1"
                  value={vagasEditando}
                  onChange={(e) => setVagasEditando(e.target.value)}
                  className="w-full px-4 py-2.5 border border-brand-beige rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple"
                />
                <button
                  onClick={handleSalvarVagas}
                  disabled={salvandoVagas || vagasEditando === config.vagas_maximas}
                  className="px-4 py-2.5 bg-brand-purple text-white text-sm font-medium rounded-lg hover:bg-brand-purple-dark disabled:opacity-50 transition-colors whitespace-nowrap"
                >
                  {salvandoVagas ? "Salvando..." : "Salvar"}
                </button>
              </div>
              {vagasSucesso && (
                <p className="mt-2 text-xs text-green-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  {vagasSucesso}
                </p>
              )}
              <p className="mt-2 text-xs text-brand-charcoal/40">
                Atual: {config.vagas_maximas || "15"} vagas — Atualiza o contador na landing page
              </p>
            </div>
          </div>
        </div>

        {/* Mobile: cards */}
        <div className="sm:hidden space-y-3">
          {participantes.length === 0 ? (
            <div className="bg-white rounded-xl border border-brand-beige p-8 text-center text-brand-charcoal/40 text-sm">
              Nenhum participante cadastrado ainda.
            </div>
          ) : (
            participantes.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-xl border border-brand-beige p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-brand-charcoal text-sm">
                      {p.nome}
                    </p>
                    <p className="text-xs text-brand-charcoal/40">{p.turma_id}</p>
                  </div>
                  <span className="text-xs bg-brand-beige px-2 py-0.5 rounded-full text-brand-charcoal/70 flex-shrink-0">
                    {p.metodo_pagamento?.toUpperCase() || "—"}
                  </span>
                </div>
                <div className="space-y-1 text-xs text-brand-charcoal/60">
                  <p className="truncate">{p.email}</p>
                  <p className="font-mono">{p.telefone}</p>
                  {p.motivacao && (
                    <p className="text-brand-charcoal/50 line-clamp-2 mt-1">
                      &ldquo;{p.motivacao}&rdquo;
                    </p>
                  )}
                  <p className="text-brand-charcoal/40 pt-1">
                    {formatDate(p.created_at)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop: tabela */}
        <div className="hidden sm:block bg-white rounded-xl border border-brand-beige overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-brand-beige/50 border-b border-brand-beige">
                  <th className="text-left px-4 py-3 font-medium text-brand-charcoal/70 whitespace-nowrap">
                    Nome
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-brand-charcoal/70 whitespace-nowrap">
                    E-mail
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-brand-charcoal/70 whitespace-nowrap">
                    WhatsApp
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-brand-charcoal/70 whitespace-nowrap hidden md:table-cell">
                    Motivação
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-brand-charcoal/70 whitespace-nowrap hidden lg:table-cell">
                    Pagamento
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-brand-charcoal/70 whitespace-nowrap hidden sm:table-cell">
                    Data
                  </th>
                </tr>
              </thead>
              <tbody>
                {participantes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-brand-charcoal/40">
                      Nenhum participante cadastrado ainda.
                    </td>
                  </tr>
                ) : (
                  participantes.map((p) => (
                    <tr
                      key={p.id}
                      className="border-b border-brand-beige/50 hover:bg-brand-beige/30 transition-colors"
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-medium text-brand-charcoal">
                          {p.nome}
                        </span>
                        <span className="text-xs text-brand-charcoal/40 block">
                          {p.turma_id}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-brand-charcoal/70">
                        {p.email}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-brand-charcoal/70 font-mono text-xs">
                        {p.telefone}
                      </td>
                      <td className="px-4 py-3 text-brand-charcoal/60 text-xs max-w-[200px] truncate hidden md:table-cell">
                        {p.motivacao || "—"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap hidden lg:table-cell">
                        <span className="text-xs bg-brand-beige px-2 py-0.5 rounded-full text-brand-charcoal/70">
                          {p.metodo_pagamento?.toUpperCase() || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-brand-charcoal/50 text-xs hidden sm:table-cell">
                        {formatDate(p.created_at)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {participantes.length > 0 && (
          <div className="mt-8 border-t border-brand-beige pt-6">
            <h2 className="text-sm font-medium text-red-700 mb-2">
              Zona de risco
            </h2>
            <p className="text-xs text-brand-charcoal/50 mb-3">
              Esta ação remove todos os participantes do banco de dados.
              Use após cada evento quinzenal.
            </p>
            <button
              onClick={() => setShowConfirm(true)}
              className="bg-red-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Limpar banco de dados
            </button>
          </div>
        )}
      </main>

      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          style={{ overscrollBehavior: "contain" }}
        >
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-base font-semibold text-brand-charcoal mb-2">
              Limpar todos os dados?
            </h3>
            <p className="text-sm text-brand-charcoal/60 mb-5">
              Todos os {participantes.length} participantes serão removidos
              permanentemente. Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-sm text-brand-charcoal/60 hover:text-brand-charcoal transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleClear}
                disabled={clearing}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {clearing ? "Limpando..." : "Sim, limpar tudo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
