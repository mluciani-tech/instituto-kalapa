-- ============================================
-- Schema v2 — Instituto Kalapa (E-commerce)
-- Execute este SQL no SQL Editor do Supabase
-- ============================================

-- ============================================
-- 1. TABELA DE PRODUTOS
-- ============================================
CREATE TABLE IF NOT EXISTS produtos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  descricao TEXT,
  descricao_curta TEXT,
  preco NUMERIC(10,2) NOT NULL,
  imagem_url TEXT,
  beneficios TEXT[] DEFAULT '{}',
  destaque BOOLEAN DEFAULT false,
  ativo BOOLEAN DEFAULT true,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. TABELA DE PEDIDOS
-- ============================================
CREATE TABLE IF NOT EXISTS pedidos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_nsu TEXT UNIQUE NOT NULL,
  produto_id UUID REFERENCES produtos(id) ON DELETE SET NULL,
  cliente_nome TEXT NOT NULL,
  cliente_email TEXT NOT NULL,
  cliente_telefone TEXT,
  cliente_documento TEXT,
  valor NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente',
  metodo_pagamento TEXT,
  transaction_nsu TEXT,
  receipt_url TEXT,
  capture_method TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. ATUALIZAR TABELA INSCRICOES
-- ============================================
-- Adicionar pedido_id para vincular inscricao ao pedido
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'inscricoes' AND column_name = 'pedido_id'
  ) THEN
    ALTER TABLE inscricoes ADD COLUMN pedido_id UUID REFERENCES pedidos(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Garantir que order_nsu existe (pode já existir de v1)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'inscricoes' AND column_name = 'order_nsu'
  ) THEN
    ALTER TABLE inscricoes ADD COLUMN order_nsu TEXT;
  END IF;
END $$;

-- ============================================
-- 4. TABELA DE CONFIGURACOES (manter)
-- ============================================
CREATE TABLE IF NOT EXISTS configuracoes (
  chave TEXT PRIMARY KEY,
  valor TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Configuracoes padrao (preco_sessao removido — agora vem de produtos)
INSERT INTO configuracoes (chave, valor) VALUES
  ('vagas_maximas', '15'),
  ('turma_atual', '2025-01')
ON CONFLICT (chave) DO NOTHING;

-- ============================================
-- 5. PRODUTO INICIAL (migrar do codigo)
-- ============================================
INSERT INTO produtos (slug, nome, descricao, descricao_curta, preco, beneficios, destaque, ativo, ordem)
VALUES (
  'grupo-autoconhecimento',
  'Grupo de Autoconhecimento',
  'Um espaço seguro e acolhedor para explorar suas emoções, padrões e crenças em grupo. Encontros quinzenais facilitados por profissionais certificados.',
  'Encontros quinzenais · 2h · Grupos reduzidos',
  97.00,
  ARRAY[
    'Acesso à sessão em grupo ao vivo',
    'Material de apoio pós-sessão',
    'Grupo de WhatsApp para suporte entre encontros',
    'Condições especiais para pacotes mensais'
  ],
  true,
  true,
  1
) ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 6. INDICES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_inscricoes_turma ON inscricoes(turma_id);
CREATE INDEX IF NOT EXISTS idx_inscricoes_status ON inscricoes(status);
CREATE INDEX IF NOT EXISTS idx_inscricoes_pedido ON inscricoes(pedido_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_order_nsu ON pedidos(order_nsu);
CREATE INDEX IF NOT EXISTS idx_pedidos_status ON pedidos(status);
CREATE INDEX IF NOT EXISTS idx_produtos_slug ON produtos(slug);
CREATE INDEX IF NOT EXISTS idx_produtos_ativo ON produtos(ativo);

-- ============================================
-- 7. ROW LEVEL SECURITY
-- ============================================
ALTER TABLE inscricoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;

-- Limpar politicas antigas
DROP POLICY IF EXISTS "leitura_publica_configuracoes" ON configuracoes;
DROP POLICY IF EXISTS "atualizacao_admin_configuracoes" ON configuracoes;
DROP POLICY IF EXISTS "insercao_admin_configuracoes" ON configuracoes;
DROP POLICY IF EXISTS "leitura_publica_inscricoes" ON inscricoes;
DROP POLICY IF EXISTS "leitura_publica_produtos" ON produtos;
DROP POLICY IF EXISTS "leitura_publica_pedidos" ON pedidos;

-- Politicas: configuracoes
CREATE POLICY "leitura_publica_configuracoes" ON configuracoes
  FOR SELECT USING (true);

CREATE POLICY "atualizacao_admin_configuracoes" ON configuracoes
  FOR UPDATE USING (auth.role() = 'service_role');

CREATE POLICY "insercao_admin_configuracoes" ON configuracoes
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Politicas: inscricoes (leitura publica, escrita apenas via service_role)
CREATE POLICY "leitura_publica_inscricoes" ON inscricoes
  FOR SELECT USING (true);

-- Politicas: produtos (leitura publica apenas ativos, escrita via service_role)
CREATE POLICY "leitura_publica_produtos" ON produtos
  FOR SELECT USING (ativo = true);

-- Politicas: pedidos (sem leitura publica — apenas service_role)
