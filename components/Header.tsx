"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LiveIndicator from "./LiveIndicator";

export default function Header() {
  const pathname = usePathname();

  // Only show the big header on the home page
  if (pathname !== "/") return null;

  return (
    <header className="px-4 md:px-6 pt-2 pb-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tightest leading-none text-text-body text-balance">
              REPO<span className="text-accent">SURGE</span>
            </h1>
            <LiveIndicator />
          </div>
          <p className="text-text-muted text-sm max-w-md leading-relaxed">
            Track the fastest-growing GitHub repositories by star velocity.
            Updated daily.
          </p>
        </div>
      </div>
    </header>
  );
}
