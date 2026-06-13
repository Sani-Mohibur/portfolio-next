"use client";

import React from "react";
import { useTheme } from "./ThemeContext";

interface NavLink {
  name: string;
  href: string;
}

export default function Navbar() {
  const { dark, setDark } = useTheme();

  const links: NavLink[] = [
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Resume", href: "#resume" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav className="bg-white dark:bg-[#0d1117] shadow sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold dark:text-white">
          Mohibur Rahman Sani
        </h1>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex space-x-4">
            {links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-3 py-1 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400 transition-colors duration-200"
                onClick={(e) => {
                  e.preventDefault();
                  const section = document.querySelector(link.href);
                  if (section) {
                    section.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Theme Toggle Button using native SVGs */}
          <button
            onClick={() => setDark(!dark)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 flex items-center justify-center"
            aria-label="Toggle Theme"
          >
            {dark ? (
              // Sun Icon SVG
              <svg
                className="w-5 h-5 text-yellow-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="5" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42m12.72-12.72l1.42-1.42"
                />
              </svg>
            ) : (
              // Moon Icon SVG
              <svg
                className="w-5 h-5 text-slate-700"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
