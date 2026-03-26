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
}: StatBannerSectionProps) {
  const isImageLeft = direction === "left";

  return (
    <section
      className="relative flex flex-col md:flex-row md:min-h-0"
      style={{ background: "var(--gradient-header)" }}
    >
      <div
        className={`relative aspect-square w-full shrink-0 overflow-hidden md:w-1/2 md:min-w-[50%] ${
          isImageLeft ? "order-1 md:order-1" : "order-1 md:order-2"
        }`}
      >
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      <FadeInOnView
        direction={isImageLeft ? "right" : "left"}
        className={`flex w-full flex-1 flex-col justify-center px-[var(--container-padding-x)] py-12 md:w-1/2 md:min-w-[50%] md:px-12 md:py-16 lg:px-16 lg:py-20 ${
          isImageLeft ? "order-2 md:order-2" : "order-2 md:order-1"
        }`}
      >
        <h2 className="mb-6 text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">
          {heading}
        </h2>
        <div className="mb-4">
          <div className="flex items-center gap-4">
            {Icon && (
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/20 ring-1 ring-white/30">
                <Icon className="h-7 w-7 text-white" strokeWidth={1.75} />
              </div>
            )}
            <span className="text-5xl font-bold text-white sm:text-6xl md:text-7xl">
              {statNumber}
            </span>
          </div>
          <span className="mt-2 block text-lg font-normal text-white/90 sm:text-xl">
            {statLabel}
          </span>
        </div>
        <p className="mb-8 max-w-xl text-base leading-relaxed text-white/95 sm:text-lg">
          {description}
        </p>
        <Link
          href={ctaHref}
          variant="button"
          className="motion-cta inline-flex w-fit items-center justify-center rounded-[var(--radius-full)] border-2 border-white bg-white px-6 py-3 text-sm font-bold uppercase tracking-[var(--tracking-normal)] text-[var(--color-brand-primary)] transition-colors hover:bg-white/95 hover:text-[var(--color-brand-primary-hover)]"
        >
          {ctaText}
        </Link>
      </FadeInOnView>
    </section>
  );
}
