-- ============================================
-- Migration: Avaliações Yin/Yang (Captura de Leads e Relatórios)
-- Execute este script no SQL Editor do Supabase
-- ============================================

CREATE TABLE IF NOT EXISTS avaliacoes_yin_yang (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  tipo_resultado TEXT NOT NULL CHECK (tipo_resultado IN ('yang', 'yin')),
  pontos_yang INTEGER NOT NULL,
  pontos_yin INTEGER NOT NULL,
  respostas JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices de performance
CREATE INDEX IF NOT EXISTS idx_avaliacoes_yin_yang_created_at ON avaliacoes_yin_yang (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_yin_yang_usuario_id ON avaliacoes_yin_yang (usuario_id);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_yin_yang_tipo ON avaliacoes_yin_yang (tipo_resultado);

-- Habilitar RLS
ALTER TABLE avaliacoes_yin_yang ENABLE ROW LEVEL SECURITY;

-- Política para inserção (público / autenticado)
DROP POLICY IF EXISTS "Permitir insercao de avaliacao" ON avaliacoes_yin_yang;
CREATE POLICY "Permitir insercao de avaliacao"
  ON avaliacoes_yin_yang FOR INSERT
  WITH CHECK (true);

-- Política de leitura
DROP POLICY IF EXISTS "Permitir leitura de avaliacao" ON avaliacoes_yin_yang;
CREATE POLICY "Permitir leitura de avaliacao"
  ON avaliacoes_yin_yang FOR SELECT
  USING (true);
