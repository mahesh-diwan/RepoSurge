"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

type ToastType = "info" | "error" | "undo";

interface ToastInput {
  type: ToastType;
  message: string;
  action?: { label: string; onClick: () => void };
}

interface ToastItem extends ToastInput {
  id: number;
}

interface ToastContextValue {
  toast: (input: ToastInput) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

let nextId = 1;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const toast = useCallback((input: ToastInput) => {
    const id = nextId++;
    setItems((prev) => [...prev.slice(-2), { ...input, id }]);
    setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismiss = useCallback((id: number) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2"
        role="status"
        aria-live="polite"
      >
        {items.map((item) => (
          <div
            key={item.id}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg shadow-lg text-sm cursor-pointer
                        transition-all duration-200 animate-in slide-in-from-right-2
                        ${item.type === "error" ? "bg-red-900/80 text-white" : "bg-zinc-800/90 text-text-body"}`}
            onClick={() => dismiss(item.id)}
          >
            <span>{item.message}</span>
            {item.action && (
              <button
                className="font-medium underline underline-offset-2 hover:no-underline"
                onClick={(e) => {
                  e.stopPropagation();
                  item.action!.onClick();
                  dismiss(item.id);
                }}
              >
                {item.action.label}
              </button>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
