"use client";

import { useState } from "react";
import { NAV_LINKS } from "@/lib/nav-links";
import { useFocusTrap } from "@/lib/useFocusTrap";

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const dialogRef = useFocusTrap<HTMLDivElement>(open);

  return (
    <>
      <div className="relative z-[51] md:hidden">
        <button
          onClick={() => setOpen(!open)}
          className="relative w-10 h-10 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-[0.97] transition-transform duration-150 cursor-pointer"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span
            className="absolute block w-5 h-[1.5px] rounded-full bg-current transition-[transform] duration-300 ease-spring"
            style={{
              transform: open ? "rotate(45deg) translateY(0)" : "rotate(0deg) translateY(-4px)",
              color: open ? "#D97706" : "#888",
            }}
          />
          <span
            className="absolute block w-5 h-[1.5px] rounded-full bg-current transition-[transform] duration-300 ease-spring"
            style={{
              transform: open ? "rotate(-45deg) translateY(0)" : "rotate(0deg) translateY(4px)",
              color: open ? "#D97706" : "#888",
            }}
          />
        </button>
      </div>

      {open && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="navigation"
          aria-hidden={!open}
          className="fixed inset-0 z-[60] bg-surface/90 backdrop-blur-2xl flex items-center justify-center md:hidden animate-scale-in"
          style={{ transformOrigin: "calc(100% - 2rem) 1.25rem" }}
          onClick={close}
          onKeyDown={(e) => {
            if (e.key === "Escape") close();
          }}
        >
          <nav
            className="flex flex-col items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            {NAV_LINKS.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                onClick={close}
                className="text-lg font-medium text-text-body hover:text-accent transition-colors duration-200 ease-spring px-6 py-3 rounded-2xl hover:bg-white/[0.04] opacity-0 animate-fade-up"
                style={{ animationDelay: `${60 * (i + 1)}ms` }}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
