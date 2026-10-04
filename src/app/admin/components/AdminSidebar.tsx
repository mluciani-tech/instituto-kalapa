"use client";

import { X } from "lucide-react";
import {
  LayoutDashboard,
  Info,
  Package,
  Receipt,
  Users,
  CalendarDays,
  Ticket,
  UserCog,
  BookOpen,
  ExternalLink,
  LogOut,
  KeyRound,
  Sparkles,
} from "lucide-react";

type Tab =
  | "dashboard"
  | "sobre"
  | "produtos"
  | "pedidos"
  | "participantes"
  | "cupons"
  | "usuarios"
  | "agendamentos"
  | "avaliacoes"
  | "manual";

interface TabItem {
  id: Tab;
  label: string;
  count?: number;
  highlight?: boolean;
}

interface AdminSidebarProps {
  activeTab: Tab;
  tabs: TabItem[];
  onTabChange: (tab: Tab) => void;
  onLogout: () => void;
  onOpenAlterarSenha?: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const TAB_ICONS: Record<Tab, React.ElementType> = {
  dashboard: LayoutDashboard,
  sobre: Info,
  produtos: Package,
  pedidos: Receipt,
  participantes: Users,
  agendamentos: CalendarDays,
  avaliacoes: Sparkles,
  cupons: Ticket,
  usuarios: UserCog,
  manual: BookOpen,
};

const TAB_LABELS: Record<Tab, string> = {
  dashboard: "Visão Geral",
  sobre: "Sobre & FAQ",
  produtos: "Produtos",
  pedidos: "Pedidos",
  participantes: "Inscrições",
  agendamentos: "Agenda & Atendimentos",
  avaliacoes: "Avaliações",
  cupons: "Cupons",
  usuarios: "Usuários",
  manual: "Manual do Sistema",
};

function SidebarContent({
  activeTab,
  tabs,
  onTabChange,
  onLogout,
  onOpenAlterarSenha,
  onClose,
}: Omit<AdminSidebarProps, "isOpen">) {
  return (
    <div className="flex flex-col h-full bg-brand-purple text-white">
      {/* Logo / Header */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold tracking-tight">INstituto Kalapa</h1>
            <span className="text-[11px] text-white/50 font-medium">Painel Admin</span>
          </div>
          {/* Botão de fechar — visível só no mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Fechar menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navegação */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {tabs.map((tab) => {
          const Icon = TAB_ICONS[tab.id];
          const label = TAB_LABELS[tab.id];
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                onTabChange(tab.id);
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm transition-all group ${
                isActive
                  ? "bg-white/15 text-white border-l-2 border-brand-terracotta pl-[10px] font-semibold"
                  : "text-white/65 hover:bg-white/10 hover:text-white border-l-2 border-transparent"
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-white/50 group-hover:text-white/80"}`}
              />
              <span className="flex-1 truncate">{label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold shrink-0 ${
                    tab.highlight
                      ? "bg-brand-terracotta text-white animate-pulse"
                      : "bg-white/20 text-white"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Rodapé */}
      <div className="border-t border-white/10 px-2 py-3 space-y-0.5">
        <a
          href="/produtos"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/65 hover:bg-white/10 hover:text-white transition-all group"
        >
          <ExternalLink className="w-4 h-4 shrink-0 text-white/50 group-hover:text-white/80" />
          <span>Ver catálogo</span>
        </a>
        {onOpenAlterarSenha && (
          <button
            onClick={() => {
              onOpenAlterarSenha();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/65 hover:bg-white/10 hover:text-white transition-all group"
          >
            <KeyRound className="w-4 h-4 shrink-0 text-white/50 group-hover:text-white/80" />
            <span>Alterar Senha</span>
          </button>
        )}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/65 hover:bg-red-500/20 hover:text-red-200 transition-all group"
        >
          <LogOut className="w-4 h-4 shrink-0 text-white/50 group-hover:text-red-300" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
}

export default function AdminSidebar(props: AdminSidebarProps) {
  const { isOpen, onClose, ...rest } = props;

  return (
    <>
      {/* Desktop: sidebar fixa */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 h-screen sticky top-0">
        <SidebarContent {...rest} onClose={onClose} />
      </aside>

      {/* Mobile: drawer deslizante */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-30 flex">
          {/* Overlay escuro */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            onClick={onClose}
            aria-hidden="true"
          />
          {/* Painel deslizante */}
          <aside className="relative z-40 w-64 h-full flex flex-col animate-in slide-in-from-left duration-200">
            <SidebarContent {...rest} onClose={onClose} />
          </aside>
        </div>
      )}
    </>
  );
}
