/** Demo standings table — replace with live data when integrations are ready. */
const DEMO_ROWS = [
  { rank: 1, name: "Gulf Coast Region", metric: "12,450 pts", change: "+2" },
  { rank: 2, name: "Southeast Division", metric: "11,820 pts", change: "—" },
  { rank: 3, name: "Mid-Atlantic Team", metric: "10,975 pts", change: "+1" },
  { rank: 4, name: "Central Plains", metric: "9,640 pts", change: "-1" },
  { rank: 5, name: "Pacific Northwest", metric: "8,905 pts", change: "—" },
] as const;

export function IdeaXchangeLeaderboardDemo() {
  return (
    <section
      className="mt-12 md:mt-16"
      aria-labelledby="ideaxchange-leaderboard-heading"
    >
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between md:mb-8">
        <div>
          <h2
            id="ideaxchange-leaderboard-heading"
            className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-brand-primary)]"
          >
            Leaderboard
          </h2>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Monthly incentive standings — demo placeholder
          </p>
        </div>
        <span className="inline-flex w-fit rounded-sm border border-dashed border-[var(--color-brand-primary)]/50 bg-[#f7faf9] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--color-brand-primary)]">
          Demo data
        </span>
      </div>

      <div className="overflow-hidden rounded-lg border border-[var(--color-border)] bg-white shadow-[0_4px_20px_rgba(36,66,96,0.06)]">
        <div className="grid grid-cols-[3rem_1fr_auto_auto] gap-x-4 border-b border-[var(--color-border)] bg-[#f4f8f7] px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted)] sm:grid-cols-[3.5rem_1fr_7rem_4rem] sm:px-6">
          <span>Rank</span>
          <span>Team / Region</span>
          <span className="text-right">Points</span>
          <span className="text-right">Δ</span>
        </div>
        <ol className="divide-y divide-[var(--color-border)]">
          {DEMO_ROWS.map((row) => (
            <li
              key={row.rank}
              className="grid grid-cols-[3rem_1fr_auto_auto] items-center gap-x-4 px-4 py-4 sm:grid-cols-[3.5rem_1fr_7rem_4rem] sm:px-6"
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                  row.rank === 1
                    ? "bg-[var(--color-brand-primary)] text-white"
                    : row.rank === 2
                      ? "bg-[var(--color-brand-dark)]/15 text-[var(--color-brand-dark)]"
                      : row.rank === 3
                        ? "bg-[var(--color-brand-dark)]/10 text-[var(--color-brand-dark)]"
                        : "bg-[var(--color-border)]/60 text-[var(--color-muted)]"
                }`}
              >
                {row.rank}
              </span>
              <span className="font-semibold text-[var(--color-fg)]">{row.name}</span>
              <span className="text-right text-sm font-medium text-[var(--color-brand-dark)]">
                {row.metric}
              </span>
              <span
                className={`text-right text-sm font-semibold ${
                  row.change.startsWith("+")
                    ? "text-[var(--color-brand-primary)]"
                    : row.change.startsWith("-")
                      ? "text-[#c45c5c]"
                      : "text-[var(--color-muted)]"
                }`}
              >
                {row.change}
              </span>
            </li>
          ))}
        </ol>
        <p className="border-t border-[var(--color-border)] bg-[#fafbfc] px-4 py-3 text-center text-xs text-[var(--color-muted)] sm:px-6">
          Full leaderboard and filters will connect here in a future release.
        </p>
      </div>
    </section>
  );
}
