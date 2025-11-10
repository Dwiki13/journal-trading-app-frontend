"use client";

import { ReactNode } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";

export default function LoginLayout({ children }: { children: ReactNode }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 px-4 transition-colors duration-300">
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleTheme}
          className="p-1 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      {children}
    </div>
  );
}