"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertCircle, ArrowRight, Users } from "lucide-react";

const VAGAS_MAXIMAS = 15;

const schema = z.object({
  nome: z.string().min(3, { message: "O nome precisa ter pelo menos 3 caracteres." }),
  email: z.string().email({ message: "E-mail inválido." }),
  telefone: z
    .string()
    .min(10, { message: "O telefone deve ter DDD + número." })
    .refine((val) => /^\(?[1-9]{2}\)?\s?9?[0-9]{4}-?[0-9]{4}$/.test(val.replace(/\s+/g, "")), {
      message: "Formato de telefone inválido. Ex: (11) 99999-9999",
    }),
  motivacao: z.string().min(10, { message: "Por favor, escreva um pouco mais (mínimo 10 caracteres)." }),
});

type FormData = z.infer<typeof schema>;

function getUrgency(filled: number, max: number) {
  const left = max - filled;
  if (left === 0) return { msg: "Vagas esgotadas para esta turma", tone: "sold-out" as const };
  if (left === 1) return { msg: "Última vaga disponível", tone: "peak" as const };
  if (left <= 2) return { msg: `Apenas ${left} vagas restantes`, tone: "urgent" as const };
  if (filled >= max * 0.67) return { msg: "Restam poucas vagas para esta turma", tone: "soft" as const };
  return { msg: "Vagas abertas para a próxima sessão", tone: "neutral" as const };
}

function getSegmentColor(filled: number, index: number, max: number) {
  if (index >= filled) return "rgba(74,74,74,0.12)";
  const pct = (filled / max) * 100;
  if (pct >= 90) return "#1A3C4D";
  if (pct >= 60) return "#B8965A";
  return "#7D8C6E";
}

export default function RegistrationForm() {
  const [enviado, setEnviado] = useState(false);
  const [vagasPreenchidas, setVagasPreenchidas] = useState(0);
  const [preco, setPreco] = useState(97);
  const [vagasMaximas, setVagasMaximas] = useState(VAGAS_MAXIMAS);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vagasRes, configRes] = await Promise.all([
          fetch("/api/vagas", { cache: "no-store" }),
          fetch("/api/config", { cache: "no-store" }),
        ]);
        const vagasData = await vagasRes.json();
        const configData = await configRes.json();
        setVagasPreenchidas(vagasData.preenchidas || 0);
        if (vagasData.maximas) {
          setVagasMaximas(vagasData.maximas);
        }
        if (configData.preco_sessao) {
          setPreco(Number(configData.preco_sessao));
        }
      } catch {
        setVagasPreenchidas(0);
      }
    };
    fetchData();
  }, []);

  const vagasRestantes = vagasMaximas - vagasPreenchidas;
  const esgotado = vagasRestantes === 0;
  const urgency = getUrgency(vagasPreenchidas, vagasMaximas);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { nome: "", email: "", telefone: "", motivacao: "" },
  });

  const formatTelefone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    const limited = numbers.slice(0, 11);
    if (limited.length <= 2) return limited;
    if (limited.length <= 6) return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
    if (limited.length <= 10) return `(${limited.slice(0, 2)}) ${limited.slice(2, 6)}-${limited.slice(6)}`;
    return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatTelefone(e.target.value);
    setValue("telefone", formatted, { shouldValidate: true });
  };

  const onSubmit = async (data: FormData) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    if (typeof window !== "undefined") {
      sessionStorage.setItem("dados_inscricao", JSON.stringify(data));
    }
    setEnviado(true);
    setTimeout(() => router.push("/checkout"), 800);
  };

  const urgencyColor =
    urgency.tone === "sold-out"
      ? "text-brand-charcoal/40"
      : urgency.tone === "neutral"
      ? "text-brand-charcoal/50"
      : "text-brand-terracotta";

  return (
    <section id="inscricao" className="relative py-24 md:py-32 bg-brand-beige overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_20%_80%,#673de6_1px,transparent_1px)] bg-[length:35px_35px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-8">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand-terracotta/15 text-brand-terracotta text-sm font-semibold tracking-wide mb-6">
            Faça sua inscrição
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-brand-charcoal leading-tight max-w-3xl mx-auto">
            O primeiro passo é{" "}
            <span className="text-gradient">dizer sim</span> para você
          </h2>
          <p className="mt-4 text-brand-charcoal/60 text-lg max-w-xl mx-auto leading-relaxed">
            Preencha o formulário abaixo e nossa equipe entrará em contato para confirmar sua vaga na próxima sessão em grupo.
          </p>
        </div>

        {/* === Contador de vagas === */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card-light rounded-2xl p-6 md:p-7 mb-8 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-purple-light flex items-center justify-center">
                <Users className="w-5 h-5 text-brand-purple" />
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-charcoal">Vagas da próxima turma</p>
                <p className="text-xs text-brand-charcoal/40">Grupos reduzidos — máximo {vagasMaximas} participantes</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-brand-charcoal tabular-nums">
                {vagasPreenchidas}
                <span className="text-brand-charcoal/30 text-lg">/{vagasMaximas}</span>
              </span>
            </div>
          </div>

          {/* Barra segmentada de 15 posições */}
          <div className="flex items-center gap-3">
            <div className="flex gap-1 flex-1">
              {Array.from({ length: vagasMaximas }).map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ scaleY: 0.4, opacity: 0.4 }}
                  animate={{
                    scaleY: 1,
                    opacity: 1,
                    backgroundColor: getSegmentColor(vagasPreenchidas, i, vagasMaximas),
                  }}
                  transition={{ delay: 0.3 + i * 0.04, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="h-2 flex-1 rounded-full origin-bottom"
                />
              ))}
            </div>
          </div>

          {/* Mensagem de escassez */}
          <AnimatePresence mode="wait">
            <motion.p
              key={urgency.msg}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
              className={`mt-3 text-sm font-medium ${urgencyColor} ${
                urgency.tone === "urgent" || urgency.tone === "peak" ? "font-semibold" : ""
              }`}
            >
              {!esgotado && (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-current mr-2 align-middle" />
              )}
              {urgency.msg}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        {/* === Formulário === */}
        <div className="min-h-[400px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {enviado ? (
              <motion.div
                key="success"
                role="status"
                aria-live="polite"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="text-center py-16 px-8 glass-card-light rounded-2xl w-full"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-brand-mint/20 flex items-center justify-center shadow-inner">
                  <Check className="w-10 h-10 text-brand-mint-dark" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-brand-charcoal mb-4">
                  Inscrição Concluída!
                </h3>
                <p className="text-brand-charcoal/60 max-w-md mx-auto leading-relaxed mb-8">
                  Identificamos sua inscrição. Abrindo a tela de pagamento para que você possa concluir sua participação...
                </p>
                <button
                  onClick={() => router.push("/checkout")}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-brand-terracotta hover:bg-brand-terracotta-dark text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-brand-terracotta/25 hover:shadow-brand-terracotta/40 hover:-translate-y-0.5"
                >
                  Abrir Tela de Pagamento
                  <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            ) : esgotado ? (
              <motion.div
                key="sold-out"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="glass-card-light rounded-2xl p-8 md:p-12 w-full shadow-xl text-center"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-brand-charcoal/10 flex items-center justify-center">
                  <Users className="w-10 h-10 text-brand-charcoal/40" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-brand-charcoal mb-4">
                  Vagas esgotadas para esta turma
                </h3>
                <p className="text-brand-charcoal/60 max-w-md mx-auto leading-relaxed mb-8">
                  As {vagasMaximas} vagas da próxima sessão já foram preenchidas.
                  Entre na lista de espera e avisaremos assim que uma vaga abrir
                  ou quando a próxima turma for anunciada.
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setEnviado(true);
                  }}
                  className="max-w-md mx-auto space-y-4"
                >
                  <input
                    type="email"
                    required
                    placeholder="Seu melhor e-mail"
                    className="w-full px-4 py-3.5 rounded-xl border border-brand-charcoal/10 bg-white/85 placeholder:text-brand-charcoal/30 text-brand-charcoal focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/10 transition-all duration-200"
                  />
                  <button
                    type="submit"
                    className="w-full py-4 bg-brand-charcoal hover:bg-brand-purple text-white font-semibold rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                  >
                    Entrar na lista de espera
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </form>
                <p className="text-center text-brand-charcoal/30 text-xs mt-6">
                  A nova turma abre a cada 15 dias. Você será o primeiro a saber.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                onSubmit={handleSubmit(onSubmit)}
                className="glass-card-light rounded-2xl p-8 md:p-12 space-y-6 w-full shadow-xl"
              >
                <div>
                  <label htmlFor="nome" className="block text-sm font-semibold text-brand-charcoal mb-2">
                    Nome completo
                  </label>
                  <input
                    type="text"
                    id="nome"
                    autoComplete="name"
                    placeholder="Seu nome"
                    {...register("nome")}
                    className={`w-full px-4 py-3.5 rounded-xl border bg-white/85 placeholder:text-brand-charcoal/30 text-brand-charcoal focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.nome
                        ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                        : "border-brand-charcoal/10 focus:border-brand-purple focus:ring-brand-purple/10"
                    }`}
                  />
                  {errors.nome && (
                    <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.nome.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-brand-charcoal mb-2">
                    E-mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    autoComplete="email"
                    spellCheck={false}
                    placeholder="seu@email.com"
                    {...register("email")}
                    className={`w-full px-4 py-3.5 rounded-xl border bg-white/85 placeholder:text-brand-charcoal/30 text-brand-charcoal focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.email
                        ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                        : "border-brand-charcoal/10 focus:border-brand-purple focus:ring-brand-purple/10"
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="telefone" className="block text-sm font-semibold text-brand-charcoal mb-2">
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    id="telefone"
                    autoComplete="tel"
                    inputMode="numeric"
                    placeholder="(00) 90000-0000"
                    {...register("telefone")}
                    onChange={handlePhoneChange}
                    className={`w-full px-4 py-3.5 rounded-xl border bg-white/85 placeholder:text-brand-charcoal/30 text-brand-charcoal focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.telefone
                        ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                        : "border-brand-charcoal/10 focus:border-brand-purple focus:ring-brand-purple/10"
                    }`}
                  />
                  {errors.telefone && (
                    <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.telefone.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="motivacao" className="block text-sm font-semibold text-brand-charcoal mb-2">
                    O que você busca com esta sessão?
                  </label>
                  <textarea
                    id="motivacao"
                    rows={4}
                    autoComplete="off"
                    placeholder="Compartilhe brevemente o que te trouxe até aqui..."
                    {...register("motivacao")}
                    className={`w-full px-4 py-3.5 rounded-xl border bg-white/85 placeholder:text-brand-charcoal/30 text-brand-charcoal focus:outline-none focus:ring-2 transition-all duration-200 resize-none ${
                      errors.motivacao
                        ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                        : "border-brand-charcoal/10 focus:border-brand-purple focus:ring-brand-purple/10"
                    }`}
                  />
                  {errors.motivacao && (
                    <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.motivacao.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-brand-terracotta hover:bg-brand-terracotta-dark text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-brand-terracotta/25 hover:shadow-brand-terracotta/40 hover:-translate-y-0.5 text-lg disabled:opacity-50 disabled:hover:translate-y-0 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? "Enviando..." : `Garantir minha vaga (${vagasRestantes} restantes)`}
                  {!isSubmitting && <ArrowRight className="w-5 h-5" />}
                </button>

                <p className="text-center text-brand-charcoal/30 text-xs">
                  Seus dados estão seguros e serão usados exclusivamente para contato sobre as sessões do INstituto Kalapa.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
