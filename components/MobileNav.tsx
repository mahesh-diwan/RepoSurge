"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
        className="md:hidden w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors duration-300"
        aria-label="Toggle menu"
      >
        <div className="w-4 h-3 flex flex-col justify-between">
          <motion.span
            className="block h-[1.5px] bg-bone origin-left"
            animate={open ? { rotate: 42, y: -0.5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
          />
          <motion.span
            className="block h-[1.5px] bg-bone"
            animate={open ? { opacity: 0, x: -8 } : { opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="block h-[1.5px] bg-bone origin-left"
            animate={open ? { rotate: -42, y: 0.5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
          />
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-midnight/90 backdrop-blur-3xl flex items-center justify-center md:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.nav
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-6"
              onClick={(e) => e.stopPropagation()}
            >
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.1 + i * 0.05,
                    ease: [0.32, 0.72, 0, 1],
                  }}
                  className="text-2xl font-bold tracking-tight text-bone/70 hover:text-electric transition-colors duration-500"
                  style={{ transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)" }}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </motion.a>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
