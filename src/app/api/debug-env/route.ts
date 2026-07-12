import { NextResponse } from "next/server";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";

export async function GET() {
  const results: Record<string, unknown> = {
    isAdminConfigured: isAdminConfigured(),
    hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  };

  if (!isAdminConfigured()) {
    results.error = "Admin not configured";
    return NextResponse.json(results);
  }

  // Test 1: Read configuracoes
  const { data: configData, error: configError } = await supabaseAdmin!
    .from("configuracoes")
    .select("chave, valor");

  results.configTable = configError
    ? { exists: false, error: configError.message, code: configError.code }
    : { exists: true, rows: configData?.length };

  // Test 2: Read inscricoes
  const { data: inscData, error: inscError } = await supabaseAdmin!
    .from("inscricoes")
    .select("id", { count: "exact", head: true });

  results.inscricoesTable = inscError
    ? { exists: false, error: inscError.message, code: inscError.code }
    : { exists: true, count: inscData };

  // Test 3: Upsert test
  const { error: upsertError } = await supabaseAdmin!
    .from("configuracoes")
    .upsert(
      { chave: "preco_sessao", valor: "97", updated_at: new Date().toISOString() },
      { onConflict: "chave" }
    );

  results.upsertTest = upsertError
    ? { success: false, error: upsertError.message, code: upsertError.code }
    : { success: true };

  return NextResponse.json(results);
}
