"use client";

import { createContext, useContext, useState, useEffect } from "react";

interface SearchContextType {
  searchHistory: string[];
  addToHistory: (query: string) => void;
  clearHistory: () => void;
  removeFromHistory: (query: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

const MAX_HISTORY = 10;

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Cargar historial del localStorage
  useEffect(() => {
    const saved = localStorage.getItem("searchHistory");
    if (saved) {
      setSearchHistory(JSON.parse(saved));
    }
  }, []);

  const addToHistory = (query: string) => {
    if (!query.trim()) return;

    setSearchHistory((prev) => {
      // Eliminar duplicados y agregar al inicio
      const filtered = prev.filter(
        (item) => item.toLowerCase() !== query.toLowerCase()
      );
      const updated = [query, ...filtered].slice(0, MAX_HISTORY);
      localStorage.setItem("searchHistory", JSON.stringify(updated));
      return updated;
    });
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("searchHistory");
  };

  const removeFromHistory = (query: string) => {
    setSearchHistory((prev) => {
      const updated = prev.filter((item) => item !== query);
      localStorage.setItem("searchHistory", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <SearchContext.Provider
      value={{ searchHistory, addToHistory, clearHistory, removeFromHistory }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch debe usarse dentro de un SearchProvider");
  }
  return context;
}