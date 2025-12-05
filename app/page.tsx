"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";

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

const ITEMS_PER_PAGE = 12;

export default function HomePage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("TODAS");
  const [busqueda, setBusqueda] = useState("");
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);

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
      setCurrentPage(1); // Reset a primera página cuando cambian filtros
    } catch (error) {
      console.error("Error al cargar productos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchProductos();
    }, 500); // Debounce de 500ms para el buscador

    return () => clearTimeout(debounce);
  }, [categoriaSeleccionada, busqueda, precioMin, precioMax]);

  // Calcular productos para la página actual
  const indexOfLastProduct = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstProduct = indexOfLastProduct - ITEMS_PER_PAGE;
  const currentProducts = productos.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(productos.length / ITEMS_PER_PAGE);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Hardware Premium
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Los mejores componentes para armar tu PC ideal
          </p>
        </div>

        {/* Barra de búsqueda principal */}
        <div className="mb-8 max-w-4xl mx-auto">
          <div className="relative group">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition"
              size={24}
            />
            <input
              type="text"
              placeholder="Busca procesadores, tarjetas gráficas, monitores..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500 focus:ring-opacity-20 focus:border-blue-500 transition shadow-sm hover:shadow-md"
            />
          </div>
        </div>

        {/* Botón de filtros móvil */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-center space-x-2 bg-white border-2 border-gray-200 py-3 px-6 rounded-xl shadow-sm hover:shadow-md transition"
          >
            <SlidersHorizontal size={20} />
            <span className="font-semibold">Filtros</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar de filtros */}
          <aside
            className={`lg:block ${
              showFilters ? "block" : "hidden"
            } space-y-6`}
          >
            {/* Card de filtros */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
              <div className="flex items-center space-x-2 mb-6">
                <SlidersHorizontal className="text-blue-600" size={24} />
                <h2 className="text-2xl font-bold text-gray-900">Filtros</h2>
              </div>

              {/* Categorías */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Categoría
                </label>
                <div className="space-y-2">
                  {CATEGORIAS.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoriaSeleccionada(cat)}
                      className={`w-full text-left px-4 py-2.5 rounded-lg transition ${
                        categoriaSeleccionada === cat
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {cat.replace(/_/g, " ")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rango de precios */}
              <div className="border-t pt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Rango de Precio
                </label>
                <div className="space-y-3">
                  <input
                    type="number"
                    placeholder="Precio mínimo"
                    value={precioMin}
                    onChange={(e) => setPrecioMin(e.target.value)}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                  <input
                    type="number"
                    placeholder="Precio máximo"
                    value={precioMax}
                    onChange={(e) => setPrecioMax(e.target.value)}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
              </div>

              {/* Botón limpiar filtros */}
              {(categoriaSeleccionada !== "TODAS" ||
                busqueda ||
                precioMin ||
                precioMax) && (
                <button
                  onClick={() => {
                    setCategoriaSeleccionada("TODAS");
                    setBusqueda("");
                    setPrecioMin("");
                    setPrecioMax("");
                  }}
                  className="w-full mt-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          </aside>

          {/* Grid de productos */}
          <div className="lg:col-span-3">
            {/* Header de resultados */}
            <div className="flex items-center justify-between mb-6 bg-white rounded-xl shadow-sm p-4">
              <div>
                <p className="text-gray-900 font-semibold">
                  {productos.length} producto{productos.length !== 1 ? "s" : ""}{" "}
                  encontrado{productos.length !== 1 ? "s" : ""}
                </p>
                {totalPages > 1 && (
                  <p className="text-sm text-gray-500">
                    Página {currentPage} de {totalPages}
                  </p>
                )}
              </div>
            </div>

            {/* Grid de productos */}
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
                <p className="mt-4 text-gray-600 font-semibold">
                  Cargando productos...
                </p>
              </div>
            ) : currentProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  No se encontraron productos
                </h3>
                <p className="text-gray-600">
                  Intenta ajustar los filtros o buscar algo diferente
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {currentProducts.map((producto) => (
                    <ProductCard key={producto.id} {...producto} />
                  ))}
                </div>

                {/* Paginación */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
                    <nav className="flex items-center space-x-2">
                      {/* Botón anterior */}
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg bg-white border-2 border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:border-blue-600 hover:text-blue-600 transition"
                      >
                        <ChevronLeft size={20} />
                      </button>

                      {/* Números de página */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (number) => {
                          // Mostrar primera página, última página, página actual y adyacentes
                          if (
                            number === 1 ||
                            number === totalPages ||
                            (number >= currentPage - 1 &&
                              number <= currentPage + 1)
                          ) {
                            return (
                              <button
                                key={number}
                                onClick={() => paginate(number)}
                                className={`px-4 py-2 rounded-lg font-semibold transition ${
                                  currentPage === number
                                    ? "bg-blue-600 text-white shadow-md"
                                    : "bg-white border-2 border-gray-200 hover:border-blue-600 hover:text-blue-600"
                                }`}
                              >
                                {number}
                              </button>
                            );
                          } else if (
                            number === currentPage - 2 ||
                            number === currentPage + 2
                          ) {
                            return (
                              <span key={number} className="px-2 text-gray-400">
                                ...
                              </span>
                            );
                          }
                          return null;
                        }
                      )}

                      {/* Botón siguiente */}
                      <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg bg-white border-2 border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:border-blue-600 hover:text-blue-600 transition"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}