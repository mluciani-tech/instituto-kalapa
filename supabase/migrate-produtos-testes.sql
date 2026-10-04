-- ============================================
-- MIGRATION: Comercialização de Testes de Autoconhecimento
-- INstituto Kalapa — E-commerce & Plataforma de Avaliações
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- 1. ADICIONAR COLUNAS DE TESTE NA TABELA DE PRODUTOS
ALTER TABLE produtos
  ADD COLUMN IF NOT EXISTS is_teste BOOLEAN DEFAULT FALSE NOT NULL,
  ADD COLUMN IF NOT EXISTS rota_teste TEXT,
  ADD COLUMN IF NOT EXISTS orientacoes_pre_teste TEXT,
  ADD COLUMN IF NOT EXISTS inclui_laudo_pdf BOOLEAN DEFAULT TRUE NOT NULL;

COMMENT ON COLUMN produtos.is_teste IS 'Indica se este produto é um Teste de Autoconhecimento / Avaliação clínica';
COMMENT ON COLUMN produtos.rota_teste IS 'Caminho/rota da aplicação do teste (ex: /teste-yin-yang ou /teste-eneagrama)';
COMMENT ON COLUMN produtos.orientacoes_pre_teste IS 'Orientações e recomendações exibidas ao participante antes de iniciar o questionário';
COMMENT ON COLUMN produtos.inclui_laudo_pdf IS 'Indica se a conclusão do teste inclui emissão de laudo/relatório clínico em PDF formato A4';

-- 2. ÍNDICE DE PERFORMANCE PARA PRODUTOS DO TIPO TESTE
CREATE INDEX IF NOT EXISTS idx_produtos_is_teste ON produtos(is_teste);

-- 3. TABELA DE CRÉDITOS / DIREITOS DE ACESSO AOS TESTES
CREATE TABLE IF NOT EXISTS testes_creditos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pedido_id UUID REFERENCES pedidos(id) ON DELETE SET NULL,
  produto_id UUID REFERENCES produtos(id) ON DELETE CASCADE,
  usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  email_beneficiario TEXT NOT NULL,
  slug_teste TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'disponivel', -- 'disponivel', 'utilizado', 'expirado'
  avaliacao_id UUID,
  utilizado_em TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para buscas rápidas no checkout, login e execução de testes
CREATE INDEX IF NOT EXISTS idx_testes_creditos_usuario ON testes_creditos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_testes_creditos_email ON testes_creditos(email_beneficiario);
CREATE INDEX IF NOT EXISTS idx_testes_creditos_slug ON testes_creditos(slug_teste);
CREATE INDEX IF NOT EXISTS idx_testes_creditos_status ON testes_creditos(status);
CREATE INDEX IF NOT EXISTS idx_testes_creditos_pedido ON testes_creditos(pedido_id);

-- 4. SEGURANÇA & RLS (Consistente com pedidos, usuarios e cupons)
ALTER TABLE testes_creditos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "service_role_testes_creditos" ON testes_creditos;
CREATE POLICY "service_role_testes_creditos" ON testes_creditos
  FOR ALL TO public
  USING (auth.role() = 'service_role');

-- 5. CADASTRO INICIAL DOS PRODUTOS DOS TESTES EXISTENTES (YIN/YANG E ENEAGRAMA)
-- Teste 1: Predominância Yin-Yang (MTC)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM produtos WHERE slug = 'teste-yin-yang') THEN
    UPDATE produtos SET
      is_teste = true,
      rota_teste = '/teste-yin-yang',
      orientacoes_pre_teste = 'Responda com sinceridade observando seu estado físico, sensações e disposição geral nas últimas semanas. Não existem respostas certas ou erradas.',
      inclui_laudo_pdf = true,
      categoria = 'testes',
      ativo = true
    WHERE slug = 'teste-yin-yang';
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
      'teste-yin-yang',
      'Teste de Predominância Yin-Yang (MTC)',
      'Avaliação clínica e energética fundamentada no Cânone do Imperador Amarelo (Huangdi Neijing) da Medicina Tradicional Chinesa. Mapeia 15 dimensões fisiológicas e comportamentais (sensações térmicas, digestão, sono Wei Qi, ritmo vital e tônus emocional), gerando um laudo exclusivo com práticas milenares de dietoterapia, fitoterapia tradicional e equilíbrio.',
      '15 Dimensões · Medicina Chinesa · Laudo Clínico em PDF Incluso',
      47.00,
      '/images/yin-yang/banner.jpg',
      ARRAY[
        'Diagnóstico clínico e energético completo (Tendência Yang, Yin ou Equilíbrio Dinâmico)',
        'Análise aprofundada do ciclo de sono e circulação de Wei Qi',
        'Prescrição personalizada de dietoterapia e escolhas alimentares conscientes',
        'Guia de fitoterapia integrativa com receitas de infusões e chás terapêuticos',
        'Emissão instantânea de Relatório Clínico em PDF formato A4 para arquivamento ou acompanhamento terapêutico'
      ],
      true,
      true,
      1,
      'testes',
      'ambos',
      false,
      true,
      '/teste-yin-yang',
      'Responda com sinceridade observando seu estado físico, sensações e disposição geral nas últimas semanas. Não existem respostas certas ou erradas.',
      true
    );
  END IF;
END $$;

-- Teste 2: Personalidade do Eneagrama
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM produtos WHERE slug = 'teste-eneagrama') THEN
    UPDATE produtos SET
      is_teste = true,
      rota_teste = '/teste-eneagrama',
      orientacoes_pre_teste = 'Reserve de 5 a 10 minutos em um local tranquilo e silencioso. Responda com honestidade de acordo com a sua vivência habitual, não como gostaria de ser.',
      inclui_laudo_pdf = true,
      categoria = 'testes',
      ativo = true
    WHERE slug = 'teste-eneagrama';
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
      'teste-eneagrama',
      'Teste de Personalidade do Eneagrama',
      'Mapeamento psicoespiritual profundo que integra a sabedoria ancestral do Eneagrama às Constelações Familiares de Bert Hellinger e à Psicologia Transpessoal. Revela seu eneatipo primário, fixações egóicas, lealdades sistêmicas invisíveis e caminhos de integração para o despertar da Essência.',
      '45 Afirmações · 9 Eneatipos · Laudo Clínico em PDF Incluso',
      67.00,
      '/images/eneagrama/banner.jpg',
      ARRAY[
        'Mapeamento completo dos 9 eneatipos com identificação do tipo central dominante',
        'Análise de flechas de integração (crescimento) e desintegração (estresse)',
        'Compreensão de dinâmicas inconscientes do sistema familiar de origem',
        'Orientações práticas de autodesenvolvimento e expansão de consciência',
        'Relatório Clínico em PDF formato A4 com pontuações completas e gráficos detalhados'
      ],
      true,
      true,
      2,
      'testes',
      'ambos',
      false,
      true,
      '/teste-eneagrama',
      'Reserve de 5 a 10 minutos em um local tranquilo e silencioso. Responda com honestidade de acordo com a sua vivência habitual, não como gostaria de ser.',
      true
    );
  END IF;
END $$;
