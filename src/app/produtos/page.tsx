import { Metadata } from "next";
import ProductGrid from "../components/ProductGrid";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Produtos — INstituto Kalapa",
  description:
    "Conheça nossos serviços e encontre a experiência ideal para o seu momento de autoconhecimento.",
};

export default function ProdutosPage() {
  return (
    <main className="min-h-screen bg-brand-offwhite">
      {/* Header */}
      <section className="relative pt-24 pb-12 bg-brand-charcoal overflow-hidden">
        <div className="absolute inset-0 cinematic-gradient opacity-60" />
        <div className="absolute inset-0 cinematic-overlay" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white/80 text-sm font-medium tracking-wide mb-6">
            ✦ Nossos serviços
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 font-sans">
            Escolha a experiência ideal{" "}
            <span className="text-gradient">para você</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Cada sessão é um convite à transformação. Selecione o serviço que
            mais ressoa com o seu momento.
          </p>
        </div>
      </section>

      {/* Catálogo */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <ProductGrid />
      </section>

      <Footer />
    </main>
  );
}
