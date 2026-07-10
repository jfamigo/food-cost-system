import { api } from './api';
import type { Insumo } from '../types/Insumo';

export async function buscarInsumos(): Promise<Insumo[]> {
  const resposta = await api.get<Insumo[]>('/insumos');
  return resposta.data;
}