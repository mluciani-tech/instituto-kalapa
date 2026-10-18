import type { Produto } from "@/app/components/ProductCard";
import type { VagasInfo } from "./types";

let produtosPromise: Promise<Produto[]> | null = null;
let produtosCacheTime = 0;
const CACHE_TTL_MS = 15_000;

/**
 * Busca a lista de produtos públicos deduplicando chamadas simultâneas no cliente
 * (ex.: ProductHighlights + OtherProductsSection na Home).
 */
export function fetchProdutosPublicosCached(): Promise<Produto[]> {
  const now = Date.now();
  if (produtosPromise && now - produtosCacheTime < CACHE_TTL_MS) {
    return produtosPromise;
  }

  produtosCacheTime = now;
  produtosPromise = fetch("/api/produtos")
    .then((r) => (r.ok ? r.json() : []))
    .catch(() => {
      produtosPromise = null;
      return [];
    });

  return produtosPromise;
}

/**
 * Busca as informações de vagas de múltiplos produtos em uma única requisição batch.
 */
export async function fetchVagasBatchClient(
  produtoIds: string[]
): Promise<Record<string, VagasInfo>> {
  const ids = Array.from(new Set(produtoIds.filter(Boolean)));
  if (ids.length === 0) return {};

  try {
    const res = await fetch(
      `/api/vagas?produto_ids=${encodeURIComponent(ids.join(","))}`
    );
    if (!res.ok) return {};
    const data = await res.json();
    if (data && typeof data === "object") {
      return data as Record<string, VagasInfo>;
    }
    return {};
  } catch {
    return {};
  }
}
