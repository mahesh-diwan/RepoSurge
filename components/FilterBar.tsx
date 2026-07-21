import Link from "next/link";

const TABS = [
  { key: "day", label: "DAY" },
  { key: "week", label: "WEEK" },
  { key: "month", label: "MONTH" },
  { key: "6m", label: "6MO" },
  { key: "year", label: "YEAR" },
];

const LANGUAGES = [
  { key: "all", label: "ALL" },
  { key: "javascript", label: "JS" },
  { key: "python", label: "PY" },
  { key: "rust", label: "RS" },
  { key: "go", label: "GO" },
  { key: "typescript", label: "TS" },
  { key: "java", label: "JV" },
];

export default function FilterBar({
  period,
  language,
}: {
  period: string;
  language: string;
}) {
  return (
    <div className="flex flex-col gap-3 mb-6 glass p-4">
      <div className="flex flex-wrap border border-bone/30" role="tablist">
        {TABS.map((tab) => (
          <Link
            key={tab.key}
            href={`/?period=${tab.key}&language=${language}`}
            className={`px-3 py-2 text-xs tracking-widest border-r border-bone/30 last:border-r-0 ${
              period === tab.key
                ? "bg-electric text-midnight"
                : "bg-transparent text-bone hover:bg-bone/10"
            }`}
            aria-current={period === tab.key ? "page" : undefined}
            role="tab"
            aria-selected={period === tab.key}
          >
            {tab.label}
          </Link>
        ))}
      </div>
      <div className="flex flex-wrap gap-1" role="tablist">
        {LANGUAGES.map((lang) => (
          <Link
            key={lang.key}
            href={`/?period=${period}&language=${lang.key}`}
            className={`px-2 py-1 text-xs tracking-widest border border-bone/30 ${
              language === lang.key
                ? "bg-electric text-midnight"
                : "bg-transparent text-bone hover:bg-bone/10"
            }`}
            aria-current={language === lang.key ? "page" : undefined}
            role="tab"
            aria-selected={language === lang.key}
          >
            {lang.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
