"use client";

import { useCart } from "@/contexts/CartContext";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function CarritoPage() {
  const { items, removeItem, updateQuantity, clearCart, total, itemCount } =
    useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(price);
  };

  const handleCheckout = async () => {
    if (!session) {
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/ordenes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          total,
        }),
      });

      if (response.ok) {
        const orden = await response.json();
        clearCart();
        toast.success("¡Compra realizada exitosamente!", {
          icon: "🎉",
          duration: 4000,
        });
        router.push(`/mis-compras`);
      } else {
        const error = await response.json();
        toast.error(error.error || "Error al procesar la compra");
      }
    } catch (error) {
      console.error("Error al procesar compra:", error);
      toast.error("Error al procesar la compra");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = (id: string, nombre: string) => {
    removeItem(id);
    toast.success(`${nombre} eliminado del carrito`, {
      icon: "❌",
    });
  };

  const handleClearCart = () => {
    clearCart();
    toast.success("Carrito vaciado", {
      icon: "🗑️",
    });
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <ShoppingBag className="mx-auto h-24 w-24 text-gray-400" />
          <h2 className="mt-4 text-3xl font-bold text-gray-900">
            Tu carrito está vacío
          </h2>
          <p className="mt-2 text-gray-600">
            Agrega algunos productos para comenzar tu compra
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
          Carrito de Compras
        </h1>
        <p className="text-gray-600">
          {itemCount} {itemCount === 1 ? "producto" : "productos"} en tu carrito
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de productos */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4"
            >
              {/* Imagen */}
              <div className="relative h-24 w-24 flex-shrink-0 bg-gray-200 rounded overflow-hidden">
                <img
                  src={item.imagen || "/placeholder-product.png"}
                  alt={item.nombre}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info del producto */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {item.nombre}
                </h3>
                <p className="text-xl font-bold text-blue-600 mt-1">
                  {formatPrice(item.precio)}
                </p>
              </div>

              {/* Controles de cantidad */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                  className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition"
                >
                  <Minus size={16} />
                </button>
                <span className="text-lg font-semibold w-8 text-center">
                  {item.cantidad}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                  className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Subtotal */}
              <div className="text-right">
                <p className="text-sm text-gray-500">Subtotal</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatPrice(item.precio * item.cantidad)}
                </p>
              </div>

              {/* Botón eliminar */}
              <button
                onClick={() => handleRemoveItem(item.id, item.nombre)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-full transition"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}

          {/* Botón limpiar carrito */}
          <button
            onClick={handleClearCart}
            className="w-full py-2 text-red-600 hover:bg-red-50 rounded-lg transition border border-red-600"
          >
            Vaciar carrito
          </button>
        </div>

        {/* Resumen del pedido */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Resumen del Pedido
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({itemCount} productos)</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Envío</span>
                <span className="text-green-600">Gratis</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-xl font-bold text-gray-900">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            {!session && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Necesitas iniciar sesión para completar la compra
                </p>
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={loading || !session}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition mb-3 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Procesando...
                </span>
              ) : session ? (
                "Finalizar Compra"
              ) : (
                "Iniciar sesión para comprar"
              )}
            </button>

            <Link
              href="/"
              className="block w-full text-center py-3 px-6 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Continuar comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}