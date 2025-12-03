"use client";

import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";

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
  const [agregado, setAgregado] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(price);
  };

  const handleAddToCart = () => {
    addItem({ id, nombre, precio, imagen });
    setAgregado(true);
    setTimeout(() => setAgregado(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      {/* Imagen */}
      <div className="relative h-64 bg-gray-200">
        <Image
          src={imagen || "/placeholder-product.png"}
          alt={nombre}
          fill
          className="object-cover"
        />
        {/* Badge de categoría */}
        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs">
          {categoria.replace(/_/g, " ")}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
          {nombre}
        </h3>
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
          className={`w-full flex items-center justify-center space-x-2 py-2 px-4 rounded transition ${
            agregado
              ? "bg-green-600 hover:bg-green-700"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white disabled:bg-gray-400 disabled:cursor-not-allowed`}
        >
          <ShoppingCart size={20} />
          <span>
            {stock === 0
              ? "Sin stock"
              : agregado
              ? "¡Agregado!"
              : "Agregar al carrito"}
          </span>
        </button>
      </div>
    </div>
  );
}