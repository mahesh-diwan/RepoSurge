import type { Metadata } from "next";
import "@fontsource/chivo/400.css";
import "@fontsource/chivo/500.css";
import "@fontsource/chivo/700.css";
import "@fontsource/fragment-mono/400.css";
import FloatingPill from "@/components/FloatingPill";
import LastUpdated from "@/components/LastUpdated";
import { getLastUpdated } from "@/lib/db";
import "./globals.css";

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
    <html lang="en">
      <body className="font-sans bg-midnight relative z-[2]">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-surface focus:text-accent focus:outline-1 focus:outline-accent"
        >
          skip to content
        </a>
        <FloatingPill />

        <div
          id="main-content"
          className="relative z-[2] max-w-7xl mx-auto px-6 pt-20 pb-16"
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
