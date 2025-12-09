"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface FavoriteItem {
  id: string;
  nombre: string;
  precio: number;
  imagen: string | null;
  stock: number;
  categoria: string;
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  addFavorite: (item: FavoriteItem) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  favoriteCount: number;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const { data: session, status } = useSession();

  // Obtener clave de favoritos según el usuario
  const getFavoritesKey = () => {
    if (session?.user?.id) {
      return `favorites_${session.user.id}`;
    }
    return "favorites_guest";
  };

  // Cargar favoritos del localStorage cuando cambia la sesión
  useEffect(() => {
    if (status === "loading") return;

    const favoritesKey = getFavoritesKey();
    const savedFavorites = localStorage.getItem(favoritesKey);

    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    } else {
      setFavorites([]);
    }
  }, [session?.user?.id, status]);

  // Guardar favoritos en localStorage cada vez que cambian
  useEffect(() => {
    if (status === "loading") return;

    const favoritesKey = getFavoritesKey();
    localStorage.setItem(favoritesKey, JSON.stringify(favorites));
  }, [favorites, session?.user?.id, status]);

  const addFavorite = (item: FavoriteItem) => {
    setFavorites((prev) => {
      // Evitar duplicados
      if (prev.some((fav) => fav.id === item.id)) {
        return prev;
      }
      return [...prev, item];
    });
  };

  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== id));
  };

  const isFavorite = (id: string) => {
    return favorites.some((fav) => fav.id === id);
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  const favoriteCount = favorites.length;

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        favoriteCount,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites debe usarse dentro de un FavoritesProvider");
  }
  return context;
}