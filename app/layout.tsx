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
      <body className={`${jetbrains.variable} font-mono bg-amber-bg`}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-amber-bezel focus:text-amber-primary focus:outline-1 focus:outline-amber-primary">
          skip to content
        </a>
        <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
          <div className="flex items-center gap-6 px-5 py-2 bg-amber-bg/80 backdrop-blur-lg border border-amber-primary/20 rounded-xl shadow-lg shadow-black/40">
            <a href="/" className="text-amber-primary font-bold tracking-wider text-sm">
              RS
            </a>
            <NavLinks links={NAV_LINKS} />
            <MobileNav />
          </div>
        </nav>

        <div id="main-content" className="pt-16 mx-4 md:mx-8 lg:mx-auto max-w-7xl p-4 md:p-6 mb-8">
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
