"use client";

import { useRef, useEffect } from "react";

export default function SearchInput({
  value,
  onChange,
  autoFocus,
}: {
  value: string;
  onChange: (v: string) => void;
  autoFocus?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on mount (desktop only)
  useEffect(() => {
    if (autoFocus && window.matchMedia("(pointer: fine)").matches) {
      inputRef.current?.focus();
    }
  }, [autoFocus]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (
        e.key === "/" &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(
          (e.target as HTMLElement).tagName
        )
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim text-sm pointer-events-none">
        /
      </span>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            onChange("");
            (e.target as HTMLInputElement).blur();
          }
        }}
        aria-label="Search repos"
        placeholder="Search repos..."
        className="w-full pl-7 pr-10 py-2 bg-surface border border-border rounded-xl text-sm text-text-body placeholder-text-dim focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-[transform,border-color,box-shadow] duration-150 ease-spring"
      />
      <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-text-dim px-1.5 py-0.5 border border-border-subtle rounded-md hidden sm:block font-mono">
        ⌘K
      </kbd>
    </div>
  );
}
