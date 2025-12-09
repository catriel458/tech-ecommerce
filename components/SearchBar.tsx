"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Clock, X, TrendingUp } from "lucide-react";
import { useSearch } from "@/contexts/SearchContext";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (query: string) => void;
}

export default function SearchBar({ value, onChange, onSearch }: SearchBarProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [popularProducts, setPopularProducts] = useState<string[]>([]);
  const { searchHistory, addToHistory, removeFromHistory, clearHistory } =
    useSearch();
  const searchRef = useRef<HTMLDivElement>(null);

  // Cargar productos populares al montar
  useEffect(() => {
    fetchPopularProducts();
  }, []);

  const fetchPopularProducts = async () => {
    try {
      const response = await fetch("/api/productos");
      const productos = await response.json();
      
      // Obtener nombres únicos de productos (primeros 5)
      const productNames = productos
        .slice(0, 5)
        .map((p: any) => p.nombre);
      
      setPopularProducts(productNames);
    } catch (error) {
      console.error("Error al cargar productos populares:", error);
    }
  };

  // Cerrar sugerencias al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Generar sugerencias basadas en el input
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (value.trim().length > 2) {
        try {
          const response = await fetch(`/api/productos?busqueda=${encodeURIComponent(value)}`);
          const productos = await response.json();
          
          // Obtener nombres únicos (máximo 5)
          const uniqueNames = Array.from(
            new Set(productos.slice(0, 5).map((p: any) => p.nombre))
          ) as string[];
          
          setSuggestions(uniqueNames);
        } catch (error) {
          console.error("Error al buscar sugerencias:", error);
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    };

    const debounce = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(debounce);
  }, [value]);

  const handleSelectSuggestion = (query: string) => {
    onChange(query);
    addToHistory(query);
    setShowSuggestions(false);
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && value.trim()) {
      addToHistory(value);
      setShowSuggestions(false);
      if (onSearch) {
        onSearch(value);
      }
    }
  };

  return (
    <div ref={searchRef} className="relative w-full">
      {/* Input de búsqueda */}
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
          size={24}
        />
        <input
          type="text"
          placeholder="Busca procesadores, tarjetas gráficas, monitores..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          className="w-full pl-12 pr-12 py-4 text-lg border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white dark:bg-gray-800 dark:text-white"
        />
        {value && (
          <button
            onClick={() => onChange("")}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Panel de sugerencias */}
      {showSuggestions && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-h-96 overflow-y-auto">
          {/* Historial de búsquedas */}
          {searchHistory.length > 0 && !value && (
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock size={16} />
                  <span className="font-semibold">Búsquedas recientes</span>
                </div>
                <button
                  onClick={clearHistory}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Limpiar
                </button>
              </div>
              <div className="space-y-1">
                {searchHistory.map((query, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between group"
                  >
                    <button
                      onClick={() => handleSelectSuggestion(query)}
                      className="flex-1 text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-300"
                    >
                      {query}
                    </button>
                    <button
                      onClick={() => removeFromHistory(query)}
                      className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition"
                    >
                      <X size={14} className="text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sugerencias filtradas */}
          {suggestions.length > 0 && value && (
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-semibold">
                Productos sugeridos
              </div>
              <div className="space-y-1">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectSuggestion(suggestion)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-300"
                  >
                    <Search size={14} className="inline mr-2 text-gray-400" />
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Productos populares (cuando no hay búsqueda) */}
          {!value && popularProducts.length > 0 && (
            <div className="p-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                <TrendingUp size={16} />
                <span className="font-semibold">Productos destacados</span>
              </div>
              <div className="space-y-1">
                {popularProducts.map((product, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectSuggestion(product)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-300"
                  >
                    <TrendingUp size={14} className="inline mr-2 text-blue-500" />
                    {product}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}