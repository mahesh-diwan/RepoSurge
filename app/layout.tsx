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
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
          <div className="card-outer !p-[1px] !rounded-full">
            <div className="glass !rounded-full flex items-center gap-6 px-5 py-2 !border-0 !bg-midnight/60">
              <a
                href="/"
                className="text-accent font-bold tracking-wider text-sm"
                title="RepoSurge"
              >
                RS
              </a>
              <NavLinks links={NAV_LINKS} />
              <MobileNav />
            </div>
          </div>
        </nav>

        <div
          id="main-content"
          className="relative z-[2] pt-24 mx-4 md:mx-8 lg:mx-auto max-w-7xl p-4 md:p-6 mb-8"
        >
          {children}
        </div>

        <footer aria-label="site footer" className="py-6 mt-16 relative z-[2]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-surface/60 border border-white/[0.04] rounded-full px-6 py-3 flex items-center justify-between">
              <p className="text-text-muted text-[10px] sm:text-xs">
                data: github api &middot; refreshed daily
              </p>
              {lastUpdated && <LastUpdated dateStr={lastUpdated} />}
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
