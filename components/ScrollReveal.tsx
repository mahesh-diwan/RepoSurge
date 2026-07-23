"use client";

import { useEffect, useRef, ReactNode } from "react";

export default function ScrollReveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const isInViewport = rect.top < window.innerHeight && rect.bottom >= 0;

    if (isInViewport) return;

    el.style.opacity = "0";
    el.style.transform = "translateY(1rem)";
    el.style.transitionDelay = `${delay}s`;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            (entry.target as HTMLElement).style.opacity = "";
            (entry.target as HTMLElement).style.transform = "";
            (entry.target as HTMLElement).style.transitionDelay = "";
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.unobserve(el);
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className}`}
    >
      {children}
    </div>
  );
}
