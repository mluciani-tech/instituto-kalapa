-- Schema do banco para o Instituto Kalapa
-- Execute este SQL no SQL Editor do Supabase

-- Tabela de configurações do site (preço, vagas, etc.)
CREATE TABLE IF NOT EXISTS configuracoes (
  chave TEXT PRIMARY KEY,
  valor TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inserir configurações padrão
INSERT INTO configuracoes (chave, valor) VALUES
  ('preco_sessao', '97'),
  ('vagas_maximas', '15'),
  ('turma_atual', '2025-01')
ON CONFLICT (chave) DO NOTHING;

-- Tabela de inscrições
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
ALTER TABLE configuracoes ENABLE ROW LEVEL SECURITY;

-- Políticas para configurações
-- Leitura pública (para o preço aparecer na landing page)
CREATE POLICY "leitura_publica_configuracoes" ON configuracoes
  FOR SELECT USING (true);

-- Apenas service_role pode atualizar
CREATE POLICY "atualizacao_admin_configuracoes" ON configuracoes
  FOR UPDATE USING (auth.role() = 'service_role');

-- Apenas service_role pode inserir
CREATE POLICY "insercao_admin_configuracoes" ON configuracoes
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Políticas para inscrições
-- Leitura pública (para o contador de vagas funcionar)
CREATE POLICY "leitura_publica_inscricoes" ON inscricoes
  FOR SELECT USING (true);

-- INSERT/UPDATE/DELETE: apenas via service_role no servidor (sem política pública)
-- O servidor usa a service_role key para inserir/atualizar registros
