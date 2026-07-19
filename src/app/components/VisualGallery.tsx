"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const fotos = [
  { src: "/foto1.jpg", alt: "Apoio mútuo — mãos em gesto de acolhimento", className: "md:col-span-1 md:row-span-1" },
  { src: "/foto2.jpg", alt: "Espaço terapêutico do Instituto Kalapa", className: "md:col-span-1 md:row-span-1" },
  { src: "/foto3.jpg", alt: "Vivência em grupo ao ar livre", className: "md:col-span-1 md:row-span-1" },
  { src: "/foto4.jpg", alt: "Momento de introspecção com velas", className: "md:col-span-1 md:row-span-1" },
  { src: "/foto5.jpg", alt: "Trabalho com crianças", className: "md:col-span-1 md:row-span-1" },
  { src: "/foto6.jpg", alt: "Rodas de conversa e autoconhecimento", className: "md:col-span-1 md:row-span-1" },
  { src: "/foto6a.jpg", alt: "Vivência ao ar livre", className: "md:col-span-1 md:row-span-1" },
  { src: "/foto7.jpg", alt: "Vivência noturna em grupo", className: "md:col-span-1 md:row-span-1" },
  { src: "/foto8.jpg", alt: "Grupo do Instituto Kalapa", className: "md:col-span-1 md:row-span-1" },
  { src: "/foto9.jpg", alt: "Sessão ao ar livre", className: "md:col-span-1 md:row-span-1" },
  { src: "/foto_10.jpg", alt: "Acolhimento e conexão", className: "md:col-span-1 md:row-span-1" },
  { src: "/foto11.jpg", alt: "Momento de vivência", className: "md:col-span-1 md:row-span-1" },
];

export default function VisualGallery() {
  return (
    <section className="relative py-24 md:py-32 bg-brand-offwhite overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_70%_30%,#B8965A_1px,transparent_1px)] bg-[length:50px_50px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-8">
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
            Não oferecemos respostas prontas. Criamos experiências que ampliam a consciência e revelam novas possibilidades de viver.
          </h2>
          <p className="mt-4 text-brand-charcoal/60 text-lg max-w-xl mx-auto">
            Há mais de 10 anos, criamos experiências que transformam pessoas,
            famílias, relações e organizações, despertando consciência e novos caminhos.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {fotos.map((foto, index) => (
            <motion.div
              key={foto.src}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                delay: index * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={foto.className}
            >
              <div className="group relative overflow-hidden rounded-xl bg-brand-charcoal/10 aspect-square cursor-default">
                <Image
                  src={foto.src}
                  alt={foto.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-brand-purple-deep/0 group-hover:bg-brand-purple-deep/20 transition-colors duration-500 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
