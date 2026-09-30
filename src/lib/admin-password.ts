import { supabaseAdmin, isAdminConfigured } from "./supabase";
import { hashPassword, verifyPassword } from "./cliente-auth";
import crypto from "crypto";

export async function verifyAdminPassword(password: string): Promise<boolean> {
  if (!password) return false;

  try {
    if (isAdminConfigured()) {
      const { data } = await supabaseAdmin!
        .from("configuracoes")
        .select("valor")
        .eq("chave", "admin_password_hash")
        .maybeSingle();

      if (data?.valor) {
        return verifyPassword(password, data.valor);
      }
    }
  } catch (err) {
    console.warn("[admin-password] Erro ao verificar hash de senha do admin:", err);
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;

  const bufA = Buffer.from(password);
  const bufB = Buffer.from(adminPassword);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function setAdminPassword(newPassword: string): Promise<boolean> {
  if (!newPassword || typeof newPassword !== "string" || newPassword.length < 8) {
    throw new Error("A nova senha deve ter no mínimo 8 caracteres.");
  }

  if (!isAdminConfigured()) {
    throw new Error("Banco de dados não configurado (SUPABASE_SERVICE_ROLE_KEY ausente).");
  }

  const newHash = hashPassword(newPassword);

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
    throw error;
  }

  return true;
}
