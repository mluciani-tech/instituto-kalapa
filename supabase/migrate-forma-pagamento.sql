-- Adiciona campo de forma de pagamento disponível por produto
-- 'pix' = apenas PIX
-- 'cartao' = apenas cartão
-- 'ambos' = PIX e cartão (padrão)

ALTER TABLE produtos ADD COLUMN IF NOT EXISTS forma_pagamento_disponivel TEXT NOT NULL DEFAULT 'ambos';

-- Atualiza produtos existentes conforme necessário
-- (nenhum update necessário — padrão 'ambos' funciona para todos)
