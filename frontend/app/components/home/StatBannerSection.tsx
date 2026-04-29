import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { FadeInOnView } from "@/app/components/ui/FadeInOnView";
import { Link } from "../ui/Link";

export type StatBannerSectionProps = {
  heading: string;
  statNumber: string;
  statLabel: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  imageUrl: string;
  imageAlt: string;
  direction: "left" | "right";
  icon?: LucideIcon;
  /** Next/Image encoder quality when optimized (1–100). Sharper detail at higher values. Default 92. */
  imageQuality?: number;
  /**
   * When true, skips Next.js image optimization and loads the CDN URL as-is.
   * Best for already-optimized uploads (avoids double re-encoding); larger payload.
   */
  imageUnoptimized?: boolean;
};

export function StatBannerSection({
  heading,
  statNumber,
  statLabel,
  description,
  ctaText,
  ctaHref,
  imageUrl,
  imageAlt,
  direction,
  icon: Icon,
  imageQuality = 92,
  imageUnoptimized = false,
}: StatBannerSectionProps) {
  const isImageLeft = direction === "left";

  return (
    <section
      className="relative flex w-full flex-col md:min-h-0 md:flex-row md:items-stretch"
      style={{ background: "var(--gradient-header)" }}
    >
      <div
        className={`relative aspect-[4/3] w-full shrink-0 overflow-hidden md:aspect-[16/11] md:min-h-0 md:min-w-0 md:w-1/2 ${
          isImageLeft ? "order-1 md:order-1" : "order-1 md:order-2"
        }`}
      >
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          quality={imageUnoptimized ? undefined : imageQuality}
          unoptimized={imageUnoptimized}
        />
      </div>

      <FadeInOnView
        direction={isImageLeft ? "right" : "left"}
        className={`flex w-full flex-1 flex-col justify-center px-[var(--container-padding-x)] py-8 md:w-1/2 md:min-w-0 md:items-center md:px-10 md:py-10 lg:px-12 lg:py-12 ${
          isImageLeft ? "order-2 md:order-2" : "order-2 md:order-1"
        }`}
      >
        <div className="mx-auto flex w-full max-w-xl flex-col items-start text-left 2xl:max-w-2xl">
          <h2 className="mb-4 text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">
            {heading}
          </h2>
          <div className="mb-4">
            <div className="flex items-center gap-4">
              {Icon && (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/20 ring-1 ring-white/30">
                  <Icon className="h-7 w-7 text-white" strokeWidth={1.75} />
                </div>
              )}
              <span className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
                {statNumber}
              </span>
            </div>
            <span className="mt-1.5 block text-base font-normal text-white/90 sm:text-lg">
              {statLabel}
            </span>
          </div>
          <p className="mb-6 max-w-none text-base leading-relaxed text-white/95 sm:text-lg">
            {description}
          </p>
          <Link
            href={ctaHref}
            variant="button"
            className="motion-cta inline-flex w-fit items-center justify-center rounded-[var(--radius-full)] border-2 border-white bg-white px-6 py-3 text-sm font-bold uppercase tracking-[var(--tracking-normal)] text-[var(--color-brand-primary)] transition-colors hover:bg-white/95 hover:text-[var(--color-brand-primary-hover)]"
          >
            {ctaText}
          </Link>
        </div>
      </FadeInOnView>
    </section>
  );
}
