import { api } from './api';
import type { Insumo } from '../types/Insumo';

export async function buscarInsumos(): Promise<Insumo[]> {
  const resposta = await api.get<Insumo[]>('/insumos');
  return resposta.data;
}

export interface NovoInsumo {
  nome: string;
  unidade_compra_id: number;
  peso_bruto: number;
  peso_liquido: number;
  preco_compra: number;
  peso_medio_unidade?: number;
}

export async function criarInsumo(dados: NovoInsumo): Promise<Insumo> {
  const resposta = await api.post<Insumo>('/insumos', dados);
  return resposta.data;
}