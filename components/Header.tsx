"use client";

import { usePathname } from "next/navigation";
import LiveIndicator from "./LiveIndicator";
import Logo from "./Logo";

export default function Header() {
  const pathname = usePathname();

  if (pathname !== "/") return null;

  return (
    <header className="px-4 md:px-6 pt-6 pb-4">
      <div className="flex items-center gap-3">
        <Logo className="w-9 h-9" />
        <h1 className="text-3xl md:text-4xl font-black tracking-[-0.05em] leading-none text-text-body">
          REPO<span className="text-accent">SURGE</span>
        </h1>
        <LiveIndicator />
      </div>
    </header>
  );
}
