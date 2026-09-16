'use client';

import { useEffect, useState } from 'react';

const SHOW_AFTER = 350;
const RADIUS = 21;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function BackToTop() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      const progress =
        scrollableHeight > 0
          ? Math.min(scrollTop / scrollableHeight, 1)
          : 0;

      setScrollProgress(progress);
      setIsVisible(scrollTop > SHOW_AFTER);

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollProgress);
        ticking = true;
      }
    };

    updateScrollProgress();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const handleClick = () => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  const strokeOffset =
    CIRCUMFERENCE - scrollProgress * CIRCUMFERENCE;

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Back to top"
      title="Back to top"
      className={[
        'fixed bottom-5 right-5 md:bottom-8 md:right-8 z-50',
        'flex h-12 w-12 items-center justify-center',
        'rounded-full',
        'bg-white',
        'text-slate-700',
        'shadow-md',
        'ring-1 ring-slate-200',
        'transition duration-200',
        'motion-reduce:transition-none',
        'hover:bg-slate-50',
        'hover:text-[#091229]',
        'hover:-translate-y-0.5',
        'motion-reduce:hover:translate-y-0',
        'focus-visible:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-[#091229]',
        'focus-visible:ring-offset-2',
        isVisible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-2 opacity-0',
      ].join(' ')}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 48 48"
        className="absolute inset-0 h-full w-full -rotate-90"
      >
        <circle
          cx="24"
          cy="24"
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          className="text-slate-200"
        />

        <circle
          cx="24"
          cy="24"
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={strokeOffset}
          className="text-[#3fa590] transition-[stroke-dashoffset] duration-100 motion-reduce:transition-none"
        />
      </svg>

      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        className="relative h-5 w-5 sm:h-6 sm:w-6"
      >
        <path
          d="M12 19V5M6.5 10.5 12 5l5.5 5.5"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}