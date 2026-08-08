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
      className="hidden md:flex items-center gap-0.5"
    >
      {links.map((link) => {
        const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onItemClick}
            className={`relative text-[11px] font-medium px-3 py-1.5 rounded-full transition-all duration-400 ease-out-expo ${
              isActive
                ? "bg-accent/10 text-accent"
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
