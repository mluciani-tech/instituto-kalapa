import Link from "next/link";
import { Sparkles, ArrowRight, Compass, HeartHandshake, ShieldCheck, Flame, Droplets, BookOpen, Clock, Users } from "lucide-react";
import Footer from "../components/Footer";

export const metadata = {
  title: "Testes de Autoconhecimento — INstituto Kalapa",
  description:
    "Explore testes gratuitos de autoconhecimento: Predominância Yin-Yang da Medicina Tradicional Chinesa e Teste de Personalidade do Eneagrama.",
};

export default function TesteAutoconhecimentoPage() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#1A3C4D] flex flex-col justify-between pt-24 sm:pt-28">
      {/* Top Banner Hero */}
      <section className="relative w-full border-b border-[#E8DEC8]/60 bg-gradient-to-b from-[#F7F3E9] to-[#FDFBF7] py-12 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_50%_50%,#B8965A_1px,transparent_1px)] bg-[length:32px_32px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#B8965A]/15 text-[#B8965A] text-xs sm:text-sm font-medium tracking-wide mb-4 backdrop-blur-sm border border-[#B8965A]/25">
            <Sparkles className="w-4 h-4 text-[#B8965A]" />
            <span>Jornada de Consciência • INstituto Kalapa</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-[#1A3C4D] tracking-tight mb-4 leading-tight">
            Mapeie o seu mundo interno através de{" "}
            <span className="italic font-normal text-[#B8965A]">
              escolhas conscientes
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#1A3C4D]/80 leading-relaxed font-light">
            O autoconhecimento é o primeiro passo para toda transformação real.
            Escolha uma das avaliações abaixo e receba um diagnóstico exclusivo,
            científico e acolhedor para guiar seu bem-estar.
          </p>
        </div>
      </section>

      {/* Grid de Escolha dos Testes */}
      <section className="flex-grow w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {/* Card 1: Teste Yin-Yang */}
          <div className="bg-white rounded-3xl p-7 sm:p-9 shadow-lg shadow-[#E8DEC8]/20 border border-[#E8DEC8] flex flex-col justify-between hover:shadow-xl hover:border-[#B8965A]/50 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#B8965A]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:bg-[#B8965A]/10 transition-colors" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-orange-100/70 text-orange-900 border border-orange-200">
                  <Flame className="w-3.5 h-3.5 text-orange-600" />
                  <Droplets className="w-3.5 h-3.5 text-blue-600 -ml-0.5" />
                  MTC • 15 Dimensões
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-[#1A3C4D]/60 font-light">
                  <Clock className="w-3.5 h-3.5" /> ~3 min
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#1A3C4D] mb-3">
                Predominância Energética Yin-Yang
              </h2>

              <p className="text-sm text-[#1A3C4D]/75 font-light leading-relaxed mb-6 text-justify">
                Fundamentado na Medicina Tradicional Chinesa, este teste avalia seu padrão corporal,
                sensações térmicas, digestão, sono e respostas emocionais para identificar sua tendência
                energética predominante.
              </p>

              <div className="space-y-2.5 mb-8 text-xs sm:text-sm text-[#1A3C4D]/75">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#B8965A]" />
                  <span>15 perguntas diretas e sem respostas certas ou erradas</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#B8965A]" />
                  <span>Diagnóstico de excesso ou deficiência de Yin ou Yang</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#B8965A]" />
                  <span>Práticas de respiração guiada e fitoterapia integrativa</span>
                </div>
              </div>
            </div>

            <div>
              <Link
                href="/teste-yin-yang"
                className="w-full py-4 px-6 rounded-2xl bg-[#1A3C4D] hover:bg-[#15313F] text-white text-sm font-semibold transition-all duration-200 shadow-md shadow-[#1A3C4D]/15 flex items-center justify-center gap-2 group-hover:gap-3 cursor-pointer"
              >
                <span>Iniciar Teste Yin-Yang</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Card 2: Teste Eneagrama */}
          <div className="bg-white rounded-3xl p-7 sm:p-9 shadow-lg shadow-[#E8DEC8]/20 border border-[#E8DEC8] flex flex-col justify-between hover:shadow-xl hover:border-[#7D8C6E]/60 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#7D8C6E]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:bg-[#7D8C6E]/15 transition-colors" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-100/70 text-emerald-900 border border-emerald-200">
                  <Compass className="w-3.5 h-3.5 text-emerald-700" />
                  Eneagrama • 45 Afirmações
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-[#1A3C4D]/60 font-light">
                  <Clock className="w-3.5 h-3.5" /> ~6 min
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#1A3C4D] mb-3">
                A Sabedoria do Eneagrama & a Visão Sistêmica do INstituto Kalapa
              </h2>

              <div className="space-y-3 text-xs sm:text-sm text-[#1A3C4D]/80 font-light leading-relaxed mb-6 text-justify">
                <p>
                  O Eneagrama é uma das ferramentas de autoconhecimento e transformação psicoespiritual mais
                  profundas da psicologia moderna e da sabedoria ancestral.
                </p>
                <p>
                  Longe de ser apenas um sistema de rotulagem comportamental, o Eneagrama atua como um mapa
                  dinâmico da psique humana, revelando a distinção fundamental entre a nossa Essência (a nossa
                  natureza cristalina, espontânea e incondicionada) e a estrutura do Ego (o conjunto de defesas,
                  fixações mentais e máscaras adaptativas desenvolvidas na infância para garantir sobrevivência e pertencimento).
                </p>
                <p>
                  No INstituto Kalapa, integramos a sabedoria tradicional do Eneagrama com os princípios da
                  Psicologia Transpessoal e Constelações Familiares de Bert Hellinger. Compreendemos que o
                  eneatipo de uma pessoa não surge no vácuo; ele é moldado na interseção entre a predisposição
                  biológica do indivíduo e as dinâmicas ocultas do sistema familiar. As fixações egóicas funcionam
                  como lealdades invisíveis às memórias e dores do sistema de origem.
                </p>
                <p className="text-[#7D8C6E] font-medium italic pt-1 text-left">
                  Faça seu teste e se autodesenvolva para transformar ainda mais sua vida.
                </p>
              </div>
            </div>

            <div>
              <Link
                href="/teste-eneagrama"
                className="w-full py-4 px-6 rounded-2xl bg-[#7D8C6E] hover:bg-[#6C7B5D] text-white text-sm font-semibold transition-all duration-200 shadow-md shadow-[#7D8C6E]/20 flex items-center justify-center gap-2 group-hover:gap-3 cursor-pointer"
              >
                <span>Iniciar Teste do Eneagrama</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* Banner de acolhimento e segurança */}
        <div className="mt-12 sm:mt-16 bg-[#F8F4ED] rounded-2xl p-6 border border-[#E8DEC8] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#B8965A] shadow-xs shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#1A3C4D]">Espaço Seguro e Confidencial</h3>
              <p className="text-xs text-[#1A3C4D]/70 font-light">
                Seus dados e respostas são preservados com total sigilo pelo INstituto Kalapa.
              </p>
            </div>
          </div>
          <Link
            href="/produtos?categoria=vivencias"
            className="text-xs font-semibold text-[#B8965A] hover:underline flex items-center gap-1 shrink-0"
          >
            Conheça nossas Vivências presenciais <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
