"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Mail, MessageCircle, LayoutGrid } from "lucide-react";

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
    <div className="flex items-center gap-2.5">
      <a
        href={contatos.instagram}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Instagram ${contatos.instagramLabel}`}
        title={`Instagram ${contatos.instagramLabel}`}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/95 text-brand-charcoal shadow-sm transition-all duration-300 hover:scale-105 hover:bg-white hover:text-brand-terracotta hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta focus-visible:ring-offset-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
        </svg>
      </a>
      <a
        href={`mailto:${contatos.email}`}
        aria-label={`E-mail ${contatos.email}`}
        title={`E-mail ${contatos.email}`}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/95 text-brand-charcoal shadow-sm transition-all duration-300 hover:scale-105 hover:bg-white hover:text-brand-terracotta hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta focus-visible:ring-offset-2"
      >
        <Mail className="w-5 h-5" />
      </a>
      <a
        href={contatos.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`WhatsApp ${contatos.whatsappLabel}`}
        title={`WhatsApp ${contatos.whatsappLabel}`}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/95 text-brand-charcoal shadow-sm transition-all duration-300 hover:scale-105 hover:bg-white hover:text-brand-terracotta hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta focus-visible:ring-offset-2"
      >
        <MessageCircle className="w-5 h-5" />
      </a>
      <a
        href={contatos.erp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={contatos.erpLabel}
        title={contatos.erpLabel}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/95 text-brand-charcoal shadow-sm transition-all duration-300 hover:scale-105 hover:bg-white hover:text-brand-terracotta hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta focus-visible:ring-offset-2"
      >
        <LayoutGrid className="w-5 h-5" />
      </a>
    </div>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Header não aparece no admin (que tem cabeçalho próprio)
  if (pathname.startsWith("/admin")) return null;

  const textColor = scrolled ? "text-brand-charcoal" : "text-white";
  const textMuted = scrolled ? "text-brand-charcoal/50" : "text-white/50";

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-brand-beige/80 bg-white/90 shadow-sm backdrop-blur-xl"
          : "border-b border-white/10 bg-brand-purple-deep/65 backdrop-blur-md"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex h-20 items-center justify-between gap-6 md:h-24">
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
              className="h-14 w-14 shrink-0 rounded-xl border border-white/80 bg-white p-1 object-contain shadow-md transition-transform duration-300 group-hover:scale-[1.03] md:h-16 md:w-16"
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

          {/* Contatos desktop */}
          <div className="hidden md:flex items-center">
            <ContactIcons />
          </div>

          {/* Hamburger mobile */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            className={`lg:hidden rounded-xl p-2.5 transition-colors ${
              scrolled ? "text-brand-charcoal hover:bg-brand-purple/5" : "text-white hover:bg-white/10"
            }`}
          >
            {menuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
          </button>
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
                className="px-4 py-3.5 text-base font-medium text-brand-charcoal/80 hover:text-brand-purple hover:bg-brand-purple/5 rounded-xl transition-colors"
              >
                {link.label}
              </Link>
            ))}
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
