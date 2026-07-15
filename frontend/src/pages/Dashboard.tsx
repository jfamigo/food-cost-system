import { useState, useEffect } from 'react';
import type { Escandallo } from '../types/FichaTecnica';
import { buscarFichas, buscarEscandallo } from '../services/fichaTecnicaService';

function Dashboard() {
  const [escandallos, setEscandallos] = useState<Escandallo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregarDashboard() {
      try {
        // Passo 1: busca a lista de fichas
        const fichas = await buscarFichas();

        // Passo 2: busca o escandallo de cada uma, todas ao mesmo tempo
        const promessas = fichas.map((ficha) => buscarEscandallo(ficha.id));
        const resultados = await Promise.all(promessas);

        // Passo 3: guarda tudo junto no estado
        setEscandallos(resultados);
      } catch (err) {
        setErro('Não foi possível carregar o dashboard');
        console.error(err);
      } finally {
        setCarregando(false);
      }
    }

    carregarDashboard();
  }, []);

  // ... vamos continuar na próxima parte

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard de Margens</h1>
      {erro && <p className="text-red-500 mb-4">{erro}</p>}

      {carregando ? (
        <p className="text-gray-500">Calculando margens de todas as receitas...</p>
      ) : (
        <div className="bg-white shadow rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-800 text-white text-left">
                <th className="p-3">Receita</th>
                <th className="p-3">Custo por Porção</th>
                <th className="p-3">Margem Alvo</th>
                <th className="p-3">Preço Sugerido</th>
              </tr>
            </thead>
            <tbody>
              {escandallos.map((escandallo) => (
                <tr key={escandallo.ficha_tecnica_id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{escandallo.nome_receita}</td>
                  <td className="p-3">R$ {escandallo.custo_por_porcao.toFixed(2)}</td>
                  <td className="p-3">{(escandallo.margem_lucro_alvo * 100).toFixed(0)}%</td>
                  <td className="p-3 text-green-700 font-semibold">
                    R$ {escandallo.preco_venda_sugerido.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Dashboard;