import {
  adicionarInsumoNaReceita,
  NovoReceitaInsumo,
  ReceitaInsumo,
} from '../repositories/receitaInsumo.repository';
import { buscarInsumoPorId } from '../repositories/insumo.repository';
import { buscarFichaPorId } from '../repositories/fichaTecnica.repository';
import { buscarUnidadePorId } from '../repositories/unidadeMedida.repository';

export async function vincularInsumoReceita(
  fichaTecnicaId: number,
  dados: NovoReceitaInsumo
): Promise<ReceitaInsumo> {
  // Validação 1: a ficha técnica precisa existir
  const ficha = await buscarFichaPorId(fichaTecnicaId);
  if (!ficha) {
    throw new Error(`Ficha Técnica com ID ${fichaTecnicaId} não encontrada`);
  }

  // Validação 2: o insumo precisa existir
  const insumo = await buscarInsumoPorId(dados.insumo_id);
  if (!insumo) {
    throw new Error(`Insumo com ID ${dados.insumo_id} não encontrado`);
  }

  // Validação 3: a unidade enviada precisa existir
  const unidade = await buscarUnidadePorId(dados.unidade_id);
  if (!unidade) {
    throw new Error(`Unidade de medida com ID ${dados.unidade_id} não encontrada`);
  }

  // Validação 4: quantidade deve ser positiva
  if (!dados.quantidade_utilizada || dados.quantidade_utilizada <= 0) {
    throw new Error('A quantidade utilizada deve ser maior que zero');
  }

  // Validação 5: se a unidade for "un", o insumo precisa ter peso_medio_unidade cadastrado
  if (unidade.sigla === 'un' && insumo.peso_medio_unidade == null) {
    throw new Error(
      `O insumo "${insumo.nome}" não pode ser usado com a unidade "un" — ele não tem peso médio por unidade cadastrado`
    );
  }

  const novoVinculo = await adicionarInsumoNaReceita(fichaTecnicaId, dados);
  return novoVinculo;
}