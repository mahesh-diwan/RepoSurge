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
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm pointer-events-none">
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
        className="w-72 pl-7 pr-10 py-2 bg-surface border border-border/30 rounded-lg text-sm text-body placeholder-muted focus:outline-none focus:border-accent focus:bg-surface/50 focus:ring-1 focus:ring-accent/20 transition-all"
      />
      <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-accent/60 px-1.5 py-0.5 border border-border/20 rounded">
        ⌘K
      </kbd>
    </div>
  );
}
