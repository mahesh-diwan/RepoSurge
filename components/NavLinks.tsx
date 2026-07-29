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
    <nav
      role="navigation"
      aria-label="main"
      className="hidden md:flex items-center gap-1"
    >
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onItemClick}
            className={`relative text-xs px-3 py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors duration-300 ${
              isActive
                ? "text-accent font-medium"
                : "text-text-muted hover:text-text-body"
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
