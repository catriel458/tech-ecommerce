import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import { CartProvider } from "@/contexts/CartContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SearchProvider } from "@/contexts/SearchContext";
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Providers>
          <ThemeProvider>
            <SearchProvider>
              <FavoritesProvider>
                <CartProvider>
                  <Navbar />
                  <main className="min-h-screen">{children}</main>
                  <Toaster position="bottom-right" />
                </CartProvider>
              </FavoritesProvider>
            </SearchProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}