"use client";

import { useState, type FormEvent } from "react";

export default function RegistrationForm() {
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setEnviado(true);
  };

  return (
    <section id="inscricao" className="relative py-24 md:py-32 bg-brand-beige overflow-hidden">
      {/* Textura de fundo */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_20%_80%,#673de6_1px,transparent_1px)] bg-[length:35px_35px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-8">
        {/* Cabeçalho */}
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand-terracotta/15 text-brand-terracotta text-sm font-semibold tracking-wide mb-6">
            Faça sua inscrição
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-brand-charcoal leading-tight max-w-3xl mx-auto">
            O primeiro passo é{" "}
            <span className="text-gradient">dizer sim</span> para você
          </h2>
          <p className="mt-4 text-brand-charcoal/60 text-lg max-w-xl mx-auto leading-relaxed">
            Preencha o formulário abaixo e nossa equipe entrará em contato
            para confirmar sua vaga na próxima sessão em grupo.
          </p>
        </div>

        {/* Formulário */}
        {enviado ? (
          <div className="text-center py-16 glass-card-light rounded-2xl">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-brand-mint/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-brand-mint-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-brand-charcoal mb-3">
              Recebemos sua inscrição!
            </h3>
            <p className="text-brand-charcoal/60 max-w-md mx-auto leading-relaxed">
              Em breve nossa equipe entrará em contato pelo WhatsApp para
              confirmar os detalhes da sua participação. Fique atento.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="glass-card-light rounded-2xl p-8 md:p-12 space-y-6"
          >
            {/* Nome */}
            <div>
              <label
                htmlFor="nome"
                className="block text-sm font-semibold text-brand-charcoal mb-2"
              >
                Nome completo
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                required
                placeholder="Seu nome"
                className="w-full px-4 py-3.5 rounded-xl border border-brand-charcoal/10 bg-white/80 placeholder:text-brand-charcoal/30 text-brand-charcoal focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/10 transition-all duration-200"
              />
            </div>

            {/* E-mail */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-brand-charcoal mb-2"
              >
                E-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="seu@email.com"
                className="w-full px-4 py-3.5 rounded-xl border border-brand-charcoal/10 bg-white/80 placeholder:text-brand-charcoal/30 text-brand-charcoal focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/10 transition-all duration-200"
              />
            </div>

            {/* Telefone (WhatsApp) */}
            <div>
              <label
                htmlFor="telefone"
                className="flex items-center gap-2 text-sm font-semibold text-brand-charcoal mb-2"
              >
                WhatsApp
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </label>
              <input
                type="tel"
                id="telefone"
                name="telefone"
                required
                placeholder="(00) 00000-0000"
                className="w-full px-4 py-3.5 rounded-xl border border-brand-charcoal/10 bg-white/80 placeholder:text-brand-charcoal/30 text-brand-charcoal focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/10 transition-all duration-200"
              />
            </div>

            {/* Motivação */}
            <div>
              <label
                htmlFor="motivacao"
                className="block text-sm font-semibold text-brand-charcoal mb-2"
              >
                O que você busca com esta sessão?
              </label>
              <textarea
                id="motivacao"
                name="motivacao"
                rows={4}
                required
                placeholder="Compartilhe brevemente o que te trouxe até aqui..."
                className="w-full px-4 py-3.5 rounded-xl border border-brand-charcoal/10 bg-white/80 placeholder:text-brand-charcoal/30 text-brand-charcoal focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/10 transition-all duration-200 resize-none"
              />
            </div>

            {/* Botão */}
            <button
              type="submit"
              className="w-full py-4 bg-brand-terracotta hover:bg-brand-terracotta-dark text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-brand-terracotta/25 hover:shadow-brand-terracotta/40 text-lg"
            >
              Enviar inscrição
            </button>

            {/* Nota */}
            <p className="text-center text-brand-charcoal/30 text-xs">
              Seus dados estão seguros e serão usados exclusivamente para contato
              sobre as sessões do Instituto Kalapa.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
