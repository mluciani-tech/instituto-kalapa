"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Sparkles,
  MapPin,
  ChevronDown,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

interface FAQItem {
  pergunta: string;
  resposta: string;
}

const FAQ_PADRAO: FAQItem[] = [
  {
    pergunta: "Preciso expor minha história ou falar na primeira sessão?",
    resposta:
      "De forma alguma. Cada participante tem seu próprio ritmo e tempo de abertura. Estar no grupo já é um ato de presença e transformação. Você só compartilha o que sentir no coração, sem qualquer pressão.",
  },
  {
    pergunta: "Como funcionam os grupos reduzidos?",
    resposta:
      "Nossos grupos contam com no máximo 15 participantes por encontro. Essa limitação garante que cada pessoa seja verdadeiramente ouvida, acolhida e acompanhada com cuidado individualizado e respeito ao seu processo.",
  },
  {
    pergunta: "Qual é a política de sigilo do INstituto Kalapa?",
    resposta:
      "O sigilo é nosso pilar ético inegociável. Tudo o que é compartilhado, vivenciado e revelado nos encontros permanece estritamente dentro do círculo do grupo, criando um solo seguro e confiável.",
  },
  {
    pergunta: "O que devo levar e como me preparar para o encontro?",
    resposta:
      "Venha com roupas confortáveis que permitam sentar e se movimentar com liberdade. Não é necessária nenhuma experiência prévia em terapias ou vivências. O espaço oferece todo o suporte para sua chegada.",
  },
  {
    pergunta: "Qual a frequência dos encontros?",
    resposta:
      "As vivências acontecem em ritmo quinzenal consciente. Esse intervalo é intencional: permite que os aprendizados e sentimentos acessados no grupo sejam integrados à sua rotina diária no seu próprio tempo.",
  },
];

const DADOS_FACILITADORA_PADRAO = {
  nome: "Clatihúcia Capeli",
  titulo: "Facilitadora, Psicóloga, Psicogenealogista, Terapeuta Sistêmica e Transpessoal",
  foto_url: "/foto_10.jpg",
  credenciais:
    "Constelação Familiar, Vivências em Grupo e Acolhimento do Trauma",
  bio: "Com mais de 10 anos de dedicação ao cuidado emocional e ao desenvolvimento humano, Clatihúcia Capeli conduz vivências que acolhem a dor sem julgamentos, permitindo que ela se transforme em força e consciência.\n\nSua abordagem integra a sabedoria sistêmica das constelações familiares, a neurobiologia do trauma e a potência curativa da presença em grupo. Cada encontro é cuidadosamente preparado para ser um santuário de respeito, acolhimento genuíno e pertencimento.",
  espaco_titulo: "Espaço Serena — Refúgio e Natureza",
  espaco_descricao:
    "Localizado em meio à natureza na Granja Viana (Cotia - SP), o espaço foi concebido como um refúgio acolhedor, silencioso e seguro para vivências presenciais transformadoras.",
  espaco_fotos: ["/foto2.jpg", "/foto4.jpg", "/foto6a.jpg"],
};

export default function AboutFacilitator() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [dados, setDados] = useState(DADOS_FACILITADORA_PADRAO);
  const [faq, setFaq] = useState<FAQItem[]>(FAQ_PADRAO);

  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then((config) => {
        if (!config) return;
        setDados({
          nome: config.facilitadora_nome || DADOS_FACILITADORA_PADRAO.nome,
          titulo: config.facilitadora_titulo || DADOS_FACILITADORA_PADRAO.titulo,
          foto_url: config.facilitadora_foto || DADOS_FACILITADORA_PADRAO.foto_url,
          credenciais:
            config.facilitadora_credenciais ||
            DADOS_FACILITADORA_PADRAO.credenciais,
          bio: config.facilitadora_bio || DADOS_FACILITADORA_PADRAO.bio,
          espaco_titulo:
            config.espaco_titulo || DADOS_FACILITADORA_PADRAO.espaco_titulo,
          espaco_descricao:
            config.espaco_descricao ||
            DADOS_FACILITADORA_PADRAO.espaco_descricao,
          espaco_fotos: config.espaco_fotos
            ? JSON.parse(config.espaco_fotos)
            : DADOS_FACILITADORA_PADRAO.espaco_fotos,
        });

        if (config.faq_itens) {
          try {
            const parsed = JSON.parse(config.faq_itens);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setFaq(parsed);
            }
          } catch {
            // mantém padrão
          }
        }
      })
      .catch(() => {});
  }, []);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="sobre" className="relative py-24 md:py-32 bg-white overflow-hidden scroll-mt-24 font-sans">
      {/* Detalhe de fundo suave */}
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_50%_50%,#B8965A_1px,transparent_1px)] bg-[length:32px_32px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-8">
        {/* Cabeçalho da Seção */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-terracotta/10 text-brand-terracotta text-sm font-semibold tracking-wide mb-4 border border-brand-terracotta/20">
            <Sparkles className="w-4 h-4" />
            Quem Conduz
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-brand-charcoal tracking-tight">
            Presença, Cuidado e Acolhimento
          </h2>
          <p className="mt-4 text-brand-charcoal/65 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Conheça quem cuida do seu espaço seguro no INstituto Kalapa e a
            atmosfera criada para o seu processo de transformação.
          </p>
        </motion.div>

        {/* Bloco 1: Card da Facilitadora */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12 items-center mb-20 md:mb-28">
          {/* Foto com moldura serena em ouro envelhecido */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5"
          >
            <div className="relative mx-auto max-w-sm lg:max-w-none">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-[#B8965A]/30 shadow-[0_8px_30px_-6px_rgba(184,150,90,0.18)] bg-brand-beige-light">
                <Image
                  src={dados.foto_url}
                  alt={dados.nome}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-white/60 shadow-sm">
                  <p className="text-xs font-semibold text-brand-terracotta uppercase tracking-wider">
                    Facilitadora
                  </p>
                  <p className="text-sm font-bold text-brand-charcoal">
                    {dados.nome}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Biografia e Credenciais */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-mint mb-2">
              <Heart className="w-4 h-4 text-brand-mint" />
              {dados.titulo}
            </div>
            <h3 className="text-2xl md:text-4xl font-bold text-brand-charcoal mb-4">
              {dados.nome}
            </h3>
            <div className="p-4 mb-6 rounded-2xl bg-brand-offwhite border border-brand-terracotta/20">
              <p className="text-xs font-semibold text-brand-terracotta uppercase tracking-wide mb-1">
                Especialidades & Abordagem
              </p>
              <p className="text-sm text-brand-charcoal/80 font-medium">
                {dados.credenciais}
              </p>
            </div>

            <div className="space-y-4 text-brand-charcoal/75 text-sm md:text-base leading-relaxed font-light mb-8">
              {dados.bio.split("\n\n").map((paragrafo, idx) => (
                <p key={idx}>{paragrafo}</p>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="https://wa.me/5511917452732?text=Ol%C3%A1%2C%20Clatih%C3%BAcia!%20Gostaria%20de%20conversar%20sobre%20as%20viv%C3%AAncias%20do%20Instituto%20Kalapa."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-brand-purple hover:bg-brand-purple-dark text-white text-xs md:text-sm font-semibold transition-all shadow-md shadow-brand-purple/20"
              >
                <MessageCircle className="w-4 h-4 text-brand-mint" />
                Conversar com a Facilitadora
              </a>
              <Link
                href="/produtos?categoria=vivencias"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-brand-charcoal/20 hover:border-brand-charcoal/40 text-brand-charcoal text-xs md:text-sm font-semibold transition-colors"
              >
                Ver Vivências Abertas
                <ArrowRight className="w-4 h-4 text-brand-terracotta" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Bloco 2: O Espaço */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-20 md:mb-28 p-8 md:p-12 rounded-3xl bg-brand-offwhite border border-brand-charcoal/10"
        >
          <div className="max-w-2xl mb-8">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-terracotta uppercase tracking-wider mb-2">
              <MapPin className="w-4 h-4" />
              Onde Acontece
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-brand-charcoal mb-2">
              {dados.espaco_titulo}
            </h3>
            <p className="text-brand-charcoal/70 text-sm md:text-base leading-relaxed">
              {dados.espaco_descricao}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {dados.espaco_fotos.map((src, index) => (
              <div
                key={src + index}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-brand-charcoal/10 shadow-xs group"
              >
                <Image
                  src={src}
                  alt={`Espaço INstituto Kalapa - Foto ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bloco 3: FAQ Interativo */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-terracotta uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" />
              Tire Suas Dúvidas
            </span>
            <h3 className="text-2xl md:text-4xl font-bold text-brand-charcoal mb-3">
              Perguntas Frequentes
            </h3>
            <p className="text-brand-charcoal/65 text-sm md:text-base font-light">
              Tudo o que você precisa saber para se sentir acolhido e seguro ao participar.
            </p>
          </div>

          <div className="space-y-3">
            {faq.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={item.pergunta + index}
                  className="rounded-2xl border border-brand-charcoal/10 bg-white transition-all overflow-hidden shadow-xs hover:border-[#B8965A]/40"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    aria-expanded={isOpen}
                    className="w-full p-5 md:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="text-sm md:text-base font-semibold text-brand-charcoal flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-brand-terracotta shrink-0" />
                      {item.pergunta}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-brand-charcoal/50 shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-brand-terracotta" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-6 pt-1 md:px-6 md:pb-6 text-xs md:text-sm text-brand-charcoal/70 leading-relaxed border-t border-brand-charcoal/5 font-light">
                          {item.resposta}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Dúvida adicional com WhatsApp */}
          <div className="mt-8 p-5 rounded-2xl bg-brand-offwhite border border-brand-terracotta/20 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <p className="text-xs md:text-sm font-semibold text-brand-charcoal flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-mint shrink-0" />
                Ainda tem alguma dúvida sobre seu momento?
              </p>
              <p className="text-xs text-brand-charcoal/60 mt-0.5">
                Fale diretamente no WhatsApp para uma orientação acolhedora.
              </p>
            </div>
            <a
              href="https://wa.me/5511917452732?text=Ol%C3%A1!%20Gostaria%20de%20tirar%20uma%20d%C3%BAvida%20espec%C3%ADfica%20sobre%20as%20viv%C3%AAncias%20do%20Instituto%20Kalapa."
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 px-4 py-2.5 rounded-xl bg-brand-purple/10 hover:bg-brand-purple/20 text-brand-purple text-xs font-semibold transition-colors flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-brand-mint" />
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
