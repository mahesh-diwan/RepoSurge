import Link from "next/link";

const TABS = [
  { key: "day", label: "DAY" },
  { key: "week", label: "WEEK" },
  { key: "month", label: "MONTH" },
  { key: "6m", label: "6MO" },
  { key: "year", label: "YEAR" },
] as const;

export default function TimeTabs({
  selected,
  language,
}: {
  selected: string;
  language: string;
}) {
  return (
    <div className="flex flex-wrap border border-bone/30">
      {TABS.map((tab) => (
        <Link
          key={tab.key}
          href={`/?period=${tab.key}&language=${language}`}
          className={`px-3 py-2 text-xs tracking-widest border-r border-bone/30 last:border-r-0 ${
            selected === tab.key
              ? "bg-electric text-midnight"
              : "bg-transparent text-bone hover:bg-bone/10"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
