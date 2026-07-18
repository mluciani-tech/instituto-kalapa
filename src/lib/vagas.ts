// Helpers server-side para vagas (usar apenas em API routes)
import { supabaseAdmin, isAdminConfigured } from "./supabase";

export const VAGAS_PADRAO = 15;
export const TURMA_PADRAO = "2025-01";

export async function getTurmaAtual(): Promise<string> {
  if (!isAdminConfigured()) return TURMA_PADRAO;
  const { data } = await supabaseAdmin!
    .from("configuracoes")
    .select("valor")
    .eq("chave", "turma_atual")
    .single();
  return data?.valor || TURMA_PADRAO;
}

/**
 * Retorna o limite de vagas.
 * Se produtoId informado e o produto tem vagas_maximas, usa o do produto.
 * Senão, cai para o global (configuracoes.vagas_maximas) ou padrão.
 */
export async function getVagasMaximas(produtoId?: string | null): Promise<number> {
  if (!isAdminConfigured()) return VAGAS_PADRAO;

  if (produtoId) {
    const { data: produto } = await supabaseAdmin!
      .from("produtos")
      .select("vagas_maximas")
      .eq("id", produtoId)
      .single();

    if (produto?.vagas_maximas != null) {
      return produto.vagas_maximas;
    }
  }

  const { data: config } = await supabaseAdmin!
    .from("configuracoes")
    .select("valor")
    .eq("chave", "vagas_maximas")
    .single();

  return config ? Number(config.valor) : VAGAS_PADRAO;
}

/**
 * Conta inscrições PAGAS.
 * - Com produtoId: apenas inscrições pagas vinculadas a pedidos daquele produto.
 * - Sem produtoId: todas as inscrições pagas da turma atual.
 *
 * Inscrições "pendente" (checkout abandonado) NÃO contam —
 * a vaga só é ocupada após o webhook confirmar o pagamento.
 */
export async function countInscricoesPagas(produtoId?: string | null): Promise<number> {
  if (!isAdminConfigured()) return 0;

  const turmaAtual = await getTurmaAtual();

  if (produtoId) {
    const { count, error } = await supabaseAdmin!
      .from("inscricoes")
      .select("id, pedidos!inner(produto_id)", { count: "exact", head: true })
      .eq("turma_id", turmaAtual)
      .eq("status", "pago")
      .eq("pedidos.produto_id", produtoId);

    if (error) {
      console.error("[vagas] Erro ao contar por produto:", error);
      return 0;
    }
    return count || 0;
  }

  const { count, error } = await supabaseAdmin!
    .from("inscricoes")
    .select("*", { count: "exact", head: true })
    .eq("turma_id", turmaAtual)
    .eq("status", "pago");

  if (error) {
    console.error("[vagas] Erro ao contar:", error);
    return 0;
  }
  return count || 0;
}
