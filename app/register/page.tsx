"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { Search } from "lucide-react";

interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen: string | null;
  categoria: string;
}

const CATEGORIAS = [
  "TODAS",
  "PROCESADORES",
  "PLACAS_MADRE",
  "MEMORIA_RAM",
  "TARJETAS_GRAFICAS",
  "ALMACENAMIENTO",
  "FUENTES",
  "GABINETES",
  "REFRIGERACION",
  "MONITORES",
  "TECLADOS",
  "MOUSE",
  "AURICULARES",
];

export default function HomePage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("TODAS");
  const [busqueda, setBusqueda] = useState("");
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");

  const fetchProductos = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (categoriaSeleccionada !== "TODAS")
        params.append("categoria", categoriaSeleccionada);
      if (busqueda) params.append("busqueda", busqueda);
      if (precioMin) params.append("precioMin", precioMin);
      if (precioMax) params.append("precioMax", precioMax);

      const response = await fetch(`/api/productos?${params.toString()}`);
      const data = await response.json();
      setProductos(data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, [categoriaSeleccionada, busqueda, precioMin, precioMax]);

  const handleAddToCart = (productoId: string) => {
    // TODO: Implementar lógica del carrito
    console.log("Agregar al carrito:", productoId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Productos de Hardware
        </h1>
        <p className="text-gray-600">
          Encuentra los mejores componentes para tu PC
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        {/* Búsqueda */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buscar productos
          </label>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Buscar por nombre o descripción..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Categorías */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoría
          </label>
          <select
            value={categoriaSeleccionada}
            onChange={(e) => setCategoriaSeleccionada(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {CATEGORIAS.map((cat) => (
              <option key={cat} value={cat}>
                {cat.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>

        {/* Filtros de precio */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Precio mínimo
            </label>
            <input
              type="number"
              placeholder="$0"
              value={precioMin}
              onChange={(e) => setPrecioMin(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Precio máximo
            </label>
            <input
              type="number"
              placeholder="$999999"
              value={precioMax}
              onChange={(e) => setPrecioMax(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Grid de productos */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando productos...</p>
        </div>
      ) : productos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">
            No se encontraron productos con los filtros seleccionados
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4 text-gray-600">
            {productos.length} producto{productos.length !== 1 ? "s" : ""}{" "}
            encontrado{productos.length !== 1 ? "s" : ""}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productos.map((producto) => (
              <ProductCard
                key={producto.id}
                {...producto}
                onAddToCart={() => handleAddToCart(producto.id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}