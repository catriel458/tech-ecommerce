"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
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
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { data: session } = useSession();
  const router = useRouter();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(price);
  };

  const handleAddToCart = () => {
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

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      toast.error("Debes iniciar sesión para agregar a favoritos", {
        icon: "🔒",
        duration: 4000,
      });
      setTimeout(() => {
        router.push("/login");
      }, 1500);
      return;
    }

    if (isFavorite(id)) {
      removeFavorite(id);
      toast.success("Eliminado de favoritos", { icon: "💔" });
    } else {
      addFavorite({ id, nombre, precio, imagen, stock, categoria });
      toast.success("Agregado a favoritos", { icon: "❤️" });
    }
  };

  const esFavorito = isFavorite(id);

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group relative">
      {/* Botón de favorito */}
      <button
        onClick={handleToggleFavorite}
        className={`absolute top-3 left-3 z-10 p-2 rounded-full transition-all duration-300 ${
          esFavorito
            ? "bg-pink-600 text-white"
            : "bg-white/80 text-gray-600 hover:bg-pink-600 hover:text-white"
        }`}
      >
        <Heart
          size={20}
          fill={esFavorito ? "currentColor" : "none"}
        />
      </button>

      {/* Imagen con link a detalle */}
      <Link href={`/producto/${id}`}>
        <div className="relative h-64 bg-gray-200 overflow-hidden cursor-pointer">
          <Image
            src={imagen || "/placeholder-product.png"}
            alt={nombre}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Badge de categoría */}
          <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs">
            {categoria.replace(/_/g, " ")}
          </div>
          {stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white text-xl font-bold">SIN STOCK</span>
            </div>
          )}
        </div>
      </Link>

      {/* Contenido */}
      <div className="p-4">
        <Link href={`/producto/${id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1 hover:text-blue-600 transition cursor-pointer">
            {nombre}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {descripcion}
        </p>

        {/* Precio y Stock */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-2xl font-bold text-blue-600">
              {formatPrice(precio)}
            </p>
            <p className="text-xs text-gray-500">
              {stock > 0 ? `Stock: ${stock}` : "Sin stock"}
            </p>
          </div>
        </div>

        {/* Botón de agregar al carrito */}
        <button
          onClick={handleAddToCart}
          disabled={stock === 0}
          className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <ShoppingCart size={20} />
          <span>{stock > 0 ? "Agregar al carrito" : "Sin stock"}</span>
        </button>
      </div>
    </div>
  );
}