"use client";

import { useState, useEffect, useCallback, Fragment } from "react";
import type { Produto, Pedido, Participante, Cupom, Usuario } from "@/lib/types";

type Paginated<T> = {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
};

type Tab = "config" | "sobre" | "produtos" | "pedidos" | "participantes" | "cupons" | "usuarios";

const FAQ_PADRAO_ADMIN = [
  {
    pergunta: "Preciso expor minha história ou falar na primeira sessão?",
    resposta:
      "De forma alguma. Cada participante tem seu próprio ritmo e tempo de abertura. Estar no grupo já é um ato de presença e transformação. Você só compartilha o que sentir no coração, sem qualquer pressão.",
  },
  {
    pergunta: "Como funcionam os grupos reduzidos?",
    resposta:
      "Nossos grupos contam com no máximo 15 participantes por encontro. Essa limitação garante que cada pessoa seja verdadeiramente ouvida, acolhida e acompanhada com cuidado individualizado e respeito ao seu processo.",
  },
  {
    pergunta: "Qual é a política de sigilo do INstituto Kalapa?",
    resposta:
      "O sigilo é nosso pilar ético inegociável. Tudo o que é compartilhado, vivenciado e revelado nos encontros permanece estritamente dentro do círculo do grupo, criando um solo seguro e confiável.",
  },
  {
    pergunta: "O que devo levar e como me preparar para o encontro?",
    resposta:
      "Venha com roupas confortáveis que permitam sentar e se movimentar com liberdade. Não é necessária nenhuma experiência prévia em terapias ou vivências. O espaço oferece todo o suporte para sua chegada.",
  },
  {
    pergunta: "Qual a frequência dos encontros?",
    resposta:
      "As vivências acontecem em ritmo quinzenal consciente. Esse intervalo é intencional: permite que os aprendizados e sentimentos acessados no grupo sejam integrados à sua rotina diária no seu próprio tempo.",
  },
];

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function formatCPF(cpf?: string | null) {
  if (!cpf) return "—";
  const cleaned = cpf.replace(/\D/g, "");
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }
  return cpf;
}

function SortableHeader({
  children,
  key: sortKey,
  currentSort,
  onSort,
}: {
  children: React.ReactNode;
  key: string;
  currentSort: { key: string; dir: "asc" | "desc" };
  onSort: (key: string) => void;
}) {
  const isActive = currentSort.key === sortKey;
  const dir = isActive ? currentSort.dir : "desc";
  return (
    <button
      onClick={() => onSort(sortKey)}
      className="flex items-center gap-1.5 w-full text-left font-medium text-brand-charcoal/70 hover:text-brand-charcoal transition-colors group"
      aria-sort={isActive ? (dir === "asc" ? "ascending" : "descending") : "none"}
    >
      <span>{children}</span>
      <span className="text-brand-charcoal/40 group-hover:text-brand-charcoal/70 transition-colors" aria-hidden="true">
        {isActive ? (dir === "asc" ? "▲" : "▼") : "⇅"}
      </span>
    </button>
  );
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

  // Sobre & FAQ Facilitadora
  const [facilitadoraNome, setFacilitadoraNome] = useState("");
  const [facilitadoraTitulo, setFacilitadoraTitulo] = useState("");
  const [facilitadoraFoto, setFacilitadoraFoto] = useState("");
  const [facilitadoraCredenciais, setFacilitadoraCredenciais] = useState("");
  const [facilitadoraBio, setFacilitadoraBio] = useState("");
  const [espacoTitulo, setEspacoTitulo] = useState("");
  const [espacoDescricao, setEspacoDescricao] = useState("");
  const [espacoFotos, setEspacoFotos] = useState<string[]>([]);
  const [faqItens, setFaqItens] = useState<{ pergunta: string; resposta: string }[]>([]);
  const [fotoFacilitadoraFile, setFotoFacilitadoraFile] = useState<File | null>(null);
  const [uploadingFotoFacilitadora, setUploadingFotoFacilitadora] = useState(false);
  const [uploadingFotosEspaco, setUploadingFotosEspaco] = useState(false);
  const [novaFotoEspacoUrl, setNovaFotoEspacoUrl] = useState("");
  const [salvandoSobre, setSalvandoSobre] = useState(false);
  const [sobreSucesso, setSobreSucesso] = useState("");

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
    vagas_maximas: "",
    vagas_ocupadas_manual: "",
    categoria: "",
    forma_pagamento_disponivel: "ambos",
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
  const [produtosStatusFiltro, setProdutosStatusFiltro] = useState<"todos" | "ativos" | "inativos">("todos");
  const [produtosSearch, setProdutosSearch] = useState("");

  // Pedidos
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [pedidosPage, setPedidosPage] = useState(1);
  const [pedidosTotalPages, setPedidosTotalPages] = useState(1);
  const [pedidosTotal, setPedidosTotal] = useState(0);
  const [pedidosSearch, setPedidosSearch] = useState("");
  const [pedidosProdutoStatusFiltro, setPedidosProdutoStatusFiltro] = useState<"todos" | "ativos" | "inativos">("todos");
  const [pedidosProdutoFiltro, setPedidosProdutoFiltro] = useState("");
  const [pedidosSort, setPedidosSort] = useState<{ key: string; dir: "asc" | "desc" }>({ key: "created_at", dir: "desc" });
  const [pedidoExpandidoId, setPedidoExpandidoId] = useState<string | null>(null);

  // Participantes
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [participantesPage, setParticipantesPage] = useState(1);
  const [participantesTotalPages, setParticipantesTotalPages] = useState(1);
  const [participantesTotal, setParticipantesTotal] = useState(0);
  const [participantesSearch, setParticipantesSearch] = useState("");
  const [participantesProdutoStatusFiltro, setParticipantesProdutoStatusFiltro] = useState<"todos" | "ativos" | "inativos">("todos");
  const [participantesProdutoFiltro, setParticipantesProdutoFiltro] = useState("");
  const [participantesSort, setParticipantesSort] = useState<{ key: string; dir: "asc" | "desc" }>({ key: "created_at", dir: "desc" });
  const [showConfirm, setShowConfirm] = useState(false);
  const [clearing, setClearing] = useState(false);

  // Relatório de Convidados para Casa 52
  const [showRelatorioModal, setShowRelatorioModal] = useState(false);
  const [relatorioProdutoId, setRelatorioProdutoId] = useState("");
  const [relatorioApenasPagos, setRelatorioApenasPagos] = useState(true);
  const [relatorioCarregando, setRelatorioCarregando] = useState(false);
  const [relatorioParticipantes, setRelatorioParticipantes] = useState<Participante[]>([]);

  // Edição de contato (pedido ou participante)
  const [editando, setEditando] = useState<{
    tipo: "pedido" | "participante";
    id: string;
    nome: string;
    email: string;
    telefone: string;
    motivacao?: string;
  } | null>(null);
  const [salvandoEdicao, setSalvandoEdicao] = useState(false);

  // Exclusão de pedidos
  const [pedidoParaExcluir, setPedidoParaExcluir] = useState<string | null>(null);
  const [excluindoPedido, setExcluindoPedido] = useState(false);

  // Exclusão permanente de produtos
  const [produtoParaApagar, setProdutoParaApagar] = useState<Produto | null>(null);
  const [apagandoProduto, setApagandoProduto] = useState(false);

  // Cupons
  const [cupons, setCupons] = useState<Cupom[]>([]);
  const [showCupomModal, setShowCupomModal] = useState(false);
  const [cupomEditando, setCupomEditando] = useState<Cupom | null>(null);
  const [cupomForm, setCupomForm] = useState({
    codigo: "",
    tipo: "porcentagem" as "porcentagem" | "fixo",
    valor: "",
    quantidade_maxima: "",
    valor_minimo_pedido: "",
    validade: "",
    ativo: true,
  });
  const [salvandoCupom, setSalvandoCupom] = useState(false);
  const [cupomSucesso, setCupomSucesso] = useState("");

  // Usuários
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuariosPage, setUsuariosPage] = useState(1);
  const [usuariosTotalPages, setUsuariosTotalPages] = useState(1);
  const [usuariosTotal, setUsuariosTotal] = useState(0);
  const [usuariosSearch, setUsuariosSearch] = useState("");
  const [usuarioDetalhes, setUsuarioDetalhes] = useState<{ usuario: Usuario; pedidos: any[]; produtos_comprados?: any[] } | null>(null);
  const [carregandoDetalhes, setCarregandoDetalhes] = useState(false);
  const [usuarioParaReset, setUsuarioParaReset] = useState<Usuario | null>(null);
  const [novaSenhaInput, setNovaSenhaInput] = useState("");
  const [resetandoSenha, setResetandoSenha] = useState(false);
  const [resetSenhaSucesso, setResetSenhaSucesso] = useState("");
  const [usuarioParaExcluir, setUsuarioParaExcluir] = useState<Usuario | null>(null);
  const [excluindoUsuario, setExcluindoUsuario] = useState(false);

  const checkAuth = useCallback(async () => {
    const res = await fetch("/api/admin/verify");
    if (res.ok) {
      setAuthed(true);
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
      setFacilitadoraNome(data.facilitadora_nome || "Clatihúcia Capeli");
      setFacilitadoraTitulo(data.facilitadora_titulo || "Facilitadora e Terapeuta Sistêmica");
      setFacilitadoraFoto(data.facilitadora_foto || "/foto_10.jpg");
      setFacilitadoraCredenciais(data.facilitadora_credenciais || "Constelação Familiar, Vivências em Grupo e Acolhimento do Trauma");
      setFacilitadoraBio(data.facilitadora_bio || "Com mais de 10 anos de dedicação ao cuidado emocional e ao desenvolvimento humano, Clatihúcia Capeli conduz vivências que acolhem a dor sem julgamentos, permitindo que ela se transforme em força e consciência.\n\nSua abordagem integra a sabedoria sistêmica das constelações familiares, a neurobiologia do trauma e a potência curativa da presença em grupo. Cada encontro é cuidadosamente preparado para ser um santuário de respeito, acolhimento genuíno e pertencimento.");
      setEspacoTitulo(data.espaco_titulo || "Espaço Serena — Refúgio e Natureza");
      setEspacoDescricao(data.espaco_descricao || "Localizado em meio à natureza na Granja Viana (Cotia - SP), o espaço foi concebido como um refúgio acolhedor, silencioso e seguro para vivências presenciais transformadoras.");
      if (data.espaco_fotos) {
        try {
          const parsed = JSON.parse(data.espaco_fotos);
          if (Array.isArray(parsed)) setEspacoFotos(parsed);
        } catch {
          setEspacoFotos(["/foto2.jpg", "/foto4.jpg", "/foto6a.jpg"]);
        }
      } else {
        setEspacoFotos(["/foto2.jpg", "/foto4.jpg", "/foto6a.jpg"]);
      }
      if (data.faq_itens) {
        try {
          const parsed = JSON.parse(data.faq_itens);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setFaqItens(parsed);
          } else {
            setFaqItens(FAQ_PADRAO_ADMIN);
          }
        } catch {
          setFaqItens(FAQ_PADRAO_ADMIN);
        }
      } else {
        setFaqItens(FAQ_PADRAO_ADMIN);
      }
    }
  };

  const fetchProdutos = async () => {
    const res = await fetch("/api/admin/produtos");
    if (res.ok) setProdutos(await res.json());
  };

  const fetchPedidos = useCallback(
    async (
      page = pedidosPage,
      prodStatus = pedidosProdutoStatusFiltro,
      prodId = pedidosProdutoFiltro
    ) => {
      const params = new URLSearchParams({ page: page.toString(), perPage: "20" });
      if (pedidosSearch) params.set("search", pedidosSearch);
      if (pedidosSort) {
        params.set("sort", pedidosSort.key);
        params.set("dir", pedidosSort.dir);
      }
      if (prodStatus && prodStatus !== "todos") {
        params.set("produtoStatus", prodStatus);
      }
      if (prodId && prodId !== "todos") {
        params.set("produtoId", prodId);
      }
      const res = await fetch(`/api/admin/pedidos?${params.toString()}`);
      if (res.ok) {
        const json: Paginated<Pedido> = await res.json();
        setPedidos(json.data);
        setPedidosPage(json.page);
        setPedidosTotalPages(json.totalPages);
        setPedidosTotal(json.total);
      }
    },
    [pedidosPage, pedidosSearch, pedidosSort, pedidosProdutoStatusFiltro, pedidosProdutoFiltro]
  );

  const fetchParticipantes = useCallback(
    async (
      page = participantesPage,
      prodFiltro = participantesProdutoFiltro,
      prodStatus = participantesProdutoStatusFiltro
    ) => {
      const params = new URLSearchParams({ page: page.toString(), perPage: "20" });
      if (participantesSearch) params.set("search", participantesSearch);
      if (participantesSort) {
        params.set("sort", participantesSort.key);
        params.set("dir", participantesSort.dir);
      }
      if (prodFiltro && prodFiltro !== "todos") {
        params.set("produtoId", prodFiltro);
      }
      if (prodStatus && prodStatus !== "todos") {
        params.set("produtoStatus", prodStatus);
      }
      const res = await fetch(`/api/admin/participantes?${params.toString()}`);
      if (res.ok) {
        const json: Paginated<Participante> = await res.json();
        setParticipantes(json.data);
        setParticipantesPage(json.page);
        setParticipantesTotalPages(json.totalPages);
        setParticipantesTotal(json.total);
      }
    },
    [participantesPage, participantesSearch, participantesSort, participantesProdutoFiltro, participantesProdutoStatusFiltro]
  );

  const carregarRelatorio = useCallback(
    async (prodId: string, apenasPagos: boolean) => {
      setRelatorioCarregando(true);
      try {
        const params = new URLSearchParams({
          all: "true",
          sort: "nome",
          dir: "asc",
        });
        if (prodId && prodId !== "todos") params.set("produtoId", prodId);
        if (apenasPagos) params.set("status", "confirmados");
        if (participantesProdutoStatusFiltro && participantesProdutoStatusFiltro !== "todos") {
          params.set("produtoStatus", participantesProdutoStatusFiltro);
        }

        const res = await fetch(`/api/admin/participantes?${params.toString()}`);
        if (res.ok) {
          const json = await res.json();
          setRelatorioParticipantes(json.data || []);
        }
      } catch (err) {
        console.error("Erro ao carregar dados do relatório:", err);
      } finally {
        setRelatorioCarregando(false);
      }
    },
    [participantesProdutoStatusFiltro]
  );

  const handleAbrirRelatorio = () => {
    const prodIdInicial = participantesProdutoFiltro || (produtos.length > 0 ? produtos[0].id : "");
    setRelatorioProdutoId(prodIdInicial);
    setShowRelatorioModal(true);
    void carregarRelatorio(prodIdInicial, relatorioApenasPagos);
  };

  const fetchCupons = useCallback(async () => {
    const res = await fetch("/api/admin/cupons");
    if (res.ok) setCupons(await res.json());
  }, []);

  const fetchUsuarios = useCallback(async (page = usuariosPage) => {
    const params = new URLSearchParams({ page: page.toString(), perPage: "20" });
    if (usuariosSearch) params.set("search", usuariosSearch);
    const res = await fetch(`/api/admin/usuarios?${params.toString()}`);
    if (res.ok) {
      const json: Paginated<Usuario> = await res.json();
      setUsuarios(json.data);
      setUsuariosPage(json.page);
      setUsuariosTotalPages(json.totalPages);
      setUsuariosTotal(json.total);
    }
  }, [usuariosPage, usuariosSearch]);

  const handleSalvarCupom = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvandoCupom(true);
    setCupomSucesso("");
    try {
      const url = cupomEditando ? `/api/admin/cupons/${cupomEditando.id}` : "/api/admin/cupons";
      const method = cupomEditando ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cupomForm),
      });
      if (res.ok) {
        setShowCupomModal(false);
        setCupomEditando(null);
        setCupomSucesso("Cupom salvo com sucesso!");
        await fetchCupons();
        setTimeout(() => setCupomSucesso(""), 3000);
      } else {
        const d = await res.json();
        setError(d.error || "Erro ao salvar cupom");
      }
    } catch {
      setError("Erro ao salvar cupom");
    }
    setSalvandoCupom(false);
  };

  const handleToggleCupomAtivo = async (cupom: Cupom) => {
    const res = await fetch(`/api/admin/cupons/${cupom.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ativo: !cupom.ativo }),
    });
    if (res.ok) await fetchCupons();
  };

  const handleExcluirCupom = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este cupom?")) return;
    const res = await fetch(`/api/admin/cupons/${id}`, { method: "DELETE" });
    if (res.ok) await fetchCupons();
  };

  const handleVerDetalhesUsuario = async (u: Usuario) => {
    setCarregandoDetalhes(true);
    const res = await fetch(`/api/admin/usuarios/${u.id}`);
    if (res.ok) {
      setUsuarioDetalhes(await res.json());
    }
    setCarregandoDetalhes(false);
  };

  const handleResetarSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuarioParaReset || !novaSenhaInput) return;
    setResetandoSenha(true);
    const res = await fetch(`/api/admin/usuarios/${usuarioParaReset.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nova_senha: novaSenhaInput }),
    });
    if (res.ok) {
      setResetSenhaSucesso("Senha redefinida com sucesso!");
      setTimeout(() => {
        setResetSenhaSucesso("");
        setUsuarioParaReset(null);
        setNovaSenhaInput("");
      }, 2000);
    } else {
      const d = await res.json();
      setError(d.error || "Erro ao redefinir senha");
    }
    setResetandoSenha(false);
  };

  const handleExcluirUsuario = async () => {
    if (!usuarioParaExcluir) return;
    setExcluindoUsuario(true);
    const res = await fetch(`/api/admin/usuarios/${usuarioParaExcluir.id}`, { method: "DELETE" });
    if (res.ok) {
      setUsuarioParaExcluir(null);
      await fetchUsuarios();
    } else {
      const d = await res.json();
      setError(d.error || "Erro ao excluir usuário");
    }
    setExcluindoUsuario(false);
  };

  useEffect(() => { checkAuth(); }, [checkAuth]);
  useEffect(() => {
    if (authed) {
      void Promise.all([fetchConfig(), fetchProdutos(), fetchPedidos(), fetchParticipantes(), fetchCupons(), fetchUsuarios()]);
    }
  }, [authed, fetchPedidos, fetchParticipantes, fetchCupons, fetchUsuarios]);


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
      preco: "", imagem_url: "", beneficios: "", vagas_maximas: "",
      vagas_ocupadas_manual: "",
      categoria: "", forma_pagamento_disponivel: "ambos", destaque: false, ativo: true, ordem: "0",
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

    const payload = {
      ...produtoForm,
      imagem_url: imagemUrl,
      vagas_maximas: parseVagas(produtoForm.vagas_maximas),
      vagas_ocupadas_manual: parseVagas(produtoForm.vagas_ocupadas_manual),
      categoria: produtoForm.categoria.trim() || null,
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
      preco: (p.preco ?? 0).toString().replace(".", ","),
      imagem_url: p.imagem_url || "",
      beneficios: p.beneficios.join("\n"),
      vagas_maximas: p.vagas_maximas != null ? p.vagas_maximas.toString() : "",
      vagas_ocupadas_manual: p.vagas_ocupadas_manual != null ? p.vagas_ocupadas_manual.toString() : "",
      categoria: p.categoria || "",
      forma_pagamento_disponivel: p.forma_pagamento_disponivel || "ambos",
      destaque: p.destaque ?? false,
      ativo: p.ativo ?? true,
      ordem: (p.ordem ?? 0).toString(),
    });
    setProdutoImagemFile(null);
    setShowProdutoForm(true);
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
    setSalvandoContador(true);
    const { produto, valor } = ajustandoContador;
    const match = valor.trim().match(/^(\d+)/);
    const vagas_ocupadas_manual = match ? parseInt(match[1], 10) : null;
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
      slug: p.slug,
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

  // Clear
  const handleClear = async () => {
    setClearing(true);
    const res = await fetch("/api/admin/limpar", { method: "DELETE" });
    if (res.ok) {
      setParticipantes([]);
      setParticipantesTotal(0);
      setParticipantesPage(1);
      setParticipantesTotalPages(1);
      setShowConfirm(false);
    }
    setClearing(false);
  };

  // Edição handlers
  const handleSalvarEdicao = async () => {
    if (!editando) return;
    setSalvandoEdicao(true);
    const url =
      editando.tipo === "pedido"
        ? `/api/admin/pedidos/${editando.id}`
        : `/api/admin/participantes/${editando.id}`;

    const res = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: editando.nome,
        email: editando.email,
        telefone: editando.telefone,
      }),
    });

    if (res.ok) {
      setEditando(null);
      await Promise.all([fetchPedidos(), fetchParticipantes()]);
    } else {
      const data = await res.json();
      setError(data.error || "Erro ao salvar edição");
    }
    setSalvandoEdicao(false);
  };

  const handleExcluirPedido = async () => {
    if (!pedidoParaExcluir) return;
    setExcluindoPedido(true);
    const res = await fetch(`/api/admin/pedidos/${pedidoParaExcluir}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setPedidoParaExcluir(null);
      await Promise.all([fetchPedidos(), fetchParticipantes()]);
    } else {
      const data = await res.json();
      setError(data.error || "Erro ao excluir pedido");
    }
    setExcluindoPedido(false);
  };

  // Handlers para Sobre & FAQ
  const handleUploadFotoFacilitadora = async (file: File) => {
    setUploadingFotoFacilitadora(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const json = await res.json();
        setFacilitadoraFoto(json.url);
        setSobreSucesso("Foto da facilitadora enviada com sucesso!");
        setTimeout(() => setSobreSucesso(""), 4000);
      } else {
        const json = await res.json();
        setError(json.error || "Erro ao enviar imagem");
      }
    } catch {
      setError("Erro ao conectar com o servidor para upload");
    } finally {
      setUploadingFotoFacilitadora(false);
      setFotoFacilitadoraFile(null);
    }
  };

  const handleUploadFotosEspaco = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setUploadingFotosEspaco(true);
    setError("");

    const fileArray = Array.from(files);
    const novasUrls: string[] = [];

    try {
      for (const file of fileArray) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (res.ok) {
          const json = await res.json();
          if (json.url) {
            novasUrls.push(json.url);
          }
        } else {
          const json = await res.json();
          throw new Error(json.error || `Erro ao enviar ${file.name}`);
        }
      }

      if (novasUrls.length > 0) {
        setEspacoFotos((prev) => [...prev, ...novasUrls]);
        setSobreSucesso(
          novasUrls.length === 1
            ? "Foto do espaço enviada com sucesso!"
            : `${novasUrls.length} fotos do espaço enviadas com sucesso!`
        );
        setTimeout(() => setSobreSucesso(""), 4000);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao enviar fotos do espaço";
      setError(msg);
    } finally {
      setUploadingFotosEspaco(false);
    }
  };

  const handleRemoverFotoEspaco = (indexToRemove: number) => {
    setEspacoFotos((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleAdicionarFotoEspacoUrl = () => {
    if (!novaFotoEspacoUrl.trim()) return;
    setEspacoFotos((prev) => [...prev, novaFotoEspacoUrl.trim()]);
    setNovaFotoEspacoUrl("");
  };

  const handleSalvarSobre = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvandoSobre(true);
    setSobreSucesso("");
    setError("");

    try {
      // Se houver arquivo selecionado mas não enviado, enviar primeiro
      let fotoFinal = facilitadoraFoto;
      if (fotoFacilitadoraFile) {
        const formData = new FormData();
        formData.append("file", fotoFacilitadoraFile);
        const upRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (upRes.ok) {
          const upJson = await upRes.json();
          fotoFinal = upJson.url;
          setFacilitadoraFoto(fotoFinal);
          setFotoFacilitadoraFile(null);
        }
      }

      const updates = [
        { chave: "facilitadora_nome", valor: facilitadoraNome.trim() },
        { chave: "facilitadora_titulo", valor: facilitadoraTitulo.trim() },
        { chave: "facilitadora_foto", valor: fotoFinal.trim() },
        { chave: "facilitadora_credenciais", valor: facilitadoraCredenciais.trim() },
        { chave: "facilitadora_bio", valor: facilitadoraBio.trim() },
        { chave: "espaco_titulo", valor: espacoTitulo.trim() },
        { chave: "espaco_descricao", valor: espacoDescricao.trim() },
        { chave: "espaco_fotos", valor: JSON.stringify(espacoFotos) },
        { chave: "faq_itens", valor: JSON.stringify(faqItens) },
      ];

      for (const item of updates) {
        const r = await fetch("/api/config", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        });
        if (!r.ok) {
          const errJson = await r.json();
          throw new Error(errJson.error || `Erro ao salvar ${item.chave}`);
        }
      }

      setSobreSucesso("Informações da Facilitadora, Espaço e FAQ salvas com sucesso!");
      await fetchConfig();
      setTimeout(() => setSobreSucesso(""), 4000);
    } catch (err: any) {
      setError(err.message || "Erro ao salvar informações");
    } finally {
      setSalvandoSobre(false);
    }
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
              className="w-full px-4 py-3 border border-brand-beige rounded-lg text-sm focus-visible:ring-2 focus-visible:ring-brand-purple/30 focus-visible:border-brand-purple"
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

  // Listas filtradas e derivadas
  const produtosFiltrados = produtos.filter((p) => {
    if (produtosStatusFiltro === "ativos" && !p.ativo) return false;
    if (produtosStatusFiltro === "inativos" && p.ativo) return false;
    if (produtosSearch.trim()) {
      const q = produtosSearch.trim().toLowerCase();
      const matchNome = (p.nome || "").toLowerCase().includes(q);
      const matchSlug = (p.slug || "").toLowerCase().includes(q);
      const matchCat = (p.categoria || "").toLowerCase().includes(q);
      if (!matchNome && !matchSlug && !matchCat) return false;
    }
    return true;
  });

  const produtosParaPedidos = produtos.filter((p) => {
    if (pedidosProdutoStatusFiltro === "ativos") return p.ativo;
    if (pedidosProdutoStatusFiltro === "inativos") return !p.ativo;
    return true;
  });

  const produtosParaInscricoes = produtos.filter((p) => {
    if (participantesProdutoStatusFiltro === "ativos") return p.ativo;
    if (participantesProdutoStatusFiltro === "inativos") return !p.ativo;
    return true;
  });

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "config", label: "Configurações" },
    { id: "sobre", label: "Sobre & FAQ" },
    { id: "produtos", label: "Produtos", count: produtos.length },
    { id: "pedidos", label: "Pedidos", count: pedidosTotal || pedidos.length },
    { id: "participantes", label: "Inscrições", count: participantesTotal || participantes.length },
    { id: "cupons", label: "Cupons", count: cupons.length },
    { id: "usuarios", label: "Usuários", count: usuariosTotal },
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
            <button onClick={() => setError("")} className="float-right font-bold" aria-label="Fechar">
              &times;
            </button>
          </div>
        )}

        {/* Tab: Configurações */}
        {activeTab === "config" && (
          <div className="bg-white rounded-xl border border-brand-beige p-6">
            <h2 className="text-base font-semibold text-brand-charcoal mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-purple" />
              Configurações do Site
            </h2>
            <div className="max-w-md">
              <p className="text-sm text-brand-charcoal/60">
                Turma atual: <strong>{config.turma_atual || "2025-01"}</strong>
              </p>
              <p className="mt-3 text-xs text-brand-charcoal/40">
                O limite de vagas agora é definido por produto na aba <strong>Produtos</strong>.
              </p>
            </div>
          </div>
        )}

        {/* Tab: Sobre & FAQ */}
        {activeTab === "sobre" && (
          <div className="space-y-6">
            {sobreSucesso && (
              <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm font-medium flex items-center gap-2">
                <span>✓</span> {sobreSucesso}
              </div>
            )}

            <form onSubmit={handleSalvarSobre} className="space-y-6">
              {/* Bloco 1: A Facilitadora */}
              <div className="bg-white rounded-xl border border-brand-beige p-6 shadow-xs">
                <div className="flex items-center gap-2 pb-4 mb-6 border-b border-brand-beige">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#B8965A]" />
                  <h2 className="text-base font-semibold text-brand-charcoal">
                    Perfil da Facilitadora
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Foto da facilitadora */}
                  <div className="md:col-span-1 space-y-3">
                    <label className="block text-xs font-semibold text-brand-charcoal/80 uppercase tracking-wider">
                      Foto de Perfil
                    </label>
                    <div className="relative aspect-3/4 max-w-[220px] rounded-xl overflow-hidden border-2 border-[#B8965A]/40 bg-brand-beige/20 shadow-xs group">
                      {facilitadoraFoto ? (
                        <img
                          src={facilitadoraFoto}
                          alt={facilitadoraNome}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-brand-charcoal/40">
                          Sem foto
                        </div>
                      )}
                      {uploadingFotoFacilitadora && (
                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white text-xs gap-2">
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Enviando...</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="inline-block px-3 py-1.5 text-xs font-medium text-brand-purple bg-brand-purple/5 hover:bg-brand-purple/10 rounded-lg cursor-pointer transition-colors">
                        <span>Carregar nova foto</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setFotoFacilitadoraFile(file);
                              void handleUploadFotoFacilitadora(file);
                            }
                          }}
                        />
                      </label>
                      <input
                        type="text"
                        value={facilitadoraFoto}
                        onChange={(e) => setFacilitadoraFoto(e.target.value)}
                        placeholder="Ou cole a URL da imagem"
                        className="w-full text-xs px-3 py-2 border border-brand-beige rounded-lg focus-visible:ring-2 focus-visible:ring-brand-purple/30 text-brand-charcoal"
                      />
                    </div>
                  </div>

                  {/* Informações textuais */}
                  <div className="md:col-span-2 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-brand-charcoal/80 uppercase tracking-wider mb-1.5">
                          Nome Completo
                        </label>
                        <input
                          type="text"
                          value={facilitadoraNome}
                          onChange={(e) => setFacilitadoraNome(e.target.value)}
                          className="w-full px-3.5 py-2.5 border border-brand-beige rounded-lg text-sm focus-visible:ring-2 focus-visible:ring-brand-purple/30 font-medium text-brand-charcoal"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-brand-charcoal/80 uppercase tracking-wider mb-1.5">
                          Título / Especialidade
                        </label>
                        <input
                          type="text"
                          value={facilitadoraTitulo}
                          onChange={(e) => setFacilitadoraTitulo(e.target.value)}
                          className="w-full px-3.5 py-2.5 border border-brand-beige rounded-lg text-sm focus-visible:ring-2 focus-visible:ring-brand-purple/30 text-brand-charcoal"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-brand-charcoal/80 uppercase tracking-wider mb-1.5">
                        Credenciais & Formações (Separadas por vírgula)
                      </label>
                      <input
                        type="text"
                        value={facilitadoraCredenciais}
                        onChange={(e) => setFacilitadoraCredenciais(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-brand-beige rounded-lg text-sm focus-visible:ring-2 focus-visible:ring-brand-purple/30 text-brand-charcoal"
                        placeholder="Constelação Familiar, Vivências em Grupo..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-brand-charcoal/80 uppercase tracking-wider mb-1.5">
                        Biografia / Filosofia de Acolhimento
                      </label>
                      <textarea
                        rows={6}
                        value={facilitadoraBio}
                        onChange={(e) => setFacilitadoraBio(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-brand-beige rounded-lg text-sm focus-visible:ring-2 focus-visible:ring-brand-purple/30 text-brand-charcoal leading-relaxed"
                        placeholder="Escreva a trajetória, abordagem e acolhimento..."
                      />
                      <p className="text-[11px] text-brand-charcoal/40 mt-1">
                        Dica: use quebras de linha para separar parágrafos naturalmente no site.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bloco 2: O Espaço */}
              <div className="bg-white rounded-xl border border-brand-beige p-6 shadow-xs">
                <div className="flex items-center gap-2 pb-4 mb-6 border-b border-brand-beige">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-purple" />
                  <h2 className="text-base font-semibold text-brand-charcoal">
                    O Espaço & Localização
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-brand-charcoal/80 uppercase tracking-wider mb-1.5">
                      Título do Espaço
                    </label>
                    <input
                      type="text"
                      value={espacoTitulo}
                      onChange={(e) => setEspacoTitulo(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-brand-beige rounded-lg text-sm focus-visible:ring-2 focus-visible:ring-brand-purple/30 text-brand-charcoal font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-charcoal/80 uppercase tracking-wider mb-1.5">
                      Descrição e Atmosfera do Espaço
                    </label>
                    <textarea
                      rows={3}
                      value={espacoDescricao}
                      onChange={(e) => setEspacoDescricao(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-brand-beige rounded-lg text-sm focus-visible:ring-2 focus-visible:ring-brand-purple/30 text-brand-charcoal"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-charcoal/80 uppercase tracking-wider mb-2">
                      Fotos do Espaço ({espacoFotos.length})
                    </label>

                    {/* Grade de Miniaturas com botão de remover */}
                    {espacoFotos.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-3">
                        {espacoFotos.map((fotoUrl, idx) => (
                          <div
                            key={`${fotoUrl}-${idx}`}
                            className="group relative aspect-video rounded-lg overflow-hidden border border-brand-beige bg-brand-beige-light/30 shadow-xs"
                          >
                            <img
                              src={fotoUrl}
                              alt={`Espaço ${idx + 1}`}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoverFotoEspaco(idx)}
                              className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 cursor-pointer shadow-xs"
                              title="Remover foto"
                              aria-label={`Remover foto ${idx + 1}`}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                              </svg>
                            </button>
                            <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/50 text-[10px] text-white rounded font-mono">
                              #{idx + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Botão de upload no mesmo padrão do produto */}
                    <div className="space-y-2">
                      <label
                        className={`flex items-center justify-center gap-2 px-4 py-4 border-2 border-dashed rounded-lg transition-colors cursor-pointer ${
                          uploadingFotosEspaco
                            ? "border-brand-purple/50 bg-brand-purple/5 cursor-not-allowed"
                            : "border-brand-beige hover:border-brand-purple/50 hover:bg-brand-purple/5"
                        }`}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          disabled={uploadingFotosEspaco}
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              void handleUploadFotosEspaco(e.target.files);
                              e.target.value = "";
                            }
                          }}
                        />
                        {uploadingFotosEspaco ? (
                          <div className="flex items-center gap-2 text-sm text-brand-purple">
                            <div className="w-4 h-4 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" />
                            <span>Enviando fotos para o servidor...</span>
                          </div>
                        ) : (
                          <div className="flex flex-col sm:flex-row items-center gap-2 text-sm text-brand-charcoal/60 text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="font-medium text-brand-purple">Clique para selecionar foto(s)</span>
                            <span className="text-xs text-brand-charcoal/40 hidden sm:inline">(seleção múltipla permitida)</span>
                          </div>
                        )}
                      </label>
                      <p className="text-xs text-brand-charcoal/40">JPEG, PNG, WebP ou GIF. Máximo 5MB por foto.</p>

                      {/* Opção secundária: Adicionar por URL */}
                      <div className="pt-2 flex items-center gap-2">
                        <input
                          type="text"
                          value={novaFotoEspacoUrl}
                          onChange={(e) => setNovaFotoEspacoUrl(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAdicionarFotoEspacoUrl();
                            }
                          }}
                          placeholder="Ou cole uma URL / caminho de imagem (ex: /foto7.jpg)"
                          className="flex-1 text-xs px-3 py-2 border border-brand-beige rounded-lg focus-visible:ring-2 focus-visible:ring-brand-purple/30 text-brand-charcoal"
                        />
                        <button
                          type="button"
                          onClick={handleAdicionarFotoEspacoUrl}
                          disabled={!novaFotoEspacoUrl.trim()}
                          className="px-3 py-2 text-xs font-medium text-brand-purple bg-brand-purple/10 hover:bg-brand-purple/20 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors cursor-pointer"
                        >
                          + Adicionar URL
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bloco 3: Dúvidas Frequentes (FAQ) */}
              <div className="bg-white rounded-xl border border-brand-beige p-6 shadow-xs">
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-brand-beige">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                    <h2 className="text-base font-semibold text-brand-charcoal">
                      Perguntas Frequentes (FAQ Acolhedor)
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFaqItens([
                        ...faqItens,
                        { pergunta: "Nova Pergunta", resposta: "Explicação acolhedora..." },
                      ])
                    }
                    className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-medium transition-colors"
                  >
                    + Adicionar Pergunta
                  </button>
                </div>

                <div className="space-y-4">
                  {faqItens.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-brand-beige/80 bg-brand-beige/10 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-brand-charcoal/50">
                          #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = faqItens.filter((_, i) => i !== idx);
                            setFaqItens(updated);
                          }}
                          className="text-xs text-red-600 hover:text-red-700 hover:underline"
                        >
                          Remover
                        </button>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-brand-charcoal/70 mb-1">
                          Pergunta:
                        </label>
                        <input
                          type="text"
                          value={item.pergunta}
                          onChange={(e) => {
                            const updated = [...faqItens];
                            updated[idx].pergunta = e.target.value;
                            setFaqItens(updated);
                          }}
                          className="w-full px-3 py-2 border border-brand-beige rounded-lg text-sm bg-white text-brand-charcoal font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-brand-charcoal/70 mb-1">
                          Resposta:
                        </label>
                        <textarea
                          rows={3}
                          value={item.resposta}
                          onChange={(e) => {
                            const updated = [...faqItens];
                            updated[idx].resposta = e.target.value;
                            setFaqItens(updated);
                          }}
                          className="w-full px-3 py-2 border border-brand-beige rounded-lg text-sm bg-white text-brand-charcoal leading-relaxed"
                        />
                      </div>
                    </div>
                  ))}

                  {faqItens.length === 0 && (
                    <p className="text-xs text-brand-charcoal/40 text-center py-4">
                      Nenhuma pergunta cadastrada. Clique acima para adicionar ou o sistema usará as perguntas padrão.
                    </p>
                  )}
                </div>
              </div>

              {/* Botão Salvar Todas as Alterações */}
              <div className="flex items-center justify-end gap-3 sticky bottom-4 bg-white/90 backdrop-blur-md p-4 rounded-xl border border-brand-beige shadow-lg">
                <button
                  type="submit"
                  disabled={salvandoSobre}
                  className="px-6 py-3 bg-brand-purple text-white font-medium text-sm rounded-lg hover:bg-brand-purple-dark transition-all shadow-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {salvandoSobre && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {salvandoSobre ? "Salvando Informações..." : "Salvar Sobre & FAQ"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab: Produtos */}
        {activeTab === "produtos" && (
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
                {/* Filtro Status do Produto */}
                <select
                  value={produtosStatusFiltro}
                  onChange={(e) => setProdutosStatusFiltro(e.target.value as "todos" | "ativos" | "inativos")}
                  className="px-3 py-2 border border-brand-beige rounded-lg text-sm bg-white text-brand-charcoal focus-visible:ring-2 focus-visible:ring-brand-purple/30"
                  aria-label="Filtrar status dos produtos"
                >
                  <option value="todos">Status: Todos</option>
                  <option value="ativos">Produtos Ativos</option>
                  <option value="inativos">Produtos Inativos</option>
                </select>

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
                  onClick={() => { resetProdutoForm(); setShowProdutoForm(true); }}
                  className="px-4 py-2 bg-brand-purple text-white text-sm font-medium rounded-lg hover:bg-brand-purple-dark transition-colors whitespace-nowrap"
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
                       className="w-full px-3 py-2 border border-brand-beige rounded-lg text-sm focus-visible:ring-2 focus-visible:ring-brand-purple/30"
                       placeholder="Ex: Grupo de Autoconhecimento"
                     />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-brand-charcoal/70 mb-1">Slug *</label>
<input
                       value={produtoForm.slug}
                       onChange={(e) => setProdutoForm({ ...produtoForm, slug: e.target.value })}
                       className="w-full px-3 py-2 border border-brand-beige rounded-lg text-sm focus-visible:ring-2 focus-visible:ring-brand-purple/30"
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
                       onChange={(e) => setProdutoForm({ ...produtoForm, categoria: e.target.value })}
                       className="w-full px-3 py-2 border border-brand-beige rounded-lg text-sm focus-visible:ring-2 focus-visible:ring-brand-purple/30"
                       placeholder="Ex: atendimentos, vivencias"
                     />
                    <p className="text-xs text-brand-charcoal/30 mt-1">Agrupa produtos na página inicial.</p>
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
                       value={produtoForm.vagas_ocupadas_manual}
                       onChange={(e) => setProdutoForm({ ...produtoForm, vagas_ocupadas_manual: e.target.value })}
                       className="w-full px-3 py-2 border border-brand-beige rounded-lg text-sm focus-visible:ring-2 focus-visible:ring-brand-purple/30"
                       placeholder="Ex: 12"
                       inputMode="numeric"
                     />
                    <p className="text-xs text-brand-charcoal/30 mt-1">Deixe em branco para contagem automática via inscrições pagas.</p>
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
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-brand-charcoal text-sm">{p.nome}</span>
                        {!p.ativo && <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">Inativo</span>}
                        {p.destaque && <span className="text-xs bg-brand-terracotta/10 text-brand-terracotta px-1.5 py-0.5 rounded">Destaque</span>}
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
        )}

        {/* Tab: Pedidos */}
        {activeTab === "pedidos" && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-semibold text-brand-charcoal">Pedidos</h2>
                <span className="text-xs bg-brand-beige px-2 py-0.5 rounded-full text-brand-charcoal/70">
                  {pedidosTotal} {pedidosTotal === 1 ? "pedido" : "pedidos"}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {/* Filtro Status do Produto */}
                <select
                  value={pedidosProdutoStatusFiltro}
                  onChange={(e) => {
                    const novoStatus = e.target.value as "todos" | "ativos" | "inativos";
                    setPedidosProdutoStatusFiltro(novoStatus);
                    let novoProdFiltro = pedidosProdutoFiltro;
                    if (novoProdFiltro) {
                      const prod = produtos.find((p) => p.id === novoProdFiltro);
                      if (novoStatus === "ativos" && !prod?.ativo) novoProdFiltro = "";
                      if (novoStatus === "inativos" && prod?.ativo) novoProdFiltro = "";
                    }
                    if (novoProdFiltro !== pedidosProdutoFiltro) {
                      setPedidosProdutoFiltro(novoProdFiltro);
                    }
                    setPedidosPage(1);
                    void fetchPedidos(1, novoStatus, novoProdFiltro);
                  }}
                  className="px-3 py-2 border border-brand-beige rounded-lg text-sm bg-white text-brand-charcoal focus-visible:ring-2 focus-visible:ring-brand-purple/30"
                  aria-label="Filtrar status dos produtos em pedidos"
                >
                  <option value="todos">Status: Todos</option>
                  <option value="ativos">Produtos Ativos</option>
                  <option value="inativos">Produtos Inativos</option>
                </select>

                {/* Filtro por Produto Específico */}
                <select
                  value={pedidosProdutoFiltro}
                  onChange={(e) => {
                    const novoFiltro = e.target.value;
                    setPedidosProdutoFiltro(novoFiltro);
                    setPedidosPage(1);
                    void fetchPedidos(1, pedidosProdutoStatusFiltro, novoFiltro);
                  }}
                  className="px-3 py-2 border border-brand-beige rounded-lg text-sm bg-white text-brand-charcoal focus-visible:ring-2 focus-visible:ring-brand-purple/30 max-w-[200px] truncate"
                  aria-label="Filtrar por produto"
                >
                  <option value="">Todos os produtos</option>
                  {produtosParaPedidos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome}{!p.ativo ? " (Inativo)" : ""}
                    </option>
                  ))}
                </select>

                {/* Campo de Busca */}
                <div className="w-full sm:w-56">
                  <input
                    type="search"
                    placeholder="Buscar por nome, e-mail, NSU…"
                    value={pedidosSearch}
                    onChange={(e) => { setPedidosSearch(e.target.value); setPedidosPage(1); fetchPedidos(1); }}
                    className="w-full px-3 py-2 border border-brand-beige rounded-lg text-sm bg-white focus-visible:ring-2 focus-visible:ring-brand-purple/30"
                    aria-label="Buscar pedidos"
                  />
                </div>
              </div>
            </div>
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
                          <p className="font-medium text-brand-charcoal text-sm">
                            {ped.cliente_nome}{ped.cliente_telefone ? ` · ${ped.cliente_telefone}` : ""}
                          </p>
                          <p className="text-xs text-brand-charcoal/40 flex items-center gap-1">
                            <span>{ped.produtos?.nome || "—"}</span>
                            {ped.produtos && ped.produtos.ativo === false && (
                              <span className="text-[10px] bg-red-100 text-red-600 px-1 py-0.2 rounded font-normal">Inativo</span>
                            )}
                          </p>
                          {Array.isArray(ped.beneficiarios) && ped.beneficiarios.length > 0 && (
                            <button
                              type="button"
                              onClick={() => setPedidoExpandidoId(pedidoExpandidoId === ped.id ? null : ped.id)}
                              className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-brand-purple/10 text-brand-purple hover:bg-brand-purple/20 transition-colors"
                            >
                              <span>👥 +{ped.beneficiarios.length} acompanhante{ped.beneficiarios.length > 1 ? "s" : ""}</span>
                              <span className="text-[9px] opacity-70">
                                {pedidoExpandidoId === ped.id ? "▲" : "▼"}
                              </span>
                            </button>
                          )}
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          ped.status === "pago" ? "bg-green-100 text-green-700" :
                          ped.status === "pendente" ? "bg-yellow-100 text-yellow-700" :
                          "bg-gray-100 text-gray-600"
                        }`}>
                          {ped.status}
                        </span>
                      </div>

                      {/* Lista de Acompanhantes expandida no mobile */}
                      {Array.isArray(ped.beneficiarios) && ped.beneficiarios.length > 0 && pedidoExpandidoId === ped.id && (
                        <div className="mb-3 p-3 bg-brand-offwhite rounded-xl border border-brand-beige space-y-2 text-xs">
                          <p className="font-bold text-brand-purple uppercase tracking-wider text-[10px]">
                            Participantes Adicionais ({ped.beneficiarios.length})
                          </p>
                          {ped.beneficiarios.map((ben, bIdx) => (
                            <div key={bIdx} className="pb-2 border-b border-brand-beige/70 last:border-0 last:pb-0">
                              <p className="font-semibold text-brand-charcoal">{ben.nome}</p>
                              <p className="text-brand-charcoal/60">{ben.email}</p>
                              <a
                                href={`https://wa.me/${ben.telefone.replace(/\D/g, "").replace(/^0+/, "").replace(/^(55)?/, "55")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-brand-purple font-medium hover:underline inline-block mt-0.5"
                              >
                                WhatsApp: {ben.telefone}
                              </a>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="space-y-1 text-xs text-brand-charcoal/60">
                        <p>{ped.cliente_email}</p>
                        {ped.motivacao && <p className="text-brand-charcoal/50 line-clamp-2">&ldquo;{ped.motivacao}&rdquo;</p>}
                        <p className="font-semibold text-brand-charcoal">
                          R$ {ped.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </p>
                        <p className="font-mono text-brand-charcoal/40">{ped.order_nsu}</p>
                        <p className="text-brand-charcoal/40">{formatDate(ped.created_at)}</p>
                        {ped.status === "pendente" && (
                          <button
                            onClick={() => setPedidoParaExcluir(ped.id)}
                            className="mt-2 text-xs text-red-600 hover:underline block"
                          >
                            Excluir transação
                          </button>
                        )}
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
                          <th className="text-left px-4 py-3">
                            <SortableHeader
                              key="cliente_nome"
                              currentSort={pedidosSort}
                              onSort={(k) => { setPedidosSort(s => s.key === k ? { key: k, dir: s.dir === "asc" ? "desc" : "asc" } : { key: k, dir: "asc" }); fetchPedidos(1); }}
                            >
                              Cliente
                            </SortableHeader>
                          </th>
                          <th className="text-left px-4 py-3 font-medium text-brand-charcoal/70">Produto</th>
                          <th className="text-left px-4 py-3">
                            <SortableHeader
                              key="valor"
                              currentSort={pedidosSort}
                              onSort={(k) => { setPedidosSort(s => s.key === k ? { key: k, dir: s.dir === "asc" ? "desc" : "asc" } : { key: k, dir: "asc" }); fetchPedidos(1); }}
                            >
                              Valor
                            </SortableHeader>
                          </th>
                          <th className="text-left px-4 py-3 font-medium text-brand-charcoal/70">Motivação</th>
                          <th className="text-left px-4 py-3">
                            <SortableHeader
                              key="status"
                              currentSort={pedidosSort}
                              onSort={(k) => { setPedidosSort(s => s.key === k ? { key: k, dir: s.dir === "asc" ? "desc" : "asc" } : { key: k, dir: "asc" }); fetchPedidos(1); }}
                            >
                              Status
                            </SortableHeader>
                          </th>
                          <th className="text-left px-4 py-3">
                            <SortableHeader
                              key="created_at"
                              currentSort={pedidosSort}
                              onSort={(k) => { setPedidosSort(s => s.key === k ? { key: k, dir: s.dir === "asc" ? "desc" : "asc" } : { key: k, dir: "asc" }); fetchPedidos(1); }}
                            >
                              Data
                            </SortableHeader>
                          </th>
                          <th className="text-left px-4 py-3 font-medium text-brand-charcoal/70">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pedidos.map((ped) => (
                          <Fragment key={ped.id}>
                            <tr className="border-b border-brand-beige/50 hover:bg-brand-beige/30 transition-colors">
                              <td className="px-4 py-3">
                                <span className="font-medium text-brand-charcoal">
                                  {ped.cliente_nome}{ped.cliente_telefone ? (
                                    <>
                                      {" · "}
                                      <a
                                        href={`https://wa.me/${ped.cliente_telefone.replace(/\D/g, "").replace(/^0+/, "").replace(/^(55)?/, "55")}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-brand-purple hover:underline"
                                      >
                                        {ped.cliente_telefone}
                                      </a>
                                    </>
                                  ) : ""}
                                </span>
                                <span className="text-xs text-brand-charcoal/40 block">{ped.cliente_email}</span>

                                {/* Badge de acompanhantes */}
                                {Array.isArray(ped.beneficiarios) && ped.beneficiarios.length > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => setPedidoExpandidoId(pedidoExpandidoId === ped.id ? null : ped.id)}
                                    className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-brand-purple/10 text-brand-purple hover:bg-brand-purple/20 transition-colors cursor-pointer"
                                    title="Clique para ver os dados dos acompanhantes"
                                  >
                                    <span>👥 +{ped.beneficiarios.length} acompanhante{ped.beneficiarios.length > 1 ? "s" : ""}</span>
                                    <span className="text-[9px] opacity-70">
                                      {pedidoExpandidoId === ped.id ? "▲" : "▼"}
                                    </span>
                                  </button>
                                )}
                              </td>
                              <td className="px-4 py-3 text-brand-charcoal/70">
                                <div className="flex items-center gap-1">
                                 <span>{ped.produtos?.nome || "—"}</span>
                                 {ped.produtos && ped.produtos.ativo === false && (
                                   <span className="text-[10px] bg-red-100 text-red-600 px-1 py-0.2 rounded font-normal">Inativo</span>
                                 )}
                                </div>
                              </td>
                              <td className="px-4 py-3 font-semibold text-brand-charcoal">
                                R$ {ped.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                              </td>
                              <td className="px-4 py-3 text-brand-charcoal/60 text-xs max-w-[180px] truncate">{ped.motivacao || "—"}</td>
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
                              <td className="px-4 py-3">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => setEditando({
                                      tipo: "pedido",
                                      id: ped.id,
                                      nome: ped.cliente_nome,
                                      email: ped.cliente_email,
                                      telefone: ped.cliente_telefone || "",
                                    })}
                                    className="px-3 py-1.5 text-xs text-brand-charcoal/70 hover:bg-brand-beige rounded-lg border border-brand-beige transition-colors"
                                  >
                                    Editar
                                  </button>
                                  {ped.status === "pendente" && (
                                    <button
                                      onClick={() => setPedidoParaExcluir(ped.id)}
                                      className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
                                    >
                                      Excluir
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>

                            {/* Linha expandida de participantes adicionais */}
                            {Array.isArray(ped.beneficiarios) && ped.beneficiarios.length > 0 && pedidoExpandidoId === ped.id && (
                              <tr className="bg-brand-purple/5 border-b border-brand-beige">
                                <td colSpan={7} className="px-6 py-4">
                                  <div className="bg-white rounded-xl p-4 border border-brand-purple/20 shadow-xs">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-brand-purple mb-2 flex items-center gap-1.5">
                                      <span>👥 Participantes Adicionais vinculados a este pedido ({ped.beneficiarios.length})</span>
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                      {ped.beneficiarios.map((ben, bIdx) => (
                                        <div key={bIdx} className="p-3 rounded-lg bg-brand-offwhite border border-brand-beige/80 text-xs">
                                          <div className="flex items-center justify-between mb-1">
                                            <span className="font-bold text-brand-charcoal">{ben.nome}</span>
                                            <span className="text-[10px] bg-brand-purple/10 text-brand-purple px-1.5 py-0.5 rounded font-medium">
                                              Acompanhante {bIdx + 1}
                                            </span>
                                          </div>
                                          <p className="text-brand-charcoal/60 truncate">{ben.email}</p>
                                          <div className="mt-1.5 pt-1.5 border-t border-brand-beige flex items-center justify-between">
                                            <span className="text-brand-charcoal/50 text-[11px]">WhatsApp:</span>
                                            <a
                                              href={`https://wa.me/${ben.telefone.replace(/\D/g, "").replace(/^0+/, "").replace(/^(55)?/, "55")}`}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-brand-purple font-semibold hover:underline"
                                            >
                                              {ben.telefone}
                                            </a>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                {pedidosTotalPages > 1 && (
                  <div className="flex items-center justify-between mt-4 text-sm">
                    <span className="text-brand-charcoal/50">
                      {pedidosTotal} pedidos — página {pedidosPage} de {pedidosTotalPages}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => fetchPedidos(pedidosPage - 1)}
                        disabled={pedidosPage <= 1}
                        className="px-3 py-1.5 rounded-lg border border-brand-beige text-brand-charcoal/70 hover:bg-brand-beige/50 disabled:opacity-40 transition-colors"
                      >
                        Anterior
                      </button>
                      <button
                        onClick={() => fetchPedidos(pedidosPage + 1)}
                        disabled={pedidosPage >= pedidosTotalPages}
                        className="px-3 py-1.5 rounded-lg border border-brand-beige text-brand-charcoal/70 hover:bg-brand-beige/50 disabled:opacity-40 transition-colors"
                      >
                        Próxima
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Tab: Participantes */}
        {activeTab === "participantes" && (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-semibold text-brand-charcoal">Inscrições</h2>
                <span className="text-xs bg-brand-beige px-2 py-0.5 rounded-full text-brand-charcoal/70">
                  {participantesTotal} {participantesTotal === 1 ? "inscrição" : "inscrições"}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {/* Filtro Status do Produto */}
                <select
                  value={participantesProdutoStatusFiltro}
                  onChange={(e) => {
                    const novoStatus = e.target.value as "todos" | "ativos" | "inativos";
                    setParticipantesProdutoStatusFiltro(novoStatus);
                    let novoProdFiltro = participantesProdutoFiltro;
                    if (novoProdFiltro) {
                      const prod = produtos.find((p) => p.id === novoProdFiltro);
                      if (novoStatus === "ativos" && !prod?.ativo) novoProdFiltro = "";
                      if (novoStatus === "inativos" && prod?.ativo) novoProdFiltro = "";
                    }
                    if (novoProdFiltro !== participantesProdutoFiltro) {
                      setParticipantesProdutoFiltro(novoProdFiltro);
                    }
                    setParticipantesPage(1);
                    void fetchParticipantes(1, novoProdFiltro, novoStatus);
                  }}
                  className="px-3 py-2 border border-brand-beige rounded-lg text-sm bg-white text-brand-charcoal focus-visible:ring-2 focus-visible:ring-brand-purple/30"
                  aria-label="Filtrar status dos produtos em inscrições"
                >
                  <option value="todos">Status: Todos</option>
                  <option value="ativos">Produtos Ativos</option>
                  <option value="inativos">Produtos Inativos</option>
                </select>

                {/* Filtro por Produto */}
                <select
                  value={participantesProdutoFiltro}
                  onChange={(e) => {
                    const novoFiltro = e.target.value;
                    setParticipantesProdutoFiltro(novoFiltro);
                    setParticipantesPage(1);
                    void fetchParticipantes(1, novoFiltro, participantesProdutoStatusFiltro);
                  }}
                  className="px-3 py-2 border border-brand-beige rounded-lg text-sm bg-white text-brand-charcoal focus-visible:ring-2 focus-visible:ring-brand-purple/30 max-w-[200px] truncate"
                  aria-label="Filtrar por produto"
                >
                  <option value="">Todos os produtos</option>
                  {produtosParaInscricoes.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome}{!p.ativo ? " (Inativo)" : ""}
                    </option>
                  ))}
                </select>

                {/* Campo de Busca */}
                <div className="w-full sm:w-56">
                  <input
                    type="search"
                    placeholder="Buscar por nome, e-mail…"
                    value={participantesSearch}
                    onChange={(e) => { setParticipantesSearch(e.target.value); setParticipantesPage(1); fetchParticipantes(1); }}
                    className="w-full px-3 py-2 border border-brand-beige rounded-lg text-sm bg-white focus-visible:ring-2 focus-visible:ring-brand-purple/30"
                    aria-label="Buscar inscrições"
                  />
                </div>

                {/* Botão Gerar Relatório / Lista de Convidados */}
                <button
                  type="button"
                  onClick={handleAbrirRelatorio}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-brand-purple text-white rounded-lg text-sm font-medium hover:bg-brand-purple/90 transition-colors shadow-xs cursor-pointer"
                  title="Gerar lista de convidados para impressão ou PDF"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  <span>Lista de Convidados (PDF)</span>
                </button>
              </div>
            </div>
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
                        <p className="text-xs font-mono text-brand-charcoal/70">CPF: {formatCPF(p.cpf)}</p>
                        <p className="text-xs text-brand-charcoal/40 mt-0.5 flex items-center gap-1">
                          <span>{p.turma_id} · {p.produto || "—"}</span>
                          {p.produto_ativo === false && (
                            <span className="text-[10px] bg-red-100 text-red-600 px-1 py-0.2 rounded font-normal">Inativo</span>
                          )}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        p.status === "pago" ? "bg-green-100 text-green-700" :
                        p.status === "pendente" ? "bg-yellow-100 text-yellow-700" :
                        "bg-gray-100 text-gray-600"
                      }`}>
                        {p.status}
                      </span>
                    </div>
                    <div className="space-y-1 text-xs text-brand-charcoal/60">
                      <p className="truncate">{p.email}</p>
                      {p.telefone ? (
                        <a
                          href={`https://wa.me/${p.telefone.replace(/\D/g, "").replace(/^0+/, "").replace(/^(55)?/, "55")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-brand-purple hover:underline"
                        >
                          {p.telefone}
                        </a>
                      ) : <p className="font-mono">—</p>}
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
                      <th className="text-left px-4 py-3">
                        <SortableHeader
                          key="nome"
                          currentSort={participantesSort}
                          onSort={(k) => { setParticipantesSort(s => s.key === k ? { key: k, dir: s.dir === "asc" ? "desc" : "asc" } : { key: k, dir: "asc" }); fetchParticipantes(1); }}
                        >
                          Nome
                        </SortableHeader>
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-brand-charcoal/70">CPF</th>
                      <th className="text-left px-4 py-3">
                        <SortableHeader
                          key="email"
                          currentSort={participantesSort}
                          onSort={(k) => { setParticipantesSort(s => s.key === k ? { key: k, dir: s.dir === "asc" ? "desc" : "asc" } : { key: k, dir: "asc" }); fetchParticipantes(1); }}
                        >
                          E-mail
                        </SortableHeader>
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-brand-charcoal/70">WhatsApp</th>
                      <th className="text-left px-4 py-3 font-medium text-brand-charcoal/70">Produto</th>
                      <th className="text-left px-4 py-3 font-medium text-brand-charcoal/70 hidden md:table-cell">Motivação</th>
                      <th className="text-left px-4 py-3 font-medium text-brand-charcoal/70 hidden lg:table-cell">Pagamento</th>
                      <th className="text-left px-4 py-3">
                        <SortableHeader
                          key="status"
                          currentSort={participantesSort}
                          onSort={(k) => { setParticipantesSort(s => s.key === k ? { key: k, dir: s.dir === "asc" ? "desc" : "asc" } : { key: k, dir: "asc" }); fetchParticipantes(1); }}
                        >
                          Status
                        </SortableHeader>
                      </th>
                      <th className="text-left px-4 py-3">
                        <SortableHeader
                          key="created_at"
                          currentSort={participantesSort}
                          onSort={(k) => { setParticipantesSort(s => s.key === k ? { key: k, dir: s.dir === "asc" ? "desc" : "asc" } : { key: k, dir: "asc" }); fetchParticipantes(1); }}
                        >
                          Data
                        </SortableHeader>
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-brand-charcoal/70">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participantes.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="text-center py-12 text-brand-charcoal/40">
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
                          <td className="px-4 py-3 font-mono text-xs text-brand-charcoal/80 whitespace-nowrap">
                            {formatCPF(p.cpf)}
                          </td>
                          <td className="px-4 py-3 text-brand-charcoal/70">{p.email}</td>
                          <td className="px-4 py-3 font-mono text-xs">
                            {p.telefone ? (
                              <a
                                href={`https://wa.me/${p.telefone.replace(/\D/g, "").replace(/^0+/, "").replace(/^(55)?/, "55")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-brand-purple hover:underline"
                              >
                                {p.telefone}
                              </a>
                            ) : "—"}
                          </td>
                          <td className="px-4 py-3 text-brand-charcoal/70 text-xs">
                            <div className="flex items-center gap-1">
                              <span>{p.produto || "—"}</span>
                              {p.produto_ativo === false && (
                                <span className="text-[10px] bg-red-100 text-red-600 px-1 py-0.2 rounded font-normal">Inativo</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-brand-charcoal/60 text-xs max-w-[200px] truncate hidden md:table-cell">
                            {p.motivacao || "—"}
                          </td>
                          <td className="px-4 py-3 hidden lg:table-cell">
                            <span className="text-xs bg-brand-beige px-2 py-0.5 rounded-full text-brand-charcoal/70">
                              {p.metodo_pagamento?.toUpperCase() || "—"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              p.status === "pago" ? "bg-green-100 text-green-700" :
                              p.status === "pendente" ? "bg-yellow-100 text-yellow-700" :
                              "bg-gray-100 text-gray-600"
                            }`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-brand-charcoal/50 text-xs hidden sm:table-cell">{formatDate(p.created_at)}</td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => setEditando({
                                tipo: "participante",
                                id: p.id,
                                nome: p.nome,
                                email: p.email,
                                telefone: p.telefone || "",
                              })}
                              className="px-3 py-1.5 text-xs text-brand-charcoal/70 hover:bg-brand-beige rounded-lg border border-brand-beige transition-colors"
                            >
                              Editar
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            {participantesTotalPages > 1 && (
              <div className="flex items-center justify-between mt-4 text-sm">
                <span className="text-brand-charcoal/50">
                  {participantesTotal} participantes — página {participantesPage} de {participantesTotalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => fetchParticipantes(participantesPage - 1)}
                    disabled={participantesPage <= 1}
                    className="px-3 py-1.5 rounded-lg border border-brand-beige text-brand-charcoal/70 hover:bg-brand-beige/50 disabled:opacity-40 transition-colors"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => fetchParticipantes(participantesPage + 1)}
                    disabled={participantesPage >= participantesTotalPages}
                    className="px-3 py-1.5 rounded-lg border border-brand-beige text-brand-charcoal/70 hover:bg-brand-beige/50 disabled:opacity-40 transition-colors"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            )}
            {participantesTotal > 0 && (
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

        {/* Tab: Cupons */}
        {activeTab === "cupons" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-brand-charcoal">Cupons de Desconto</h2>
                <p className="text-xs text-brand-charcoal/50">Crie e gerencie cupons aplicáveis no checkout</p>
              </div>
              <button
                onClick={() => {
                  setCupomEditando(null);
                  setCupomForm({
                    codigo: "",
                    tipo: "porcentagem",
                    valor: "",
                    quantidade_maxima: "",
                    valor_minimo_pedido: "",
                    validade: "",
                    ativo: true,
                  });
                  setShowCupomModal(true);
                }}
                className="px-4 py-2 bg-brand-purple text-white text-sm font-medium rounded-lg hover:bg-brand-purple-dark transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                + Novo Cupom
              </button>
            </div>

            {cupomSucesso && (
              <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
                {cupomSucesso}
              </div>
            )}

            <div className="bg-white rounded-xl border border-brand-beige overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-brand-beige-light border-b border-brand-beige text-xs font-semibold text-brand-charcoal/70 uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Código</th>
                      <th className="px-4 py-3">Desconto</th>
                      <th className="px-4 py-3">Utilizações</th>
                      <th className="px-4 py-3">Mínimo</th>
                      <th className="px-4 py-3">Validade</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-beige">
                    {cupons.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-brand-charcoal/50 text-sm">
                          Nenhum cupom cadastrado ainda. Clique em "+ Novo Cupom" para criar o primeiro.
                        </td>
                      </tr>
                    ) : (
                      cupons.map((c) => {
                        const expirado = c.validade && new Date(c.validade) < new Date();
                        const esgotado = c.quantidade_maxima != null && c.quantidade_utilizada >= c.quantidade_maxima;
                        return (
                          <tr key={c.id} className="hover:bg-brand-beige-light/40 transition-colors">
                            <td className="px-4 py-3 font-mono font-bold text-brand-purple text-sm">
                              {c.codigo}
                            </td>
                            <td className="px-4 py-3 font-medium text-brand-charcoal">
                              {c.tipo === "porcentagem" ? `${c.valor}%` : `R$ ${Number(c.valor).toFixed(2)}`}
                            </td>
                            <td className="px-4 py-3 text-brand-charcoal/70 text-xs">
                              {c.quantidade_utilizada || 0} / {c.quantidade_maxima ? c.quantidade_maxima : "ilimitado"}
                            </td>
                            <td className="px-4 py-3 text-brand-charcoal/70 text-xs">
                              {Number(c.valor_minimo_pedido) > 0 ? `R$ ${Number(c.valor_minimo_pedido).toFixed(2)}` : "—"}
                            </td>
                            <td className="px-4 py-3 text-brand-charcoal/60 text-xs">
                              {c.validade ? formatDate(c.validade) : "Sem expiração"}
                              {expirado && <span className="ml-1 text-red-500 font-semibold">(Expirado)</span>}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                  !c.ativo
                                    ? "bg-gray-100 text-gray-600"
                                    : esgotado
                                    ? "bg-amber-100 text-amber-800"
                                    : expirado
                                    ? "bg-red-100 text-red-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {!c.ativo ? "Inativo" : esgotado ? "Esgotado" : expirado ? "Expirado" : "Ativo"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleToggleCupomAtivo(c)}
                                  className="px-2.5 py-1 text-xs border border-brand-beige rounded-lg hover:bg-brand-beige text-brand-charcoal/70 transition-colors"
                                >
                                  {c.ativo ? "Desativar" : "Ativar"}
                                </button>
                                <button
                                  onClick={() => {
                                    setCupomEditando(c);
                                    setCupomForm({
                                      codigo: c.codigo,
                                      tipo: c.tipo,
                                      valor: c.valor.toString(),
                                      quantidade_maxima: c.quantidade_maxima ? c.quantidade_maxima.toString() : "",
                                      valor_minimo_pedido: c.valor_minimo_pedido ? c.valor_minimo_pedido.toString() : "",
                                      validade: c.validade ? c.validade.slice(0, 16) : "",
                                      ativo: c.ativo,
                                    });
                                    setShowCupomModal(true);
                                  }}
                                  className="px-2.5 py-1 text-xs border border-brand-beige rounded-lg hover:bg-brand-beige text-brand-purple transition-colors"
                                >
                                  Editar
                                </button>
                                <button
                                  onClick={() => handleExcluirCupom(c.id)}
                                  className="px-2.5 py-1 text-xs border border-red-200 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  Excluir
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Usuários */}
        {activeTab === "usuarios" && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-base font-semibold text-brand-charcoal">Usuários / Clientes</h2>
                <p className="text-xs text-brand-charcoal/50">Clientes cadastrados no sistema com dados de acesso e entrega</p>
              </div>

              {/* Busca */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={usuariosSearch}
                  onChange={(e) => setUsuariosSearch(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") fetchUsuarios(1); }}
                  placeholder="Buscar por nome, e-mail ou CPF..."
                  className="px-3.5 py-2 text-xs border border-brand-beige rounded-lg bg-white w-64 focus-visible:border-brand-purple outline-none"
                />
                <button
                  onClick={() => fetchUsuarios(1)}
                  className="px-3 py-2 bg-brand-purple text-white text-xs font-medium rounded-lg hover:bg-brand-purple-dark transition-colors"
                >
                  Buscar
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-brand-beige overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-brand-beige-light border-b border-brand-beige text-xs font-semibold text-brand-charcoal/70 uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Cliente</th>
                      <th className="px-4 py-3">Contato</th>
                      <th className="px-4 py-3">Cidade / UF</th>
                      <th className="px-4 py-3 text-center">Pedidos</th>
                      <th className="px-4 py-3">Produtos Comprados</th>
                      <th className="px-4 py-3">Cadastro</th>
                      <th className="px-4 py-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-beige">
                    {usuarios.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-brand-charcoal/50 text-sm">
                          Nenhum usuário encontrado.
                        </td>
                      </tr>
                    ) : (
                      usuarios.map((u) => (
                        <tr key={u.id} className="hover:bg-brand-beige-light/40 transition-colors">
                          <td className="px-4 py-3">
                            <p className="font-semibold text-brand-charcoal text-sm">{u.nome}</p>
                            <p className="text-xs text-brand-charcoal/40 font-mono">CPF: {u.cpf}</p>
                          </td>
                          <td className="px-4 py-3 text-xs">
                            <p className="text-brand-purple font-medium">{u.email}</p>
                            <p className="text-brand-charcoal/60">{u.telefone}</p>
                          </td>
                          <td className="px-4 py-3 text-xs text-brand-charcoal/70">
                            <p>{u.cidade} - {u.uf}</p>
                            <p className="text-brand-charcoal/40 font-mono">CEP {u.cep}</p>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-brand-beige text-brand-charcoal">
                              {u.total_pedidos || 0}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs">
                            {u.produtos_comprados && u.produtos_comprados.length > 0 ? (
                              <div className="flex flex-col gap-1 max-w-[220px]">
                                {u.produtos_comprados.map((prod: any, i: number) => (
                                  <span
                                    key={i}
                                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-brand-beige text-brand-charcoal text-[11px] font-medium truncate"
                                    title={`${prod.quantidade}× ${prod.nome}`}
                                  >
                                    <span className="font-bold text-brand-purple">{prod.quantidade}×</span>
                                    <span className="truncate">{prod.nome}</span>
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-brand-charcoal/40 italic">Nenhum</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-xs text-brand-charcoal/50">
                            {formatDate(u.created_at)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleVerDetalhesUsuario(u)}
                                className="px-2.5 py-1 text-xs border border-brand-beige rounded-lg hover:bg-brand-beige text-brand-charcoal transition-colors"
                              >
                                Ver Detalhes
                              </button>
                              <button
                                onClick={() => {
                                  setUsuarioParaReset(u);
                                  setNovaSenhaInput("");
                                  setResetSenhaSucesso("");
                                }}
                                className="px-2.5 py-1 text-xs border border-brand-purple/30 text-brand-purple hover:bg-brand-purple/5 rounded-lg transition-colors"
                              >
                                Resetar Senha
                              </button>
                              <button
                                onClick={() => setUsuarioParaExcluir(u)}
                                className="px-2.5 py-1 text-xs border border-red-200 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                Excluir
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Paginação */}
            {usuariosTotalPages > 1 && (
              <div className="flex items-center justify-between mt-4 text-sm">
                <span className="text-brand-charcoal/50">
                  {usuariosTotal} usuários — página {usuariosPage} de {usuariosTotalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => fetchUsuarios(usuariosPage - 1)}
                    disabled={usuariosPage <= 1}
                    className="px-3 py-1.5 rounded-lg border border-brand-beige text-brand-charcoal/70 hover:bg-brand-beige/50 disabled:opacity-40 transition-colors"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => fetchUsuarios(usuariosPage + 1)}
                    disabled={usuariosPage >= usuariosTotalPages}
                    className="px-3 py-1.5 rounded-lg border border-brand-beige text-brand-charcoal/70 hover:bg-brand-beige/50 disabled:opacity-40 transition-colors"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>


      {/* Modal de edição de contato */}
      {editando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" style={{ overscrollBehavior: "contain" }} role="dialog" aria-modal="true" aria-label="Editar contato" onKeyDown={(e) => { if (e.key === "Escape") setEditando(null); }}>
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-base font-semibold text-brand-charcoal mb-1">
              Editar {editando.tipo === "pedido" ? "cliente" : "participante"}
            </h3>
            <p className="text-xs text-brand-charcoal/50 mb-4">
              Atualize os dados de contato. Compras novas capturam automaticamente da InfinitePay.
            </p>
            <div className="space-y-3 mb-5">
              <div>
                <label className="text-xs font-medium text-brand-charcoal/70 block mb-1">Nome</label>
<input
                   type="text"
                   value={editando.nome}
                   onChange={(e) => setEditando({ ...editando, nome: e.target.value })}
                   className="w-full border border-brand-beige rounded-lg px-3 py-2 text-sm focus-visible:border-brand-purple"
                 />
              </div>
              <div>
                <label className="text-xs font-medium text-brand-charcoal/70 block mb-1">E-mail</label>
<input
                   type="email"
                   value={editando.email}
                   onChange={(e) => setEditando({ ...editando, email: e.target.value })}
                   className="w-full border border-brand-beige rounded-lg px-3 py-2 text-sm focus-visible:border-brand-purple"
                 />
              </div>
              <div>
                <label className="text-xs font-medium text-brand-charcoal/70 block mb-1">WhatsApp</label>
<input
                   type="text"
                   value={editando.telefone}
                   onChange={(e) => setEditando({ ...editando, telefone: e.target.value })}
                   className="w-full border border-brand-beige rounded-lg px-3 py-2 text-sm focus-visible:border-brand-purple"
                 />
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setEditando(null)}
                className="px-4 py-2 text-sm text-brand-charcoal/60 hover:text-brand-charcoal transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSalvarEdicao}
                disabled={salvandoEdicao || !editando.nome.trim() || !editando.email.trim()}
                className="px-4 py-2 text-sm bg-brand-purple text-white rounded-lg hover:bg-brand-purple-dark disabled:opacity-50 transition-colors"
              >
                {salvandoEdicao ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmação */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" style={{ overscrollBehavior: "contain" }} role="dialog" aria-modal="true" aria-label="Confirmar limpeza" onKeyDown={(e) => { if (e.key === "Escape") setShowConfirm(false); }}>
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-base font-semibold text-brand-charcoal mb-2">Limpar todos os dados?</h3>
            <p className="text-sm text-brand-charcoal/60 mb-5">
              Todos os {participantesTotal} participantes serão removidos permanentemente.
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

      {/* Modal de confirmação de exclusão de pedido */}
      {pedidoParaExcluir && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" style={{ overscrollBehavior: "contain" }} role="dialog" aria-modal="true" aria-label="Confirmar exclusão" onKeyDown={(e) => { if (e.key === "Escape") setPedidoParaExcluir(null); }}>
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-base font-semibold text-brand-charcoal mb-2">Excluir transação pendente?</h3>
            <p className="text-sm text-brand-charcoal/60 mb-5">
              Esta ação excluirá permanentemente o pedido e quaisquer inscrições associadas. Deseja continuar?
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setPedidoParaExcluir(null)} className="px-4 py-2 text-sm text-brand-charcoal/60 hover:text-brand-charcoal transition-colors">
                Cancelar
              </button>
              <button onClick={handleExcluirPedido} disabled={excluindoPedido} className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors">
                {excluindoPedido ? "Excluindo..." : "Excluir permanentemente"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmação de exclusão permanente de produto */}
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

      {/* Modal Criar / Editar Cupom */}
      {showCupomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" style={{ overscrollBehavior: "contain" }} role="dialog" aria-modal="true" aria-label="Cupom" onKeyDown={(e) => { if (e.key === "Escape") setShowCupomModal(false); }}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-base font-semibold text-brand-charcoal mb-4">
              {cupomEditando ? "Editar Cupom" : "Novo Cupom de Desconto"}
            </h3>
            <form onSubmit={handleSalvarCupom} className="space-y-3.5">
              <div>
                <label className="text-xs font-medium text-brand-charcoal/70 block mb-1">Código do Cupom *</label>
                <input
                  type="text"
                  required
                  value={cupomForm.codigo}
                  onChange={(e) => setCupomForm({ ...cupomForm, codigo: e.target.value.toUpperCase() })}
                  placeholder="EX: PROMO10"
                  className="w-full border border-brand-beige rounded-lg px-3 py-2 text-sm uppercase font-mono font-bold focus-visible:border-brand-purple"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-brand-charcoal/70 block mb-1">Tipo de Desconto</label>
                  <select
                    value={cupomForm.tipo}
                    onChange={(e) => setCupomForm({ ...cupomForm, tipo: e.target.value as "porcentagem" | "fixo" })}
                    className="w-full border border-brand-beige rounded-lg px-3 py-2 text-sm focus-visible:border-brand-purple"
                  >
                    <option value="porcentagem">Porcentagem (%)</option>
                    <option value="fixo">Valor Fixo (R$)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-brand-charcoal/70 block mb-1">
                    Valor {cupomForm.tipo === "porcentagem" ? "(%)" : "(R$)"} *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={cupomForm.valor}
                    onChange={(e) => setCupomForm({ ...cupomForm, valor: e.target.value })}
                    placeholder={cupomForm.tipo === "porcentagem" ? "10" : "20.00"}
                    className="w-full border border-brand-beige rounded-lg px-3 py-2 text-sm focus-visible:border-brand-purple"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-brand-charcoal/70 block mb-1">Quantidade Máxima</label>
                  <input
                    type="number"
                    min="1"
                    value={cupomForm.quantidade_maxima}
                    onChange={(e) => setCupomForm({ ...cupomForm, quantidade_maxima: e.target.value })}
                    placeholder="Ilimitado"
                    className="w-full border border-brand-beige rounded-lg px-3 py-2 text-sm focus-visible:border-brand-purple"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-brand-charcoal/70 block mb-1">Pedido Mínimo (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={cupomForm.valor_minimo_pedido}
                    onChange={(e) => setCupomForm({ ...cupomForm, valor_minimo_pedido: e.target.value })}
                    placeholder="0.00"
                    className="w-full border border-brand-beige rounded-lg px-3 py-2 text-sm focus-visible:border-brand-purple"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-brand-charcoal/70 block mb-1">Data e Hora de Validade</label>
                <input
                  type="datetime-local"
                  value={cupomForm.validade}
                  onChange={(e) => setCupomForm({ ...cupomForm, validade: e.target.value })}
                  className="w-full border border-brand-beige rounded-lg px-3 py-2 text-sm focus-visible:border-brand-purple"
                />
                <span className="text-[10px] text-brand-charcoal/40 mt-0.5 block">Deixe em branco para não expirar</span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="cupom-ativo"
                  checked={cupomForm.ativo}
                  onChange={(e) => setCupomForm({ ...cupomForm, ativo: e.target.checked })}
                  className="rounded border-brand-beige text-brand-purple focus:ring-brand-purple"
                />
                <label htmlFor="cupom-ativo" className="text-xs font-medium text-brand-charcoal cursor-pointer">
                  Cupom Ativo para uso
                </label>
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t border-brand-beige">
                <button
                  type="button"
                  onClick={() => setShowCupomModal(false)}
                  className="px-4 py-2 text-xs text-brand-charcoal/60 hover:text-brand-charcoal transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvandoCupom}
                  className="px-4 py-2 text-xs bg-brand-purple text-white rounded-lg hover:bg-brand-purple-dark disabled:opacity-50 transition-colors"
                >
                  {salvandoCupom ? "Salvando..." : "Salvar Cupom"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detalhes do Usuário */}
      {usuarioDetalhes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" style={{ overscrollBehavior: "contain" }} role="dialog" aria-modal="true" aria-label="Detalhes do usuário" onKeyDown={(e) => { if (e.key === "Escape") setUsuarioDetalhes(null); }}>
          <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-brand-beige">
              <div>
                <h3 className="text-base font-semibold text-brand-charcoal">{usuarioDetalhes.usuario.nome}</h3>
                <p className="text-xs text-brand-charcoal/50">Cadastrado em {formatDate(usuarioDetalhes.usuario.created_at)}</p>
              </div>
              <button onClick={() => setUsuarioDetalhes(null)} className="text-brand-charcoal/40 hover:text-brand-charcoal text-lg font-bold">
                &times;
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-brand-beige-light p-3.5 rounded-lg space-y-1.5">
                <h4 className="font-semibold text-brand-charcoal uppercase tracking-wider text-[11px] text-brand-purple">Dados de Acesso e Contato</h4>
                <p><strong>E-mail:</strong> {usuarioDetalhes.usuario.email}</p>
                <p><strong>Telefone / WhatsApp:</strong> {usuarioDetalhes.usuario.telefone}</p>
                <p><strong>CPF:</strong> {usuarioDetalhes.usuario.cpf}</p>
              </div>

              <div className="bg-brand-beige-light p-3.5 rounded-lg space-y-1.5">
                <h4 className="font-semibold text-brand-charcoal uppercase tracking-wider text-[11px] text-brand-purple">Endereço Completo</h4>
                <p><strong>Logradouro:</strong> {usuarioDetalhes.usuario.rua}, {usuarioDetalhes.usuario.numero}</p>
                {usuarioDetalhes.usuario.complemento && <p><strong>Complemento:</strong> {usuarioDetalhes.usuario.complemento}</p>}
                <p><strong>Bairro:</strong> {usuarioDetalhes.usuario.bairro}</p>
                <p><strong>Cidade/UF:</strong> {usuarioDetalhes.usuario.cidade} - {usuarioDetalhes.usuario.uf}</p>
                <p><strong>CEP:</strong> {usuarioDetalhes.usuario.cep}</p>
              </div>

              <div className="bg-brand-beige-light p-3.5 rounded-lg space-y-1.5">
                <h4 className="font-semibold text-brand-charcoal uppercase tracking-wider text-[11px] text-brand-purple">
                  Produtos Comprados ({usuarioDetalhes.produtos_comprados?.length || 0})
                </h4>
                {usuarioDetalhes.produtos_comprados && usuarioDetalhes.produtos_comprados.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {usuarioDetalhes.produtos_comprados.map((p: any, i: number) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-brand-beige text-brand-charcoal text-xs shadow-xs"
                      >
                        <span className="font-bold text-brand-purple">{p.quantidade}×</span>
                        <span>{p.nome}</span>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-brand-charcoal/50 italic py-1">Nenhum produto adquirido ainda.</p>
                )}
              </div>

              <div>
                <h4 className="font-semibold text-brand-charcoal mb-2 uppercase tracking-wider text-[11px] text-brand-purple">
                  Histórico de Pedidos ({usuarioDetalhes.pedidos.length})
                </h4>
                {usuarioDetalhes.pedidos.length === 0 ? (
                  <p className="text-brand-charcoal/50 italic py-2">Nenhum pedido realizado ainda.</p>
                ) : (
                  <div className="space-y-2">
                    {usuarioDetalhes.pedidos.map((ped: any) => (
                      <div key={ped.id} className="p-2.5 border border-brand-beige rounded-lg flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-brand-charcoal">
                            {Array.isArray(ped.itens) && ped.itens.length > 0
                              ? ped.itens.map((it: any) => `${it.nome} (${it.quantidade}×)`).join(", ")
                              : ped.produtos?.nome || "Pedido E-commerce"}
                          </p>
                          <p className="text-[10px] text-brand-charcoal/50 font-mono">
                            {formatDate(ped.created_at)} — {ped.order_nsu}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-brand-purple">R$ {Number(ped.valor).toFixed(2)}</p>
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold ${ped.status === "pago" ? "bg-brand-mint/20 text-brand-mint-dark" : "bg-brand-terracotta/20 text-brand-terracotta-dark"}`}>
                            {ped.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-brand-beige flex justify-end">
              <button
                onClick={() => setUsuarioDetalhes(null)}
                className="px-4 py-2 text-xs bg-brand-beige hover:bg-brand-beige-dark text-brand-charcoal rounded-lg transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Reset de Senha pelo Admin */}
      {usuarioParaReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" style={{ overscrollBehavior: "contain" }} role="dialog" aria-modal="true" aria-label="Resetar Senha" onKeyDown={(e) => { if (e.key === "Escape") setUsuarioParaReset(null); }}>
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-base font-semibold text-brand-charcoal mb-1">Resetar Senha</h3>
            <p className="text-xs text-brand-charcoal/60 mb-4">
              Defina uma nova senha para <strong>{usuarioParaReset.nome}</strong> ({usuarioParaReset.email}):
            </p>

            {resetSenhaSucesso ? (
              <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded-lg mb-4">
                {resetSenhaSucesso}
              </div>
            ) : (
              <form onSubmit={handleResetarSenha} className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-brand-charcoal/70 block mb-1">Nova Senha *</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={novaSenhaInput}
                    onChange={(e) => setNovaSenhaInput(e.target.value)}
                    placeholder="Mínimo de 6 caracteres"
                    className="w-full border border-brand-beige rounded-lg px-3 py-2 text-sm focus-visible:border-brand-purple"
                  />
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setUsuarioParaReset(null)}
                    className="px-4 py-2 text-xs text-brand-charcoal/60 hover:text-brand-charcoal transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={resetandoSenha || novaSenhaInput.length < 6}
                    className="px-4 py-2 text-xs bg-brand-purple text-white rounded-lg hover:bg-brand-purple-dark disabled:opacity-50 transition-colors"
                  >
                    {resetandoSenha ? "Salvando..." : "Salvar Nova Senha"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal Ajustar Contador Manual de Vagas */}
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
                    ? `${ajustandoContador.produto.vagas_ocupadas_manual} preenchidas (Manual)`
                    : "Automático (via inscrições)"}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-medium text-brand-charcoal/80 mb-1">
                Vagas Preenchidas na Página
              </label>
              <input
                type="number"
                min="0"
                value={ajustandoContador.valor}
                onChange={(e) =>
                  setAjustandoContador({ ...ajustandoContador, valor: e.target.value })
                }
                placeholder="Deixe vazio para automático"
                className="w-full px-3 py-2 border border-brand-beige rounded-lg text-sm focus-visible:ring-2 focus-visible:ring-brand-purple/30"
                autoFocus
              />
              <p className="text-[11px] text-brand-charcoal/50 mt-1.5 leading-normal">
                Digite quantas vagas devem aparecer como ocupadas. Se deixar em branco, o sistema volta a contar as inscrições pagas reais.
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

      {/* Modal Confirmar Exclusão de Usuário */}
      {usuarioParaExcluir && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" style={{ overscrollBehavior: "contain" }} role="dialog" aria-modal="true" aria-label="Confirmar exclusão de usuário" onKeyDown={(e) => { if (e.key === "Escape") setUsuarioParaExcluir(null); }}>
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-base font-semibold text-brand-charcoal mb-2">Excluir usuário?</h3>
            <p className="text-xs text-brand-charcoal/60 mb-5 leading-relaxed">
              Deseja realmente remover <strong>{usuarioParaExcluir.nome}</strong> ({usuarioParaExcluir.email})? O cadastro será excluído, mas o histórico financeiro dos pedidos continuará preservado no sistema.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setUsuarioParaExcluir(null)}
                className="px-4 py-2 text-xs text-brand-charcoal/60 hover:text-brand-charcoal transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleExcluirUsuario}
                disabled={excluindoUsuario}
                className="px-4 py-2 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {excluindoUsuario ? "Excluindo..." : "Sim, excluir usuário"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal / Visualização de Relatório - Lista de Convidados Casa 52 */}
      {showRelatorioModal && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 print:p-0 print:bg-white print:static print:inset-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Lista de convidados para Casa 52"
          onKeyDown={(e) => { if (e.key === "Escape") setShowRelatorioModal(false); }}
        >
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-brand-beige overflow-hidden print:border-none print:shadow-none print:max-w-none print:max-h-none print:w-full print:rounded-none">
            {/* Barra de Ações do Modal (oculta na impressão) */}
            <div className="no-print p-4 border-b border-brand-beige bg-brand-beige-light/70 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">📄</span>
                <div>
                  <h3 className="text-sm font-bold text-brand-charcoal">Lista de Convidados · Casa 52</h3>
                  <p className="text-xs text-brand-charcoal/60">Controle de entrada e recepção dos participantes</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Selecionar Produto dentro do modal */}
                <select
                  value={relatorioProdutoId}
                  onChange={(e) => {
                    const newId = e.target.value;
                    setRelatorioProdutoId(newId);
                    void carregarRelatorio(newId, relatorioApenasPagos);
                  }}
                  className="px-2.5 py-1.5 border border-brand-beige rounded-lg text-xs bg-white font-medium text-brand-charcoal focus-visible:ring-2 focus-visible:ring-brand-purple/30 max-w-[180px] truncate"
                  aria-label="Filtrar por produto no relatório"
                >
                  <option value="">Todos os produtos</option>
                  {produtos.map((prod) => (
                    <option key={prod.id} value={prod.id}>
                      {prod.nome}
                    </option>
                  ))}
                </select>

                {/* Toggle Apenas Pagos */}
                <label className="flex items-center gap-1.5 text-xs text-brand-charcoal cursor-pointer bg-white px-2.5 py-1.5 rounded-lg border border-brand-beige select-none">
                  <input
                    type="checkbox"
                    checked={relatorioApenasPagos}
                    onChange={(e) => {
                      const novoVal = e.target.checked;
                      setRelatorioApenasPagos(novoVal);
                      void carregarRelatorio(relatorioProdutoId, novoVal);
                    }}
                    className="rounded text-brand-purple focus:ring-brand-purple"
                  />
                  <span>Apenas confirmados</span>
                </label>

                {/* Botão Imprimir / Salvar em PDF */}
                <button
                  type="button"
                  onClick={() => window.print()}
                  disabled={relatorioCarregando || relatorioParticipantes.length === 0}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-purple text-white rounded-lg text-xs font-semibold hover:bg-brand-purple/90 transition-colors disabled:opacity-50 shadow-xs cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  <span>Imprimir / PDF</span>
                </button>

                {/* Fechar */}
                <button
                  type="button"
                  onClick={() => setShowRelatorioModal(false)}
                  className="px-3 py-1.5 border border-brand-beige hover:bg-brand-beige/30 rounded-lg text-xs font-medium text-brand-charcoal transition-colors cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            </div>

            {/* Visualização da Folha / Conteúdo Impresso */}
            <div className="overflow-y-auto p-6 print:p-0 print:overflow-visible flex-1 bg-neutral-100/60 print:bg-white">
              <div
                id="relatorio-impressao"
                className="bg-white text-black p-8 rounded-xl shadow-xs border border-gray-200 print:shadow-none print:border-none print:p-0 max-w-3xl mx-auto print:max-w-none print:w-full"
              >
                {/* Cabeçalho Oficial Conforme Requisitos */}
                <div className="border-b-2 border-black pb-4 mb-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-2xl font-bold tracking-tight text-black uppercase">
                        Lista de convidados para Casa 52
                      </h1>
                    </div>
                    <div className="text-right text-xs text-gray-500 font-mono">
                      <p>Emissão: {new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                  </div>

                  {/* Total de Convidados */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-300 text-xs">
                    <div>
                      <span className="text-gray-500">Total de Convidados: </span>
                      <strong className="font-bold text-sm text-black">
                        {relatorioParticipantes.length} {relatorioParticipantes.length === 1 ? "pessoa" : "pessoas"}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Tabela de Convidados com Nome e Sobrenome + CPF */}
                {relatorioCarregando ? (
                  <div className="text-center py-12 text-gray-400 text-sm">Carregando convidados...</div>
                ) : relatorioParticipantes.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 text-sm border border-dashed border-gray-300 rounded-lg">
                    Nenhum participante encontrado para este filtro.
                  </div>
                ) : (
                  <div className="border border-black overflow-hidden">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-100 border-b border-black text-black">
                          <th className="py-2.5 px-2 w-12 text-center font-bold border-r border-black">#</th>
                          <th className="py-2.5 px-3 font-bold border-r border-black">Nome e Sobrenome</th>
                          <th className="py-2.5 px-3 w-44 font-bold border-r border-black">CPF</th>
                          <th className="py-2.5 px-3 w-64 text-center font-bold">Observação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-300">
                        {relatorioParticipantes.map((part, idx) => (
                          <tr key={part.id} className="hover:bg-gray-50 print:hover:bg-transparent">
                            <td className="py-2.5 px-2 text-center text-gray-500 font-mono border-r border-gray-300">
                              {String(idx + 1).padStart(2, "0")}
                            </td>
                            <td className="py-2.5 px-3 font-semibold text-black border-r border-gray-300">
                              {part.nome}
                            </td>
                            <td className="py-2.5 px-3 font-mono text-black whitespace-nowrap border-r border-gray-300">
                              {formatCPF(part.cpf)}
                            </td>
                            <td className="py-2.5 px-3 border-gray-300">
                              <div className="h-6 flex items-end justify-center">
                                <span className="w-full border-b border-gray-300 block"></span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Rodapé da folha impressa */}
                <div className="mt-6 pt-3 border-t border-gray-300 flex justify-between items-center text-[10px] text-gray-500">
                  <span>Casa 52</span>
                  <span>Lista oficial de convidados para entrada</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
