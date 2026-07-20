"use client";

const LANGUAGES = [
  { key: "all", label: "ALL" },
  { key: "javascript", label: "JS" },
  { key: "python", label: "PY" },
  { key: "rust", label: "RS" },
  { key: "go", label: "GO" },
  { key: "typescript", label: "TS" },
  { key: "java", label: "JV" },
] as const;

export default function LanguageFilter({
  selected,
  onChange,
}: {
  selected: string;
  onChange: (key: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.key}
          onClick={() => onChange(lang.key)}
          className={`px-2 py-1 text-xs tracking-widest border border-bone/30 ${
            selected === lang.key
              ? "bg-electric text-midnight"
              : "bg-transparent text-bone hover:bg-bone/10"
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
