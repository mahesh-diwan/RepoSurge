"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLinks({
  links,
  onItemClick,
}: {
  links: { href: string; label: string }[];
  onItemClick?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav role="navigation" aria-label="main" className="flex items-center gap-6">
      {links.map((link) => {
    const isActive = pathname === link.href;
    return (
      <Link
        key={link.href}
        href={link.href}
        onClick={onItemClick}
        className={`text-xs transition-colors px-3 py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
          isActive
            ? "bg-accent text-black font-bold shadow-[0_0_8px_rgba(34,211,238,0.3)]"
            : "text-amber-muted-light hover:text-cyan-400 hover:bg-accent/10"
        }`}
        aria-current={isActive ? "page" : undefined}
      >
        {link.label}
      </Link>
    );
  })}
    </nav>
  );
}
