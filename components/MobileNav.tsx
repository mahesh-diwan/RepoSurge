"use client";

import { useState, useRef, useEffect } from "react";
import NavLinks from "./NavLinks";
import { NAV_LINKS } from "@/lib/nav-links";

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    const focusable = dialog.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();

    function trap(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    }

    dialog.addEventListener("keydown", trap);
    return () => dialog.removeEventListener("keydown", trap);
  }, [open]);

  return (
    <>
      <div className="relative z-[51]">
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-amber-muted hover:text-amber-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-primary focus-visible:ring-offset-2 focus-visible:ring-offset-amber-bg active:text-amber-primary/70 transition-colors text-sm p-3 -m-3 min-w-[44px] text-center cursor-pointer"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="navigation"
          aria-hidden={!open}
          className="fixed inset-0 z-50 bg-amber-bg/95 backdrop-blur-sm flex items-center justify-center md:hidden animate-fade-in"
          onClick={close}
          onKeyDown={(e) => { if (e.key === "Escape") close(); }}
        >
          <nav
            className="flex flex-col items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <NavLinks links={NAV_LINKS} onItemClick={close} />
          </nav>
        </div>
      )}
    </>
  );
}
