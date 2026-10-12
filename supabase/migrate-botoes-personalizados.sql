-- ==============================================================================
-- Migration: Botões Personalizados de Ação para Produtos
-- Seguro para produção: apenas adiciona colunas opcionais
-- Não remove nem altera dados existentes.
-- ==============================================================================

ALTER TABLE produtos 
ADD COLUMN IF NOT EXISTS botao_principal_texto TEXT,
ADD COLUMN IF NOT EXISTS botao_secundario_texto TEXT;
