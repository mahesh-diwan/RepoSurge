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
        className={`text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-primary ${
          isActive
            ? "text-amber-primary font-bold"
            : "text-amber-muted-light hover:text-amber-primary"
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
