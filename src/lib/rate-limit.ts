// Rate limiter simples em memória.
// Nota: em serverless (Vercel), cada instância tem seu próprio mapa —
// não é perfeito, mas dificulta força bruta na prática.

type Entry = { count: number; resetAt: number };

const store = new Map<string, Entry>();

// Limpa entradas expiradas periodicamente para não vazar memória
const SWEEP_INTERVAL = 60 * 1000;
let lastSweep = Date.now();

function sweep() {
  const now = Date.now();
  if (now - lastSweep < SWEEP_INTERVAL) return;
  lastSweep = now;
  for (const [key, entry] of store) {
    if (entry.resetAt < now) store.delete(key);
  }
}

/**
 * Retorna true se a requisição deve ser PERMITIDA.
 * @param key identificador (ex: IP)
 * @param maxAttempts tentativas máximas na janela
 * @param windowMs janela de tempo em ms
 */
export function rateLimit(
  key: string,
  maxAttempts: number,
  windowMs: number
): boolean {
  sweep();
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= maxAttempts) return false;

  entry.count += 1;
  return true;
}
