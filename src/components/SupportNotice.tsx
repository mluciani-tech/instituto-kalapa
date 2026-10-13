import { HeartHandshake } from "lucide-react";

const WHATSAPP_URL = "https://wa.me/5511917452732";

/**
 * Aviso de cuidado exibido junto aos resultados dos testes de autoconhecimento.
 * Deixa claro que o resultado não é diagnóstico clínico e indica apoio imediato (CVV 188).
 * `variant="print"` não renderiza links, para uso no relatório em PDF/A4.
 */
export default function SupportNotice({ variant = "screen" }: { variant?: "screen" | "print" }) {
  if (variant === "print") {
    return (
      <div className="p-2.5 rounded-xl bg-[#F8F4ED] border border-[#E8DEC8] text-[10px] leading-relaxed text-[#1A3C4D]/85 print-avoid-break">
        <strong>Cuidado com você:</strong> este relatório é uma ferramenta de autoconhecimento e não
        substitui avaliação, diagnóstico ou tratamento psicológico ou médico. Se algo aqui despertar
        sofrimento intenso, você não precisa passar por isso sozinho(a): ligue para o CVV no{" "}
        <strong>188</strong> (24 horas, gratuito) ou procure um profissional de saúde.
      </div>
    );
  }

  return (
    <aside
      aria-label="Cuidado e apoio"
      className="flex items-start gap-3 rounded-2xl border border-[#E8DEC8] bg-[#F8F4ED] p-4 sm:p-5 text-[#1A3C4D]"
    >
      <HeartHandshake className="w-5 h-5 mt-0.5 shrink-0 text-[#7D8C6E]" aria-hidden="true" />
      <div className="space-y-2 text-sm leading-relaxed">
        <p className="font-semibold">Cuidado com você</p>
        <p className="text-[#1A3C4D]/85">
          Este resultado é uma ferramenta de autoconhecimento e não substitui avaliação, diagnóstico
          ou tratamento psicológico ou médico. Se algo aqui mexer muito com você, respire e busque
          apoio: o <strong>CVV</strong> atende gratuitamente, 24 horas, pelo{" "}
          <a href="tel:188" className="font-semibold underline underline-offset-2">
            188
          </a>
          .
        </p>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[#1A3C4D] font-semibold underline underline-offset-2"
        >
          Conversar com uma terapeuta do Instituto Kalapa
        </a>
      </div>
    </aside>
  );
}
