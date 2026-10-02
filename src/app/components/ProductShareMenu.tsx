"use client";

import React, { useState, useRef, useEffect } from "react";
import { Share2, Link2, Check } from "lucide-react";

interface ProductShareMenuProps {
  produto: {
    id: string;
    nome: string;
    slug?: string;
    preco?: number | null;
    descricao?: string | null;
    descricao_curta?: string | null;
    imagem_url?: string | null;
  };
  variant?: "circle" | "button";
  className?: string;
  align?: "left" | "right";
}

export default function ProductShareMenu({
  produto,
  variant = "circle",
  className = "",
  align = "right",
}: ProductShareMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fecha o popover ao clicar fora ou ao pressionar Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
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
    return `${origin}/produtos/${produto.slug || produto.id}`;
  };

  // 1. WhatsApp: chamada com link direto e convite acolhedor
  const handleWhatsAppShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const url = getShareUrl();
    const mensagem = `Olá! Conheça a vivência "${produto.nome}" no INstituto Kalapa:\n${url}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(mensagem)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  // 2. Copiar Link: feedback na própria linha ("Link copiado!")
  const handleCopyLink = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const url = getShareUrl();

    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      setTimeout(() => {
        setCopiado(false);
      }, 2500);
    } catch {
      // Fallback para input temporário se navigator.clipboard falhar
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

  // 3. Mais opções: navigator.share nativo com fallback para e-mail no desktop
  const handleMoreOptions = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const url = getShareUrl();
    const shareData = {
      title: `${produto.nome} — INstituto Kalapa`,
      text:
        produto.descricao_curta ||
        produto.descricao ||
        `Conheça a vivência ${produto.nome} no INstituto Kalapa!`,
      url,
    };

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
        setIsOpen(false);
        return;
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
      }
    }

    // Fallback desktop: abre cliente de e-mail (mailto)
    const subject = encodeURIComponent(`${produto.nome} — INstituto Kalapa`);
    const body = encodeURIComponent(
      `Olá!\n\nConheça esta vivência no INstituto Kalapa: ${produto.nome}\n\nConfira todos os detalhes no link abaixo:\n${url}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    setIsOpen(false);
  };

  return (
    <div
      ref={menuRef}
      className="relative inline-block"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Botão Disparador */}
      {variant === "circle" ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setIsOpen((prev) => !prev);
          }}
          aria-label={`Compartilhar ${produto.nome}`}
          title="Compartilhar produto"
          className={`flex items-center justify-center w-9 h-9 rounded-full bg-black/60 hover:bg-black/85 text-white/90 hover:text-white border border-white/20 backdrop-blur-md shadow-md transition-all duration-200 cursor-pointer active:scale-95 ${className}`}
        >
          <Share2 className="w-4 h-4" />
        </button>
      ) : (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setIsOpen((prev) => !prev);
          }}
          aria-label={`Compartilhar ${produto.nome}`}
          title="Compartilhar vivência"
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-brand-charcoal/15 bg-white hover:bg-brand-purple/5 text-brand-charcoal hover:text-brand-purple text-xs font-semibold transition-all shadow-xs cursor-pointer active:scale-95 ${className}`}
        >
          <Share2 className="w-4 h-4" />
          <span>Compartilhar</span>
        </button>
      )}

      {/* Popover Escuro Elegante */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Opções de compartilhamento"
          className={`absolute top-full mt-2 z-50 w-72 sm:w-80 rounded-2xl bg-[#141416]/95 backdrop-blur-xl border border-white/12 shadow-[0_12px_40px_rgba(0,0,0,0.65)] p-4 text-left transition-all animate-in fade-in zoom-in-95 duration-150 ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {/* Cabeçalho */}
          <div className="mb-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 block">
              COMPARTILHAR PRODUTO
            </span>
            <span
              className="text-sm font-semibold text-white truncate block mt-0.5"
              title={produto.nome}
            >
              {produto.nome}
            </span>
          </div>

          <div className="h-px bg-white/10 my-2.5" />

          {/* Lista de Opções */}
          <div className="space-y-1">
            {/* Opção 1: WhatsApp */}
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/8 transition-colors text-left group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-emerald-950/80 border border-emerald-800/40 text-[#25D366] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                {/* Ícone oficial do WhatsApp em SVG limpo */}
                <svg
                  className="w-4.5 h-4.5 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold text-white block group-hover:text-emerald-400 transition-colors">
                  WhatsApp
                </span>
                <span className="text-[11px] text-zinc-400 leading-tight block truncate mt-0.5">
                  Com foto, preço e especificações
                </span>
              </div>
            </button>

            {/* Opção 2: Copiar Link */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/8 transition-colors text-left group cursor-pointer"
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all shadow-xs ${
                  copiado
                    ? "bg-emerald-950/80 border border-emerald-800/40 text-emerald-400 scale-105"
                    : "bg-purple-950/80 border border-purple-800/40 text-purple-300 group-hover:scale-105"
                }`}
              >
                {copiado ? (
                  <Check className="w-4.5 h-4.5 text-emerald-400 animate-in zoom-in duration-150" />
                ) : (
                  <Link2 className="w-4.5 h-4.5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <span
                  className={`text-xs font-semibold block transition-colors ${
                    copiado
                      ? "text-emerald-400"
                      : "text-white group-hover:text-purple-300"
                  }`}
                >
                  {copiado ? "Link copiado!" : "Copiar link"}
                </span>
                <span className="text-[11px] text-zinc-400 leading-tight block truncate mt-0.5">
                  {copiado
                    ? "Copiado para a área de transferência"
                    : "Link direto com identificador"}
                </span>
              </div>
            </button>

            {/* Opção 3: Mais opções... */}
            <button
              type="button"
              onClick={handleMoreOptions}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/8 transition-colors text-left group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-zinc-800/90 border border-zinc-700/50 text-zinc-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                <Share2 className="w-4.5 h-4.5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold text-white block group-hover:text-zinc-200 transition-colors">
                  Mais opções...
                </span>
                <span className="text-[11px] text-zinc-400 leading-tight block truncate mt-0.5">
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
