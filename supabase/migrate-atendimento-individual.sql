-- ============================================
-- MIGRATION: Atendimento Individual por Produto
-- Permite definir se o produto é um atendimento terapêutico individual
-- com agenda obrigatória antes do pagamento.
-- ============================================

-- 1. Adicionar coluna booleana atendimento_individual
ALTER TABLE produtos
  ADD COLUMN IF NOT EXISTS atendimento_individual BOOLEAN DEFAULT FALSE NOT NULL;

COMMENT ON COLUMN produtos.atendimento_individual IS 'Define se o produto exige agendamento prévio de data/horário na agenda da terapeuta antes do checkout e deve aparecer no filtro de Atendimentos.';

-- 2. Atualizar atendimentos terapêuticos individuais existentes para TRUE
UPDATE produtos
SET atendimento_individual = TRUE
WHERE categoria ILIKE '%atendimento%'
   OR slug ILIKE '%terapia%'
   OR slug ILIKE '%atendimento%'
   OR nome ILIKE '%oleação%'
   OR nome ILIKE '%abhyanga%'
   OR nome ILIKE '%constelação%'
   OR nome ILIKE '%maha lilah%';

-- 3. Criar índice para performance de filtro
CREATE INDEX IF NOT EXISTS idx_produtos_atendimento_individual ON produtos(atendimento_individual);
