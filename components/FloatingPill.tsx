"use client";

import { usePathname } from "next/navigation";
import NavLinks from "./NavLinks";
import MobileNav from "./MobileNav";
import { NAV_LINKS } from "@/lib/nav-links";

export default function FloatingPill() {
  const pathname = usePathname();

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-2xl">
      <div className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-full bg-surface-elevated/80 backdrop-blur-xl border border-border shadow-card">
        <a
          href="/"
          className="font-mono text-accent font-bold text-sm tracking-tight shrink-0 pl-2 transition-transform duration-500 ease-out-expo hover:scale-105"
          title="RepoSurge"
        >
          [RS]
        </a>

        <NavLinks links={NAV_LINKS} />
        <MobileNav />
      </div>
    </header>
  );
}
