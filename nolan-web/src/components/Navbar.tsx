"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

type Item = { id: string; label: string };

const NAV_ITEMS: Item[] = [
  { id: "home",       label: "Accueil" },
  { id: "about",      label: "À propos" },
  { id: "skills",     label: "Compétences" },
  { id: "projects",   label: "Projets" },
  { id: "experience", label: "Expérience" },
  { id: "runbooks",    label: "Runbook" },            // ⬅️ ajouté
  { id: "contact",    label: "Contact" },
];

export default function Navbar() {
  const [active, setActive] = useState<string>("home");

  // refs pour calculer la position/largeur de l’onglet actif
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [pill, setPill] = useState<{ left: number; width: number }>({
    left: 0,
    width: 0,
  });

  // met à jour la “pill” quand l’onglet actif change ou au resize
  useEffect(() => {
    const el = btnRefs.current[active];
    if (!el) return;
    const update = () =>
      setPill({ left: el.offsetLeft, width: el.offsetWidth });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
      ro.disconnect();
    };
  }, [active]);

  // scroll-spy: change l’onglet actif en fonction des sections visibles
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActive(e.target.id);
          }
        }
      },
      {
        // déclenche quand ~le milieu de la section est dans la fenêtre
        rootMargin: "-45% 0px -45% 0px",
        threshold: 0.01,
      }
    );

    NAV_ITEMS.forEach(({ id }) => {
      const sec = document.getElementById(id);
      if (sec) obs.observe(sec);
    });

    return () => obs.disconnect();
  }, []);

  const onClick = (id: string) => {
    const sec = document.getElementById(id);
    if (sec) sec.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="fixed inset-x-0 top-4 z-50 flex justify-center">
      <nav
        className="
          relative inline-flex items-center gap-1
          rounded-full border border-white/10 bg-white/5 px-1 py-1
          backdrop-blur shadow-sm shadow-black/20
        "
        aria-label="Navigation principale"
      >
        {/* pill animée sous l’onglet actif */}
        <motion.span
          className="absolute top-1 bottom-1 rounded-full bg-white/10"
          animate={{ left: pill.left, width: pill.width }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
          aria-hidden
        />

        {NAV_ITEMS.map(({ id, label }) => (
          <button
            key={id}
            ref={(el) => (btnRefs.current[id] = el)}
            onClick={() => onClick(id)}
            className={`
              relative z-10 rounded-full px-3.5 py-2 text-sm
              text-neutral-200 hover:text-white
              transition-colors
              ${active === id ? "font-medium" : "font-normal"}
            `}
            aria-current={active === id ? "page" : undefined}
          >
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}
