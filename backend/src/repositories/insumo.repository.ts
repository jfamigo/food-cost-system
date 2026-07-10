import { pool } from '../config/database';

export interface Insumo {
  id: number;
  nome: string;
  peso_bruto: number;
  peso_liquido: number;
  fator_correcao: number;
  preco_compra: number;
  custo_unidade_real: number;
  peso_medio_unidade: number | null;
  ativo: boolean;
}

export async function buscarTodosInsumos(): Promise<Insumo[]> {
  const resultado = await pool.query(
    `SELECT id, nome, peso_bruto, peso_liquido, fator_correcao, preco_compra, custo_unidade_real, peso_medio_unidade, ativo
     FROM insumos
     WHERE ativo = true
     ORDER BY nome ASC`
  );

  return resultado.rows;
}

export interface NovoInsumo {
  nome: string;
  unidade_compra_id: number;
  peso_bruto: number;
  peso_liquido: number;
  preco_compra: number;
  peso_medio_unidade?: number; // opcional, só pra insumos por unidade (ex: ovo)
}

export async function criarInsumo(dados: NovoInsumo): Promise<Insumo> {
  const resultado = await pool.query(
    `INSERT INTO insumos 
      (nome, unidade_compra_id, peso_bruto, peso_liquido, preco_compra, peso_medio_unidade)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, nome, peso_bruto, peso_liquido, fator_correcao, preco_compra, custo_unidade_real, peso_medio_unidade, ativo`,
    [
      dados.nome,
      dados.unidade_compra_id,
      dados.peso_bruto,
      dados.peso_liquido,
      dados.preco_compra,
      dados.peso_medio_unidade ?? null,
    ]
  );

  return resultado.rows[0];
}

export async function buscarInsumoPorId(id: number): Promise<Insumo | null> {
  const resultado = await pool.query(
    `SELECT id, nome, peso_bruto, peso_liquido, fator_correcao, preco_compra, custo_unidade_real, peso_medio_unidade, ativo
    FROM insumos
    WHERE id = $1 AND ativo = true`,
    [id]
  );

  return resultado.rows[0] ?? null;
}

export interface AtualizarInsumo {
  nome?: string;
  unidade_compra_id?: number;
  peso_bruto?: number;
  peso_liquido?: number;
  preco_compra?: number;
  peso_medio_unidade?: number;
}

export async function atualizarInsumo(id: number, dados: AtualizarInsumo): Promise<Insumo | null> {
  const resultado = await pool.query(
    `UPDATE insumos SET
      nome = COALESCE($1, nome),
      unidade_compra_id = COALESCE($2, unidade_compra_id),
      peso_bruto = COALESCE($3, peso_bruto),
      peso_liquido = COALESCE($4, peso_liquido),
      preco_compra = COALESCE($5, preco_compra),
      peso_medio_unidade = COALESCE($6, peso_medio_unidade),
      atualizado_em = now()
     WHERE id = $7 AND ativo = true
     RETURNING id, nome, peso_bruto, peso_liquido, fator_correcao, preco_compra, custo_unidade_real, peso_medio_unidade, ativo`,
    [
      dados.nome,
      dados.unidade_compra_id,
      dados.peso_bruto,
      dados.peso_liquido,
      dados.preco_compra,
      dados.peso_medio_unidade,
      id,
    ]
  );

  return resultado.rows[0] ?? null;
}

export async function desativarInsumo(id: number): Promise<Insumo | null> {
  const resultado = await pool.query(
    `UPDATE insumos SET
      ativo = false,
      atualizado_em = now()
     WHERE id = $1 AND ativo = true
     RETURNING id, nome, peso_bruto, peso_liquido, fator_correcao, preco_compra, custo_unidade_real, peso_medio_unidade, ativo`,
    [id]
  );

  return resultado.rows[0] ?? null;
}