import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import MobileNav from "@/components/MobileNav";
import FilmGrain from "@/components/FilmGrain";
import "./globals.css";

export const metadata: Metadata = {
  title: "RepoSurge - repos rising. fast.",
  description: "GitHub repositories ranked by star velocity.",
};

function MeshBackground() {
  return (
    <div className="mesh-gradient" aria-hidden="true">
      <div
        className="mesh-orb w-[600px] h-[600px] bg-purple-600/20 top-[-200px] left-[-100px]"
        style={{ animationDelay: "0s" }}
      />
      <div
        className="mesh-orb w-[500px] h-[500px] bg-emerald-500/15 top-[40%] right-[-150px]"
        style={{ animationDelay: "-7s" }}
      />
      <div
        className="mesh-orb w-[400px] h-[400px] bg-electric/10 bottom-[-100px] left-[30%]"
        style={{ animationDelay: "-14s" }}
      />
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <MeshBackground />
        <FilmGrain />

        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-40 w-max">
          <div className="glass-panel rounded-full px-2 py-2 flex items-center gap-1">
            <a
              href="/"
              className="px-4 py-2 text-sm font-bold tracking-tight text-bone hover:text-electric transition-colors duration-500"
              style={{ transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)" }}
            >
              REP<span className="text-electric">Ø</span>SURGE
            </a>
            <div className="hidden md:flex items-center gap-1 text-[11px] tracking-widest font-medium">
              {[
                { href: "/", label: "HOME" },
                { href: "/daily", label: "DAILY" },
                { href: "/weekly", label: "WEEKLY" },
                { href: "/monthly", label: "MONTHLY" },
                { href: "/about", label: "ABOUT" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 rounded-full text-bone/60 hover:text-bone hover:bg-white/5 transition-all duration-500"
                  style={{ transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)" }}
                >
                  {link.label}
                </a>
              ))}
            </div>
            <MobileNav />
          </div>
        </nav>

        <div className="pt-24">{children}</div>

        <footer className="mt-20 py-12 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-bone/20 text-xs tracking-widest">
              data: github api | refreshed daily
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
