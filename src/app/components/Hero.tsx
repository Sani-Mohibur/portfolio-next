"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { portfolioData } from "../lib/portfolio-data";
import { GithubIcon as Github, LinkedinIcon as Linkedin, DownloadIcon as Download, MailIcon as Mail, TerminalIcon as Terminal, DatabaseIcon as Database, ServerIcon as Server } from "./icons";

export default function Hero() {
  const { personal, contact, resume } = portfolioData;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <section id="hero" className="relative min-h-[calc(100vh-80px)] flex items-center pt-12 pb-24 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.2, 0.3] 
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -right-20 w-96 h-96 bg-indigo-500/20 dark:bg-indigo-600/20 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2] 
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-32 -left-32 w-[30rem] h-[30rem] bg-purple-500/20 dark:bg-purple-600/20 rounded-full blur-3xl"
        />
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center z-10">
        {/* Left Content */}
        <motion.div 
          className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="inline-block mb-4 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/50">
            <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
              Available for new opportunities
            </span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-gray-900 dark:text-white">
            Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">{personal.name.split(' ')[0]}</span> <br className="hidden sm:block" />
            <span className="text-3xl sm:text-4xl lg:text-5xl text-gray-700 dark:text-gray-300 mt-2 block">
              {personal.title}
            </span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl leading-relaxed">
            {personal.tagline} <br className="hidden sm:block" />
            {personal.intro}
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap justify-center lg:justify-start gap-4 mb-10">
            <a 
              href={resume.downloadUrl}
              download={resume.downloadName}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-[var(--shadow-premium)] hover:shadow-[var(--shadow-premium-hover)] transform transition-all hover:-translate-y-1"
            >
              <Download size={18} />
              Download CV
            </a>
            <a 
              href="#contact"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-white font-medium border border-gray-200 dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
            >
              <Mail size={18} />
              Contact Me
            </a>
            <div className="flex items-center gap-3 ml-2">
              <a 
                href={contact.github} 
                target="_blank" 
                rel="noreferrer"
                className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a 
                href={contact.linkedin} 
                target="_blank" 
                rel="noreferrer"
                className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </motion.div>

          {/* Tech Badges */}
          <motion.div variants={itemVariants} className="flex flex-col items-center lg:items-start gap-3 w-full">
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Tech Stack</span>
            <div className="flex flex-wrap justify-center lg:justify-start gap-3">
              {[
                { name: "Next.js", icon: <Terminal size={14} /> },
                { name: "TypeScript", icon: <Terminal size={14} /> },
                { name: "Node.js", icon: <Server size={14} /> },
                { name: "PostgreSQL", icon: <Database size={14} /> },
              ].map((tech) => (
                <div key={tech.name} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 shadow-sm">
                  <span className="text-indigo-500">{tech.icon}</span>
                  {tech.name}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Right Image */}
        <motion.div 
          className="lg:col-span-5 flex justify-center mt-12 lg:mt-0 relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          {/* Decorative ring */}
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-full blur-xl opacity-30 animate-pulse" />
          
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-[var(--shadow-premium)] dark:shadow-[var(--shadow-premium-dark)]">
            <img 
              src="/profile-placeholder.webp" 
              alt={personal.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback if the user hasn't added the image yet
                e.currentTarget.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600&h=600";
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
