import type { Metadata } from "next";
import { Suspense } from "react";
import MobileNav from "@/components/MobileNav";
import ScrollReveal from "@/components/ScrollReveal";
import PrefsRestore from "@/components/PrefsRestore";
import "./globals.css";

export const metadata: Metadata = {
  title: "RepoSurge - repos rising. fast.",
  description: "GitHub repositories ranked by star velocity. Brutalist. Fast.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen">
        <nav className="border-b border-bone/20 sticky top-0 z-40 bg-midnight/95 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <a href="/" className="text-xl font-bold tracking-tight text-bone hover:text-electric transition-colors">
              REP<span className="text-electric">Ø</span>SURGE
            </a>
            <div className="hidden md:flex items-center gap-6">
              <a href="/#repos" className="text-bone/70 text-sm tracking-widest hover:text-electric transition-colors">Rankings</a>
              <a href="/about" className="text-bone/70 text-sm tracking-widest hover:text-electric transition-colors">About</a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="text-bone/70 text-sm tracking-widest hover:text-electric transition-colors">GitHub</a>
            </div>
            <MobileNav />
          </div>
        </nav>

        {children}

        <footer className="mt-10 text-bone/30 text-xs border-t border-bone/20 pt-4 pb-8">
          <div className="max-w-7xl mx-auto px-4">
            data: github api | refreshed daily
          </div>
        </footer>

        <ScrollReveal />
        <Suspense>
          <PrefsRestore />
        </Suspense>
      </body>
    </html>
  );
}
