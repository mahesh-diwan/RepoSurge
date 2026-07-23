"use client";

export default function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <form role="search" className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-dim text-xs pointer-events-none select-none" aria-hidden="true">
        &gt;
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            onChange("");
            (e.target as HTMLInputElement).blur();
          }
        }}
        placeholder="filter repos..."
        className="w-full bg-transparent border border-[#1a1a1a] pl-7 pr-3 py-3.5 text-xs text-bone placeholder-dim focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terminal focus-visible:border-terminal focus-visible:bg-terminal/5 transition-all"
      />
    </form>
  );
}
