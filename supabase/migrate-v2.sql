-- ============================================
-- MIGRAÇÃO v1 → v2 — Instituto Kalapa
-- Execute este SQL no SQL Editor do Supabase
-- ============================================

-- 1. Criar tabela produtos
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

-- 2. Criar tabela pedidos
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

-- 3. Adicionar pedido_id na tabela inscricoes
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'inscricoes' AND column_name = 'pedido_id'
  ) THEN
    ALTER TABLE inscricoes ADD COLUMN pedido_id UUID REFERENCES pedidos(id) ON DELETE SET NULL;
  END IF;
END $$;

-- 4. Inserir produto inicial
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

-- 5. Indices
CREATE INDEX IF NOT EXISTS idx_inscricoes_pedido ON inscricoes(pedido_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_order_nsu ON pedidos(order_nsu);
CREATE INDEX IF NOT EXISTS idx_pedidos_status ON pedidos(status);
CREATE INDEX IF NOT EXISTS idx_produtos_slug ON produtos(slug);
CREATE INDEX IF NOT EXISTS idx_produtos_ativo ON produtos(ativo);

-- 6. RLS
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leitura_publica_produtos" ON produtos
  FOR SELECT USING (ativo = true);

-- 7. Recarregar schema do PostgREST
NOTIFY pgrst, 'reload schema';
