-- PARTE 1: TABELAS, VÍNCULOS E SEGURANÇA (RLS)
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

CREATE TABLE IF NOT EXISTS therapist_blocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  therapist_id UUID REFERENCES therapists(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  therapist_id UUID REFERENCES therapists(id) ON DELETE RESTRICT,
  patient_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  produto_id UUID REFERENCES produtos(id) ON DELETE SET NULL,
  pedido_id UUID REFERENCES pedidos(id) ON DELETE SET NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELED', 'COMPLETED')),
  expires_at TIMESTAMPTZ,
  notes TEXT,
  cancellation_reason TEXT,
  canceled_at TIMESTAMPTZ,
  canceled_by TEXT CHECK (canceled_by IN ('patient', 'therapist', 'system')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS appointment_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  actor_type TEXT NOT NULL CHECK (actor_type IN ('patient', 'therapist', 'admin', 'system')),
  actor_id UUID,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS agendamento_id UUID REFERENCES appointments(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_appointments_therapist_time ON appointments(therapist_id, start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_therapist_avail_day ON therapist_availability(therapist_id, day_of_week);
CREATE INDEX IF NOT EXISTS idx_therapist_blocks_range ON therapist_blocks(therapist_id, start_time, end_time);

ALTER TABLE therapists ENABLE ROW LEVEL SECURITY;
ALTER TABLE therapist_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE therapist_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "leitura_publica_therapists" ON therapists;
CREATE POLICY "leitura_publica_therapists" ON therapists FOR SELECT USING (ativo = true);

DROP POLICY IF EXISTS "leitura_publica_therapist_availability" ON therapist_availability;
CREATE POLICY "leitura_publica_therapist_availability" ON therapist_availability FOR SELECT USING (ativo = true);

DROP POLICY IF EXISTS "leitura_publica_therapist_blocks" ON therapist_blocks;
CREATE POLICY "leitura_publica_therapist_blocks" ON therapist_blocks FOR SELECT USING (true);

DROP POLICY IF EXISTS "leitura_publica_appointments" ON appointments;
CREATE POLICY "leitura_publica_appointments" ON appointments FOR SELECT USING (true);
