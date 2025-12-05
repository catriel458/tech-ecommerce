"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShoppingCart, Package, Truck } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface ProductDetailProps {
  producto: {
    id: string;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    imagen: string | null;
    categoria: string;
  };
}

export default function ProductDetail({ producto }: ProductDetailProps) {
  const { addItem } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(price);
  };

  const handleAddToCart = () => {
    // Verificar si está logueado
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

    addItem({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
    });
    toast.success("Producto agregado al carrito", {
      icon: "🛒",
      duration: 3000,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <Link
        href="/"
        className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-8"
      >
        <ArrowLeft size={20} />
        <span>Volver a productos</span>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Imagen */}
        <div className="relative h-96 md:h-[600px] bg-gray-200 rounded-lg overflow-hidden">
          <Image
            src={producto.imagen || "/placeholder-product.png"}
            alt={producto.nombre}
            fill
            className="object-cover"
            priority
          />
          {producto.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white text-3xl font-bold">SIN STOCK</span>
            </div>
          )}
        </div>

        {/* Información */}
        <div className="space-y-6">
          {/* Categoría */}
          <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
            {producto.categoria.replace(/_/g, " ")}
          </div>

          {/* Nombre */}
          <h1 className="text-4xl font-bold text-gray-900">
            {producto.nombre}
          </h1>

          {/* Precio */}
          <div className="border-t border-b py-4">
            <p className="text-4xl font-bold text-blue-600">
              {formatPrice(producto.precio)}
            </p>
            <p className="text-gray-600 mt-2">
              {producto.stock > 0
                ? `${producto.stock} unidades disponibles`
                : "Sin stock"}
            </p>
          </div>

          {/* Descripción */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Descripción
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {producto.descripcion}
            </p>
          </div>

          {/* Características de envío */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center space-x-3">
              <Truck className="text-blue-600" size={24} />
              <span className="text-gray-700">Envío gratis a todo el país</span>
            </div>
            <div className="flex items-center space-x-3">
              <Package className="text-blue-600" size={24} />
              <span className="text-gray-700">Garantía oficial del fabricante</span>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="space-y-3">
            <button
              onClick={handleAddToCart}
              disabled={producto.stock === 0}
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-lg text-lg font-semibold transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={24} />
              <span>
                {producto.stock > 0 ? "Agregar al carrito" : "Sin stock"}
              </span>
            </button>

            <Link
              href="/carrito"
              className="block w-full text-center border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-4 px-6 rounded-lg text-lg font-semibold transition"
            >
              Ver carrito
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}