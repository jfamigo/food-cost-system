import { useState } from 'react';
import { criarInsumo } from '../services/insumoService';

function CadastroInsumo() {
  const [nome, setNome] = useState('');
  const [pesoBruto, setPesoBruto] = useState('');
  const [pesoLiquido, setPesoLiquido] = useState('');
  const [precoCompra, setPrecoCompra] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [mensagemErro, setMensagemErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);

async function handleSubmit(evento: React.FormEvent) {
    evento.preventDefault();
    setMensagemErro(null);
    setSucesso(false);
    setEnviando(true);

    try {
      await criarInsumo({
        nome,
        unidade_compra_id: 1, // por enquanto fixo, vamos melhorar isso depois
        peso_bruto: Number(pesoBruto),
        peso_liquido: Number(pesoLiquido),
        preco_compra: Number(precoCompra),
      });

      setSucesso(true);
      setNome('');
      setPesoBruto('');
      setPesoLiquido('');
      setPrecoCompra('');
    } catch (erro) {
      if (erro instanceof Error) {
        setMensagemErro(erro.message);
      } else {
        setMensagemErro('Erro ao cadastrar insumo');
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Cadastrar Insumo</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow rounded p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nome</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Peso Bruto (kg)</label>
          <input
            type="number"
            step="0.001"
            value={pesoBruto}
            onChange={(e) => setPesoBruto(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Peso Líquido (kg)</label>
          <input
            type="number"
            step="0.001"
            value={pesoLiquido}
            onChange={(e) => setPesoLiquido(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Preço de Compra (R$)</label>
          <input
            type="number"
            step="0.01"
            value={precoCompra}
            onChange={(e) => setPrecoCompra(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {mensagemErro && (
          <p className="text-red-500 text-sm">{mensagemErro}</p>
        )}

        {sucesso && (
          <p className="text-green-600 text-sm">Insumo cadastrado com sucesso!</p>
        )}

        <button
          type="submit"
          disabled={enviando}
          className="w-full bg-slate-800 text-white py-2 rounded hover:bg-slate-700 disabled:opacity-50"
        >
          {enviando ? 'Salvando...' : 'Cadastrar Insumo'}
        </button>
      </form>
    </div>
  );
}

export default CadastroInsumo;