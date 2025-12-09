"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  // No renderizar hasta que esté montado
  if (!mounted) {
    return (
      <div className="p-2 w-10 h-10">
        {/* Placeholder para evitar layout shift */}
      </div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-900 transition"
      aria-label="Cambiar tema"
    >
      {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}