import { Request, Response } from 'express';
import { vincularInsumoReceita } from '../services/receitaInsumo.service';

export async function postInsumoNaReceita(req: Request, res: Response): Promise<void> {
  try {
    const fichaTecnicaId = Number(req.params.id);

    if (isNaN(fichaTecnicaId)) {
      res.status(400).json({ erro: 'ID da ficha técnica inválido — deve ser um número' });
      return;
    }

    const vinculo = await vincularInsumoReceita(fichaTecnicaId, req.body);
    res.status(201).json(vinculo);
  } catch (error) {
    if (error instanceof Error) {
      const statusCode = error.message.includes('não encontrad') ? 404 : 400;
      res.status(statusCode).json({ erro: error.message });
    } else {
      console.error('Erro desconhecido ao vincular insumo à receita:', error);
      res.status(500).json({ erro: 'Erro interno ao vincular insumo à receita' });
    }
  }
}