-- ==============================================================================
-- MIGRAÇÃO: TABELA DE TELEMETRIA E DOWNLOADS DA BIBLIOTECA KALAPA
-- Data: 2026-10-12
-- Objetivo: Rastrear downloads de materiais digitais gratuitos e pagos da Biblioteca
--           para geração de leads qualificados e prospecção ativa via WhatsApp.
-- Seguro para produção (IF NOT EXISTS, sem alterar dados existentes)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS downloads_biblioteca (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  produto_id UUID REFERENCES produtos(id) ON DELETE CASCADE,
  usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  cliente_nome TEXT,
  cliente_email TEXT,
  cliente_telefone TEXT,
  arquivo_nome TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices para buscas rápidas no dashboard administrativo
CREATE INDEX IF NOT EXISTS idx_downloads_biblioteca_produto_id 
  ON downloads_biblioteca(produto_id);

CREATE INDEX IF NOT EXISTS idx_downloads_biblioteca_created_at 
  ON downloads_biblioteca(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_downloads_biblioteca_cliente_email 
  ON downloads_biblioteca(cliente_email);

-- Habilitar RLS
ALTER TABLE downloads_biblioteca ENABLE ROW LEVEL SECURITY;

-- Política de RLS: Apenas service_role (backend/admin) tem acesso completo
DROP POLICY IF EXISTS "service_role_all_downloads_biblioteca" ON downloads_biblioteca;
CREATE POLICY "service_role_all_downloads_biblioteca" 
  ON downloads_biblioteca 
  FOR ALL 
  TO service_role 
  USING (true) 
  WITH CHECK (true);
