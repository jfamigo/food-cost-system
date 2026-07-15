import { useState } from 'react';
import ListaInsumos from './pages/ListaInsumos';
import CadastroInsumo from './pages/CadastroInsumo';
import FichasTecnicas from './pages/FichasTecnicas';
import Dashboard from './pages/Dashboard';

function App() {
  const [paginaAtual, setPaginaAtual] = useState<'lista' | 'cadastro' | 'fichas' | 'dashboard'>('lista');

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-slate-800 text-white p-4 flex gap-4 justify-center">
        <button
          onClick={() => setPaginaAtual('lista')}
          className={`px-4 py-2 rounded ${paginaAtual === 'lista' ? 'bg-slate-600' : ''}`}
        >
          Listar Insumos
        </button>
        <button
          onClick={() => setPaginaAtual('cadastro')}
          className={`px-4 py-2 rounded ${paginaAtual === 'cadastro' ? 'bg-slate-600' : ''}`}
        >
          Cadastrar Insumo
        </button>
        <button
          onClick={() => setPaginaAtual('fichas')}
          className={`px-4 py-2 rounded ${paginaAtual === 'fichas' ? 'bg-slate-600' : ''}`}
        >
          Fichas Técnicas
        </button>
        <button
          onClick={() => setPaginaAtual('dashboard')}
          className={`px-4 py-2 rounded ${paginaAtual === 'dashboard' ? 'bg-slate-600' : ''}`}
        >
          Dashboard
        </button>
      </nav>

      {paginaAtual === 'lista' && <ListaInsumos />}
      {paginaAtual === 'cadastro' && <CadastroInsumo />}
      {paginaAtual === 'fichas' && <FichasTecnicas />}
      {paginaAtual === 'dashboard' && <Dashboard />}
    </div>
  );
}

export default App;