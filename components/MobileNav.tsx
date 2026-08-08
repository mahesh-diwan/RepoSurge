"use client";

import { useState } from "react";
import NavLinks from "./NavLinks";
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
          className="relative w-10 h-10 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span
            className={`absolute block w-5 h-[2px] bg-current transition-all duration-[400ms] ease-[cubic-bezier(0.32,0.72,0,1)] ${
              open ? "rotate-45" : "-translate-y-[3.5px]"
            }`}
            style={{ color: open ? "#D97706" : "#555555" }}
          />
          <span
            className={`absolute block w-5 h-[2px] bg-current transition-all duration-[400ms] ease-[cubic-bezier(0.32,0.72,0,1)] ${
              open ? "-rotate-45" : "translate-y-[3.5px]"
            }`}
            style={{ color: open ? "#D97706" : "#555555" }}
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
          className="fixed inset-0 z-[60] bg-[#0A0A0A]/95 border border-white/[0.06] flex items-center justify-center md:hidden animate-fade-in"
          onClick={close}
          onKeyDown={(e) => {
            if (e.key === "Escape") close();
          }}
        >
          <nav
            className="flex flex-col items-center gap-4 animate-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            <NavLinks links={NAV_LINKS} onItemClick={close} />
          </nav>
        </div>
      )}
    </>
  );
}
