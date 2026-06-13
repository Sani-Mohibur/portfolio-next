"use client";

import React from "react";

import { useTheme } from "./ThemeContext";

export default function Footer() {
  const { dark } = useTheme();

  return (
    <footer
      className={
        dark
          ? "bg-gray-900 text-gray-300 py-10 px-6 transition-colors duration-300"
          : "bg-white text-gray-900 py-10 px-6 transition-colors duration-300"
      }
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        {/* Left Section */}
        <div>
          <h2
            className={
              dark
                ? "text-xl font-bold text-white"
                : "text-xl font-bold text-black"
            }
          >
            Mohibur Rahman Sani
          </h2>
          <p className="text-sm mt-2">Full Stack Developer</p>
        </div>

        {/* Center Links */}
        <div className="flex justify-center space-x-6">
          <a
            href="#about"
            className={dark ? "hover:text-gray-100" : "hover:text-black"}
          >
            About
          </a>
          <a
            href="#skills"
            className={dark ? "hover:text-gray-100" : "hover:text-black"}
          >
            Skills
          </a>
          <a
            href="#projects"
            className={dark ? "hover:text-gray-100" : "hover:text-black"}
          >
            Projects
          </a>
          <a
            href="#resume"
            className={dark ? "hover:text-gray-100" : "hover:text-black"}
          >
            Resume
          </a>
        </div>

        {/* Right Section (Social Links) */}
        <div className="flex flex-col items-center md:items-end space-y-3">
          <div className="flex space-x-4">
            <a
              href="https://github.com/Sani-Mohibur"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition"
            >
              <svg
                className="w-[18px] h-[18px]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.061.069-.061 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.27.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12c0-5.523-4.477-10-10-10z"
                />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/sani-mohibur/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition"
            >
              <svg
                className="w-[18px] h-[18px]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
            <a
              href="mailto:mohiburrahmansani@gmail.com"
              className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition"
            >
              <svg
                className="w-[18px] h-[18px]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L22 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        className={
          dark
            ? "border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-400"
            : "border-t border-gray-300 mt-8 pt-4 text-center text-sm text-gray-600"
        }
      >
        © {new Date().getFullYear()} SaniMohibur. All rights reserved.
      </div>
    </footer>
  );
}
