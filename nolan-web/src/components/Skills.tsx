"use client";

import Image, { StaticImageData } from "next/image";
import { motion, useReducedMotion } from "framer-motion";

/* ===== Imports des logos (depuis /icons à la racine du projet) ===== */
import aws from "../../icons/aws.png";
import gcp from "../../icons/gcp.svg";
import azure from "../../icons/azure.png";
import linux from "../../icons/linux.png";
import kubernetes from "../../icons/kubernetes.png";
import docker from "../../icons/docker.svg";
import terraform from "../../icons/terraform.png";
import ansible from "../../icons/ansible.svg";
import gitlab from "../../icons/gitlab.svg";
import githubActions from "../../icons/github-actions.png";
import prometheus from "../../icons/prometheus.png";
import grafana from "../../icons/grafana.png";
import elastic from "../../icons/elastic.svg";
import argocd from "../../icons/argocd.png";
import nginx from "../../icons/nginx.svg";
import vault from "../../icons/vault.svg";

type Skill = {
  label: string;
  src: StaticImageData | string;
};

const skills: Skill[] = [
  { label: "AWS", src: aws },
  { label: "Google Cloud", src: gcp },
  { label: "Microsoft Azure", src: azure },
  { label: "Linux", src: linux },

  { label: "Kubernetes", src: kubernetes },
  { label: "Docker", src: docker },
  { label: "Terraform (IaC)", src: terraform },
  { label: "Ansible", src: ansible },

  { label: "GitLab CI/CD", src: gitlab },
  { label: "GitHub Actions", src: githubActions },
  { label: "Prometheus", src: prometheus },
  { label: "Grafana", src: grafana },

  { label: "Elastic (ELK)", src: elastic },
  { label: "ArgoCD", src: argocd },
  { label: "Nginx", src: nginx },
  { label: "Vault (Secrets/IAM)", src: vault },
];

export default function Skills() {
  return (
    <section id="skills" className="section py-24 md:py-32">
      <div className="container mx-auto max-w-5xl px-6">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-semibold text-white"
        >
          Compétences techniques
        </motion.h2>
        <p className="mt-3 text-neutral-400">
          Compétences clés en réseaux, DevOps et infrastructure cloud.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {skills.map((s) => (
            <SkillPill key={s.label} label={s.label} src={s.src} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SkillPill({ label, src }: { label: string; src: StaticImageData | string }) {
  const reduce = useReducedMotion();

  const onMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    e.currentTarget.style.setProperty("--x", `${x}%`);
    e.currentTarget.style.setProperty("--y", `${y}%`);
  };

  const isSvg = typeof src === "string" && src.endsWith(".svg");

  return (
    <motion.div
      onMouseMove={onMove}
      whileHover={reduce ? {} : { scale: 1.02, y: -1 }}
      transition={{ type: "spring", stiffness: 400, damping: 30, mass: 0.4 }}
      className="
        group relative flex items-center gap-2 rounded-xl
        border border-neutral-800/60 bg-neutral-900/40 px-3 py-2
        text-sm text-neutral-200 shadow-sm
      "
    >
      {/* Logo */}
      <span className="relative h-5 w-5 shrink-0">
        <Image
          src={src}
          alt={label}
          fill
          sizes="20px"
          className="object-contain select-none"
          // les SVG ne nécessitent pas d'optimisation ; par précaution :
          unoptimized={isSvg}
        />
      </span>

      <span className="relative z-10">{label}</span>

      {/* glow radial au survol */}
      <span
        aria-hidden
        className="
          pointer-events-none absolute inset-0 rounded-xl opacity-0
          transition-opacity duration-300 group-hover:opacity-100
        "
        style={{
          background:
            "radial-gradient(120px 60px at var(--x,50%) var(--y,50%), rgba(170,184,255,0.20), transparent 65%)",
        }}
      />
      <span
        aria-hidden
        className="
          pointer-events-none absolute -inset-px rounded-xl
          bg-gradient-to-r from-primary/25 via-primary-dark/30 to-primary/25
          opacity-0 blur-[8px] transition-opacity duration-300 group-hover:opacity-100
        "
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-primary/40 group-hover:ring-primary-dark/60 transition-colors"
      />
    </motion.div>
  );
}
