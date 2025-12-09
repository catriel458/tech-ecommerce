"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Package, Calendar, DollarSign, ShoppingBag } from "lucide-react";

interface OrdenItem {
  id: string;
  cantidad: number;
  precioUnitario: number;
  producto: {
    id: string;
    nombre: string;
    imagen: string | null;
    categoria: string;
  };
}

interface Orden {
  id: string;
  total: number;
  estado: string;
  createdAt: string;
  items: OrdenItem[];
}

const ESTADOS = {
  PENDIENTE: { label: "Pendiente", color: "bg-yellow-100 text-yellow-800" },
  PROCESANDO: { label: "Procesando", color: "bg-blue-100 text-blue-800" },
  ENVIADO: { label: "Enviado", color: "bg-purple-100 text-purple-800" },
  ENTREGADO: { label: "Entregado", color: "bg-green-100 text-green-800" },
  CANCELADO: { label: "Cancelado", color: "bg-red-100 text-red-800" },
};

export default function MisComprasPage() {
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      fetchOrdenes();
    }
  }, [status, router]);

  const fetchOrdenes = async () => {
    try {
      const response = await fetch("/api/ordenes");
      const data = await response.json();
      setOrdenes(data);
    } catch (error) {
      console.error("Error al cargar órdenes:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (ordenes.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <ShoppingBag className="mx-auto h-24 w-24 text-gray-400" />
          <h2 className="mt-4 text-3xl font-bold text-gray-900">
            No tienes compras aún
          </h2>
          <p className="mt-2 text-gray-600">
            Realiza tu primera compra para ver tu historial aquí
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
          >
            <span>Ir a la tienda</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Mis Compras</h1>
        <p className="text-gray-600">
          Historial de {ordenes.length}{" "}
          {ordenes.length === 1 ? "compra" : "compras"}
        </p>
      </div>

      {/* Lista de órdenes */}
      <div className="space-y-6">
        {ordenes.map((orden) => (
          <div
            key={orden.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            {/* Header de la orden */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-6">
                  <div>
                    <p className="text-sm text-gray-600">Orden</p>
                    <p className="font-mono text-sm font-semibold text-gray-900">
                      #{orden.id.slice(0, 8).toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fecha</p>
                    <div className="flex items-center space-x-1">
                      <Calendar size={16} className="text-gray-400" />
                      <p className="text-sm font-semibold text-gray-900">
                        {formatDate(orden.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total</p>
                    <div className="flex items-center space-x-1">
                      <DollarSign size={16} className="text-gray-400" />
                      <p className="text-lg font-bold text-blue-600">
                        {formatPrice(orden.total)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Estado */}
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    ESTADOS[orden.estado as keyof typeof ESTADOS].color
                  }`}
                >
                  {ESTADOS[orden.estado as keyof typeof ESTADOS].label}
                </span>
              </div>
            </div>

            {/* Items de la orden */}
            <div className="p-6">
              <div className="space-y-4">
                {orden.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-4 pb-4 border-b border-gray-100 last:border-0"
                  >
                    {/* Imagen */}
                    <div className="relative h-16 w-16 flex-shrink-0 bg-gray-200 rounded">
                      <Image
                        src={item.producto.imagen || "/placeholder-product.png"}
                        alt={item.producto.nombre}
                        fill
                        className="object-cover rounded"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/producto/${item.producto.id}`}
                        className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition"
                      >
                        {item.producto.nombre}
                      </Link>
                      <p className="text-xs text-gray-500 mt-1">
                        {item.producto.categoria.replace(/_/g, " ")}
                      </p>
                    </div>

                    {/* Cantidad y precio */}
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        Cantidad: {item.cantidad}
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatPrice(item.precioUnitario)} c/u
                      </p>
                      <p className="text-sm font-bold text-blue-600">
                        {formatPrice(item.precioUnitario * item.cantidad)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total de items */}
              <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Package size={18} />
                  <span className="text-sm">
                    {orden.items.reduce((sum, item) => sum + item.cantidad, 0)}{" "}
                    productos en total
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total de la orden</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatPrice(orden.total)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}