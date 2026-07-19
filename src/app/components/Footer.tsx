export default function Footer() {
  return (
    <footer className="relative py-16 bg-brand-charcoal overflow-hidden">
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_50%_0%,#1A3C4D_1px,transparent_1px)] bg-[length:30px_30px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Logo / Nome */}
        <div className="flex items-center gap-4">
          <img
            src="/logo-kalapa.png"
            alt=""
            width={48}
            height={48}
            className="w-12 h-12 object-contain rounded-xl bg-brand-offwhite p-1.5 shadow-md shadow-black/20"
          />
          <div>
            <span className="text-white font-bold text-xl tracking-tight">
              INstituto Kalapa
            </span>
            <p className="text-white/30 text-sm mt-1">
              Transformação Comportamental
            </p>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-6 text-white/40 text-sm">
          <a
            href="#"
            className="px-3 py-2.5 rounded-lg hover:text-white/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta"
          >
            Home
          </a>
          <a
            href="#experiencia"
            className="px-3 py-2.5 rounded-lg hover:text-white/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta"
          >
            Experiência
          </a>
          <a
            href="#inscricao"
            className="px-3 py-2.5 rounded-lg hover:text-white/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta"
          >
            Inscrição
          </a>
        </div>

        {/* Copyright */}
        <div className="text-white/20 text-xs text-center md:text-right">
          <p>© {new Date().getFullYear()} INstituto Kalapa.</p>
          <p>Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
