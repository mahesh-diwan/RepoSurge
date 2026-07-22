"use client";

export default function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-dim text-xs pointer-events-none select-none" aria-hidden="true">
        &gt;
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="filter repos..."
        className="w-full bg-transparent border border-[#1a1a1a] pl-7 pr-3 py-2 text-xs text-bone placeholder-dim focus:outline-none focus:border-terminal focus:bg-terminal/5 transition-all"
      />
    </div>
  );
}
