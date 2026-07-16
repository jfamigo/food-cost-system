import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import insumoRoutes from './routes/insumo.routes';
import fichaTecnicaRoutes from './routes/fichaTecnica.routes';
import receitaInsumoRoutes from './routes/receitaInsumo.routes';
import movimentacaoEstoqueRoutes from './routes/movimentacaoEstoque.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
}));
app.use(express.json());
app.use('/insumos', insumoRoutes);
app.use('/fichas-tecnicas', fichaTecnicaRoutes);
app.use('/fichas-tecnicas/:id/insumos', receitaInsumoRoutes);
app.use('/movimentacoes-estoque', movimentacaoEstoqueRoutes);
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});

