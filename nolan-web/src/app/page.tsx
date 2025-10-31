// src/app/page.tsx

import Hero from "../components/Hero";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import Experience from "../components/Experience";
import RunbookSimulator from "../components/RunbookSimulator";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

export default function Page() {
  return (
    <>
      <Hero />
      <div className="section-divider" />

      <Skills />
      <div className="section-divider" />

      <Projects />
      <div className="section-divider" />

      {/* ✅ Le simulateur */}
      <RunbookSimulator />
      <div className="section-divider" />

      <Experience />
      <div className="section-divider" />

      <Contact />
      <Footer />
    </>
  );
}
