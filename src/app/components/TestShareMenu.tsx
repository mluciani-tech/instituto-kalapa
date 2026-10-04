"use client";

import React, { useState, useRef, useEffect } from "react";
import { Share2, Link2, Check } from "lucide-react";

interface TestShareMenuProps {
  /** Nome do teste exibido no popover (ex.: "Yin ou Yang?") */
  titulo: string;
  /** Caminho público do teste (ex.: "/teste-yin-yang") */
  path: string;
  /** Texto curto de convite usado em WhatsApp, e-mail e compartilhamento nativo */
  convite: string;
  variant?: "circle" | "button";
  className?: string;
  align?: "left" | "right";
  direction?: "down" | "up";
}

export default function TestShareMenu({
  titulo,
  path,
  convite,
  variant = "circle",
  className = "",
  align = "right",
  direction = "down",
}: TestShareMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const getShareUrl = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}${path}`;
  };

  const handleWhatsAppShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const mensagem = `${convite}\n${getShareUrl()}`;
    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(mensagem)}`,
      "_blank",
      "noopener,noreferrer"
    );
    setIsOpen(false);
  };

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const url = getShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = url;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2500);
      } finally {
        document.body.removeChild(textArea);
      }
    }
  };

  const handleMoreOptions = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const url = getShareUrl();
    const shareData = { title: `${titulo} — INstituto Kalapa`, text: convite, url };

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
        setIsOpen(false);
        return;
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
      }
    }

    const subject = encodeURIComponent(`${titulo} — INstituto Kalapa`);
    const body = encodeURIComponent(`Olá!\n\n${convite}\n\n${url}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    setIsOpen(false);
  };

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsOpen((prev) => !prev);
  };

  return (
    <div ref={menuRef} className="relative inline-block" onClick={(e) => e.stopPropagation()}>
      {variant === "circle" ? (
        <button
          type="button"
          onClick={toggle}
          aria-label={`Compartilhar teste ${titulo}`}
          title="Compartilhar teste"
          className={`flex items-center justify-center w-9 h-9 rounded-full bg-brand-purple-deep/80 hover:bg-brand-purple-deep text-brand-offwhite hover:text-white border border-[#B8965A]/40 hover:border-[#B8965A] backdrop-blur-md shadow-md transition-all duration-200 cursor-pointer active:scale-95 ${className}`}
        >
          <Share2 className="w-4 h-4" />
        </button>
      ) : (
        <button
          type="button"
          onClick={toggle}
          aria-label={`Compartilhar teste ${titulo}`}
          title="Compartilhar teste"
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-brand-charcoal/15 bg-white hover:bg-brand-purple/5 text-brand-charcoal hover:text-brand-purple text-xs font-semibold transition-all shadow-xs cursor-pointer active:scale-95 ${className}`}
        >
          <Share2 className="w-4 h-4" />
          <span>Compartilhar</span>
        </button>
      )}

      {isOpen && (
        <div
          role="dialog"
          aria-label="Opções de compartilhamento"
          className={`absolute ${direction === "up" ? "bottom-full mb-2" : "top-full mt-2"} z-50 w-72 sm:w-80 rounded-2xl bg-brand-purple-deep/95 backdrop-blur-xl border border-brand-terracotta/35 shadow-[0_12px_40px_rgba(13,30,40,0.7)] p-4 text-left transition-all animate-in fade-in zoom-in-95 duration-150 ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          <div className="mb-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-brand-terracotta block">
              COMPARTILHAR TESTE
            </span>
            <span className="text-sm font-semibold text-brand-offwhite truncate block mt-0.5" title={titulo}>
              {titulo}
            </span>
          </div>

          <div className="h-px bg-brand-terracotta/20 my-2.5" />

          <div className="space-y-1">
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/6 transition-colors text-left group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-brand-mint/20 border border-brand-mint/45 text-brand-mint flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold text-brand-offwhite block group-hover:text-brand-mint transition-colors">
                  WhatsApp
                </span>
                <span className="text-[11px] text-brand-purple-light/70 leading-tight block truncate mt-0.5">
                  Convite com o link do teste
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/6 transition-colors text-left group cursor-pointer"
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all shadow-xs ${
                  copiado
                    ? "bg-brand-mint/30 border border-brand-mint/70 text-brand-mint scale-105"
                    : "bg-brand-terracotta/20 border border-brand-terracotta/40 text-brand-terracotta group-hover:scale-105"
                }`}
              >
                {copiado ? (
                  <Check className="w-4.5 h-4.5 text-brand-mint animate-in zoom-in duration-150" />
                ) : (
                  <Link2 className="w-4.5 h-4.5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <span
                  className={`text-xs font-semibold block transition-colors ${
                    copiado ? "text-brand-mint" : "text-brand-offwhite group-hover:text-brand-terracotta"
                  }`}
                >
                  {copiado ? "Link copiado!" : "Copiar link"}
                </span>
                <span className="text-[11px] text-brand-purple-light/70 leading-tight block truncate mt-0.5">
                  {copiado ? "Copiado para a área de transferência" : "Link direto para o teste"}
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={handleMoreOptions}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/6 transition-colors text-left group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-brand-meteorite/30 border border-brand-purple-light/25 text-brand-purple-light flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                <Share2 className="w-4.5 h-4.5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold text-brand-offwhite block group-hover:text-brand-purple-light transition-colors">
                  Mais opções...
                </span>
                <span className="text-[11px] text-brand-purple-light/70 leading-tight block truncate mt-0.5">
                  Instagram, Telegram, e-mail
                </span>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
