import { Router } from 'express';
import { getFichas, getFichaPorId, postFicha } from '../controllers/fichaTecnica.controller';
import { getEscandallo } from '../controllers/escandallo.controller';

const router = Router();

router.get('/', getFichas);
router.get('/:id', getFichaPorId);
router.post('/', postFicha);
router.get('/:id/escandallo', getEscandallo);

export default router;