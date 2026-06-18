"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertCircle, ArrowRight } from "lucide-react";

// Validação com Zod
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

export default function RegistrationForm() {
  const [enviado, setEnviado] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      motivacao: "",
    },
  });

  const watchTelefone = watch("telefone");

  const formatTelefone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    const limited = numbers.slice(0, 11);
    
    if (limited.length <= 2) {
      return limited;
    } else if (limited.length <= 6) {
      return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
    } else if (limited.length <= 10) {
      return `(${limited.slice(0, 2)}) ${limited.slice(2, 6)}-${limited.slice(6)}`;
    } else {
      return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7, 11)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatTelefone(e.target.value);
    setValue("telefone", formatted, { shouldValidate: true });
  };

  const onSubmit = async (data: FormData) => {
    // Simulando envio para API
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    // Salva no sessionStorage para compartilhar com a tela de pagamento
    if (typeof window !== "undefined") {
      sessionStorage.setItem("dados_inscricao", JSON.stringify(data));
    }
    
    setEnviado(true);
    
    // Redireciona para a nova tela de pagamento
    setTimeout(() => {
      router.push("/checkout");
    }, 800);
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
            Preencha o formulário abaixo e nossa equipe entrará em contato para confirmar sua vaga na próxima sessão em grupo.
          </p>
        </div>

        <div className="min-h-[400px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {enviado ? (
              <motion.div
                key="success"
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
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                onSubmit={handleSubmit(onSubmit)}
                className="glass-card-light rounded-2xl p-8 md:p-12 space-y-6 w-full shadow-xl"
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

                {/* Telefone (WhatsApp) */}
                <div>
                  <label
                    htmlFor="telefone"
                    className="block text-sm font-semibold text-brand-charcoal mb-2"
                  >
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    id="telefone"
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
                    rows={4}
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

                {/* Botão */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-brand-terracotta hover:bg-brand-terracotta-dark text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-brand-terracotta/25 hover:shadow-brand-terracotta/40 hover:-translate-y-0.5 text-lg disabled:opacity-50 disabled:hover:translate-y-0 cursor-pointer flex items-center justify-center"
                >
                  {isSubmitting ? "Enviando..." : "Enviar inscrição"}
                </button>

                {/* Nota */}
                <p className="text-center text-brand-charcoal/30 text-xs">
                  Seus dados estão seguros e serão usados exclusivamente para contato sobre as sessões do Instituto Kalapa.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
