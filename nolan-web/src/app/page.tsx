import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import Experience from "../components/Experience";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <div className="section-divider mx-auto max-w-5xl px-6 my-12 md:my-16" />
        <About />
        <div className="section-divider mx-auto max-w-5xl px-6 my-12 md:my-16" />
        <Skills />
        <div className="section-divider mx-auto max-w-5xl px-6 my-12 md:my-16" />
        <Projects />
        <div className="section-divider mx-auto max-w-5xl px-6 my-12 md:my-16" />
        <Experience />
        <div className="section-divider mx-auto max-w-5xl px-6 my-12 md:my-16" />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
