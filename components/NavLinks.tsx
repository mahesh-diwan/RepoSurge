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
        className={`text-xs transition-colors px-3 py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
          isActive
            ? "text-accent border-b-2 border-accent font-medium"
            : "text-muted hover:text-body"
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
