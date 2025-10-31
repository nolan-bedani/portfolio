"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

type SectionId = "home" | "about" | "skills" | "projects" | "experience" | "contact";
const NAV = [
  { id: "home", label: "Accueil" },
  { id: "about", label: "À propos" },
  { id: "skills", label: "Compétences" },
  { id: "projects", label: "Projets" },
  { id: "experience", label: "Expérience" },
  { id: "contact", label: "Contact" },
] as const;

export default function Navbar() {
  const [active, setActive] = useState<SectionId>("home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [indicator, setIndicator] = useState({ left: 6, width: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const { scrollYProgress } = useScroll();
const scrollSpring = useSpring(scrollYProgress, { stiffness: 260, damping: 30, mass: 0.4 });

  

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    onScroll(); window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV.map(n => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver((entries) => {
      const vis = entries.filter(e => e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if (vis?.target?.id) setActive(vis.target.id as SectionId);
    }, { rootMargin: "0px 0px -60% 0px", threshold: [0.1, 0.3, 0.6] });
    sections.forEach(s => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  const pos = () => {
    const el = itemRefs.current[active]; const wrap = containerRef.current;
    if (!el || !wrap) return;
    const r = el.getBoundingClientRect(), w = wrap.getBoundingClientRect();
    setIndicator({ left: r.left - w.left, width: r.width });
  };
  useEffect(() => { pos(); const on = () => pos(); window.addEventListener("resize", on); return () => window.removeEventListener("resize", on); }, [active]);

  const go = (id: SectionId) => (e: React.MouseEvent) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setActive(id); };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <a href="#content" className="sr-only focus:not-sr-only absolute -left-20 top-0 rounded bg-neutral-900 px-3 py-2">Aller au contenu</a>
      <div ref={containerRef} className={`relative flex items-center gap-1 rounded-full border px-2 py-1
        ${isScrolled ? "bg-neutral-900/70 border-neutral-800 backdrop-blur-md shadow-lg shadow-black/30" : "bg-neutral-900/50 border-neutral-900 backdrop-blur-sm"}`}>
        {/* slider */}
        <motion.span className="absolute top-1 bottom-1 rounded-full bg-primary/15 border border-primary/30"
          animate={{ left: indicator.left, width: indicator.width }} transition={{ type: "spring", stiffness: 420, damping: 32 }} />
        {/* items */}
        {NAV.map(n => (
          <a key={n.id} href={`#${n.id}`} ref={el => (itemRefs.current[n.id] = el)} onClick={go(n.id)}
             className={`relative z-10 px-3 py-2 rounded-full text-sm ${active===n.id?"text-white":"text-neutral-400 hover:text-neutral-200"}`}>
            {n.label}
          </a>
        ))}
        {/* fine progress bar en bas de la pill */}
        <motion.span
  className="absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-primary/40 origin-left"
  style={{ scaleX: scrollSpring }}
/>
      </div>
    </div>
  );
}
