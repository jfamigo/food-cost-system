import { Request, Response } from 'express';
import { registrarCompra, registrarPerda } from '../services/movimentacaoEstoque.service';
import { calcularSaldoEstoque } from '../repositories/movimentacaoEstoque.repository';
import { buscarInsumoPorId } from '../repositories/insumo.repository';

export async function postEntradaEstoque(req: Request, res: Response): Promise<void> {
  try {
    const novaEntrada = await registrarCompra(req.body);
    res.status(201).json(novaEntrada);
  } catch (error) {
    if (error instanceof Error) {
      const statusCode = error.message.includes('não encontrad') ? 404 : 400;
      res.status(statusCode).json({ erro: error.message });
    } else {
      console.error('Erro desconhecido ao registrar entrada de estoque:', error);
      res.status(500).json({ erro: 'Erro interno ao registrar entrada de estoque' });
    }
  }
}

export async function postSaidaEstoque(req: Request, res: Response): Promise<void> {
  try {
    const novaSaida = await registrarPerda(req.body);
    res.status(201).json(novaSaida);
  } catch (error) {
    if (error instanceof Error) {
      const statusCode = error.message.includes('não encontrad') ? 404 : 400;
      res.status(statusCode).json({ erro: error.message });
    } else {
      console.error('Erro desconhecido ao registrar saída de estoque:', error);
      res.status(500).json({ erro: 'Erro interno ao registrar saída de estoque' });
    }
  }
}

export async function getSaldoEstoque(req: Request, res: Response): Promise<void> {
  try {
    const insumoId = Number(req.params.insumoId);

    if (isNaN(insumoId)) {
      res.status(400).json({ erro: 'ID do insumo inválido — deve ser um número' });
      return;
    }

    const insumo = await buscarInsumoPorId(insumoId);
    if (!insumo) {
      res.status(404).json({ erro: `Insumo com ID ${insumoId} não encontrado` });
      return;
    }

    const saldo = await calcularSaldoEstoque(insumoId);

    res.status(200).json({
      insumo_id: insumoId,
      nome_insumo: insumo.nome,
      saldo_atual: saldo,
    });
  } catch (error) {
    console.error('Erro ao consultar saldo de estoque:', error);
    res.status(500).json({ erro: 'Erro interno ao consultar saldo de estoque' });
  }
}