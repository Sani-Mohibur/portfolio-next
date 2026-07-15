"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "./ThemeContext";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";

interface NavLink {
  name: string;
  href: string;
}

export default function Navbar() {
  const { dark, setDark } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [activeSection, setActiveSection] = useState("about");

  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);

  const links: NavLink[] = [
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
  ];

  // Monitor scroll behavior for visibility toggle, scale shifts, and intersection states
  useMotionValueEvent(scrollY, "change", (latest) => {
    const diff = latest - lastScrollY.current;

    // 1. Handle scroll-to-hide logic (Ignore micro-scrolls at the very top boundary)
    if (latest < 10) {
      setVisible(true);
    } else if (diff > 5 && latest > 50) {
      setVisible(false); // Scrolling down -> Hide navbar
      setMobileMenuOpen(false); // Close mobile panel safely if open
    } else if (diff < -5) {
      setVisible(true); // Scrolling up -> Show navbar
    }

    lastScrollY.current = latest;

    // 2. Handle visual scaling state
    setScrolled(latest > 20);

    // 3. Simple intersection tracker for active states
    const scrollPosition = latest + 200;
    for (const link of links) {
      const el = document.querySelector(link.href);
      if (el instanceof HTMLElement) {
        if (
          scrollPosition >= el.offsetTop &&
          scrollPosition < el.offsetTop + el.offsetHeight
        ) {
          setActiveSection(link.href.replace("#", ""));
          break;
        }
      }
    }
  });

  const handleScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetSection = href.replace("#", "");
    setActiveSection(targetSection);

    const section = document.querySelector(href);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.header
      variants={{
        visible: { y: 0 },
        hidden: { y: "-110%" },
      }}
      animate={visible ? "visible" : "hidden"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed top-0 inset-x-0 z-50 p-4 pointer-events-none select-none"
    >
      <nav
        className={`max-w-5xl mx-auto rounded-2xl transition-all duration-500 pointer-events-auto border backdrop-blur-md ${scrolled
          ? "bg-white/70 dark:bg-[#0d1117]/70 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] border-gray-200/50 dark:border-gray-800/50 py-2"
          : "bg-white/40 dark:bg-[#0d1117]/30 shadow-none border-transparent py-4"
          }`}
      >
        <div className="max-w-5xl mx-auto px-6 flex justify-between items-center">
          <h1 className="text-lg font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 truncate pr-4">
            Mohibur Rahman Sani
          </h1>

          <div className="flex items-center space-x-2 md:space-x-6">
            {/* Desktop Links Panel */}
            <div className="hidden md:flex items-center space-x-1">
              {links.map((link) => {
                const isActive = activeSection === link.href.replace("#", "");
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    className={`relative px-4 py-2 text-sm font-bold tracking-wide transition-colors duration-300 ${isActive
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      }`}
                    onClick={(e) => handleScroll(e, link.href)}
                  >
                    <span className="relative z-10">{link.name}</span>
                    {isActive && (
                      <motion.span
                        layoutId="activeIndicator"
                        className="absolute inset-0 bg-indigo-50/60 dark:bg-indigo-500/10 rounded-xl -z-0"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                  </a>
                );
              })}
            </div>

            {/* Premium Theme Toggle */}
            <button
              onClick={() => setDark(!dark)}
              className="cursor-pointer p-2.5 rounded-xl border border-gray-200/40 dark:border-gray-700/30 bg-white/50 dark:bg-gray-800/30 backdrop-blur-md shadow-sm text-gray-700 dark:text-gray-300 hover:scale-105 transition-all duration-300 flex items-center justify-center shrink-0 overflow-hidden"
              aria-label="Toggle Theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                {dark ? (
                  <motion.svg
                    key="sun"
                    initial={{ y: -20, opacity: 0, rotate: 45 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: 20, opacity: 0, rotate: -45 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="w-4 h-4 text-amber-400 fill-amber-400/20"
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
                  </motion.svg>
                ) : (
                  <motion.svg
                    key="moon"
                    initial={{ y: -20, opacity: 0, rotate: -45 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: 20, opacity: 0, rotate: 45 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="w-4 h-4 text-indigo-600 fill-indigo-600/10"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
                    />
                  </motion.svg>
                )}
              </AnimatePresence>
            </button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2.5 rounded-xl border border-gray-200/40 dark:border-gray-700/30 bg-white/50 dark:bg-gray-800/30 backdrop-blur-md shadow-sm text-gray-700 dark:text-gray-300 transition-colors shrink-0"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Mobile Menu"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16m-10 6h10"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Floating Mobile Glass Panel Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute left-4 right-4 top-[calc(100%+12px)] overflow-hidden bg-white/90 dark:bg-[#0d1117]/95 backdrop-blur-lg border border-gray-200/60 dark:border-gray-800/60 shadow-xl rounded-2xl p-3 flex flex-col space-y-1"
            >
              {links.map((link, i) => {
                const isActive = activeSection === link.href.replace("#", "");
                return (
                  <motion.a
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    key={link.name}
                    href={link.href}
                    className={`px-4 py-3 text-sm font-semibold rounded-xl transition-all flex items-center justify-between ${isActive
                      ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/40"
                      }`}
                    onClick={(e) => handleScroll(e, link.href)}
                  >
                    <span>{link.name}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                    )}
                  </motion.a>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}
