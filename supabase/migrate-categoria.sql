-- Migration: adicionar coluna categoria em produtos
-- Permite agrupar produtos por categoria (ex: atendimentos, vivencias, constelacao)

ALTER TABLE produtos ADD COLUMN IF NOT EXISTS categoria TEXT;

CREATE INDEX IF NOT EXISTS idx_produtos_categoria ON produtos(categoria) WHERE categoria IS NOT NULL;
