import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import MobileNav from "@/components/MobileNav";
import LastUpdated from "@/components/LastUpdated";
import NavLinks from "@/components/NavLinks";
import { NAV_LINKS } from "@/lib/nav-links";
import { getLastUpdated } from "@/lib/db";
import "./globals.css";

const jetbrains = JetBrains_Mono({ subsets: ["latin"], display: "swap", variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "reposurge - repos rising. fast.",
  description: "terminal velocity tracker for github repos",
  icons: { icon: "/favicon.svg" },
};

const lastUpdated = getLastUpdated();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${jetbrains.variable} font-mono bg-amber-bezel`}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-amber-bezel focus:text-amber-primary focus:outline-1 focus:outline-amber-primary">
          skip to content
        </a>
        <header role="banner">
        <nav className="fixed top-0 left-0 right-0 z-40 bg-amber-bg/90 border-b border-amber-muted/20">
          <div className="max-w-7xl mx-auto px-6 h-12 flex items-center text-xs tracking-wider">
            <a href="/" className="text-amber-primary font-bold hover:text-amber-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-primary focus-visible:ring-offset-2 focus-visible:ring-offset-amber-bg active:text-amber-primary/70 transition-all duration-200 cursor-pointer amber-glow-sm">
              REP<span className="text-bone" style={{ textShadow: "none" }}>Ø</span>SURGE
            </a>
            <div className="hidden md:flex items-center gap-1 ml-auto">
              <NavLinks links={NAV_LINKS} />
            </div>
            <MobileNav />
          </div>
        </nav>
        </header>

        <div id="main-content" className="pt-16 crt-frame mx-4 md:mx-8 lg:mx-auto max-w-7xl p-4 md:p-6 mb-8">
          <div className="crt-sweep" aria-hidden="true" />
          {children}
        </div>

        <footer aria-label="site footer" className="border-t border-amber-muted/20 py-8 mt-16">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            <p className="text-amber-muted text-[10px] sm:text-xs">
              data: github api &middot; refreshed daily
            </p>
            {lastUpdated && <LastUpdated dateStr={lastUpdated} />}
          </div>
        </footer>
      </body>
    </html>
  );
}
