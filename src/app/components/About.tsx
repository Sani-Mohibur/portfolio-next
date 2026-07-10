"use client";

import Image from "next/image";
import { portfolioData } from "../lib/portfolio-data";

export default function About() {
  const { personal } = portfolioData;

  return (
    <section id="about" className="py-20 lg:py-28 relative select-none">
      {/* Section Header */}
      <div className="flex flex-col items-center justify-center mb-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          About Me
        </h2>
        <div className="w-20 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side: Single Image */}
        <div className="relative w-full h-[300px] sm:h-[400px] rounded-3xl overflow-hidden flex items-center justify-center border border-gray-200 dark:border-gray-800 bg-white/5 dark:bg-gray-900/30 backdrop-blur-sm shadow-xl p-8 group">
          <Image
            src="/about-illustration.webp"
            fill
            alt="About Me"
            className="w-full h-full object-contain dark:invert transition-transform duration-500 hover:scale-105"
          />
          {/* Optional: Add a subtle inner glow ring */}
          <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10" />
        </div>

        {/* Right Side: Content & Stats */}
        <div className="flex flex-col space-y-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Transforming ideas into{" "}
              <span className="text-indigo-600 dark:text-indigo-400">
                digital reality
              </span>
              .
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg text-justify">
              {personal.about}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 border-t border-gray-200 dark:border-gray-800">
            {[
              { label: "Experience", value: "1+ Years" },
              { label: "Completed Projects", value: "10+" },
              { label: "Client Satisfaction", value: "90%" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col space-y-1">
                <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
                  {stat.value}
                </span>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
