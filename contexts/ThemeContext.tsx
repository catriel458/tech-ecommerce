"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Función para obtener el tema inicial (antes de hidratar)
function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  
  try {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || savedTheme === "light") {
      return savedTheme;
    }
    
    // Detectar preferencia del sistema
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
  } catch (e) {
    console.error("Error getting theme:", e);
  }
  
  return "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // Aplicar tema inmediatamente al montar
  useEffect(() => {
    const initialTheme = getInitialTheme();
    setTheme(initialTheme);
    
    // Aplicar clase dark al HTML
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    
    try {
      localStorage.setItem("theme", newTheme);
    } catch (e) {
      console.error("Error saving theme:", e);
    }
    
    // Aplicar/remover clase dark
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    return {
      theme: "light" as Theme,
      toggleTheme: () => {},
      mounted: false,
    };
  }
  return context;
}