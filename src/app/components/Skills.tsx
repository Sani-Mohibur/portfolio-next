"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { portfolioData } from "../lib/portfolio-data";
import { TerminalIcon, ServerIcon, DatabaseIcon, GithubIcon } from "./icons"; // Reusing some existing custom icons

// Add a few more custom SVG icons for specific skill categories
const ShieldIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
  </svg>
);

const LayoutIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <line x1="3" x2="21" y1="9" y2="9" />
    <line x1="9" x2="9" y1="21" y2="9" />
  </svg>
);

export default function Skills() {
  const { skills } = portfolioData;

  const skillGroups = [
    {
      category: "Languages",
      icon: TerminalIcon,
      items: skills.languages,
      color: "from-blue-500 to-cyan-500",
    },
    {
      category: "Frontend",
      icon: LayoutIcon,
      items: skills.frontend,
      color: "from-pink-500 to-rose-500",
    },
    {
      category: "Backend",
      icon: ServerIcon,
      items: skills.backend,
      color: "from-emerald-500 to-teal-500",
    },
    {
      category: "Databases & ORMs",
      icon: DatabaseIcon,
      items: skills.databases,
      color: "from-purple-500 to-indigo-500",
    },
    {
      category: "Security & Auth",
      icon: ShieldIcon,
      items: skills.security,
      color: "from-orange-500 to-amber-500",
    },
    {
      category: "Tools & Process",
      icon: GithubIcon,
      items: skills.tools,
      color: "from-gray-500 to-slate-500",
    },
  ];

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section id="skills" className="py-20 lg:py-28">
      <div className="flex flex-col items-center justify-center mb-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Technical Skills
        </h2>
        <div className="w-20 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full" />
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants}
      >
        {skillGroups.map((group, index) => {
          const Icon = group.icon;

          return (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="relative rounded-2xl p-[1px] group"
            >
              {/* Animated Gradient Border */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${group.color} opacity-40 blur-sm group-hover:opacity-100 transition-opacity duration-500`}
              />

              {/* Card Content */}
              <div className="relative bg-white dark:bg-gray-900 h-full p-6 sm:p-8 rounded-2xl shadow-[var(--shadow-premium)] dark:shadow-[var(--shadow-premium-dark)] z-10 flex flex-col">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-br ${group.color} text-white shadow-lg`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-800 dark:text-white">
                    {group.category}
                  </h3>
                </div>

                {/* Skills Chips */}
                <div className="flex flex-wrap gap-2.5 mt-auto">
                  {group.items.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3.5 py-1.5 text-sm font-medium rounded-full border border-gray-200 dark:border-gray-800 bg-gray-50 hover:bg-white dark:bg-gray-800/50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:shadow-sm transition-all duration-200 cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
