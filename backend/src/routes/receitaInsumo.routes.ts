import { Router } from 'express';
import { postInsumoNaReceita } from '../controllers/receitaInsumo.controller';

const router = Router({ mergeParams: true });

router.post('/', postInsumoNaReceita);

export default router;