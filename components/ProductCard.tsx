"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Eye, Zap } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface ProductCardProps {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string | null;
  stock: number;
  categoria: string;
}

export default function ProductCard({
  id,
  nombre,
  descripcion,
  precio,
  imagen,
  stock,
  categoria,
}: ProductCardProps) {
  const { addItem } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      toast.error("Debes iniciar sesión para agregar productos al carrito", {
        icon: "🔒",
        duration: 4000,
      });
      setTimeout(() => {
        router.push("/login");
      }, 1500);
      return;
    }

    addItem({ id, nombre, precio, imagen });
    toast.success(`${nombre} agregado al carrito`, {
      duration: 3000,
      icon: "🛒",
    });
  };

  return (
    <div className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200">
      {/* Imagen */}
      <Link href={`/producto/${id}`} className="block relative">
        <div className="relative h-64 bg-gray-100 overflow-hidden">
          {imagen ? (
            <Image
              src={imagen}
              alt={nombre}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Sin imagen
            </div>
          )}
          
          {/* Overlay en hover */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <div className="transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="bg-white rounded-full p-3">
                <Eye className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          {/* Badge de categoría */}
          <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
            {categoria.replace(/_/g, " ")}
          </div>

          {/* Badge de sin stock */}
          {stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <span className="bg-red-600 text-white px-6 py-2 rounded-full text-lg font-bold">
                AGOTADO
              </span>
            </div>
          )}

          {/* Badge de stock bajo */}
          {stock > 0 && stock <= 5 && (
            <div className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
              <Zap size={14} />
              <span>¡Últimas {stock}!</span>
            </div>
          )}
        </div>
      </Link>

      {/* Contenido */}
      <div className="p-5">
        <Link href={`/producto/${id}`}>
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition cursor-pointer">
            {nombre}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {descripcion}
        </p>

        {/* Precio */}
        <div className="mb-4">
          <p className="text-3xl font-bold text-blue-600">
            {formatPrice(precio)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {stock > 0 ? `${stock} disponibles` : "Sin stock"}
          </p>
        </div>

        {/* Botón de agregar al carrito */}
        <button
          onClick={handleAddToCart}
          disabled={stock === 0}
          className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <ShoppingCart size={20} />
          <span>{stock > 0 ? "Agregar al carrito" : "Sin stock"}</span>
        </button>
      </div>
    </div>
  );
}