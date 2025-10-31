"use client";

import { useState, useMemo, useRef, useEffect, MouseEvent, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Network as NetworkIcon, Gauge, Activity, Shield, Cpu } from "lucide-react";
import { motion, AnimatePresence, useInView, useSpring } from "framer-motion";


/* === Helpers / Animations (harmonisés) === */
const DUR = 0.6;                          // durée proche de l’exemple Material Tailwind (mais + réactive au clic)
const EASE: any = [0.22, 1, 0.36, 1];     // même easing que le reste du site

function throttle<T extends (...args: any[]) => any>(fn: T, delay = 100) {
  let last = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - last < delay) return;
    last = now;
    fn(...args);
  };
}

function TiltCard({ children }: { children: React.ReactNode }) {
  const rotX = useSpring(0, { stiffness: 120, damping: 18, mass: 0.4 });
  const rotY = useSpring(0, { stiffness: 120, damping: 18, mass: 0.4 });

  const onMouseMove = useCallback(
    throttle((e: MouseEvent<HTMLDivElement>) => {
      const box = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - box.left;
      const y = e.clientY - box.top;
      const cx = box.width / 2;
      const cy = box.height / 2;

      const SENS = 14;   // ↘️ plus grand = moins sensible (avant 7)
      const MAX  = 6;    // limite en degrés (évite les “sursauts”)
      const rx = Math.max(-MAX, Math.min(MAX, (y - cy) / SENS));
      const ry = Math.max(-MAX, Math.min(MAX, (cx - x) / SENS));

      rotX.set(rx);
      rotY.set(ry);
    }, 120),             // ↗️ throttle plus long = moins d’updates
    []
  );

  const onMouseLeave = () => { rotX.set(0); rotY.set(0); };

  return (
    <div style={{ perspective: 1000 }} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} className="relative">
      {/* glow doux aux couleurs du site */}
      <div className="pointer-events-none absolute -inset-3 rounded-2xl bg-gradient-to-r from-primary/60 via-primary/30 to-primary/60 opacity-15 blur-2xl" />
      <motion.div style={{ rotateX: rotX, rotateY: rotY }}>
        {children}
      </motion.div>
    </div>
  );
}


/* === Carousel “type MaterialTailwind” (manuel, flèches + dots, slide + fade) === */
type Slide = { src: string; alt: string; caption: string };

function Carousel({ slides }: { slides: Slide[] }) {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1); // 1 = next, -1 = prev
  const wrap = (n: number) => (n + slides.length) % slides.length;

  const next = () => { setDir(1); setIdx(v => wrap(v + 1)); };
  const prev = () => { setDir(-1); setIdx(v => wrap(v - 1)); };

  // nav clavier quand l’élément est visible
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { amount: 0.5 });
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (!inView) return;
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, [inView]);

  const current = slides[idx];
  const key = `${idx}-${current.src}`;

  return (
    <div ref={ref} className="relative">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
        {/* slide courante */}
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div
            key={key}
            custom={dir}
            initial={{ opacity: 0, x: dir === 1 ? 60 : -60, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: dir === 1 ? -60 : 60, scale: 0.98 }}
            transition={{ duration: DUR, ease: EASE }}
            className="absolute inset-0"
          >
            <Image
              src={current.src}
              alt={current.alt}
              fill
              className="object-cover select-none"
              sizes="(min-width:1024px) 520px, 100vw"
              priority={false}
            />
            {/* caption chip */}
            <div className="absolute left-3 bottom-3 inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/85 px-3 py-1.5 text-xs text-neutral-200 backdrop-blur">
              {current.caption}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* flèches centrées verticalement */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-2">
          <button
            aria-label="Précédent"
            onClick={prev}
            className="pointer-events-auto rounded-full border border-neutral-800 bg-neutral-900/70 p-2 text-neutral-200 hover:bg-neutral-800/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            aria-label="Suivant"
            onClick={next}
            className="pointer-events-auto rounded-full border border-neutral-800 bg-neutral-900/70 p-2 text-neutral-200 hover:bg-neutral-800/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* dots */}
      <div className="mt-3 flex w-full items-center justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            aria-label={`Aller à l’image ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === idx ? "w-6 bg-primary" : "w-2 bg-neutral-700"}`}
          />
        ))}
      </div>
    </div>
  );
}

/* === SECTION PROJETS (image à gauche alignée milieu + texte à droite) === */
export default function Projects() {
  const slides: Slide[] = [
    { src: "/images/photo1.png"},
    { src: "/images/photo2.png"},
  ];

  return (
    <section id="projects" className="section py-24 md:py-32">
      <div className="container mx-auto max-w-5xl px-6">
        <motion.h2 initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .4 }} transition={{ duration: DUR }}
          className="text-3xl md:text-4xl font-semibold text-white">
          Projets
        </motion.h2>
        <p className="mt-3 text-neutral-400">Étude de cas phare — orientée résultat & lisibilité.</p>

        {/* chips d’impact */}
        <div className="mt-6 flex flex-wrap gap-2">
          {[
            { Icon: NetworkIcon, label: "2 sous-réseaux → 1 plan IP" },
            { Icon: Activity, label: "STP + UDLD" },
            { Icon: Shield, label: "DHCP Snooping + ACL" },
            { Icon: Cpu, label: "Supervision SNMP" },
          ].map(({ Icon, label }) => (
            <span key={label} className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/50 px-3 py-1.5 text-xs text-neutral-300">
              <Icon size={14} className="text-primary" aria-hidden /> {label}
            </span>
          ))}
        </div>

        {/* layout : image à gauche, alignée verticalement au milieu du texte à droite */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:items-center">
          <div className="self-center">
            <TiltCard>
              <Carousel slides={slides} />
            </TiltCard>
          </div>

          <div className="rounded-2xl border border-neutral-800/70 bg-neutral-900/50 p-5">
            <h3 className="text-xl font-semibold text-white">Parc Floral — Refonte réseau (JOP 2024)</h3>
            <p className="mt-2 text-neutral-300">
              <strong>Contexte & objectif :</strong> refonte complète du réseau du site du Parc Floral (Vincennes) pour les Jeux
              Olympiques de Paris 2024. Matériel remplacé, architecture simplifiée, résilience accrue pour les services critiques.
            </p>
            <ul className="mt-4 space-y-3 text-neutral-300">
              <li className="flex gap-3"><Gauge className="mt-1 text-primary" size={18} aria-hidden /><p><strong>Migration matérielle :</strong> consolidation de deux sous-réseaux hérités vers un plan IP unifié et re-segmentation de <em>4 VLANs</em> (Intranet, ToIP, GPM, Wi-Fi).</p></li>
              <li className="flex gap-3"><Activity className="mt-1 text-primary" size={18} aria-hidden /><p><strong>Haute dispo :</strong> activation <em>STP</em> et <em>UDLD</em> pour prévenir les boucles et garantir la continuité.</p></li>
              <li className="flex gap-3"><Shield className="mt-1 text-primary" size={18} aria-hidden /><p><strong>Sécurisation :</strong> <em>DHCP Snooping</em>, accès distant <em>SSH</em> sécurisé et <em>ACL_VTY</em> restrictive.</p></li>
              <li className="flex gap-3"><Cpu className="mt-1 text-primary" size={18} aria-hidden /><p><strong>Supervision :</strong> intégration <em>SNMP</em> (agents + traps) vers la plateforme Spectrum.</p></li>
            </ul>

            <div className="mt-4 flex flex-wrap gap-2">
              {["Cisco", "VLAN", "STP", "UDLD", "DHCP Snooping", "SSH", "ACL", "SNMP"].map(t => (
                <span key={t} className="rounded-full border border-neutral-700 bg-neutral-900/40 px-2.5 py-1 text-xs text-neutral-300">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
