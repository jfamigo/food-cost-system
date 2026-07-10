import { buscarFichaPorId } from '../repositories/fichaTecnica.repository';
import { buscarInsumosDaReceita } from '../repositories/receitaInsumo.repository';
import { buscarFatorConversao } from '../repositories/conversaoUnidade.repository';

export interface ItemCustoCalculado {
  insumo_id: number;
  nome_insumo: string;
  quantidade_utilizada: number;
  custo_calculado: number;
}

export interface Escandallo {
  ficha_tecnica_id: number;
  nome_receita: string;
  rendimento_porcoes: number;
  itens: ItemCustoCalculado[];
  custo_total: number;
  custo_por_porcao: number;
  margem_lucro_alvo: number;
  preco_venda_sugerido: number;
}

export async function calcularEscandallo(fichaTecnicaId: number): Promise<Escandallo> {
  const ficha = await buscarFichaPorId(fichaTecnicaId);
  if (!ficha) {
    throw new Error(`Ficha Técnica com ID ${fichaTecnicaId} não encontrada`);
  }

  const itensReceita = await buscarInsumosDaReceita(fichaTecnicaId);

  if (itensReceita.length === 0) {
    throw new Error('Esta ficha técnica ainda não possui insumos vinculados');
  }

  const itensCalculados: ItemCustoCalculado[] = [];
  let custoTotal = 0;

  for (const item of itensReceita) {
    const fator = await buscarFatorConversao(
      item.unidade_utilizada_id,
      item.unidade_compra_id
    );

    if (fator === null) {
      throw new Error(
        `Não existe conversão cadastrada entre a unidade usada na receita (${item.unidade_utilizada_sigla}) e a unidade de compra do insumo "${item.nome_insumo}"`
      );
    }

    const quantidadeConvertida = Number(item.quantidade_utilizada) * fator;
    const custoCalculado = quantidadeConvertida * item.custo_unidade_real;

    itensCalculados.push({
      insumo_id: item.insumo_id,
      nome_insumo: item.nome_insumo,
      quantidade_utilizada: Number(item.quantidade_utilizada),
      custo_calculado: Number(custoCalculado.toFixed(4)),
    });

    custoTotal += custoCalculado;
  }

  const custoPorPorcao = custoTotal / ficha.rendimento_porcoes;
  const precoVendaSugerido = custoPorPorcao / (1 - Number(ficha.margem_lucro_alvo));

  return {
    ficha_tecnica_id: ficha.id,
    nome_receita: ficha.nome,
    rendimento_porcoes: ficha.rendimento_porcoes,
    itens: itensCalculados,
    custo_total: Number(custoTotal.toFixed(4)),
    custo_por_porcao: Number(custoPorPorcao.toFixed(4)),
    margem_lucro_alvo: Number(ficha.margem_lucro_alvo),
    preco_venda_sugerido: Number(precoVendaSugerido.toFixed(2)),
  };
}