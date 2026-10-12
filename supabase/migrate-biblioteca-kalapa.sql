-- ==============================================================================
-- Migration: Biblioteca Kalapa (Downloads de Arquivos Digitais)
-- Seguro para produção: apenas adiciona novas colunas com valores padrão seguros
-- Não remove nem altera dados existentes.
-- ==============================================================================

-- 1. Novas colunas na tabela produtos
ALTER TABLE produtos 
ADD COLUMN IF NOT EXISTS arquivo_url TEXT,
ADD COLUMN IF NOT EXISTS arquivo_nome TEXT,
ADD COLUMN IF NOT EXISTS arquivo_tamanho INTEGER, -- tamanho em bytes
ADD COLUMN IF NOT EXISTS is_biblioteca BOOLEAN DEFAULT false;

-- 2. Índice não-bloqueante para consultas de produtos da biblioteca
CREATE INDEX IF NOT EXISTS idx_produtos_is_biblioteca ON produtos(is_biblioteca);
