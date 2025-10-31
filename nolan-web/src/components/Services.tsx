"use client";

import { motion } from 'framer-motion';

interface Service {
  title: string;
  description: string;
  icon: JSX.Element;
}

const services: Service[] = [
  {
    title: 'Architecture & Infrastructure',
    description:
      'Spécialiste de la conception et du déploiement de solutions cloud et réseau adaptées aux besoins de scalabilité, de sécurité et de performance. Mise en place d’infrastructures résilientes qui soutiennent la croissance.',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-6 h-6"
      >
        <path d="M12 2a6 6 0 0 0-6 6c0 2.2 1.2 4.1 3 5.2V20l3-2 3 2v-6.8a6.003 6.003 0 0 0 0-10.4A6.003 6.003 0 0 0 12 2zm0 2a4 4 0 1 1 0 8 4 4 0 0 1 0-8z" />
      </svg>
    ),
  },
  {
    title: 'DevOps & Observabilité',
    description:
      'Automatisation des pipelines CI/CD, gestion de configuration et mises à l’échelle avec GitOps. Mise en place d’outils de supervision et de logging pour une visibilité complète des systèmes.',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-6 h-6"
      >
        <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2zm1 17.93V18h-2v1.93a8.003 8.003 0 0 1-6.36-6.36H6v-2H4.64a8.003 8.003 0 0 1 6.36-6.36V6h2V4.64a8.003 8.003 0 0 1 6.36 6.36H18v2h1.36a8.003 8.003 0 0 1-6.36 6.36z" />
      </svg>
    ),
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 md:py-32 bg-neutral-950 text-neutral-200">
      <div className="container mx-auto max-w-4xl px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold mb-8 text-center"
        >
          Ce que je fais
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center text-neutral-400 mb-10"
        >
          Transformer des défis complexes en solutions élégantes
        </motion.p>
        <div className="grid gap-6 md:grid-cols-2">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              className="relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/70 p-6 flex flex-col gap-4 hover:bg-neutral-800/80 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/20 text-primary">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-neutral-100">
                  {service.title}
                </h3>
              </div>
              <p className="text-neutral-300 text-sm leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}