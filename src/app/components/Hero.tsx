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
  MouseIcon,
  ChevronDownIcon,
} from "./icons";
import { useEffect, useState, useRef } from "react";
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

  const [isAtTop, setIsAtTop] = useState(true);
  const [fitsViewport, setFitsViewport] = useState(true);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY < 50);
    };

    const checkFit = () => {
      if (heroRef.current) {
        // If the scrollHeight is significantly larger than innerHeight, it's overflowing
        // We use a small tolerance (e.g., 50px) to account for mobile browser UI quirks
        setFitsViewport(heroRef.current.scrollHeight <= window.innerHeight + 50);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", checkFit);
    
    // Initial check
    handleScroll();
    // Allow a small delay for layout to settle before checking fit
    const timeout = setTimeout(checkFit, 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkFit);
      clearTimeout(timeout);
    };
  }, []);

  const showIndicator = isAtTop && fitsViewport;

  return (
    <section
      id="hero"
      ref={heroRef}
      className="select-none relative min-h-[100dvh] flex flex-col justify-center pt-32 sm:pt-28 lg:pt-24 pb-20 sm:pb-24 lg:pb-32 overflow-visible"
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

        {/* Right Image — Premium Effects */}
        <motion.div
          className="lg:col-span-5 flex justify-center mt-12 lg:mt-0 relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96">
            {/* Premium Breathing Glow */}
            <div className="absolute inset-0 rounded-full bg-indigo-500/15 dark:bg-indigo-400/15 blur-2xl animate-[premium-glow_4.5s_ease-in-out_infinite] transition-colors duration-700 pointer-events-none" />

            {/* Ripple Ring Animation */}
            <div className="absolute inset-0 rounded-full border border-indigo-400/30 dark:border-indigo-300/30 animate-[premium-ripple_4s_cubic-bezier(0.0,0.2,0.8,1)_infinite] pointer-events-none" />

            <div className="absolute inset-0 rounded-full border border-indigo-400/30 dark:border-indigo-300/30 animate-[premium-ripple_4s_cubic-bezier(0.0,0.2,0.8,1)_infinite] [animation-delay:2s] pointer-events-none" />

            {/* Image Wrapper */}
            <div className="relative w-full h-full z-10">
              {/* Your image container (UNCHANGED) */}
              <div className="bg-stone-200 dark:bg-[#0d1117]/80 relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-[var(--shadow-premium)] dark:shadow-[var(--shadow-premium-dark)]">
                <Image
                  src="/profile/me-transparent.png"
                  fill
                  sizes="(max-width: 640px) 18rem, (max-width: 768px) 20rem, 24rem"
                  priority
                  alt={personal.name}
                  className="w-full h-full object-cover brightness-[1] dark:brightness-[.6] contrast-[1] dark:contrast-[1.2] absolute inset-0"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Premium Scroll Indicator */}
      <motion.div
        className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center transition-opacity duration-500 ${showIndicator ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: showIndicator ? 1 : 0, y: showIndicator ? 0 : 10 }}
        transition={{ duration: 0.5, delay: showIndicator ? 1.2 : 0, ease: "easeOut" }}
      >
        <a
          href="#about"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="flex flex-col items-center gap-2 text-gray-400 hover:text-indigo-600 dark:text-gray-500 dark:hover:text-indigo-400 transition-colors group"
          aria-label="Scroll to About section"
        >
          <span className="text-[10px] font-semibold uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">Scroll</span>
          <motion.div 
            className="p-2 rounded-full border border-gray-200 dark:border-gray-800 shadow-sm bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm group-hover:border-indigo-500/30 dark:group-hover:border-indigo-400/30 transition-all"
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
             <ChevronDownIcon size={18} />
          </motion.div>
        </a>
      </motion.div>
    </section>
  );
}
