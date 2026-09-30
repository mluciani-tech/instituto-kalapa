-- ============================================================
-- Sincronização: Foto e Dados da Facilitadora na tabela therapists
-- Instituto Kalapa
-- ============================================================

-- Atualiza a tabela therapists com a foto oficial configurada no Admin
UPDATE therapists
SET 
  foto_url = COALESCE((SELECT valor FROM configuracoes WHERE chave = 'facilitadora_foto'), foto_url, 'https://vvbsaaxljsjcvjfevphc.supabase.co/storage/v1/object/public/produtos/1790515404190-jhqgs.jpeg'),
  nome = COALESCE((SELECT valor FROM configuracoes WHERE chave = 'facilitadora_nome'), nome, 'Clatihúcia Capeli'),
  titulo = COALESCE((SELECT valor FROM configuracoes WHERE chave = 'facilitadora_titulo'), titulo, 'Facilitadora, Psicóloga, Psicogenealogista, Terapeuta Sistêmica e Transpessoal'),
  bio = COALESCE((SELECT valor FROM configuracoes WHERE chave = 'facilitadora_bio'), bio)
WHERE id = 'e7f53a4e-1288-4e89-b051-5b7415444b01';
