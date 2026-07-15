import { useState } from 'react';
import { registrarEntrada, registrarSaida, buscarSaldo } from '../services/estoqueService';
import type { SaldoEstoque } from '../types/Estoque';


function Estoque() {
  const [abaAtiva, setAbaAtiva] = useState<'entrada' | 'saida' | 'saldo'>('entrada');
    // Estados do formulário de Entrada (Compra)
  const [insumoIdEntrada, setInsumoIdEntrada] = useState('');
  const [quantidadeEntrada, setQuantidadeEntrada] = useState('');
  const [unidadeIdEntrada, setUnidadeIdEntrada] = useState('');
  const [precoUnitario, setPrecoUnitario] = useState('');
  const [dataValidade, setDataValidade] = useState('');
  const [enviandoEntrada, setEnviandoEntrada] = useState(false);
  const [mensagemEntrada, setMensagemEntrada] = useState<string | null>(null);
  const [erroEntrada, setErroEntrada] = useState<string | null>(null);

  async function handleSubmitEntrada(evento: React.FormEvent) {
    evento.preventDefault();
    setErroEntrada(null);
    setMensagemEntrada(null);
    setEnviandoEntrada(true);

    try {
      await registrarEntrada({
        insumo_id: Number(insumoIdEntrada),
        quantidade: Number(quantidadeEntrada),
        unidade_id: Number(unidadeIdEntrada),
        preco_unitario: Number(precoUnitario),
        data_validade: dataValidade || undefined,
      });

      setMensagemEntrada('Entrada registrada com sucesso!');
      setInsumoIdEntrada('');
      setQuantidadeEntrada('');
      setUnidadeIdEntrada('');
      setPrecoUnitario('');
      setDataValidade('');
    } catch (erro) {
      if (erro instanceof Error) {
        setErroEntrada(erro.message);
      } else {
        setErroEntrada('Erro ao registrar entrada');
      }
    } finally {
      setEnviandoEntrada(false);
    }
  }
// Estados do formulário de Saída (Perda)
  const [insumoIdSaida, setInsumoIdSaida] = useState('');
  const [quantidadeSaida, setQuantidadeSaida] = useState('');
  const [unidadeIdSaida, setUnidadeIdSaida] = useState('');
  const [motivoPerda, setMotivoPerda] = useState('');
  const [enviandoSaida, setEnviandoSaida] = useState(false);
  const [mensagemSaida, setMensagemSaida] = useState<string | null>(null);
  const [erroSaida, setErroSaida] = useState<string | null>(null);

  async function handleSubmitSaida(evento: React.FormEvent) {
    evento.preventDefault();
    setErroSaida(null);
    setMensagemSaida(null);
    setEnviandoSaida(true);

    try {
      await registrarSaida({
        insumo_id: Number(insumoIdSaida),
        quantidade: Number(quantidadeSaida),
        unidade_id: Number(unidadeIdSaida),
        motivo_perda: motivoPerda,
      });

      setMensagemSaida('Perda registrada com sucesso!');
      setInsumoIdSaida('');
      setQuantidadeSaida('');
      setUnidadeIdSaida('');
      setMotivoPerda('');
    } catch (erro) {
      if (erro instanceof Error) {
        setErroSaida(erro.message);
      } else {
        setErroSaida('Erro ao registrar perda');
      }
    } finally {
      setEnviandoSaida(false);
    }
  }

  // Estados da Consulta de Saldo
  const [insumoIdConsulta, setInsumoIdConsulta] = useState('');
  const [saldo, setSaldo] = useState<SaldoEstoque | null>(null);
  const [consultando, setConsultando] = useState(false);
  const [erroConsulta, setErroConsulta] = useState<string | null>(null);

  async function handleConsultarSaldo(evento: React.FormEvent) {
    evento.preventDefault();
    setErroConsulta(null);
    setSaldo(null);
    setConsultando(true);

    try {
      const dados = await buscarSaldo(Number(insumoIdConsulta));
      setSaldo(dados);
    } catch (erro) {
      if (erro instanceof Error) {
        setErroConsulta(erro.message);
      } else {
        setErroConsulta('Erro ao consultar saldo');
      }
    } finally {
      setConsultando(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Controle de Estoque</h1>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setAbaAtiva('entrada')}
          className={`px-4 py-2 rounded ${abaAtiva === 'entrada' ? 'bg-slate-800 text-white' : 'bg-gray-200'}`}
        >
          Registrar Compra
        </button>
        <button
          onClick={() => setAbaAtiva('saida')}
          className={`px-4 py-2 rounded ${abaAtiva === 'saida' ? 'bg-slate-800 text-white' : 'bg-gray-200'}`}
        >
          Registrar Perda
        </button>
        <button
          onClick={() => setAbaAtiva('saldo')}
          className={`px-4 py-2 rounded ${abaAtiva === 'saldo' ? 'bg-slate-800 text-white' : 'bg-gray-200'}`}
        >
          Consultar Saldo
        </button>
      </div>

      {abaAtiva === 'entrada' && (
        <form onSubmit={handleSubmitEntrada} className="bg-white shadow rounded p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">ID do Insumo</label>
            <input
              type="number"
              value={insumoIdEntrada}
              onChange={(e) => setInsumoIdEntrada(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Quantidade</label>
            <input
              type="number"
              step="0.001"
              value={quantidadeEntrada}
              onChange={(e) => setQuantidadeEntrada(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">ID da Unidade de Medida</label>
            <input
              type="number"
              value={unidadeIdEntrada}
              onChange={(e) => setUnidadeIdEntrada(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Preço Unitário (R$)</label>
            <input
              type="number"
              step="0.01"
              value={precoUnitario}
              onChange={(e) => setPrecoUnitario(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Data de Validade (opcional)</label>
            <input
              type="date"
              value={dataValidade}
              onChange={(e) => setDataValidade(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {erroEntrada && <p className="text-red-500 text-sm">{erroEntrada}</p>}
          {mensagemEntrada && <p className="text-green-600 text-sm">{mensagemEntrada}</p>}

          <button
            type="submit"
            disabled={enviandoEntrada}
            className="w-full bg-slate-800 text-white py-2 rounded hover:bg-slate-700 disabled:opacity-50"
          >
            {enviandoEntrada ? 'Salvando...' : 'Registrar Compra'}
          </button>
        </form>
      )}

      {abaAtiva === 'saida' && (
        <form onSubmit={handleSubmitSaida} className="bg-white shadow rounded p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">ID do Insumo</label>
            <input
              type="number"
              value={insumoIdSaida}
              onChange={(e) => setInsumoIdSaida(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Quantidade</label>
            <input
              type="number"
              step="0.001"
              value={quantidadeSaida}
              onChange={(e) => setQuantidadeSaida(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">ID da Unidade de Medida</label>
            <input
              type="number"
              value={unidadeIdSaida}
              onChange={(e) => setUnidadeIdSaida(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Motivo da Perda</label>
            <input
              type="text"
              value={motivoPerda}
              onChange={(e) => setMotivoPerda(e.target.value)}
              placeholder="Ex: Vencimento, erro de preparo..."
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {erroSaida && <p className="text-red-500 text-sm">{erroSaida}</p>}
          {mensagemSaida && <p className="text-green-600 text-sm">{mensagemSaida}</p>}

          <button
            type="submit"
            disabled={enviandoSaida}
            className="w-full bg-red-700 text-white py-2 rounded hover:bg-red-800 disabled:opacity-50"
          >
            {enviandoSaida ? 'Salvando...' : 'Registrar Perda'}
          </button>
        </form>
      )}

      {abaAtiva === 'saldo' && (
        <div className="bg-white shadow rounded p-6 space-y-4">
          <form onSubmit={handleConsultarSaldo} className="flex gap-2">
            <input
              type="number"
              value={insumoIdConsulta}
              onChange={(e) => setInsumoIdConsulta(e.target.value)}
              placeholder="ID do Insumo"
              required
              className="flex-1 border rounded px-3 py-2"
            />
            <button
              type="submit"
              disabled={consultando}
              className="bg-slate-800 text-white px-4 py-2 rounded hover:bg-slate-700 disabled:opacity-50"
            >
              {consultando ? 'Buscando...' : 'Consultar'}
            </button>
          </form>

          {erroConsulta && <p className="text-red-500 text-sm">{erroConsulta}</p>}

          {saldo && (
            <div className="border-t pt-4">
              <p className="text-lg">
                <strong>{saldo.nome_insumo}</strong>
              </p>
              <p className="text-2xl font-bold text-slate-800 mt-2">
                {saldo.saldo_atual} unidades em estoque
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Estoque;