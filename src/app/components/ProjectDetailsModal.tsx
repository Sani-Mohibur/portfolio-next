"use client";

import React, { useEffect, useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { GithubIcon } from "./icons";
import Image from "next/image";

import { X, Check, ExternalLink, ChevronDown, Zap, Target, Wrench, Lightbulb, Layers, Image as ImageIcon } from "lucide-react";

/* ─── Project Details Modal ─── */
const ProjectDetailsModal = ({
  project,
  isOpen,
  onClose,
}: {
  project: any;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [showDeepDive, setShowDeepDive] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) setShowDeepDive(false);
  }, [isOpen, project]);

  useEffect(() => {
    const header = document.querySelector("header") as HTMLElement | null;
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (header) {
        header.style.transition = "transform 0.35s ease-in-out, opacity 0.35s ease-in-out";
        header.style.setProperty("transform", "translateY(-110%)", "important");
        header.style.opacity = "0";
        header.style.pointerEvents = "none";
      }
    } else {
      document.body.style.overflow = "";
      if (header) {
        header.style.transition = "transform 0.35s ease-in-out, opacity 0.35s ease-in-out";
        header.style.removeProperty("transform");
        header.style.opacity = "";
        header.style.pointerEvents = "";
      }
    }
    return () => {
      document.body.style.overflow = "";
      if (header) {
        header.style.removeProperty("transform");
        header.style.opacity = "";
        header.style.pointerEvents = "";
      }
    };
  }, [isOpen]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      setTimeout(() => modalRef.current?.focus(), 100);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  if (!mounted) return null;
  if (!project) return null;

  const hasAuth = project.technologies.some(
    (t: string) => t.toLowerCase().includes("auth") || t.toLowerCase().includes("jwt"),
  );

  const deepDiveData = {
    brief: project.brief || "A comprehensive deep dive into the architecture, challenges, and goals of this project.",
    whyBuilt: project.whyBuilt || "This project was built to address the growing need for scalable, user-centric solutions in this space. It serves as a testament to solving complex problems through elegant engineering.",
    targetUsers: project.targetUsers || "Designed for modern digital users, administrators, and developers who require a seamless, high-performance experience without compromising on security or usability.",
    challenges: project.challenges || "One of the main challenges was architecting a system that could handle complex state and real-time updates while maintaining a buttery-smooth user interface.",
    futurePlans: project.futurePlans || "Future iterations will introduce AI-driven analytics, deeper third-party integrations, and enhanced accessibility features to broaden the platform's reach.",
    gallery: project.gallery || (project.image ? [project.image] : [])
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 lg:p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 dark:bg-black/75"
            style={{ backgroundImage: "radial-gradient(circle at 30% 30%, rgba(100,80,255,0.15), rgba(0,0,0,0.6))" }}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${project.title} project details`}
            tabIndex={-1}
            className="relative w-full max-w-5xl max-h-[75vh] flex flex-col rounded-2xl sm:rounded-[2rem] bg-white dark:bg-[#0d1117] border border-gray-200/70 dark:border-gray-800/80 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.25)] dark:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.7)] outline-none overflow-hidden"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative shrink-0 px-6 sm:px-8 pt-8 pb-6 bg-gradient-to-br from-indigo-50 via-white to-purple-50/50 dark:from-indigo-950/40 dark:via-[#0d1117] dark:to-purple-950/20 border-b border-gray-100 dark:border-gray-800/60">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-indigo-400/10 to-transparent rounded-bl-full pointer-events-none" />
              <button onClick={onClose} aria-label="Close modal" className="cursor-pointer absolute top-4 right-4 p-2 rounded-xl text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-150">
                <X className="w-5 h-5" />
              </button>
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-gray-200 dark:bg-gray-700 sm:hidden" />
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Completed
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-500/20">
                  Responsive
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 pr-8 leading-tight">{project.title}</h2>
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl">{project.description}</p>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1 px-6 sm:px-8 py-6 space-y-6" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(156,163,175,0.2) transparent" }}>
              {/* Key Features */}
              {project.features?.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">Key Features</p>
                  <div className="space-y-2">
                    {project.features.map((feat: string, i: number) => (
                      <div key={i} className="group flex items-start gap-3 p-3.5 rounded-xl bg-gray-50 dark:bg-white/[0.025] border border-gray-100 dark:border-gray-800/50 hover:border-indigo-200 dark:hover:border-indigo-500/25 transition-colors duration-200">
                        <span className="mt-0.5 shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow shadow-indigo-500/30">
                          <Check className="w-3 h-3 text-white" />
                        </span>
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{feat}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Technologies */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">Technologies</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech: string, i: number) => (
                    <span key={i} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white dark:bg-white/5 text-gray-700 dark:text-gray-300 border border-gray-200/80 dark:border-gray-700/60 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-500/40 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-150 cursor-default select-none">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Deep Dive Toggle & Content */}
              <div className="pt-6 border-t border-gray-100 dark:border-gray-800/60">
                <button
                  onClick={() => setShowDeepDive(!showDeepDive)}
                  className="cursor-pointer group w-full flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-500/[0.02] dark:to-purple-500/[0.02] border border-indigo-100/50 dark:border-indigo-500/10 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-base font-bold text-gray-900 dark:text-white">Project Deep Dive</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Explore the architecture, challenges, and goals</p>
                    </div>
                  </div>
                  <div className={`w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center transition-transform duration-500 ${showDeepDive ? "rotate-180" : ""}`}>
                    <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </div>
                </button>

                <AnimatePresence>
                  {showDeepDive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pt-6 pb-2 space-y-6">
                        <div className="p-5 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-gray-800/50">
                          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed italic border-l-2 border-indigo-500 pl-4">{deepDiveData.brief}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                          <div className="p-5 rounded-2xl bg-white dark:bg-[#0d1117] border border-gray-100 dark:border-gray-800/60 shadow-sm">
                            <div className="flex items-center gap-2.5 mb-3">
                              <Zap className="w-4 h-4 text-amber-500" />
                              <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Why Built</h4>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{deepDiveData.whyBuilt}</p>
                          </div>
                          <div className="p-5 rounded-2xl bg-white dark:bg-[#0d1117] border border-gray-100 dark:border-gray-800/60 shadow-sm">
                            <div className="flex items-center gap-2.5 mb-3">
                              <Target className="w-4 h-4 text-emerald-500" />
                              <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Target Users</h4>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{deepDiveData.targetUsers}</p>
                          </div>
                          <div className="p-5 rounded-2xl bg-white dark:bg-[#0d1117] border border-gray-100 dark:border-gray-800/60 shadow-sm">
                            <div className="flex items-center gap-2.5 mb-3">
                              <Wrench className="w-4 h-4 text-rose-500" />
                              <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Challenges</h4>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{deepDiveData.challenges}</p>
                          </div>
                          <div className="p-5 rounded-2xl bg-white dark:bg-[#0d1117] border border-gray-100 dark:border-gray-800/60 shadow-sm">
                            <div className="flex items-center gap-2.5 mb-3">
                              <Lightbulb className="w-4 h-4 text-blue-500" />
                              <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Future Plans</h4>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{deepDiveData.futurePlans}</p>
                          </div>
                        </div>

                        {deepDiveData.gallery.length > 0 && (
                          <div className="pt-2">
                            <div className="flex items-center gap-2.5 mb-4">
                              <ImageIcon className="w-4 h-4 text-indigo-500" />
                              <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Gallery</h4>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                              {deepDiveData.gallery.map((img: string, idx: number) => (
                                <div key={idx} className="relative w-full aspect-video rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm">
                                  <Image src={img} alt={`${project.title} screenshot ${idx + 1}`} fill sizes="(max-width: 1024px) 100vw, 1024px" loading="lazy" className="object-cover hover:scale-105 transition-transform duration-700" />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Footer */}
            <div className="shrink-0 px-6 sm:px-8 py-4 border-t border-gray-100 dark:border-gray-800/60 bg-gray-50/80 dark:bg-white/[0.015] backdrop-blur-sm flex flex-wrap items-center gap-3">
              {project.live && (
                <a href={project.live} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-px transition-all duration-200">
                  <ExternalLink className="w-3.5 h-3.5" />
                  Live Demo
                </a>
              )}
              {project.githubFrontend && (
                <a href={project.githubFrontend} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 shadow-sm">
                  <GithubIcon className="w-4 h-4" />
                  Frontend
                </a>
              )}
              {project.githubBackend && (
                <a href={project.githubBackend} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 shadow-sm">
                  <GithubIcon className="w-4 h-4" />
                  Backend
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ProjectDetailsModal;
