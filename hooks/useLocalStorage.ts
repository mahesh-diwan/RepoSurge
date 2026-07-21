"use client";

import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [stored, setStored] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(stored));
    } catch {
      // quota exceeded or private browsing
    }
  }, [key, stored]);

  return [stored, setStored] as const;
}
