"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative mt-20 md:mt-22 min-h-[300px] sm:min-h-[340px] md:min-h-[375px] flex items-center overflow-hidden bg-[#1E3323]">
      {/* Imagem panorâmica de fundo (deck de madeira e natureza ao sol) */}
      <Image
        src="/images/caminhos/hero-deck.jpg"
        alt="Espaço contemplativo do INstituto Kalapa cercado pela natureza"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Degradê suave à esquerda para leitura nítida do texto branco */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#1A2E1E]/92 via-[#233A27]/72 to-transparent"
        aria-hidden="true"
      />

      {/* Conteúdo Alinhado à Esquerda conforme Foto */}
      <div className="relative z-10 w-full max-w-[1340px] mx-auto px-6 sm:px-8 lg:px-12 py-10 sm:py-12 md:py-14">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl text-white"
        >
          {/* Marca com ícone de flor de lótus branco + título serifado */}
          <div className="flex items-center gap-3.5 mb-4">
            <svg
              className="w-11 h-11 sm:w-13 sm:h-13 text-white shrink-0"
              viewBox="0 0 48 48"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M24 8C19.5 15 17.5 21.5 17.5 28a6.5 6.5 0 0 0 13 0C30.5 21.5 28.5 15 24 8z" />
              <path d="M24 34.5c-8 0-14.5-4.5-17-12.5 7.5-1 14 2.2 17 12.5z" />
              <path d="M24 34.5c8 0 14.5-4.5 17-12.5-7.5-1-14 2.2-17 12.5z" />
            </svg>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-[46px] font-normal tracking-tight text-white leading-none">
              INstituto Kalapa
            </h1>
          </div>

          {/* Subheadline Principal */}
          <p className="text-lg sm:text-xl md:text-[23px] font-normal text-white leading-snug mb-3.5">
            Consciência para transformar a maneira
            <br className="hidden sm:inline" /> de viver, relacionar-se e trabalhar.
          </p>

          {/* Texto Descritivo Institucional */}
          <p className="text-xs sm:text-sm md:text-[14.5px] text-white/90 font-light leading-relaxed max-w-lg">
            Um espaço de desenvolvimento humano que integra psicologia,
            experiências de autoconhecimento e olhar sistêmico para ampliar a
            compreensão sobre si, suas relações e os desafios da vida e dos
            negócios.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
