"use client";

import dynamic from "next/dynamic";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
// import Experience from "./components/Experience";
import Projects from "./components/Projects";
// import Resume from "./components/Resume";
import Contact from "./components/Contact";
// import AIPromo from "./components/AIPromo";
import FadeInSection from "./components/FadeInSection";
import Footer from "./components/Footer";
import { ThemeProvider } from "./components/ThemeContext";
import ChatButton from "./components/chat/ChatButton";
import BackToTop from "./components/BackToTop";

// Dynamic import to avoid SSR for WebGL (three.js is client-only)
const SpaceBackground = dynamic(
  () => import("./components/SpaceBackground"),
  { ssr: false }
);

export default function Home() {
  return (
    <ThemeProvider>
      <SpaceBackground />
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6">
        <Hero />
        <FadeInSection>
          <About />
        </FadeInSection>
        <FadeInSection>
          <Skills />
        </FadeInSection>
        {/* <FadeInSection>
          <Experience />
        </FadeInSection> */}
        <FadeInSection>
          <Projects />
        </FadeInSection>
        {/* <FadeInSection>
          <Resume />
        </FadeInSection> */}
        {/* <FadeInSection>
          <AIPromo />
        </FadeInSection> */}
        <FadeInSection>
          <Contact />
        </FadeInSection>
      </main>
      <Footer />
      <ChatButton />
      <BackToTop />
    </ThemeProvider>
  );
}
