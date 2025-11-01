"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { BadgeCheck, MapPin, Linkedin, Github, ArrowRight } from "lucide-react";

/* --- Hook typing pour la phrase “Je conçois …” --- */
function useTypingEffect(text: string, perCharMs = 30) {
  const [out, setOut] = useState("");
  useEffect(() => {
    setOut("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, perCharMs);
    return () => clearInterval(id);
  }, [text, perCharMs]);
  return out;
}

export default function Hero() {
  const name = "Nolan";
  const roles = useMemo(
    () => ["Cloud Architect", "DevOps Leader", "Platform Engineer"],
    []
  );

  const [roleIdx, setRoleIdx] = useState(0);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setRoleIdx((i) => {
        const n = (i + 1) % roles.length;
        if (n === 0) setCycles((c) => c + 1);
        return n;
      });
    }, 2000);
    return () => clearInterval(id);
  }, [roles.length]);

  const shouldAnimate = cycles < 2;

  const taglineSrc =
    "Je conçois des infrastructures fiables, automatisées et observables — sans sacrifier la vitesse.";
  const typed = useTypingEffect(taglineSrc, 18);

  return (
    <section
      id="home"
      className="
        section relative
        min-h-[calc(100svh-var(--nav-h))]   /* plein écran - navbar */
        flex items-center                   /* centre verticalement */
        py-8 md:py-10
      "
    >
      <div className="container mx-auto max-w-5xl px-6 text-center">
        {/* Avatar */}
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

        {/* Titre */}
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
          <span className="text-white">Bonjour, je suis </span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-red-400">
            {name}
          </span>
        </h1>

        {/* Roulette des rôles sous le nom */}
        <div className="mt-3 flex items-center justify-center">
          <div className="flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5">
            <BadgeCheck size={16} className="opacity-80" aria-hidden />
            <div className="relative h-[22px] overflow-hidden" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.span
                  key={roles[roleIdx]}
                  initial={shouldAnimate ? { y: 12, opacity: 0 } : false}
                  animate={shouldAnimate ? { y: 0, opacity: 1 } : false}
                  exit={shouldAnimate ? { y: -12, opacity: 0 } : undefined}
                  transition={{ duration: 0.28 }}
                  className="text-sm font-medium text-primary"
                >
                  {roles[roleIdx]}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Localisation */}
        <div className="mt-3 flex items-center justify-center gap-2 text-sm text-neutral-300">
          <motion.span
            className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_0_3px_rgba(16,185,129,0.15)]"
            animate={{ scale: [1, 1.25, 1], x: [0, 0.6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden
          />
          <MapPin size={16} className="opacity-70" aria-hidden />
          <span>Actuellement à Paris, FR</span>
        </div>

        {/* Tagline (typing) */}
        <p className="mx-auto mt-6 max-w-2xl text-neutral-300">{typed}</p>

        {/* CTA + Réseaux */}
        <div className="mt-7 flex items-center justify-center gap-3">
          <a
            href="mailto:bedani.nolan@gmail.com"
            className="inline-flex items-center gap-2 rounded-full bg-primary/80 px-4 py-2 text-sm font-medium text-white hover:bg-primary"
          >
            M’écrire directement <ArrowRight size={16} aria-hidden />
          </a>
          <a
            href="https://www.linkedin.com/in/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-neutral-200 hover:bg-white/10"
            aria-label="LinkedIn"
          >
            <Linkedin size={18} />
          </a>
          <a
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-neutral-200 hover:bg-white/10"
            aria-label="GitHub"
          >
            <Github size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
