export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background cinematográfico com profundidade */}
      <div className="absolute inset-0 cinematic-gradient" />

      {/* Overlay com textura de grão cinematográfico */}
      <div className="absolute inset-0 cinematic-overlay" />

      {/* Imagem de fundo simulada — pessoa em introspecção */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')",
          backgroundBlendMode: "overlay",
        }}
        role="img"
        aria-label="Pessoa em momento de introspecção, iluminada naturalmente em ambiente com tons terrosos e verde menta"
      />

      {/* Vinheta cinematográfica */}
      <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.6)] pointer-events-none" />

      {/* Conteúdo */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-32 md:px-8">
        <div className="flex flex-col gap-8 md:gap-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 self-start px-4 py-2 rounded-full border border-white/20 glass-card">
            <div className="w-2 h-2 rounded-full bg-brand-mint animate-pulse" />
            <span className="text-sm font-medium text-white/90 tracking-wide">
              Grupos quinzenais — Presencial &amp; Online
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-white">
            Você não precisa{" "}
            <span className="text-gradient">atravessar sozinho</span> o que sente
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed font-light">
            No Instituto Kalapa, cada encontro quinzenal é um espaço seguro
            onde vozes se encontram, histórias se entrelaçam e a cura
            acontece de forma coletiva.{" "}
            <strong className="text-white/90 font-medium">
              Sua próxima sessão está a um passo.
            </strong>
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#inscricao"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-terracotta hover:bg-brand-terracotta-dark text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-brand-terracotta/25 hover:shadow-brand-terracotta/40 hover:-translate-y-0.5"
            >
              Quero participar do próximo grupo
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
            <a
              href="#experiencia"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 hover:border-white/40 text-white font-medium rounded-xl transition-all duration-300 glass-card hover:bg-white/12"
            >
              Conheça a experiência
            </a>
          </div>

          {/* Indicadores de confiança */}
          <div className="flex flex-wrap items-center gap-6 pt-4 text-white/50 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-brand-mint" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Profissionais certificados</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-brand-mint" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Ambiente seguro e sigiloso</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-brand-mint" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Pagamento seguro via InfinitePay</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
