import { supabaseAdmin, isAdminConfigured } from "./supabase";

const SESSION_DURATION = 24 * 60 * 60 * 1000;

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (secret) return secret;
  return process.env.ADMIN_PASSWORD || "";
}

let cachedCredentialId: { value: string; expiresAt: number } | null = null;

export function invalidateAdminCredentialCache() {
  cachedCredentialId = null;
}

export async function getAdminCredentialIdentifier(): Promise<string> {
  const now = Date.now();
  if (cachedCredentialId && cachedCredentialId.expiresAt > now) {
    return cachedCredentialId.value;
  }

  try {
    if (isAdminConfigured()) {
      const { data } = await supabaseAdmin!
        .from("configuracoes")
        .select("valor")
        .eq("chave", "admin_password_hash")
        .maybeSingle();

      if (data?.valor) {
        cachedCredentialId = { value: data.valor, expiresAt: now + 15000 };
        return data.valor;
      }
    }
  } catch (err) {
    console.warn("[auth] Falha ao consultar admin_password_hash no Supabase:", err);
  }

  const fallback = process.env.ADMIN_PASSWORD || "";
  cachedCredentialId = { value: fallback, expiresAt: now + 15000 };
  return fallback;
}

async function hmacSha256Hex(key: string, data: string): Promise<string> {
  const enc = new TextEncoder();
  const cryptoKey = await globalThis.crypto.subtle.importKey(
    "raw",
    enc.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await globalThis.crypto.subtle.sign("HMAC", cryptoKey, enc.encode(data));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createSessionTokenForAdmin(): Promise<string | null> {
  const secret = getSecret();
  if (!secret) return null;

  const credentialId = await getAdminCredentialIdentifier();
  if (!credentialId) return null;

  const timestamp = Date.now().toString();
  const hmac = await hmacSha256Hex(secret, credentialId + timestamp);
  return `${timestamp}.${hmac}`;
}

export async function verifySessionToken(token: string): Promise<boolean> {
  const secret = getSecret();
  if (!secret) return false;

  const credentialId = await getAdminCredentialIdentifier();
  if (!credentialId) return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [timestamp, hmac] = parts;
  const expectedHmac = await hmacSha256Hex(secret, credentialId + timestamp);

  if (hmac.length !== expectedHmac.length) return false;

  const enc = new TextEncoder();
  const a = enc.encode(hmac);
  const b = enc.encode(expectedHmac);
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a[i] ^ b[i];
  if (mismatch !== 0) return false;

  const age = Date.now() - Number(timestamp);
  if (isNaN(age) || age > SESSION_DURATION) return false;

  return true;
}
