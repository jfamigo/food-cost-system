export interface MovimentacaoEstoque {
  id: number;
  insumo_id: number;
  tipo_movimentacao: 'entrada' | 'saida';
  quantidade: number;
  unidade_id: number;
  preco_unitario: number | null;
  data_validade: string | null;
  motivo_perda: string | null;
  data_movimentacao: string;
}

export interface SaldoEstoque {
  insumo_id: number;
  nome_insumo: string;
  saldo_atual: number;
}