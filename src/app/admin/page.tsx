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

type Produto = {
  id: string;
  slug: string;
  nome: string;
  descricao: string | null;
  descricao_curta: string | null;
  preco: number;
  imagem_url: string | null;
  beneficios: string[];
  destaque: boolean;
  ativo: boolean;
  ordem: number;
  created_at: string;
};

type Pedido = {
  id: string;
  order_nsu: string;
  cliente_nome: string;
  cliente_email: string;
  cliente_telefone: string | null;
  valor: number;
  status: string;
  metodo_pagamento: string | null;
  capture_method: string | null;
  receipt_url: string | null;
  created_at: string;
  produtos: { nome: string; slug: string } | null;
};

type Tab = "config" | "produtos" | "pedidos" | "participantes";

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
  const [activeTab, setActiveTab] = useState<Tab>("config");
  const [error, setError] = useState("");

  // Auth
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Config
  const [config, setConfig] = useState<Record<string, string>>({});
  const [vagasEditando, setVagasEditando] = useState("");
  const [salvandoVagas, setSalvandoVagas] = useState(false);
  const [vagasSucesso, setVagasSucesso] = useState("");
  const [configError, setConfigError] = useState("");

  // Produtos
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);
  const [showProdutoForm, setShowProdutoForm] = useState(false);
  const [produtoForm, setProdutoForm] = useState({
    slug: "",
    nome: "",
    descricao: "",
    descricao_curta: "",
    preco: "",
    imagem_url: "",
    beneficios: "",
    destaque: false,
    ativo: true,
    ordem: "0",
  });
  const [produtoImagemFile, setProdutoImagemFile] = useState<File | null>(null);
  const [uploadingImagem, setUploadingImagem] = useState(false);
  const [salvandoProduto, setSalvandoProduto] = useState(false);
  const [produtoSucesso, setProdutoSucesso] = useState("");

  // Pedidos
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  // Participantes
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [clearing, setClearing] = useState(false);

  const checkAuth = useCallback(async () => {
    const res = await fetch("/api/admin/verify");
    if (res.ok) {
      setAuthed(true);
      await Promise.all([fetchConfig(), fetchProdutos(), fetchPedidos(), fetchParticipantes()]);
    } else {
      setAuthed(false);
    }
    setLoading(false);
  }, []);

  const fetchConfig = async () => {
    const res = await fetch("/api/config");
    if (res.ok) {
      const data = await res.json();
      setConfig(data);
      setVagasEditando(data.vagas_maximas || "15");
    }
  };

  const fetchProdutos = async () => {
    const res = await fetch("/api/admin/produtos");
    if (res.ok) setProdutos(await res.json());
  };

  const fetchPedidos = async () => {
    const res = await fetch("/api/admin/pedidos");
    if (res.ok) setPedidos(await res.json());
  };

  const fetchParticipantes = async () => {
    const res = await fetch("/api/admin/participantes");
    if (res.ok) setParticipantes(await res.json());
  };

  useEffect(() => { checkAuth(); }, [checkAuth]);

  // Auth handlers
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
      await Promise.all([fetchConfig(), fetchProdutos(), fetchPedidos(), fetchParticipantes()]);
    } else {
      const data = await res.json();
      setLoginError(data.error || "Senha inválida");
    }
    setLoginLoading(false);
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
  };

  // Config handlers
  const handleSalvarVagas = async () => {
    setSalvandoVagas(true);
    setVagasSucesso("");
    setConfigError("");
    const res = await fetch("/api/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chave: "vagas_maximas", valor: vagasEditando }),
    });
    if (res.ok) {
      setConfig((prev) => ({ ...prev, vagas_maximas: vagasEditando }));
      setVagasSucesso("Vagas atualizadas!");
      setTimeout(() => setVagasSucesso(""), 3000);
    } else {
      const data = await res.json();
      setConfigError(data.error || "Erro ao salvar");
    }
    setSalvandoVagas(false);
  };

  // Produto handlers
  const resetProdutoForm = () => {
    setProdutoForm({
      slug: "", nome: "", descricao: "", descricao_curta: "",
      preco: "", imagem_url: "", beneficios: "", destaque: false,
      ativo: true, ordem: "0",
    });
    setProdutoImagemFile(null);
    setProdutoEditando(null);
  };

  const handleSalvarProduto = async () => {
    setSalvandoProduto(true);
    setProdutoSucesso("");
    
    let imagemUrl = produtoForm.imagem_url;
    
    // Upload image if file selected
    if (produtoImagemFile) {
      setUploadingImagem(true);
      const formData = new FormData();
      formData.append("file", produtoImagemFile);
      
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      
      if (uploadRes.ok) {
        const uploadData = await uploadRes.json();
        imagemUrl = uploadData.url;
      } else {
        setError("Erro ao fazer upload da imagem");
        setSalvandoProduto(false);
        setUploadingImagem(false);
        return;
      }
      setUploadingImagem(false);
    }
    
    const payload = {
      ...produtoForm,
      imagem_url: imagemUrl,
      preco: parseFloat(produtoForm.preco.replace(",", ".")) || 0,
      ordem: parseInt(produtoForm.ordem) || 0,
      beneficios: produtoForm.beneficios.split("\n").filter((b) => b.trim()),
    };

    const url = produtoEditando
      ? `/api/admin/produtos/${produtoEditando.id}`
      : "/api/admin/produtos";
    const method = produtoEditando ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setProdutoSucesso(produtoEditando ? "Produto atualizado!" : "Produto criado!");
      setShowProdutoForm(false);
      resetProdutoForm();
      await fetchProdutos();
      setTimeout(() => setProdutoSucesso(""), 3000);
    } else {
      const data = await res.json();
      setError(data.error || "Erro ao salvar produto");
    }
    setSalvandoProduto(false);
  };

  const handleEditarProduto = (p: Produto) => {
    setProdutoEditando(p);
    setProdutoForm({
      slug: p.slug,
      nome: p.nome,
      descricao: p.descricao || "",
      descricao_curta: p.descricao_curta || "",
      preco: p.preco.toString().replace(".", ","),
      imagem_url: p.imagem_url || "",
      beneficios: p.beneficios.join("\n"),
      destaque: p.destaque,
      ativo: p.ativo,
      ordem: p.ordem.toString(),
    });
    setProdutoImagemFile(null);
    setShowProdutoForm(true);
  };

  const handleDesativarProduto = async (id: string) => {
    await fetch(`/api/admin/produtos/${id}`, { method: "DELETE" });
    await fetchProdutos();
  };

  // Clear
  const handleClear = async () => {
    setClearing(true);
    const res = await fetch("/api/admin/limpar", { method: "DELETE" });
    if (res.ok) {
      setParticipantes([]);
      setShowConfirm(false);
    }
    setClearing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-beige-light flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-brand-beige-light flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-brand-purple">INstituto Kalapa</h1>
            <p className="text-brand-charcoal/60 mt-1 text-sm">Área restrita</p>
          </div>
          <form onSubmit={handleLogin} className="bg-white rounded-xl p-6 shadow-sm border border-brand-beige">
            <label htmlFor="admin-password" className="block text-sm font-medium text-brand-charcoal mb-1.5">
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
            {loginError && <p className="text-red-600 text-sm mt-2">{loginError}</p>}
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

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "config", label: "Configurações" },
    { id: "produtos", label: "Produtos", count: produtos.length },
    { id: "pedidos", label: "Pedidos", count: pedidos.length },
    { id: "participantes", label: "Inscrições", count: participantes.length },
  ];

  return (
    <div className="min-h-screen bg-brand-beige-light">
      {/* Header */}
      <header className="bg-white border-b border-brand-beige sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-bold text-brand-purple">INstituto Kalapa</h1>
            <span className="text-xs text-brand-charcoal/40">Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/produtos" target="_blank" className="text-xs text-brand-purple hover:underline">
              Ver catálogo ↗
            </a>
            <button onClick={handleLogout} className="text-sm text-brand-charcoal/50 hover:text-brand-charcoal transition-colors px-3 py-2">
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-brand-beige">
        <div className="max-w-6xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.id
                  ? "border-brand-purple text-brand-purple"
                  : "border-transparent text-brand-charcoal/50 hover:text-brand-charcoal"
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className="ml-1.5 text-xs bg-brand-beige px-1.5 py-0.5 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {error && (
          <div role="alert" className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {error}
            <button onClick={() => setError("")} className="float-right font-bold">&times;</button>
          </div>
        )}

        {/* Tab: Configurações */}
        {activeTab === "config" && (
          <div className="bg-white rounded-xl border border-brand-beige p-6">
            <h2 className="text-base font-semibold text-brand-charcoal mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-purple" />
              Configurações do Site
            </h2>
            {configError && (
              <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">{configError}</div>
            )}
            <div className="max-w-md">
              <label htmlFor="vagas-maximas" className="block text-sm font-medium text-brand-charcoal mb-2">
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
                Turma atual: {config.turma_atual || "2025-01"}
              </p>
            </div>
            <p className="mt-4 text-xs text-brand-charcoal/40">
              Preço e outros detalhes são gerenciados na seção de Produtos.
            </p>
          </div>
        )}

        {/* Tab: Produtos */}
        {activeTab === "produtos" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-brand-charcoal">Produtos</h2>
              <button
                onClick={() => { resetProdutoForm(); setShowProdutoForm(true); }}
                className="px-4 py-2 bg-brand-purple text-white text-sm font-medium rounded-lg hover:bg-brand-purple-dark transition-colors"
              >
                + Novo Produto
              </button>
            </div>

            {produtoSucesso && (
              <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">{produtoSucesso}</div>
            )}

            {/* Formulário de produto */}
            {showProdutoForm && (
              <div className="bg-white rounded-xl border border-brand-beige p-6 mb-6">
                <h3 className="text-sm font-semibold text-brand-charcoal mb-4">
                  {produtoEditando ? "Editar Produto" : "Novo Produto"}
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-brand-charcoal/70 mb-1">Nome *</label>
                    <input
                      value={produtoForm.nome}
                      onChange={(e) => setProdutoForm({ ...produtoForm, nome: e.target.value })}
                      className="w-full px-3 py-2 border border-brand-beige rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                      placeholder="Ex: Grupo de Autoconhecimento"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-brand-charcoal/70 mb-1">Slug *</label>
                    <input
                      value={produtoForm.slug}
                      onChange={(e) => setProdutoForm({ ...produtoForm, slug: e.target.value })}
                      className="w-full px-3 py-2 border border-brand-beige rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                      placeholder="grupo-autoconhecimento"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-brand-charcoal/70 mb-1">Preço (R$) *</label>
                    <input
                      value={produtoForm.preco}
                      onChange={(e) => setProdutoForm({ ...produtoForm, preco: e.target.value })}
                      className="w-full px-3 py-2 border border-brand-beige rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                      placeholder="97,00"
                      inputMode="decimal"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-brand-charcoal/70 mb-1">Ordem</label>
                    <input
                      value={produtoForm.ordem}
                      onChange={(e) => setProdutoForm({ ...produtoForm, ordem: e.target.value })}
                      className="w-full px-3 py-2 border border-brand-beige rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                      placeholder="0"
                      inputMode="numeric"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-brand-charcoal/70 mb-1">Descrição Curta</label>
                    <input
                      value={produtoForm.descricao_curta}
                      onChange={(e) => setProdutoForm({ ...produtoForm, descricao_curta: e.target.value })}
                      className="w-full px-3 py-2 border border-brand-beige rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                      placeholder="Encontros quinzenais · 2h · Grupos reduzidos"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-brand-charcoal/70 mb-1">Descrição</label>
                    <textarea
                      value={produtoForm.descricao}
                      onChange={(e) => setProdutoForm({ ...produtoForm, descricao: e.target.value })}
                      className="w-full px-3 py-2 border border-brand-beige rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                      rows={3}
                      placeholder="Descrição completa do produto..."
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-brand-charcoal/70 mb-1">Imagem do Produto</label>
                    <div className="flex items-center gap-4">
                      <label className="flex-1 flex items-center justify-center px-4 py-3 border-2 border-dashed border-brand-beige rounded-lg cursor-pointer hover:border-brand-purple/50 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setProdutoImagemFile(file);
                              // Preview
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                setProdutoForm({ ...produtoForm, imagem_url: ev.target?.result as string });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        <span className="text-sm text-brand-charcoal/50">
                          {produtoImagemFile ? produtoImagemFile.name : "Clique para selecionar imagem"}
                        </span>
                      </label>
                      {produtoForm.imagem_url && (
                        <img
                          src={produtoForm.imagem_url}
                          alt="Preview"
                          className="w-16 h-16 object-cover rounded-lg border border-brand-beige"
                        />
                      )}
                    </div>
                    <p className="text-xs text-brand-charcoal/40 mt-1">JPEG, PNG, WebP ou GIF. Máximo 5MB.</p>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-brand-charcoal/70 mb-1">
                      Benefícios (1 por linha)
                    </label>
                    <textarea
                      value={produtoForm.beneficios}
                      onChange={(e) => setProdutoForm({ ...produtoForm, beneficios: e.target.value })}
                      className="w-full px-3 py-2 border border-brand-beige rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                      rows={4}
                      placeholder="Acesso à sessão ao vivo&#10;Material de apoio&#10;Grupo de WhatsApp"
                    />
                  </div>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 text-sm text-brand-charcoal/70">
                      <input
                        type="checkbox"
                        checked={produtoForm.destaque}
                        onChange={(e) => setProdutoForm({ ...produtoForm, destaque: e.target.checked })}
                        className="rounded border-brand-beige"
                      />
                      Destaque
                    </label>
                    <label className="flex items-center gap-2 text-sm text-brand-charcoal/70">
                      <input
                        type="checkbox"
                        checked={produtoForm.ativo}
                        onChange={(e) => setProdutoForm({ ...produtoForm, ativo: e.target.checked })}
                        className="rounded border-brand-beige"
                      />
                      Ativo
                    </label>
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleSalvarProduto}
                    disabled={salvandoProduto || !produtoForm.nome || !produtoForm.slug || !produtoForm.preco}
                    className="px-4 py-2 bg-brand-purple text-white text-sm font-medium rounded-lg hover:bg-brand-purple-dark disabled:opacity-50 transition-colors"
                  >
                    {uploadingImagem ? "Enviando imagem..." : salvandoProduto ? "Salvando..." : "Salvar"}
                  </button>
                  <button
                    onClick={() => { setShowProdutoForm(false); resetProdutoForm(); }}
                    className="px-4 py-2 text-sm text-brand-charcoal/60 hover:text-brand-charcoal transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* Lista de produtos */}
            {produtos.length === 0 ? (
              <div className="bg-white rounded-xl border border-brand-beige p-8 text-center text-brand-charcoal/40 text-sm">
                Nenhum produto cadastrado.
              </div>
            ) : (
              <div className="space-y-3">
                {produtos.map((p) => (
                  <div key={p.id} className="bg-white rounded-xl border border-brand-beige p-4 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-brand-charcoal text-sm">{p.nome}</span>
                        {!p.ativo && <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">Inativo</span>}
                        {p.destaque && <span className="text-xs bg-brand-terracotta/10 text-brand-terracotta px-1.5 py-0.5 rounded">Destaque</span>}
                      </div>
                      <p className="text-xs text-brand-charcoal/40 mt-0.5">
                        {p.slug} · R$ {p.preco.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} · Ordem: {p.ordem}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleEditarProduto(p)}
                        className="px-3 py-1.5 text-xs text-brand-purple hover:bg-brand-purple/10 rounded-lg transition-colors"
                      >
                        Editar
                      </button>
                      {p.ativo && (
                        <button
                          onClick={() => handleDesativarProduto(p.id)}
                          className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          Desativar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Pedidos */}
        {activeTab === "pedidos" && (
          <div>
            <h2 className="text-base font-semibold text-brand-charcoal mb-4">Pedidos</h2>
            {pedidos.length === 0 ? (
              <div className="bg-white rounded-xl border border-brand-beige p-8 text-center text-brand-charcoal/40 text-sm">
                Nenhum pedido realizado.
              </div>
            ) : (
              <>
                {/* Cards mobile */}
                <div className="sm:hidden space-y-3">
                  {pedidos.map((ped) => (
                    <div key={ped.id} className="bg-white rounded-xl border border-brand-beige p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-brand-charcoal text-sm">{ped.cliente_nome}</p>
                          <p className="text-xs text-brand-charcoal/40">{ped.produtos?.nome || "—"}</p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          ped.status === "pago" ? "bg-green-100 text-green-700" :
                          ped.status === "pendente" ? "bg-yellow-100 text-yellow-700" :
                          "bg-gray-100 text-gray-600"
                        }`}>
                          {ped.status}
                        </span>
                      </div>
                      <div className="space-y-1 text-xs text-brand-charcoal/60">
                        <p>{ped.cliente_email}</p>
                        <p className="font-semibold text-brand-charcoal">
                          R$ {ped.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </p>
                        <p className="font-mono text-brand-charcoal/40">{ped.order_nsu}</p>
                        <p className="text-brand-charcoal/40">{formatDate(ped.created_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Tabela desktop */}
                <div className="hidden sm:block bg-white rounded-xl border border-brand-beige overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-brand-beige/50 border-b border-brand-beige">
                          <th className="text-left px-4 py-3 font-medium text-brand-charcoal/70">Cliente</th>
                          <th className="text-left px-4 py-3 font-medium text-brand-charcoal/70">Produto</th>
                          <th className="text-left px-4 py-3 font-medium text-brand-charcoal/70">Valor</th>
                          <th className="text-left px-4 py-3 font-medium text-brand-charcoal/70">Status</th>
                          <th className="text-left px-4 py-3 font-medium text-brand-charcoal/70">Data</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pedidos.map((ped) => (
                          <tr key={ped.id} className="border-b border-brand-beige/50 hover:bg-brand-beige/30 transition-colors">
                            <td className="px-4 py-3">
                              <span className="font-medium text-brand-charcoal">{ped.cliente_nome}</span>
                              <span className="text-xs text-brand-charcoal/40 block">{ped.cliente_email}</span>
                            </td>
                            <td className="px-4 py-3 text-brand-charcoal/70">{ped.produtos?.nome || "—"}</td>
                            <td className="px-4 py-3 font-semibold text-brand-charcoal">
                              R$ {ped.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                ped.status === "pago" ? "bg-green-100 text-green-700" :
                                ped.status === "pendente" ? "bg-yellow-100 text-yellow-700" :
                                "bg-gray-100 text-gray-600"
                              }`}>
                                {ped.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-brand-charcoal/50 text-xs">{formatDate(ped.created_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Tab: Participantes */}
        {activeTab === "participantes" && (
          <>
            <div className="sm:hidden space-y-3">
              {participantes.length === 0 ? (
                <div className="bg-white rounded-xl border border-brand-beige p-8 text-center text-brand-charcoal/40 text-sm">
                  Nenhum participante cadastrado.
                </div>
              ) : (
                participantes.map((p) => (
                  <div key={p.id} className="bg-white rounded-xl border border-brand-beige p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-brand-charcoal text-sm">{p.nome}</p>
                        <p className="text-xs text-brand-charcoal/40">{p.turma_id}</p>
                      </div>
                      <span className="text-xs bg-brand-beige px-2 py-0.5 rounded-full text-brand-charcoal/70">
                        {p.metodo_pagamento?.toUpperCase() || "—"}
                      </span>
                    </div>
                    <div className="space-y-1 text-xs text-brand-charcoal/60">
                      <p className="truncate">{p.email}</p>
                      <p className="font-mono">{p.telefone}</p>
                      {p.motivacao && <p className="text-brand-charcoal/50 line-clamp-2 mt-1">&ldquo;{p.motivacao}&rdquo;</p>}
                      <p className="text-brand-charcoal/40 pt-1">{formatDate(p.created_at)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="hidden sm:block bg-white rounded-xl border border-brand-beige overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-brand-beige/50 border-b border-brand-beige">
                      <th className="text-left px-4 py-3 font-medium text-brand-charcoal/70">Nome</th>
                      <th className="text-left px-4 py-3 font-medium text-brand-charcoal/70">E-mail</th>
                      <th className="text-left px-4 py-3 font-medium text-brand-charcoal/70">WhatsApp</th>
                      <th className="text-left px-4 py-3 font-medium text-brand-charcoal/70 hidden md:table-cell">Motivação</th>
                      <th className="text-left px-4 py-3 font-medium text-brand-charcoal/70 hidden lg:table-cell">Pagamento</th>
                      <th className="text-left px-4 py-3 font-medium text-brand-charcoal/70 hidden sm:table-cell">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participantes.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-brand-charcoal/40">
                          Nenhum participante cadastrado.
                        </td>
                      </tr>
                    ) : (
                      participantes.map((p) => (
                        <tr key={p.id} className="border-b border-brand-beige/50 hover:bg-brand-beige/30 transition-colors">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="font-medium text-brand-charcoal">{p.nome}</span>
                            <span className="text-xs text-brand-charcoal/40 block">{p.turma_id}</span>
                          </td>
                          <td className="px-4 py-3 text-brand-charcoal/70">{p.email}</td>
                          <td className="px-4 py-3 text-brand-charcoal/70 font-mono text-xs">{p.telefone}</td>
                          <td className="px-4 py-3 text-brand-charcoal/60 text-xs max-w-[200px] truncate hidden md:table-cell">
                            {p.motivacao || "—"}
                          </td>
                          <td className="px-4 py-3 hidden lg:table-cell">
                            <span className="text-xs bg-brand-beige px-2 py-0.5 rounded-full text-brand-charcoal/70">
                              {p.metodo_pagamento?.toUpperCase() || "—"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-brand-charcoal/50 text-xs hidden sm:table-cell">{formatDate(p.created_at)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            {participantes.length > 0 && (
              <div className="mt-8 border-t border-brand-beige pt-6">
                <h2 className="text-sm font-medium text-red-700 mb-2">Zona de risco</h2>
                <p className="text-xs text-brand-charcoal/50 mb-3">
                  Remove todos os participantes. Use após cada evento.
                </p>
                <button
                  onClick={() => setShowConfirm(true)}
                  className="bg-red-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Limpar banco de dados
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Modal de confirmação */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" style={{ overscrollBehavior: "contain" }}>
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-base font-semibold text-brand-charcoal mb-2">Limpar todos os dados?</h3>
            <p className="text-sm text-brand-charcoal/60 mb-5">
              Todos os {participantes.length} participantes serão removidos permanentemente.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowConfirm(false)} className="px-4 py-2 text-sm text-brand-charcoal/60 hover:text-brand-charcoal transition-colors">
                Cancelar
              </button>
              <button onClick={handleClear} disabled={clearing} className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors">
                {clearing ? "Limpando..." : "Sim, limpar tudo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
