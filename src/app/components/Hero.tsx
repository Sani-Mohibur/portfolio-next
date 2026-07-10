"use client";

import { motion, Variants } from "framer-motion";
import { portfolioData } from "../lib/portfolio-data";
import {
  GithubIcon as Github,
  LinkedinIcon as Linkedin,
  DownloadIcon as Download,
  MailIcon as Mail,
  TerminalIcon as Terminal,
  DatabaseIcon as Database,
  ServerIcon as Server,
} from "./icons";
import { useEffect } from "react";
import Image from "next/image";

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
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  useEffect(() => {
    console.log(window.innerWidth, window.innerHeight);
  }, []);

  return (
    <section
      id="hero"
      className="select-none relative min-h-0 flex items-center pt-48 lg:pt-64 pb-24 lg:pb-32 overflow-visible"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden"></div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center z-10">
        {/* Left Content */}
        <motion.div
          className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-gray-900 dark:text-white"
          >
            Hi, I'm{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
              {personal.name.split(" ")[0]}
            </span>{" "}
            <br className="hidden sm:block" />
            <span className="text-3xl sm:text-4xl lg:text-5xl text-gray-700 dark:text-gray-300 mt-2 block">
              {personal.title}
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl leading-relaxed"
          >
            {/* {personal.tagline} <br className="hidden sm:block" /> */}
            {personal.intro}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center lg:justify-start gap-4 mb-10"
          >
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
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-white font-medium border border-gray-200 dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-750 dark:hover:text-black transition-colors"
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
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center lg:items-start gap-3 w-full"
          >
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Tech Stack
            </span>
            <div className="flex flex-wrap justify-center lg:justify-start gap-3">
              {[
                { name: "Next.js", icon: <Terminal size={14} /> },
                { name: "TypeScript", icon: <Terminal size={14} /> },
                { name: "Node.js", icon: <Server size={14} /> },
                { name: "PostgreSQL", icon: <Database size={14} /> },
              ].map((tech) => (
                <div
                  key={tech.name}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 shadow-sm"
                >
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
          {/* The actual glow - Using absolute positioning within the padded area */}
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-full blur-3xl opacity-30 animate-pulse" />

          {/* The Image - Squircle shape maintained */}
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-[3rem] overflow-hidden border-4 border-white dark:border-gray-800 shadow-[var(--shadow-premium)] dark:shadow-[var(--shadow-premium-dark)]">
            <Image
              src="/profile-placeholder.webp"
              fill
              priority
              alt={personal.name}
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
