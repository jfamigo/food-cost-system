import { Router } from 'express';
import { postEntradaEstoque, postSaidaEstoque, getSaldoEstoque } from '../controllers/movimentacaoEstoque.controller';

const router = Router();

router.post('/entrada', postEntradaEstoque);
router.post('/saida', postSaidaEstoque);
router.get('/saldo/:insumoId', getSaldoEstoque);

export default router;