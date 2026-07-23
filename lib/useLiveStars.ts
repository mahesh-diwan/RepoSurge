"use client";
import { useState, useEffect } from "react";

type LiveData = {
  repos: { full_name: string; stars: number }[];
  timestamp: string;
};

export function useLiveStars() {
  const [starsMap, setStarsMap] = useState<Record<string, number>>({});
  const [live, setLive] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function poll() {
      try {
        const res = await fetch("/api/star-counts");
        if (!res.ok) { setLive(false); return; }
        const data: LiveData = await res.json();
        if (!mounted) return;
        const map: Record<string, number> = {};
        for (const r of data.repos) map[r.full_name] = r.stars;
        setStarsMap(map);
        setLive(true);
      } catch {
        if (mounted) setLive(false);
      }
    }

    poll();
    const id = setInterval(poll, 60_000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  return { starsMap, live };
}
