type Props = {
  title: string;
  className?: string;
};

export function IdeaXchangePillarBanner({ title, className }: Props) {
  return (
    <section
      className={`flex min-h-[120px] w-full items-center justify-center bg-gradient-to-r from-[var(--color-brand-primary)] to-[#2a7a8c] px-[var(--container-padding-x)] py-10 md:min-h-[140px] md:py-12 ${className ?? ""}`}
      aria-label={title}
    >
      <h1 className="text-center text-2xl font-bold uppercase tracking-[0.14em] text-white sm:text-3xl md:text-4xl">
        {title}
      </h1>
    </section>
  );
}
