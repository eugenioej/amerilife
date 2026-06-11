import { PARTNERSHIP_APPROACH } from "./constants";

const iconProps = {
  size: 40,
  strokeWidth: 1.5,
  className: "text-[var(--color-brand-primary)]",
  "aria-hidden": true as const,
};

export function AcquisitionPartnerApproach() {
  return (
    <section className="bg-[#f0f0f0] py-16 sm:py-20">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
        <h2 className="mb-12 text-center text-2xl font-bold text-[var(--color-fg)] sm:text-3xl">
          AmeriLife&apos;s partnership approach is{" "}
          <span className="text-[var(--color-brand-primary)]">unique in the industry:</span>
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {PARTNERSHIP_APPROACH.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex flex-col rounded-lg bg-white p-8 shadow-sm sm:p-10"
              >
                <div className="mb-4">
                  <Icon {...iconProps} />
                </div>
                <h3 className="mb-4 text-lg font-bold text-[var(--color-fg)]">{item.title}</h3>
                <ul className="space-y-2 text-base leading-relaxed text-[var(--color-fg)]">
                  {item.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-brand-primary)]" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
