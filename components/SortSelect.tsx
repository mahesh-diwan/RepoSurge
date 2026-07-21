"use client";

import { useEffect, useRef } from "react";

export default function SortSelect() {
  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    const select = selectRef.current;
    if (!select) return;

    const handler = () => {
      const container = document.getElementById("repo-list");
      if (!container) return;
      const cards = Array.from(container.querySelectorAll("[data-repo-card]"));
      const key = select.value;
      cards.sort((a, b) => {
        const aEl = a as HTMLElement;
        const bEl = b as HTMLElement;
        if (key === "name") return (aEl.dataset.repoName ?? "").localeCompare(bEl.dataset.repoName ?? "");
        const field = `repoSort${key.charAt(0).toUpperCase() + key.slice(1)}`;
        const aVal = parseInt(aEl.dataset[field] ?? "0");
        const bVal = parseInt(bEl.dataset[field] ?? "0");
        return bVal - aVal;
      });
      cards.forEach((card) => container.appendChild(card));
    };

    select.addEventListener("change", handler);
    return () => select.removeEventListener("change", handler);
  }, []);

  return (
    <div className="mb-4 flex items-center gap-2">
      <label htmlFor="sort-select" className="text-bone/50 text-xs tracking-widest">
        SORT BY
      </label>
      <select
        ref={selectRef}
        id="sort-select"
        className="bg-transparent border border-bone/30 px-3 py-2 text-xs text-bone focus:border-electric focus:outline-none"
      >
        <option value="gained">Stars Gained</option>
        <option value="velocity">Velocity</option>
        <option value="total">Total Stars</option>
        <option value="name">Name</option>
      </select>
    </div>
  );
}
