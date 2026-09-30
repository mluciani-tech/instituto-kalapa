-- ==============================================================================
-- MIGRAÇÃO DE SEGURANÇA E HARDENING (RLS) - INSTITUTO KALAPA
-- Data: Setembro/2026
-- Objetivo: Fechar brechas de leitura pública indevida de dados pessoais (PII),
--           agendamentos clínicos, credenciais e cupons via chave anônima (anon key),
--           sem afetar nenhuma funcionalidade do site (o backend Next.js utiliza service_role).
-- ==============================================================================

-- 1. HABILITAR ROW LEVEL SECURITY (RLS) EM TODAS AS TABELAS SENSÍVEIS
ALTER TABLE IF EXISTS configuracoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS inscricoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS appointment_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS cupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS cupons_usos ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS usuarios ENABLE ROW LEVEL SECURITY;

-- 2. REMOVER POLÍTICAS DE LEITURA PÚBLICA IRRESTRITA (EXPOSIÇÃO DE DADOS)
DROP POLICY IF EXISTS "leitura_publica_configuracoes" ON configuracoes;
DROP POLICY IF EXISTS "atualizacao_admin_configuracoes" ON configuracoes;
DROP POLICY IF EXISTS "insercao_admin_configuracoes" ON configuracoes;

DROP POLICY IF EXISTS "leitura_publica_inscricoes" ON inscricoes;
DROP POLICY IF EXISTS "leitura_publica_appointments" ON appointments;
DROP POLICY IF EXISTS "leitura_publica_cupons" ON cupons;
DROP POLICY IF EXISTS "leitura_publica_pedidos" ON pedidos;

-- 3. POLÍTICAS SEGURAS: ACESSO EXCLUSIVO VIA SERVICE_ROLE (BACKEND NEXT.JS)

-- Configurações (evita extração de senhas SMTP e credenciais internas)
DROP POLICY IF EXISTS "service_role_configuracoes" ON configuracoes;
CREATE POLICY "service_role_configuracoes" ON configuracoes
  FOR ALL TO public
  USING (auth.role() = 'service_role');

-- Inscrições (protege dados de contato, CPF e valores pagos dos participantes)
DROP POLICY IF EXISTS "service_role_inscricoes" ON inscricoes;
CREATE POLICY "service_role_inscricoes" ON inscricoes
  FOR ALL TO public
  USING (auth.role() = 'service_role');

-- Agendamentos e notas clínicas (garante sigilo terapêutico absoluto)
DROP POLICY IF EXISTS "service_role_appointments" ON appointments;
CREATE POLICY "service_role_appointments" ON appointments
  FOR ALL TO public
  USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "service_role_appointment_logs" ON appointment_logs;
CREATE POLICY "service_role_appointment_logs" ON appointment_logs
  FOR ALL TO public
  USING (auth.role() = 'service_role');

-- Pedidos e Clientes
DROP POLICY IF EXISTS "service_role_pedidos" ON pedidos;
CREATE POLICY "service_role_pedidos" ON pedidos
  FOR ALL TO public
  USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "service_role_usuarios" ON usuarios;
CREATE POLICY "service_role_usuarios" ON usuarios
  FOR ALL TO public
  USING (auth.role() = 'service_role');

-- Cupons e Usos (evita que visitantes enumerem cupons promocionais ou internos)
DROP POLICY IF EXISTS "service_role_cupons" ON cupons;
CREATE POLICY "service_role_cupons" ON cupons
  FOR ALL TO public
  USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "service_role_cupons_usos" ON cupons_usos;
CREATE POLICY "service_role_cupons_usos" ON cupons_usos
  FOR ALL TO public
  USING (auth.role() = 'service_role');

-- ==============================================================================
-- 4. CONFERÊNCIA DE TABELAS PÚBLICAS PERMITIDAS
-- therapists, therapist_availability e produtos continuam com leitura pública
-- restrita a 'ativo = true' para o catálogo do site funcionar perfeitamente.
-- ==============================================================================
