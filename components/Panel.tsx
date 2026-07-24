"use client";

import { useEffect, useCallback, ReactNode } from "react";

type PanelProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

export default function Panel({ open, onClose, children }: PanelProps) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, handleKey]);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-amber-bg border-l border-amber-primary/10 shadow-2xl shadow-black/50 transform transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Repo details"
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-amber-primary/10">
          <h2 className="text-sm font-semibold text-[#F5F5F0] tracking-wider">
            REPO DETAILS
          </h2>
          <button
            onClick={onClose}
            className="text-amber-muted/50 hover:text-cyan-400 transition-colors"
            aria-label="Close panel"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto h-[calc(100%-4rem)]">
          {children}
        </div>
      </div>
    </>
  );
}
