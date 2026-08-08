"use client";

import { usePathname } from "next/navigation";
import NavLinks from "./NavLinks";
import MobileNav from "./MobileNav";
import { NAV_LINKS } from "@/lib/nav-links";

export default function FloatingPill() {
  const pathname = usePathname();

  return (
    <header className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] max-w-2xl">
      <div className="flex items-center justify-between gap-2 px-2 py-1.5 bg-surface-elevated/90 backdrop-blur-md border border-border rounded-full shadow-card">
        <a
          href="/"
          className="font-mono text-accent font-bold text-sm tracking-wider shrink-0 pl-2"
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
