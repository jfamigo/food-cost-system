import { Request, Response } from 'express';
import { listarFichas, buscarFicha, cadastrarFicha } from '../services/fichaTecnica.service';

export async function getFichas(req: Request, res: Response): Promise<void> {
  try {
    const fichas = await listarFichas();
    res.status(200).json(fichas);
  } catch (error) {
    console.error('Erro ao buscar fichas técnicas:', error);
    res.status(500).json({ erro: 'Erro interno ao buscar fichas técnicas' });
  }
}

export async function getFichaPorId(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ erro: 'ID inválido — deve ser um número' });
      return;
    }

    const ficha = await buscarFicha(id);
    res.status(200).json(ficha);
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({ erro: error.message });
    } else {
      console.error('Erro desconhecido ao buscar ficha técnica:', error);
      res.status(500).json({ erro: 'Erro interno ao buscar ficha técnica' });
    }
  }
}

export async function postFicha(req: Request, res: Response): Promise<void> {
  try {
    const novaFicha = await cadastrarFicha(req.body);
    res.status(201).json(novaFicha);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ erro: error.message });
    } else {
      console.error('Erro desconhecido ao criar ficha técnica:', error);
      res.status(500).json({ erro: 'Erro interno ao criar ficha técnica' });
    }
  }
}