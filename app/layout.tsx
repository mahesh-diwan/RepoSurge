import type { Metadata } from "next";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/700.css";
import "@fontsource/dm-mono/400.css";
import "@fontsource/dm-mono/500.css";
import FloatingPill from "@/components/FloatingPill";
import MobileTabBar from "@/components/MobileTabBar";
import LastUpdated from "@/components/LastUpdated";
import Logo from "@/components/Logo";
import { getLastUpdated } from "@/lib/db";
import "./globals.css";

export const metadata: Metadata = {
  title: "RepoSurge - GitHub star velocity leaderboard",
  description: "Track the top 50 GitHub repos by star velocity. Daily, weekly, monthly rankings with live polling.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "RepoSurge",
    description: "GitHub star velocity leaderboard - track the fastest-growing repos",
    url: "https://reposurge.vercel.app",
    siteName: "RepoSurge",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RepoSurge",
    description: "GitHub star velocity leaderboard",
  },
};

const lastUpdated = getLastUpdated();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans bg-midnight relative">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-surface focus:text-accent focus:outline-1 focus:outline-accent"
        >
          Skip to content
        </a>
        <div className="md:hidden">
          <MobileTabBar />
        </div>
        <div className="hidden md:block">
          <FloatingPill />
        </div>

        <div id="main-content" className="relative z-[2] pt-16 md:pt-20 pb-20 md:pb-20 pb-24">
          {children}
        </div>

        <footer className="border-t border-border py-10 relative z-[2]">
          <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Logo className="w-5 h-5" />
              <span className="text-sm font-semibold text-text-body tracking-tighter">
                REPO<span className="text-accent">SURGE</span>
              </span>
              <span className="text-text-dim text-xs">-</span>
              <p className="text-text-dim text-xs">
                Data from GitHub API - refreshed daily
              </p>
            </div>
            {lastUpdated && <LastUpdated dateStr={lastUpdated} />}
          </div>
        </footer>
      </body>
    </html>
  );
}
