import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import { CartProvider } from "@/contexts/CartContext";
import { Toaster } from "react-hot-toast";

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
      <body className="font-sans antialiased">
        <Providers>
          <CartProvider>
            <Navbar />
            <main className="min-h-screen bg-gray-50">{children}</main>
            <Toaster position="bottom-right" />
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}