"use client";

import { motion, Variants } from "framer-motion";
import { portfolioData } from "../lib/portfolio-data";
import { Briefcase, GraduationCap, Calendar, MapPin } from "lucide-react";

export default function Experience() {
    const { experience, education } = portfolioData;

    const containerVariants: Variants = {
        hidden: {},
        visible: {
            transition: { staggerChildren: 0.15 },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    };

    return (
        <section id="experience" className=" select-none py-16 lg:py-20 relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-center mb-16 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Experience & Education
                        </h2>
                        <div className="w-24 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto" />
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-6 relative">
                    {/* Work Experience */}
                    <div>
                        <div className="flex items-center gap-4 mb-10">
                            <div className="p-3 rounded-2xl bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-200 dark:ring-indigo-500/20 shadow-sm">
                                <Briefcase className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Professional Experience</h3>
                        </div>

                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                            className="space-y-10 relative before:absolute before:inset-0 before:ml-[1.125rem] before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-500/50 before:via-gray-200 dark:before:via-gray-800 before:to-transparent"
                        >
                            {experience.map((exp, idx) => (
                                <motion.div key={idx} variants={itemVariants} className="relative pl-12 group">
                                    {/* Glowing Timeline Dot */}
                                    <div className="absolute left-[0.5625rem] top-2 w-4 h-4 rounded-full bg-white dark:bg-gray-950 border-4 border-indigo-500 ring-4 ring-white dark:ring-gray-950 shadow-sm group-hover:scale-125 group-hover:border-indigo-400 transition-transform duration-300 z-10" />

                                    <div className="bg-white/60 dark:bg-gray-900/40 backdrop-blur-xl p-6 md:p-8 rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-800/50 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300">
                                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{exp.role}</h4>
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
                                            <span className="font-semibold text-indigo-600 dark:text-indigo-400">{exp.company}</span>
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-4 h-4" />
                                                <span>{exp.duration}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="w-4 h-4" />
                                                <span>{exp.location || "Dhaka, Bangladesh"}</span>
                                            </div>
                                        </div>
                                        <ul className="space-y-3 text-gray-600 dark:text-gray-300 text-sm md:text-base">
                                            {exp.responsibilities.map((task, i) => (
                                                <li key={i} className="flex gap-3 leading-relaxed">
                                                    <span className="text-indigo-500 mt-1 shrink-0">◆</span>
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
                        <div className="flex items-center gap-4 mb-10">
                            <div className="p-3 rounded-2xl bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 ring-1 ring-purple-200 dark:ring-purple-500/20 shadow-sm">
                                <GraduationCap className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Education</h3>
                        </div>

                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                            className="space-y-6 relative before:absolute before:inset-0 before:ml-[1.125rem] before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-purple-500/50 before:via-gray-200 dark:before:via-gray-800 before:to-transparent"
                        >
                            {education.map((edu, idx) => (
                                <motion.div key={idx} variants={itemVariants} className="relative pl-12 group">
                                    {/* Glowing Timeline Dot */}
                                    <div className="absolute left-[0.5625rem] top-2 w-4 h-4 rounded-full bg-white dark:bg-gray-950 border-4 border-purple-500 ring-4 ring-white dark:ring-gray-950 shadow-sm group-hover:scale-125 group-hover:border-purple-400 transition-transform duration-300 z-10" />

                                    <div className="bg-white/60 dark:bg-gray-900/40 backdrop-blur-xl p-6 md:p-8 rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-800/50 hover:shadow-xl hover:shadow-purple-500/5 hover:-translate-y-1 transition-all duration-300">
                                        <h4 className="text-xl font-bold text-gray-900 dark:text-white leading-snug mb-3">{edu.degree}</h4>
                                        <div className="flex flex-wrap items-center gap-4">
                                            <span className="text-base font-medium text-gray-700 dark:text-gray-300">{edu.institution}</span>
                                            <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                                                <MapPin className="w-4 h-4" />
                                                <span>Dhaka, Bangladesh</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
