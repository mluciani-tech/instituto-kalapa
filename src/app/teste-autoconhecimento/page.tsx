import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import Footer from "../components/Footer";
import TesteCardsGrid from "./components/TesteCardsGrid";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";
import type { Produto } from "@/lib/types";

export const metadata = {
  title: "Testes de Autoconhecimento — INstituto Kalapa",
  description:
    "Explore avaliações terapêuticas e diagnósticas de autoconhecimento: Predominância Yin-Yang da Medicina Tradicional Chinesa, Teste de Personalidade do Eneagrama e Teste de Cronotipo & Ritmo Biológico no INstituto Kalapa.",
};

export const dynamic = "force-dynamic";

export default async function TesteAutoconhecimentoPage() {
  let produtosTestes: Produto[] = [];

  if (isAdminConfigured()) {
    try {
      const { data } = await supabaseAdmin!
        .from("produtos")
        .select("*")
        .or("is_teste.eq.true,categoria.eq.testes,slug.in.(teste-yin-yang,teste-eneagrama,teste-cronotipo)")
        .eq("ativo", true)
        .order("ordem", { ascending: true });

      if (data) {
        produtosTestes = data;
      }
    } catch (err) {
      console.warn("[teste-autoconhecimento] Erro ao buscar produtos de teste:", err);
    }
  }

  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#1A3C4D] flex flex-col justify-between pt-24 sm:pt-28">
      {/* Top Banner Hero */}
      <section className="relative w-full border-b border-[#E8DEC8]/60 bg-gradient-to-b from-[#F7F3E9] to-[#FDFBF7] py-12 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_50%_50%,#B8965A_1px,transparent_1px)] bg-[length:32px_32px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#B8965A]/15 text-[#B8965A] text-xs sm:text-sm font-medium tracking-wide mb-4 backdrop-blur-sm border border-[#B8965A]/25">
            <Sparkles className="w-4 h-4 text-[#B8965A]" />
            <span>Jornada de Consciência • INstituto Kalapa</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-[#1A3C4D] tracking-tight mb-4 leading-tight">
            Mapeie o seu mundo interno através de{" "}
            <span className="italic font-normal text-[#B8965A]">
              escolhas conscientes
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#1A3C4D]/80 leading-relaxed font-light">
            O autoconhecimento é o primeiro passo para toda transformação real.
            Escolha uma das avaliações abaixo e receba um diagnóstico exclusivo,
            científico e acolhedor para guiar seu bem-estar.
          </p>
        </div>
      </section>

      {/* Grid de Escolha dos Testes Dinâmico */}
      <section className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <TesteCardsGrid produtosDb={produtosTestes} />

        {/* Banner de acolhimento e segurança */}
        <div className="mt-12 sm:mt-16 bg-[#F8F4ED] rounded-2xl p-6 border border-[#E8DEC8] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#B8965A] shadow-xs shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#1A3C4D]">Espaço Seguro e Confidencial</h3>
              <p className="text-xs text-[#1A3C4D]/70 font-light">
                Seus dados e respostas são preservados com total sigilo pelo INstituto Kalapa.
              </p>
            </div>
          </div>
          <Link
            href="/produtos?categoria=vivencias"
            className="text-xs font-semibold text-[#B8965A] hover:underline flex items-center gap-1 shrink-0"
          >
            Conheça nossas Vivências presenciais <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
