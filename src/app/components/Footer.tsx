export default function Footer() {
  return (
    <footer className="relative py-16 bg-brand-charcoal overflow-hidden">
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_50%_0%,#673de6_1px,transparent_1px)] bg-[length:30px_30px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Logo / Nome */}
        <div>
          <span className="text-white font-bold text-xl tracking-tight">
            INstituto Kalapa
          </span>
          <p className="text-white/30 text-sm mt-1">
            Transformação Comportamental
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center gap-6 text-white/40 text-sm">
          <a href="#" className="hover:text-white/70 transition-colors">
            Home
          </a>
          <a href="#experiencia" className="hover:text-white/70 transition-colors">
            Experiência
          </a>
          <a href="#inscricao" className="hover:text-white/70 transition-colors">
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
