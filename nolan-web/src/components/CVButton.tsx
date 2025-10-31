"use client";

import { Download } from "lucide-react";

type Props = {
  variant?: "solid" | "ghost";
  className?: string;
  file?: string; // permet de changer le chemin si besoin
};

export default function CVButton({
  variant = "solid",
  className = "",
  file = "/images/CV_Nolan_Bedani_Alternance.pdf",
}: Props) {
  const base =
    "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60";
  const styles =
    variant === "solid"
      ? "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 border border-primary/80"
      : "border border-neutral-700 bg-neutral-900/40 text-neutral-200 hover:bg-neutral-800/60";

  return (
    <a
      href={file}
      download
      className={`${base} ${styles} ${className}`}
      aria-label="Télécharger mon CV (PDF)"
    >
      <Download size={16} />
      <span>Télécharger mon CV</span>
    </a>
  );
}
