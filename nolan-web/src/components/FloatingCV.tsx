"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";

export default function FloatingCV() {
  // On masque le bouton tout en haut et tout en bas (footer)
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const h = document.body.scrollHeight - window.innerHeight;

      // caché sur les 8% supérieurs et inférieurs
      const nearTop = y < window.innerHeight * 0.08;
      const nearBottom = y > h - window.innerHeight * 0.12;
      setVisible(!(nearTop || nearBottom));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.a
      href="/cv.pdf"                  // place ton CV ici: public/cv.pdf
      download
      aria-label="Télécharger mon CV (PDF)"
      className="
        fixed left-3 top-1/3 -translate-y-1/2 z-40
        inline-flex h-12 w-12 items-center justify-center
        rounded-xl border border-white/10
        bg-neutral-900/55 backdrop-blur
        ring-1 ring-white/10
        hover:bg-neutral-800/70
      "
      initial={{ x: -12, opacity: 0 }}
      animate={{ x: 0, opacity: visible ? 1 : 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      title="Télécharger mon CV"
    >
      {/* halo discret pour l’intuitif au survol */}
      <span className="pointer-events-none absolute inset-0 rounded-xl bg-primary/15 opacity-0 blur-[6px] transition-opacity duration-300 hover:opacity-100" />
      <Download size={18} className="text-primary" />
    </motion.a>
  );
}
