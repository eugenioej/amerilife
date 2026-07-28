"use client";

import Image from "next/image";
import { MapPin, Clock, ShieldCheck } from "lucide-react";
import { Link } from "@/app/components/ui/Link";
import { SiteBreadcrumb } from "@/app/components/layout/SiteBreadcrumb";
import { FeaturesGrid } from "./FeaturesGrid";
import {
  LICENSED_INSURANCE_AGENT_LABEL,
  agentJobTitleLine,
  type AgentData,
  type LocationData,
} from "@/lib/locations-data";

type Props = {
  agent: AgentData;
  location: LocationData;
};

/* Hidden for now — action bar + “View location details & hours” link
const ACTION_BUTTONS = [
  { icon: MapPin, label: "Location" },
  { icon: Mail, label: "Email" },
  { icon: Calendar, label: "Make Appointment" },
  { icon: Phone, label: "Call" },
  { icon: DollarSign, label: "Get A Quote" },
] as const;
*/

const SECTION_IMAGE_URL =
  "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/03/ACAP_CS-ESG_AmeriLife_1024x358-FIFU-1024x683-1.png";

export function AgentDetailTemplate({ agent, location }: Props) {
  const initials = agent.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  const addressLines = [
    location.address.line1,
    location.address.line2,
    `${location.address.city}, ${location.address.state} ${location.address.zip}`,
  ].filter(Boolean);

  const hours = location.hours.split("\n");
  const jobTitle = agentJobTitleLine(agent);

  return (
    <article className="bg-white">

      {/* ── Breadcrumb ───────────────────────────────────────────────── */}
      <div className="bg-white py-3 sm:py-5">
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
          <SiteBreadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Find An Agent", href: "/find-an-agent/" },
              { label: location.officeName, href: `/${location.slug}/` },
              { label: agent.name },
            ]}
          />
        </div>
      </div>

      {/* ── Teal Hero Band ───────────────────────────────────────────── */}
      <div className="bg-[var(--color-brand-primary)] py-6 sm:py-8">
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6 lg:gap-8">

            {/* Photo */}
            <div className="relative mx-auto h-[160px] w-[160px] shrink-0 overflow-hidden rounded-lg bg-[rgba(0,0,0,0.15)] sm:mx-0 sm:h-[200px] sm:w-[200px] lg:h-[240px] lg:w-[240px]">
              {agent.photoUrl ? (
                <Image
                  src={agent.photoUrl}
                  alt={`${agent.name} – ${LICENSED_INSURANCE_AGENT_LABEL}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 160px, (max-width: 1024px) 200px, 240px"
                />
              ) : (
                <div
                  className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-white/60"
                  aria-hidden
                >
                  {initials}
                </div>
              )}
            </div>

            {/* Name / role / city */}
            <div className="min-w-0 shrink-0 text-center sm:text-left">
              <h1 className="mb-0.5 text-xl font-bold text-white sm:text-2xl lg:text-3xl">
                {agent.name}
              </h1>
              {jobTitle ? (
                <p className="mb-0.5 text-sm text-white/70 sm:text-left">{jobTitle}</p>
              ) : null}
              <p className="mb-0.5 flex items-center justify-center gap-1.5 text-sm text-white/80 sm:justify-start">
                <ShieldCheck className="size-4 shrink-0 text-white" aria-hidden />
                <span>{LICENSED_INSURANCE_AGENT_LABEL}</span>
              </p>
              <p className="mb-3 text-sm text-white/80">
                {agent.city}, {agent.state}
              </p>
            </div>

            {/* Vertical divider */}
            <div className="hidden h-20 w-px bg-white/30 sm:block" aria-hidden />

            {/* Bio */}
            {agent.bio && (
              <p className="">
                {agent.email?.trim() ? (
                      <a
                        className="w-fit text-sm italic leading-relaxed text-white/90 sm:text-base underline  underline-offset-[5px]"
                        href={`mailto:${agent.email.trim()}`}
                      >
                        {agent.email.trim()}
                      </a>
                    ) : null}
              </p>
            )}
          </div>
        </div>
      </div>

      {/*
      ── Action buttons bar (white card, overlapping) ───────────────
      <div className="bg-white shadow-[var(--shadow-md)]">
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
          <div className="grid grid-cols-2 gap-px bg-[var(--color-border)] sm:flex sm:divide-x sm:divide-[var(--color-border)] sm:gap-0">
            {ACTION_BUTTONS.map(({ icon: Icon, label }) => (
              <button
                key={label}
                type="button"
                className="group flex flex-1 flex-col items-center gap-1.5 bg-white py-3 transition-colors hover:bg-[#f7f8f9] sm:gap-2 sm:py-5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)] transition-colors group-hover:bg-[var(--color-brand-primary)] group-hover:text-white sm:h-11 sm:w-11">
                  <Icon size={18} aria-hidden />
                </span>
                <span className="text-[10px] font-semibold text-[var(--color-fg)] sm:text-xs">
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      ── View location details & hours (points down to section) ──────
      <a
        href="#location-details"
        className="block bg-[var(--color-brand-primary)]/8 border-t border-[var(--color-border)] py-3 text-center text-sm font-semibold text-[var(--color-brand-primary)] transition-colors hover:text-[var(--color-brand-primary-hover)] no-underline sm:py-4"
      >
        <span className="inline-flex items-center gap-2">
          View location details &amp; hours
          <ChevronDown size={18} aria-hidden />
        </span>
      </a>
      */}

      {/* ── Combined section: Image left | More Details + Location & Hours ─ */}
      <div id="location-details" className="scroll-mt-[calc(var(--header-height)+1rem)] border-t border-[var(--color-border)] bg-white">
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-8 sm:py-12 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[360px_1fr] lg:gap-12">

            {/* Left: Section image (not agent photo) */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-[#e8e9eb] lg:aspect-square lg:max-w-[360px]">
              <Image
                src={SECTION_IMAGE_URL}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 360px"
                quality={90}
              />
            </div>

            {/* Right: Content */}
            <div className="space-y-8 sm:space-y-10">
              {/* More Details */}
              <div>
                <p className="mb-4 text-xs font-bold uppercase tracking-[var(--tracking-wide)] text-[var(--color-fg)]">
                  More Details
                </p>
                <p className="text-base leading-relaxed text-[var(--color-fg)]">
                  This Licensed Insurance Agent is committed to helping you find the right coverage. Reach out today to discuss your Medicare, health, life, and retirement needs.
                </p>
              </div>

              {/* Location & Hours */}
              <div>
                <p className="mb-4 text-xs font-bold uppercase tracking-[var(--tracking-wide)] text-[var(--color-fg)]">
                  Location &amp; Hours
                </p>
                <div className="space-y-4 text-base text-[var(--color-fg)]">
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="mt-0.5 shrink-0 text-[var(--color-brand-primary)]" aria-hidden />
                    <address className="not-italic leading-relaxed">
                      {addressLines.map((line, i) => (
                        <span key={i}>
                          {line}
                          {i < addressLines.length - 1 && <br />}
                        </span>
                      ))}
                    </address>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock size={18} className="mt-0.5 shrink-0 text-[var(--color-brand-primary)]" aria-hidden />
                    <div className="leading-relaxed">
                      <p className="font-semibold">Hours:</p>
                      {hours.map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Features Grid ────────────────────────────────────────────── */}
      <FeaturesGrid features={location.features} />
    </article>
  );
}
