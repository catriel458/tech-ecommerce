"use client";

import { useFavorites } from "@/contexts/FavoritesContext";
import { useCart } from "@/contexts/CartContext";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2, ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function FavoritosPage() {
  const { favorites, removeFavorite, clearFavorites } = useFavorites();
  const { addItem } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(price);
  };

  const handleAddToCart = (item: any) => {
    if (!session) {
      router.push("/login");
      return;
    }

    addItem({
      id: item.id,
      nombre: item.nombre,
      precio: item.precio,
      imagen: item.imagen,
    });
    toast.success(`${item.nombre} agregado al carrito`, { icon: "🛒" });
  };

  const handleRemoveFavorite = (id: string, nombre: string) => {
    removeFavorite(id);
    toast.success(`${nombre} eliminado de favoritos`, { icon: "💔" });
  };

  const handleClearFavorites = () => {
    if (confirm("¿Estás seguro de eliminar todos los favoritos?")) {
      clearFavorites();
      toast.success("Favoritos vaciados", { icon: "🗑️" });
    }
  };

  if (favorites.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <Heart className="mx-auto h-24 w-24 text-gray-400" />
          <h2 className="mt-4 text-3xl font-bold text-gray-900">
            No tienes favoritos
          </h2>
          <p className="mt-2 text-gray-600">
            Agrega productos a favoritos para verlos aquí
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
          >
            <ArrowLeft size={20} />
            <span>Volver a la tienda</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Mis Favoritos
        </h1>
        <p className="text-gray-600">
          {favorites.length} {favorites.length === 1 ? "producto" : "productos"}{" "}
          en tu lista de favoritos
        </p>
      </div>

      {/* Botón limpiar favoritos */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={handleClearFavorites}
          className="flex items-center space-x-2 text-red-600 hover:text-red-700 border border-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition"
        >
          <Trash2 size={18} />
          <span>Limpiar favoritos</span>
        </button>
      </div>

      {/* Grid de productos favoritos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favorites.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group relative"
          >
            {/* Botón eliminar favorito */}
            <button
              onClick={() => handleRemoveFavorite(item.id, item.nombre)}
              className="absolute top-3 left-3 z-10 p-2 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition"
            >
              <Heart size={20} fill="currentColor" />
            </button>

            {/* Imagen */}
            <Link href={`/producto/${item.id}`}>
              <div className="relative h-48 bg-gray-200 cursor-pointer">
                <Image
                  src={item.imagen || "/placeholder-product.png"}
                  alt={item.nombre}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Badge de categoría */}
                <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs">
                  {item.categoria.replace(/_/g, " ")}
                </div>
                {item.stock === 0 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white text-lg font-bold">
                      SIN STOCK
                    </span>
                  </div>
                )}
              </div>
            </Link>

            {/* Contenido */}
            <div className="p-4">
              <Link href={`/producto/${item.id}`}>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1 hover:text-blue-600 transition cursor-pointer">
                  {item.nombre}
                </h3>
              </Link>

              <div className="mb-4">
                <p className="text-2xl font-bold text-blue-600">
                  {formatPrice(item.precio)}
                </p>
                <p className="text-xs text-gray-500">
                  {item.stock > 0 ? `Stock: ${item.stock}` : "Sin stock"}
                </p>
              </div>

              {/* Botón agregar al carrito */}
              <button
                onClick={() => handleAddToCart(item)}
                disabled={item.stock === 0}
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={18} />
                <span>
                  {item.stock > 0 ? "Agregar al carrito" : "Sin stock"}
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}