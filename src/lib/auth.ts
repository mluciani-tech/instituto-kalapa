import crypto from "crypto";

const SESSION_DURATION = 24 * 60 * 60 * 1000;

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (secret) return secret;

  // Fallback legado: avisa pois a senha admin não deve ser usada como secret
  const fallback = process.env.ADMIN_PASSWORD;
  if (fallback) {
    console.warn("[auth] SESSION_SECRET não configurado — usando ADMIN_PASSWORD como fallback. Defina SESSION_SECRET nas env vars.");
  }
  return fallback || "";
}

export function createSessionToken(password: string): string | null {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword || password !== adminPassword) return null;

  const secret = getSecret();
  if (!secret) return null;

  const timestamp = Date.now().toString();
  const hmac = crypto
    .createHmac("sha256", secret)
    .update(password + timestamp)
    .digest("hex");
  return `${timestamp}.${hmac}`;
}

export function verifySessionToken(token: string): boolean {
  const secret = getSecret();
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword || !secret) return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [timestamp, hmac] = parts;
  const expectedHmac = crypto
    .createHmac("sha256", secret)
    .update(adminPassword + timestamp)
    .digest("hex");

  if (hmac.length !== expectedHmac.length) return false;
  if (!crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expectedHmac)))
    return false;

  const age = Date.now() - Number(timestamp);
  if (isNaN(age) || age > SESSION_DURATION) return false;

  return true;
}
