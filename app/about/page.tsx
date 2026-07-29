import { type Metadata } from "next";
import { getStats } from "@/lib/db";

export const metadata: Metadata = {
  title: "about - reposurge",
  description: "how reposurge tracks star velocity on github",
};

export default function AboutPage() {
  const stats = getStats();

  const cards = [
    { value: stats.totalRepos.toLocaleString("en-US"), label: "repos tracked" },
    { value: (stats.totalStars / 1000).toFixed(1) + "M", label: "total stars" },
    { value: stats.languages.toString(), label: "languages" },
  ];

  return (
    <main className="max-w-2xl mx-auto px-6 pt-20">
      <h1 className="font-sans text-text-body text-xl font-semibold tracking-tight mb-1">
        ABOUT REPOSURGE
      </h1>
      <p className="font-sans text-text-muted/50 text-xs mb-8">
        star velocity tracker for github
      </p>

      <div className="grid grid-cols-3 gap-3 mb-10">
        {cards.map((card) => (
          <div key={card.label} className="bg-surface border border-border rounded-2xl px-4 py-4 text-center">
            <p className="font-mono text-text-body font-bold text-2xl tabular-nums">{card.value}</p>
            <p className="font-sans text-text-muted text-[10px] tracking-widest mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-surface border border-border rounded-2xl px-5 py-4 mb-4">
        <p className="font-sans text-text-body text-xs font-medium mb-2">velocity formula</p>
        <p className="font-mono text-text-muted text-xs">
          velocity = (gained / baseline) &times; 1000
        </p>
        <p className="font-sans text-text-muted/40 text-[10px] mt-2 leading-relaxed">
          Repos are ranked by star velocity: the rate at which a repository gains
          stars relative to its existing count. Higher velocity = faster relative growth.
        </p>
      </div>

      <div className="bg-surface border border-border rounded-2xl px-5 py-4">
        <p className="font-sans text-text-body text-xs font-medium mb-2">data</p>
        <p className="font-sans text-text-muted text-[10px] leading-relaxed">
          github api &middot; refreshed daily &middot; next.js 14 &middot; react 18 &middot; tailwind css
        </p>
      </div>
    </main>
  );
}
