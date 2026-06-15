"use client";

import { useState } from "react";

const metodosPagamento = [
  {
    id: "pix",
    nome: "Pix",
    descricao: "Aprovação instantânea",
    icone: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 14.5v-2h2v2h-2zm2-3.5h-2v-6h2v6z" />
      </svg>
    ),
  },
  {
    id: "cartao",
    nome: "Cartão de Crédito",
    descricao: "Até 12x sem juros",
    icone: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
        />
      </svg>
    ),
  },
];

export default function Checkout() {
  const [metodoSelecionado, setMetodoSelecionado] = useState("pix");

  return (
    <section className="relative py-24 md:py-32 bg-brand-charcoal overflow-hidden">
      {/* Background cinematográfico */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-charcoal via-brand-purple-deep/30 to-brand-charcoal" />
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_30%_50%,#CC6223_1px,transparent_1px)] bg-[length:30px_30px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-8">
        {/* Cabeçalho */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-terracotta/20 text-brand-terracotta text-sm font-semibold tracking-wide mb-6">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Pagamento Seguro
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight max-w-2xl mx-auto">
            Garanta seu{" "}
            <span className="text-gradient">ingresso</span> para a próxima sessão
          </h2>
          <p className="mt-4 text-white/60 text-lg max-w-xl mx-auto">
            Processamento rápido, seguro e transparente via InfinitePay.
            Escolha a melhor forma de pagamento para você.
          </p>
        </div>

        {/* Card de Checkout */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Lado esquerdo — Detalhes do ingresso */}
          <div className="flex flex-col justify-center glass-card rounded-2xl p-8 md:p-10">
            <div className="mb-6">
              <span className="text-brand-mint text-sm font-semibold tracking-wider uppercase">
                Ingresso Quinzenal
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-white mt-2">
                Sessão Terapêutica em Grupo
              </h3>
              <p className="text-white/50 mt-2 leading-relaxed">
                1 encontro a cada 15 dias · Duração de 2h · Grupos reduzidos
              </p>
            </div>

            <div className="border-t border-white/10 pt-6">
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-5xl md:text-6xl font-bold text-white">
                  R$ 97
                </span>
                <span className="text-white/40 text-lg">/ sessão</span>
              </div>
              <p className="text-white/50 text-sm">
                Valor por participante. Você pode participar de sessões avulsas
                ou fazer parte do grupo contínuo.
              </p>
            </div>

            {/* Benefícios do Ingresso */}
            <ul className="mt-6 space-y-3">
              {[
                "Acesso à sessão em grupo ao vivo",
                "Material de apoio pós-sessão",
                "Grupo de WhatsApp para suporte entre encontros",
                "Condições especiais para pacotes mensais",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-white/70">
                  <svg
                    className="w-5 h-5 text-brand-mint flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Lado direito — Métodos de pagamento */}
          <div className="glass-card rounded-2xl p-8 md:p-10 flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-6">
              Forma de pagamento
            </h3>

            {/* Seleção de método */}
            <div className="space-y-3 mb-8">
              {metodosPagamento.map((metodo) => (
                <button
                  key={metodo.id}
                  onClick={() => setMetodoSelecionado(metodo.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 ${
                    metodoSelecionado === metodo.id
                      ? "border-brand-mint bg-brand-mint/10"
                      : "border-white/10 hover:border-white/20 hover:bg-white/5"
                  }`}
                >
                  <div
                    className={`${
                      metodoSelecionado === metodo.id
                        ? "text-brand-mint"
                        : "text-white/40"
                    }`}
                  >
                    {metodo.icone}
                  </div>
                  <div className="text-left">
                    <div className="text-white font-medium">{metodo.nome}</div>
                    <div className="text-white/40 text-sm">{metodo.descricao}</div>
                  </div>
                  <div className="ml-auto">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        metodoSelecionado === metodo.id
                          ? "border-brand-mint"
                          : "border-white/20"
                      }`}
                    >
                      {metodoSelecionado === metodo.id && (
                        <div className="w-2.5 h-2.5 rounded-full bg-brand-mint" />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Parcelamento (apenas cartão) */}
            {metodoSelecionado === "cartao" && (
              <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
                <label className="text-white/60 text-sm block mb-2">
                  Parcelamento
                </label>
                <select className="w-full bg-transparent text-white border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-mint transition-colors appearance-none cursor-pointer">
                  <option value="1" className="bg-brand-charcoal">1x de R$ 97,00</option>
                  <option value="2" className="bg-brand-charcoal">2x de R$ 48,50</option>
                  <option value="3" className="bg-brand-charcoal">3x de R$ 32,33</option>
                  <option value="4" className="bg-brand-charcoal">4x de R$ 24,25</option>
                  <option value="6" className="bg-brand-charcoal">6x de R$ 16,17</option>
                  <option value="12" className="bg-brand-charcoal">12x de R$ 8,08</option>
                </select>
              </div>
            )}

            {/* Botão de compra */}
            <button className="w-full py-4 bg-brand-terracotta hover:bg-brand-terracotta-dark text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-brand-terracotta/25 hover:shadow-brand-terracotta/40">
              Finalizar inscrição — R$ 97,00
            </button>

            {/* Badge InfinitePay */}
            <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-center gap-3">
              <svg className="w-5 h-5 text-white/30" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-white/30 text-sm tracking-wide">
                Processamento seguro por{" "}
                <strong className="text-white/50">InfinitePay</strong>
              </span>
            </div>

            {/* Selos de segurança */}
            <div className="mt-6 flex items-center justify-center gap-6 text-white/20 text-xs">
              <span>SSL Criptografado</span>
              <span>Dados Protegidos</span>
              <span>LGPD</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
