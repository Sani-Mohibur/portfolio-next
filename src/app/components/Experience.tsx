"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { portfolioData } from "../lib/portfolio-data";
import { TerminalIcon } from "./icons";

// We can reuse or create specific icons for Education vs Experience.
const BriefcaseIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const GraduationCapIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21.42 10.922a2 2 0 0 1-.01 3.243l-8.5 5.5a2 2 0 0 1-2.14 0l-8.5-5.5a2 2 0 0 1-.01-3.243l8.5-5.32a2 2 0 0 1 2.15 0l8.5 5.32z" />
    <path d="M22 10v6" />
    <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
  </svg>
);

export default function Experience() {
  const { experience, education } = portfolioData;

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <section id="experience" className="py-20 lg:py-28 relative">
      <div className="flex flex-col items-center justify-center mb-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Experience & Education
        </h2>
        <div className="w-20 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 relative">
        {/* Work Experience */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
              <BriefcaseIcon className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Professional Experience</h3>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 dark:before:via-gray-800 before:to-transparent"
          >
            {experience.map((exp, idx) => (
              <motion.div key={idx} variants={itemVariants} className="relative pl-12 md:pl-10">
                {/* Timeline Dot */}
                <div className="absolute left-3.5 md:left-2 top-1.5 w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-white dark:ring-gray-950 shadow-sm" />
                
                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                  <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 block mb-1">
                    {exp.duration}
                  </span>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">{exp.role}</h4>
                  <span className="text-sm text-gray-500 dark:text-gray-400 block mb-4">{exp.company} • {exp.location}</span>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    {exp.responsibilities.map((task, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-indigo-500 mt-0.5">•</span>
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Education */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
              <GraduationCapIcon className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Education</h3>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 dark:before:via-gray-800 before:to-transparent"
          >
            {education.map((edu, idx) => (
              <motion.div key={idx} variants={itemVariants} className="relative pl-12 md:pl-10">
                {/* Timeline Dot */}
                <div className="absolute left-3.5 md:left-2 top-1.5 w-3 h-3 rounded-full bg-purple-600 ring-4 ring-white dark:ring-gray-950 shadow-sm" />
                
                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white leading-snug mb-1">{edu.degree}</h4>
                  <span className="text-sm text-gray-500 dark:text-gray-400 block mb-3">{edu.institution}</span>
                  <div className="inline-block px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-300">
                    {edu.score}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
