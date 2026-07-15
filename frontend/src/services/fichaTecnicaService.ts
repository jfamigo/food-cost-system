import { api } from './api';
import type { FichaTecnica, Escandallo } from '../types/FichaTecnica';

export async function buscarFichas(): Promise<FichaTecnica[]> {
  const resposta = await api.get<FichaTecnica[]>('/fichas-tecnicas');
  return resposta.data;
}

export async function buscarEscandallo(fichaTecnicaId: number): Promise<Escandallo> {
  const resposta = await api.get<Escandallo>(`/fichas-tecnicas/${fichaTecnicaId}/escandallo`);
  return resposta.data;
}