"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  Mail,
  MessageCircle,
  LayoutGrid,
  User as UserIcon,
  ShoppingCart,
  LogOut,
  Package,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { Usuario } from "@/lib/types";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/produtos?categoria=vivencias", label: "Vivências" },
  { href: "/produtos?categoria=atendimentos", label: "Atendimentos" },
  { href: "/produtos?categoria=calendario", label: "Calendário" },
];

const contatos = {
  endereco: "Alameda Tangara, 500 - Cotia - SP",
  instagram: "https://instagram.com/institutoKalapa",
  instagramLabel: "@institutoKalapa",
  email: "contato@institutokalapa.com.br",
  whatsapp: "https://wa.me/5511917452732",
  whatsappLabel: "(11) 91745-2732",
  erp: "https://espaco-serena-clinica.web.app/?return_url=https%3A%2F%2Fwww.institutokalapa.com.br&redirect_url=https%3A%2F%2Fwww.institutokalapa.com.br",
  erpLabel: "Sistema Espaço Serena (ERP)",
};

function ContactIcons() {
  return (
    <div className="flex items-center gap-2">
      <a
        href={contatos.instagram}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Instagram ${contatos.instagramLabel}`}
        title={`Instagram ${contatos.instagramLabel}`}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/95 text-brand-charcoal shadow-xs transition-all duration-300 hover:scale-105 hover:bg-white hover:text-brand-terracotta"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
        </svg>
      </a>
      <a
        href={`mailto:${contatos.email}`}
        aria-label={`E-mail ${contatos.email}`}
        title={`E-mail ${contatos.email}`}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/95 text-brand-charcoal shadow-xs transition-all duration-300 hover:scale-105 hover:bg-white hover:text-brand-terracotta"
      >
        <Mail className="w-4 h-4" />
      </a>
      <a
        href={contatos.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`WhatsApp ${contatos.whatsappLabel}`}
        title={`WhatsApp ${contatos.whatsappLabel}`}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/95 text-brand-charcoal shadow-xs transition-all duration-300 hover:scale-105 hover:bg-white hover:text-brand-terracotta"
      >
        <MessageCircle className="w-4 h-4" />
      </a>
    </div>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems, openDrawer } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
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

  // Header não aparece no admin
  if (pathname.startsWith("/admin")) return null;

  const textColor = scrolled ? "text-brand-charcoal" : "text-white";
  const textMuted = scrolled ? "text-brand-charcoal/50" : "text-white/50";
  const primeiroNome = usuario?.nome ? usuario.nome.split(" ")[0] : "";

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-brand-beige/80 bg-white/90 shadow-sm backdrop-blur-xl"
          : "border-b border-white/10 bg-brand-purple-deep/65 backdrop-blur-md"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex h-20 items-center justify-between gap-4 md:h-24">
          {/* Logo + Nome */}
          <Link
            href="/"
            aria-label="INstituto Kalapa — voltar para a página inicial"
            className="group flex min-w-0 items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta focus-visible:ring-offset-2"
          >
            <Image
              src="/logo-kalapa.png"
              alt=""
              width={72}
              height={72}
              className="h-12 w-12 shrink-0 rounded-xl border border-white/80 bg-white p-1 object-contain shadow-md transition-transform duration-300 group-hover:scale-[1.03] md:h-14 md:w-14"
            />
            <div className="min-w-0 leading-tight">
              <span className={`block truncate text-base font-semibold tracking-tight transition-colors md:text-lg ${textColor}`}>
                INstituto Kalapa
              </span>
              <span className={`hidden truncate text-[11px] transition-colors md:block ${textMuted}`}>
                {contatos.endereco}
              </span>
            </div>
          </Link>

          {/* Nav desktop */}
          <nav aria-label="Navegação principal" className="hidden lg:flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3.5 py-2 text-sm font-medium transition-[background-color,color] ${
                  scrolled
                    ? "text-brand-charcoal/70 hover:text-brand-purple hover:bg-brand-purple/5"
                    : "text-white/75 hover:bg-white/10 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side: Contatos + E-commerce Buttons (User & Cart) */}
          <div className="flex items-center gap-2.5">
            <div className="hidden md:flex items-center">
              <ContactIcons />
            </div>

            {/* BOTÕES DE E-COMMERCE CONFORME SCREENSHOT 1 */}
            <div className="flex items-center gap-2">
              {/* Botão Perfil / Usuário */}
              <div className="relative" ref={userMenuRef}>
                {usuario ? (
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    aria-label="Menu do usuário"
                    className={`flex items-center gap-2 px-3 h-10 rounded-xl transition-all duration-200 cursor-pointer ${
                      scrolled
                        ? "border border-brand-beige bg-white text-brand-charcoal hover:bg-brand-beige/60 shadow-xs"
                        : "border border-white/20 bg-black/40 hover:bg-black/60 text-white"
                    }`}
                  >
                    <UserIcon className="w-4 h-4 text-brand-terracotta" />
                    <span className="text-xs font-semibold max-w-[100px] truncate">
                      Olá, {primeiroNome}
                    </span>
                  </button>
                ) : (
                  <Link
                    href="/login"
                    aria-label="Entrar na conta"
                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 ${
                      scrolled
                        ? "border border-brand-beige bg-white text-brand-charcoal hover:bg-brand-beige/60 shadow-xs"
                        : "border border-white/20 bg-black/40 hover:bg-black/60 text-white"
                    }`}
                  >
                    <UserIcon className="w-4 h-4" />
                  </Link>
                )}

                {/* Dropdown menu do usuário logado */}
                {usuario && userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-xl bg-brand-purple-deep border border-white/10 shadow-2xl py-2 z-50 text-white font-sans">
                    <div className="px-4 py-2 border-b border-white/10">
                      <p className="text-xs font-bold text-white truncate">{usuario.nome}</p>
                      <p className="text-[11px] text-white/50 truncate">{usuario.email}</p>
                    </div>
                    <Link
                      href="/conta/pedidos"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <Package className="w-4 h-4 text-brand-terracotta" />
                      Meus pedidos
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-red-400 hover:bg-white/5 transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Sair da conta
                    </button>
                  </div>
                )}
              </div>

              {/* Botão Carrinho de Compras */}
              <button
                onClick={openDrawer}
                aria-label={`Abrir carrinho com ${totalItems} itens`}
                className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 cursor-pointer ${
                  scrolled
                    ? "border border-brand-beige bg-white text-brand-charcoal hover:bg-brand-beige/60 shadow-xs"
                    : "border border-white/20 bg-black/40 hover:bg-black/60 text-white"
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-terracotta text-[10px] font-bold text-white shadow-md shadow-brand-terracotta/40">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>

            {/* Hamburger mobile */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={menuOpen}
              className={`lg:hidden rounded-xl p-2 transition-colors ${
                scrolled ? "text-brand-charcoal hover:bg-brand-purple/5" : "text-white hover:bg-white/10"
              }`}
            >
              {menuOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="lg:hidden border-t border-brand-beige/80 bg-white/95 shadow-lg backdrop-blur-xl">
          <nav aria-label="Menu mobile" className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 text-sm font-medium text-brand-charcoal/80 hover:text-brand-purple hover:bg-brand-purple/5 rounded-xl transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {usuario ? (
              <Link
                href="/conta/pedidos"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 text-sm font-medium text-[#7C3AED] hover:bg-purple-50 rounded-xl transition-colors flex items-center gap-2"
              >
                <Package className="w-4 h-4" />
                Meus pedidos ({usuario.nome.split(" ")[0]})
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 text-sm font-medium text-[#7C3AED] hover:bg-purple-50 rounded-xl transition-colors flex items-center gap-2"
              >
                <UserIcon className="w-4 h-4" />
                Entrar na conta
              </Link>
            )}
            <div className="mt-3 pt-3 border-t border-brand-beige flex items-center gap-4 px-3">
              <ContactIcons />
              <span className="text-[11px] text-brand-charcoal/40 ml-auto">
                {contatos.endereco}
              </span>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
