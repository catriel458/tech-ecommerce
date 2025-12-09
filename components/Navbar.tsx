"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, Settings, LogOut, Heart, Package } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";

export default function Navbar() {
  const { data: session } = useSession();
  const { itemCount } = useCart();
  const { favoriteCount } = useFavorites();

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-blue-400 hover:text-blue-300 transition">
            TechStore
          </Link>

          {/* Navigation */}
          <div className="flex items-center space-x-6">
            <Link
              href="/"
              className="flex items-center space-x-1 hover:text-blue-400 transition"
            >
              <span>Inicio</span>
            </Link>

            {session ? (
              <>
                {/* Nombre de usuario y badge de rol */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{session.user?.name}</span>
                  {session.user?.role === "ADMIN" && (
                    <span className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded">
                      ADMIN
                    </span>
                  )}
                </div>

                {/* Panel de admin (solo para ADMIN) */}
                {session.user?.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="flex items-center space-x-1 hover:text-blue-400 transition"
                  >
                    <Settings size={20} />
                    <span>Admin</span>
                  </Link>
                )}

                {/* Mis Compras */}
                <Link
                  href="/mis-compras"
                  className="flex items-center space-x-1 hover:text-blue-400 transition"
                >
                  <Package size={20} />
                  <span>Mis Compras</span>
                </Link>

                {/* Favoritos */}
                <Link
                  href="/favoritos"
                  className="relative flex items-center space-x-1 hover:text-blue-400 transition"
                >
                  <Heart size={20} />
                  {favoriteCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {favoriteCount}
                    </span>
                  )}
                </Link>

                {/* Carrito */}
                <Link
                  href="/carrito"
                  className="relative flex items-center space-x-1 hover:text-blue-400 transition"
                >
                  <ShoppingCart size={20} />
                  <span>Carrito</span>
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Link>

                {/* Logout */}
                <button
                  onClick={() => signOut()}
                  className="flex items-center space-x-1 hover:text-red-400 transition"
                >
                  <LogOut size={20} />
                  <span>Salir</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/register"
                  className="border border-blue-600 hover:bg-blue-600 px-4 py-2 rounded transition"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}