'use client';
import { useState } from "react";

interface Cliente {
    id: number;
    nome: string;
    endereco: string;
    telefone: string;
    dataUltimaCompra: Date;
    previsaoTerminoGas: Date;
  };


export default function VendasPage() {
  const [vendas, setVendas] = useState<Cliente[]>([]);
  const [preVendas, setPreVendas] = useState<Cliente[]>([]);
  const [posVendas, setPosVendas] = useState<Cliente[]>([]);
  const [pageSlider, setPageSlider] = useState<'pre' | 'pos'>('pre');

  const vendasPre = async () => {
    setPageSlider('pre');
    try {
      const response = await fetch('http://localhost:8080/clientes/buscarPrevisao');
      const data = await response.json();
      setPreVendas(data);
    } catch (error) {
      console.error('Erro ao buscar vendas pré:', error);
    }
  };

  const vendasPos = async () => {
    setPageSlider('pos');
    try {
      const response = await fetch('http://localhost:8080/vendas/pos');
      const data = await response.json();
      setPosVendas(data);
    } catch (error) {
      console.error('Erro ao buscar vendas pós:', error);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <h1 className="text-center text-3xl font-bold mb-8">Vendas</h1>

      <div className="flex items-center justify-center mb-8 space-x-8">
        <span
          onClick={() => vendasPre()}
          className={`cursor-pointer text-lg font-semibold ${pageSlider === 'pre' ? 'text-green-600' : 'text-gray-400'}`}
        >
          Pré-Vendas
        </span>
        <span
          onClick={() => vendasPos()}
          className={`cursor-pointer text-lg font-semibold ${pageSlider === 'pos' ? 'text-green-600' : 'text-gray-400'}`}
        >
          Pós-Vendas
        </span>
      </div>

      {/* Conteúdo dinâmico com base na página selecionada */}
      {pageSlider === 'pre' ? (
        <div className="w-full max-w-3xl bg-gray-100 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Pré-Vendas</h2>
          {preVendas.length > 0 ? (
            <ul>
              {preVendas.map((cliente) => (
                <li key={cliente.id} className="mb-4">
                  <div className="flex flex-col items-center justify-between">
                    <p>Data: {new Date(cliente.dataUltimaCompra).toLocaleDateString()}</p>
                    <p>Cliente: {cliente.nome}</p>
                  </div>
                  <a
                    href={`https://wa.me/55${cliente.telefone.replace(/\D/g, "")}?text=Olá%20${encodeURIComponent(cliente.nome)},%20tudo%20bem?`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Enviar WhatsApp
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>Nenhuma pré-venda encontrada.</p>
          )}
        </div>
      ) : (
        <div className="w-full max-w-3xl bg-gray-100 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Pós-Vendas</h2>
          {posVendas.length > 0 ? (
            <ul>
              {posVendas.map((cliente) => (
                <li key={cliente.id} className="flex justify-between items-center mb-4">
                 <div className="flex flex-col items-center justify-between">
                   <p>Data: {new Date(cliente.dataUltimaCompra).toLocaleDateString()}</p>
                   <p>Cliente: {cliente.nome}</p>
                 </div>
                  <a
                    href={`https://wa.me/55${cliente.telefone.replace(/\D/g, "")}?text=Olá%20${encodeURIComponent(cliente.nome)},%20esperamos%20que%20esteja%20tudo%20bem%20com%20o%20gás.%20Estamos%20à%20disposição!`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Enviar WhatsApp
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>Nenhuma pós-venda encontrada.</p>
          )}
        </div>
      )}
    </div>
  );
}
