import {
  Briefcase,
  Compass,
  Heart,
  Sparkles,
  Lock,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import {
  CategoriaTemaMetamorfose,
  CATEGORIAS_TEMA_LABELS,
} from "../lib/calculo-metamorfose";

interface MetamorfoseThemeStepProps {
  categoriaTema: CategoriaTemaMetamorfose;
  temaDescricao: string;
  temaEmSilencio: boolean;
  onChangeCategoria: (cat: CategoriaTemaMetamorfose) => void;
  onChangeDescricao: (desc: string) => void;
  onChangeSilencio: (silencio: boolean) => void;
  onAvancar: () => void;
}

const OPCOES_CATEGORIA: {
  id: CategoriaTemaMetamorfose;
  titulo: string;
  descricao: string;
  icone: React.ReactNode;
}[] = [
  {
    id: "projeto",
    titulo: CATEGORIAS_TEMA_LABELS.projeto,
    descricao:
      "Uma empresa, lançamento, sociedade, consultório ou iniciativa que você está gerando ou sustentando.",
    icone: <Briefcase className="w-5 h-5" />,
  },
  {
    id: "carreira",
    titulo: CATEGORIAS_TEMA_LABELS.carreira,
    descricao:
      "Sua trajetória profissional, mudança de área, posicionamento no mercado ou realização vocacional.",
    icone: <Compass className="w-5 h-5" />,
  },
  {
    id: "relacionamento",
    titulo: CATEGORIAS_TEMA_LABELS.relacionamento,
    descricao:
      "Um vínculo conjugal, familiar ou parceria importante que pede clareza sistêmica e ordem.",
    icone: <Heart className="w-5 h-5" />,
  },
  {
    id: "decisao",
    titulo: CATEGORIAS_TEMA_LABELS.decisao,
    descricao:
      "Uma escolha crucial de vida, mudança de cidade, encerramento de ciclo ou novo começo.",
    icone: <Sparkles className="w-5 h-5" />,
  },
];

export default function MetamorfoseThemeStep({
  categoriaTema,
  temaDescricao,
  temaEmSilencio,
  onChangeCategoria,
  onChangeDescricao,
  onChangeSilencio,
  onAvancar,
}: MetamorfoseThemeStepProps) {
  return (
    <div className="max-w-3xl mx-auto animate-fadeIn">
      <div className="bg-white rounded-[2.5rem] p-6 sm:p-10 lg:p-12 border border-[#E8DEC8] shadow-xl shadow-[#E8DEC8]/30">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F8F4ED] text-[#B8965A] text-xs font-semibold uppercase tracking-widest border border-[#B8965A]/25 mb-4">
            Etapa 1 • O Portal de Entrada
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#1A3C4D] mb-4 leading-snug">
            Qual tema ou projeto você traz para o campo hoje?
          </h2>
          <p className="text-sm sm:text-base text-[#1A3C4D]/75 font-light leading-relaxed text-justify">
            A abordagem das Constelações Sistêmicas não tem como objetivo consertar pessoas nem manipular acontecimentos. Como ensina Bert Hellinger, o que cura não é a pressa da mente, mas a concordância com a realidade tal como ela é. Antes de retirar suas quatro cartas (Ovo, Lagarta, Crisálida e Borboleta), mentalize com precisão a questão que deseja contemplar.
          </p>
        </div>

        {/* Seleção da esfera do tema */}
        <div className="mb-8">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#1A3C4D]/70 mb-3">
            1. Escolha a esfera principal da sua questão:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {OPCOES_CATEGORIA.map((op) => {
              const selecionado = categoriaTema === op.id;
              return (
                <button
                  key={op.id}
                  type="button"
                  onClick={() => onChangeCategoria(op.id)}
                  className={`text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 cursor-pointer ${
                    selecionado
                      ? "bg-[#1A3C4D] text-white border-[#1A3C4D] shadow-md"
                      : "bg-[#FDFBF7] hover:bg-[#F8F4ED] text-[#1A3C4D] border-[#E8DEC8]"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      selecionado
                        ? "bg-[#B8965A] text-white"
                        : "bg-[#B8965A]/15 text-[#B8965A]"
                    }`}
                  >
                    {op.icone}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3
                        className={`text-sm font-serif font-semibold ${
                          selecionado ? "text-white" : "text-[#1A3C4D]"
                        }`}
                      >
                        {op.titulo}
                      </h3>
                      {selecionado && (
                        <CheckCircle2 className="w-4 h-4 text-[#B8965A] shrink-0" />
                      )}
                    </div>
                    <p
                      className={`text-xs font-light mt-1 leading-relaxed ${
                        selecionado ? "text-[#E8DEC8]/85" : "text-[#1A3C4D]/65"
                      }`}
                    >
                      {op.descricao}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Nome ou descrição opcional do Tema */}
        <div className="mb-8 bg-[#F8F4ED] rounded-3xl p-5 sm:p-6 border border-[#E8DEC8]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <label
              htmlFor="input-tema-metamorfose"
              className="text-xs font-bold uppercase tracking-wider text-[#1A3C4D]"
            >
              2. Nomeie seu tema para o seu Dossiê em PDF (Opcional):
            </label>
            <span className="inline-flex items-center gap-1 text-[11px] text-[#7D8C6E] font-medium">
              <Lock className="w-3 h-3" />
              Sigilo absoluto
            </span>
          </div>

          {!temaEmSilencio && (
            <input
              id="input-tema-metamorfose"
              type="text"
              value={temaDescricao}
              onChange={(e) => onChangeDescricao(e.target.value)}
              placeholder="Ex: Expansão da minha clínica, Transição de carreira, Sociedade empresarial..."
              maxLength={140}
              className="w-full px-4 py-3.5 rounded-2xl bg-white border border-[#E8DEC8] text-sm text-[#1A3C4D] placeholder:text-[#1A3C4D]/40 focus:outline-none focus:border-[#B8965A] transition-colors mb-3"
            />
          )}

          <label className="inline-flex items-center gap-2.5 text-xs text-[#1A3C4D]/80 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={temaEmSilencio}
              onChange={(e) => onChangeSilencio(e.target.checked)}
              className="w-4 h-4 rounded border-[#B8965A] text-[#1A3C4D] focus:ring-[#B8965A]"
            />
            <span>
              Prefiro manter o meu tema apenas mentalizado em silêncio (não é necessário compartilhá-lo por escrito).
            </span>
          </label>
        </div>

        {/* Orientação de Postura Interior */}
        <div className="mb-8 p-5 rounded-2xl bg-[#FDFBF7] border border-[#B8965A]/30">
          <p className="text-xs font-bold uppercase tracking-widest text-[#B8965A] mb-1.5">
            Atitude Interior Recomendada
          </p>
          <p className="text-xs sm:text-sm text-[#1A3C4D]/80 font-light leading-relaxed text-justify">
            Se desejar, tenha ao seu lado um caderno físico e uma caneta, ou utilize o nosso <strong>Caderno Híbrido</strong> diretamente na tela em cada quadrante. Respire fundo, solte a expectativa de controlar o resultado e confie na sincronicidade da escolha intuitiva.
          </p>
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={onAvancar}
            className="w-full sm:w-auto px-10 py-4 rounded-full bg-[#1A3C4D] hover:bg-[#142F3D] text-white font-semibold text-sm sm:text-base transition-all shadow-lg shadow-[#1A3C4D]/20 flex items-center justify-center gap-3 group cursor-pointer"
          >
            <span>Adentrar o Quadrante 1 — O Ovo</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
