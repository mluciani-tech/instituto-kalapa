"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ShieldCheck, HeartHandshake } from "lucide-react";
import BlurText from "@/components/ui/blur-text";

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-brand-charcoal">
      {/* Background cinematográfico com profundidade */}
      <div className="absolute inset-0 cinematic-gradient" />

      {/* Overlay com textura de grão cinematográfico */}
      <div className="absolute inset-0 cinematic-overlay" />

      {/* Imagem de fundo simulada — pessoa em introspecção */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity"
        style={{
          backgroundImage:
            "url('/fotoSiteHome.jpeg')",
        }}
        aria-hidden="true"
      />

      {/* Vinheta cinematográfica */}
      <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.7)] pointer-events-none" />

      {/* Conteúdo */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-20 md:py-32 md:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-8 md:gap-10"
        >
          {/* Headline com BlurText */}
          <motion.div variants={itemVariants}>
            <BlurText
              text="A dor pode marcar a sua história, mas ela não precisa definir a sua vida"
              animateBy="words"
              direction="bottom"
              delay={100}
              stepDuration={0.4}
              className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-white"
            />
          </motion.div>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed font-light"
          >
            O INstituto Kalapa é um espaço de acolhimento, ciência e humanidade,
            onde cada passo em direção à consciência abre caminho para uma{" "}
            <strong className="text-white/90 font-medium font-sans">
              transformação real.
            </strong>
            <br />
            Toda transformação começa na menor unidade:{" "}
            <strong className="text-white/90 font-medium font-sans">
              uma nova escolha.
            </strong>
          </motion.p>

          {/* CTA */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
            <a
              href="/produtos"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-terracotta hover:bg-brand-terracotta-dark text-white font-semibold rounded-xl transition-[background-color,box-shadow,transform] duration-300 shadow-lg shadow-brand-terracotta/25 hover:shadow-brand-terracotta/40 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-brand-purple-deep"
            >
              Vivência
              <ArrowRight aria-hidden="true" className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a
              href="#experiencia"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 hover:border-white/45 text-white font-medium rounded-xl transition-[background-color,border-color] duration-300 glass-card hover:bg-white/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-purple-deep"
            >
              Terapias Individuais
            </a>
            <a
              href="#sobre"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 hover:border-white/45 text-white font-medium rounded-xl transition-[background-color,border-color] duration-300 glass-card hover:bg-white/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-purple-deep"
            >
              Sobre o INstituto Kalapa
            </a>
          </motion.div>

          {/* Indicadores de confiança */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center gap-6 pt-4 text-white/60 text-sm"
          >
            <div className="flex items-center gap-2 hover:text-white/80 transition-colors duration-200">
              <CheckCircle2 aria-hidden="true" className="w-4 h-4 text-brand-mint" />
              <span>Profissionais certificados</span>
            </div>
            <div className="flex items-center gap-2 hover:text-white/80 transition-colors duration-200">
              <HeartHandshake aria-hidden="true" className="w-4 h-4 text-brand-mint" />
              <span>Ambiente seguro e sigiloso</span>
            </div>
            <div className="flex items-center gap-2 hover:text-white/80 transition-colors duration-200">
              <ShieldCheck aria-hidden="true" className="w-4 h-4 text-brand-mint" />
              <span>Pagamento seguro via InfinitePay</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
