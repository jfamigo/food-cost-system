import { api } from './api';
import type { MovimentacaoEstoque, SaldoEstoque } from '../types/Estoque';

export interface NovaEntradaEstoque {
  insumo_id: number;
  quantidade: number;
  unidade_id: number;
  preco_unitario: number;
  data_validade?: string;
}

export interface NovaSaidaEstoque {
  insumo_id: number;
  quantidade: number;
  unidade_id: number;
  motivo_perda: string;
}

export async function registrarEntrada(
  dados: NovaEntradaEstoque
): Promise<MovimentacaoEstoque> {
  const resposta = await api.post<MovimentacaoEstoque>(
    '/movimentacoes-estoque/entrada',
    dados
  );
  return resposta.data;
}

export async function registrarSaida(
  dados: NovaSaidaEstoque
): Promise<MovimentacaoEstoque> {
  const resposta = await api.post<MovimentacaoEstoque>(
    '/movimentacoes-estoque/saida',
    dados
  );
  return resposta.data;
}

export async function buscarSaldo(insumoId: number): Promise<SaldoEstoque> {
  const resposta = await api.get<SaldoEstoque>(
    `/movimentacoes-estoque/saldo/${insumoId}`
  );
  return resposta.data;
}