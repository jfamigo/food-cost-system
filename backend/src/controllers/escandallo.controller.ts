import { Request, Response } from 'express';
import { calcularEscandallo } from '../services/escandallo.service';

export async function getEscandallo(req: Request, res: Response): Promise<void> {
  try {
    const fichaTecnicaId = Number(req.params.id);

    if (isNaN(fichaTecnicaId)) {
      res.status(400).json({ erro: 'ID da ficha técnica inválido — deve ser um número' });
      return;
    }

    const escandallo = await calcularEscandallo(fichaTecnicaId);
    res.status(200).json(escandallo);
  } catch (error) {
    if (error instanceof Error) {
      const statusCode = error.message.includes('não encontrada') ? 404 : 400;
      res.status(statusCode).json({ erro: error.message });
    } else {
      console.error('Erro desconhecido ao calcular escandallo:', error);
      res.status(500).json({ erro: 'Erro interno ao calcular escandallo' });
    }
  }
}