"use client";

import Image from "next/image";
import { portfolioData } from "../lib/portfolio-data";

export default function About() {
  const { personal } = portfolioData;

  return (
    <section id="about" className="py-16 lg:py-20 relative select-none">
      {/* Section Header */}
      <div className="flex flex-col items-center justify-center mb-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          About Me
        </h2>
        <div className="w-20 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center lg:items-stretch">
        {/* Left Side: Single Image */}
        <div className="relative w-full h-[320px] sm:h-[400px] lg:h-full rounded-3xl overflow-hidden flex items-center justify-center border border-gray-200 dark:border-gray-800 bg-white/5 dark:bg-gray-900/30 backdrop-blur-sm shadow-xl p-8 lg:p-12 group">
          <Image
            src="/about-illustration.webp"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            alt="About Me"
            className="w-full h-full object-contain dark:invert transition-transform duration-500 hover:scale-105"
          />
          {/* Optional: Add a subtle inner glow ring */}
          <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10" />
        </div>

        {/* Right Side: Content & Stats */}
        <div className="flex flex-col justify-center space-y-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Transforming ideas into{" "}
              <span className="text-indigo-600 dark:text-indigo-400">
                digital reality
              </span>
              .
            </h3>
            {Array.isArray((personal as any).z) ? (
              (personal as any).z.map((paragraph: string, index: number) => (
                <p key={index} className="text-gray-600 dark:text-gray-400 leading-relaxed text-md text-justify">
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-md text-justify">
                {(personal as any).z}
              </p>
            )}
          </div>

          {/* Quick Stats */}
          {/* <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 border-t border-gray-200 dark:border-gray-800">
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
          </div> */}



          {/* Core Focus Badges */}
          <div className="flex flex-wrap xl:flex-nowrap gap-3 pt-6 border-t border-gray-200 dark:border-gray-800 w-full">
            {[
              {
                title: "Clean Code",
                icon: (
                  <svg className="w-4 h-4 text-indigo-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                ),
              },
              {
                title: "Performance",
                icon: (
                  <svg className="w-4 h-4 text-purple-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
              },
              {
                title: "Security",
                icon: (
                  <svg className="w-4 h-4 text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
              },
              {
                title: "Scalability",
                icon: (
                  <svg className="w-4 h-4 text-purple-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2zM16 13a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2z" />
                  </svg>
                ),
              },
            ].map((card, i) => (
              <div
                key={i}
                className="flex flex-1 xl:flex-none items-center justify-center xl:justify-start gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-800/60 bg-white/5 dark:bg-gray-900/30 backdrop-blur-sm shadow-sm transition-all duration-300 hover:scale-[1.05] hover:border-indigo-500/30 select-none"
              >
                {card.icon}
                <span className="font-medium text-gray-800 dark:text-gray-200 text-sm tracking-wide whitespace-nowrap">
                  {card.title}
                </span>
              </div>
            ))}
          </div>

















        </div>
      </div>
    </section>
  );
}
