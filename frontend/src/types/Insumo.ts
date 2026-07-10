export interface Insumo {
  id: number;
  nome: string;
  peso_bruto: number;
  peso_liquido: number;
  fator_correcao: number;
  preco_compra: number;
  custo_unidade_real: number;
  peso_medio_unidade: number | null;
  ativo: boolean;
}