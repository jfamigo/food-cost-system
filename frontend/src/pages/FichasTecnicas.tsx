import { useState, useEffect } from 'react';
import type { FichaTecnica, Escandallo } from '../types/FichaTecnica';
import { buscarFichas, buscarEscandallo } from '../services/fichaTecnicaService';

function FichasTecnicas() {
  const [fichas, setFichas] = useState<FichaTecnica[]>([]);
  const [fichaSelecionadaId, setFichaSelecionadaId] = useState<number | null>(null);
  const [escandallo, setEscandallo] = useState<Escandallo | null>(null);
  const [carregandoLista, setCarregandoLista] = useState(true);
  const [carregandoEscandallo, setCarregandoEscandallo] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregarFichas() {
      try {
        const dados = await buscarFichas();
        setFichas(dados);
      } catch (err) {
        setErro('Não foi possível carregar as fichas técnicas');
        console.error(err);
      } finally {
        setCarregandoLista(false);
      }
    }

    carregarFichas();
  }, []);

  async function selecionarFicha(id: number) {
    setFichaSelecionadaId(id);
    setEscandallo(null);
    setErro(null);
    setCarregandoEscandallo(true);

    try {
      const dados = await buscarEscandallo(id);
      setEscandallo(dados);
    } catch (err) {
      setErro('Não foi possível calcular o escandallo desta receita');
      console.error(err);
    } finally {
      setCarregandoEscandallo(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Fichas Técnicas</h1>

      {erro && <p className="text-red-500 mb-4">{erro}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Coluna 1: Lista de Fichas */}
        <div className="bg-white shadow rounded p-4">
          <h2 className="font-semibold mb-3">Selecione uma receita</h2>

          {carregandoLista ? (
            <p className="text-gray-500">Carregando...</p>
          ) : (
            <ul className="space-y-2">
              {fichas.map((ficha) => (
                <li key={ficha.id}>
                  <button
                    onClick={() => selecionarFicha(ficha.id)}
                    className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 ${
                      fichaSelecionadaId === ficha.id ? 'bg-slate-200 font-medium' : ''
                    }`}
                  >
                    {ficha.nome}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Coluna 2: Escandallo calculado */}
        <div className="bg-white shadow rounded p-4">
          <h2 className="font-semibold mb-3">Escandallo</h2>

          {!fichaSelecionadaId && (
            <p className="text-gray-500">Selecione uma receita ao lado para ver o cálculo.</p>
          )}

          {carregandoEscandallo && <p className="text-gray-500">Calculando...</p>}

          {escandallo && !carregandoEscandallo && (
            <div>
              <table className="w-full text-sm mb-4">
                <thead>
                  <tr className="text-left border-b">
                    <th className="pb-2">Insumo</th>
                    <th className="pb-2">Qtd.</th>
                    <th className="pb-2">Custo</th>
                  </tr>
                </thead>
                <tbody>
                  {escandallo.itens.map((item) => (
                    <tr key={item.insumo_id} className="border-b">
                      <td className="py-1">{item.nome_insumo}</td>
                      <td className="py-1">{item.quantidade_utilizada}</td>
                      <td className="py-1">R$ {item.custo_calculado.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="space-y-1 text-sm border-t pt-3">
                <p>Custo Total: <strong>R$ {escandallo.custo_total.toFixed(2)}</strong></p>
                <p>Rendimento: {escandallo.rendimento_porcoes} porções</p>
                <p>Custo por Porção: <strong>R$ {escandallo.custo_por_porcao.toFixed(2)}</strong></p>
                <p className="text-green-700 text-base mt-2">
                  Preço de Venda Sugerido: <strong>R$ {escandallo.preco_venda_sugerido.toFixed(2)}</strong>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FichasTecnicas;