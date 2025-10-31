import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nolan — Portfolio",
  description: "Portfolio Réseaux & DevOps",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
<body className={`bg-app ${inter.className}`}>{children}</body>


    </html>
  );
}
