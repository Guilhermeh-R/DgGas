'use client';
import { useEffect, useState } from "react";
import { getClientes } from "./service";

interface Cliente {
  id: number;
  nome: string;
  endereco: string;
  telefone: string;
  dataUltimaCompra: string;
  previsaoTerminoGas: string;
}

export default function Clientes() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nome: "", telefone: "", endereco: "", dataUltimaCompra: "", previsaoTerminoGas: "" });
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [buscarCliente, setBuscarCliente] = useState<Cliente[]>([]);
  const [nomeBusca, setNomeBusca] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState<"sucesso" | "erro" | "">("");
  const [clienteModal, setClienteModal] = useState<Cliente | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    getClientes()
      .then((data) => {
        setClientes(data);
        setBuscarCliente(data);
      })
      .catch((error) => console.error("Erro ao carregar clientes:", error));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/clientes/cadastrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setMensagem("Cliente cadastrado com sucesso!");
        setTipoMensagem("sucesso");
        const atualizados = await getClientes();
        setClientes(atualizados);
        setBuscarCliente(atualizados);
        setShowModal(false);
        setForm({ nome: "", telefone: "", endereco: "", dataUltimaCompra: "", previsaoTerminoGas: "" });
      } else {
        setMensagem("Erro ao cadastrar cliente.");
        setTipoMensagem("erro");
      }
    } catch (error) {
      setMensagem("Erro ao conectar com o servidor.");
      setTipoMensagem("erro");
    }

    setTimeout(() => {
      setMensagem("");
      setTipoMensagem("");
    }, 3000);
  };

  const filtrarClientes = (nome: string) => {
    setNomeBusca(nome);
    if (!nome) {
      setBuscarCliente(clientes);
      return;
    }
    const filtrados = clientes.filter((c) =>
      c.nome.toLowerCase().includes(nome.toLowerCase())
    );
    setBuscarCliente(filtrados);
  };
  const updateCliente = async (cliente: Cliente) => {
    try {
      const response = await fetch(`http://localhost:8080/clientes/atualizar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cliente),
      });

      if (response.ok) {
        setMensagem("Cliente atualizado com sucesso!");
        setTipoMensagem("sucesso");
        const atualizados = await getClientes();
        setClientes(atualizados);
        setBuscarCliente(atualizados);
        setClienteModal(null);
      } else {
        setMensagem("Erro ao atualizar cliente.");
        setTipoMensagem("erro");
      }
    } catch (error) {
      setMensagem("Erro ao conectar com o servidor.");
      setTipoMensagem("erro");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      {mensagem && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded shadow-lg text-white z-50 transition-all duration-300
          ${tipoMensagem === "sucesso" ? "bg-green-500" : "bg-red-500"}`}>
          {mensagem}
        </div>
      )}

      <h1 className="text-center text-3xl font-bold mb-8">Clientes</h1>
      <div className="flex justify-between items-center w-full max-w-4xl mb-6 gap-4">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={() => setShowModal(true)}
        >
          Adicionar Cliente
        </button>

        <input
          type="text"
          placeholder="Buscar cliente..."
          className="border border-gray-300 rounded px-3 py-2 w-full max-w-md"
          value={nomeBusca}
          onChange={(e) => filtrarClientes(e.target.value)}
        />
      </div>

      <ul className="w-full px-4 space-y-4 mt-6">
        {buscarCliente.map((cliente) => (
          <li
            key={cliente.id}
            className="bg-gray-200 p-4 w-full rounded shadow flex justify-between items-start"
          >
            <div>
              <p><strong>Nome:</strong> {cliente.nome}</p>
              <p><strong>Endereço:</strong> {cliente.endereco}</p>
            </div>
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              onClick={() => setClienteModal(cliente)}
            >
              +
            </button>
          </li>
        ))}
      </ul>
        {clienteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md shadow">
              <h2 className="text-xl font-semibold mb-4">Editar Cliente</h2>
              <form className="space-y-3">
                <input
                  type="text"
                  value={clienteModal.nome}
                  onChange={(e) => setClienteModal({ ...clienteModal, nome: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Nome"
                />
                <input
                  type="text"
                  value={clienteModal.telefone}
                  onChange={(e) => setClienteModal({ ...clienteModal, telefone: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Telefone"
                />
                <input
                  type="text"
                  value={clienteModal.endereco}
                  onChange={(e) => setClienteModal({ ...clienteModal, endereco: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Endereço"
                />

                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    onClick={() => setClienteModal(null)}
                  >
                    Fechar
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => updateCliente(clienteModal)}
                  >
                    Salvar
                  </button>

                  <a
                    href={`https://wa.me/55${clienteModal.telefone.replace(/\D/g, "")}?text=Olá%20${encodeURIComponent(clienteModal.nome)},%20tudo%20bem?`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Enviar WhatsApp
                  </a>
                </div>
              </form>
            </div>
          </div>
        )}
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Novo Cliente</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="nome"
                value={form.nome}
                onChange={handleInputChange}
                placeholder="Nome"
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
              <input
                type="text"
                name="telefone"
                value={form.telefone}
                onChange={handleInputChange}
                placeholder="Telefone"
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
              <input
                type="text"
                name="endereco"
                value={form.endereco}
                onChange={handleInputChange}
                placeholder="Endereço"
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
