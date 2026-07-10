import { Request, Response } from 'express';
import { listarInsumos, cadastrarInsumo, buscarInsumo, editarInsumo, removerInsumo } from '../services/insumo.service';

export async function getInsumos(req: Request, res: Response): Promise<void> {
  try {
    const insumos = await listarInsumos();
    res.status(200).json(insumos);
  } catch (error) {
    console.error('Erro ao buscar insumos:', error);
    res.status(500).json({ erro: 'Erro interno ao buscar insumos' });
  }
}

export async function postInsumo(req: Request, res: Response): Promise<void> {
  try {
    const novoInsumo = await cadastrarInsumo(req.body);
    res.status(201).json(novoInsumo);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ erro: error.message });
    } else {
      console.error('Erro desconhecido ao criar insumo:', error);
      res.status(500).json({ erro: 'Erro interno ao criar insumo' });
    }
  }
}

export async function getInsumoPorId(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ erro: 'ID inválido — deve ser um número' });
      return;
    }

    const insumo = await buscarInsumo(id);
    res.status(200).json(insumo);
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({ erro: error.message });
    } else {
      console.error('Erro desconhecido ao buscar insumo:', error);
      res.status(500).json({ erro: 'Erro interno ao buscar insumo' });
    }
  }
}

export async function putInsumo(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ erro: 'ID inválido — deve ser um número' });
      return;
    }

    const insumoAtualizado = await editarInsumo(id, req.body);
    res.status(200).json(insumoAtualizado);
  } catch (error) {
    if (error instanceof Error) {
      const statusCode = error.message.includes('não encontrado') ? 404 : 400;
      res.status(statusCode).json({ erro: error.message });
    } else {
      console.error('Erro desconhecido ao atualizar insumo:', error);
      res.status(500).json({ erro: 'Erro interno ao atualizar insumo' });
    }
  }
}

export async function deleteInsumo(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ erro: 'ID inválido — deve ser um número' });
      return;
    }

    await removerInsumo(id);
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({ erro: error.message });
    } else {
      console.error('Erro desconhecido ao remover insumo:', error);
      res.status(500).json({ erro: 'Erro interno ao remover insumo' });
    }
  }
}