"use client";

import { useEffect, useRef } from "react";

export default function SearchBar() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const handler = () => {
      const query = input.value.toLowerCase();
      document.querySelectorAll("[data-repo-card]").forEach((card) => {
        const el = card as HTMLElement;
        const name = el.dataset.repoName ?? "";
        const desc = el.dataset.repoDesc ?? "";
        const lang = el.dataset.repoLang ?? "";
        const match = name.includes(query) || desc.includes(query) || lang.includes(query);
        el.style.display = match ? "" : "none";
      });
    };

    input.addEventListener("input", handler);
    return () => input.removeEventListener("input", handler);
  }, []);

  return (
    <div className="mb-6">
      <input
        ref={inputRef}
        type="text"
        placeholder="search repos..."
        className="w-full bg-transparent border border-bone/30 px-4 py-3 text-sm text-bone placeholder:text-bone/40 focus:border-electric focus:outline-none transition-colors"
      />
    </div>
  );
}
