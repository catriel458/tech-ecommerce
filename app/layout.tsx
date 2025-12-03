import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import { CartProvider } from "@/contexts/CartContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TechStore - Tu tienda de hardware",
  description: "E-commerce de componentes de PC",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Providers>
          <CartProvider>
            <Navbar />
            <main className="min-h-screen bg-gray-50">{children}</main>
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}