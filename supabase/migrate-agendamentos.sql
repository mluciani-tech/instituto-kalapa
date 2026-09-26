-- ============================================================
-- Migration: Módulo de Calendário e Agendamento Nativo
-- Instituto Kalapa
-- Execute este script no SQL Editor do seu projeto Supabase
-- ============================================================

-- 1. TABELA DE TERAPEUTAS / PROFISSIONAIS
CREATE TABLE IF NOT EXISTS therapists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  titulo TEXT,
  email TEXT,
  telefone TEXT,
  foto_url TEXT,
  bio TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABELA DE GRADE HORÁRIA PADRÃO (DISPONIBILIDADE SEMANAL)
-- day_of_week: 0 = Domingo, 1 = Segunda, 2 = Terça, 3 = Quarta, 4 = Quinta, 5 = Sexta, 6 = Sábado
CREATE TABLE IF NOT EXISTS therapist_availability (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  therapist_id UUID REFERENCES therapists(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  slot_duration_minutes INT DEFAULT 50,
  buffer_duration_minutes INT DEFAULT 10,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABELA DE BLOQUEIOS MANUAIS / EXCEÇÕES (Férias, compromissos, folgas)
CREATE TABLE IF NOT EXISTS therapist_blocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  therapist_id UUID REFERENCES therapists(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABELA DE AGENDAMENTOS (CONSULTAS)
CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  therapist_id UUID REFERENCES therapists(id) ON DELETE RESTRICT,
  patient_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  produto_id UUID REFERENCES produtos(id) ON DELETE SET NULL,
  pedido_id UUID REFERENCES pedidos(id) ON DELETE SET NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELED', 'COMPLETED')),
  expires_at TIMESTAMPTZ, -- Válido para o Hold de 15 minutos em estado PENDING
  notes TEXT,
  cancellation_reason TEXT,
  canceled_at TIMESTAMPTZ,
  canceled_by TEXT CHECK (canceled_by IN ('patient', 'therapist', 'system')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABELA DE AUDITORIA / LOGS DE AGENDAMENTO
CREATE TABLE IF NOT EXISTS appointment_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  actor_type TEXT NOT NULL CHECK (actor_type IN ('patient', 'therapist', 'admin', 'system')),
  actor_id UUID,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. COLUNA DE VÍNCULO EM PEDIDOS
ALTER TABLE pedidos 
  ADD COLUMN IF NOT EXISTS agendamento_id UUID REFERENCES appointments(id) ON DELETE SET NULL;

-- 7. ÍNDICES DE PERFORMANCE E INTEGRIDADE
CREATE INDEX IF NOT EXISTS idx_appointments_therapist_time ON appointments(therapist_id, start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_pedido ON appointments(pedido_id);
CREATE INDEX IF NOT EXISTS idx_appointments_expires ON appointments(expires_at) WHERE status = 'PENDING';
CREATE INDEX IF NOT EXISTS idx_therapist_avail_day ON therapist_availability(therapist_id, day_of_week);
CREATE INDEX IF NOT EXISTS idx_therapist_blocks_range ON therapist_blocks(therapist_id, start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_appointment_logs_appt ON appointment_logs(appointment_id);

-- 8. ROW LEVEL SECURITY (RLS)
ALTER TABLE therapists ENABLE ROW LEVEL SECURITY;
ALTER TABLE therapist_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE therapist_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_logs ENABLE ROW LEVEL SECURITY;

-- Políticas: therapists (leitura pública dos ativos, gestão via service_role)
DROP POLICY IF EXISTS "leitura_publica_therapists" ON therapists;
CREATE POLICY "leitura_publica_therapists" ON therapists
  FOR SELECT USING (ativo = true);

-- Políticas: therapist_availability (leitura pública para cálculo de slots)
DROP POLICY IF EXISTS "leitura_publica_therapist_availability" ON therapist_availability;
CREATE POLICY "leitura_publica_therapist_availability" ON therapist_availability
  FOR SELECT USING (ativo = true);

-- Políticas: therapist_blocks (leitura pública para cálculo de slots)
DROP POLICY IF EXISTS "leitura_publica_therapist_blocks" ON therapist_blocks;
CREATE POLICY "leitura_publica_therapist_blocks" ON therapist_blocks
  FOR SELECT USING (true);

-- Políticas: appointments (service_role gerencia tudo; usuário vê seus próprios se usar client supabase)
DROP POLICY IF EXISTS "leitura_publica_appointments" ON appointments;
CREATE POLICY "leitura_publica_appointments" ON appointments
  FOR SELECT USING (true);

-- 9. DADOS INICIAIS (SEED)
-- Inserir Clatihúcia Capeli como terapeuta principal caso ainda não exista
INSERT INTO therapists (id, nome, titulo, foto_url, bio, ativo)
VALUES (
  'e7f53a4e-1288-4e89-b051-5b7415444b01',
  'Clatihúcia Capeli',
  'Facilitadora, Psicóloga, Psicogenealogista, Terapeuta Sistêmica e Transpessoal',
  '/foto_10.jpg',
  'Com mais de 10 anos de dedicação ao cuidado emocional e ao desenvolvimento humano, Clatihúcia Capeli conduz vivências e atendimentos que acolhem a dor sem julgamentos, integrando constelação familiar e neurobiologia do trauma.',
  true
) ON CONFLICT (id) DO UPDATE SET
  nome = EXCLUDED.nome,
  titulo = EXCLUDED.titulo,
  ativo = true;

-- Grade horária padrão de Segunda a Sexta (1 a 5)
-- Manhã: 09:00 às 12:00 | Tarde: 14:00 às 18:00 (50 min sessão + 10 min intervalo)
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
) AS t(start_time, end_time)
ON CONFLICT DO NOTHING;

-- Garantir que o produto 'atendimentos' existe na tabela de produtos
INSERT INTO produtos (slug, nome, descricao, descricao_curta, preco, beneficios, destaque, ativo, ordem, categoria, forma_pagamento_disponivel)
VALUES (
  'atendimentos',
  'Atendimento Terapêutico Individual',
  'Sessão individual online ou presencial com Clatihúcia Capeli. Um espaço íntimo, seguro e transformador para acolher seus processos, trabalhar dinâmicas inconscientes e desbloquear padrões repetitivos com abordagem sistêmica e transpessoal.',
  'Sessão individual de 50 min com Clatihúcia Capeli',
  250.00,
  ARRAY[
    'Sessão individual exclusiva de 50 minutos',
    'Abordagem sistêmica, transpessoal e integração do trauma',
    'Acolhimento humanizado em ambiente de absoluto sigilo',
    'Direcionamento prático e pós-sessão consciente'
  ],
  true,
  true,
  2,
  'atendimentos',
  'ambos'
) ON CONFLICT (slug) DO UPDATE SET
  categoria = 'atendimentos',
  ativo = true;
