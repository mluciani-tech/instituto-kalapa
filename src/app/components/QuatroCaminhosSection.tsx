"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Gamepad2, BookOpen, CalendarDays } from "lucide-react";

interface CaminhoCard {
  id: string;
  titulo: string;
  subtitulo: string;
  descricao: string;
  ctaTexto: string;
  href: string;
  imagem: string;
  imagemAlt: string;
  bgClass: string;
  borderBadgeClass: string;
  icone: React.ReactNode;
}

const caminhos: CaminhoCard[] = [
  {
    id: "psicoterapia",
    titulo: "Psicoterapia",
    subtitulo: "Busco psicoterapia e cuidado emocional.",
    descricao:
      "Atendimentos individuais e outros formatos, com equipe qualificada e abordagem integrativa.",
    ctaTexto: "Conheça os atendimentos",
    href: "/produtos?categoria=atendimentos",
    imagem: "/images/caminhos/psicoterapia.jpg",
    imagemAlt: "Consultório acolhedor de psicoterapia no INstituto Kalapa",
    bgClass: "bg-[#EAE8DF]",
    borderBadgeClass: "border-[#EAE8DF]",
    icone: (
      <svg
        className="w-6 h-6 text-white"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
        <path d="M8.5 12h2l1.5 -2.5l1.5 4.5l1.5 -2h1.5" />
      </svg>
    ),
  },
  {
    id: "vivencias",
    titulo: "Vivências",
    subtitulo: "Quero viver experiências de autoconhecimento.",
    descricao:
      "Constelação, grupos, práticas contemplativas e experiências transformadoras.",
    ctaTexto: "Encontre sua próxima vivência",
    href: "/produtos?categoria=vivencias",
    imagem: "/images/caminhos/vivencias.jpg",
    imagemAlt: "Roda de vivência em grupo na natureza",
    bgClass: "bg-[#EAE8DF]",
    borderBadgeClass: "border-[#EAE8DF]",
    icone: (
      <svg
        className="w-6 h-6 text-white"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="8" r="2.75" />
        <path d="M7.5 18.5v-1a4.5 4.5 0 0 1 9 0v1" />
        <circle cx="6" cy="10" r="2" />
        <path d="M3 18.5v-.8a3 3 0 0 1 3 -3" />
        <circle cx="18" cy="10" r="2" />
        <path d="M21 18.5v-.8a3 3 0 0 0 -3 -3" />
      </svg>
    ),
  },
  {
    id: "lideranca",
    titulo: "Liderança e Empreendedorismo",
    subtitulo: "Quero desenvolver minha liderança ou meu negócio.",
    descricao:
      "Consultoria sistêmica empresarial, desenvolvimento de líderes e encontros para empreendedores.",
    ctaTexto: "Amplie sua visão sobre o negócio",
    href: "/produtos?categoria=empreendedorismo",
    imagem: "/images/caminhos/lideranca.jpg",
    imagemAlt: "Encontro de liderança e empreendedorismo",
    bgClass: "bg-[#EFE7DC]",
    borderBadgeClass: "border-[#EFE7DC]",
    icone: (
      <svg
        className="w-6 h-6 text-white"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="8" />
        <polygon points="14.5 9.5 13 13 9.5 14.5 11 11 14.5 9.5" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
      </svg>
    ),
  },
  {
    id: "formacao",
    titulo: "Formação e Supervisão Profissional",
    subtitulo: "Sou terapeuta e busco formação ou supervisão.",
    descricao:
      "Cursos, treinamentos, aprofundamento e supervisão para profissionais do cuidado humano.",
    ctaTexto: "Aprofunde sua prática profissional",
    href: "/produtos?categoria=formacao",
    imagem: "/images/caminhos/formacao.jpg",
    imagemAlt: "Formação e supervisão para terapeutas e profissionais",
    bgClass: "bg-[#EAE8EC]",
    borderBadgeClass: "border-[#EAE8EC]",
    icone: (
      <svg
        className="w-6 h-6 text-white"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" />
      </svg>
    ),
  },
];

const itensConhecimento = [
  {
    id: "testes",
    titulo: "Testes de autoconhecimento",
    subtitulo: "(Eneagrama, Cronotipo e mais)",
    href: "/teste-autoconhecimento",
    icone: (
      <svg
        className="w-7 h-7 text-[#485742]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 4c-2 3-3 6-3 9a3 3 0 0 0 6 0c0-3-1-6-3-9z" />
        <path d="M12 16c-3.5 0-6.5-2-8-5.5 3.5-.5 6.5 1 8 5.5z" />
        <path d="M12 16c3.5 0 6.5-2 8-5.5-3.5-.5-6.5 1-8 5.5z" />
        <path d="M7 19h10" />
      </svg>
    ),
  },
  {
    id: "calendario",
    titulo: "Calendário",
    subtitulo: "(Programação e próximos encontros)",
    href: "/produtos?categoria=calendario",
    icone: <CalendarDays className="w-7 h-7 text-[#485742]" strokeWidth={1.4} />,
  },
  {
    id: "receitas",
    titulo: "Receitas das vivências",
    subtitulo: "(Terapêuticas e saudáveis)",
    href: "/produtos?categoria=receitas",
    icone: (
      <svg
        className="w-7 h-7 text-[#485742]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M4 12h16a7 7 0 0 1-7 7h-2a7 7 0 0 1-7-7z" />
        <path d="M8 19h8" />
        <path d="M14.5 5.5L11 12" />
        <path d="M8 8c.5-1.5 2-2.5 3.5-2" />
      </svg>
    ),
  },
  {
    id: "jogos",
    titulo: "Jogos de Autoconhecimento",
    subtitulo: "(Metamorfose e Jornadas)",
    href: "/jogo-sistemico",
    icone: <Gamepad2 className="w-7 h-7 text-[#485742]" strokeWidth={1.4} />,
  },
  {
    id: "biblioteca",
    titulo: "Biblioteca Kalapa",
    subtitulo: "(Artigos, Guias e Downloads)",
    href: "/produtos?categoria=biblioteca",
    icone: <BookOpen className="w-7 h-7 text-[#485742]" strokeWidth={1.4} />,
  },
];

export default function QuatroCaminhosSection() {

  return (
    <section
      id="quatro-caminhos"
      className="relative pt-8 sm:pt-10 md:pt-12 bg-[#F7F5EE] text-[#214137] overflow-hidden"
    >
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-10">
        {/* Título Principal */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 sm:mb-8"
        >
          <h2 className="font-serif text-2xl sm:text-3xl md:text-[34px] font-medium text-[#214137] tracking-tight">
            Encontre o caminho que faz sentido para o seu momento.
          </h2>
        </motion.div>

        {/* Grid dos 4 Cards Principais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {caminhos.map((card, idx) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: idx * 0.08 }}
              className="h-full"
            >
              <Link
                href={card.href}
                className={`group flex flex-col h-full rounded-2xl overflow-hidden ${card.bgClass} border border-black/[0.04] shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#214137] focus-visible:ring-offset-2`}
              >
                {/* Imagem de Topo */}
                <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-[#D9D6CA]">
                  <Image
                    src={card.imagem}
                    alt={card.imagemAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                {/* Ícone Circular Sobreposto */}
                <div className="px-6">
                  <div
                    className={`relative z-10 -mt-8 w-14 h-14 rounded-full bg-[#485742] border-[3px] ${card.borderBadgeClass} flex items-center justify-center shadow-sm`}
                  >
                    <div className="w-11 h-11 rounded-full border border-white/75 flex items-center justify-center">
                      {card.icone}
                    </div>
                  </div>
                </div>

                {/* Conteúdo do Card */}
                <div className="px-6 pt-3 pb-6 flex-1 flex flex-col">
                  <h3 className="text-xl sm:text-[22px] font-medium text-[#214137] leading-snug tracking-tight mb-2">
                    {card.titulo}
                  </h3>

                  <p className="text-[13.5px] sm:text-[14px] font-semibold text-[#214137] leading-snug mb-3">
                    {card.subtitulo}
                  </p>

                  <p className="text-xs sm:text-[13px] text-[#3B4D44]/90 leading-relaxed mb-6 flex-1">
                    {card.descricao}
                  </p>

                  <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#214137] group-hover:text-[#152B24] mt-auto">
                    <span>{card.ctaTexto}</span>
                    <ArrowRight
                      aria-hidden="true"
                      className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Faixa Inferior: Conhecimento e Experiências (Esquerda) + Quatro caminhos. Uma essência. (Direita) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch"
        >
          {/* Card Esquerdo (9 colunas em telas grandes para acomodar 5 itens com conforto): Conhecimento e experiências */}
          <div className="lg:col-span-8 xl:col-span-9 rounded-2xl bg-[#FDFCF8] border border-[#E6E3D8] px-4 sm:px-6 py-5 sm:py-6 shadow-xs flex flex-col xl:flex-row items-center justify-between gap-5">
            {/* Bloco Esquerdo do Card: Símbolo Oficial Kalapa + Título + Botão */}
            <div className="flex items-center gap-3.5 sm:gap-4 w-full xl:w-auto xl:max-w-[295px] shrink-0">
              <div className="shrink-0 hidden sm:flex items-center justify-center">
                <Image
                  src="/images/caminhos/logo-kalapa-escuro.png"
                  alt="Símbolo INstituto Kalapa"
                  width={52}
                  height={52}
                  className="w-11 h-11 sm:w-12 sm:h-12 object-contain"
                />
              </div>

              <div className="hidden sm:block w-px self-stretch bg-[#E2DFD5]" />

              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-serif text-lg sm:text-[20px] font-semibold text-[#214137] leading-tight">
                  Conhecimento e experiências
                </h3>
                <p className="text-xs text-[#3B4D44]/85 mt-1 mb-3 leading-relaxed">
                  Testes, calendário, receitas, jogos e conteúdos para inspirar sua jornada.
                </p>
                <Link
                  href="/produtos?categoria=biblioteca"
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-full border border-[#485742]/55 text-[#214137] text-xs font-medium hover:bg-[#485742] hover:text-white transition-colors cursor-pointer"
                >
                  <span>Acessar a Biblioteca Kalapa</span>
                  <ArrowRight aria-hidden="true" className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* 5 Mini-Colunas de Categorias de Conteúdo */}
            <div className="w-full xl:w-auto flex-1 grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-0 sm:divide-x sm:divide-[#E6E3DA]">
              {itensConhecimento.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="group px-2 sm:px-2.5 py-2 flex flex-col items-center text-center rounded-xl sm:rounded-none hover:bg-[#F4F1E8]/80 transition-colors cursor-pointer"
                >
                  <div className="mb-2 transition-transform duration-300 group-hover:-translate-y-0.5">
                    {item.icone}
                  </div>
                  <span className="text-[11.5px] sm:text-xs font-semibold text-[#214137] leading-snug mb-1 group-hover:text-[#152B24]">
                    {item.titulo}
                  </span>
                  <span className="text-[10.5px] text-[#3B4D44]/75 leading-tight">
                    {item.subtitulo}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Card Direito (3 colunas em xl): Quatro caminhos. Uma essência. */}
          <div className="lg:col-span-4 xl:col-span-3 rounded-2xl overflow-hidden relative bg-[#DCE1D4] border border-[#D3D9C9] shadow-xs flex items-center min-h-[175px]">
            {/* Imagem Botânica de Fundo Contínua */}
            <Image
              src="/images/caminhos/folhas-essencia.jpg"
              alt="Folhas naturais simbolizando a essência do INstituto Kalapa"
              fill
              sizes="(max-width: 1024px) 100vw, 28vw"
              className="object-cover object-[18%_center]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#DCE1D4]/80 to-[#E5E8DE]/95" />

            {/* Texto Conceitual à Direita */}
            <div className="relative z-10 w-full py-4 pr-4 pl-24 sm:pl-28 xl:pl-24 flex flex-col justify-center">
              <h3 className="font-serif italic text-lg sm:text-[21px] font-medium text-[#2A3F33] leading-tight mb-1.5">
                Quatro caminhos.
                <br />
                Uma essência.
              </h3>
              <p className="text-[11.5px] text-[#2E4036]/90 leading-relaxed mb-2.5">
                Ampliar a consciência para construir novas possibilidades de
                viver, relacionar-se e trabalhar.
              </p>
              <span className="text-[11.5px] font-semibold text-[#214137] tracking-wide mt-auto">
                INstituto Kalapa
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
