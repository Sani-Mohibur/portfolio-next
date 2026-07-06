"use client";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Resume from "./components/Resume";
import Contact from "./components/Contact";
import FadeInSection from "./components/FadeInSection";
import Footer from "./components/Footer";
import { ThemeProvider } from "./components/ThemeContext";
import ChatButton from "./components/chat/ChatButton";
import BackToTop from "./components/BackToTop";

export default function Home() {
  return (
    <ThemeProvider>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6">
        <Hero />
        <FadeInSection>
          <About />
        </FadeInSection>
        <FadeInSection>
          <Skills />
        </FadeInSection>
        <FadeInSection>
          <Projects />
        </FadeInSection>
        <FadeInSection>
          <Resume />
        </FadeInSection>
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
