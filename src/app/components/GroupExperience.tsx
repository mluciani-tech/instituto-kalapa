export default function GroupExperience() {
  const beneficios = [
    {
      titulo: "Acolhimento genuíno",
      descricao:
        "Cada pessoa que chega é recebida sem julgamento. Aqui sua história é ouvida com respeito, criando um espaço onde você pode ser exatamente quem é.",
      icone: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      ),
    },
    {
      titulo: "Sentimento de pertencimento",
      descricao:
        "A terapia em grupo dissolve o isolamento. Ao ouvir outras perspectivas, você descobre que suas questões são compartilhadas — e que ninguém está sozinho nessa caminhada.",
      icone: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      titulo: "Cura coletiva",
      descricao:
        "Quando um participante avança, todos evoluem juntos. A força do grupo potencializa transformações que individualmente levariam muito mais tempo.",
      icone: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
    {
      titulo: "Ritmo quinzenal consciente",
      descricao:
        "Encontros a cada 15 dias respeitam seu tempo de processamento. Entre uma sessão e outra, você integra os aprendizados à vida real, no seu ritmo.",
      icone: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <section id="experiencia" className="relative py-24 md:py-32 bg-brand-offwhite overflow-hidden">
      {/* Textura de fundo sutil */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_50%_50%,#673de6_1px,transparent_1px)] bg-[length:40px_40px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-8">
        {/* Cabeçalho */}
        <div className="text-center mb-16 md:mb-20">
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand-purple-light text-brand-purple-dark text-sm font-semibold tracking-wide mb-6">
            A Experiência do Grupo
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-brand-charcoal leading-tight max-w-3xl mx-auto">
            A transformação que nasce do{" "}
            <span className="text-gradient">encontro entre almas</span>
          </h2>
          <p className="mt-6 text-lg text-brand-charcoal/60 max-w-2xl mx-auto leading-relaxed">
            As sessões em grupo do Instituto Kalapa são conduzidas por
            profissionais experientes, em um ambiente cuidadosamente preparado
            para promover segurança, escuta ativa e evolução conjunta.
          </p>
        </div>

        {/* Grid de benefícios */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-10 mb-16">
          {beneficios.map((beneficio) => (
            <div
              key={beneficio.titulo}
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
            </div>
          ))}
        </div>

        {/* Citação / Destaque */}
        <div className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-br from-brand-purple-deep via-brand-purple-dark to-brand-purple text-white text-center">
          <svg
            className="w-10 h-10 mx-auto mb-6 opacity-30"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.73-9.57 8.983-10.609l.995 2.151C7.545 6.068 5.983 8.789 5.983 11H10v10H0z" />
          </svg>
          <p className="text-xl md:text-2xl font-light leading-relaxed max-w-3xl mx-auto mb-4">
            &ldquo;A dor que você carrega não precisa ser silenciosa. No
            grupo, ela encontra eco, acolhimento e, aos poucos, se transforma
            em força.&rdquo;
          </p>
          <p className="text-white/60 font-medium">
            — Equipe Instituto Kalapa
          </p>
        </div>
      </div>
    </section>
  );
}
