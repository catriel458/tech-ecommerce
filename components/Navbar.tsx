"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { ShoppingCart, User, LogOut, Home, Settings } from "lucide-react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-500">TechStore</span>
          </Link>

          {/* Links de navegación */}
          <div className="flex items-center space-x-6">
            <Link
              href="/"
              className="flex items-center space-x-1 hover:text-blue-400 transition"
            >
              <Home size={20} />
              <span>Inicio</span>
            </Link>

            {status === "loading" ? (
              <div className="text-gray-400">Cargando...</div>
            ) : session ? (
              <>
                {/* Usuario logueado */}
                <div className="flex items-center space-x-1 text-gray-300">
                  <User size={20} />
                  <span>{session.user.name}</span>
                  {session.user.role === "ADMIN" && (
                    <span className="ml-2 px-2 py-1 bg-red-600 text-xs rounded">
                      ADMIN
                    </span>
                  )}
                </div>

                {/* Link a Admin (solo si es ADMIN) */}
                {session.user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="flex items-center space-x-1 hover:text-blue-400 transition"
                  >
                    <Settings size={20} />
                    <span>Admin</span>
                  </Link>
                )}

                {/* Carrito */}
                <Link
                  href="/carrito"
                  className="flex items-center space-x-1 hover:text-blue-400 transition"
                >
                  <ShoppingCart size={20} />
                  <span>Carrito</span>
                </Link>

                {/* Logout */}
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="flex items-center space-x-1 hover:text-red-400 transition"
                >
                  <LogOut size={20} />
                  <span>Salir</span>
                </button>
              </>
            ) : (
              <>
                {/* Usuario no logueado */}
                <Link
                  href="/login"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 border border-blue-600 hover:bg-blue-600 rounded transition"
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