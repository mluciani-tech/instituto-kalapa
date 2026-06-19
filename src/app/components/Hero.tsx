"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ShieldCheck, HeartHandshake } from "lucide-react";

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
        ease: [0.16, 1, 0.3, 1] as const, // easeOutExpo
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
            "url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')",
        }}
        role="img"
        aria-label="Pessoa em momento de introspecção, iluminada naturalmente em ambiente com tons terrosos e verde menta"
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
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 self-start px-4 py-2 rounded-full border border-white/20 glass-card"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-brand-mint animate-pulse" />
            <span className="text-sm font-medium text-white/90 tracking-wide">
              Grupos quinzenais — Presencial
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-white"
          >
            Você não precisa{" "}
            <span className="text-gradient">atravessar sozinho</span> o que sente
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed font-light"
          >
            No Instituto Kalapa, cada encontro quinzenal é um espaço seguro
            onde vozes se encontram, histórias se entrelaçam e a cura
            acontece de forma coletiva.{" "}
            <strong className="text-white/90 font-medium font-sans">
              Sua próxima sessão está a um passo.
            </strong>
          </motion.p>

          {/* CTA */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
            <a
              href="#inscricao"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-terracotta hover:bg-brand-terracotta-dark text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-brand-terracotta/25 hover:shadow-brand-terracotta/40 hover:-translate-y-0.5"
            >
              Quero participar do próximo grupo
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a
              href="#experiencia"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 hover:border-white/45 text-white font-medium rounded-xl transition-all duration-300 glass-card hover:bg-white/12"
            >
              Conheça a experiência
            </a>
          </motion.div>

          {/* Indicadores de confiança */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center gap-6 pt-4 text-white/50 text-sm"
          >
            <div className="flex items-center gap-2 hover:text-white/70 transition-colors duration-200">
              <CheckCircle2 className="w-4 h-4 text-brand-mint" />
              <span>Profissionais certificados</span>
            </div>
            <div className="flex items-center gap-2 hover:text-white/70 transition-colors duration-200">
              <HeartHandshake className="w-4 h-4 text-brand-mint" />
              <span>Ambiente seguro e sigiloso</span>
            </div>
            <div className="flex items-center gap-2 hover:text-white/70 transition-colors duration-200">
              <ShieldCheck className="w-4 h-4 text-brand-mint" />
              <span>Pagamento seguro via InfinitePay</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
