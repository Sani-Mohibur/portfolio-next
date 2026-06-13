"use client";

import Navbar from "./components/Navbar";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Resume from "./components/Resume";
import Contact from "./components/Contact";
import FadeInSection from "./components/FadeInSection";
import Footer from "./components/Footer";
import { ThemeProvider } from "./components/ThemeContext";

export default function Home() {
  return (
    <ThemeProvider>
      <Navbar />
      <main className="max-w-5xl mx-auto p-4">
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
    </ThemeProvider>
  );
}
