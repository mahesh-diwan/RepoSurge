"use client";

import { ReactNode } from "react";

export default function Tooltip({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <div className="group relative inline-flex">
      {children}
      <div
        className="pointer-events-none absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full
                      opacity-0 group-hover:opacity-100 transition-opacity duration-150
                      bg-zinc-800 text-text-body text-[11px] px-2 py-1 rounded whitespace-nowrap z-50
                      shadow-lg"
      >
        {label}
      </div>
    </div>
  );
}
