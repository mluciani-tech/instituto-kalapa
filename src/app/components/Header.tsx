"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Mail, Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/produtos?categoria=vivencias", label: "Vivências" },
  { href: "/produtos?categoria=atendimentos", label: "Atendimentos" },
  { href: "/produtos?categoria=constelacao", label: "Constelação" },
];

const contatos = {
  endereco: "Alameda Tangara, 500 - Cotia - SP",
  instagram: "https://instagram.com/institutoKalapa",
  instagramLabel: "@institutoKalapa",
  email: "contato@institutokalapa.com.br",
  whatsapp: "https://wa.me/5511917527322",
  whatsappLabel: "(11) 9175-2732",
};

function InstagramIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function WhatsAppIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
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
  const iconColor = scrolled
    ? "text-brand-charcoal/70 hover:text-brand-terracotta"
    : "text-white/80 hover:text-brand-terracotta";

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/85 backdrop-blur-md border-b border-brand-beige shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo + Nome */}
          <a
            href="/"
            aria-label="INstituto Kalapa — voltar para a página inicial"
            className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta rounded-xl"
          >
            <img
              src="/logo-kalapa.png"
              alt=""
              width={44}
              height={44}
              className="w-10 h-10 md:w-11 md:h-11 object-contain rounded-xl bg-white/85 backdrop-blur-md border border-white/60 shadow-sm p-1 transition-transform duration-300 group-hover:scale-105"
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
            <a
              href={contatos.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Instagram ${contatos.instagramLabel}`}
              className={`transition-colors ${iconColor}`}
            >
              <InstagramIcon className="w-5 h-5" />
            </a>
            <a
              href={`mailto:${contatos.email}`}
              aria-label={`E-mail ${contatos.email}`}
              className={`transition-colors ${iconColor}`}
            >
              <Mail className="w-5 h-5" aria-hidden="true" />
            </a>
            <a
              href={contatos.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`WhatsApp ${contatos.whatsappLabel}`}
              className={`transition-colors ${iconColor}`}
            >
              <WhatsAppIcon className="w-5 h-5" />
            </a>
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
            <div className="mt-3 pt-3 border-t border-brand-beige flex items-center gap-5 px-3">
              <a
                href={contatos.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Instagram ${contatos.instagramLabel}`}
                className="text-brand-charcoal/60 hover:text-brand-terracotta transition-colors"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a
                href={`mailto:${contatos.email}`}
                aria-label={`E-mail ${contatos.email}`}
                className="text-brand-charcoal/60 hover:text-brand-terracotta transition-colors"
              >
                <Mail className="w-5 h-5" aria-hidden="true" />
              </a>
              <a
                href={contatos.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`WhatsApp ${contatos.whatsappLabel}`}
                className="text-brand-charcoal/60 hover:text-brand-terracotta transition-colors"
              >
                <WhatsAppIcon className="w-5 h-5" />
              </a>
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
