//A importação de estilos globais está misturada com lógica de layout.

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "./Components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DgGas",
  description: "Sistema de gestão de gás",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}>
        <main className="flex min-h-screen">
          <Sidebar />
          <section className="flex-1 ml-[250px] p-8">{children}</section>
        </main>
      </body>
    </html>
  );
}
