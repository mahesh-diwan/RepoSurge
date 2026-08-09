"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
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
  exiting?: boolean;
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
  const timeouts = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  // Clear all timeouts on unmount
  useEffect(() => {
    return () => {
      for (const id of timeouts.current.values()) {
        clearTimeout(id);
      }
      timeouts.current.clear();
    };
  }, []);

  const dismiss = useCallback((id: number) => {
    const timer = timeouts.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timeouts.current.delete(id);
    }
    // Mark as exiting, then remove after animation
    setItems((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
    setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, 150);
  }, []);

  const toast = useCallback(
    (input: ToastInput) => {
      const id = nextId++;
      setItems((prev) => [...prev.slice(-2), { ...input, id, exiting: false }]);
      const timer = setTimeout(() => {
        timeouts.current.delete(id);
        setItems((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
        setTimeout(() => {
          setItems((prev) => prev.filter((t) => t.id !== id));
        }, 150);
      }, 4000);
      timeouts.current.set(id, timer);
    },
    [],
  );

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
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl shadow-accent text-sm cursor-pointer
                        transition-[transform,opacity] duration-200
                        ${item.exiting ? "opacity-0 translate-y-2" : "animate-in slide-in-from-right-2"}
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
