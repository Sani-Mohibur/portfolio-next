// "use client";

// import React from "react";
// import { motion } from "framer-motion";

// const SparklesIcon = (props: React.SVGProps<SVGSVGElement>) => (
//   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
//     <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
//     <path d="M20 3v4" />
//     <path d="M22 5h-4" />
//     <path d="M4 17v2" />
//     <path d="M5 18H3" />
//   </svg>
// );

// export default function AIPromo() {
//   const handleOpenChat = () => {
//     window.dispatchEvent(new Event("open-ai-chat"));
//   };

//   return (
//     <section className="py-12 lg:py-16 relative overflow-hidden">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true, margin: "-50px" }}
//         className="max-w-4xl mx-auto px-6"
//       >
//         <div className="relative rounded-3xl overflow-hidden shadow-[var(--shadow-premium)] dark:shadow-[var(--shadow-premium-dark)]">
//           {/* Animated Gradient Background */}
//           <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-900 opacity-100" />
          
//           {/* Glass Overlay */}
//           <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />

//           <div className="relative z-10 p-10 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
//             <div className="space-y-4 max-w-xl">
//               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-sm font-semibold tracking-wide border border-white/30 backdrop-blur-md shadow-sm">
//                 <SparklesIcon className="w-4 h-4 text-yellow-300" />
//                 <span>Powered by AI</span>
//               </div>
//               <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
//                 Have questions about my profile?
//               </h2>
//               <p className="text-indigo-100 text-lg">
//                 I've integrated an intelligent AI Assistant that knows everything about my experience, skills, and projects. Chat with it right now!
//               </p>
//             </div>

//             <button
//               onClick={handleOpenChat}
//               className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-indigo-600 font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex-shrink-0"
//             >
//               <span>Try it out</span>
//               <svg 
//                 className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
//                 fill="none" 
//                 stroke="currentColor" 
//                 viewBox="0 0 24 24"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
//               </svg>
//               {/* Pulse effect on button */}
//               <span className="absolute -inset-1 rounded-2xl border border-white/50 animate-ping opacity-20 pointer-events-none" />
//             </button>
//           </div>
//         </div>
//       </motion.div>
//     </section>
//   );
// }
