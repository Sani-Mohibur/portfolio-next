"use client";

import { useTheme } from "./ThemeContext";
import { portfolioData } from "../lib/portfolio-data";
import { GithubIcon, LinkedinIcon, MailIcon } from "./icons";

export default function Footer() {
  const { dark } = useTheme();
  const { personal, contact } = portfolioData;

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-b from-white to-gray-50 dark:from-[#0d1117] dark:to-[#090d13] border-t border-gray-200/60 dark:border-gray-800/60 transition-colors duration-500 overflow-hidden">
      {/* Soft top border glow for dark mode */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent dark:via-indigo-500/40 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 py-10 md:py-16 relative z-10">
        {/* Main Links/Brand Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-8 items-start text-center md:text-left">

          {/* Brand */}
          <div className="flex flex-col items-center md:items-start space-y-3 order-1">
            <h2 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
              {personal.name.split(" ")[0]}
              <span className="text-gray-900 dark:text-white">.</span>
            </h2>
            <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400 max-w-sm font-medium">
              Full-Stack Engineer specializing in robust backend architecture, scalable microservices, and fluid interface design.
            </p>
          </div>

          {/* Navigation Links - Stacked perfectly on mobile, row on desktop */}
          <div className="flex flex-col sm:flex-row md:flex-wrap justify-center items-center md:pt-2 gap-4 sm:gap-x-8 order-3 md:order-2">
            {["About", "Skills", "Experience", "Projects"].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300 relative sm:after:absolute sm:after:bottom-[-4px] sm:after:left-0 sm:after:w-0 sm:after:h-px sm:after:bg-indigo-600 sm:after:dark:after:bg-indigo-400 sm:hover:after:w-full sm:after:transition-all sm:after:duration-300"
              >
                {link}
              </a>
            ))}
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-center md:items-end space-y-4 order-2 md:order-3">
            <div className="text-center md:text-right">
              <h3 className="text-xs font-bold tracking-widest uppercase text-indigo-600 dark:text-indigo-400 font-mono">
                Connect
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Wanna chat? Contact anywhere below.
              </p>
            </div>

            <div className="flex gap-3">
              {[
                { href: contact.github, icon: <GithubIcon className="w-5 h-5" />, label: "GitHub" },
                { href: contact.linkedin, icon: <LinkedinIcon className="w-5 h-5" />, label: "LinkedIn" },
                { href: `mailto:${contact.email}`, icon: <MailIcon className="w-5 h-5" />, label: "Email" },
              ].map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  target={item.label !== "Email" ? "_blank" : undefined}
                  rel={item.label !== "Email" ? "noopener noreferrer" : undefined}
                  className="p-3 rounded-xl border border-gray-200/50 dark:border-gray-700/30 bg-white/40 dark:bg-gray-800/30 backdrop-blur-md text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500/30 dark:hover:border-indigo-400/30 hover:shadow-[0_0_15px_rgba(99,102,241,0.15)] dark:hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all duration-300 transform hover:-translate-y-1"
                  aria-label={item.label}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Thin Animated Gradient Divider */}
        <div className="mt-10 w-full h-px bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-800/20 dark:via-gray-700/50 dark:to-gray-800/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent w-1/2 animate-shimmer" />
        </div>

        {/* Copyright Bar - Center aligned on mobile, row spread on desktop */}
        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <p className="text-xs font-medium tracking-widest uppercase text-gray-400 dark:text-gray-500/80 font-mono">
            © {currentYear} {personal.name}. All rights reserved.
          </p>
          <p className="text-xs font-medium tracking-widest uppercase text-gray-400 dark:text-gray-500/80 flex items-center gap-1 font-mono">
            Stay Curious // Built with passion
          </p>
        </div>
      </div>
    </footer>
  );
}