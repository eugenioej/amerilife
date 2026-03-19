import { Heart, Activity, Shield, TrendingUp } from "lucide-react";
import type { FeatureBlock } from "@/lib/locations-data";

const iconProps = {
  size: 24,
  strokeWidth: 1.5,
  className: "text-white",
  "aria-hidden": true as const,
};

const FEATURE_ICONS: Record<string, React.ComponentType<Record<string, unknown>>> = {
  medicare: Heart,
  health: Activity,
  life: Shield,
  annuity: TrendingUp,
};

function FeatureCard({ feature }: { feature: FeatureBlock }) {
  const IconComponent = feature.icon ? FEATURE_ICONS[feature.icon] : null;

  return (
    <div className="flex gap-3 rounded-lg border border-[var(--color-border)] bg-[#f7f8f9] p-4 sm:gap-4 sm:p-6">
      {IconComponent && (
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-primary)]"
          aria-hidden
        >
          <IconComponent {...iconProps} />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <h3 className="mb-3 text-sm font-bold uppercase text-[var(--color-fg)]">
          {feature.heading}
        </h3>
        <p className="text-base leading-relaxed text-[var(--color-fg)]">
          {feature.body}
        </p>
      </div>
    </div>
  );
}

type FeaturesGridProps = {
  sectionHeading?: string;
  features: FeatureBlock[];
};

export function FeaturesGrid({
  sectionHeading = "Our mission, Our story",
  features,
}: FeaturesGridProps) {
  if (features.length === 0) return null;

  return (
    <section className="bg-white py-8 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
        <h2 className="mb-2 text-center text-2xl font-bold text-[var(--color-fg)] sm:text-3xl">
          {sectionHeading}
        </h2>
        <p className="mb-8 text-center italic text-[var(--color-fg)] sm:mb-10">
          Helping you live a longer, healthier life.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
          {features.map((feature, i) => (
            <FeatureCard key={i} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
