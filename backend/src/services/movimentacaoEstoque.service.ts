import {
  registrarEntrada,
  registrarSaida,
  calcularSaldoEstoque,
  MovimentacaoEstoque,
  NovaEntradaEstoque,
  NovaSaidaEstoque,
} from '../repositories/movimentacaoEstoque.repository';

import { buscarInsumoPorId } from '../repositories/insumo.repository';
import { buscarUnidadePorId } from '../repositories/unidadeMedida.repository';

export async function registrarCompra(
  dados: NovaEntradaEstoque
): Promise<MovimentacaoEstoque> {
  // Validação 1: o insumo precisa existir
  const insumo = await buscarInsumoPorId(dados.insumo_id);
  if (!insumo) {
    throw new Error(`Insumo com ID ${dados.insumo_id} não encontrado`);
  }

  // Validação 2: a unidade precisa existir
  const unidade = await buscarUnidadePorId(dados.unidade_id);
  if (!unidade) {
    throw new Error(`Unidade de medida com ID ${dados.unidade_id} não encontrada`);
  }

  // Validação 3: quantidade deve ser positiva
  if (!dados.quantidade || dados.quantidade <= 0) {
    throw new Error('A quantidade deve ser maior que zero');
  }

  // Validação 4: preço unitário é obrigatório numa compra, e deve ser positivo
  if (dados.preco_unitario === undefined || dados.preco_unitario <= 0) {
    throw new Error('O preço unitário é obrigatório e deve ser maior que zero em uma compra');
  }

  // Validação 5: se data de validade foi informada, não pode ser uma data no passado
  if (dados.data_validade) {
    const dataValidade = new Date(dados.data_validade);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (dataValidade < hoje) {
      throw new Error('A data de validade não pode estar no passado');
    }
  }

  const novaEntrada = await registrarEntrada(dados);
  return novaEntrada;
}

export async function registrarPerda(
  dados: NovaSaidaEstoque
): Promise<MovimentacaoEstoque> {
  // Validação 1: o insumo precisa existir
  const insumo = await buscarInsumoPorId(dados.insumo_id);
  if (!insumo) {
    throw new Error(`Insumo com ID ${dados.insumo_id} não encontrado`);
  }

  // Validação 2: a unidade precisa existir
  const unidade = await buscarUnidadePorId(dados.unidade_id);
  if (!unidade) {
    throw new Error(`Unidade de medida com ID ${dados.unidade_id} não encontrada`);
  }

  // Validação 3: quantidade deve ser positiva
  if (!dados.quantidade || dados.quantidade <= 0) {
    throw new Error('A quantidade deve ser maior que zero');
  }

  // Validação 4: motivo da perda é obrigatório
  if (!dados.motivo_perda || dados.motivo_perda.trim().length === 0) {
    throw new Error('O motivo da perda é obrigatório');
  }

  // Validação 5: não pode registrar perda maior do que o saldo disponível
  const saldoAtual = await calcularSaldoEstoque(dados.insumo_id);
  if (dados.quantidade > saldoAtual) {
    throw new Error(
      `Quantidade insuficiente em estoque. Saldo atual: ${saldoAtual}, tentativa de perda: ${dados.quantidade}`
    );
  }

  const novaSaida = await registrarSaida(dados);
  return novaSaida;
}