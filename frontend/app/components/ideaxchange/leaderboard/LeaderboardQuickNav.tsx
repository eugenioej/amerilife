"use client";

import { LEADERBOARD_TABLE_CONFIG } from "@/lib/ideaxchange-leaderboard-data";

function scrollToTable(slug: string) {
  document.getElementById(`leaderboard-table-${slug}`)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

export function LeaderboardQuickNav() {
  return (
    <nav
      className="border-b border-[var(--color-border)] bg-[#f7faf9]"
      aria-label="Leaderboard table navigation"
    >
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-8 md:py-10">
        <p className="text-center text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-muted)]">
          Jump to table
        </p>
        <div className="mt-6 flex flex-col gap-8 md:gap-10">
          {LEADERBOARD_TABLE_CONFIG.map((section) => (
            <div key={section.slug} className="text-center">
              <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-[var(--color-brand-primary)]">
                {section.title}
              </h2>
              <ul className="mt-4 flex flex-wrap justify-center gap-2 sm:gap-3">
                {section.tables.map((table) => (
                  <li key={table.slug}>
                    <button
                      type="button"
                      onClick={() => scrollToTable(table.slug)}
                      className="rounded-sm border border-[var(--color-brand-primary)] bg-white px-4 py-2 text-xs font-bold uppercase tracking-wide text-[var(--color-brand-primary)] transition-colors hover:bg-[var(--color-brand-primary)] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)] focus-visible:ring-offset-2"
                    >
                      {table.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
