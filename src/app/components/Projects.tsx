"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { portfolioData } from "../lib/portfolio-data";
import { GithubIcon } from "./icons";

// SVG for external link (Live Demo)
const ExternalLinkIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" x2="21" y1="14" y2="3" />
  </svg>
);

const ProjectCard = ({ project, index }: { project: any; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(!project.image);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-[var(--shadow-premium)] dark:shadow-[var(--shadow-premium-dark)] border border-gray-100 dark:border-gray-800 flex flex-col h-full transition-shadow duration-300 hover:shadow-2xl hover:shadow-indigo-500/20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full h-[240px] sm:h-[300px] overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center group">
        {!imageError ? (
          <img
            src={project.image}
            alt={`${project.title} application interface`}
            onError={() => setImageError(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out ${isHovered ? "scale-110" : "scale-100"
              }`}
          />
        ) : (
          <div className="p-6 text-center w-full">
            <h3 className="text-3xl font-extrabold text-gray-400 dark:text-gray-500 tracking-wide">
              {project.title}
            </h3>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 sm:p-8 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300 group-hover:text-indigo-500">
          {project.title}
        </h3>

        <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3">
          {project.description}
        </p>

        {/* Glassmorphism Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-8 mt-auto">
          {project.technologies.map((tech: string, i: number) => (
            <span
              key={i}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-gray-50/80 dark:bg-white/5 backdrop-blur-md text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-white/10 shadow-sm"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex justify-center items-center gap-2 py-2.5 rounded-xl bg-gray-900/90 dark:bg-white/90 backdrop-blur-sm text-white dark:text-gray-900 font-medium hover:bg-indigo-600 dark:hover:bg-indigo-50 transition-all shadow-lg hover:shadow-indigo-500/30"
            >
              <ExternalLinkIcon className="w-4 h-4" />
              Live Demo
            </a>
          )}

          {(project.githubFrontend || project.githubBackend) && (
            <a
              href={project.githubFrontend || project.githubBackend}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex justify-center items-center gap-2 py-2.5 rounded-xl border border-gray-200/50 dark:border-white/10 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              <GithubIcon className="w-4 h-4" />
              Source Code
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default function Projects() {
  const { projects } = portfolioData;
  const [visibleCount, setVisibleCount] = useState(2); // Show 2 initially

  const visibleProjects = projects.slice(0, visibleCount);
  const hasMore = visibleCount < projects.length;

  return (
    <section id="projects" className="select-none py-20 lg:py-28 relative">
      <div className="flex flex-col items-center justify-center mb-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Featured Projects
        </h2>
        <div className="w-20 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full" />
      </div>

      {/* Restored 2-column grid and added max-w-6xl for better PC centering */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
        <AnimatePresence mode="popLayout">
          {visibleProjects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </AnimatePresence>
      </div>

      {hasMore && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center mt-12"
        >
          <button
            onClick={() => setVisibleCount((prev) => Math.min(prev + 2, projects.length))}
            className="cursor-pointer px-8 py-3 rounded-xl bg-white dark:bg-gray-900 border-2 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors shadow-sm"
          >
            Load More Projects
          </button>
        </motion.div>
      )}
    </section>
  );
}