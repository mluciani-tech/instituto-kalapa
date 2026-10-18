import Link from "next/link";
import Image from "next/image";
import { MapPin, MessageCircle, Mail, ExternalLink, Calendar } from "lucide-react";

export default function Footer() {
  const contatos = {
    endereco: "Alameda Tangara, 500 - Cotia - SP",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Alameda+Tangara+500+Cotia+SP",
    instagram: "https://instagram.com/institutoKalapa",
    instagramLabel: "@institutoKalapa",
    youtube: "https://youtube.com/@institutoKalapa",
    youtubeLabel: "@institutoKalapa",
    linkedin: "https://linkedin.com/company/instituto-kalapa",
    linkedinLabel: "INstituto Kalapa",
    email: "contato@institutokalapa.com.br",
    whatsapp:
      "https://wa.me/5511917452732?text=Ol%C3%A1!%20Gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20o%20INstituto%20Kalapa.",
    whatsappLabel: "(11) 91745-2732",
    erp: "https://espaco-serena-clinica.web.app/?return_url=https%3A%2F%2Fwww.institutokalapa.com.br&redirect_url=https%3A%2F%2Fwww.institutokalapa.com.br",
  };

  return (
    <footer className="relative bg-[#16271D] text-white/80 overflow-hidden font-sans border-t border-[#233A2B]">
      {/* Detalhe de textura sutil */}
      <div
        className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_50%_0%,#F8F4ED_1px,transparent_1px)] bg-[length:32px_32px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[1340px] mx-auto px-6 sm:px-8 lg:px-12 pt-14 pb-10">
        {/* Grid com 4 Colunas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          {/* Coluna 1: Marca e Propósito (4 colunas em lg) */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <div className="flex items-center gap-3.5 mb-4">
              <Image
                src="/images/caminhos/logo-kalapa-claro.png"
                alt="Logo INstituto Kalapa"
                width={56}
                height={56}
                className="w-12 h-12 object-contain shrink-0"
              />
              <div>
                <span className="font-serif text-2xl font-normal text-white tracking-tight block">
                  INstituto Kalapa
                </span>
                <span className="text-[11px] text-[#A3B899] tracking-wider uppercase font-medium">
                  Transformação Humana
                </span>
              </div>
            </div>

            <p className="text-sm text-white/70 leading-relaxed font-light mb-5 max-w-sm">
              Consciência para transformar a maneira de viver, relacionar-se e
              trabalhar. Um espaço que integra psicologia, olhar sistêmico e
              experiências de autoconhecimento.
            </p>

            <span className="text-xs text-white/45 tracking-wide">
              Ciência • Comportamento • Experiência • Consciência
            </span>
          </div>

          {/* Coluna 2: Navegação Rápida (2 colunas em lg) */}
          <div className="lg:col-span-2">
            <h3 className="font-serif text-lg font-medium text-white mb-4 tracking-tight">
              Navegação
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Início
                </Link>
              </li>
              <li>
                <Link
                  href="/#quatro-caminhos"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Quatro Caminhos
                </Link>
              </li>
              <li>
                <Link
                  href="/#conhecimento-experiencias"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Conhecimento
                </Link>
              </li>
              <li>
                <Link
                  href="/#sobre"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Sobre a Fundadora
                </Link>
              </li>
              <li>
                <Link
                  href="/produtos"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Serviços e Vivências
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Área do Cliente
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Espaço Físico / Localização (3 colunas em lg) */}
          <div className="lg:col-span-3">
            <h3 className="font-serif text-lg font-medium text-white mb-4 tracking-tight">
              Nosso Espaço
            </h3>
            <div className="flex items-start gap-3 text-sm text-white/75 mb-3 leading-relaxed">
              <MapPin className="w-5 h-5 text-[#B8965A] shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-white">Espaço Terapêutico</p>
                <p className="text-white/70">{contatos.endereco}</p>
                <p className="text-xs text-white/50 mt-1">
                  Ambiente acolhedor e seguro integrado à natureza.
                </p>
              </div>
            </div>

            <a
              href={contatos.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#B8965A] hover:text-[#d3ad6b] transition-colors mt-1 font-medium"
            >
              <span>Ver no Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Coluna 4: Contato & Redes Sociais (3 colunas em lg) */}
          <div className="lg:col-span-3">
            <h3 className="font-serif text-lg font-medium text-white mb-4 tracking-tight">
              Contato & Redes
            </h3>

            <div className="space-y-3 text-sm mb-5">
              <a
                href={contatos.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-white/75 hover:text-white transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#B8965A] group-hover:bg-white/20 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <span>{contatos.whatsappLabel}</span>
              </a>

              <a
                href={`mailto:${contatos.email}`}
                className="flex items-center gap-2.5 text-white/75 hover:text-white transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#B8965A] group-hover:bg-white/20 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-xs truncate max-w-[210px]" title={contatos.email}>
                  {contatos.email}
                </span>
              </a>
            </div>

            {/* Ícones de Redes Sociais */}
            <div className="pt-1">
              <span className="block text-xs uppercase tracking-wider text-white/50 mb-2.5 font-medium">
                Acompanhe o Instituto
              </span>
              <div className="flex items-center gap-2.5">
                <a
                  href={contatos.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  title="Instagram"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white transition-all duration-200 hover:-translate-y-0.5"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>

                <a
                  href={contatos.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  title="YouTube"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white transition-all duration-200 hover:-translate-y-0.5"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                    <polygon points="10 15 15 12 10 9 10 15" fill="currentColor" stroke="none" />
                  </svg>
                </a>

                <a
                  href={contatos.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  title="LinkedIn"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white transition-all duration-200 hover:-translate-y-0.5"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect width="4" height="12" x="2" y="9" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé Inferior: Copyright & Créditos */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/45">
          <p>© {new Date().getFullYear()} INstituto Kalapa. Todos os direitos reservados.</p>
          <div className="flex items-center gap-5">
            <a
              href={contatos.erp}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/70 transition-colors"
            >
              Espaço Sarawasti & Brahma
            </a>
            <span>•</span>
            <span>Espaço Terapêutico e Desenvolvimento Humano</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
