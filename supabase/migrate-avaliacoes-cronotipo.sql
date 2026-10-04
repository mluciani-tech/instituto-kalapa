-- ============================================
-- Migration: Avaliações Cronotipo (Captura de Leads e Relatórios)
-- Execute este script no SQL Editor do Supabase
-- ============================================

CREATE TABLE IF NOT EXISTS avaliacoes_cronotipo (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  pontuacao_total INTEGER NOT NULL,
  -- 'matutino', 'intermediario', 'vespertino'
  cronotipo TEXT NOT NULL,
  nome_cronotipo TEXT NOT NULL,
  respostas JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices de performance
CREATE INDEX IF NOT EXISTS idx_avaliacoes_cronotipo_created_at ON avaliacoes_cronotipo (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_cronotipo_usuario_id ON avaliacoes_cronotipo (usuario_id);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_cronotipo_cronotipo ON avaliacoes_cronotipo (cronotipo);

-- Habilitar RLS
ALTER TABLE avaliacoes_cronotipo ENABLE ROW LEVEL SECURITY;

-- Política para inserção (público / autenticado)
DROP POLICY IF EXISTS "Permitir insercao de avaliacao cronotipo" ON avaliacoes_cronotipo;
CREATE POLICY "Permitir insercao de avaliacao cronotipo"
  ON avaliacoes_cronotipo FOR INSERT
  WITH CHECK (true);

-- Política de leitura
DROP POLICY IF EXISTS "Permitir leitura de avaliacao cronotipo" ON avaliacoes_cronotipo;
CREATE POLICY "Permitir leitura de avaliacao cronotipo"
  ON avaliacoes_cronotipo FOR SELECT
  USING (true);

-- Política de exclusão (admin)
DROP POLICY IF EXISTS "Permitir delecao de avaliacao cronotipo" ON avaliacoes_cronotipo;
CREATE POLICY "Permitir delecao de avaliacao cronotipo"
  ON avaliacoes_cronotipo FOR DELETE
  USING (true);

-- ============================================
-- Cadastro do produto Teste de Cronotipo
-- ============================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM produtos WHERE slug = 'teste-cronotipo') THEN
    UPDATE produtos SET
      is_teste = true,
      rota_teste = '/teste-cronotipo',
      orientacoes_pre_teste = 'Responda pensando em como seu organismo funciona de forma espontânea — especialmente em dias livres ou sem a interferência de alarmes e obrigações sociais rígidas.',
      inclui_laudo_pdf = true,
      categoria = 'testes',
      ativo = true
    WHERE slug = 'teste-cronotipo';
  ELSE
    INSERT INTO produtos (
      slug,
      nome,
      descricao,
      descricao_curta,
      preco,
      imagem_url,
      beneficios,
      destaque,
      ativo,
      ordem,
      categoria,
      forma_pagamento_disponivel,
      atendimento_individual,
      is_teste,
      rota_teste,
      orientacoes_pre_teste,
      inclui_laudo_pdf
    ) VALUES (
      'teste-cronotipo',
      'A Sabedoria do Cronotipo & o Ritmo Biológico',
      'Avaliação neurobiológica da preferência circadiana (Cotovia, Urso ou Coruja). Mapeia janelas de pico cognitivo, horários ideais de repouso e tomadas de decisão, com laudo clínico completo de 30 tópicos de orientação prática.',
      '6 Dimensões · Cronobiologia · Laudo Clínico em PDF Incluso',
      0.00,
      '/images/produtos/teste-cronotipo.jpg',
      ARRAY[
        'Identificação do Cronotipo: Cotovia (Matutino), Urso (Intermediário) ou Coruja (Vespertino)',
        'Mapeamento da janela de rendimento e pico de alerta cognitivo no córtex pré-frontal',
        'Diretrizes de sono ideal e prevenção do jetlag social',
        'Dossiê completo com 30 tópicos de cuidado integral (estudos, trabalho, nutrição e mente)',
        'Laudo Clínico em PDF formato A4 para download e impressão'
      ],
      true,
      true,
      3,
      'testes',
      'ambos',
      false,
      true,
      '/teste-cronotipo',
      'Responda pensando em como seu organismo funciona de forma espontânea — especialmente em dias livres ou sem a interferência de alarmes e obrigações sociais rígidas.',
      true
    );
  END IF;
END $$;
