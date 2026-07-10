-- =========================================================
-- SEED: Dados de teste para desenvolvimento
-- =========================================================

-- Reseta as tabelas e os contadores de ID antes de inserir
TRUNCATE TABLE receita_insumos, fichas_tecnicas, insumos, conversoes_unidade, unidades_medida
RESTART IDENTITY CASCADE;

-- Unidades básicas
INSERT INTO unidades_medida (nome, sigla) VALUES
    ('quilograma', 'kg'),
    ('grama', 'g'),
    ('litro', 'l'),
    ('mililitro', 'ml'),
    ('unidade', 'un');

-- Conversões universais (usando sigla, não ID fixo)
INSERT INTO conversoes_unidade (unidade_origem_id, unidade_destino_id, fator_multiplicador)
VALUES
    ((SELECT id FROM unidades_medida WHERE sigla = 'g'),  (SELECT id FROM unidades_medida WHERE sigla = 'kg'), 0.001),
    ((SELECT id FROM unidades_medida WHERE sigla = 'kg'), (SELECT id FROM unidades_medida WHERE sigla = 'g'),  1000),
    ((SELECT id FROM unidades_medida WHERE sigla = 'ml'), (SELECT id FROM unidades_medida WHERE sigla = 'l'),  0.001),
    ((SELECT id FROM unidades_medida WHERE sigla = 'l'),  (SELECT id FROM unidades_medida WHERE sigla = 'ml'), 1000);

-- Insumo comprado a peso (Cebola, com merma)
INSERT INTO insumos (nome, unidade_compra_id, peso_bruto, peso_liquido, preco_compra)
VALUES (
    'Cebola',
    (SELECT id FROM unidades_medida WHERE sigla = 'kg'),
    1.000, 0.900, 4.50
);

-- Insumo comprado por unidade (Ovo)
INSERT INTO insumos (nome, unidade_compra_id, peso_bruto, peso_liquido, preco_compra, peso_medio_unidade)
VALUES (
    'Ovo',
    (SELECT id FROM unidades_medida WHERE sigla = 'un'),
    1.000, 1.000, 3.00, 0.060
);