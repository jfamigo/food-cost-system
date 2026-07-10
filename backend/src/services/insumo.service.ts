import { 
  buscarTodosInsumos, 
  criarInsumo, 
  buscarInsumoPorId, 
  atualizarInsumo,
  desativarInsumo,
  Insumo, 
  NovoInsumo,
  AtualizarInsumo 
} from '../repositories/insumo.repository';

export async function listarInsumos(): Promise<Insumo[]> {
  const insumos = await buscarTodosInsumos();
  return insumos;
}

export async function cadastrarInsumo(dados: NovoInsumo): Promise<Insumo> {
  // Validação 1: nome não pode ser vazio
  if (!dados.nome || dados.nome.trim().length === 0) {
    throw new Error('O nome do insumo é obrigatório');
  }

  // Validação 2: peso líquido não pode ser maior que o peso bruto
  if (dados.peso_liquido > dados.peso_bruto) {
    throw new Error('O peso líquido não pode ser maior que o peso bruto');
  }

  // Validação 3: valores numéricos devem ser positivos
  if (dados.peso_bruto <= 0 || dados.peso_liquido <= 0) {
    throw new Error('Peso bruto e peso líquido devem ser maiores que zero');
  }

  if (dados.preco_compra < 0) {
    throw new Error('O preço de compra não pode ser negativo');
  }

  const novoInsumo = await criarInsumo(dados);
  return novoInsumo;
}

export async function buscarInsumo(id: number): Promise<Insumo> {
  const insumo = await buscarInsumoPorId(id);

  if (!insumo) {
    throw new Error(`Insumo com ID ${id} não encontrado`);
  }

  return insumo;
}

export async function editarInsumo(id: number, dados: AtualizarInsumo): Promise<Insumo> {
  // Validação: se pesos foram enviados, aplicar as mesmas regras de negócio
  if (dados.peso_bruto !== undefined && dados.peso_bruto <= 0) {
    throw new Error('Peso bruto deve ser maior que zero');
  }

  if (dados.peso_liquido !== undefined && dados.peso_liquido <= 0) {
    throw new Error('Peso líquido deve ser maior que zero');
  }

  if (
    dados.peso_bruto !== undefined &&
    dados.peso_liquido !== undefined &&
    dados.peso_liquido > dados.peso_bruto
  ) {
    throw new Error('O peso líquido não pode ser maior que o peso bruto');
  }

  if (dados.preco_compra !== undefined && dados.preco_compra < 0) {
    throw new Error('O preço de compra não pode ser negativo');
  }

  const insumoAtualizado = await atualizarInsumo(id, dados);

  if (!insumoAtualizado) {
    throw new Error(`Insumo com ID ${id} não encontrado`);
  }

  return insumoAtualizado;
}

export async function removerInsumo(id: number): Promise<Insumo> {
  const insumoDesativado = await desativarInsumo(id);

  if (!insumoDesativado) {
    throw new Error(`Insumo com ID ${id} não encontrado`);
  }

  return insumoDesativado;
}