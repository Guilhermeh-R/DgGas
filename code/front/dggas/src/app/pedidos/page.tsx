'use client';
import React, { useEffect, useRef, useState } from "react";
import Clientes from "../clientes/page";
import { useRouter } from 'next/navigation';



interface Cliente {
    id: number;
    nome: string;
    endereco: string;
    telefone: string;
    dataUltimaCompra: Date;
    previsaoTerminoGas: Date;
  };



export default function Pedidos() {
  const router = useRouter();
  const [form, setForm] = useState<{ cliente: Cliente | null; valor: number }>({
    cliente: null,
    valor: 0,
  });
  const [showModal, setShowModal] = useState(false);
  const [sugestoesNome, setSugestoesNome] = useState<Cliente[]>([]);
  const [sugestoesEndereco, setSugestoesEndereco] = useState<Cliente[]>([]);
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState<"sucesso" | "erro" | "">("");
  const [vendas, setVendas] = useState([]);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      fetchVendas()
        .catch((error) => console.error("Erro ao carregar vendas:", error));
    }, []);
  // Fecha modal se clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowModal(false);
      }
    };
    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]);

  const buscarClientePorNome = async (text: string) => {
    if (!text.trim()) {
      setSugestoesNome([]);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/clientes/ListarTodos`);
      if (!response.ok) throw new Error("Erro ao buscar a lista de clientes");
      const clientes: Cliente[] = await response.json();

      setSugestoesNome(
        clientes.filter((c) =>
          c.nome.toLowerCase().includes(text.toLowerCase())
        )
      );
    } catch (error) {
      console.error("Erro ao buscar clientes por nome:", error);
    }
  };
  

  const buscarClientePorEndereco = async (text: string) => {
    if (!text.trim()) {
      setSugestoesEndereco([]);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/clientes/ListarTodos`);
      if (!response.ok) throw new Error("Erro ao buscar a lista de clientes");
      const clientes: Cliente[] = await response.json();

      setSugestoesEndereco(
        clientes.filter((c) =>
          c.endereco.toLowerCase().includes(text.toLowerCase())
        )
      );
    } catch (error) {
      console.error("Erro ao buscar clientes por endereço:", error);
    }
  };


  const selecionarNome = (cliente: Cliente) => {
    setForm((prev) => ({ ...prev, cliente }));
    setSugestoesNome([]);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.cliente || !form.cliente.id) {
      alert("Cliente não encontrado. Você será redirecionado para cadastro.");
      router.push('/clientes');
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/vendas/cadastrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          valor: form.valor,
          cliente: { id: form.cliente.id }
        }),
      });

      if (!response.ok) throw new Error("Erro ao cadastrar venda");

      setMensagem("Venda cadastrada com sucesso!");
      setTipoMensagem("sucesso");

    } catch (error) {
      console.error("Erro ao cadastrar venda:", error);
      setMensagem("Erro ao cadastrar venda.");
      setTipoMensagem("erro");
    }

    setForm({ cliente: null, valor: 0 });
    setSugestoesNome([]);
    setShowModal(false);
    setTimeout(() => {
      setMensagem("");
      setTipoMensagem("");
    }, 3000);
  };
  
  function selecionarCliente(cliente: Cliente) {
    setForm((prev) => ({
      ...prev,
      cliente,
    }));
    setSugestoesNome([]);
    setSugestoesEndereco([]);
  }
  const fetchVendas = async () => {
    try {
      const response = await fetch("http://localhost:8080/vendas/ListarTodos");
      if (!response.ok) throw new Error("Erro ao buscar vendas");
      const vendasData = await response.json();
      setVendas(vendasData);
    } catch (error) {
      console.error("Erro ao buscar vendas:", error);
    }
  }

  return (
  <div className="flex flex-col items-center min-h-screen p-4">
    {mensagem && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded shadow-lg text-white z-50 transition-all duration-300
          ${tipoMensagem === "sucesso" ? "bg-green-500" : "bg-red-500"}`}>
          {mensagem}
        </div>
      )}
    <h1 className="text-center text-3xl font-bold mb-8">Pedidos</h1>
    <button
      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 self-start"
      onClick={() => setShowModal(true)}
    >
      Adicionar Pedido
    </button>

    <ul className="w-full px-4 space-y-4 mt-6">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {vendas.map((venda: any) => (
          <li
            key={venda.id}
            className="bg-gray-200 p-4 w-full rounded shadow flex justify-between items-center "
          >
            <div>
              <p><strong>Nome:</strong> {venda.cliente.nome}</p>
              <p><strong>Endereço:</strong> {venda.cliente.endereco}</p>
              <p><strong>Valor:</strong> R$ {venda.valor.toFixed(2)}</p>
              <p><strong>Data da Venda:</strong> {new Date(venda.data).toLocaleDateString()}</p>
            </div>
            <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
              Editar
            </button>
          </li>
        ))}
      </ul>

    {showModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
          <h2 className="text-xl font-bold mb-4">Cadastro de Venda</h2>
          <form onSubmit={handleSubmit}>
            {/* Campo de nome do cliente */}
            <div className="mb-4 relative">
              <input
                type="text"
                placeholder="Digite o nome do cliente"
                className="w-full p-2 border rounded"
                value={form.cliente?.nome || ""}
                onChange={(e) => {
                  const nomeDigitado = e.target.value;
                  setForm((prev) => ({
                    ...prev,
                    cliente: { ...prev.cliente, nome: nomeDigitado } as Cliente,
                  }));
                  buscarClientePorNome(nomeDigitado);
                }}
              />
              {sugestoesNome.length > 0 && (
                <ul className="absolute bg-white border w-full max-h-40 overflow-y-auto z-10">
                  {sugestoesNome.map((s, i) => (
                    <li
                      key={i}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => selecionarCliente(s)}
                    >
                      {s.nome}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Campo de endereço */}
            <div className="mb-4 relative">
              <input
                type="text"
                placeholder="Digite o endereço do cliente"
                className="w-full p-2 border rounded"
                value={form.cliente?.endereco || ""}
                onChange={(e) => {
                  const enderecoDigitado = e.target.value;
                  setForm((prev) => ({
                    ...prev,
                    cliente: { ...prev.cliente, endereco: enderecoDigitado } as Cliente,
                  }));
                  buscarClientePorEndereco(enderecoDigitado);
                }}
              />
              {sugestoesEndereco.length > 0 && (
                <ul className="absolute bg-white border w-full max-h-40 overflow-y-auto z-10">
                  {sugestoesEndereco.map((s, i) => (
                    <li
                      key={i}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => selecionarCliente(s)}
                    >
                      {s.endereco}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Campo de valor */}
            <div className="mb-4">
              <label className="block text-gray-700">Valor (R$):</label>
              <input
                type="number"
                step="0.01"
                className="w-full p-2 border rounded"
                value={form.valor}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, valor: parseFloat(e.target.value) }))
                }
              />
            </div>

            {/* Botões */}
            <div className="flex justify-end">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 rounded mr-2"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                Cadastrar
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
  </div>
) 
};
