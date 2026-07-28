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
            <span
              className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-accent transition-all duration-[400ms] ease-[cubic-bezier(0.32,0.72,0,1)] ${
                isActive ? "w-4" : "w-0"
              }`}
            />
          </Link>
        );
      })}
    </nav>
  );
}
