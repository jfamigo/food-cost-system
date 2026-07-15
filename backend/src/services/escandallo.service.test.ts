import { describe, it, expect, vi } from 'vitest';
import { calcularEscandallo } from './escandallo.service';
import * as fichaTecnicaRepo from '../repositories/fichaTecnica.repository';
import * as receitaInsumoRepo from '../repositories/receitaInsumo.repository';
import * as conversaoRepo from '../repositories/conversaoUnidade.repository';

describe('calcularEscandallo', () => {
  it('deve calcular corretamente o custo total de uma receita simples', async () => {
    // Preparando os mocks (dados "de mentira")
    vi.spyOn(fichaTecnicaRepo, 'buscarFichaPorId').mockResolvedValue({
      id: 1,
      nome: 'Receita Teste',
      rendimento_porcoes: 4,
      modo_preparo: null,
      margem_lucro_alvo: 0.30,
      ativo: true,
    });

    vi.spyOn(receitaInsumoRepo, 'buscarInsumosDaReceita').mockResolvedValue([
      {
        insumo_id: 1,
        nome_insumo: 'Cebola',
        quantidade_utilizada: 200,
        unidade_utilizada_id: 2,
        unidade_utilizada_sigla: 'g',
        custo_unidade_real: 6.6667,
        unidade_compra_id: 1,
      },
    ]);

    vi.spyOn(conversaoRepo, 'buscarFatorConversao').mockResolvedValue(0.001);

    // Executando a função real que queremos testar
    const resultado = await calcularEscandallo(1);

    // Verificando se o resultado é o esperado
    expect(resultado.custo_total).toBeCloseTo(1.3333, 3);
    expect(resultado.custo_por_porcao).toBeCloseTo(0.3333, 3);
  });
  it('deve lançar erro quando não existe conversão de unidade cadastrada', async () => {
    vi.spyOn(fichaTecnicaRepo, 'buscarFichaPorId').mockResolvedValue({
      id: 1,
      nome: 'Receita Teste',
      rendimento_porcoes: 4,
      modo_preparo: null,
      margem_lucro_alvo: 0.30,
      ativo: true,
    });

    vi.spyOn(receitaInsumoRepo, 'buscarInsumosDaReceita').mockResolvedValue([
      {
        insumo_id: 1,
        nome_insumo: 'Cebola',
        quantidade_utilizada: 200,
        unidade_utilizada_id: 2,
        unidade_utilizada_sigla: 'g',
        custo_unidade_real: 6.6667,
        unidade_compra_id: 1,
      },
    ]);

    // Simulando que NÃO existe conversão cadastrada
    vi.spyOn(conversaoRepo, 'buscarFatorConversao').mockResolvedValue(null);

    // Esperamos que a função lance um erro
    await expect(calcularEscandallo(1)).rejects.toThrow(
      'Não existe conversão cadastrada'
    );
  });
});