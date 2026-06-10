"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-10 h-10" />;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-brand-surfaceLight dark:bg-brand-surfaceDark text-primary-orange transition-all duration-200 hover:scale-105 active:scale-95 shadow-md"
      aria-label="Alternar tema visual"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-primary-gold" />
      ) : (
        <Moon className="w-5 h-5 text-primary-orange" />
      )}
    </button>
  );
}