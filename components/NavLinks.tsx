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
    <nav role="navigation" aria-label="main">
      {links.map((link) => {
    const isActive = pathname === link.href;
    return (
      <Link
        key={link.href}
        href={link.href}
        onClick={onItemClick}
        className={`px-3 py-1.5 rounded-none text-xs transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terminal focus-visible:ring-offset-2 focus-visible:ring-offset-midnight active:bg-terminal/20 ${
          isActive
            ? "bg-terminal text-midnight font-bold shadow-[0_0_8px_#00FF41/30]"
            : "text-dim hover:bg-terminal/10 hover:text-bone"
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
