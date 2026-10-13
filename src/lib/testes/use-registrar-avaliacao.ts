"use client";

import { useCallback, useRef, useState } from "react";

export interface ErroRegistroAvaliacao {
  mensagem: string;
  /** true quando a API recusou por falta de crédito: repetir o envio não resolve. */
  semCredito: boolean;
}

/**
 * Envia o resultado de um teste para a API e acompanha o estado da gravação.
 *
 * Padrão para TODOS os testes (atuais e futuros). Contrato esperado da API:
 * - 201/200 com `{ success: true }`  -> gravado (o crédito foi consumido no servidor);
 * - 200 com `{ success: false }`     -> falha do banco, tratada como erro (a API antiga
 *   respondia 200 nesse caso e a tela dava a gravação como feita);
 * - 403 com `{ sem_credito: true }`  -> sem crédito;
 * - demais status                    -> erro.
 * Repetir o envio é seguro: se a primeira tentativa gravou, o crédito já foi consumido e a
 * nova tentativa volta 403, sem duplicar a avaliação.
 */
export function useRegistrarAvaliacao(opcoes: { endpoint: string; onSalvo?: () => void }) {
  const { endpoint, onSalvo } = opcoes;
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<ErroRegistroAvaliacao | null>(null);
  const ultimoPayload = useRef<unknown>(null);

  const registrar = useCallback(
    async (payload: unknown): Promise<boolean> => {
      ultimoPayload.current = payload;
      setSalvando(true);
      setErro(null);
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          if (data?.sem_credito) {
            setErro({
              mensagem:
                data.error ||
                "Não encontramos crédito disponível para registrar este resultado na sua conta.",
              semCredito: true,
            });
            return false;
          }
          throw new Error(data?.error || `HTTP ${res.status}`);
        }
        if (data?.success === false) {
          throw new Error(data?.error || "Falha ao gravar a avaliação");
        }
        if (data?.success === true) {
          onSalvo?.();
        }
        return true;
      } catch (err) {
        console.error(`Erro ao registrar avaliação (${endpoint}):`, err);
        setErro({
          mensagem:
            "Seu resultado está abaixo, mas não conseguimos salvá-lo na sua conta. Não feche esta página: tente salvar novamente para guardar suas respostas e o relatório.",
          semCredito: false,
        });
        return false;
      } finally {
        setSalvando(false);
      }
    },
    [endpoint, onSalvo]
  );

  const tentarNovamente = useCallback(async () => {
    if (ultimoPayload.current == null) return false;
    return registrar(ultimoPayload.current);
  }, [registrar]);

  const limparErro = useCallback(() => setErro(null), []);

  return { registrar, tentarNovamente, limparErro, salvando, erro };
}
