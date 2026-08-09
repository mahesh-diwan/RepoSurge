"use client";

import { usePathname } from "next/navigation";
import NavLinks from "./NavLinks";
import MobileNav from "./MobileNav";
import Logo from "./Logo";
import { NAV_LINKS } from "@/lib/nav-links";

export default function FloatingPill() {
  const pathname = usePathname();

  return (
    <header className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] max-w-xl">
      <div className="flex items-center justify-between gap-1.5 px-2 py-1.5 rounded-2xl bg-surface-elevated/70 backdrop-blur-2xl border border-border-hairline shadow-card">
        <a
          href="/"
          className="shrink-0 pl-1 transition-transform duration-400 ease-spring hover:scale-105 active:scale-[0.97]"
          title="RepoSurge"
        >
          <Logo className="w-7 h-7" />
        </a>

        <NavLinks links={NAV_LINKS} />
        <MobileNav />
      </div>
    </header>
  );
}
