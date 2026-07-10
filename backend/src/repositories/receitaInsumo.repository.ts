import { pool } from '../config/database';

export interface ReceitaInsumo {
  id: number;
  ficha_tecnica_id: number;
  insumo_id: number;
  quantidade_utilizada: number;
  unidade_id: number;
}

export interface NovoReceitaInsumo {
  insumo_id: number;
  quantidade_utilizada: number;
  unidade_id: number;
}

export async function adicionarInsumoNaReceita(
  fichaTecnicaId: number,
  dados: NovoReceitaInsumo
): Promise<ReceitaInsumo> {
  const resultado = await pool.query(
    `INSERT INTO receita_insumos (ficha_tecnica_id, insumo_id, quantidade_utilizada, unidade_id)
     VALUES ($1, $2, $3, $4)
     RETURNING id, ficha_tecnica_id, insumo_id, quantidade_utilizada, unidade_id`,
    [fichaTecnicaId, dados.insumo_id, dados.quantidade_utilizada, dados.unidade_id]
  );

  return resultado.rows[0];
}

export interface ItemReceitaDetalhado {
  insumo_id: number;
  nome_insumo: string;
  quantidade_utilizada: number;
  unidade_utilizada_id: number;
  unidade_utilizada_sigla: string;
  custo_unidade_real: number;
  unidade_compra_id: number;
}

export async function buscarInsumosDaReceita(
  fichaTecnicaId: number
): Promise<ItemReceitaDetalhado[]> {
  const resultado = await pool.query(
    `SELECT
      i.id AS insumo_id,
      i.nome AS nome_insumo,
      ri.quantidade_utilizada,
      ri.unidade_id AS unidade_utilizada_id,
      um.sigla AS unidade_utilizada_sigla,
      i.custo_unidade_real,
      i.unidade_compra_id
     FROM receita_insumos ri
     JOIN insumos i ON i.id = ri.insumo_id
     JOIN unidades_medida um ON um.id = ri.unidade_id
     WHERE ri.ficha_tecnica_id = $1`,
    [fichaTecnicaId]
  );

  return resultado.rows;
}