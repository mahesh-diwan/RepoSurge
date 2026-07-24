"use client";

import { useRef, useEffect } from "react";

export default function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-muted/40 text-sm pointer-events-none">
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
        placeholder="search repos..."
        className="w-72 pl-7 pr-10 py-2 bg-[#1A1200] border border-amber-muted/20 rounded-lg text-sm text-[#F5F5F0] placeholder-amber-muted/30 focus:outline-none focus:border-cyan-400/40 focus:bg-amber-bg/80 focus:ring-1 focus:ring-cyan-400/20 transition-all"
      />
      <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-cyan-400/60 px-1.5 py-0.5 border border-amber-muted/15 rounded">
        ⌘K
      </kbd>
    </div>
  );
}
