import { pool } from '../config/database';

export interface UnidadeMedida {
  id: number;
  nome: string;
  sigla: string;
}

export async function buscarUnidadePorId(id: number): Promise<UnidadeMedida | null> {
  const resultado = await pool.query(
    `SELECT id, nome, sigla FROM unidades_medida WHERE id = $1`,
    [id]
  );

  return resultado.rows[0] ?? null;
}