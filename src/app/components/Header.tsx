"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

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
  whatsapp: "https://wa.me/5511917527322",
  whatsappLabel: "(11) 9175-2732",
};

function ContactIcons() {
  return (
    <>
      <a
        href={contatos.instagram}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Instagram ${contatos.instagramLabel}`}
        className="block rounded-full bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:scale-110 overflow-hidden"
      >
        <img src="/instagram-icon.jpeg" alt="" className="w-7 h-7 object-cover rounded-full" />
      </a>
      <a
        href={`mailto:${contatos.email}`}
        aria-label={`E-mail ${contatos.email}`}
        className="flex items-center justify-center w-7 h-7 rounded-full bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:scale-110"
      >
        <img src="/email-icon.png" alt="" className="w-4 h-4 object-contain" />
      </a>
      <a
        href={contatos.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`WhatsApp ${contatos.whatsappLabel}`}
        className="block rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:scale-110 overflow-hidden"
      >
        <img src="/whatsapp-icon.jpeg" alt="" className="w-7 h-7 object-cover rounded-lg" />
      </a>
    </>
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

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Header não aparece no admin (que tem cabeçalho próprio)
  if (pathname.startsWith("/admin")) return null;

  const textColor = scrolled ? "text-brand-charcoal" : "text-white";
  const textMuted = scrolled ? "text-brand-charcoal/50" : "text-white/50";

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/85 backdrop-blur-md border-b border-brand-beige shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-24 md:h-28">
          {/* Logo + Nome */}
          <a
            href="/"
            aria-label="INstituto Kalapa — voltar para a página inicial"
            className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta rounded-xl"
          >
            <img
              src="/logo-kalapa.png"
              alt=""
              width={96}
              height={96}
              className="w-20 h-20 md:w-24 md:h-24 object-contain rounded-xl p-1 bg-white shadow-md transition-transform duration-300 group-hover:scale-105"
            />
            <div className="leading-tight">
              <span className={`block font-bold text-base md:text-lg tracking-tight transition-colors ${textColor}`}>
                INstituto Kalapa
              </span>
              <span className={`hidden md:block text-[11px] transition-colors ${textMuted}`}>
                {contatos.endereco}
              </span>
            </div>
          </a>

          {/* Nav desktop */}
          <nav aria-label="Navegação principal" className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  scrolled
                    ? "text-brand-charcoal/70 hover:text-brand-purple hover:bg-brand-purple/5"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Contatos desktop */}
          <div className="hidden md:flex items-center gap-3">
            <ContactIcons />
          </div>

          {/* Hamburger mobile */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              scrolled ? "text-brand-charcoal hover:bg-brand-purple/5" : "text-white hover:bg-white/10"
            }`}
          >
            {menuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-md border-t border-brand-beige shadow-lg">
          <nav aria-label="Menu mobile" className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="px-3 py-3 text-sm font-medium text-brand-charcoal/80 hover:text-brand-purple hover:bg-brand-purple/5 rounded-lg transition-colors"
              >
                {link.label}
              </a>
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
