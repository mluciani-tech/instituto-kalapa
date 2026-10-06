"use client";

import { useState, useEffect, useCallback } from "react";
import { Menu } from "lucide-react";
import type { Produto, Pedido, Participante, Cupom, Usuario } from "@/lib/types";
import AdminDashboard from "./components/AdminDashboard";
import AdminAgenda from "./components/AdminAgenda";
import AdminToastNotification from "./components/AdminToastNotification";
import AdminManual from "./components/AdminManual";
import AdminSidebar from "./components/AdminSidebar";
import AdminAlterarSenhaModal from "./components/AdminAlterarSenhaModal";
import AdminAvaliacoes from "./components/AdminAvaliacoes";
import AdminSobre from "./components/AdminSobre";
import AdminProdutos from "./components/AdminProdutos";
import AdminPedidos from "./components/AdminPedidos";
import AdminParticipantes from "./components/AdminParticipantes";
import AdminCupons from "./components/AdminCupons";
import AdminUsuarios from "./components/AdminUsuarios";
import type { Paginated, Tab } from "./lib/types";

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
      const [yy, en, cr] = await Promise.all([
        fetch("/api/admin/avaliacoes-yin-yang?perPage=1"),
        fetch("/api/admin/avaliacoes-eneagrama?perPage=1"),
        fetch("/api/admin/avaliacoes-cronotipo?perPage=1"),
      ]);
      let soma = 0;
      if (yy.ok) {
        const json = await yy.json();
        soma += json.totalGeral ?? json.total ?? 0;
      }
      if (en.ok) {
        const json = await en.json();
        soma += json.totalGeral ?? json.total ?? 0;
      }
      if (cr.ok) {
        const json = await cr.json();
        soma += json.totalGeral ?? json.total ?? 0;
      }
      setAvaliacoesTotal(soma);
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

  const fetchProdutos = useCallback(async () => {
    const res = await fetch("/api/admin/produtos");
    if (res.ok) setProdutos(await res.json());
  }, []);

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

  const refreshAllInscricoesEPedidos = useCallback(async () => {
    await Promise.all([fetchPedidos(), fetchParticipantes()]);
  }, [fetchPedidos, fetchParticipantes]);

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
  }, [authed, fetchProdutos, fetchPedidos, fetchParticipantes, fetchCupons, fetchUsuarios, fetchAvaliacoesTotal, fetchAgendamentosTotal]);

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
              className="mt-4 w-full bg-brand-purple text-white py-3 rounded-lg text-sm font-medium hover:bg-brand-purple-dark disabled:opacity-50 transition-colors cursor-pointer"
            >
              {loginLoading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; count?: number; highlight?: boolean }[] = [
    { id: "dashboard", label: "📊 Visão Geral" },
    { id: "sobre", label: "Sobre & FAQ" },
    { id: "produtos", label: "Produtos", count: produtos.length },
    { id: "pedidos", label: "Pedidos", count: pedidosTotal || pedidos.length },
    { id: "participantes", label: "Inscrições", count: participantesTotal || participantes.length },
    { id: "agendamentos", label: "🗓️ Agenda & Atendimentos", count: agendamentosTotal, highlight: newAppointmentsCount > 0 },
    { id: "avaliacoes", label: "Avaliações", count: avaliacoesTotal },
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
            className="p-2 rounded-lg hover:bg-brand-beige/50 transition-colors text-brand-charcoal cursor-pointer"
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
              <button onClick={() => setError("")} className="float-right font-bold cursor-pointer" aria-label="Fechar">
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
            <AdminPedidos
              produtos={produtos}
              pedidos={pedidos}
              pedidosTotal={pedidosTotal}
              pedidosTotaisStatus={pedidosTotaisStatus}
              pedidosPage={pedidosPage}
              pedidosTotalPages={pedidosTotalPages}
              pedidosSearch={pedidosSearch}
              pedidosStatusFiltro={pedidosStatusFiltro}
              pedidosProdutoStatusFiltro={pedidosProdutoStatusFiltro}
              pedidosProdutoFiltro={pedidosProdutoFiltro}
              pedidosSort={pedidosSort}
              setPedidosPage={setPedidosPage}
              setPedidosSearch={setPedidosSearch}
              setPedidosStatusFiltro={setPedidosStatusFiltro}
              setPedidosProdutoStatusFiltro={setPedidosProdutoStatusFiltro}
              setPedidosProdutoFiltro={setPedidosProdutoFiltro}
              setPedidosSort={setPedidosSort}
              fetchPedidos={fetchPedidos}
              onRefreshAll={refreshAllInscricoesEPedidos}
              onError={setError}
            />
          )}

          {/* Tab: Participantes */}
          {activeTab === "participantes" && (
            <AdminParticipantes
              produtos={produtos}
              participantes={participantes}
              participantesTotal={participantesTotal}
              participantesPage={participantesPage}
              participantesTotalPages={participantesTotalPages}
              participantesSearch={participantesSearch}
              participantesProdutoStatusFiltro={participantesProdutoStatusFiltro}
              participantesProdutoFiltro={participantesProdutoFiltro}
              participantesSort={participantesSort}
              setParticipantesPage={setParticipantesPage}
              setParticipantesSearch={setParticipantesSearch}
              setParticipantesProdutoStatusFiltro={setParticipantesProdutoStatusFiltro}
              setParticipantesProdutoFiltro={setParticipantesProdutoFiltro}
              setParticipantesSort={setParticipantesSort}
              fetchParticipantes={fetchParticipantes}
              onRefreshAll={refreshAllInscricoesEPedidos}
              onError={setError}
            />
          )}

          {/* Tab: Cupons */}
          {activeTab === "cupons" && (
            <AdminCupons cupons={cupons} produtos={produtos} onReload={fetchCupons} onError={setError} />
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

          {/* Tab: Avaliações (Yin/Yang, Eneagrama e visão geral) */}
          {activeTab === "avaliacoes" && <AdminAvaliacoes />}

          {/* Tab: Manual do Sistema */}
          {activeTab === "manual" && <AdminManual />}
        </main>

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
