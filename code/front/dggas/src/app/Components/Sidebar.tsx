"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
  { href: "/", label: "Início" },
  { href: "/clientes", label: "Clientes" },
  { href: "/pedidos", label: "Pedidos" },
  { href: "/relatorios", label: "Relatórios" },
  { href: "/vendas", label: "Vendas" },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <div className="Barra_lateral">
      <nav>
        <ul className=" w-full">
          {menu.map(item => (
            <li
                key={item.href}
                className={
                    pathname === item.href
                    ? "bg-[#14532d] text-white font-bold w-full"
                    : "w-full"
                }
                >
                <Link href={item.href} className="hover:underline block w-full h-full px-4 py-3">

                    {item.label}
                </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}