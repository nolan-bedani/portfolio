"use client";
import { motion, useReducedMotion } from "framer-motion";
import { Cloud, TerminalSquare, Layers, ShieldCheck, Gauge, Radar, Boxes, Cog, Wrench, GitBranch, Workflow, Server, Cpu } from "lucide-react";

const skills = [
  { label: "Infrastructure Cloud", Icon: Cloud },
  { label: "Linux", Icon: TerminalSquare },
  { label: "Platform Engineering", Icon: Layers },
  { label: "Gouvernance Cloud", Icon: ShieldCheck },
  { label: "Optimisation des coûts", Icon: Gauge },
  { label: "Fiabilité de plateforme", Icon: Radar },
  { label: "Kubernetes", Icon: Boxes },
  { label: "Conteneurisation", Icon: Boxes },
  { label: "Infrastructure as Code (IaC)", Icon: Cog },
  { label: "Gestion de configuration", Icon: Wrench },
  { label: "CI/CD", Icon: GitBranch },
  { label: "Automatisation DevOps", Icon: Workflow },
  { label: "Release Management", Icon: Server },
  { label: "Logs & Monitoring", Icon: Cpu },
  { label: "Gestion des accès", Icon: ShieldCheck },
  { label: "Observabilité", Icon: Radar },
];

export default function Skills() {
  return (
    <section id="skills" className="section py-24 md:py-32">
      <div className="container mx-auto max-w-5xl px-6">
        <motion.h2 initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.4}}
          transition={{duration:.5}} className="text-3xl md:text-4xl font-semibold text-white">
          Compétences techniques
        </motion.h2>
        <p className="mt-3 text-neutral-400">Compétences clés en réseaux, DevOps et infrastructure cloud.</p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {skills.map((s) => <SkillPill key={s.label} label={s.label} Icon={s.Icon} />)}
        </div>
      </div>
    </section>
  );
}

function SkillPill({ label, Icon }: { label: string; Icon: any }) {
  const reduce = useReducedMotion();
  const onMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    e.currentTarget.style.setProperty("--x", `${x}%`);
    e.currentTarget.style.setProperty("--y", `${y}%`);
  };
  return (
    <motion.div onMouseMove={onMove} whileHover={reduce?{}:{ scale:1.02, y:-1 }}
      transition={{ type:"spring", stiffness:400, damping:30, mass:.4 }}
      className="group relative rounded-xl border border-neutral-800/60 bg-neutral-900/40 px-3 py-2 text-sm text-neutral-200 shadow-sm flex items-center gap-2">
      <Icon size={16} className="text-primary" aria-hidden />
      <span className="relative z-10">{label}</span>
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{background:"radial-gradient(120px 60px at var(--x,50%) var(--y,50%), rgba(170,184,255,0.20), transparent 65%)"}} />
      <span aria-hidden className="pointer-events-none absolute -inset-px rounded-xl bg-gradient-to-r from-primary/25 via-primary-dark/30 to-primary/25 opacity-0 blur-[8px] transition-opacity duration-300 group-hover:opacity-100" />
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-primary/40 group-hover:ring-primary-dark/60 transition-colors" />
    </motion.div>
  );
}
