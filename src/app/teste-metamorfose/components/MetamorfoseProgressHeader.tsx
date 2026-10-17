import { CheckCircle2, RotateCcw, Sparkles } from "lucide-react";

interface MetamorfoseProgressHeaderProps {
  quadranteAtual: 0 | 1 | 2 | 3 | 4;
  cartasSorteadas: {
    1?: string;
    2?: string;
    3?: string;
    4?: string;
  };
  temaLabel?: string;
  temaDescricao?: string;
  temaEmSilencio?: boolean;
  onReiniciar: () => void;
}

const ESTAGIOS = [
  { id: 1 as const, nome: "1. O Ovo", subtitulo: "Origem & Raiz" },
  { id: 2 as const, nome: "2. A Lagarta", subtitulo: "Chão & Esforço" },
  { id: 3 as const, nome: "3. A Crisálida", subtitulo: "Casulo & Peso" },
  { id: 4 as const, nome: "4. A Borboleta", subtitulo: "Voo & Serviço" },
];

export default function MetamorfoseProgressHeader({
  quadranteAtual,
  cartasSorteadas,
  temaLabel,
  temaDescricao,
  temaEmSilencio,
  onReiniciar,
}: MetamorfoseProgressHeaderProps) {
  return (
    <div className="max-w-4xl mx-auto mb-8">
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#E8DEC8] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-[#E8DEC8]/70">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#B8965A]/15 text-[#B8965A] flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#B8965A]">
                Jornada da Metamorfose • INstituto Kalapa
              </p>
              <p className="text-xs sm:text-sm font-medium text-[#1A3C4D] truncate">
                {quadranteAtual === 0
                  ? "Etapa 1: Definição do Tema & Centramento"
                  : temaEmSilencio
                  ? `${temaLabel || "Tema Pessoal"} (Mentalizado em Silêncio)`
                  : temaDescricao
                  ? `${temaLabel ? `${temaLabel}: ` : ""}${temaDescricao}`
                  : temaLabel || "Vivência Sistêmica"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onReiniciar}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs font-medium text-[#1A3C4D]/60 hover:text-[#B8965A] transition-colors px-3 py-1.5 rounded-xl hover:bg-[#F8F4ED] cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Recomeçar Jornada</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {ESTAGIOS.map((estagio) => {
            const cartaId = cartasSorteadas[estagio.id];
            const isConcluido = Boolean(cartaId);
            const isAtivo = quadranteAtual === estagio.id;

            return (
              <div
                key={estagio.id}
                className={`rounded-2xl p-3 border transition-all ${
                  isAtivo
                    ? "bg-[#1A3C4D] text-white border-[#1A3C4D] shadow-md shadow-[#1A3C4D]/15"
                    : isConcluido
                    ? "bg-[#F8F4ED] text-[#1A3C4D] border-[#B8965A]/40"
                    : "bg-[#FDFBF7] text-[#1A3C4D]/45 border-[#E8DEC8]/70"
                }`}
              >
                <div className="flex items-center justify-between gap-1.5 mb-1">
                  <span
                    className={`text-xs font-serif font-semibold ${
                      isAtivo ? "text-white" : "text-[#1A3C4D]"
                    }`}
                  >
                    {estagio.nome}
                  </span>
                  {isConcluido && (
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isAtivo
                          ? "bg-[#B8965A] text-white"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {cartaId}
                    </span>
                  )}
                </div>
                <p
                  className={`text-[11px] font-light ${
                    isAtivo ? "text-[#E8DEC8]/90" : "text-[#1A3C4D]/60"
                  }`}
                >
                  {estagio.subtitulo}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
