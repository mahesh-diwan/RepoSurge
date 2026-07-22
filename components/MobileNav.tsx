"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const NAV_LINKS = ["HOME", "DAILY", "WEEKLY", "MONTHLY", "ABOUT"];
const NAV_PATHS = ["/", "/daily", "/weekly", "/monthly", "/about"];

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden text-dim hover:text-terminal transition-colors text-sm"
        aria-label="Toggle menu"
      >
        {open ? "✕" : "☰"}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-midnight/95 flex items-center justify-center md:hidden"
            onClick={() => setOpen(false)}
            style={{ WebkitBackdropFilter: "blur(4px)" }}
          >
            <motion.nav
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex flex-col items-center gap-6"
              onClick={(e) => e.stopPropagation()}
            >
              {NAV_LINKS.map((label, i) => (
                <a
                  key={label}
                  href={NAV_PATHS[i]}
                  className="text-bone/70 hover:text-terminal transition-colors text-lg"
                  onClick={() => setOpen(false)}
                >
                  {label}
                </a>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
