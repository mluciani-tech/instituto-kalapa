"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const imagens = [
  {
    titulo: "Apoio Mútuo",
    descricao:
      "Close cinematográfico nas mãos de duas pessoas em um gesto de acolhimento. Profundidade de campo rasa, iluminação natural suave entrando por uma janela, tons terrosos e quentes. A imagem transmite conexão humana genuína e segurança emocional.",
    src: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80",
    alt: "Duas pessoas em um gesto de apoio mútuo, mãos entrelaçadas em ambiente com iluminação suave",
  },
  {
    titulo: "Sala de Estar Terapêutica",
    descricao:
      "Cenário de sala moderna e minimalista onde as sessões acontecem. Poltronas confortáveis em círculo, iluminação difusa em verde menta, plantas naturais, grandes janelas com luz natural, tapete em tons areia. Atmosfera de paz e intimidade.",
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    alt: "Sala moderna e minimalista com poltronas confortáveis, plantas e luz natural",
  },
  {
    titulo: "Diversidade e Leveza",
    descricao:
      "Grupo diverso de pessoas sorrindo de forma natural e leve em um ambiente externo arborizado. Hora dourada, contraluz suave, roupas em tons neutros, expressões genuínas de bem-estar e pertencimento. A imagem celebra a união na diversidade.",
    src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80",
    alt: "Grupo diverso de pessoas sorrindo em ambiente externo arborizado",
  },
];

export default function VisualGallery() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <section className="relative py-24 md:py-32 bg-brand-offwhite overflow-hidden">
      {/* Textura de fundo */}
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_70%_30%,#CC6223_1px,transparent_1px)] bg-[length:50px_50px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-8">
        {/* Cabeçalho */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand-mint/20 text-brand-mint-dark text-sm font-semibold tracking-wide mb-6">
            Galeria Visual
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-brand-charcoal leading-tight max-w-3xl mx-auto">
            Cenários que{" "}
            <span className="text-gradient">acolhem</span> antes mesmo de você chegar
          </h2>
          <p className="mt-4 text-brand-charcoal/60 text-lg max-w-xl mx-auto">
            Cada detalhe do ambiente foi pensado para que você se sinta seguro,
            confortável e pronto para se conectar consigo mesmo e com os outros.
          </p>
        </motion.div>

        {/* Grid de imagens */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-6 md:gap-8"
        >
          {imagens.map((imagem) => (
            <motion.div
              key={imagem.titulo}
              variants={itemVariants}
              className="group cursor-default"
            >
              {/* Imagem real do Unsplash */}
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-5 bg-brand-charcoal/10">
                <Image
                  src={imagem.src}
                  alt={imagem.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />

                {/* Overlay vinheta */}
                <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.15)] pointer-events-none" />

                {/* Linhas cinematográficas (letterbox) */}
                <div className="absolute inset-x-0 top-0 h-[8%] bg-brand-charcoal/80 pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-[8%] bg-brand-charcoal/80 pointer-events-none" />

                {/* Reflexo sutil de lente */}
                <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-3xl pointer-events-none" />
              </div>

              {/* Descrição */}
              <h3 className="text-lg font-semibold text-brand-charcoal mb-2 group-hover:text-brand-purple transition-colors duration-300">
                {imagem.titulo}
              </h3>
              <p className="text-brand-charcoal/50 text-sm leading-relaxed">
                {imagem.descricao}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
