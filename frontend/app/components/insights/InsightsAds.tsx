import Image from "next/image";

export function AdBannerHorizontal({ label }: { label: string }) {
  return (
    <div className="w-full">
      <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
        Advertisement
      </p>
      <div
        className="flex min-h-[140px] w-full flex-col items-center justify-center gap-2 rounded-sm border border-dashed border-[var(--color-border)] bg-gradient-to-r from-slate-100/90 via-white to-slate-50 px-6 py-8 text-center md:flex-row md:justify-between md:text-left"
        role="region"
        aria-label={`${label} placeholder`}
      >
        <div>
          <p className="text-lg font-bold text-[var(--color-brand-dark)] md:text-xl">
            Ready to go from college to career?
          </p>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Reserve this space for a sponsor or internal campaign.
          </p>
        </div>
        <div className="relative h-24 w-40 shrink-0 overflow-hidden rounded-md bg-[var(--color-border)]/50">
          <Image
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=320&q=80"
            alt=""
            fill
            className="object-cover"
            sizes="160px"
          />
        </div>
      </div>
    </div>
  );
}

export function AdSidebarVertical() {
  return (
    <div className="w-full">
      <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
        Advertisement
      </p>
      <div
        className="flex min-h-[420px] w-full flex-col justify-between rounded-sm border border-dashed border-[var(--color-border)] bg-[#1a2f4a] px-5 py-8 text-white"
        role="region"
        aria-label="Sidebar advertisement placeholder"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-200/90">
            Lead Star · Powered by EnrollHere
          </p>
          <p className="mt-4 text-2xl font-bold leading-tight">
            Better Leads. Better Prices.
          </p>
          <p className="mt-1 text-2xl font-bold italic text-amber-300">
            Better Results.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-white/80">
            Reserve this space for lead partners, events, or product launches.
          </p>
        </div>
        <button
          type="button"
          className="mt-6 w-full rounded-sm bg-amber-500 py-3 text-sm font-bold uppercase tracking-wide text-[var(--color-brand-dark)]"
          disabled
        >
          Sign up to learn more
        </button>
      </div>
    </div>
  );
}
