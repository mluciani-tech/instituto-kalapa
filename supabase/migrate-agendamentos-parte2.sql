-- PARTE 2: DADOS INICIAIS (SEED) E GRADE HORÁRIA
INSERT INTO therapists (id, nome, titulo, foto_url, bio, ativo)
VALUES (
  'e7f53a4e-1288-4e89-b051-5b7415444b01',
  'Clatihúcia Capeli',
  'Facilitadora, Psicóloga, Psicogenealogista, Terapeuta Sistêmica e Transpessoal',
  '/foto_10.jpg',
  'Com mais de 10 anos de dedicação ao cuidado emocional e ao desenvolvimento humano, Clatihúcia Capeli conduz vivências e atendimentos que acolhem a dor sem julgamentos, integrando constelação familiar e neurobiologia do trauma.',
  true
)
ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  titulo = EXCLUDED.titulo,
  ativo = true;

DELETE FROM therapist_availability WHERE therapist_id = 'e7f53a4e-1288-4e89-b051-5b7415444b01';

INSERT INTO therapist_availability (therapist_id, day_of_week, start_time, end_time, slot_duration_minutes, buffer_duration_minutes, ativo)
SELECT 
  'e7f53a4e-1288-4e89-b051-5b7415444b01',
  d,
  t.start_time,
  t.end_time,
  50,
  10,
  true
FROM generate_series(1, 5) AS d
CROSS JOIN (
  VALUES 
    ('09:00:00'::TIME, '12:00:00'::TIME),
    ('14:00:00'::TIME, '18:00:00'::TIME)
) AS t(start_time, end_time);

UPDATE produtos 
SET categoria = 'atendimentos', ativo = true 
WHERE slug = 'atendimentos';
