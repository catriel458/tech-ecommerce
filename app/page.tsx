"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import { SlidersHorizontal, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";

interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen: string | null;
  categoria: string;
  createdAt?: string;
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

const OPCIONES_ORDENAMIENTO = [
  { value: "recientes", label: "Más recientes" },
  { value: "precio-asc", label: "Precio: Menor a mayor" },
  { value: "precio-desc", label: "Precio: Mayor a menor" },
  { value: "nombre-asc", label: "Nombre: A-Z" },
  { value: "nombre-desc", label: "Nombre: Z-A" },
  { value: "stock-desc", label: "Mayor stock" },
];

export default function HomePage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("TODAS");
  const [busqueda, setBusqueda] = useState("");
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [ordenamiento, setOrdenamiento] = useState("recientes");
  
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
      setCurrentPage(1);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchProductos();
    }, 500);

    return () => clearTimeout(debounce);
  }, [categoriaSeleccionada, busqueda, precioMin, precioMax]);

  // Función de ordenamiento
  const ordenarProductos = (productos: Producto[]) => {
    const productosOrdenados = [...productos];

    switch (ordenamiento) {
      case "precio-asc":
        return productosOrdenados.sort((a, b) => a.precio - b.precio);
      case "precio-desc":
        return productosOrdenados.sort((a, b) => b.precio - a.precio);
      case "nombre-asc":
        return productosOrdenados.sort((a, b) => a.nombre.localeCompare(b.nombre));
      case "nombre-desc":
        return productosOrdenados.sort((a, b) => b.nombre.localeCompare(a.nombre));
      case "stock-desc":
        return productosOrdenados.sort((a, b) => b.stock - a.stock);
      case "recientes":
      default:
        return productosOrdenados;
    }
  };

  // Aplicar ordenamiento
  const productosOrdenados = ordenarProductos(productos);

  // Calcular productos para la página actual
  const indexOfLastProduct = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstProduct = indexOfLastProduct - ITEMS_PER_PAGE;
  const currentProducts = productosOrdenados.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(productosOrdenados.length / ITEMS_PER_PAGE);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-4">
            Hardware Premium
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Los mejores componentes para armar tu PC ideal
          </p>
        </div>

        {/* Barra de búsqueda principal */}
        <div className="mb-8 max-w-4xl mx-auto">
          <SearchBar value={busqueda} onChange={setBusqueda} />
        </div>

        {/* Botón de filtros móvil */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-center space-x-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
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
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-4">
              <div className="flex items-center space-x-2 mb-6">
                <SlidersHorizontal className="text-blue-600 dark:text-blue-400" size={24} />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Filtros</h2>
              </div>

              {/* Categorías */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Categoría
                </label>
                <div className="space-y-2">
                  {CATEGORIAS.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoriaSeleccionada(cat)}
                      className={`w-full text-left px-4 py-2.5 rounded-lg transition font-medium ${
                        categoriaSeleccionada === cat
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      {cat.replace(/_/g, " ")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rango de precios */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Rango de Precio
                </label>
                <div className="space-y-3">
                  <input
                    type="number"
                    placeholder="Precio mínimo"
                    value={precioMin}
                    onChange={(e) => setPrecioMin(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-white"
                  />
                  <input
                    type="number"
                    placeholder="Precio máximo"
                    value={precioMax}
                    onChange={(e) => setPrecioMax(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-white"
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
                  className="w-full mt-6 py-2.5 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition font-semibold"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          </aside>

          {/* Grid de productos */}
          <div className="lg:col-span-3">
            {/* Header de resultados con ordenamiento */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-gray-900 dark:text-white font-semibold">
                    {productosOrdenados.length} producto{productosOrdenados.length !== 1 ? "s" : ""}{" "}
                    encontrado{productosOrdenados.length !== 1 ? "s" : ""}
                  </p>
                  {totalPages > 1 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Página {currentPage} de {totalPages}
                    </p>
                  )}
                </div>

                {/* Selector de ordenamiento */}
                <div className="flex items-center space-x-2">
                  <ArrowUpDown className="text-gray-600 dark:text-gray-400" size={20} />
                  <select
                    value={ordenamiento}
                    onChange={(e) => setOrdenamiento(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium cursor-pointer"
                  >
                    {OPCIONES_ORDENAMIENTO.map((opcion) => (
                      <option key={opcion.value} value={opcion.value}>
                        {opcion.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Grid de productos */}
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400 font-semibold">
                  Cargando productos...
                </p>
              </div>
            ) : currentProducts.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  No se encontraron productos
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
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
                        className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                      >
                        <ChevronLeft size={20} />
                      </button>

                      {/* Números de página */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (number) => {
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
                                    ? "bg-blue-600 text-white"
                                    : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
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
                        className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition"
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