"use client";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="section py-24 md:py-32">
      <div className="container mx-auto max-w-3xl px-6 text-center">
        <motion.h2 initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.4}}
          transition={{duration:.5}} className="text-3xl md:text-4xl font-semibold text-white">
          Entrer en contact
        </motion.h2>
        <p className="mt-3 text-neutral-400">Ouverts aux missions courtes et opportunités DevOps.</p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <a href="mailto:bedani.nolan@gmail.com" className="inline-flex items-center gap-2 rounded-full bg-primary-dark px-4 py-2 text-sm font-medium text-white hover:opacity-90">
            <Mail size={16}/> M’écrire directement
          </a>
        </div>
      </div>
    </section>
  );
}
