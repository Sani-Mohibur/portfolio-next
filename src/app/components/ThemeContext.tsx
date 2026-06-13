"use client";

import React, { createContext, useState, useContext, useEffect } from "react";

// 1. Define the type for the context state
interface ThemeContextType {
  dark: boolean;
  setDark: React.Dispatch<React.SetStateAction<boolean>>;
}

// 2. Initialize the context with an explicit undefined check for safer typing
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState<boolean>(true);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved !== null) {
      setDark(saved === "dark");
    } else {
      setDark(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", dark ? "dark" : "light");
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return (
    <ThemeContext.Provider value={{ dark, setDark }}>
      <div
        className={
          dark ? "bg-[#0d1117] text-gray-100" : "bg-white text-gray-900"
        }
      >
        <div className="min-h-screen">{children}</div>
      </div>
    </ThemeContext.Provider>
  );
}

// 3. Custom hook with built-in Type protection
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
