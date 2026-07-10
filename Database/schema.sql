-- =========================================================
-- FASE 1: Modelagem do Banco de Dados
-- Sistema de Food Cost / Ficha Técnica Operacional
-- =========================================================

-- -----------------------------------------
-- 1. Tabela de Unidades de Medida
-- -----------------------------------------
CREATE TABLE unidades_medida (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(30) NOT NULL UNIQUE,     -- 'quilograma', 'grama', 'litro', 'mililitro', 'unidade'
    sigla VARCHAR(5) NOT NULL UNIQUE      -- 'kg', 'g', 'l', 'ml', 'un'
);

COMMENT ON TABLE unidades_medida IS 'Catálogo de unidades de medida usadas em insumos e receitas';

-- -----------------------------------------
-- 2. Tabela de Conversões Universais
--    (só entre unidades da MESMA família física: peso ou volume)
-- -----------------------------------------
CREATE TABLE conversoes_unidade (
    id SERIAL PRIMARY KEY,
    unidade_origem_id INTEGER NOT NULL REFERENCES unidades_medida(id),
    unidade_destino_id INTEGER NOT NULL REFERENCES unidades_medida(id),
    fator_multiplicador NUMERIC(12,6) NOT NULL CHECK (fator_multiplicador > 0),
    -- Ex: origem='g', destino='kg', fator=0.001  →  1g = 0.001kg

    UNIQUE (unidade_origem_id, unidade_destino_id),
    CHECK (unidade_origem_id != unidade_destino_id)
);

COMMENT ON TABLE conversoes_unidade IS 'Fatores de conversão físicos e universais entre unidades (g->kg, ml->l, etc)';

-- -----------------------------------------
-- 3. Tabela Central de Insumos
-- -----------------------------------------
CREATE TABLE insumos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    unidade_compra_id INTEGER NOT NULL REFERENCES unidades_medida(id),

    peso_bruto NUMERIC(10,3) NOT NULL CHECK (peso_bruto > 0),
    peso_liquido NUMERIC(10,3) NOT NULL CHECK (peso_liquido > 0),

    -- Fator de Correção (Merma) - calculado automaticamente
    fator_correcao NUMERIC(10,4) GENERATED ALWAYS AS (peso_bruto / peso_liquido) STORED,

    preco_compra NUMERIC(10,2) NOT NULL CHECK (preco_compra >= 0),

    -- Custo real por unidade líquida - o número que realmente importa pro escandallo
    custo_unidade_real NUMERIC(10,4) GENERATED ALWAYS AS (preco_compra / peso_liquido) STORED,

    -- Peso médio de UMA unidade, só usado quando o insumo é contado por peça
    -- (ex: 1 ovo = 0.060 kg). Fica NULL para insumos vendidos só a granel/peso.
    peso_medio_unidade NUMERIC(10,4),

    ativo BOOLEAN NOT NULL DEFAULT true,
    criado_em TIMESTAMP NOT NULL DEFAULT now(),
    atualizado_em TIMESTAMP NOT NULL DEFAULT now(),

    CONSTRAINT chk_peso_liquido_menor_igual_bruto CHECK (peso_liquido <= peso_bruto),
    CONSTRAINT chk_peso_medio_positivo CHECK (peso_medio_unidade IS NULL OR peso_medio_unidade > 0)
);

COMMENT ON TABLE insumos IS 'Cadastro central de matérias-primas/insumos com custo real calculado';
COMMENT ON COLUMN insumos.fator_correcao IS 'FC = Peso Bruto / Peso Líquido - índice de merma/perda no preparo';

-- -----------------------------------------
-- 4. Tabela de Fichas Técnicas (Receitas/Escandallos)
-- -----------------------------------------
CREATE TABLE fichas_tecnicas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    rendimento_porcoes INTEGER NOT NULL CHECK (rendimento_porcoes > 0),
    modo_preparo TEXT,
    margem_lucro_alvo NUMERIC(5,4) NOT NULL DEFAULT 0.30 CHECK (margem_lucro_alvo BETWEEN 0 AND 1),
    ativo BOOLEAN NOT NULL DEFAULT true,
    criado_em TIMESTAMP NOT NULL DEFAULT now(),
    atualizado_em TIMESTAMP NOT NULL DEFAULT now()
);

COMMENT ON TABLE fichas_tecnicas IS 'Receitas padronizadas (escandallos) com rendimento e margem alvo';

-- -----------------------------------------
-- 5. Tabela Pivot: Insumos <-> Fichas Técnicas
-- -----------------------------------------
CREATE TABLE receita_insumos (
    id SERIAL PRIMARY KEY,
    ficha_tecnica_id INTEGER NOT NULL REFERENCES fichas_tecnicas(id) ON DELETE CASCADE,
    insumo_id INTEGER NOT NULL REFERENCES insumos(id) ON DELETE RESTRICT,

    quantidade_utilizada NUMERIC(10,3) NOT NULL CHECK (quantidade_utilizada > 0),
    unidade_id INTEGER NOT NULL REFERENCES unidades_medida(id),
    -- guarda a unidade EXATA que o usuário digitou na receita (ex: 'g', mesmo que o insumo seja comprado em 'kg')

    UNIQUE (ficha_tecnica_id, insumo_id)
);

COMMENT ON TABLE receita_insumos IS 'Tabela pivot N:N - quais insumos e quantidades compõem cada ficha técnica';

-- -----------------------------------------
-- 6. Índices para performance
-- -----------------------------------------
CREATE INDEX idx_insumos_ativo ON insumos(ativo) WHERE ativo = true;
CREATE INDEX idx_fichas_ativo ON fichas_tecnicas(ativo) WHERE ativo = true;
CREATE INDEX idx_receita_insumos_ficha ON receita_insumos(ficha_tecnica_id);
CREATE INDEX idx_receita_insumos_insumo ON receita_insumos(insumo_id);


-- =========================================================
-- Tabela de Histórico de Preços
-- =========================================================
CREATE TABLE historico_precos_insumo (
    id SERIAL PRIMARY KEY,
    insumo_id INTEGER NOT NULL REFERENCES insumos(id) ON DELETE CASCADE,
    preco_anterior NUMERIC(10,2) NOT NULL,
    preco_novo NUMERIC(10,2) NOT NULL,
    alterado_em TIMESTAMP NOT NULL DEFAULT now()
);

-- =========================================================
-- PARTE 1: A função que será executada pelo gatilho
-- =========================================================
CREATE OR REPLACE FUNCTION registrar_historico_preco()
RETURNS TRIGGER AS $$
BEGIN
    -- Só registra histórico se o preço realmente mudou
    IF NEW.preco_compra IS DISTINCT FROM OLD.preco_compra THEN
        INSERT INTO historico_precos_insumo (insumo_id, preco_anterior, preco_novo)
        VALUES (OLD.id, OLD.preco_compra, NEW.preco_compra);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =========================================================
-- PARTE 2: O gatilho que dispara a função
-- =========================================================
CREATE TRIGGER trigger_historico_preco
    BEFORE UPDATE ON insumos
    FOR EACH ROW
    EXECUTE FUNCTION registrar_historico_preco();