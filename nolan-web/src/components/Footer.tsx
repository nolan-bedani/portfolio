"use client";

import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="py-8 bg-neutral-950 text-neutral-500 text-center text-sm">
      <p>
        © {new Date().getFullYear()} Nolan Bedani. Tous droits réservés.
      </p>
      <p className="mt-2 text-xs text-neutral-600">
        Design inspiré et reproduit avec autorisation du propriétaire original.
      </p>
    </footer>
  );
}