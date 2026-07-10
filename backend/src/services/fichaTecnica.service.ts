import {
  buscarTodasFichas,
  buscarFichaPorId,
  criarFichaTecnica,
  FichaTecnica,
  NovaFichaTecnica,
} from '../repositories/fichaTecnica.repository';

export async function listarFichas(): Promise<FichaTecnica[]> {
  const fichas = await buscarTodasFichas();
  return fichas;
}

export async function buscarFicha(id: number): Promise<FichaTecnica> {
  const ficha = await buscarFichaPorId(id);

  if (!ficha) {
    throw new Error(`Ficha Técnica com ID ${id} não encontrada`);
  }

  return ficha;
}

export async function cadastrarFicha(dados: NovaFichaTecnica): Promise<FichaTecnica> {
  // Validação 1: nome obrigatório
  if (!dados.nome || dados.nome.trim().length === 0) {
    throw new Error('O nome da ficha técnica é obrigatório');
  }

  // Validação 2: rendimento deve ser um número positivo
  if (!dados.rendimento_porcoes || dados.rendimento_porcoes <= 0) {
    throw new Error('O rendimento em porções deve ser maior que zero');
  }

  // Validação 3: margem de lucro, se enviada, deve estar entre 0 e 1 (0% a 100%)
  if (
    dados.margem_lucro_alvo !== undefined &&
    (dados.margem_lucro_alvo < 0 || dados.margem_lucro_alvo > 1)
  ) {
    throw new Error('A margem de lucro alvo deve estar entre 0 e 1 (ex: 0.30 para 30%)');
  }

  const novaFicha = await criarFichaTecnica(dados);
  return novaFicha;
}