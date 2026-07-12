"use client";

import { motion } from "framer-motion";
import { Heart, Users, Sparkles, Clock, Quote } from "lucide-react";

export default function GroupExperience() {
  const beneficios = [
    {
      titulo: "Acolhimento genuíno",
      descricao:
        "Cada pessoa que chega é recebida sem julgamento. Aqui sua história é ouvida com respeito, criando um espaço onde você pode ser exatamente quem é.",
      icone: <Heart className="w-6 h-6" />,
    },
    {
      titulo: "Sentimento de pertencimento",
      descricao:
        "A terapia em grupo dissolve o isolamento. Ao ouvir outras perspectivas, você descobre que suas questões são compartilhadas — e que ninguém está sozinho nessa caminhada.",
      icone: <Users className="w-6 h-6" />,
    },
    {
      titulo: "Cura coletiva",
      descricao:
        "Quando um participante avança, todos evoluem juntos. A força do grupo potencializa transformações que individualmente levariam muito mais tempo.",
      icone: <Sparkles className="w-6 h-6" />,
    },
    {
      titulo: "Ritmo quinzenal consciente",
      descricao:
        "Encontros a cada 15 dias respeitam seu tempo de processamento. Entre uma sessão e outra, você integra os aprendizados à vida real, no seu ritmo.",
      icone: <Clock className="w-6 h-6" />,
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <section id="experiencia" className="relative py-24 md:py-32 bg-brand-offwhite overflow-hidden">
      {/* Textura de fundo sutil */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_50%_50%,#1A3C4D_1px,transparent_1px)] bg-[length:40px_40px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-8">
        {/* Cabeçalho */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand-purple-light text-brand-purple-dark text-sm font-semibold tracking-wide mb-6">
            A Experiência do Grupo
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-brand-charcoal leading-tight max-w-3xl mx-auto">
            A transformação que nasce do{" "}
            <span className="text-gradient">encontro entre almas</span>
          </h2>
          <p className="mt-6 text-lg text-brand-charcoal/60 max-w-2xl mx-auto leading-relaxed">
            As sessões em grupo do INstituto Kalapa são conduzidas por
            profissionais experientes, em um ambiente cuidadosamente preparado
            para promover segurança, escuta ativa e evolução conjunta.
          </p>
        </motion.div>

        {/* Grid de benefícios */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 gap-8 md:gap-10 mb-16"
        >
          {beneficios.map((beneficio) => (
            <motion.div
              key={beneficio.titulo}
              variants={cardVariants}
              className="flex gap-5 p-6 md:p-8 rounded-2xl glass-card-light hover:bg-white/90 transition-all duration-300 group"
            >
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-brand-purple-light text-brand-purple group-hover:bg-brand-purple group-hover:text-white transition-colors duration-300">
                {beneficio.icone}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-brand-charcoal mb-2">
                  {beneficio.titulo}
                </h3>
                <p className="text-brand-charcoal/60 leading-relaxed">
                  {beneficio.descricao}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Citação / Destaque */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-br from-brand-purple-deep via-brand-purple-dark to-brand-purple text-white text-center overflow-hidden"
        >
          {/* Decoração de fundo do card */}
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -left-10 -top-10 w-40 h-40 bg-brand-mint/10 rounded-full blur-2xl pointer-events-none" />

          <Quote className="w-10 h-10 mx-auto mb-6 opacity-30 text-brand-mint" />
          <p className="text-xl md:text-2xl font-light leading-relaxed max-w-3xl mx-auto mb-4 relative z-10">
            &ldquo;A dor que você carrega não precisa ser silenciosa. No
            grupo, ela encontra eco, acolhimento e, aos poucos, se transforma
            em força.&rdquo;
          </p>
          <p className="text-white/60 font-medium relative z-10">
            — Equipe INstituto Kalapa
          </p>
        </motion.div>
      </div>
    </section>
  );
}
