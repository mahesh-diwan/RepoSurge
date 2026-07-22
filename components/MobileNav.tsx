"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const NAV_LINKS = [
  { href: "/", label: "HOME" },
  { href: "/daily", label: "DAILY" },
  { href: "/weekly", label: "WEEKLY" },
  { href: "/monthly", label: "MONTHLY" },
  { href: "/about", label: "ABOUT" },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden text-dim hover:text-terminal transition-colors text-xs tracking-wider"
        aria-label="Toggle menu"
      >
        [{open ? "X" : "="}]
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-midnight flex items-center justify-center md:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.nav
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-6"
              onClick={(e) => e.stopPropagation()}
            >
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-bone/70 hover:text-terminal transition-colors text-lg tracking-wider"
                  onClick={() => setOpen(false)}
                >
                  <span className="text-terminal">&gt;</span> {link.label}
                </a>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
