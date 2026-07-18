-- ============================================
-- MIGRATION: Vagas por produto
-- Adiciona coluna vagas_maximas (nullable) na tabela produtos
-- ============================================

ALTER TABLE produtos
  ADD COLUMN IF NOT EXISTS vagas_maximas INTEGER;

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_produtos_vagas ON produtos(vagas_maximas);
