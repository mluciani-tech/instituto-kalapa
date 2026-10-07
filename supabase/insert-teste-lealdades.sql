-- 1. Criação da tabela para armazenar os resultados
CREATE TABLE IF NOT EXISTS public.avaliacoes_lealdades (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    usuario_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    email TEXT,
    telefone TEXT,
    perfil_dominante TEXT,
    pontuacoes JSONB,
    respostas JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Inserção do novo produto
INSERT INTO public.produtos (
    nome, 
    slug, 
    descricao, 
    preco, 
    preco_promocional, 
    categoria, 
    rota_teste, 
    orientacoes_pre_teste, 
    inclui_laudo_pdf, 
    vagas_maximas,
    ordem
) VALUES (
    'A Sabedoria das Lealdades Invisíveis',
    'teste-lealdades-invisiveis',
    'Este teste foi criado para mapear as lealdades inconscientes que influenciam silenciosamente suas escolhas profissionais, seus relacionamentos e seus bloqueios no dia a dia. Por meio de situações existenciais baseadas nas Constelações Familiares de Bert Hellinger, você identificará qual dos seis grandes emaranhamentos sistêmicos está operando com maior intensidade em sua vida atual. Ao concluir, você encontrará um diagnóstico preciso sobre a dinâmica oculta do seu sistema familiar, o caminho de consciência para transformar o amor cego em força e as frases de solução exatas para se libertar de repetições e seguir em direção ao seu próprio destino com ordem e leveza.',
    47.00,
    NULL,
    'Testes',
    '/teste-lealdades-invisiveis',
    'Este é um teste introdutório de autopercepção e reflexão consciente. Escolha as respostas que mais se alinham à sua experiência real.',
    TRUE,
    NULL,
    4 -- Ou o próximo número na ordem
);
