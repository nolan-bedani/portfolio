"use client";
import { useRef } from "react";

export default function Magnetic({
  children,
  strength = 0.25, // 0.15 doux · 0.35 fort
}: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement | null>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top  + r.height / 2)) * strength;
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = "translate3d(0,0,0)"; };

  return (
    <span onMouseMove={onMove} onMouseLeave={onLeave}
          className="inline-block will-change-transform transition-transform duration-300">
      <span ref={ref}>{children}</span>
    </span>
  );
}
