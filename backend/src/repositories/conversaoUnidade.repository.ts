import { pool } from '../config/database';

export async function buscarFatorConversao(
  unidadeOrigemId: number,
  unidadeDestinoId: number
): Promise<number | null> {
  // Se a unidade de origem e destino forem a mesma, não precisa de conversão
  if (unidadeOrigemId === unidadeDestinoId) {
    return 1;
  }

  const resultado = await pool.query(
    `SELECT fator_multiplicador
     FROM conversoes_unidade
     WHERE unidade_origem_id = $1 AND unidade_destino_id = $2`,
    [unidadeOrigemId, unidadeDestinoId]
  );

  if (resultado.rows.length === 0) {
    return null;
  }

  return Number(resultado.rows[0].fator_multiplicador);
}