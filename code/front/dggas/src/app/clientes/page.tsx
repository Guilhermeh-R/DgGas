'use client';
import { useState } from "react";

export default function Clientes() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nome: "", telefone: "", endereco: "" , dataUltimaCompra: "" , previsaoTerminoGas: "" });

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = (e: { preventDefault: () => void; }) => {
  e.preventDefault(); // importante evitar recarregamento da página
  console.log("Cliente adicionado:", form);

  fetch("http://localhost:8080/clientes/cadastrar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  })
    .then((response) => {
      if (response.ok) {
        console.log("Cliente adicionado com sucesso");
      } else {
        console.error("Erro ao adicionar cliente", form);
      }
    })
    .catch((error) => {
      console.error("Erro ao adicionar cliente:", error);
    });

  setForm({ nome: "", telefone: "", endereco: "", dataUltimaCompra: "", previsaoTerminoGas: "" });
  setShowModal(false);
};


  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <h1 className="text-center text-3xl font-bold mb-8">Clientes</h1>

      <button
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 self-start"
        onClick={() => setShowModal(true)}
      >
        Adicionar Cliente
      </button>

      <ul className="w-full px-4 space-y-4 mt-6">
        <li className="bg-gray-200 p-4 w-full rounded shadow flex justify-between items-start">
          <div>
            <p><strong>Nome:</strong> João</p>
            <p><strong>Endereço:</strong> Rua x, 123</p>
          </div>
          <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
            Editar
          </button>
        </li>
        <li className="bg-gray-200 p-4 w-full rounded shadow flex justify-between items-start">
          <div>
            <p><strong>Nome:</strong> Maria Silva</p>
            <p><strong>Endereço:</strong> Rua y, 56</p>
          </div>
          <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
            Editar
          </button>
        </li>
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
