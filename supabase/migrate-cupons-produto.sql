-- Migration: Adicionar vinculação de Cupom com Produto
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- Adiciona a coluna produto_id na tabela de cupons
ALTER TABLE cupons 
  ADD COLUMN IF NOT EXISTS produto_id UUID REFERENCES produtos(id) ON DELETE CASCADE;

-- Comentário explicativo
COMMENT ON COLUMN cupons.produto_id IS 'Vincula o cupom a um produto específico. Se NULL, o cupom é válido para qualquer produto.';

-- Opcional: criar índice para acelerar consultas caso tenhamos muitos cupons
CREATE INDEX IF NOT EXISTS idx_cupons_produto_id ON cupons(produto_id);
