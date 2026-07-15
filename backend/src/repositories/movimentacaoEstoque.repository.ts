import { pool } from '../config/database';

export interface MovimentacaoEstoque {
  id: number;
  insumo_id: number;
  tipo_movimentacao: 'entrada' | 'saida';
  quantidade: number;
  unidade_id: number;
  preco_unitario: number | null;
  data_validade: string | null;
  motivo_perda: string | null;
  data_movimentacao: string;
}

export interface NovaEntradaEstoque {
  insumo_id: number;
  quantidade: number;
  unidade_id: number;
  preco_unitario: number;
  data_validade?: string;
}

export async function registrarEntrada(
  dados: NovaEntradaEstoque
): Promise<MovimentacaoEstoque> {
  const resultado = await pool.query(
    `INSERT INTO movimentacoes_estoque
      (insumo_id, tipo_movimentacao, quantidade, unidade_id, preco_unitario, data_validade)
     VALUES ($1, 'entrada', $2, $3, $4, $5)
     RETURNING id, insumo_id, tipo_movimentacao, quantidade, unidade_id, preco_unitario, data_validade, motivo_perda, data_movimentacao`,
    [
      dados.insumo_id,
      dados.quantidade,
      dados.unidade_id,
      dados.preco_unitario,
      dados.data_validade ?? null,
    ]
  );

  return resultado.rows[0];
}

export interface NovaSaidaEstoque {
  insumo_id: number;
  quantidade: number;
  unidade_id: number;
  motivo_perda: string;
}

export async function registrarSaida(
  dados: NovaSaidaEstoque
): Promise<MovimentacaoEstoque> {
  const resultado = await pool.query(
    `INSERT INTO movimentacoes_estoque
      (insumo_id, tipo_movimentacao, quantidade, unidade_id, motivo_perda)
     VALUES ($1, 'saida', $2, $3, $4)
     RETURNING id, insumo_id, tipo_movimentacao, quantidade, unidade_id, preco_unitario, data_validade, motivo_perda, data_movimentacao`,
    [dados.insumo_id, dados.quantidade, dados.unidade_id, dados.motivo_perda]
  );

  return resultado.rows[0];
}

export async function calcularSaldoEstoque(insumoId: number): Promise<number> {
  const resultado = await pool.query(
    `SELECT
      COALESCE(SUM(CASE WHEN tipo_movimentacao = 'entrada' THEN quantidade ELSE 0 END), 0) -
      COALESCE(SUM(CASE WHEN tipo_movimentacao = 'saida' THEN quantidade ELSE 0 END), 0)
      AS saldo
     FROM movimentacoes_estoque
     WHERE insumo_id = $1`,
    [insumoId]
  );

  return Number(resultado.rows[0].saldo);
}