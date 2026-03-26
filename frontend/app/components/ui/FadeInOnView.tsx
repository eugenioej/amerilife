"use client";

import { useRef, useState, useEffect, type CSSProperties, type ReactNode } from "react";

export type FadeInDirection = "up" | "left" | "right" | "fade";

type Props = {
  children: ReactNode;
  className?: string;
  /** Merged onto the wrapper (e.g. background gradients). */
  style?: CSSProperties;
  /** Custom threshold 0-1 for intersection. Default 0.1 */
  threshold?: number;
  direction?: FadeInDirection;
  /** Stagger delay in ms (transition-delay when animating in). */
  delay?: number;
  /** When true, skip intersection observer (e.g. above-fold hero). */
  initialVisible?: boolean;
};

function hiddenClasses(direction: FadeInDirection): string {
  switch (direction) {
    case "up":
      return "translate-y-6 opacity-0";
    case "left":
      return "-translate-x-6 opacity-0";
    case "right":
      return "translate-x-6 opacity-0";
    case "fade":
      return "opacity-0";
    default:
      return "translate-y-6 opacity-0";
  }
}

function visibleClasses(): string {
  return "translate-x-0 translate-y-0 opacity-100";
}

export function FadeInOnView({
  children,
  className = "",
  style: styleProp,
  threshold = 0.1,
  direction = "up",
  delay = 0,
  initialVisible = false,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(initialVisible);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const q = window.matchMedia("(prefers-reduced-motion: reduce)");
    requestAnimationFrame(() => setPrefersReducedMotion(q.matches));
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    q.addEventListener("change", handler);
    return () => q.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || initialVisible) {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, prefersReducedMotion, initialVisible]);

  const mergedStyle: CSSProperties = {
    ...(styleProp ?? {}),
    ...(delay > 0 ? { transitionDelay: `${delay}ms` } : {}),
  };

  if (prefersReducedMotion) {
    return (
      <div ref={ref} className={className} style={styleProp}>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      style={mergedStyle}
      className={`${className} transition-all duration-700 ease-out ${
        visible ? visibleClasses() : hiddenClasses(direction)
      }`}
    >
      {children}
    </div>
  );
}
