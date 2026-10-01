import { supabaseAdmin, isAdminConfigured } from "./supabase";
import { hashPassword, verifyPassword } from "./cliente-auth";
import crypto from "crypto";

export async function verifyAdminPassword(password: string): Promise<boolean> {
  if (!password || typeof password !== "string") return false;

  const rawInput = password;
  const trimmedInput = password.trim();

  try {
    if (isAdminConfigured()) {
      const { data } = await supabaseAdmin!
        .from("configuracoes")
        .select("valor")
        .eq("chave", "admin_password_hash")
        .maybeSingle();

      if (data?.valor) {
        if (verifyPassword(rawInput, data.valor) || verifyPassword(trimmedInput, data.valor)) {
          return true;
        }
      }
    }
  } catch (err) {
    console.warn("[admin-password] Erro ao verificar hash de senha do admin:", err);
  }

  // Fallback para ADMIN_PASSWORD da variável de ambiente
  const rawEnv = process.env.ADMIN_PASSWORD;
  if (!rawEnv) return false;

  // Trata quotes adicionadas em Vercel ou arquivos .env ("minhasenha" ou 'minhasenha') e espaços
  const cleanEnv = rawEnv.trim().replace(/^["']|["']$/g, "");

  const safeCompare = (a: string, b: string) => {
    try {
      const bufA = Buffer.from(a);
      const bufB = Buffer.from(b);
      if (bufA.length !== bufB.length) return false;
      return crypto.timingSafeEqual(bufA, bufB);
    } catch {
      return false;
    }
  };

  if (
    safeCompare(rawInput, rawEnv) ||
    safeCompare(trimmedInput, cleanEnv) ||
    safeCompare(trimmedInput, rawEnv) ||
    safeCompare(rawInput, cleanEnv)
  ) {
    return true;
  }

  return false;
}

export async function setAdminPassword(newPassword: string): Promise<boolean> {
  const sanitized = newPassword?.trim();
  if (!sanitized || sanitized.length < 8) {
    throw new Error("A nova senha deve ter no mínimo 8 caracteres.");
  }

  if (!isAdminConfigured()) {
    throw new Error("Banco de dados não configurado (SUPABASE_SERVICE_ROLE_KEY ausente).");
  }

  const newHash = hashPassword(sanitized);

  const { error } = await supabaseAdmin!
    .from("configuracoes")
    .upsert(
      {
        chave: "admin_password_hash",
        valor: newHash,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "chave" }
    );

  if (error) {
    console.error("[admin-password] Erro ao salvar novo hash de senha no Supabase:", error);
    throw new Error(`Falha ao gravar senha no banco de dados: ${error.message || "erro de conexão ou permissão"}`);
  }

  return true;
}
