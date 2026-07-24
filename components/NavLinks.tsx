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
        className={`px-3 py-1.5 rounded-none text-xs transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-primary focus-visible:ring-offset-2 focus-visible:ring-offset-amber-bg active:bg-amber-primary/20 ${
          isActive
            ? "bg-amber-primary text-amber-bg font-bold shadow-[0_0_8px_#FFB000/30]"
            : "text-amber-muted hover:bg-amber-primary/10 hover:text-amber-primary"
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
