-- ============================================
-- MIGRATION: Tempo de Consulta por Produto
-- Permite definir a duração da consulta/sessão em minutos
-- Valor padrão inicial: 90 minutos (1h30, já incluindo intervalo)
-- ============================================

-- 1. Adicionar coluna duracao_minutos na tabela produtos
ALTER TABLE produtos
  ADD COLUMN IF NOT EXISTS duracao_minutos INTEGER DEFAULT 90;

COMMENT ON COLUMN produtos.duracao_minutos IS 'Duração do atendimento/consulta em minutos para agendamento (padrão: 90 min / 1h30, incluindo intervalo).';

-- 2. Atualizar produtos existentes com atendimento individual para 90 minutos se nulo
UPDATE produtos
SET duracao_minutos = 90
WHERE (atendimento_individual = TRUE OR categoria ILIKE '%atendimento%')
  AND duracao_minutos IS NULL;
