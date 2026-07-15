"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { Icon } from "@iconify/react";
import { portfolioData } from "../lib/portfolio-data";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
    },
  },
};

export default function Skills() {
  const { skills } = portfolioData;

  const groupedSkills = skills.reduce(
    (acc: Record<string, typeof skills>, skill) => {
      const category = skill.category || "Other";

      if (!acc[category]) {
        acc[category] = [];
      }

      acc[category].push(skill);

      return acc;
    },
    {}
  );

  return (
    <section id="skills" className="select-none py-16 lg:py-20">
      <div className="flex flex-col items-center text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          Technical Skills
        </h2>

        <div className="mt-4 w-20 h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600" />

        <p className="mt-5 max-w-xl text-gray-600 dark:text-gray-400">
          Technologies and tools I use to build scalable, modern applications.
        </p>
      </div>

      <div className="space-y-12">
        {Object.entries(groupedSkills).map(([category, categorySkills]) => (
          <div key={category}>
            <h3 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
              {category}
            </h3>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="
                grid
                grid-cols-2
                sm:grid-cols-3
                md:grid-cols-4
                lg:grid-cols-5
                xl:grid-cols-6
                gap-6
                justify-center
                items-center
              "
            >
              {categorySkills.map((skill) => (
                <motion.a
                  key={skill.name}
                  href={skill.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={itemVariants}
                  whileHover={{
                    y: -8,
                    scale: 1.04,
                  }}
                  className="
                    group relative
                    w-full
                    max-w-[140px]
                    h-24
                    rounded-2xl
                    border
                    border-gray-200
                    dark:border-gray-800
                    bg-white
                    dark:bg-transparent
                    p-4
                    flex
                    flex-col
                    items-center
                    justify-center
                    gap-3
                    transition-all
                    duration-300
                    hover:border-indigo-500/40
                    hover:shadow-lg
                  "
                >
                  {skill.featured && (
                    <div
                      className="
                        absolute inset-0
                        rounded-2xl
                        bg-gradient-to-br
                        from-indigo-500/10
                        to-purple-500/10
                        opacity-0
                        group-hover:opacity-100
                        transition-opacity
                      "
                    />
                  )}

                  <Icon
                    icon={skill.icon}
                    className={`
                      relative z-10
                      w-10 h-10
                      transition-all
                      duration-300
                      group-hover:scale-110
                      

                      ${skill.featured
                        ? "drop-shadow-[0_0_10px_rgba(99,102,241,0.4)]"
                        : "grayscale group-hover:grayscale-0"
                      }
                    `}
                  />

                  <span
                    className="
                      relative z-10
                      text-sm
                      font-medium
                      text-center
                      text-gray-800
                      dark:text-gray-200
                    "
                  >
                    {skill.name}
                  </span>
                </motion.a>
              ))}
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
}