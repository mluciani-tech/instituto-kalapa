-- ============================================================================
-- MIGRATION: Jogo Sistêmico — A Metamorfose da Consciência
-- ============================================================================

-- 1. Criação da tabela para armazenar as tiragens e o Caderno Híbrido do participante
CREATE TABLE IF NOT EXISTS public.avaliacoes_metamorfose (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    usuario_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    email TEXT,
    telefone TEXT,
    tema_escolhido TEXT,
    cartas_sorteadas JSONB,
    predominio_bloco TEXT,
    pontuacoes JSONB,
    respostas JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Índices para busca rápida por usuário e e-mail
CREATE INDEX IF NOT EXISTS idx_avaliacoes_metamorfose_usuario_id ON public.avaliacoes_metamorfose(usuario_id);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_metamorfose_email ON public.avaliacoes_metamorfose(email);

-- Habilitar RLS (acesso exclusivo via service_role no backend)
ALTER TABLE public.avaliacoes_metamorfose ENABLE ROW LEVEL SECURITY;

-- 2. Inserção/Atualização do produto na tabela public.produtos
INSERT INTO public.produtos (
    nome,
    slug,
    descricao,
    preco,
    categoria,
    is_teste,
    rota_teste,
    orientacoes_pre_teste,
    inclui_laudo_pdf,
    vagas_maximas,
    ativo,
    ordem
)
SELECT
    'Jogo Sistêmico — A Metamorfose da Consciência',
    'teste-metamorfose',
    'Uma vivência sistêmica interativa profunda com 80 cartas fenomenológicas desenvolvidas pelo INstituto Kalapa. Unindo os quatro estágios da metamorfose da borboleta (O Ovo, A Lagarta, A Crisálida e A Borboleta) às ordens sistêmicas de Bert Hellinger, Jan Jacob Stam e Joan Garriga, o jogo convida você a investigar a matriz oculta do seu projeto, empresa, carreira ou decisão existencial, gerando a Equação Narrativa Contínua da sua alma e um Dossiê Completo de 6 páginas em PDF A4.',
    67.00,
    'testes',
    TRUE,
    '/teste-metamorfose',
    'Mentalize com precisão um projeto, negócio, transição de carreira ou decisão importante antes de retirar suas quatro cartas intuitivas.',
    TRUE,
    NULL,
    TRUE,
    5
WHERE NOT EXISTS (
    SELECT 1 FROM public.produtos WHERE slug = 'teste-metamorfose'
);
