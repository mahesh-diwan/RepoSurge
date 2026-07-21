"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocalStorage } from "@/hooks/useLocalStorage";

type Prefs = { period: string; language: string };

export default function PrefsRestore() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [prefs] = useLocalStorage<Prefs>("reposurge-prefs", {
    period: "week",
    language: "all",
  });

  useEffect(() => {
    if (searchParams.has("period") || searchParams.has("language")) return;
    if (!prefs) return;

    const params = new URLSearchParams();
    params.set("period", prefs.period);
    params.set("language", prefs.language);
    router.replace(`/?${params.toString()}`);
  }, [prefs, searchParams, router]);

  return null;
}
