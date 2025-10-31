"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Download } from "lucide-react";

type Props = {
  file?: string;
  showAfter?: number; // px de scroll avant affichage
};

export default function FloatingCV({
  file = "/images/CV_Nolan_Bedani_Alternance.pdf",
  showAfter = 140,
}: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > showAfter);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [showAfter]);

  // Parallax léger (flotte avec le scroll)
  const { scrollYProgress } = useScroll();
  const floatY = useTransform(scrollYProgress, [0, 1], [0, -24]);

  const EASE: any = [0.22, 1, 0.36, 1];

  return (
    <>
      {/* =============== Desktop / Tablet (gauche) =============== */}
      <motion.div
        className="fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 sm:flex"
        style={{ y: floatY }}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : -10 }}
        transition={{ duration: 0.35, ease: EASE }}
      >
        <div className="relative">
          {/* halo/pulse doux derrière */}
          <motion.span
            className="pointer-events-none absolute -inset-2 -z-10 rounded-full"
            animate={{ opacity: [0.25, 0.45, 0.25], scale: [0.98, 1.02, 0.98] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            style={{
              background:
                "radial-gradient(20rem 12rem at 20% 50%, rgba(170,184,255,.15), transparent 70%)",
            }}
            aria-hidden
          />

          <a
            href={file}
            download
            className="
              group inline-flex items-center gap-2 rounded-full
              border border-neutral-700 bg-neutral-900/70 px-3 py-2
              text-sm text-neutral-100 shadow-lg shadow-black/10
              transition-colors hover:bg-neutral-800/85
              focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60
            "
            aria-label="CV (PDF)"
          >
            <span
              className="
                inline-grid h-8 w-8 place-items-center rounded-full
                border border-neutral-700 bg-neutral-900/80
                transition-transform duration-300 group-hover:scale-105
              "
            >
              <Download size={16} className="text-primary" />
            </span>

            {/* Texte concis, toujours visible */}
            <span className="font-medium text-neutral-200">CV · PDF</span>
          </a>
        </div>
      </motion.div>

      {/* =============== Mobile : FAB =============== */}
      <motion.div
        className="fixed bottom-5 right-5 z-40 sm:hidden"
        initial={{ opacity: 0, y: 8, scale: 0.95 }}
        animate={{
          opacity: visible ? 1 : 0,
          y: visible ? 0 : 8,
          scale: visible ? 1 : 0.95,
        }}
        transition={{ duration: 0.3, ease: EASE }}
      >
        <a
          href={file}
          download
          className="
            inline-grid h-12 w-12 place-items-center rounded-full
            border border-neutral-700 bg-neutral-900/75 text-neutral-100
            shadow-lg shadow-black/20 active:scale-95 transition
            hover:bg-neutral-800/85 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60
          "
          aria-label="CV (PDF)"
        >
          <Download size={18} className="text-primary" />
        </a>
      </motion.div>
    </>
  );
}
