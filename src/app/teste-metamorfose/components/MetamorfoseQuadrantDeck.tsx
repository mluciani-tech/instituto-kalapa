import { useState, useEffect, useCallback } from "react";
import { Shuffle, Sparkles, HelpCircle } from "lucide-react";
import {
  CartaMetamorfose,
  obterCartasPorQuadrante,
  QUADRANTES_INFO,
} from "../data/metamorfose-data";

interface MetamorfoseQuadrantDeckProps {
  quadranteId: 1 | 2 | 3 | 4;
  onSelectCard: (cartaId: string) => void;
}

function embaralharCartas(cartas: CartaMetamorfose[]): CartaMetamorfose[] {
  const copia = [...cartas];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

const SIMBOLOS_QUADRANTE: Record<1 | 2 | 3 | 4, string> = {
  1: "◯", // O Ovo
  2: "〰", // A Lagarta
  3: "❖", // A Crisálida
  4: "✦", // A Borboleta
};

export default function MetamorfoseQuadrantDeck({
  quadranteId,
  onSelectCard,
}: MetamorfoseQuadrantDeckProps) {
  const qInfo = QUADRANTES_INFO[quadranteId];
  const [baralho, setBaralho] = useState<CartaMetamorfose[]>(() =>
    embaralharCartas(obterCartasPorQuadrante(quadranteId))
  );
  const [embaralhando, setEmbaralhando] = useState(false);
  const [cartaVirandoId, setCartaVirandoId] = useState<string | null>(null);
  const [mostrarSentido, setMostrarSentido] = useState(false);

  useEffect(() => {
    setBaralho(embaralharCartas(obterCartasPorQuadrante(quadranteId)));
    setCartaVirandoId(null);
    setMostrarSentido(false);
  }, [quadranteId]);

  const handleEmbaralhar = useCallback(() => {
    if (embaralhando || cartaVirandoId) return;
    setEmbaralhando(true);
    setTimeout(() => {
      setBaralho(embaralharCartas(obterCartasPorQuadrante(quadranteId)));
      setEmbaralhando(false);
    }, 380);
  }, [embaralhando, cartaVirandoId, quadranteId]);

  const handleEscolherCarta = (carta: CartaMetamorfose) => {
    if (cartaVirandoId || embaralhando) return;
    setCartaVirandoId(carta.id);
    setTimeout(() => {
      onSelectCard(carta.id);
    }, 650);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Card de Contextualização do Quadrante */}
      <div className="bg-white rounded-[2.5rem] p-6 sm:p-10 border border-[#E8DEC8] shadow-xl shadow-[#E8DEC8]/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#B8965A]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A3C4D] text-[#E8DEC8] text-xs font-semibold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#B8965A]" />
            Quadrante {quadranteId} de 4 • {qInfo.nome}
          </span>

          <h2 className="text-2xl sm:text-4xl font-serif text-[#1A3C4D] mb-2">
            {qInfo.nome} — {qInfo.subtituloArquetipico.split("•")[0].trim()}
          </h2>

          <p className="text-sm sm:text-base font-medium text-[#B8965A] mb-6">
            Pergunta Sistêmica: «{qInfo.perguntaSistemica}»
          </p>

          {/* Citação de abertura */}
          <blockquote className="bg-[#F8F4ED] rounded-2xl p-4 sm:p-5 border border-[#E8DEC8] mb-6 text-left">
            <p className="text-xs sm:text-sm italic text-[#1A3C4D]/85 leading-relaxed mb-2 text-justify">
              &ldquo;{qInfo.citacao.texto}&rdquo;
            </p>
            <footer className="text-[11px] font-bold uppercase tracking-wider text-[#B8965A] text-right">
              — {qInfo.citacao.autor}
            </footer>
          </blockquote>

          {/* Botão para ler o sentido ontológico completo */}
          <div className="mb-2">
            <button
              type="button"
              onClick={() => setMostrarSentido((v) => !v)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1A3C4D]/65 hover:text-[#B8965A] transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#B8965A]" />
              <span>
                {mostrarSentido
                  ? "Ocultar sentido fenomenológico deste quadrante"
                  : "Compreender o sentido fenomenológico deste quadrante"}
              </span>
            </button>

            {mostrarSentido && (
              <div className="mt-3 p-4 sm:p-5 rounded-2xl bg-[#FDFBF7] border border-[#E8DEC8] text-left space-y-3 animate-fadeIn">
                <p className="text-xs sm:text-sm text-[#1A3C4D]/80 font-light leading-relaxed text-justify">
                  {qInfo.sentidoOntologico}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/70">
                    <p className="text-[11px] font-bold text-amber-900 mb-1">
                      {qInfo.blocoAInfo.titulo}
                    </p>
                    <p className="text-[11px] text-amber-950/75 font-light leading-relaxed text-justify">
                      {qInfo.blocoAInfo.descricao}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/70">
                    <p className="text-[11px] font-bold text-emerald-900 mb-1">
                      {qInfo.blocoBInfo.titulo}
                    </p>
                    <p className="text-[11px] text-emerald-950/75 font-light leading-relaxed text-justify">
                      {qInfo.blocoBInfo.descricao}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mesa de 20 Cartas Viradas */}
      <div className="bg-white rounded-[2.5rem] p-6 sm:p-10 border border-[#E8DEC8] shadow-xl shadow-[#E8DEC8]/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#E8DEC8]/80">
          <div>
            <h3 className="text-lg sm:text-xl font-serif font-medium text-[#1A3C4D]">
              Sorteio Intuitivo — Escolha 1 entre as 20 Cartas de {qInfo.nome}
            </h3>
            <p className="text-xs sm:text-sm text-[#1A3C4D]/65 font-light">
              Respire fundo, mentalize a pergunta <strong>«{qInfo.perguntaSistemica}»</strong> e toque na carta que chamar sua atenção.
            </p>
          </div>

          <button
            type="button"
            onClick={handleEmbaralhar}
            disabled={embaralhando || Boolean(cartaVirandoId)}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F8F4ED] hover:bg-[#EDE7DB] text-[#1A3C4D] text-xs font-semibold border border-[#E8DEC8] transition-all cursor-pointer disabled:opacity-50"
          >
            <Shuffle
              className={`w-3.5 h-3.5 text-[#B8965A] ${
                embaralhando ? "animate-spin" : ""
              }`}
            />
            <span>Embaralhar Cartas</span>
          </button>
        </div>

        {/* Grade do Leque de 20 Cartas */}
        <div
          className={`grid grid-cols-4 sm:grid-cols-5 gap-3 sm:gap-4 transition-all duration-300 ${
            embaralhando ? "opacity-40 scale-[0.98]" : "opacity-100 scale-100"
          }`}
        >
          {baralho.map((carta, index) => {
            const isSelected = cartaVirandoId === carta.id;

            return (
              <button
                key={carta.id}
                type="button"
                onClick={() => handleEscolherCarta(carta)}
                disabled={Boolean(cartaVirandoId) || embaralhando}
                aria-label={`Escolher carta ${index + 1} do quadrante ${qInfo.nome}`}
                className={`group relative aspect-[3/4] rounded-2xl p-2 sm:p-3 transition-all duration-500 cursor-pointer select-none flex flex-col items-center justify-between border ${
                  isSelected
                    ? "bg-[#B8965A] border-[#1A3C4D] scale-105 shadow-2xl z-20 -translate-y-2"
                    : "bg-gradient-to-br from-[#1A3C4D] via-[#142F3D] to-[#0D1E28] border-[#B8965A]/40 hover:border-[#B8965A] hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#1A3C4D]/25"
                }`}
              >
                {/* Moldura Interna Dourada */}
                <div className="w-full h-full rounded-xl border border-[#B8965A]/30 group-hover:border-[#B8965A]/70 flex flex-col items-center justify-between p-2 transition-colors relative overflow-hidden">
                  <div className="w-full flex items-center justify-between text-[9px] font-serif text-[#E8DEC8]/50">
                    <span>Q{quadranteId}</span>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                  </div>

                  {/* Ornamento Central */}
                  <div className="flex flex-col items-center justify-center my-auto">
                    <div
                      className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-[#B8965A]/40 flex items-center justify-center text-base sm:text-lg transition-transform duration-300 group-hover:scale-110 ${
                        isSelected
                          ? "bg-white text-[#1A3C4D] animate-pulse"
                          : "bg-[#B8965A]/10 text-[#B8965A]"
                      }`}
                    >
                      {SIMBOLOS_QUADRANTE[quadranteId]}
                    </div>
                    <span className="mt-1.5 text-[9px] sm:text-[10px] uppercase tracking-widest text-[#E8DEC8]/70 font-medium">
                      {isSelected ? "Revelando..." : qInfo.nome}
                    </span>
                  </div>

                  <div className="text-[8px] uppercase tracking-widest text-[#B8965A]/60 font-semibold">
                    Kalapa
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
