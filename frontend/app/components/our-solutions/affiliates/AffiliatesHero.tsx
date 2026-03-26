import Image from "next/image";
import { rewriteUploadsUrl } from "@/lib/wp-media";
import { WP_IMAGE_SOURCES } from "@/lib/wp-image-sources";

export function AffiliatesHero() {
  const heroSrc = rewriteUploadsUrl(WP_IMAGE_SOURCES.affiliatesPage.heroImage);

  return (
    <div className="grid min-h-0 w-full grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col justify-center bg-[#f7f8f9] px-[var(--container-padding-x)] py-12 lg:py-16 lg:pl-[max(var(--container-padding-x),calc((100vw-var(--container-max))/2+var(--container-padding-x)))]">
        <h2 className="mb-6 text-xl font-bold uppercase tracking-wide text-[var(--color-brand-primary)] sm:text-2xl">
          Accelerating Your
          <br />
          Business
        </h2>
        <p className="mb-6 max-w-xl text-base leading-relaxed text-[var(--color-fg)]">
          When you partner with AmeriLife, you join a family of independent companies that make up
          the industry&apos;s most powerful distribution network — all while maintaining the autonomy
          to run your business that you&apos;ve worked so hard to build.
        </p>
        <p className="mb-0 max-w-xl text-base leading-relaxed text-[var(--color-fg)]">
          What you get is a strong partner and an industry-leading platform that help you stay
          competitive, attract and retain talent, grow your revenue, expand your business ambitions
          and secure your legacy.
        </p>
      </div>
      <div className="relative aspect-[1420/1124] w-full overflow-hidden bg-[#e8ebe8] lg:aspect-auto lg:min-h-[400px]">
        <Image
          src={heroSrc}
          alt="AmeriLife affiliate partnership"
          fill
          className="object-cover object-top"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>
    </div>
  );
}
