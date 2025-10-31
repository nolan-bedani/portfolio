"use client";

import { motion } from 'framer-motion';

export default function About() {
  return (
    <section id="about" className="py-24 md:py-32 bg-neutral-900 text-neutral-200">
      <div className="container mx-auto max-w-4xl px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold mb-8 text-center"
        >
          À propos de moi
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-4 text-lg leading-relaxed"
        >
          <p>
            Passionné de réseaux et d’automatisation, je conçois des environnements reproductibles (Docker, Ansible, Kubernetes) avec une attention particulière à l’observabilité et à la sécurité.
          </p>
          <p>
            Mon travail se situe à l’intersection de l’architecture réseau, de l’ingénierie plateforme et de l’automatisation. J’aide les organisations à accélérer la livraison, à réduire les incidents et à travailler avec confiance.
          </p>
          <p>
            J’aime transformer des POCs et des documents techniques en runbooks clairs et mesurables, afin que les équipes puissent itérer et grandir ensemble.
          </p>
        </motion.div>
      </div>
    </section>
  );
}