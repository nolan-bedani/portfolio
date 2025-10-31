"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  BadgeCheck,
  MapPin,
  Linkedin,
  Github,
  ArrowRight,
} from "lucide-react";
import Magnetic from "./Magnetic";
import CVButton from "./CVButton";

export default function Hero() {
  const name = "Nolan";
  const roles = ["Cloud Architect", "DevOps Leader", "Platform Engineer"]; // laissés tels quels
  const tagline =
    "Je conçois des infrastructures fiables, automatisées et observables — sans sacrifier la vitesse.";

  const [idx, setIdx] = useState(0);
  const [cycles, setCycles] = useState(0);
  useEffect(() => {
    const t = setInterval(() => {
      setIdx((i) => {
        const next = (i + 1) % roles.length;
        if (next === 0) setCycles((c) => c + 1);
        return next;
      });
    }, 2000);
    return () => clearInterval(t);
  }, []);
  const shouldAnimate = cycles < 2; // accessibilité : on arrête après 2 cycles

  return (
    <section id="home" className="section relative pt-28 pb-20 md:pb-28">
      <div
        id="content"
        className="container mx-auto max-w-5xl px-6 text-center"
      >
        <div className="mx-auto mb-6 inline-flex items-center justify-center rounded-full border-4 border-primary p-1 shadow-lg shadow-primary/10">
          <Image
            src="/images/avatar.jpg"
            alt="Avatar"
            width={160}
            height={160}
            className="rounded-full"
            priority
          />
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
          <span className="text-white">Bonjour, je suis </span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-red-400">
            {name}
          </span>
        </h1>

        {/* Rôle dynamique juste sous le nom */}
        <div className="mt-3 flex items-center justify-center">
          <div className="flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5">
            <BadgeCheck size={16} className="opacity-80" aria-hidden />
            <div className="relative h-[22px] overflow-hidden" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.span
                  key={roles[idx]}
                  initial={shouldAnimate ? { y: 12, opacity: 0 } : false}
                  animate={shouldAnimate ? { y: 0, opacity: 1 } : false}
                  exit={shouldAnimate ? { y: -12, opacity: 0 } : undefined}
                  transition={{ duration: 0.28 }}
                  className="text-sm font-medium text-primary"
                >
                  {roles[idx]}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Localisation sous la roulette */}
        <div className="mt-3 flex items-center justify-center gap-2 text-sm text-neutral-300">
          <motion.span
            className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_0_3px_rgba(16,185,129,0.15)]"
            animate={{ scale: [1, 1.25, 1], x: [0, 0.6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden
          />
          <MapPin size={16} className="opacity:70" aria-hidden />
          <span>Actuellement à Paris, FR</span>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="mx-auto mt-6 max-w-2xl text-neutral-300"
        >
          {tagline}
        </motion.p>

        {/* CTA group */}
        <div className="mt-7 flex items-center justify-center gap-3">
          {/* CTA email */}
          <Magnetic>
            <a
              href="mailto:bedani.nolan@gmail.com"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-primary/20 hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
            >
              M’écrire directement <ArrowRight size={16} aria-hidden />
            </a>
          </Magnetic>

          {/* CTA CV */}
          <Magnetic>
            <CVButton variant="ghost" className="px-5 py-2.5" />
          </Magnetic>

          {/* Icônes sociales */}
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900/60 text-neutral-200 hover:bg-neutral-800/80"
            aria-label="LinkedIn"
          >
            <Linkedin size={18} />
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900/60 text-neutral-200 hover:bg-neutral-800/80"
            aria-label="GitHub"
          >
            <Github size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
