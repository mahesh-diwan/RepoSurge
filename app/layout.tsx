import type { Metadata } from "next";
import MobileNav from "@/components/MobileNav";
import LastUpdated from "@/components/LastUpdated";
import { getLastUpdated } from "@/lib/db";
import "./globals.css";

export const metadata: Metadata = {
  title: "REPOSURGE - repos rising. fast.",
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-mono">
        <nav className="fixed top-0 left-0 right-0 z-40 bg-midnight/90 border-b border-[#1a1a1a]">
          <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between text-xs tracking-wider">
            <a href="/" className="text-terminal font-bold">
              REP<span className="text-bone">Ø</span>SURGE
            </a>
            <div className="hidden md:flex items-center gap-6">
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
                  className="text-dim hover:text-terminal transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <MobileNav />
          </div>
        </nav>

        <div className="pt-16">{children}</div>

        <footer className="border-t border-[#1a1a1a] py-6 mt-24">
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
