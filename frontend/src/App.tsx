import { useState } from 'react';
import ListaInsumos from './pages/ListaInsumos';
import CadastroInsumo from './pages/CadastroInsumo';
import FichasTecnicas from './pages/FichasTecnicas';

function App() {
  const [paginaAtual, setPaginaAtual] = useState<'lista' | 'cadastro' | 'fichas'>('lista');

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
      </nav>

      {paginaAtual === 'lista' && <ListaInsumos />}
      {paginaAtual === 'cadastro' && <CadastroInsumo />}
      {paginaAtual === 'fichas' && <FichasTecnicas />}
    </div>
  );
}

export default App;