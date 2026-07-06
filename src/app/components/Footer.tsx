"use client";

import React from "react";
import { useTheme } from "./ThemeContext";
import { portfolioData } from "../lib/portfolio-data";
import { GithubIcon, LinkedinIcon, MailIcon } from "./icons";

export default function Footer() {
  const { dark } = useTheme();
  const { personal, contact } = portfolioData;

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-[#090d13] border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 items-center text-center md:text-left">
          
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start space-y-3">
            <h2 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
              {personal.name.split(' ')[0]}<span className="text-gray-900 dark:text-white">.</span>
            </h2>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {personal.title}
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            {["About", "Skills", "Experience", "Projects"].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                {link}
              </a>
            ))}
          </div>

          {/* Social Links */}
          <div className="flex justify-center md:justify-end gap-4">
            <a
              href={contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white transition-all transform hover:-translate-y-1"
              aria-label="GitHub"
            >
              <GithubIcon className="w-5 h-5" />
            </a>
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white transition-all transform hover:-translate-y-1"
              aria-label="LinkedIn"
            >
              <LinkedinIcon className="w-5 h-5" />
            </a>
            <a
              href={`mailto:${contact.email}`}
              className="p-2.5 rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white transition-all transform hover:-translate-y-1"
              aria-label="Email"
            >
              <MailIcon className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-500">
            © {currentYear} {personal.name}. All rights reserved.
          </p>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-500 flex items-center gap-1">
            Built with <span className="text-red-500 text-lg">♥</span> in {personal.location.split(',')[0]}
          </p>
        </div>
      </div>
    </footer>
  );
}
