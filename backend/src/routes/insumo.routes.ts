import { Router } from 'express';
import { getInsumos, postInsumo, getInsumoPorId, putInsumo, deleteInsumo } from '../controllers/insumo.controller';

const router = Router();

router.get('/', getInsumos);
router.post('/', postInsumo);
router.get('/:id', getInsumoPorId);
router.put('/:id', putInsumo);
router.delete('/:id', deleteInsumo);

export default router;