-- ============================================================
-- Migration: Atualização de Duração Padrão da Grade (90 minutos / 1:30hs)
-- Instituto Kalapa
-- ============================================================

-- 1. Altera os defaults da tabela therapist_availability
ALTER TABLE therapist_availability ALTER COLUMN slot_duration_minutes SET DEFAULT 90;
ALTER TABLE therapist_availability ALTER COLUMN buffer_duration_minutes SET DEFAULT 0;

-- 2. Atualiza registros existentes que ainda possuam os valores legados de 50 minutos
UPDATE therapist_availability
SET slot_duration_minutes = 90,
    buffer_duration_minutes = 0
WHERE slot_duration_minutes = 50 
   OR slot_duration_minutes IS NULL;
