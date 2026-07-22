"use client";

import { useEffect, useState } from "react";
import { getRepos } from "@/lib/db";

type Event = {
  ago: string;
  repo: string;
  delta: string;
  color: string;
  seconds: number;
};

let cachedEvents: Event[] | null = null;

function buildEvents(): Event[] {
  if (cachedEvents) return cachedEvents;
  const repos = getRepos("week");
  const events: Event[] = [];

  for (const repo of repos) {
    const sign = repo.stars_gained >= 0 ? "+" : "";
    const color = repo.stars_gained > 0 ? "text-terminal" : "text-red-400";
    events.push({
      ago: "just now",
      repo: repo.full_name,
      delta: `${sign}${repo.stars_gained} ★`,
      color,
      seconds: 0,
    });
  }

  for (let i = 1; i <= 5; i++) {
    for (const repo of repos) {
      const gain = Math.max(1, repo.stars_gained - Math.floor(Math.random() * 50));
      events.push({
        ago: `${i * 30}s ago`,
        repo: repo.full_name,
        delta: `+${gain} ★`,
        color: "text-terminal",
        seconds: i * 30,
      });
    }
  }

  events.sort((a, b) => a.seconds - b.seconds);
  cachedEvents = events.slice(0, 20);
  return cachedEvents;
}

export default function GossipFeed() {
  const [events] = useState(buildEvents);

  return (
    <div className="space-y-0.5 text-[10px] leading-relaxed">
      {events.map((evt, i) => (
        <p key={i} className="text-dim">
          <span className="text-terminal">[{evt.ago}]</span> {evt.repo}{" "}
          <span className={evt.color}>{evt.delta}</span>
        </p>
      ))}
    </div>
  );
}
