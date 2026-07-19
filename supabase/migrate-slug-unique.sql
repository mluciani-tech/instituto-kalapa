-- Migration: Remover UNIQUE do slug para permitir múltiplos produtos com mesmo slug (filtro/categoria)
-- Execute no SQL Editor do Supabase

-- 1. Remover índice único existente
DROP INDEX IF EXISTS idx_produtos_slug;

-- 2. Remover constraint UNIQUE do slug
DO $$
DECLARE
  constraint_name TEXT;
BEGIN
  SELECT conname INTO constraint_name
  FROM pg_constraint
  WHERE conrelid = 'produtos'::regclass
    AND contype = 'u'
    AND array_position(conkey, (
      SELECT attnum FROM pg_attribute
      WHERE attrelid = 'produtos'::regclass AND attname = 'slug'
    )) IS NOT NULL;

  IF constraint_name IS NOT NULL THEN
    EXECUTE 'ALTER TABLE produtos DROP CONSTRAINT ' || constraint_name;
    RAISE NOTICE 'Constraint % removida', constraint_name;
  ELSE
    RAISE NOTICE 'Nenhuma constraint UNIQUE encontrada no slug';
  END IF;
END $$;

-- 3. Criar índice normal (não único) para performance
CREATE INDEX IF NOT EXISTS idx_produtos_slug ON produtos(slug);
