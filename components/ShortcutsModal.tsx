"use client";

import { useCallback, useEffect, useRef } from "react";

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
  const dialogRef = useRef<HTMLDivElement>(null);

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

  // Auto-focus dialog on mount
  useEffect(() => {
    if (open && dialogRef.current) {
      dialogRef.current.focus();
    }
  }, [open]);

  const handleOverlayKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== "Tab") return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    const focusable = dialog.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) {
      e.preventDefault();
      dialog.focus();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else if (document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

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
        className="bg-surface rounded-xl shadow-2xl border border-zinc-700/50 p-6 min-w-[320px]"
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
