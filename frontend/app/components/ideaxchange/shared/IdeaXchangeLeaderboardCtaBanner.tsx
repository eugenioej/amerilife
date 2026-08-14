import { Link } from "@/app/components/ui/Link";

type Props = {
  className?: string;
  href: string;
  heading: string;
  buttonLabel?: string;
};

const buttonClassName =
  "h-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-primary)] px-8 text-xs font-bold uppercase leading-none tracking-wide text-white no-underline transition-opacity hover:!text-white hover:!no-underline hover:opacity-95";

export function IdeaXchangeLeaderboardCtaBanner({
  className,
  href,
  heading,
  buttonLabel = "Learn more",
}: Props) {
  return (
    <section
      className={`relative flex flex-col items-center justify-center gap-6 px-6 py-10 md:px-12 md:py-12 ${className ?? ""}`}
      style={{
        background:
          "linear-gradient(90deg, var(--color-brand-primary) 0%, var(--color-brand-dark) 100%)",
      }}
      aria-labelledby="ideaxchange-leaderboard-cta-heading"
    >
      <p
        id="ideaxchange-leaderboard-cta-heading"
        className="max-w-5xl text-center text-lg font-bold uppercase tracking-[0.06em] text-white md:pr-36 md:text-xl lg:text-2xl"
      >
        {heading}
      </p>
      <Link 
        href={href} variant="button" 
        className={`${buttonClassName} flex items-center justify-center md:hidden`}
      >
        {buttonLabel}
      </Link>
      <Link
        href={href}
        variant="button"
        className={`${buttonClassName} absolute right-6 top-1/2 hidden -translate-y-1/2 md:inline-flex lg:right-10`}
      >
        {buttonLabel}
      </Link>
    </section>
  );
}
