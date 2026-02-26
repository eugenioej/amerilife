export function AffiliatesQuoteBand() {
  return (
    <div
      className="relative min-h-[320px] w-full overflow-hidden py-16 lg:py-20"
      style={{ background: "var(--gradient-primary)" }}
    >
      <div className="relative mx-auto flex max-w-[var(--container-max)] flex-col items-center justify-center px-[var(--container-padding-x)] text-center">
        <blockquote className="mb-6 text-xl leading-relaxed text-white sm:text-2xl">
          As an AmeriLife affiliate, you&apos;re in business for yourself but not by yourself. It
          feels great knowing that the very best in distribution is standing in your corner, every
          day.
        </blockquote>
        <h2 className="mb-2 text-2xl font-bold uppercase text-white sm:text-3xl">
          Ron W. Rawlings
        </h2>
        <p className="mb-0 text-base font-medium text-white/90">
          Principal, Dallas Financial Wholesalers
        </p>
      </div>
    </div>
  );
}
