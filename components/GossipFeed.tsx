"use client";

import { useState, useEffect } from "react";

const EVENTS = [
  { repo: "graphify-labs/graphify", event: "starred", count: "+1,200" },
  { repo: "anomalyco/opencode", event: "starred", count: "+800" },
  { repo: "koala73/worldmonitor", event: "starred", count: "+1,500" },
  { repo: "tirth8205/code-review-graph", event: "starred", count: "+1,925" },
  { repo: "diegosouzapw/omniroute", event: "starred", count: "+2,034" },
  { repo: "n8n-io/n8n", event: "starred", count: "+300" },
  { repo: "1jehuang/jcode", event: "starred", count: "+843" },
  { repo: "shubhamsaboo/awesome-llm-apps", event: "starred", count: "+200" },
];

export default function GossipFeed() {
  const [items, setItems] = useState(EVENTS.slice(0, 4));

  useEffect(() => {
    const interval = setInterval(() => {
      setItems((prev) => {
        const next = EVENTS[(prev.length) % EVENTS.length];
        return [next, ...prev].slice(0, 5);
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-2 text-xs">
      {items.map((item, i) => (
        <div key={i} className="text-dim">
          {item.repo}
          <span className="text-terminal ml-1">{item.count}</span>
        </div>
      ))}
    </div>
  );
}
