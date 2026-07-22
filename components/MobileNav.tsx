"use client";

import { useRef, useEffect } from "react";

export default function MobileNav() {
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const menu = menuRef.current;
    const toggle = toggleRef.current;
    if (!menu || !toggle) return;

    const handler = () => menu.classList.toggle("hidden");
    toggle.addEventListener("click", handler);
    return () => toggle.removeEventListener("click", handler);
  }, []);

  return (
    <>
      <button
        ref={toggleRef}
        className="md:hidden text-bone hover:text-electric transition-colors"
        aria-label="Toggle menu"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      <div
        ref={menuRef}
        className="hidden md:hidden py-4 border-t border-bone/20"
      >
        <nav className="flex flex-col gap-3 px-4 text-xs tracking-widest">
          <a
            href="/"
            className="text-bone/70 hover:text-electric transition-colors"
          >
            HOME
          </a>
          <a
            href="/daily"
            className="text-bone/70 hover:text-electric transition-colors"
          >
            DAILY
          </a>
          <a
            href="/weekly"
            className="text-bone/70 hover:text-electric transition-colors"
          >
            WEEKLY
          </a>
          <a
            href="/monthly"
            className="text-bone/70 hover:text-electric transition-colors"
          >
            MONTHLY
          </a>
          <a
            href="/about"
            className="text-bone/70 hover:text-electric transition-colors"
          >
            ABOUT
          </a>
        </nav>
      </div>
    </>
  );
}
