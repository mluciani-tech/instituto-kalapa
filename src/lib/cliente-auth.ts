import crypto from "crypto";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isAdminConfigured } from "./supabase";
import type { Usuario } from "./types";

const COOKIE_NAME = "cliente_session";
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 dias

function getSecret(): string {
  return (
    process.env.SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "instituto-kalapa-ecommerce-secret-key-2026"
  );
}

// ============================================
// HASH & VERIFICAÇÃO DE SENHA (scrypt seguro)
// ============================================

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString("hex")}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, key] = storedHash.split(":");
    if (!salt || !key) return false;
    const keyBuffer = Buffer.from(key, "hex");
    const derivedKey = crypto.scryptSync(password, salt, 64);
    if (keyBuffer.length !== derivedKey.length) return false;
    return crypto.timingSafeEqual(keyBuffer, derivedKey);
  } catch {
    return false;
  }
}

// ============================================
// TOKEN DE SESSÃO HMAC SHA-256
// ============================================

interface SessionPayload {
  userId: string;
  email: string;
  exp: number;
}

export function createClienteSessionToken(userId: string, email: string): string {
  const exp = Date.now() + SESSION_DURATION_MS;
  const payload: SessionPayload = { userId, email, exp };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", getSecret())
    .update(payloadB64)
    .digest("base64url");
  return `${payloadB64}.${signature}`;
}

export function verifyClienteSessionToken(token: string): SessionPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [payloadB64, signature] = parts;
    const expectedSig = crypto
      .createHmac("sha256", getSecret())
      .update(payloadB64)
      .digest("base64url");

    if (signature.length !== expectedSig.length) return null;
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      return null;
    }

    const payload: SessionPayload = JSON.parse(
      Buffer.from(payloadB64, "base64url").toString("utf8")
    );

    if (Date.now() > payload.exp) return null;

    return payload;
  } catch {
    return null;
  }
}

// ============================================
// COOKIE DE SESSÃO
// ============================================

export function setClienteSessionCookie(res: NextResponse, token: string) {
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // 'lax' é essencial para que o cookie seja mantido no redirecionamento externo da InfinitePay
    path: "/",
    maxAge: 30 * 24 * 60 * 60, // 30 dias em segundos
  });
}

export function clearClienteSessionCookie(res: NextResponse) {
  res.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

// ============================================
// OBTENÇÃO DO USUÁRIO AUTENTICADO
// ============================================

export async function getClienteFromRequest(req: NextRequest): Promise<Usuario | null> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = verifyClienteSessionToken(token);
  if (!payload || !payload.userId) return null;

  if (!isAdminConfigured()) return null;

  const { data, error } = await supabaseAdmin!
    .from("usuarios")
    .select("id, nome, email, telefone, cpf, cep, rua, numero, complemento, bairro, cidade, uf, ativo, created_at, updated_at")
    .eq("id", payload.userId)
    .eq("ativo", true)
    .single();

  if (error || !data) return null;
  return data as Usuario;
}

export async function getClienteServerSession(): Promise<Usuario | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = verifyClienteSessionToken(token);
  if (!payload || !payload.userId) return null;

  if (!isAdminConfigured()) return null;

  const { data, error } = await supabaseAdmin!
    .from("usuarios")
    .select("id, nome, email, telefone, cpf, cep, rua, numero, complemento, bairro, cidade, uf, ativo, created_at, updated_at")
    .eq("id", payload.userId)
    .eq("ativo", true)
    .single();

  if (error || !data) return null;
  return data as Usuario;
}

// ============================================
// TOKEN DE RECUPERAÇÃO DE SENHA
// ============================================

export function generatePasswordResetToken(): { token: string; expira: Date } {
  const token = crypto.randomBytes(32).toString("hex");
  const expira = new Date(Date.now() + 60 * 60 * 1000); // 1 hora
  return { token, expira };
}
