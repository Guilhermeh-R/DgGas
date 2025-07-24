'use client';

import { useState } from "react";

export default function RelatoriosPage() {
  const [mes, setMes] = useState("");
  const [ano, setAno] = useState("");
  const [mesesSemCompra, setMesesSemCompra] = useState("");

    const baixarRelatorioMensal = async () => {
        if (!mes || !ano) return alert("Preencha mês e ano");

        try {
            const response = await fetch("http://localhost:8080/relatorio/gerarRelatorioMensal", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/pdf",
            },
            body: JSON.stringify({ mes: parseInt(mes), ano: parseInt(ano) }),
            });

            if (!response.ok) {
            throw new Error("Erro ao gerar relatório");
            }

            const blob = await response.blob();

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `relatorio_mensal_${mes}_${ano}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Erro ao baixar o relatório:", error);
            alert("Erro ao gerar o relatório.");
        }
    };

  const baixarRelatorioInativos = async () => {
    if (!mesesSemCompra) return alert("Preencha a quantidade de meses");
    try {
        const response = await fetch("http://localhost:8080/relatorio/clientes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/pdf",
            },
            body: JSON.stringify(parseInt(mesesSemCompra)),
        });

        if (!response.ok) {
            throw new Error("Erro ao gerar relatório");
        }

        const blob = await response.blob();

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `relatorio_inativos_${mesesSemCompra}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();

        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Erro ao baixar o relatório:", error);
        alert("Não há cliente inativo há " + mesesSemCompra + " meses.");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-6 space-y-10">
      <h1 className="text-3xl font-bold">Relatórios</h1>

      {/* Relatório Mensal */}
      <div className="bg-gray-100 p-6 rounded shadow w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Relatório Mensal</h2>
        <div className="space-y-4">
          <input
            type="number"
            placeholder="Mês (1-12)"
            value={mes}
            onChange={(e) => setMes(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            min={1}
            max={12}
          />
          <input
            type="number"
            placeholder="Ano"
            value={ano}
            onChange={(e) => setAno(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            min={2000}
          />
          <button
            onClick={baixarRelatorioMensal}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Baixar Relatório Mensal
          </button>
        </div>
      </div>

      {/* Relatório de Clientes Inativos */}
      <div className="bg-gray-100 p-6 rounded shadow w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Clientes Inativos</h2>
        <div className="space-y-4">
          <input
            type="number"
            placeholder="Meses sem comprar"
            value={mesesSemCompra}
            onChange={(e) => setMesesSemCompra(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            min={1}
          />
          <button
            onClick={baixarRelatorioInativos}
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
          >
            Baixar Clientes Inativos
          </button>
        </div>
      </div>
    </div>
  );
}