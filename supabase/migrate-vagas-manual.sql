-- ============================================
-- MIGRATION: Vagas manuais (contador) por produto
-- Permite ao Administrador definir manualmente o contador de vagas exibido na página
-- Se NULL, o sistema calcula automaticamente com base nas inscrições pagas reais.
-- ============================================

ALTER TABLE produtos
  ADD COLUMN IF NOT EXISTS vagas_ocupadas_manual INTEGER;

COMMENT ON COLUMN produtos.vagas_ocupadas_manual IS 'Número manual de vagas ocupadas a exibir no contador. Se NULL, conta automaticamente as inscrições pagas.';
