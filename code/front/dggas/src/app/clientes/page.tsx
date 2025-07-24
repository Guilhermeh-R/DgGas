'use client';
import { useEffect, useState } from "react";
import { getClientes } from "./service";

export default function Clientes() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nome: "", telefone: "", endereco: "" , dataUltimaCompra: "" , previsaoTerminoGas: "" });
  const [clientes, setClientes] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState<"sucesso" | "erro" | "">("");

    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Carregar clientes ao montar o componente
  useEffect(() => {
    getClientes()
      .then((data) => setClientes(data))
      .catch((error) => console.error("Erro ao carregar clientes:", error));
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/clientes/cadastrar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setMensagem("Cliente cadastrado com sucesso!");
        setTipoMensagem("sucesso");
        
        await getClientes();

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

    // Limpa mensagem após 3 segundos
    setTimeout(() => {
      setMensagem("");
      setTipoMensagem("");
    }, 3000);
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

      <button
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 self-start"
        onClick={() => setShowModal(true)}
      >
        Adicionar Cliente
      </button>

      <ul className="w-full px-4 space-y-4 mt-6">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {clientes.map((cliente: any) => (
          <li
            key={cliente.id}
            className="bg-gray-200 p-4 w-full rounded shadow flex justify-between items-start"
          >
            <div>
              <p><strong>Nome:</strong> {cliente.nome}</p>
              <p><strong>Endereço:</strong> {cliente.endereco}</p>
            </div>
            <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
              Editar
            </button>
          </li>
        ))}
      </ul>

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
