"use client";

const TABS = [
  { key: "day", label: "DAY" },
  { key: "week", label: "WEEK" },
  { key: "month", label: "MONTH" },
  { key: "6m", label: "6MO" },
  { key: "year", label: "YEAR" },
] as const;

export type Period = (typeof TABS)[number]["key"];

export default function TimeTabs({
  selected,
  onChange,
}: {
  selected: string;
  onChange: (key: string) => void;
}) {
  return (
    <div className="flex border border-bone/30">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`px-3 py-2 text-xs tracking-widest border-r border-bone/30 last:border-r-0 ${
            selected === tab.key
              ? "bg-electric text-midnight"
              : "bg-transparent text-bone hover:bg-bone/10"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
