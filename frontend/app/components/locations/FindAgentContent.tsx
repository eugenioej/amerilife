"use client";

import { useState, useMemo } from "react";
import { Search, MapPin, Phone, ChevronRight } from "lucide-react";
import { Link } from "@/app/components/ui/Link";
import type { LocationData } from "@/lib/locations-data";

const PRODUCTS = [
  { value: "", label: "All Products" },
  { value: "medicare", label: "Medicare" },
  { value: "health", label: "Health Insurance" },
  { value: "life", label: "Life Insurance" },
  { value: "annuity", label: "Annuities" },
] as const;

const PRODUCT_CHIPS = PRODUCTS.slice(1);

type Props = {
  locations: LocationData[];
};

export function FindAgentContent({ locations }: Props) {
  const [product, setProduct] = useState("");
  const [zip, setZip] = useState("");

  const filtered = useMemo(() => {
    return locations.filter((loc) => {
      if (product) {
        const hasProduct = loc.features.some((f) => f.icon === product);
        if (!hasProduct) return false;
      }
      if (zip.trim()) {
        const matchZip = loc.address.zip.startsWith(zip.trim());
        const matchCity = loc.address.city
          .toLowerCase()
          .includes(zip.trim().toLowerCase());
        if (!matchZip && !matchCity) return false;
      }
      return true;
    });
  }, [locations, product, zip]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
  }

  return (
    <article className="bg-white">
      {/* ── Hero / Search ───────────────────────────────────────────── */}
      <div
        className="relative flex min-h-[520px] flex-col justify-end bg-cover bg-center bg-no-repeat sm:min-h-[580px]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(36, 66, 96, 0.85) 0%, rgba(36, 66, 96, 0.5) 50%, rgba(36, 66, 96, 0.35) 100%), url(https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/03/hero-find-an-agent-scaled.webp)",
        }}
      >
        <div className="mx-auto flex w-full max-w-[var(--container-max)] flex-1 flex-col items-center justify-end px-[var(--container-padding-x)] pb-[40px]">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm text-white/70" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <li>
                <Link
                  href="/"
                  className="text-white/80 transition-colors hover:text-white no-underline"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-white/60" aria-current="page">
                Find An Agent
              </li>
            </ol>
          </nav>

          <div className="max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold text-white sm:text-5xl">
              Find An Agent Near You
            </h1>
            <p className="mb-10 text-lg leading-relaxed text-white/80">
              Find a licensed AmeriLife agent in your area for Medicare, health
              insurance, life insurance, and retirement solutions.
            </p>

            {/* Search bar */}
            <form
              onSubmit={handleSearch}
              className="overflow-hidden rounded-[var(--radius-full)] bg-white shadow-[var(--shadow-lg)] sm:flex sm:items-stretch"
            >
              <div className="relative flex-1 border-b border-[var(--color-border)] sm:border-b-0 sm:border-r">
                <label htmlFor="product-select" className="sr-only">
                  Select product
                </label>
                <select
                  id="product-select"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  className="h-full w-full appearance-none bg-transparent py-4 pl-6 pr-10 text-[var(--color-fg)] focus:outline-none"
                >
                  {PRODUCTS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
              </div>

              <div className="relative flex-1 border-b border-[var(--color-border)] sm:border-b-0 sm:border-r">
                <label htmlFor="zip-input" className="sr-only">
                  Zip code or city
                </label>
                <input
                  id="zip-input"
                  type="text"
                  placeholder="Zip Code or City"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  className="h-full w-full bg-transparent py-4 pl-6 pr-4 text-[var(--color-fg)] placeholder:text-[var(--color-muted)] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 bg-[var(--color-brand-primary)] px-8 py-4 font-bold uppercase tracking-[var(--tracking-normal)] text-white transition-colors hover:bg-[var(--color-brand-primary-hover)]"
              >
                <Search size={18} aria-hidden />
                Search
              </button>
            </form>

            {/* Quick-filter chips */}
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {PRODUCT_CHIPS.map((chip) => (
                <button
                  key={chip.value}
                  type="button"
                  onClick={() =>
                    setProduct((prev) =>
                      prev === chip.value ? "" : chip.value,
                    )
                  }
                  className={[
                    "rounded-[var(--radius-full)] border px-4 py-1.5 text-sm font-semibold transition-colors",
                    product === chip.value
                      ? "border-white bg-white text-[var(--color-brand-primary)]"
                      : "border-white/40 bg-white/10 text-white hover:bg-white/20",
                  ].join(" ")}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── About section ───────────────────────────────────────────── */}
      <div className="bg-white py-14 lg:py-20">
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-5 text-2xl font-bold text-[var(--color-fg)] sm:text-3xl">
              Agents committed to your wellbeing
            </h2>
            <p className="text-base leading-relaxed text-[var(--color-muted)]">
              Since 1971, AmeriLife has opened agency locations across the
              country to connect consumers with the right coverage. Our licensed
              agents take the time to understand your unique needs and guide you
              to the best Medicare, health, life, and retirement solutions
              available — so you can live a longer, healthier, more secure life.
            </p>
          </div>
        </div>
      </div>

      {/* ── Agency Locations Grid ────────────────────────────────────── */}
      <div className="bg-[#f7f8f9] py-12 lg:py-16">
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
          <div className="mb-10 flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="text-xl font-bold uppercase tracking-[var(--tracking-wide)] text-[var(--color-fg)]">
              Agency Locations
            </h2>
            {filtered.length !== locations.length && (
              <button
                type="button"
                onClick={() => {
                  setProduct("");
                  setZip("");
                }}
                className="text-sm text-[var(--color-link)] underline hover:text-[var(--color-link-hover)]"
              >
                Clear filters ({filtered.length} of {locations.length})
              </button>
            )}
          </div>

          {filtered.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2">
              {filtered.map((location) => (
                <Link
                  key={location.slug}
                  href={`/${location.slug}/`}
                  variant="button"
                  className="group flex flex-col rounded-lg border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)] transition-all hover:border-[var(--color-brand-primary)] hover:shadow-[var(--shadow-md)]"
                >
                  {/* Descriptor heading */}
                  <p className="mb-3 text-xs font-bold uppercase tracking-[var(--tracking-wide)] text-[var(--color-brand-primary)]">
                    AmeriLife Agency
                  </p>

                  <h3 className="mb-4 text-lg font-bold leading-snug text-[var(--color-fg)] transition-colors group-hover:text-[var(--color-brand-primary)]">
                    {location.officeName}
                  </h3>

                  <div className="mt-auto space-y-2 text-sm text-[var(--color-muted)]">
                    <p className="flex items-start gap-2">
                      <MapPin
                        size={16}
                        className="mt-0.5 shrink-0 text-[var(--color-brand-primary)]"
                        aria-hidden
                      />
                      {location.address.line1}
                      {location.address.line2
                        ? `, ${location.address.line2}`
                        : ""}
                      {", "}
                      {location.address.city}, {location.address.state}{" "}
                      {location.address.zip}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone
                        size={16}
                        className="shrink-0 text-[var(--color-brand-primary)]"
                        aria-hidden
                      />
                      {location.phone}
                    </p>
                  </div>

                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-brand-primary)]">
                    View office
                    <ChevronRight size={16} aria-hidden />
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-[var(--color-border)] bg-white px-8 py-12 text-center">
              <p className="mb-2 font-semibold text-[var(--color-fg)]">
                No agencies found matching your search.
              </p>
              <p className="text-sm text-[var(--color-muted)]">
                Try adjusting your product filter or zip code.
              </p>
              <button
                type="button"
                onClick={() => {
                  setProduct("");
                  setZip("");
                }}
                className="mt-4 text-sm text-[var(--color-link)] underline hover:text-[var(--color-link-hover)]"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>

    </article>
  );
}
