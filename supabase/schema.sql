-- Schema do banco para o Instituto Kalapa
-- Execute este SQL no SQL Editor do Supabase

CREATE TABLE IF NOT EXISTS inscricoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  turma_id TEXT NOT NULL DEFAULT '2025-01',
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT NOT NULL,
  motivacao TEXT,
  metodo_pagamento TEXT,
  valor INTEGER DEFAULT 97,
  status TEXT NOT NULL DEFAULT 'confirmada',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para buscar por turma
CREATE INDEX IF NOT EXISTS idx_inscricoes_turma ON inscricoes(turma_id);

-- Índice para buscar por status
CREATE INDEX IF NOT EXISTS idx_inscricoes_status ON inscricoes(status);

-- Row Level Security
ALTER TABLE inscricoes ENABLE ROW LEVEL SECURITY;

-- Política: leitura pública (para o contador de vagas funcionar)
CREATE POLICY "leitura_publica_inscricoes" ON inscricoes
  FOR SELECT USING (true);

-- INSERT/UPDATE/DELETE: apenas via service_role no servidor (sem política pública)
-- O servidor usa a service_role key para inserir/atualizar registros
