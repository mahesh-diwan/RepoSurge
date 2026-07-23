"use client";
import { useState, useEffect } from "react";

type LiveData = {
  repos: { full_name: string; stars: number }[];
  timestamp: string;
};

export function useLiveStars() {
  const [starsMap, setStarsMap] = useState<Record<string, number>>({});
  const [live, setLive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function poll() {
      try {
        const res = await fetch("/api/star-counts");
        if (!res.ok) {
          if (mounted) {
            setLive(false);
            setError("API returned " + res.status);
          }
          return;
        }
        const body = await res.json();
        if (!mounted) return;
        if (!body.ok) {
          setLive(false);
          setError(body.error?.message ?? "Unknown error");
          return;
        }
        const map: Record<string, number> = {};
        for (const r of body.data.repos) map[r.full_name] = r.stars;
        setStarsMap(map);
        setLive(true);
        setError(null);
      } catch {
        if (mounted) {
          setLive(false);
          setError("Connection failed");
        }
      }
    }

    poll();
    const id = setInterval(poll, 60_000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  return { starsMap, live, error };
}
