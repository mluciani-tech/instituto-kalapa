import { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import ProductGrid from "../components/ProductGrid";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Produtos — INstituto Kalapa",
  description:
    "Conheça nossos serviços e encontre a experiência ideal para o seu momento de autoconhecimento.",
};

const nomesCategorias: Record<string, string> = {
  vivencias: "Vivências",
};

export default async function ProdutosPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;

  return (
    <main className="min-h-screen bg-brand-offwhite">
      <section className="relative pt-24 pb-12 bg-brand-charcoal overflow-hidden">
        <div className="absolute inset-0 cinematic-gradient opacity-60" />
        <div className="absolute inset-0 cinematic-overlay" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white/80 text-sm font-medium tracking-wide mb-6">
            ✦ Nossos serviços
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 font-sans">
            {categoria
              ? nomesCategorias[categoria.toLowerCase()] ||
                `${categoria.charAt(0).toUpperCase() + categoria.slice(1)}`
              : "Escolha a experiência ideal para você"}
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Cada sessão é um convite à transformação. Selecione o serviço que
            mais ressoa com o seu momento.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <ProductGrid categoria={categoria || null} />

        {/* Reassurance WhatsApp Callout */}
        <div className="mt-16 max-w-2xl mx-auto p-5 rounded-2xl bg-white border border-brand-terracotta/20 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="text-sm font-semibold text-brand-charcoal">
              Dúvidas sobre qual vivência escolher?
            </p>
            <p className="text-xs text-brand-charcoal/65 mt-0.5">
              Converse conosco no WhatsApp para um acolhimento prévio e orientação.
            </p>
          </div>
          <a
            href="https://wa.me/5511917452732?text=Ol%C3%A1!%20Gostaria%20de%20tirar%20algumas%20d%C3%BAvidas%20sobre%20as%20viv%C3%AAncias%20do%20Instituto%20Kalapa."
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-4 py-2.5 rounded-xl bg-brand-purple/10 hover:bg-brand-purple/20 text-brand-purple text-xs font-semibold transition-colors flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4 text-brand-mint" />
            Conversar no WhatsApp
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
