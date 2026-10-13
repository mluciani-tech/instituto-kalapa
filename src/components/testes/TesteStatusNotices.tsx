import type { ErroRegistroAvaliacao } from "@/lib/testes/use-registrar-avaliacao";

const WHATSAPP_URL = "https://wa.me/5511917452732";

/** Aviso exibido na tela de resultado quando a gravação falhou, com nova tentativa. */
export function SalvarResultadoBanner({
  erro,
  salvando,
  onTentarNovamente,
}: {
  erro: ErroRegistroAvaliacao | null;
  salvando: boolean;
  onTentarNovamente: () => void;
}) {
  if (!erro) return null;

  return (
    <div
      role="alert"
      className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-[#1A3C4D] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
    >
      <p>{erro.mensagem}</p>
      {erro.semCredito ? (
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 px-4 py-2 rounded-xl bg-[#1A3C4D] text-white font-semibold text-center"
        >
          Falar com o Instituto Kalapa
        </a>
      ) : (
        <button
          type="button"
          onClick={onTentarNovamente}
          disabled={salvando}
          className="shrink-0 px-4 py-2 rounded-xl bg-[#1A3C4D] text-white font-semibold disabled:opacity-60 cursor-pointer"
        >
          {salvando ? "Salvando..." : "Tentar salvar novamente"}
        </button>
      )}
    </div>
  );
}

/** Aviso da tela inicial: há um teste em andamento neste navegador. */
export function RascunhoTesteNotice({
  respondidas,
  total,
  onContinuar,
  onRecomecar,
}: {
  respondidas: number;
  total: number;
  onContinuar: () => void;
  onRecomecar: () => void;
}) {
  return (
    <div
      role="status"
      className="mb-6 rounded-2xl border border-[#E8DEC8] bg-[#F8F4ED] p-4 text-sm text-[#1A3C4D] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
    >
      <p>
        Você tem um teste em andamento ({respondidas} de {total} respostas). Quer continuar de onde
        parou?
      </p>
      <div className="flex flex-wrap gap-2 shrink-0">
        <button
          type="button"
          onClick={onContinuar}
          className="px-4 py-2 rounded-xl bg-[#1A3C4D] text-white font-semibold cursor-pointer"
        >
          Continuar de onde parei
        </button>
        <button
          type="button"
          onClick={onRecomecar}
          className="px-4 py-2 rounded-xl border border-[#1A3C4D]/30 text-[#1A3C4D] font-semibold cursor-pointer"
        >
          Começar do zero
        </button>
      </div>
    </div>
  );
}
