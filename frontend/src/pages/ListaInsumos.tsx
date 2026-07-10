import { useState, useEffect } from 'react';
import type { Insumo } from '../types/Insumo';
import { buscarInsumos } from '../services/insumoService';

function ListaInsumos() {
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregarInsumos() {
      try {
        const dados = await buscarInsumos();
        setInsumos(dados);
      } catch (err) {
        setErro('Não foi possível carregar os insumos');
        console.error(err);
      } finally {
        setCarregando(false);
      }
    }

    carregarInsumos();
  }, []);

  if (carregando) {
    return <p className="text-center text-gray-500 mt-10">Carregando insumos...</p>;
  }

  if (erro) {
    return <p className="text-center text-red-500 mt-10">{erro}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Insumos Cadastrados</h1>

      <table className="w-full border-collapse bg-white shadow rounded">
        <thead>
          <tr className="bg-slate-800 text-white text-left">
            <th className="p-3">Nome</th>
            <th className="p-3">Peso Bruto</th>
            <th className="p-3">Peso Líquido</th>
            <th className="p-3">Fator Correção</th>
            <th className="p-3">Custo Real</th>
          </tr>
        </thead>
        <tbody>
          {insumos.map((insumo) => (
            <tr key={insumo.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{insumo.nome}</td>
              <td className="p-3">{insumo.peso_bruto} kg</td>
              <td className="p-3">{insumo.peso_liquido} kg</td>
              <td className="p-3">{insumo.fator_correcao}</td>
              <td className="p-3">R$ {insumo.custo_unidade_real}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListaInsumos;