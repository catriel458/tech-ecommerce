"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  Users,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  ArrowLeft,
  ShoppingCart,
} from "lucide-react";
import StatCard from "@/components/admin/StatCard";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Stats {
  totalProductos: number;
  totalUsuarios: number;
  productosStockBajo: number;
  productosSinStock: number;
  valorInventario: number;
  productosPorCategoria: Array<{
    categoria: string;
    _count: { categoria: number };
  }>;
  productosTopPrecio: Array<{
    id: string;
    nombre: string;
    precio: number;
    stock: number;
    categoria: string;
  }>;
  stockPorCategoria: Array<{
    categoria: string;
    _sum: { stock: number | null };
  }>;
}

const COLORS = [
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#F59E0B",
  "#10B981",
  "#6366F1",
  "#14B8A6",
  "#F97316",
];

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error al cargar estadísticas</p>
      </div>
    );
  }

  // Preparar datos para gráficos
  const categoriaData = stats.productosPorCategoria.map((item) => ({
    name: item.categoria.replace(/_/g, " "),
    cantidad: item._count.categoria,
  }));

  const stockData = stats.stockPorCategoria.map((item) => ({
    name: item.categoria.replace(/_/g, " "),
    stock: item._sum.stock || 0,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Dashboard de Estadísticas
          </h1>
          <p className="text-gray-600">
            Resumen general de tu tienda
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Productos"
          value={stats.totalProductos}
          icon={Package}
          description="En catálogo"
          color="blue"
        />
        <StatCard
          title="Total Usuarios"
          value={stats.totalUsuarios}
          icon={Users}
          description="Registrados"
          color="green"
        />
        <StatCard
          title="Stock Bajo"
          value={stats.productosStockBajo}
          icon={AlertTriangle}
          description="Menos de 5 unidades"
          color="yellow"
        />
        <StatCard
          title="Sin Stock"
          value={stats.productosSinStock}
          icon={ShoppingCart}
          description="Productos agotados"
          color="red"
        />
      </div>

      {/* Valor del inventario */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium mb-2">
              Valor Total del Inventario
            </p>
            <p className="text-5xl font-bold">
              {formatPrice(stats.valorInventario)}
            </p>
            <p className="text-blue-100 text-sm mt-2">
              Calculado según precio × stock
            </p>
          </div>
          <div className="p-4 bg-white bg-opacity-20 rounded-full">
            <DollarSign size={48} />
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Productos por categoría */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Productos por Categoría
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoriaData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry: any) => {
                    const name = entry.name || '';
                    const percent = entry.percent || 0;
                    return `${name}: ${(percent * 100).toFixed(0)}%`;
                  }}
                outerRadius={80}
                fill="#8884d8"
                dataKey="cantidad"
              >
                {categoriaData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Stock por categoría */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Stock por Categoría
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stockData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={100}
                interval={0}
                tick={{ fontSize: 10 }}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="stock" fill="#3B82F6" name="Stock Total" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top productos más caros */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Top 5 Productos Más Caros
          </h2>
          <TrendingUp className="text-blue-600" size={24} />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.productosTopPrecio.map((producto, index) => (
                <tr key={producto.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                        {index + 1}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {producto.nombre}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {producto.categoria.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    {formatPrice(producto.precio)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {producto.stock} unidades
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                    {formatPrice(producto.precio * producto.stock)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}