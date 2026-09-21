-- ============================================
-- Migration: Adicionar coluna beneficiarios à tabela pedidos
-- Execute este script no SQL Editor do Supabase
-- ============================================

ALTER TABLE pedidos 
  ADD COLUMN IF NOT EXISTS beneficiarios JSONB DEFAULT '[]'::jsonb;

-- Comentário explicativo na coluna
COMMENT ON COLUMN pedidos.beneficiarios IS 'Lista de participantes/acompanhantes adicionais quando quantidade >= 2: [{produto_id, produto_nome, nome, email, telefone}]';
