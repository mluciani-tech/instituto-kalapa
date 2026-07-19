const SESSION_DURATION = 24 * 60 * 60 * 1000;

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (secret) return secret;
  return process.env.ADMIN_PASSWORD || "";
}

async function hmacSha256Hex(key: string, data: string): Promise<string> {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(data));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createSessionToken(password: string): Promise<string | null> {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword || password !== adminPassword) return null;

  const secret = getSecret();
  if (!secret) return null;

  const timestamp = Date.now().toString();
  const hmac = await hmacSha256Hex(secret, password + timestamp);
  return `${timestamp}.${hmac}`;
}

export async function verifySessionToken(token: string): Promise<boolean> {
  const secret = getSecret();
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword || !secret) return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [timestamp, hmac] = parts;
  const expectedHmac = await hmacSha256Hex(secret, adminPassword + timestamp);

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
