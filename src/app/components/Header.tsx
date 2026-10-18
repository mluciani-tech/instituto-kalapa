"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  LayoutGrid,
  User as UserIcon,
  ShoppingBag,
  LogOut,
  Calendar,
  KeyRound,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import ModalAlterarSenha from "@/components/ModalAlterarSenha";
import type { Usuario } from "@/lib/types";

const navLinks = [
  { href: "/", label: "Início" },
  { href: "/#conhecimento-experiencias", label: "Conhecimento e Experiências" },
  { href: "/#sobre", label: "Sobre a Fundadora" },
];

const contatos = {
  endereco: "Alameda Tangara, 500 - Cotia - SP",
  instagram: "https://instagram.com/institutoKalapa",
  instagramLabel: "@institutoKalapa",
  youtube: "https://youtube.com/@institutoKalapa",
  youtubeLabel: "@institutoKalapa",
  linkedin: "https://linkedin.com/company/instituto-kalapa",
  linkedinLabel: "INstituto Kalapa",
  email: "clatihucia.capeli@institutokalapa.com.br",
  whatsapp:
    "https://wa.me/5511917452732?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20um%20atendimento%20ou%20falar%20com%20a%20equipe%20do%20INstituto%20Kalapa.",
  whatsappLabel: "(11) 91745-2732",
  erp: "https://espaco-serena-clinica.web.app/?return_url=https%3A%2F%2Fwww.institutokalapa.com.br&redirect_url=https%3A%2F%2Fwww.institutokalapa.com.br",
  erpLabel: "Espaço Sarawasti & Brahma",
};

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [modalSenhaOpen, setModalSenhaOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems, openDrawer } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Verificar cliente autenticado
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.usuario) {
            setUsuario(data.usuario);
          } else {
            setUsuario(null);
          }
        }
      } catch {
        setUsuario(null);
      }
    };
    checkAuth();
  }, [pathname]);

  // Fechar menu de usuário ao clicar fora
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUsuario(null);
      setUserMenuOpen(false);
      router.push("/");
      router.refresh();
    } catch {
      // ignore
    }
  };

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Header não aparece no admin
  if (pathname.startsWith("/admin")) return null;

  const primeiroNome = usuario?.nome ? usuario.nome.split(" ")[0] : "";

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-[#E2DFD3] bg-[#F7F5EE]/95 shadow-xs backdrop-blur-xl"
          : "border-b border-[#E6E3D8] bg-[#F7F5EE]"
      }`}
    >
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-3 md:h-22">
          {/* Logo + Nome + Subtítulo Conceitual */}
          <Link
            href="/"
            onClick={handleHomeClick}
            aria-label="INstituto Kalapa — voltar para a página inicial"
            className="group flex shrink-0 items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B5241] focus-visible:ring-offset-2"
          >
            <Image
              src="/images/caminhos/logo-kalapa-escuro.png"
              alt="Logo INstituto Kalapa"
              width={64}
              height={64}
              className="h-11 w-11 shrink-0 object-contain transition-transform duration-300 group-hover:scale-[1.04] md:h-12 md:w-12"
            />
            <div className="shrink-0 leading-tight">
              <span className="block font-serif text-xl md:text-[24px] font-medium tracking-tight text-[#214137]">
                INstituto Kalapa
              </span>
              <span className="hidden sm:block text-[10.5px] md:text-[11px] font-normal tracking-wide text-[#4A5D52]">
                Ciência • Comportamento • Experiência • Consciência
              </span>
            </div>
          </Link>

          {/* Navegação Desktop Central */}
          <nav
            aria-label="Navegação principal"
            className="hidden lg:flex items-center gap-7 xl:gap-9 shrink-0"
          >
            {navLinks.map((link) => {
              const isHome = link.href === "/";
              const isActive = isHome && pathname === "/";
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={isHome ? handleHomeClick : undefined}
                  className={`relative whitespace-nowrap py-1.5 text-[13px] 2xl:text-[13.5px] transition-colors ${
                    isActive
                      ? "font-semibold text-[#1B362D]"
                      : "font-normal text-[#2E463B]/85 hover:text-[#1B362D]"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 inset-x-0 h-[2px] rounded-full bg-[#214137]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Lado Direito: Botão "Agendar / Falar Conosco" + Ícones discretos (ERP, Conta, Reserva) */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <a
              href={contatos.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#3B5241] hover:bg-[#2E4233] text-white text-xs sm:text-[13px] font-medium shadow-xs transition-all duration-200 hover:-translate-y-0.5"
            >
              <Calendar className="w-3.5 h-3.5 text-white/90 shrink-0" />
              <span className="whitespace-nowrap">Agendar / Falar Conosco</span>
            </a>

            {/* Redes Sociais nos botões circulares (visíveis a partir de telas xl para máximo conforto) */}
            <a
              href={contatos.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram do INstituto Kalapa"
              title="Instagram"
              className="hidden xl:flex h-9 w-9 items-center justify-center rounded-full border border-[#DCD8CD] bg-white/80 text-[#214137] transition-all duration-200 hover:bg-white hover:border-[#3B5241]"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>

            <a
              href={contatos.youtube}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Canal no YouTube do INstituto Kalapa"
              title="YouTube"
              className="hidden xl:flex h-9 w-9 items-center justify-center rounded-full border border-[#DCD8CD] bg-white/80 text-[#214137] transition-all duration-200 hover:bg-white hover:border-[#3B5241]"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                <polygon points="10 15 15 12 10 9 10 15" fill="currentColor" stroke="none" />
              </svg>
            </a>

            <a
              href={contatos.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn do INstituto Kalapa"
              title="LinkedIn"
              className="hidden xl:flex h-9 w-9 items-center justify-center rounded-full border border-[#DCD8CD] bg-white/80 text-[#214137] transition-all duration-200 hover:bg-white hover:border-[#3B5241]"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>

            {/* Ícone discreto do Sistema ERP */}
            <a
              href={contatos.erp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={contatos.erpLabel}
              title={contatos.erpLabel}
              className="hidden md:flex h-9 w-9 items-center justify-center rounded-full border border-[#DCD8CD] bg-white/80 text-[#214137] transition-all duration-200 hover:bg-white hover:border-[#3B5241]"
            >
              <LayoutGrid className="w-4 h-4" />
            </a>

            {/* Botão Perfil / Usuário */}
            <div className="relative" ref={userMenuRef}>
              {usuario ? (
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  aria-label="Menu do usuário"
                  className="flex h-9 items-center gap-1.5 px-3 rounded-full border border-[#DCD8CD] bg-white/80 text-[#214137] transition-all duration-200 hover:bg-white hover:border-[#3B5241] cursor-pointer"
                >
                  <UserIcon className="w-4 h-4 text-[#214137]" />
                  <span className="text-xs font-semibold max-w-[90px] truncate text-[#214137] hidden md:inline">
                    Olá, {primeiroNome}
                  </span>
                </button>
              ) : (
                <Link
                  href="/login"
                  aria-label="Entrar na conta"
                  title="Entrar na conta"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#DCD8CD] bg-white/80 text-[#214137] transition-all duration-200 hover:bg-white hover:border-[#3B5241] cursor-pointer"
                >
                  <UserIcon className="w-4 h-4 text-[#214137]" />
                </Link>
              )}

              {/* Dropdown menu do usuário logado */}
              {usuario && userMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl bg-[#1F352A] border border-white/10 shadow-2xl py-2 z-50 text-white font-sans">
                  <div className="px-4 py-2 border-b border-white/10">
                    <p className="text-xs font-bold text-white truncate">{usuario.nome}</p>
                    <p className="text-[11px] text-white/60 truncate">{usuario.email}</p>
                  </div>
                  <Link
                    href="/conta/pedidos"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-white/85 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <Calendar className="w-4 h-4 text-brand-terracotta" />
                    Minhas Vivências
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
                      setModalSenhaOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-white/85 hover:text-white hover:bg-white/10 transition-colors text-left cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4 text-brand-terracotta" />
                    Alterar Senha
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-red-300 hover:bg-white/10 transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Sair da conta
                  </button>
                </div>
              )}
            </div>

            {/* Botão de Reserva / Sacola */}
            <button
              onClick={openDrawer}
              aria-label={`Ver minha reserva com ${totalItems} vivências`}
              title="Minha Reserva"
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#DCD8CD] bg-white/80 text-[#214137] transition-all duration-200 hover:bg-white hover:border-[#3B5241] cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-[#214137]" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 min-w-4 items-center justify-center rounded-full bg-[#3B5241] text-[10px] font-bold text-white shadow-xs">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Hamburger Mobile / Tablet */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={menuOpen}
              className="lg:hidden rounded-xl p-2 text-[#214137] hover:bg-[#EAE8DF] transition-colors"
            >
              {menuOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile / Tablet */}
      {menuOpen && (
        <div className="lg:hidden border-t border-[#E2DFD3] bg-[#F7F5EE] shadow-lg">
          <nav
            aria-label="Menu mobile"
            className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-1"
          >
            {navLinks.map((link) => {
              const isHome = link.href === "/";
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    setMenuOpen(false);
                    if (isHome && pathname === "/") {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                  className="px-4 py-3 text-sm font-medium text-[#214137] hover:bg-[#EAE8DF] rounded-xl transition-colors"
                >
                  {link.label}
                </Link>
              );
            })}

            <a
              href={contatos.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="mt-2 mx-4 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-[#3B5241] text-white text-xs font-semibold shadow-xs"
            >
              <Calendar className="w-4 h-4" />
              <span>Agendar / Falar Conosco</span>
            </a>

            {usuario ? (
              <>
                <Link
                  href="/conta/pedidos"
                  onClick={() => setMenuOpen(false)}
                  className="mt-2 px-4 py-3 text-sm font-medium text-[#214137] hover:bg-[#EAE8DF] rounded-xl transition-colors flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Minhas Vivências ({usuario.nome.split(" ")[0]})
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    setModalSenhaOpen(true);
                  }}
                  className="w-full text-left px-4 py-3 text-sm font-medium text-[#214137] hover:bg-[#EAE8DF] rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <KeyRound className="w-4 h-4" />
                  Alterar Senha
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="mt-1 px-4 py-3 text-sm font-medium text-[#214137] hover:bg-[#EAE8DF] rounded-xl transition-colors flex items-center gap-2"
              >
                <UserIcon className="w-4 h-4" />
                Entrar na conta
              </Link>
            )}

            {/* Redes Sociais no menu Mobile */}
            <div className="mt-3 px-4 flex items-center gap-2.5">
              <span className="text-xs font-medium text-[#214137]/70 mr-1">Siga-nos:</span>
              <a
                href={contatos.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="h-8 w-8 flex items-center justify-center rounded-full border border-[#DCD8CD] bg-white text-[#214137]"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a
                href={contatos.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="h-8 w-8 flex items-center justify-center rounded-full border border-[#DCD8CD] bg-white text-[#214137]"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                  <polygon points="10 15 15 12 10 9 10 15" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a
                href={contatos.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="h-8 w-8 flex items-center justify-center rounded-full border border-[#DCD8CD] bg-white text-[#214137]"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>

            <div className="mt-3 pt-3 border-t border-[#E2DFD3] flex items-center justify-between px-4 text-[11px] text-[#4A5D52]">
              <a
                href={contatos.erp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-medium text-[#214137] hover:underline"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                Espaço Sarawasti & Brahma
              </a>
              <span>{contatos.endereco}</span>
            </div>
          </nav>
        </div>
      )}

      {usuario && (
        <ModalAlterarSenha
          isOpen={modalSenhaOpen}
          onClose={() => setModalSenhaOpen(false)}
          userEmail={usuario.email}
        />
      )}
    </header>
  );
}
