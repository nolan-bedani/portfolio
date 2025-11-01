import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";

import Navbar from "../components/Navbar";
import FloatingCV from "../components/FloatingCV";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nolan — Portfolio",
  description: "Portfolio Réseaux & DevOps",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`bg-app bg-aurora min-h-screen ${inter.className}`}>
        {/* Barre de nav toujours présente */}
        <Navbar />

        {/* Contenu de la page */}
        {children}

        {/* Bouton flottant “télécharger mon CV” (icône seule) */}
        <FloatingCV />
      </body>
    </html>
  );
}
