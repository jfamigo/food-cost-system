import express from 'express';
import dotenv from 'dotenv';
import insumoRoutes from './routes/insumo.routes';
import fichaTecnicaRoutes from './routes/fichaTecnica.routes';
import receitaInsumoRoutes from './routes/receitaInsumo.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/insumos', insumoRoutes);
app.use('/fichas-tecnicas', fichaTecnicaRoutes);
app.use('/fichas-tecnicas/:id/insumos', receitaInsumoRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});