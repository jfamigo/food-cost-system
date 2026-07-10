import { pool } from '../config/database';

export interface FichaTecnica {
  id: number;
  nome: string;
  rendimento_porcoes: number;
  modo_preparo: string | null;
  margem_lucro_alvo: number;
  ativo: boolean;
}

export interface NovaFichaTecnica {
  nome: string;
  rendimento_porcoes: number;
  modo_preparo?: string;
  margem_lucro_alvo?: number;
}

export async function buscarTodasFichas(): Promise<FichaTecnica[]> {
  const resultado = await pool.query(
    `SELECT id, nome, rendimento_porcoes, modo_preparo, margem_lucro_alvo, ativo
     FROM fichas_tecnicas
     WHERE ativo = true
     ORDER BY nome ASC`
  );

  return resultado.rows;
}

export async function buscarFichaPorId(id: number): Promise<FichaTecnica | null> {
  const resultado = await pool.query(
    `SELECT id, nome, rendimento_porcoes, modo_preparo, margem_lucro_alvo, ativo
     FROM fichas_tecnicas
     WHERE id = $1 AND ativo = true`,
    [id]
  );

  return resultado.rows[0] ?? null;
}

export async function criarFichaTecnica(dados: NovaFichaTecnica): Promise<FichaTecnica> {
  const resultado = await pool.query(
    `INSERT INTO fichas_tecnicas (nome, rendimento_porcoes, modo_preparo, margem_lucro_alvo)
     VALUES ($1, $2, $3, COALESCE($4, 0.30))
     RETURNING id, nome, rendimento_porcoes, modo_preparo, margem_lucro_alvo, ativo`,
    [
      dados.nome,
      dados.rendimento_porcoes,
      dados.modo_preparo ?? null,
      dados.margem_lucro_alvo,
    ]
  );

  return resultado.rows[0];
}