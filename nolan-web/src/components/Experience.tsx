"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useSpring } from "framer-motion";
import { Building2, MapPin, Calendar, BadgeCheck } from "lucide-react";

/* --- Données (FR) --- */
type Exp = {
  org: string;
  role: string;
  period: string;
  location: string;
  bullets: string[];
  tags: string[];
};

const EXPERIENCES: Exp[] = [
  {
    org: "ANFSI — Agence du Numérique des Forces de Sécurité Intérieure",
    role: "Ingénieur DevOps (Automatisation & CI/CD) — Alternance",
    period: "oct. 2025 — Aujourd’hui",
    location: "Issy-les-Moulineaux (FR) • Sur site",
    bullets: [
      "Mise en place et industrialisation de pipelines CI/CD.",
      "Automatisation d’environnements et bonnes pratiques DevOps au sein des équipes.",
    ],
    tags: ["CI/CD", "Automatisation", "DevOps", "Sécurité"],
  },
  {
    org: "Mairie de Paris Centre",
    role: "Administrateur Réseau Junior — Alternance",
    period: "sept. 2023 — juil. 2024",
    location: "Paris (FR) • Sur site",
    bullets: [
      "Refonte réseau Parc Floral (JOP 2024) — conception et déploiement topologie Cisco + VLAN.",
      "Gestion de l’infra IT municipale, configurations avancées Cisco, déploiements sur site.",
      "Support N2 (hotline) : diagnostic et résolution incidents réseau.",
    ],
    tags: ["Cisco", "VLAN", "STP", "VRF", "SNMP", "PKI"],
  },
  {
    org: "ISAE-Supméca (Institut supérieur de mécanique de Paris)",
    role: "Administrateur Réseau Junior — Stage",
    period: "mai 2022 — déc. 2022",
    location: "Saint-Ouen (FR) • Sur site",
    bullets: [
      "Supervision et administration du réseau ; déploiement/configuration d’un NAS centralisé.",
      "Support IT N1, gestion du stock et tri des demandes via ticketing.",
      "Scripts Python d’automatisation pour tâches récurrentes.",
    ],
    tags: ["NAS", "Python", "Automatisation", "Supervision"],
  },
  {
    org: "OPPCHAIN",
    role: "Stagiaire IT",
    period: "janv. 2018 — janv. 2018",
    location: "Paris (FR) • Sur site",
    bullets: [
      "Découverte multi-disciplinaire d’une startup tech et collaboration web.",
      "Sensibilisation marketing/stratégie et initiation à l’analyse de données.",
    ],
    tags: ["Web", "Startup", "Data"],
  },
];

/* --- Variants --- */
const itemV = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function Experience() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 10%", "end 80%"], // quand commence / finit le remplissage
  });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 20, mass: 0.35 });

  return (
    <section id="experience" className="section py-24 md:py-32">
      <div className="container mx-auto max-w-5xl px-6">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          className="text-3xl md:text-4xl font-semibold text-white"
        >
          Expérience professionnelle
        </motion.h2>
        <p className="mt-3 text-neutral-400">Mon parcours — rôles, responsabilités et impact.</p>

        <div ref={sectionRef} className="relative mt-10">
          {/* Rail vertical */}
          <div className="absolute left-4 top-0 h-full w-px bg-white/[0.06]" aria-hidden />
          {/* Remplissage lié au scroll */}
          <motion.div
            className="absolute left-4 top-0 w-px origin-top bg-gradient-to-b from-primary via-primary/80 to-primary/40"
            style={{ height: "100%", scaleY: progress }}
            aria-hidden
          />

          <ul className="relative pl-10 space-y-10">
            {EXPERIENCES.map((exp, i) => (
              <TimelineItem key={i} exp={exp} index={i} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* --- Item de timeline --- */
function TimelineItem({ exp, index }: { exp: Exp; index: number }) {
  const ref = useRef<HTMLLIElement | null>(null);
  const inView = useInView(ref, { margin: "0px 0px -10% 0px", amount: 0.6 });

  return (
    <motion.li
      ref={ref}
      variants={itemV}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.6 }}
      className="relative"
    >
{/* pastille parfaitement alignée sur le rail */}
<motion.span
  className="
    absolute left-4 -translate-x-1/2 top-6
    inline-flex h-3.5 w-3.5 items-center justify-center
    rounded-full bg-primary/30 ring-4 ring-primary/10
  "
  animate={inView ? { scale: [0.9, 1.15, 1] } : { scale: 0.9 }}
  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
  aria-hidden
>
  <span className="block h-1.5 w-1.5 rounded-full bg-primary" />
</motion.span>


      {/* carte */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 md:p-5 backdrop-blur-[1px]">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-300">
          <span className="inline-flex items-center gap-2">
            <Building2 size={16} className="text-primary" />
            <span className="font-medium text-white">{exp.org}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-neutral-400">
            <Calendar size={16} />
            {exp.period}
          </span>
          <span className="inline-flex items-center gap-1.5 text-neutral-400">
            <MapPin size={16} />
            {exp.location}
          </span>
        </div>

        <h3 className="mt-2 text-lg font-semibold text-white">{exp.role}</h3>

        <ul className="mt-3 space-y-2 text-neutral-300">
          {exp.bullets.map((b, i) => (
            <li key={i} className="flex gap-2">
              <BadgeCheck size={16} className="mt-0.5 shrink-0 text-primary" />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <div className="mt-3 flex flex-wrap gap-2">
          {exp.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-neutral-300"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.li>
  );
}
