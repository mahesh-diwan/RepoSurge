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
      <body className={`${jetbrains.variable} font-mono`}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-midnight focus:text-terminal focus:outline-1 focus:outline-terminal">
          skip to content
        </a>
        <header role="banner">
        <nav className="fixed top-0 left-0 right-0 z-40 bg-midnight/90 border-b border-[#1a1a1a]">
          <div className="max-w-7xl mx-auto px-6 h-12 flex items-center text-xs tracking-wider">
            <a href="/" className="text-terminal font-bold hover:text-terminal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terminal focus-visible:ring-offset-2 focus-visible:ring-offset-midnight active:text-terminal/70 transition-all duration-200 cursor-pointer" style={{ textShadow: "0 0 8px rgba(0, 255, 65, 0.3)" }}>
              REP<span className="text-bone" style={{ textShadow: "none" }}>Ø</span>SURGE
            </a>
            <div className="hidden md:flex items-center gap-1 ml-auto">
              <NavLinks links={NAV_LINKS} />
            </div>
            <MobileNav />
          </div>
        </nav>
        </header>

        <div id="main-content" className="pt-16">{children}</div>

        <footer aria-label="site footer" className="border-t border-terminal/10 py-8 mt-16">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            <p className="text-dim text-[10px] sm:text-xs">
              data: github api &middot; refreshed daily
            </p>
            {lastUpdated && <LastUpdated dateStr={lastUpdated} />}
          </div>
        </footer>
      </body>
    </html>
  );
}
