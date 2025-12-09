"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Package, User, Calendar, DollarSign } from "lucide-react";

interface OrdenItem {
  id: string;
  cantidad: number;
  precioUnitario: number;
  producto: {
    nombre: string;
    categoria: string;
  };
}

interface Orden {
  id: string;
  total: number;
  estado: string;
  createdAt: string;
  user: {
    id: string;
    nombre: string;
    email: string;
  };
  items: OrdenItem[];
}

const ESTADOS = [
  "PENDIENTE",
  "PROCESANDO",
  "ENVIADO",
  "ENTREGADO",
  "CANCELADO",
];

const ESTADO_COLORS: { [key: string]: string } = {
  PENDIENTE: "bg-yellow-100 text-yellow-800",
  PROCESANDO: "bg-blue-100 text-blue-800",
  ENVIADO: "bg-purple-100 text-purple-800",
  ENTREGADO: "bg-green-100 text-green-800",
  CANCELADO: "bg-red-100 text-red-800",
};

export default function AdminOrdenesPage() {
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrden, setExpandedOrden] = useState<string | null>(null);

  useEffect(() => {
    fetchOrdenes();
  }, []);

  const fetchOrdenes = async () => {
    try {
      const response = await fetch("/api/admin/ordenes");
      const data = await response.json();
      setOrdenes(data);
    } catch (error) {
      console.error("Error al cargar órdenes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEstado = async (ordenId: string, nuevoEstado: string) => {
    try {
      const response = await fetch(`/api/admin/ordenes/${ordenId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (response.ok) {
        fetchOrdenes();
      }
    } catch (error) {
      console.error("Error al actualizar estado:", error);
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
      month: "short",
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Gestión de Órdenes
          </h1>
          <p className="text-gray-600">
            {ordenes.length} {ordenes.length === 1 ? "orden" : "órdenes"} totales
          </p>
        </div>
        <Link
          href="/admin"
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={20} />
          <span>Volver a Admin</span>
        </Link>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        {ESTADOS.map((estado) => {
          const count = ordenes.filter((o) => o.estado === estado).length;
          return (
            <div
              key={estado}
              className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-600"
            >
              <p className="text-sm text-gray-600 mb-1">
                {estado.replace(/_/g, " ")}
              </p>
              <p className="text-2xl font-bold text-gray-900">{count}</p>
            </div>
          );
        })}
      </div>

      {/* Tabla de órdenes */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orden ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ordenes.map((orden) => (
                <>
                  <tr key={orden.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Package className="text-gray-400 mr-2" size={16} />
                        <span className="text-sm font-mono font-semibold text-gray-900">
                          #{orden.id.slice(0, 8).toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="text-gray-400 mr-2" size={16} />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {orden.user.nombre}
                          </div>
                          <div className="text-xs text-gray-500">
                            {orden.user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="mr-2" size={16} />
                        {formatDate(orden.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm font-bold text-blue-600">
                        <DollarSign size={16} />
                        {formatPrice(orden.total)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {orden.items.reduce((sum, item) => sum + item.cantidad, 0)}{" "}
                      productos
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={orden.estado}
                        onChange={(e) =>
                          handleUpdateEstado(orden.id, e.target.value)
                        }
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          ESTADO_COLORS[orden.estado]
                        } border-0 cursor-pointer`}
                      >
                        {ESTADOS.map((estado) => (
                          <option key={estado} value={estado}>
                            {estado}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() =>
                          setExpandedOrden(
                            expandedOrden === orden.id ? null : orden.id
                          )
                        }
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {expandedOrden === orden.id ? "Ocultar" : "Ver detalles"}
                      </button>
                    </td>
                  </tr>
                  {/* Detalle expandido */}
                  {expandedOrden === orden.id && (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 bg-gray-50">
                        <div className="space-y-2">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            Items de la orden:
                          </h4>
                          {orden.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex justify-between items-center py-2 px-4 bg-white rounded"
                            >
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {item.producto.nombre}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {item.producto.categoria.replace(/_/g, " ")}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-600">
                                  {item.cantidad} x {formatPrice(item.precioUnitario)}
                                </p>
                                <p className="text-sm font-semibold text-gray-900">
                                  {formatPrice(
                                    item.cantidad * item.precioUnitario
                                  )}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}