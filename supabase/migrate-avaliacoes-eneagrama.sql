-- ============================================
-- Migration: Avaliações Eneagrama (Captura de Leads e Relatórios)
-- Execute este script no SQL Editor do Supabase
-- ============================================

CREATE TABLE IF NOT EXISTS avaliacoes_eneagrama (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  -- Tipos com a pontuação máxima (1 a 9). Mais de um valor indica empate técnico.
  tipos_principais INTEGER[] NOT NULL,
  -- Pontuação por tipo, ex.: {"1": 18, "2": 12, ... "9": 20}
  pontuacoes JSONB NOT NULL DEFAULT '{}'::jsonb,
  respostas JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices de performance
CREATE INDEX IF NOT EXISTS idx_avaliacoes_eneagrama_created_at ON avaliacoes_eneagrama (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_eneagrama_usuario_id ON avaliacoes_eneagrama (usuario_id);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_eneagrama_tipos ON avaliacoes_eneagrama USING GIN (tipos_principais);

-- Habilitar RLS
ALTER TABLE avaliacoes_eneagrama ENABLE ROW LEVEL SECURITY;

-- Política para inserção (público / autenticado)
DROP POLICY IF EXISTS "Permitir insercao de avaliacao eneagrama" ON avaliacoes_eneagrama;
CREATE POLICY "Permitir insercao de avaliacao eneagrama"
  ON avaliacoes_eneagrama FOR INSERT
  WITH CHECK (true);

-- Política de leitura
DROP POLICY IF EXISTS "Permitir leitura de avaliacao eneagrama" ON avaliacoes_eneagrama;
CREATE POLICY "Permitir leitura de avaliacao eneagrama"
  ON avaliacoes_eneagrama FOR SELECT
  USING (true);
