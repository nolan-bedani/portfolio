"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { BadgeCheck, MapPin, Linkedin, Github, ArrowRight } from "lucide-react";
import Magnetic from "./Magnetic";

/* Hook typing – lettre par lettre (avec cleanup, accessible) */
function useTypingEffect(text: string, stepMs = 45, byLetter = true) {
  const [pos, setPos] = useState(0);
  const items = byLetter ? text.split("") : text.split(" ");
  useEffect(() => setPos(0), [text, byLetter]);
  useEffect(() => {
    if (pos >= items.length) return;
    const id = setTimeout(() => setPos((p) => p + 1), stepMs);
    return () => clearTimeout(id);
  }, [pos, stepMs, items.length]);
  return items.slice(0, pos).join(byLetter ? "" : " ");
}

export default function Hero() {
  const name = "Nolan";
  const roles = ["Cloud Architect", "DevOps Leader", "Platform Engineer"];
  const tagline =
    "Je conçois des infrastructures fiables, automatisées et observables — sans sacrifier la vitesse.";

  // roulette des rôles (on arrête après 2 cycles pour l’accessibilité)
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
  const shouldAnimate = cycles < 2;

  // typing du tagline (lettre par lettre)
  const typed = useTypingEffect(tagline, 45, true);
  const typingDone = typed.length === tagline.length;

  return (
    <section
      id="home"
      className="section relative pt-32 md:pt-36 pb-20 md:pb-28" // + d’espace en haut
    >
      <div id="content" className="container mx-auto max-w-5xl px-6 text-center">
        {/* avatar */}
        <div className="mx-auto mb-8 inline-flex items-center justify-center rounded-full border-4 border-primary p-1 shadow-lg shadow-primary/10">
          <Image
            src="/images/avatar.jpg"
            alt="Avatar"
            width={160}
            height={160}
            className="rounded-full"
            priority
          />
        </div>

        {/* titre + espace en dessous */}
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
          <span className="text-white">Bonjour, je suis </span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-red-400">
            {name}
          </span>
        </h1>

        {/* Rôle dynamique – un peu plus bas */}
        <div className="mt-6 flex items-center justify-center">
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

        {/* Localisation – un peu plus bas aussi */}
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-neutral-300">
          <motion.span
            className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_0_3px_rgba(16,185,129,0.15)]"
            animate={{ scale: [1, 1.25, 1], x: [0, 0.6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden
          />
          <MapPin size={16} className="opacity-70" aria-hidden />
          <span>Actuellement à Paris, FR</span>
        </div>

        {/* Tagline avec effet typing + curseur */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="mx-auto mt-8 max-w-2xl text-neutral-300"
          aria-live="polite"
        >
          <span>{typed}</span>
          {!typingDone && (
            <span
              aria-hidden
              className="ml-1 inline-block h-5 w-[2px] align-middle bg-neutral-400/80 animate-pulse"
            />
          )}
        </motion.p>

        {/* CTA + réseaux (effet magnétique) – espacés du texte */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <Magnetic>
            <a
              href="mailto:bedani.nolan@gmail.com"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white shadow-[0_8px_24px_rgba(99,102,241,.25)] hover:opacity-90"
            >
              M’écrire directement
              <ArrowRight size={16} aria-hidden />
            </a>
          </Magnetic>

          <Magnetic strength={0.35}>
            <a
              href="https://www.linkedin.com/in/nolanbedani"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn de Nolan"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 hover:bg-white/[.08]"
            >
              <Linkedin size={18} />
            </a>
          </Magnetic>

          <Magnetic strength={0.35}>
            <a
              href="https://github.com/deeway92"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub de Nolan"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 hover:bg-white/[.08]"
            >
              <Github size={18} />
            </a>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
