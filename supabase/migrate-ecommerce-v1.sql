-- ============================================
-- Schema & Migration E-commerce v1 — Instituto Kalapa
-- Execute este SQL no SQL Editor do Supabase
-- ============================================

-- 1. TABELA DE USUARIOS / CLIENTES
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  telefone TEXT NOT NULL,
  cpf TEXT UNIQUE NOT NULL,
  senha_hash TEXT NOT NULL,
  cep TEXT NOT NULL,
  rua TEXT NOT NULL,
  numero TEXT NOT NULL,
  complemento TEXT,
  bairro TEXT NOT NULL,
  cidade TEXT NOT NULL,
  uf VARCHAR(2) NOT NULL,
  ativo BOOLEAN DEFAULT true,
  reset_token TEXT,
  reset_token_expira TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABELA DE CUPONS DE DESCONTO
CREATE TABLE IF NOT EXISTS cupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'porcentagem', -- 'porcentagem' ou 'fixo'
  valor NUMERIC(10,2) NOT NULL,            -- ex: 10.00 para 10% ou 25.00 para R$ 25,00
  quantidade_maxima INTEGER,               -- NULL = ilimitado
  quantidade_utilizada INTEGER DEFAULT 0,
  valor_minimo_pedido NUMERIC(10,2) DEFAULT 0,
  validade TIMESTAMPTZ,                    -- Data de expiracao
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABELA DE REGISTRO DE USO DE CUPONS
CREATE TABLE IF NOT EXISTS cupons_usos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cupom_id UUID REFERENCES cupons(id) ON DELETE CASCADE,
  pedido_id UUID REFERENCES pedidos(id) ON DELETE CASCADE,
  usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  valor_desconto NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ATUALIZACOES ADITIVAS NA TABELA DE PEDIDOS
ALTER TABLE pedidos 
  ADD COLUMN IF NOT EXISTS usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS cupom_id UUID REFERENCES cupons(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS cupom_codigo TEXT,
  ADD COLUMN IF NOT EXISTS valor_desconto NUMERIC(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS cliente_cpf TEXT,
  ADD COLUMN IF NOT EXISTS endereco_entrega JSONB,
  ADD COLUMN IF NOT EXISTS itens JSONB DEFAULT '[]'::jsonb;

-- 5. INDICES DE PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_cpf ON usuarios(cpf);
CREATE INDEX IF NOT EXISTS idx_cupons_codigo ON cupons(codigo);
CREATE INDEX IF NOT EXISTS idx_cupons_ativo ON cupons(ativo);
CREATE INDEX IF NOT EXISTS idx_pedidos_usuario ON pedidos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_cupom ON pedidos(cupom_id);

-- 6. ROW LEVEL SECURITY
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE cupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE cupons_usos ENABLE ROW LEVEL SECURITY;

-- Politica Cupons: leitura publica de cupons ativos para validacao no checkout
DROP POLICY IF EXISTS "leitura_publica_cupons" ON cupons;
CREATE POLICY "leitura_publica_cupons" ON cupons
  FOR SELECT USING (ativo = true);
