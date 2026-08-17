"use client";

/** Client shell for `<article>` + inner width row so SSR and hydration share one module (avoids layout skew). */
export function InsightPostChrome({ children }: { children: React.ReactNode }) {
  return (
    <article className="bg-white pb-16 md:pb-20 global-article">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] pt-8 md:pt-10">
        {children}
      </div>
    </article>
  );
}
