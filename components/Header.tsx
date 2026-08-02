"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LiveIndicator from "./LiveIndicator";

const links = [
  { href: "/daily", label: "daily" },
  { href: "/weekly", label: "weekly" },
  { href: "/monthly", label: "monthly" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="px-4 md:px-6 pt-6 pb-4 relative z-[2]">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="font-sans text-3xl md:text-4xl font-bold tracking-[-0.04em] leading-none text-text-body">
            REPO<span className="text-accent">SURGE</span>
          </h1>
          <LiveIndicator />
        </div>

        <nav className="flex items-center gap-1 bg-surface border border-border rounded-xl p-1">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  active
                    ? "bg-accent/10 text-accent shadow-sm"
                    : "text-text-muted hover:text-text-body"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
