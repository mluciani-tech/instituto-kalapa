"use client";

import { useState, useMemo } from "react";
import type { Produto } from "@/lib/types";
import { isProdutoAgendamento } from "@/lib/agendamento";
import { slugify, DURACAO_CHIPS, formatDuracao } from "../lib/format";

type Props = {
  produtos: Produto[];
  onReload: () => Promise<void>;
  onError: (message: string) => void;
};

export default function AdminProdutos({ produtos, onReload, onError }: Props) {
  const fetchProdutos = onReload;
  const setError = onError;

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
    vagas_maximas: "",
    vagas_ocupadas_manual: "",
    categoria: "",
    forma_pagamento_disponivel: "ambos",
    atendimento_individual: false,
    duracao_minutos: "90",
    is_teste: false,
    rota_teste: "",
    orientacoes_pre_teste: "",
    inclui_laudo_pdf: true,
    permite_checkout: true,
    destaque: false,
    ativo: true,
    ordem: "0",
  });
  const [produtoImagemFile, setProdutoImagemFile] = useState<File | null>(null);
  const [uploadingImagem, setUploadingImagem] = useState(false);
  const [salvandoProduto, setSalvandoProduto] = useState(false);
  const [produtoSucesso, setProdutoSucesso] = useState("");
  const [ajustandoContador, setAjustandoContador] = useState<{ produto: Produto; valor: string } | null>(null);
  const [salvandoContador, setSalvandoContador] = useState(false);
  const [produtosStatusFiltro, setProdutosStatusFiltro] = useState<"todos" | "ativos" | "inativos" | "testes" | "atendimentos">("todos");
  const [produtosSlugFiltro, setProdutosSlugFiltro] = useState<string>("");
  const [produtosSearch, setProdutosSearch] = useState("");
  const [formProdutoDestacado, setFormProdutoDestacado] = useState(false);
  const [produtoParaApagar, setProdutoParaApagar] = useState<Produto | null>(null);
  const [apagandoProduto, setApagandoProduto] = useState(false);

  const slugsDisponiveis = useMemo(() => {
    const counts: Record<string, number> = {};
    produtos.forEach((p) => {
      const s = p.slug?.trim() || "sem-slug";
      counts[s] = (counts[s] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [produtos]);

  const produtosFiltrados = produtos.filter((p) => {
    if (produtosStatusFiltro === "ativos" && !p.ativo) return false;
    if (produtosStatusFiltro === "inativos" && p.ativo) return false;
    if (produtosStatusFiltro === "testes" && !p.is_teste && p.categoria !== "testes") return false;
    if (produtosStatusFiltro === "atendimentos" && !p.atendimento_individual && !isProdutoAgendamento(p)) return false;
    if (produtosSlugFiltro && (p.slug?.trim() || "sem-slug") !== produtosSlugFiltro) return false;
    if (produtosSearch.trim()) {
      const q = produtosSearch.trim().toLowerCase();
      const matchNome = (p.nome || "").toLowerCase().includes(q);
      const matchSlug = (p.slug || "").toLowerCase().includes(q);
      const matchCat = (p.categoria || "").toLowerCase().includes(q);
      if (!matchNome && !matchSlug && !matchCat) return false;
    }
    return true;
  });

  // Produto handlers
  const resetProdutoForm = () => {
    setProdutoForm({
      slug: "", nome: "", descricao: "", descricao_curta: "",
      preco: "", imagem_url: "", beneficios: "", vagas_maximas: "",
      vagas_ocupadas_manual: "",
      categoria: "", forma_pagamento_disponivel: "ambos",
      atendimento_individual: false,
      duracao_minutos: "90",
      is_teste: false,
      rota_teste: "",
      orientacoes_pre_teste: "",
      inclui_laudo_pdf: true,
      permite_checkout: true,
      destaque: false, ativo: true, ordem: "0",
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
    
    const parseVagas = (val: string) => {
      if (!val) return null;
      const match = val.trim().match(/^(\d+)/);
      return match ? parseInt(match[1], 10) : null;
    };

    const vagasOcupadasNum = parseVagas(produtoForm.vagas_ocupadas_manual);


    const cleanSlug = produtoForm.slug
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    if (!cleanSlug) {
      setError("O slug do produto é obrigatório.");
      setSalvandoProduto(false);
      return;
    }

    const payload = {
      ...produtoForm,
      slug: cleanSlug,
      imagem_url: imagemUrl,
      vagas_maximas: produtoForm.is_teste ? null : parseVagas(produtoForm.vagas_maximas),
      vagas_ocupadas_manual: produtoForm.is_teste ? null : vagasOcupadasNum,
      categoria: produtoForm.categoria.trim() || (produtoForm.is_teste ? "testes" : null),
      preco: parseFloat(produtoForm.preco.replace(",", ".")) || 0,
      ordem: parseInt(produtoForm.ordem) || 0,
      duracao_minutos: parseInt(produtoForm.duracao_minutos, 10) || 90,
      beneficios: produtoForm.beneficios.split("\n").filter((b) => b.trim()),
      is_teste: produtoForm.is_teste,
      rota_teste: produtoForm.is_teste ? (produtoForm.rota_teste.trim() || `/teste-${cleanSlug.replace(/^teste-/, "")}`) : null,
      orientacoes_pre_teste: produtoForm.is_teste ? (produtoForm.orientacoes_pre_teste.trim() || null) : null,
      inclui_laudo_pdf: produtoForm.is_teste ? produtoForm.inclui_laudo_pdf : false,
      permite_checkout: Boolean(produtoForm.permite_checkout),
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
      preco: (p.preco ?? 0).toString().replace(".", ","),
      imagem_url: p.imagem_url || "",
      beneficios: p.beneficios.join("\n"),
      vagas_maximas: p.vagas_maximas != null ? p.vagas_maximas.toString() : "",
      vagas_ocupadas_manual: p.vagas_ocupadas_manual != null ? p.vagas_ocupadas_manual.toString() : "",
      categoria: p.categoria || "",
      forma_pagamento_disponivel: p.forma_pagamento_disponivel || "ambos",
      atendimento_individual: p.atendimento_individual ?? isProdutoAgendamento(p),
      duracao_minutos: (p.duracao_minutos != null ? p.duracao_minutos : 90).toString(),
      is_teste: Boolean(p.is_teste),
      rota_teste: p.rota_teste || (p.is_teste ? `/teste-${p.slug.replace(/^teste-/, "")}` : ""),
      orientacoes_pre_teste: p.orientacoes_pre_teste || "",
      inclui_laudo_pdf: p.inclui_laudo_pdf !== false,
      permite_checkout: p.permite_checkout !== false && !(p.categoria?.toLowerCase() === "calendario" || p.slug?.startsWith("calendario")),
      destaque: p.destaque ?? false,
      ativo: p.ativo ?? true,
      ordem: (p.ordem ?? 0).toString(),
    });
    setProdutoImagemFile(null);
    setShowProdutoForm(true);
    setFormProdutoDestacado(true);

    setTimeout(() => {
      const container = document.getElementById("form-produto-container");
      if (container) {
        container.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      const inputNome = document.getElementById("input-produto-nome");
      if (inputNome) inputNome.focus();
    }, 60);

    setTimeout(() => {
      setFormProdutoDestacado(false);
    }, 2000);
  };

  const handleDesativarProduto = async (id: string) => {
    await fetch(`/api/admin/produtos/${id}`, { method: "DELETE" });
    await fetchProdutos();
  };

  const handleReativarProduto = async (id: string) => {
    await fetch(`/api/admin/produtos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ativo: true }),
    });
    await fetchProdutos();
  };

  const handleSalvarContadorRapido = async () => {
    if (!ajustandoContador) return;
    const { produto, valor } = ajustandoContador;
    const match = valor.trim().match(/^(\d+)/);
    const vagas_ocupadas_manual = match ? parseInt(match[1], 10) : null;



    setSalvandoContador(true);
    try {
      const res = await fetch(`/api/admin/produtos/${produto.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vagas_ocupadas_manual }),
      });
      if (res.ok) {
        setProdutoSucesso(`Contador de "${produto.nome}" atualizado!`);
        setAjustandoContador(null);
        await fetchProdutos();
        setTimeout(() => setProdutoSucesso(""), 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Erro ao atualizar contador");
      }
    } catch {
      setError("Erro ao conectar com o servidor");
    }
    setSalvandoContador(false);
  };

  const handleClonarProduto = async (p: Produto) => {
    setSalvandoProduto(true);
    setProdutoSucesso("");
    const payload = {
      slug: p.slug || "produto",
      nome: `${p.nome} (Cópia)`,
      descricao: p.descricao || "",
      descricao_curta: p.descricao_curta || "",
      preco: p.preco ?? 0,
      imagem_url: p.imagem_url || "",
      beneficios: p.beneficios,
      vagas_maximas: p.vagas_maximas,
      vagas_ocupadas_manual: p.vagas_ocupadas_manual,
      categoria: p.categoria || null,
      forma_pagamento_disponivel: p.forma_pagamento_disponivel || "ambos",
      atendimento_individual: p.atendimento_individual,
      duracao_minutos: p.duracao_minutos ?? 90,
      is_teste: p.is_teste ?? false,
      rota_teste: p.rota_teste || null,
      orientacoes_pre_teste: p.orientacoes_pre_teste || null,
      inclui_laudo_pdf: p.inclui_laudo_pdf !== false,
      destaque: p.destaque ?? false,
      ativo: false,
      ordem: p.ordem ?? 0,
    };
    const res = await fetch("/api/admin/produtos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setProdutoSucesso("Produto clonado com sucesso!");
      await fetchProdutos();
      setTimeout(() => setProdutoSucesso(""), 3000);
    } else {
      const data = await res.json();
      setError(data.error || "Erro ao clonar produto");
    }
    setSalvandoProduto(false);
  };

  const handleApagarProduto = async () => {
    if (!produtoParaApagar) return;
    setApagandoProduto(true);
    const res = await fetch(`/api/admin/produtos/${produtoParaApagar.id}?permanent=true`, {
      method: "DELETE",
    });
    if (res.ok) {
      setProdutoParaApagar(null);
      await fetchProdutos();
    } else {
      const data = await res.json();
      setError(data.error || "Erro ao apagar produto");
      setProdutoParaApagar(null);
    }
    setApagandoProduto(false);
  };

  return (
    <>
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-semibold text-brand-charcoal">Produtos</h2>
                <span className="text-xs bg-brand-beige px-2 py-0.5 rounded-full text-brand-charcoal/70">
                  {produtosFiltrados.length === produtos.length
                    ? `${produtos.length} ${produtos.length === 1 ? "produto" : "produtos"}`
                    : `Exibindo ${produtosFiltrados.length} de ${produtos.length}`}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">

                {/* Dropdown Filtro por Status */}
                <select
                  value={produtosStatusFiltro}
                  onChange={(e) => setProdutosStatusFiltro(e.target.value as any)}
                  className={`px-3 py-2 border rounded-lg text-xs font-medium cursor-pointer shadow-2xs transition-colors ${
                    produtosStatusFiltro !== "todos"
                      ? "bg-brand-purple text-white border-brand-purple font-semibold"
                      : "bg-white text-brand-charcoal border-brand-beige hover:border-brand-purple/40"
                  }`}
                  aria-label="Filtrar produtos por status"
                >
                  <option value="todos" className="bg-white text-brand-charcoal">Todos os Status</option>
                  <option value="ativos" className="bg-white text-brand-charcoal">Ativos</option>
                  <option value="inativos" className="bg-white text-brand-charcoal">Inativos</option>
                  <option value="testes" className="bg-white text-brand-charcoal">Somente Testes</option>
                  <option value="atendimentos" className="bg-white text-brand-charcoal">Somente Atendimentos</option>
                </select>

                {/* Dropdown Filtro por Slug com Rolagem */}
                <div className="flex items-center gap-1.5">
                  <select
                    value={produtosSlugFiltro}
                    onChange={(e) => setProdutosSlugFiltro(e.target.value)}
                    className={`px-3 py-2 border rounded-lg text-xs font-medium cursor-pointer shadow-2xs max-w-[210px] truncate transition-colors ${
                      produtosSlugFiltro
                        ? "bg-brand-purple text-white border-brand-purple font-semibold"
                        : "bg-white text-brand-charcoal border-brand-beige hover:border-brand-purple/40"
                    }`}
                    aria-label="Filtrar produtos por slug"
                  >
                    <option value="" className="bg-white text-brand-charcoal">
                      Todos os Slugs ({produtos.length})
                    </option>
                    {slugsDisponiveis.map(([slug, count]) => (
                      <option key={slug} value={slug} className="bg-white text-brand-charcoal">
                        {slug} ({count})
                      </option>
                    ))}
                  </select>

                  {produtosSlugFiltro && (
                    <button
                      type="button"
                      onClick={() => setProdutosSlugFiltro("")}
                      title="Limpar filtro de slug"
                      className="px-2.5 py-2 text-xs text-brand-charcoal/70 hover:text-brand-charcoal bg-brand-beige-light hover:bg-brand-beige border border-brand-beige rounded-lg transition-colors cursor-pointer font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Campo de Busca */}
                <div className="w-full sm:w-56">
                  <input
                    type="search"
                    placeholder="Buscar por nome, slug…"
                    value={produtosSearch}
                    onChange={(e) => setProdutosSearch(e.target.value)}
                    className="w-full px-3 py-2 border border-brand-beige rounded-lg text-sm bg-white focus-visible:ring-2 focus-visible:ring-brand-purple/30"
                    aria-label="Buscar produtos"
                  />
                </div>

                <button
                  onClick={() => {
                    resetProdutoForm();
                    setShowProdutoForm(true);
                    setFormProdutoDestacado(true);
                    setTimeout(() => {
                      const container = document.getElementById("form-produto-container");
                      if (container) {
                        container.scrollIntoView({ behavior: "smooth", block: "start" });
                      } else {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                      const inputNome = document.getElementById("input-produto-nome");
                      if (inputNome) inputNome.focus();
                    }, 60);
                    setTimeout(() => setFormProdutoDestacado(false), 2000);
                  }}
                  className="px-4 py-2 bg-brand-purple text-white text-sm font-medium rounded-lg hover:bg-brand-purple-dark transition-colors whitespace-nowrap cursor-pointer"
                >
                  + Novo Produto
                </button>
              </div>
            </div>

            {produtoSucesso && (
              <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">{produtoSucesso}</div>
            )}

            {/* Formulário de produto */}
            {showProdutoForm && (
              <div
                id="form-produto-container"
                className={`bg-white rounded-xl border p-6 mb-6 transition-all duration-500 ${
                  formProdutoDestacado
                    ? "ring-4 ring-brand-purple/40 border-brand-purple shadow-lg"
                    : "border-brand-beige"
                }`}
              >
                <h3 className="text-sm font-semibold text-brand-charcoal mb-4">
                  {produtoEditando ? "Editar Produto" : "Novo Produto"}
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-brand-charcoal/70 mb-1">Nome *</label>
                    <input
                      id="input-produto-nome"
                      value={produtoForm.nome}
                      onChange={(e) => {
                        const novoNome = e.target.value;
                        const novoSlug =
                          !produtoEditando &&
                          (!produtoForm.slug || produtoForm.slug === slugify(produtoForm.nome))
                            ? slugify(novoNome)
                            : produtoForm.slug;
                        setProdutoForm({ ...produtoForm, nome: novoNome, slug: novoSlug });
                      }}
                      className="w-full px-3 py-2 border border-brand-beige rounded-lg text-sm focus-visible:ring-2 focus-visible:ring-brand-purple/30"
                      placeholder="Ex: Grupo de Autoconhecimento"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-brand-charcoal/70 mb-1">Slug *</label>
                    <input
                      value={produtoForm.slug}
                      onChange={(e) => setProdutoForm({ ...produtoForm, slug: e.target.value })}
                      className="w-full px-3 py-2 border border-brand-beige rounded-lg text-sm focus-visible:ring-2 focus-visible:ring-brand-purple/30 font-mono text-xs"
                      placeholder="grupo-autoconhecimento"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-brand-charcoal/70 mb-1">Preço (R$)</label>
<input
                       value={produtoForm.preco}
                       onChange={(e) => setProdutoForm({ ...produtoForm, preco: e.target.value })}
                       className="w-full px-3 py-2 border border-brand-beige rounded-lg text-sm focus-visible:ring-2 focus-visible:ring-brand-purple/30"
                       placeholder="97,00"
                       inputMode="decimal"
                     />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-brand-charcoal/70 mb-1">Ordem</label>
<input
                       value={produtoForm.ordem}
                       onChange={(e) => setProdutoForm({ ...produtoForm, ordem: e.target.value })}
                       className="w-full px-3 py-2 border border-brand-beige rounded-lg text-sm focus-visible:ring-2 focus-visible:ring-brand-purple/30"
                       placeholder="0"
                       inputMode="numeric"
                     />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-brand-charcoal/70 mb-1">Categoria <span className="text-brand-charcoal/30">(opcional)</span></label>
                    <input
                      value={produtoForm.categoria}
                      onChange={(e) => {
                        const cat = e.target.value;
                        const isCal = cat.toLowerCase().trim() === "calendario";
                        setProdutoForm((prev) => ({
                          ...prev,
                          categoria: cat,
                          permite_checkout: isCal ? false : prev.permite_checkout,
                        }));
                      }}
                      className="w-full px-3 py-2 border border-brand-beige rounded-lg text-sm focus-visible:ring-2 focus-visible:ring-brand-purple/30"
                      placeholder="Ex: atendimentos, vivencias, calendario"
                    />
                    <p className="text-xs text-brand-charcoal/30 mt-1">Agrupa produtos na página inicial (ex: calendario, atendimentos, vivencias).</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-brand-charcoal/70 mb-1">Forma de Pagamento</label>
                    <select
                      value={produtoForm.forma_pagamento_disponivel}
                      onChange={(e) => setProdutoForm({ ...produtoForm, forma_pagamento_disponivel: e.target.value })}
                      className="w-full px-3 py-2 border border-brand-beige rounded-lg text-sm focus-visible:ring-2 focus-visible:ring-brand-purple/30"
                    >
                      <option value="ambos">Ambos (PIX + Cartão)</option>
                      <option value="pix">Apenas PIX</option>
                      <option value="cartao">Apenas Cartão</option>
                    </select>
                  </div>
                    {/* Seção Atendimento Individual */}
                    <div className="sm:col-span-2 p-4 rounded-xl border border-brand-terracotta/30 bg-brand-terracotta/5 flex flex-col gap-3 transition-colors">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          id="input-atendimento-individual"
                          checked={produtoForm.atendimento_individual}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setProdutoForm((prev) => ({
                              ...prev,
                              atendimento_individual: checked,
                              is_teste: checked ? false : prev.is_teste,
                            }));
                          }}
                          className="mt-1 w-4 h-4 rounded border-brand-terracotta text-brand-terracotta focus:ring-brand-terracotta/30 cursor-pointer"
                        />
                        <label htmlFor="input-atendimento-individual" className="cursor-pointer select-none">
                          <span className="text-xs sm:text-sm font-bold text-brand-charcoal flex items-center gap-1.5">
                            🗓️ Atendimento Individual (Exige seleção de data/horário na agenda)
                          </span>
                          <p className="text-xs text-brand-charcoal/70 mt-1 leading-relaxed">
                            Marque esta opção para atendimentos terapêuticos individuais. O paciente será direcionado para selecionar data e horário na agenda antes do pagamento. Este produto também aparecerá no filtro de <strong>Atendimentos</strong>.
                          </p>
                        </label>
                      </div>

                      {produtoForm.atendimento_individual && (
                        <div className="mt-1 pt-3 border-t border-brand-terracotta/20 bg-white/80 rounded-xl p-3.5 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <label className="block text-xs font-bold text-brand-charcoal">
                              ⏱️ Tempo de Consulta / Atendimento (já inclui o intervalo)
                            </label>
                            <span className="text-xs font-bold text-brand-purple">
                              {formatDuracao(parseInt(produtoForm.duracao_minutos, 10))}
                            </span>
                          </div>
                          <p className="text-[11px] text-brand-charcoal/60 leading-relaxed">
                            Define a duração de cada bloco de horário deste serviço na agenda. O valor inicial padrão é de <strong>1:30hs (90 min)</strong>.
                          </p>

                          <div className="flex items-center gap-2 flex-wrap pt-1">
                            {DURACAO_CHIPS.map((chip) => {
                              const isSelected = produtoForm.duracao_minutos === chip.value;
                              return (
                                <button
                                  key={chip.value}
                                  type="button"
                                  aria-pressed={isSelected}
                                  onClick={() => setProdutoForm({ ...produtoForm, duracao_minutos: chip.value })}
                                  className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition-colors cursor-pointer ${
                                    isSelected
                                      ? "bg-brand-purple text-white border-brand-purple shadow-xs"
                                      : "bg-white text-brand-charcoal/80 border-brand-beige hover:border-brand-purple/40"
                                  }`}
                                >
                                  {chip.label}
                                </button>
                              );
                            })}
                          </div>

                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            <label htmlFor="duracao-minutos-input" className="text-xs text-brand-charcoal/70 font-medium">Ou digite em minutos:</label>
                            <input
                              id="duracao-minutos-input"
                              type="number"
                              min="15"
                              step="5"
                              value={produtoForm.duracao_minutos}
                              onChange={(e) => setProdutoForm({ ...produtoForm, duracao_minutos: e.target.value })}
                              className="w-24 px-2.5 py-2 sm:py-1 text-xs border border-brand-beige rounded-md bg-white focus-visible:ring-2 focus-visible:ring-brand-purple/30 font-bold text-brand-charcoal min-h-[44px] sm:min-h-0"
                              placeholder="90"
                            />
                            <span className="text-xs text-brand-charcoal/50">minutos por sessão</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Seção Teste de Autoconhecimento */}
                    <div className="sm:col-span-2 p-4 rounded-xl border border-brand-mint/40 bg-brand-mint/5 flex flex-col gap-3 transition-colors">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          id="input-is-teste"
                          checked={produtoForm.is_teste}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            const currentSlug = produtoForm.slug || slugify(produtoForm.nome);
                            const autoRota = currentSlug ? `/teste-${currentSlug.replace(/^teste-/, "")}` : "";
                            setProdutoForm((prev) => ({
                              ...prev,
                              is_teste: checked,
                              atendimento_individual: checked ? false : prev.atendimento_individual,
                              rota_teste: checked ? (prev.rota_teste || autoRota) : prev.rota_teste,
                              categoria: checked && (!prev.categoria || prev.categoria === "atendimentos" || prev.categoria === "vivencias") ? "testes" : prev.categoria,
                            }));
                          }}
                          className="mt-1 w-4 h-4 rounded border-brand-mint text-brand-mint focus:ring-brand-mint/30 cursor-pointer"
                        />
                        <label htmlFor="input-is-teste" className="cursor-pointer select-none">
                          <span className="text-xs sm:text-sm font-bold text-brand-charcoal flex items-center gap-1.5">
                            🧠 Teste de Autoconhecimento (Avaliação Clínica com Laudo)
                          </span>
                          <p className="text-xs text-brand-charcoal/70 mt-1 leading-relaxed">
                            Marque esta opção para testes e avaliações online. O cliente passa pelo fluxo de checkout e pagamento via InfinitePay, recebendo o crédito de acesso liberado automaticamente após a aprovação para preenchimento e emissão do laudo.
                          </p>
                        </label>
                      </div>

                      {produtoForm.is_teste && (
                        <div className="mt-1 pt-3 border-t border-brand-mint/20 bg-white/80 rounded-xl p-3.5 space-y-3">
                          <div>
                            <label className="block text-xs font-bold text-brand-charcoal mb-1">
                              🔗 Rota / Caminho do Teste
                            </label>
                            <input
                              value={produtoForm.rota_teste}
                              onChange={(e) => setProdutoForm({ ...produtoForm, rota_teste: e.target.value })}
                              className="w-full px-3 py-2 border border-brand-beige rounded-lg text-sm font-mono focus-visible:ring-2 focus-visible:ring-brand-purple/30 bg-white"
                              placeholder="/teste-yin-yang ou /teste-eneagrama"
                            />
                            <p className="text-[11px] text-brand-charcoal/60 mt-1">
                              Caminho da aplicação web do teste para onde o participante é direcionado ao iniciar a avaliação.
                            </p>
                          </div>

                          <div className="flex items-start gap-2 pt-1">
                            <input
                              type="checkbox"
                              id="input-inclui-laudo-pdf"
                              checked={produtoForm.inclui_laudo_pdf}
                              onChange={(e) => setProdutoForm({ ...produtoForm, inclui_laudo_pdf: e.target.checked })}
                              className="mt-0.5 w-4 h-4 rounded border-brand-mint text-brand-mint focus:ring-brand-mint/30 cursor-pointer"
                            />
                            <label htmlFor="input-inclui-laudo-pdf" className="cursor-pointer select-none">
                              <span className="text-xs font-semibold text-brand-charcoal flex items-center gap-1">
                                📄 Selo de Laudo Clínico em PDF Incluso
                              </span>
                              <p className="text-[11px] text-brand-charcoal/60">
                                Exibe o selo de emissão instantânea de Relatório Clínico A4 com impressão em 1 clique na página e checkout.
                              </p>
                            </label>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-brand-charcoal mb-1">
                              📝 Orientações e Notas Pré-Teste (Opcional)
                            </label>
                            <textarea
                              value={produtoForm.orientacoes_pre_teste}
                              onChange={(e) => setProdutoForm({ ...produtoForm, orientacoes_pre_teste: e.target.value })}
                              rows={2}
                              className="w-full px-3 py-2 border border-brand-beige rounded-lg text-xs focus-visible:ring-2 focus-visible:ring-brand-purple/30 bg-white resize-y"
                              placeholder="Ex: Reserve de 5 a 10 minutos em ambiente silencioso. Responda com sinceridade observando seu estado habitual..."
                            />
                            <p className="text-[11px] text-brand-charcoal/60 mt-0.5">
                              Instruções exibidas ao participante na tela de acolhimento antes de iniciar as questões.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Seção Modo Informativo / Permitir Checkout */}
                    <div className="sm:col-span-2 p-4 rounded-xl border border-amber-300/60 bg-amber-50/50 flex flex-col gap-2 transition-colors">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          id="input-permite-checkout"
                          checked={produtoForm.permite_checkout}
                          onChange={(e) => setProdutoForm((prev) => ({ ...prev, permite_checkout: e.target.checked }))}
                          className="mt-1 w-4 h-4 rounded border-amber-400 text-amber-600 focus:ring-amber-400/30 cursor-pointer"
                        />
                        <label htmlFor="input-permite-checkout" className="cursor-pointer select-none">
                          <span className="text-xs sm:text-sm font-bold text-brand-charcoal flex items-center gap-1.5">
                            🛒 Habilitar Checkout & Carrinho de Compras
                          </span>
                          <p className="text-xs text-brand-charcoal/70 mt-1 leading-relaxed">
                            Quando ativado, o produto segue o fluxo de vendas normal com carrinho, valores e checkout. Se desativado, o produto opera em <strong>modo estritamente informativo</strong> (recomendado para eventos do <strong>Calendário</strong>): nenhum valor ou taxa é cobrado, não há carrinho de compras nem botão de reserva, e o participante visualiza a programação com opção de tirar dúvidas via WhatsApp.
                          </p>
                        </label>
                      </div>
                    </div>
                  <div>
                    <label className="block text-xs font-medium text-brand-charcoal/70 mb-1">Limite de Pessoas <span className="text-brand-charcoal/30">(opcional)</span></label>
<input
                       value={produtoForm.vagas_maximas}
                       onChange={(e) => setProdutoForm({ ...produtoForm, vagas_maximas: e.target.value })}
                       className="w-full px-3 py-2 border border-brand-beige rounded-lg text-sm focus-visible:ring-2 focus-visible:ring-brand-purple/30"
                       placeholder="Ex: 15"
                       inputMode="numeric"
                     />
                    <p className="text-xs text-brand-charcoal/30 mt-1">Deixe em branco se não houver limite de vagas.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-brand-charcoal/70 mb-1">
                      Vagas Preenchidas / Contador <span className="text-brand-charcoal/30">(opcional)</span>
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={produtoForm.vagas_ocupadas_manual}
                      onChange={(e) => setProdutoForm({ ...produtoForm, vagas_ocupadas_manual: e.target.value })}
                      className="w-full px-3 py-2 border border-brand-beige rounded-lg text-sm focus-visible:ring-2 focus-visible:ring-brand-purple/30"
                      placeholder="Ex: 5"
                      inputMode="numeric"
                    />
                    <p className="text-xs text-brand-charcoal/30 mt-1">
                      Este número representará as vagas vendidas externamente (offline) e será somado às inscrições do site.
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-brand-charcoal/70 mb-1">Descrição Curta</label>
<input
                       value={produtoForm.descricao_curta}
                       onChange={(e) => setProdutoForm({ ...produtoForm, descricao_curta: e.target.value })}
                       className="w-full px-3 py-2 border border-brand-beige rounded-lg text-sm focus-visible:ring-2 focus-visible:ring-brand-purple/30"
                       placeholder="Encontros quinzenais · 2h · Grupos reduzidos"
                     />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-brand-charcoal/70 mb-1">
                      Descrição (1 por linha)
                    </label>
<textarea
                       value={produtoForm.descricao}
                       onChange={(e) => setProdutoForm({ ...produtoForm, descricao: e.target.value })}
                       className="w-full px-3 py-2 border border-brand-beige rounded-lg text-sm focus-visible:ring-2 focus-visible:ring-brand-purple/30"
                       rows={4}
                       placeholder="Data: 25/07 (Constelação)&#10;Horário: 19h às 21h&#10;Local: Alameda Tangará, 500"
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
                       className="w-full px-3 py-2 border border-brand-beige rounded-lg text-sm focus-visible:ring-2 focus-visible:ring-brand-purple/30"
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
                    disabled={salvandoProduto || !produtoForm.nome || !produtoForm.slug}
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
            ) : produtosFiltrados.length === 0 ? (
              <div className="bg-white rounded-xl border border-brand-beige p-8 text-center text-brand-charcoal/40 text-sm">
                Nenhum produto encontrado com os filtros aplicados.
              </div>
            ) : (
              <div className="space-y-3">
                {produtosFiltrados.map((p) => (
                  <div key={p.id} className="bg-white rounded-xl border border-brand-beige p-4 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-brand-charcoal text-sm">{p.nome}</span>
                        {!p.ativo && <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">Inativo</span>}
                        {p.destaque && <span className="text-xs bg-brand-terracotta/10 text-brand-terracotta px-1.5 py-0.5 rounded">Destaque</span>}
                        {(p.atendimento_individual || isProdutoAgendamento(p)) && (
                          <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200/80 px-2 py-0.5 rounded font-medium inline-flex items-center gap-1">
                            🗓️ Atendimento ({formatDuracao(p.duracao_minutos)})
                          </span>
                        )}
                        {p.is_teste && (
                          <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2 py-0.5 rounded font-medium inline-flex items-center gap-1">
                            🧠 Teste ({p.rota_teste || `/teste-${p.slug.replace(/^teste-/, "")}`})
                          </span>
                        )}
                        {(p.permite_checkout === false || p.categoria?.toLowerCase() === "calendario" || p.slug?.startsWith("calendario")) && (
                          <span className="text-xs bg-purple-50 text-purple-800 border border-purple-200/80 px-2 py-0.5 rounded font-medium inline-flex items-center gap-1">
                            📢 Informativo (Sem Checkout)
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-brand-charcoal/40 mt-0.5">
                        {p.slug}{p.preco != null && p.preco > 0 ? ` · R$ ${(p.preco ?? 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : ""} · Ordem: {p.ordem}{p.categoria ? ` · ${p.categoria}` : ""}{p.vagas_maximas != null ? ` · Limite: ${p.vagas_maximas} pessoas` : ""}{p.vagas_maximas != null ? (p.vagas_ocupadas_manual != null ? ` · Contador: ${p.vagas_ocupadas_manual}/${p.vagas_maximas} (Manual)` : ` · Contador: Auto`) : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {p.vagas_maximas != null && (
                        <button
                          onClick={() => setAjustandoContador({ produto: p, valor: p.vagas_ocupadas_manual != null ? p.vagas_ocupadas_manual.toString() : "" })}
                          className="px-3 py-1.5 text-xs text-brand-terracotta hover:bg-brand-terracotta/10 rounded-lg transition-colors font-medium cursor-pointer"
                          title="Ajustar contador de vagas na página"
                        >
                          Ajustar Contador
                        </button>
                      )}
                      <button
                        onClick={() => handleEditarProduto(p)}
                        className="px-3 py-1.5 text-xs text-brand-purple hover:bg-brand-purple/10 rounded-lg transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleClonarProduto(p)}
                        disabled={salvandoProduto}
                        className="px-3 py-1.5 text-xs text-brand-charcoal/60 hover:bg-brand-beige/50 rounded-lg transition-colors"
                      >
                        Clonar
                      </button>
                      {p.ativo ? (
                        <button
                          onClick={() => handleDesativarProduto(p.id)}
                          className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          Desativar
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReativarProduto(p.id)}
                          className="px-3 py-1.5 text-xs text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          Reativar
                        </button>
                      )}
                      <button
                        onClick={() => setProdutoParaApagar(p)}
                        className="px-3 py-1.5 text-xs text-red-700 hover:bg-red-100 rounded-lg transition-colors font-semibold"
                      >
                        Apagar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
      {produtoParaApagar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" style={{ overscrollBehavior: "contain" }} role="dialog" aria-modal="true" aria-label="Confirmar exclusão de produto" onKeyDown={(e) => { if (e.key === "Escape") setProdutoParaApagar(null); }}>
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-base font-semibold text-brand-charcoal mb-2">Apagar produto permanentemente?</h3>
            <p className="text-sm text-brand-charcoal/60 mb-5">
              O produto <strong>{produtoParaApagar.nome}</strong> será removido permanentemente do banco de dados. Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setProdutoParaApagar(null)} className="px-4 py-2 text-sm text-brand-charcoal/60 hover:text-brand-charcoal transition-colors">
                Cancelar
              </button>
              <button onClick={handleApagarProduto} disabled={apagandoProduto} className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors">
                {apagandoProduto ? "Apagando..." : "Sim, apagar"}
              </button>
            </div>
          </div>
        </div>
      )}
      {ajustandoContador && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          style={{ overscrollBehavior: "contain" }}
          role="dialog"
          aria-modal="true"
          aria-label="Ajustar contador de vagas"
          onKeyDown={(e) => { if (e.key === "Escape") setAjustandoContador(null); }}
        >
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl border border-brand-beige">
            <h3 className="text-base font-semibold text-brand-charcoal mb-1">
              Ajustar Contador de Vagas
            </h3>
            <p className="text-xs text-brand-charcoal/60 mb-4">
              {ajustandoContador.produto.nome}
            </p>

            <div className="bg-brand-beige/20 p-3 rounded-lg text-xs text-brand-charcoal/70 mb-4 space-y-1">
              <div className="flex justify-between">
                <span>Limite da turma:</span>
                <strong>{ajustandoContador.produto.vagas_maximas ?? "—"} pessoas</strong>
              </div>
              <div className="flex justify-between">
                <span>Status atual:</span>
                <span className="font-medium text-brand-purple">
                  {ajustandoContador.produto.vagas_ocupadas_manual != null
                    ? `${ajustandoContador.produto.vagas_ocupadas_manual} vendas externas/offline`
                    : "Automático (somente site)"}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-medium text-brand-charcoal/80 mb-1">
                Vagas Vendidas Externamente (Offline)
              </label>
              <input
                type="number"
                min={0}
                value={ajustandoContador.valor}
                onChange={(e) =>
                  setAjustandoContador({ ...ajustandoContador, valor: e.target.value })
                }
                placeholder="Ex: 5 (ou vazio para apenas vendas do site)"
                className="w-full px-3 py-2 border border-brand-beige rounded-lg text-sm focus-visible:ring-2 focus-visible:ring-brand-purple/30"
                autoFocus
              />
              <p className="text-[11px] text-brand-charcoal/50 mt-1.5 leading-normal">
                Digite quantas vendas ocorreram fora do sistema. Esse número será somado automaticamente às compras reais do site.
              </p>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setAjustandoContador(null)}
                className="px-3.5 py-2 text-xs text-brand-charcoal/60 hover:text-brand-charcoal transition-colors rounded-lg"
              >
                Cancelar
              </button>
              {ajustandoContador.valor !== "" && (
                <button
                  type="button"
                  onClick={() => setAjustandoContador({ ...ajustandoContador, valor: "" })}
                  className="px-3.5 py-2 text-xs text-brand-charcoal/70 hover:bg-brand-beige/50 border border-brand-beige transition-colors rounded-lg"
                >
                  Limpar (Automático)
                </button>
              )}
              <button
                type="button"
                onClick={handleSalvarContadorRapido}
                disabled={salvandoContador}
                className="px-4 py-2 text-xs bg-brand-purple text-white rounded-lg hover:bg-brand-purple-dark disabled:opacity-50 transition-colors font-medium shadow-xs"
              >
                {salvandoContador ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
