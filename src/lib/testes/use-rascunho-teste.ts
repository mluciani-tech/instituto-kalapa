"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Rascunho de um teste em andamento, guardado no navegador (localStorage).
 *
 * Padrão para TODOS os testes de autoconhecimento (atuais e futuros):
 * - a chave é `kalapa:teste-rascunho:<slug>:<usuarioId>`, então cada teste e cada usuário
 *   têm o seu rascunho, sem colisão em computadores compartilhados;
 * - o rascunho só é lido uma vez, ao carregar, para a tela inicial oferecer "Continuar";
 * - é apagado ao concluir o teste ou ao escolher "Começar do zero".
 */
export interface RascunhoTeste<R> {
  respostas: R;
  indice: number;
  atualizadoEm: string;
}

const PREFIXO = "kalapa:teste-rascunho:";

export function useRascunhoTeste<R extends object>(
  slug: string,
  usuarioId: string | null | undefined
) {
  const chave = usuarioId ? `${PREFIXO}${slug}:${usuarioId}` : null;
  const [rascunho, setRascunho] = useState<RascunhoTeste<R> | null>(null);

  useEffect(() => {
    if (!chave) {
      setRascunho(null);
      return;
    }
    try {
      const raw = window.localStorage.getItem(chave);
      if (!raw) {
        setRascunho(null);
        return;
      }
      const parsed = JSON.parse(raw) as Partial<RascunhoTeste<R>>;
      const valido =
        parsed &&
        typeof parsed.indice === "number" &&
        parsed.indice >= 0 &&
        parsed.respostas &&
        typeof parsed.respostas === "object" &&
        Object.keys(parsed.respostas).length > 0;
      setRascunho(valido ? (parsed as RascunhoTeste<R>) : null);
    } catch {
      setRascunho(null);
    }
  }, [chave]);

  const salvar = useCallback(
    (respostas: R, indice: number) => {
      if (!chave || Object.keys(respostas).length === 0) return;
      try {
        const dado: RascunhoTeste<R> = {
          respostas,
          indice,
          atualizadoEm: new Date().toISOString(),
        };
        window.localStorage.setItem(chave, JSON.stringify(dado));
      } catch {
        // Armazenamento cheio ou bloqueado (modo privado): o teste segue funcionando sem rascunho.
      }
    },
    [chave]
  );

  const limpar = useCallback(() => {
    setRascunho(null);
    if (!chave) return;
    try {
      window.localStorage.removeItem(chave);
    } catch {
      // ignora
    }
  }, [chave]);

  return { rascunho, salvar, limpar };
}
