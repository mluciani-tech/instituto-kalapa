"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BentoGrid } from "@/components/ui/bento-grid";
import CardHoverEffect from "@/components/ui/card-hover-effect";
import SplitText from "@/components/ui/split-text";
import { Camera, Home, Users } from "lucide-react";

const imagens = [
  {
    titulo: "Apoio Mútuo",
    descricao:
      "Close cinematográfico nas mãos de duas pessoas em um gesto de acolhimento. Profundidade de campo rasa, iluminação natural suave entrando por uma janela, tons terrosos e quentes.",
    src: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80",
    alt: "Duas pessoas em um gesto de apoio mútuo, mãos entrelaçadas em ambiente com iluminação suave",
    icon: Camera,
    className: "",
  },
  {
    titulo: "Sala de Estar Terapêutica",
    descricao:
      "Cenário de sala moderna e minimalista onde as sessões acontecem. Poltronas confortáveis em círculo, iluminação difusa em verde menta.",
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    alt: "Sala moderna e minimalista com poltronas confortáveis, plantas e luz natural",
    icon: Home,
    className: "md:col-span-1",
  },
  {
    titulo: "Diversidade e Leveza",
    descricao:
      "Grupo diverso de pessoas sorrindo de forma natural e leve em um ambiente externo arborizado. Hora dourada, contraluz suave.",
    src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80",
    alt: "Grupo diverso de pessoas sorrindo em ambiente externo arborizado",
    icon: Users,
    className: "md:col-span-1",
  },
];

export default function VisualGallery() {
  return (
    <section className="relative py-24 md:py-32 bg-brand-offwhite overflow-hidden">
      {/* Textura de fundo */}
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_70%_30%,#B8965A_1px,transparent_1px)] bg-[length:50px_50px]" />

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
          <SplitText
            text="Cenários que acolhem antes mesmo de você chegar"
            tag="h2"
            className="text-3xl md:text-5xl font-bold text-brand-charcoal leading-tight max-w-3xl mx-auto"
            splitType="words"
            delay={80}
            duration={0.8}
          />
          <p className="mt-4 text-brand-charcoal/60 text-lg max-w-xl mx-auto">
            Cada detalhe do ambiente foi pensado para que você se sinta seguro,
            confortável e pronto para se conectar consigo mesmo e com os outros.
          </p>
        </motion.div>

        {/* Grid Bento de imagens */}
        <BentoGrid className="grid-cols-1 md:grid-cols-3 auto-rows-auto">
          {imagens.map((imagem, index) => (
            <motion.div
              key={imagem.titulo}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={imagem.className}
            >
              <CardHoverEffect
                overlayColor="rgba(26, 60, 77, 0.08)"
                className="h-full"
              >
                <div className="group cursor-default h-full">
                  {/* Imagem real do Unsplash */}
                  <div className="relative overflow-hidden rounded-xl mb-5 bg-brand-charcoal/10 aspect-[4/5]">
                    <Image
                      src={imagem.src}
                      alt={imagem.alt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />

                    {/* Overlay vinheta */}
                    <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.15)] pointer-events-none" />

                    {/* Linhas cinematográficas (letterbox) */}
                    <div className="absolute inset-x-0 top-0 h-[6%] md:h-[8%] bg-brand-charcoal/80 pointer-events-none" />
                    <div className="absolute inset-x-0 bottom-0 h-[6%] md:h-[8%] bg-brand-charcoal/80 pointer-events-none" />

                    {/* Reflexo sutil de lente */}
                    <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-3xl pointer-events-none" />

                    {/* Overlay de hover */}
                    <div className="absolute inset-0 bg-brand-purple-deep/0 group-hover:bg-brand-purple-deep/20 transition-colors duration-500 pointer-events-none" />
                  </div>

                  {/* Descrição */}
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-brand-purple-light text-brand-purple group-hover:bg-brand-purple group-hover:text-white transition-colors duration-300">
                      <imagem.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-brand-charcoal mb-1 group-hover:text-brand-purple transition-colors duration-300">
                        {imagem.titulo}
                      </h3>
                      <p className="text-brand-charcoal/50 text-sm leading-relaxed">
                        {imagem.descricao}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHoverEffect>
            </motion.div>
          ))}
        </BentoGrid>
      </div>
    </section>
  );
}
