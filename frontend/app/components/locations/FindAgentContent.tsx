"use client";

import { MapPin, Phone, ChevronRight } from "lucide-react";
import { Link } from "@/app/components/ui/Link";
import { SiteBreadcrumb } from "@/app/components/layout/SiteBreadcrumb";
import type { LocationData } from "@/lib/locations-data";
import type { GfFormData } from "@/lib/gf-types";
import { GravityForm } from "@/app/components/gravity-forms/GravityForm";

type Props = {
  locations: LocationData[];
  connectForm?: GfFormData | null;
};

export function FindAgentContent({ locations, connectForm }: Props) {
  return (
    <article className="bg-white">
      {/* ── Hero / Search ───────────────────────────────────────────── */}
      <div
        className="relative flex min-h-[520px] flex-col justify-end bg-cover bg-center bg-no-repeat sm:min-h-[580px]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(36, 66, 96, 0.78) 0%, rgba(36, 66, 96, 0.52) 50%, rgba(36, 66, 96, 0.38) 100%), url(https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/03/hero-find-an-agent-scaled.webp)",
        }}
      >
        <div className="mx-auto flex w-full max-w-[var(--container-max)] flex-1 flex-col items-center justify-end px-[var(--container-padding-x)] pb-[40px]">
          <SiteBreadcrumb
            variant="inverse"
            className="mb-6"
            items={[{ label: "Home", href: "/" }, { label: "Find An Agent" }]}
          />

          <div className="w-full min-w-0 max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold text-white sm:text-5xl">
              Find An Agent Near You
            </h1>
            <p className="mb-10 text-lg leading-relaxed text-white/80">
              Find a licensed AmeriLife agent in your area for Medicare, health
              insurance, life insurance, and retirement solutions.
            </p>

            {/* Gravity Form — horizontal pill, same style as the search bar */}
            {connectForm ? (
              <GravityForm form={connectForm} inline />
            ) : null}
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
          <div className="mb-10">
            <h2 className="text-xl font-bold uppercase tracking-[var(--tracking-wide)] text-[var(--color-fg)]">
              Agency Locations
            </h2>
          </div>

          {locations.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2">
              {locations.map((location) => (
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
              <p className="font-semibold text-[var(--color-fg)]">
                No agency locations are available at this time.
              </p>
            </div>
          )}
      </div>
    </div>

    </article>
  );
}
