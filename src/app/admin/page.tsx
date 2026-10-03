"use client";

import { useState, useEffect, useCallback, Fragment } from "react";
import { Mail, Menu, Copy, Check, MessageCircle, ExternalLink, KeyRound, CheckCircle2 } from "lucide-react";
import type { Produto, Pedido, Participante, Cupom, Usuario } from "@/lib/types";
import { isProdutoAgendamento } from "@/lib/agendamento";
import AdminDashboard from "./components/AdminDashboard";
import AdminAgenda from "./components/AdminAgenda";
import AdminToastNotification from "./components/AdminToastNotification";
import AdminManual from "./components/AdminManual";
import AdminSidebar from "./components/AdminSidebar";
import AdminAlterarSenhaModal from "./components/AdminAlterarSenhaModal";
import AdminAvaliacoesYinYang from "./components/AdminAvaliacoesYinYang";
import { FOTO_FACILITADORA_PADRAO } from "@/lib/config";
import type { Paginated, Tab } from "./lib/types";
import { slugify, FAQ_PADRAO_ADMIN, DURACAO_CHIPS, formatDuracao, formatDate, formatCPF } from "./lib/format";
import SortableHeader from "./components/ui/SortableHeader";
import AdminCupons from "./components/AdminCupons";
import AdminUsuarios from "./components/AdminUsuarios";
import AdminSobre from "./components/AdminSobre";
import AdminProdutos from "./components/AdminProdutos";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newAppointmentsCount, setNewAppointmentsCount] = useState(0);
  const [error, setError] = useState("");

  // Auth
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [modalSenhaOpen, setModalSenhaOpen] = useState(false);

  // Produtos
  const [produtos, setProdutos] = useState<Produto[]>([]);

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
  const [pedidosStatusFiltro, setPedidosStatusFiltro] = useState<"todos" | "pago" | "pendente" | "cancelado">("todos");
  const [pedidosTotaisStatus, setPedidosTotaisStatus] = useState<{ todos: number; pago: number; pendente: number; cancelado: number }>({ todos: 0, pago: 0, pendente: 0, cancelado: 0 });

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

  // Cupons
  const [cupons, setCupons] = useState<Cupom[]>([]);

  // Usuários
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuariosPage, setUsuariosPage] = useState(1);
  const [usuariosTotalPages, setUsuariosTotalPages] = useState(1);
  const [usuariosTotal, setUsuariosTotal] = useState(0);
  const [usuariosSearch, setUsuariosSearch] = useState("");

  // Avaliações Yin/Yang & Agendamentos (Contadores do Sidebar)
  const [avaliacoesTotal, setAvaliacoesTotal] = useState(0);
  const [agendamentosTotal, setAgendamentosTotal] = useState(0);

  const fetchAvaliacoesTotal = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/avaliacoes-yin-yang?perPage=1");
      if (res.ok) {
        const json = await res.json();
        setAvaliacoesTotal(json.totalGeral ?? json.total ?? 0);
      }
    } catch {
      // Ignora silenciosamente
    }
  }, []);

  const fetchAgendamentosTotal = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/agendamentos");
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json)) {
          setAgendamentosTotal(json.length);
        } else if (json && json.data && Array.isArray(json.data)) {
          setAgendamentosTotal(json.total ?? json.data.length);
        }
      }
    } catch {
      // Ignora silenciosamente
    }
  }, []);

  const checkAuth = useCallback(async () => {
    const res = await fetch("/api/admin/verify");
    if (res.ok) {
      setAuthed(true);
    } else {
      setAuthed(false);
    }
    setLoading(false);
  }, []);

  const fetchProdutos = async () => {
    const res = await fetch("/api/admin/produtos");
    if (res.ok) setProdutos(await res.json());
  };

  const fetchPedidos = useCallback(
    async (
      page = pedidosPage,
      prodStatus = pedidosProdutoStatusFiltro,
      prodId = pedidosProdutoFiltro,
      statusFiltro = pedidosStatusFiltro
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
      if (statusFiltro && statusFiltro !== "todos") {
        params.set("status", statusFiltro);
      }
      const res = await fetch(`/api/admin/pedidos?${params.toString()}`);
      if (res.ok) {
        const json: Paginated<Pedido> & { totaisStatus?: { todos: number; pago: number; pendente: number; cancelado: number } } = await res.json();
        setPedidos(json.data);
        setPedidosPage(json.page);
        setPedidosTotalPages(json.totalPages);
        setPedidosTotal(json.total);
        if (json.totaisStatus) {
          setPedidosTotaisStatus(json.totaisStatus);
        }
      }
    },
    [pedidosPage, pedidosSearch, pedidosSort, pedidosProdutoStatusFiltro, pedidosProdutoFiltro, pedidosStatusFiltro]
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

  useEffect(() => { checkAuth(); }, [checkAuth]);
  useEffect(() => {
    if (authed) {
      void Promise.all([
        fetchProdutos(),
        fetchPedidos(),
        fetchParticipantes(),
        fetchCupons(),
        fetchUsuarios(),
        fetchAvaliacoesTotal(),
        fetchAgendamentosTotal(),
      ]);
    }
  }, [authed, fetchPedidos, fetchParticipantes, fetchCupons, fetchUsuarios, fetchAvaliacoesTotal, fetchAgendamentosTotal]);


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
      await Promise.all([
        fetchProdutos(),
        fetchPedidos(),
        fetchParticipantes(),
        fetchCupons(),
        fetchUsuarios(),
        fetchAvaliacoesTotal(),
        fetchAgendamentosTotal(),
      ]);
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

  const tabs: { id: Tab; label: string; count?: number; highlight?: boolean }[] = [
    { id: "dashboard", label: "📊 Visão Geral" },
    { id: "sobre", label: "Sobre & FAQ" },
    { id: "produtos", label: "Produtos", count: produtos.length },
    { id: "pedidos", label: "Pedidos", count: pedidosTotal || pedidos.length },
    { id: "participantes", label: "Inscrições", count: participantesTotal || participantes.length },
    { id: "agendamentos", label: "🗓️ Agenda & Atendimentos", count: agendamentosTotal, highlight: newAppointmentsCount > 0 },
    { id: "avaliacoes", label: "Avaliações Yin/Yang", count: avaliacoesTotal },
    { id: "cupons", label: "Cupons", count: cupons.length },
    { id: "usuarios", label: "Usuários", count: usuariosTotal },
    { id: "manual", label: "📖 Manual do Sistema" },
  ];

  return (
    <div className="min-h-screen flex bg-brand-beige-light">
      {/* Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        tabs={tabs}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === "agendamentos") {
            setNewAppointmentsCount(0);
            void fetchAgendamentosTotal();
          }
          if (tab === "avaliacoes") {
            void fetchAvaliacoesTotal();
          }
        }}
        onLogout={handleLogout}
        onOpenAlterarSenha={() => setModalSenhaOpen(true)}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Área de conteúdo */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar mobile */}
        <header className="lg:hidden sticky top-0 z-10 bg-white border-b border-brand-beige h-14 flex items-center px-4 gap-3 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-brand-beige/50 transition-colors text-brand-charcoal"
            aria-label="Abrir menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-sm font-bold text-brand-purple">INstituto Kalapa</h1>
          <span className="text-xs text-brand-charcoal/40">Admin</span>
        </header>

        <main className="flex-1 px-4 lg:px-6 py-6 overflow-auto">
          {error && (

          <div role="alert" className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {error}
            <button onClick={() => setError("")} className="float-right font-bold" aria-label="Fechar">
              &times;
            </button>
          </div>
        )}

        {/* Tab: Dashboard / Visão Geral */}
        {activeTab === "dashboard" && (
          <AdminDashboard
            onNavigateTab={(targetTab) => setActiveTab(targetTab)}
          />
        )}

        {/* Tab: Sobre & FAQ (sempre montada para preservar edicoes nao salvas ao trocar de aba) */}
        <div hidden={activeTab !== "sobre"}>
          <AdminSobre onError={setError} />
        </div>

        {/* Tab: Produtos */}
        {activeTab === "produtos" && (
          <AdminProdutos produtos={produtos} onReload={fetchProdutos} onError={setError} />
        )}

        {/* Tab: Pedidos */}
        {activeTab === "pedidos" && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-semibold text-brand-charcoal">Pedidos</h2>
                <span className="text-xs bg-brand-beige px-2 py-0.5 rounded-full text-brand-charcoal/70">
                  {pedidosTotal} {pedidosTotal === 1 ? "pedido" : "pedidos"}
                </span>
                {pedidosTotaisStatus.todos > 0 && (
                  <div className="flex items-center gap-1.5 text-[11px] ml-1">
                    <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200 font-medium">
                      {pedidosTotaisStatus.pago} pagos
                    </span>
                    {pedidosTotaisStatus.pendente > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200 font-medium">
                        {pedidosTotaisStatus.pendente} pendente
                      </span>
                    )}
                    {pedidosTotaisStatus.cancelado > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 font-medium">
                        {pedidosTotaisStatus.cancelado} cancelado
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {/* Filtro Status de Pagamento */}
                <select
                  value={pedidosStatusFiltro}
                  onChange={(e) => {
                    const novoStatus = e.target.value as "todos" | "pago" | "pendente" | "cancelado";
                    setPedidosStatusFiltro(novoStatus);
                    setPedidosPage(1);
                    void fetchPedidos(1, pedidosProdutoStatusFiltro, pedidosProdutoFiltro, novoStatus);
                  }}
                  className="px-3 py-2 border border-brand-beige rounded-lg text-sm bg-white text-brand-charcoal font-medium focus-visible:ring-2 focus-visible:ring-brand-purple/30"
                  aria-label="Filtrar status do pagamento dos pedidos"
                >
                  <option value="todos">Status: Todos ({pedidosTotaisStatus.todos || pedidosTotal})</option>
                  <option value="pago">Apenas Pagos ({pedidosTotaisStatus.pago})</option>
                  <option value="pendente">Apenas Pendentes ({pedidosTotaisStatus.pendente})</option>
                  <option value="cancelado">Apenas Cancelados ({pedidosTotaisStatus.cancelado})</option>
                </select>

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
                    void fetchPedidos(1, novoStatus, novoProdFiltro, pedidosStatusFiltro);
                  }}
                  className="px-3 py-2 border border-brand-beige rounded-lg text-sm bg-white text-brand-charcoal focus-visible:ring-2 focus-visible:ring-brand-purple/30"
                  aria-label="Filtrar status dos produtos em pedidos"
                >
                  <option value="todos">Produtos: Todos</option>
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
                    void fetchPedidos(1, pedidosProdutoStatusFiltro, novoFiltro, pedidosStatusFiltro);
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
          <AdminCupons cupons={cupons} onReload={fetchCupons} onError={setError} />
        )}


        {/* Tab: Usuários */}
        {activeTab === "usuarios" && (
          <AdminUsuarios
            usuarios={usuarios}
            usuariosPage={usuariosPage}
            usuariosTotalPages={usuariosTotalPages}
            usuariosTotal={usuariosTotal}
            usuariosSearch={usuariosSearch}
            setUsuariosSearch={setUsuariosSearch}
            fetchUsuarios={fetchUsuarios}
            onError={setError}
          />
        )}
        {/* Tab: Agenda & Atendimentos */}
        {activeTab === "agendamentos" && <AdminAgenda />}
        {/* Tab: Avaliações Yin/Yang */}
        {activeTab === "avaliacoes" && <AdminAvaliacoesYinYang />}
        {/* Tab: Manual do Sistema */}
        {activeTab === "manual" && <AdminManual />}
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

      {/* Notificações Flutuantes do Administrador (Toast em tempo real) */}
      <AdminToastNotification
        onNavigateToAgenda={() => {
          setActiveTab("agendamentos");
          setNewAppointmentsCount(0);
        }}
        onNewAppointmentsCountChange={(count) => {
          if (activeTab !== "agendamentos") {
            setNewAppointmentsCount(count);
          }
        }}
      />

      {/* Modal de Alteração de Senha do Administrador */}
      <AdminAlterarSenhaModal
        isOpen={modalSenhaOpen}
        onClose={() => setModalSenhaOpen(false)}
      />
      </div>
    </div>
  );
}

