"use client";

import React from "react";
import { motion } from "framer-motion";

interface SkillGroup {
  category: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => React.JSX.Element;
  items: string[];
  color: string;
}

const Skills = () => {
  const skillsData: SkillGroup[] = [
    {
      category: "Languages",
      icon: (props) => (
        <svg
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          {...props}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
          />
        </svg>
      ),
      items: ["C++", "Java", "C#", "JavaScript", "TypeScript"],
      color: "from-blue-500 to-cyan-500",
    },
    {
      category: "Web Stack",
      icon: (props) => (
        <svg
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          {...props}
        >
          <circle cx="12" cy="12" r="10" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 2a14.5 14.5 0 000 20M2 12h20"
          />
        </svg>
      ),
      items: [
        "HTML5",
        "CSS3",
        "React",
        "Next.js",
        "Tailwind CSS",
        "Bootstrap",
        "Node.js",
        "Express.js",
        "Socket.IO",
      ],
      color: "from-teal-500 to-emerald-500",
    },
    {
      category: "Databases & ORMs",
      icon: (props) => (
        <svg
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          {...props}
        >
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
          <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
        </svg>
      ),
      items: ["MySQL", "PostgreSQL", "MongoDB", "Prisma ORM", "Mongoose"],
      color: "from-purple-500 to-pink-500",
    },
    {
      category: "Tools & Process",
      icon: (props) => (
        <svg
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          {...props}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"
          />
        </svg>
      ),
      items: ["Git", "GitHub", "Postman", "Vite", "Agile & Scrum"],
      color: "from-orange-500 to-amber-500",
    },
  ];

  return (
    <section id="skills" className="py-15">
      <h2 className="text-3xl font-bold mb-12 text-center dark:text-white">
        Skills
      </h2>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.12,
            },
          },
        }}
      >
        {skillsData.map((group, index) => {
          const Icon = group.icon;

          return (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              whileHover={{ scale: 1.04 }}
              className="relative rounded-2xl p-[1px]"
            >
              {/* Gradient Border */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${group.color} opacity-20 blur-sm`}
              />

              {/* Card Content */}
              <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-6 rounded-2xl shadow-md transition-all duration-300 will-change-transform h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className={`p-2 rounded-lg bg-gradient-to-br ${group.color} text-white`}
                  >
                    <Icon className="w-[18px] h-[18px]" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
                    {group.category}
                  </h3>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2">
                  {group.items.map((skill, idx) => (
                    <motion.span
                      key={idx}
                      className="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
};

export default Skills;
