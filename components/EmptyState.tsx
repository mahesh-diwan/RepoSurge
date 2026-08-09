"use client";

import Link from "next/link";
import { X } from "./icons";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  action?: { label: string; href?: string; onClick?: () => void };
}

export default function EmptyState({ icon = "◐", title, description, action }: EmptyStateProps) {
  return (
    <div className="py-20 text-center animate-fade-up">
      <div className="inline-flex flex-col items-center gap-4 max-w-sm">
        <div className="w-14 h-14 rounded-2xl bg-surface-elevated border border-border flex items-center justify-center animate-float">
          <span className="text-text-dim text-xl">{icon}</span>
        </div>
        <div>
          <p className="text-text-body text-sm font-medium mb-1">{title}</p>
          <p className="text-text-dim text-xs leading-relaxed">{description}</p>
        </div>
        {action && (
          action.href ? (
            <Link
              href={action.href}
              className="inline-flex items-center gap-1.5 text-xs font-mono bg-accent/10 text-accent px-3 py-1.5 rounded-full hover:bg-accent/20 active:scale-[0.97] transition-[transform,background-color] duration-200 ease-spring"
            >
              {action.label}
            </Link>
          ) : (
            <button
              onClick={action.onClick}
              className="inline-flex items-center gap-1.5 text-xs font-mono bg-accent/10 text-accent px-3 py-1.5 rounded-full hover:bg-accent/20 active:scale-[0.97] transition-[transform,background-color] duration-200 ease-spring"
            >
              {action.label}
            </button>
          )
        )}
      </div>
    </div>
  );
}
