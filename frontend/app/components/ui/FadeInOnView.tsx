"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Custom threshold 0-1 for intersection. Default 0.1 */
  threshold?: number;
};

export function FadeInOnView({ children, className = "", threshold = 0.1 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const q = window.matchMedia("(prefers-reduced-motion: reduce)");
    requestAnimationFrame(() => setPrefersReducedMotion(q.matches));
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    q.addEventListener("change", handler);
    return () => q.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, prefersReducedMotion]);

  return (
    <div
      ref={ref}
      className={
        prefersReducedMotion
          ? className
          : `${className} transition-all duration-700 ease-out ${
              visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`
      }
    >
      {children}
    </div>
  );
}
