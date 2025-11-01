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
      {/* Barre de progression de scroll, si tu l’utilises */}

      <Hero />
      <Skills />
      <Projects />
      <Experience />
      <RunbookSimulator />
      <Contact />
      <Footer />
    </>
  );
}
