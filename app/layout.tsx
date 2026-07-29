import type { Metadata } from "next";
import "@fontsource/geist-sans/400.css";
import "@fontsource/geist-sans/500.css";
import "@fontsource/geist-sans/600.css";
import "@fontsource/geist-sans/700.css";
import { JetBrains_Mono } from "next/font/google";
import MobileNav from "@/components/MobileNav";
import LastUpdated from "@/components/LastUpdated";
import NavLinks from "@/components/NavLinks";
import { NAV_LINKS } from "@/lib/nav-links";
import { getLastUpdated } from "@/lib/db";
import "./globals.css";

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "reposurge - repos rising. fast.",
  description: "star velocity tracker for github repos",
  icons: { icon: "/favicon.svg" },
};

const lastUpdated = getLastUpdated();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jetbrains.variable}`} style={{ "--font-geist": '"Geist Sans", "Geist"' } as React.CSSProperties}>
      <body className="font-sans bg-midnight relative z-[2]">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-surface focus:text-accent focus:outline-1 focus:outline-accent"
        >
          skip to content
        </a>
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-midnight">
          <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
            <a href="/" className="text-accent font-bold tracking-wider" title="RepoSurge">
              RS
            </a>
            <div className="flex items-center gap-6">
              <NavLinks links={NAV_LINKS} />
              <MobileNav />
            </div>
          </div>
        </header>

        <div
          id="main-content"
          className="relative z-[2] max-w-7xl mx-auto px-6 pt-24 pb-16"
        >
          {children}
        </div>

        <footer aria-label="site footer" className="border-t border-white/[0.06] py-6 mt-16 relative z-[2]">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            <p className="text-text-muted text-[10px] sm:text-xs">
              data: github api &middot; refreshed daily
            </p>
            {lastUpdated && <LastUpdated dateStr={lastUpdated} />}
          </div>
        </footer>
      </body>
    </html>
  );
}
