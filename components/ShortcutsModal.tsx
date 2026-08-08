"use client";

import { useEffect, useCallback } from "react";
import { useFocusTrap } from "@/lib/useFocusTrap";

const SHORTCUTS = [
  { keys: ["↑", "↓"], desc: "Navigate repo list" },
  { keys: ["Enter"], desc: "Open repo detail" },
  { keys: ["Escape"], desc: "Close panel / modal" },
  { keys: ["/"], desc: "Focus search input" },
  { keys: ["⌘K"], desc: "Focus search input" },
  { keys: ["⌘C"], desc: "Copy selected repo name" },
  { keys: ["?"], desc: "Toggle this menu" },
];

export default function ShortcutsModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const dialogRef = useFocusTrap<HTMLDivElement>(open);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "?" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const handleOverlayKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== "Tab") return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    // Focus trap is handled by useFocusTrap — this prevents Tab from
    // escaping to the overlay behind the dialog
    e.preventDefault();
  }, [dialogRef]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
      onKeyDown={handleOverlayKeyDown}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        aria-labelledby="shortcuts-title"
        className="bg-surface rounded-xl shadow-accent-lg border border-zinc-700/50 p-6 w-[min(320px,calc(100vw-2rem))]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="shortcuts-title"
          className="text-lg font-semibold text-text-body mb-4"
        >
          Keyboard Shortcuts
        </h2>
        <div className="space-y-2">
          {SHORTCUTS.map((s) => (
            <div key={s.keys[0]} className="flex items-center justify-between">
              <span className="text-text-muted text-sm">{s.desc}</span>
              <kbd className="ml-4 px-2 py-0.5 bg-zinc-800 rounded text-text-body text-xs font-mono border border-zinc-600/50">
                {s.keys.join(" ")}
              </kbd>
            </div>
          ))}
        </div>
        <p className="text-text-muted/50 text-xs mt-4 text-center">
          Press{" "}
          <kbd className="px-1 py-0.5 bg-zinc-800 rounded text-[10px] font-mono border border-zinc-600/50">
            ?
          </kbd>{" "}
          or{" "}
          <kbd className="px-1 py-0.5 bg-zinc-800 rounded text-[10px] font-mono border border-zinc-600/50">
            Esc
          </kbd>{" "}
          to close
        </p>
      </div>
    </div>
  );
}
