//A página inicial está com código repetido que poderia virar componente.

'use client';
import Image from "next/image";
import { use, useEffect, useState } from "react";

export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mes, setMes] = useState<{ id: number; valor: number; data: string ; cliente: any}[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [dia, setDia] = useState<{ id: number; valor: number; data: string ; cliente: any}[]>([]);

  const getMes = async () => {
    try {
      const response = await fetch("http://localhost:8080/relatorio/totalMes");
      if (!response.ok) {
        throw new Error("Erro ao buscar faturamento do mês");
      }
      const data = await response.json();
      setMes(data);
    } catch (error) {
      console.error("Erro ao buscar faturamento do mês:", error);
    }

  }
  const getDia = async () => {
    try {
      const response = await fetch("http://localhost:8080/relatorio/totalHoje");
      if (!response.ok) {
        throw new Error("Erro ao buscar faturamento do dia");
      }
      const data = await response.json();
      setDia(data);
    } catch (error) {
      console.error("Erro ao buscar faturamento do dia:", error);
    }
  };
  useEffect(() => {
    getMes();
    getDia();
  }, []);

  const totalFaturado = mes.reduce((total, venda) => total + venda.valor, 0);
  const totalVendas = mes.length;
  const totalFaturadoDia = dia.reduce((total, venda) => total + venda.valor, 0);
  const totalVendasDia = dia.length;

  return (
    <div className="flex flex-col items-center relative min-h-screen">
      <h1 className="text-4xl font-bold mb-16">Bem-vindo ao DgGas</h1>
      
    <div className="flex justify-around items-center mb-8 w-full px-8">
      <div className="bg-gray-200 shadow-lg rounded-lg p-6 w-64">
        <h2 className="text-2xl font-semibold mb-4">Faturamento do Mês</h2>
        <p className="text-lg">R$ {totalFaturado.toFixed(2)}</p>
        {/* Conteúdo do card esquerdo */}
      </div>
      <div className="bg-gray-200 shadow-lg rounded-lg p-6 w-64">
        {/* Conteúdo do card direito */}
        <h2 className="text-2xl font-semibold mb-4">Quantidade do mês</h2>
        <p className="text-lg">{totalVendas.toFixed(2)}</p>
      </div>

    </div>
    <div className="flex justify-around items-center mb-8 w-full px-8">
      <div className="bg-gray-200 shadow-lg rounded-lg p-6 w-64">
        {/* Conteúdo do card esquerdo */}
        <h2 className="text-2xl font-semibold mb-4">Faturamento do dia</h2>
        <p className="text-lg">R$ {totalFaturadoDia.toFixed(2)}</p>
      </div>
      <div className="bg-gray-200 shadow-lg rounded-lg p-6 w-64">
        {/* Conteúdo do card direito */}
        <h2 className="text-2xl font-semibold mb-4">Quantidade do dia</h2>
        <p className="text-lg">{totalVendasDia.toFixed(2)}</p>
      </div>
    </div>
    </div>
  );
}
