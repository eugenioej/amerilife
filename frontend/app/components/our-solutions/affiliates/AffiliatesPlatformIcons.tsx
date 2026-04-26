import { Handshake, Briefcase, Cpu } from "lucide-react";

const iconProps = {
  size: 48,
  strokeWidth: 1.5,
  className: "text-[var(--color-brand-primary)]",
  "aria-hidden": true as const,
};

const PLATFORM_ITEMS = [
  {
    icon: Handshake,
    title: "Strong Carrier Relationships",
    description:
      "Deep product portfolio from some of the best-known and respected carriers in the industry",
  },
  {
    icon: Briefcase,
    title: "Business Consulting",
    description:
      "Strategic expertise and best-in-class back-office support so you can focus on what you do best",
  },
  {
    icon: Cpu,
    title: "Enterprise Technology",
    description:
      "Systems and capabilities for today's increasingly digital marketplace",
  },
] as const;

export function AffiliatesPlatformIcons() {
  return (
    <div className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
        <h2 className="mb-6 text-center text-3xl font-semibold leading-tight text-[var(--color-fg)] sm:text-4xl lg:text-5xl">
          A Platform Built for Your Success
        </h2>
        <p className="mx-auto mb-12 max-w-3xl text-center text-base leading-relaxed text-[var(--color-fg)]">
          Whether you focus on the Medicare market, are a registered advisor, worksite benefits
          broker, or other insurance professional, AmeriLife has you covered with market-leading
          products, best-in-class training, marketing services and business technology to drive your
          success.
        </p>
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {PLATFORM_ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="flex flex-col rounded-lg bg-[#e2e5ed] p-8 text-center sm:p-10"
              >
                <div className="mb-4 flex justify-center">
                  <Icon {...iconProps} />
                </div>
                <h3 className="mb-4 text-xl font-bold uppercase tracking-wide text-[var(--color-fg)]">
                  {item.title}
                </h3>
                <p className="mb-0 text-base leading-relaxed text-[var(--color-fg)]">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
