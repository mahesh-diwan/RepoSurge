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
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-muted text-xs pointer-events-none select-none" aria-hidden="true">
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
        title="Type to filter repos"
        className="w-full bg-transparent border border-amber-muted/20 pl-7 pr-3 py-3.5 text-xs text-amber-primary placeholder-amber-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-primary focus-visible:border-amber-primary focus-visible:bg-amber-primary/5 transition-all"
      />
    </form>
  );
}
