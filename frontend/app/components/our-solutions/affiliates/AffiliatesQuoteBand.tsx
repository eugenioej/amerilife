import { rewriteUploadsUrl } from "@/lib/wp-media";

const BANNER_10 = "https://amerilife.com/wp-content/uploads/2021/12/banner-10.png";

export function AffiliatesQuoteBand() {
  return (
    <div
      className="relative min-h-[320px] w-full overflow-hidden bg-cover bg-center py-16 lg:py-20"
      style={{ backgroundImage: `url(${rewriteUploadsUrl(BANNER_10)})` }}
    >
      <div className="absolute inset-0 bg-black/20" aria-hidden />
      <div className="relative mx-auto flex w-full max-w-[var(--container-max)] flex-col items-center justify-center px-[var(--container-padding-x)] text-center">
        <blockquote className="mb-8 w-full max-w-5xl text-xl font-medium leading-relaxed text-white sm:text-2xl lg:text-3xl">
          &ldquo;As an AmeriLife affiliate, you&apos;re in business for yourself but not by yourself.
          It feels great knowing that the very best in distribution is standing in your corner, every
          day.&rdquo;
        </blockquote>
        <h2 className="mb-2 text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">
          Ron W. Rawlings
        </h2>
        <p className="mb-0 text-base font-medium text-white/90">Principal, Dallas Financial Wholesalers</p>
      </div>
    </div>
  );
}
