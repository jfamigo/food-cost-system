export interface FichaTecnica {
  id: number;
  nome: string;
  rendimento_porcoes: number;
  modo_preparo: string | null;
  margem_lucro_alvo: number;
  ativo: boolean;
}

export interface ItemEscandallo {
  insumo_id: number;
  nome_insumo: string;
  quantidade_utilizada: number;
  custo_calculado: number;
}

export interface Escandallo {
  ficha_tecnica_id: number;
  nome_receita: string;
  rendimento_porcoes: number;
  itens: ItemEscandallo[];
  custo_total: number;
  custo_por_porcao: number;
  margem_lucro_alvo: number;
  preco_venda_sugerido: number;
}