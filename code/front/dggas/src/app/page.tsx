import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center relative min-h-screen">
      <h1 className="text-4xl font-bold mb-16">Bem-vindo ao DgGas</h1>
      
    <div className="flex justify-around items-center mb-8 w-full px-8">
      <div className="bg-gray-200 shadow-lg rounded-lg p-6 w-64">
        <h2 className="text-2xl font-semibold mb-4">Faturamento do Mês</h2>
        <p className="text-lg">R$ 0,00</p>
        {/* Conteúdo do card esquerdo */}
      </div>
      <div className="bg-gray-200 shadow-lg rounded-lg p-6 w-64">
        {/* Conteúdo do card direito */}
        <h2 className="text-2xl font-semibold mb-4">Quantidade do mês</h2>
        <p className="text-lg">R$ 0,00</p>
      </div>

    </div>
    <div className="flex justify-around items-center mb-8 w-full px-8">
      <div className="bg-gray-200 shadow-lg rounded-lg p-6 w-64">
        {/* Conteúdo do card esquerdo */}
        <h2 className="text-2xl font-semibold mb-4">Faturamento do dia</h2>
        <p className="text-lg">R$ 0,00</p>
      </div>
      <div className="bg-gray-200 shadow-lg rounded-lg p-6 w-64">
        {/* Conteúdo do card direito */}
        <h2 className="text-2xl font-semibold mb-4">Quantidade do dia</h2>
        <p className="text-lg">R$ 0,00</p>
      </div>
    </div>
    </div>
  );
}
