"use client";

import { useState, useEffect } from "react";

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function LastUpdated({ dateStr }: { dateStr: string }) {
  const [label, setLabel] = useState("");

  useEffect(() => {
    setLabel(timeAgo(dateStr));
    const interval = setInterval(() => setLabel(timeAgo(dateStr)), 60000);
    return () => clearInterval(interval);
  }, [dateStr]);

  if (!label) return null;

  // ponytail: single-line display, no tooltip needed
  return <span className="text-dim text-[10px] sm:text-xs">updated {label}</span>;
}
