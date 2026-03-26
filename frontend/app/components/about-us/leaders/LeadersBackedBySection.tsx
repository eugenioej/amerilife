import Image from "next/image";
import { FadeInOnView } from "@/app/components/ui/FadeInOnView";
import { rewriteUploadsUrl } from "@/lib/wp-media";

/** Same assets as https://amerilife.com/about-us/our-leaders/ */
const BANNER_BG =
  "https://amerilife.com/wp-content/uploads/2021/12/banner-5.png";
const THL_LOGO_SVG =
  "https://amerilife.com/wp-content/themes/Divi-Child/assets/img/thl.svg";

export function LeadersBackedBySection() {
  const bgSrc = rewriteUploadsUrl(BANNER_BG);

  return (
    <section className="mt-12 w-full sm:mt-16" aria-labelledby="backed-by-heading">
      <FadeInOnView direction="up" className="relative isolate min-h-[min(28rem,70vw)] w-full overflow-hidden sm:min-h-[22rem] lg:min-h-[20rem]">
        <Image
          src={bgSrc}
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority={false}
        />
        {/* Readability overlay (live site uses overlay-style-2 on banner) */}
        <div
          className="absolute inset-0 bg-[var(--color-brand-primary)]/88"
          aria-hidden
        />

        <div className="relative z-10 py-12 sm:py-14 lg:py-16">
          <div className="mx-auto w-full max-w-[var(--container-max)] px-[var(--container-padding-x)]">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-12 lg:items-center">
              <div className="flex justify-center lg:col-span-4 lg:justify-start">
              <Image
                src={THL_LOGO_SVG}
                alt="Thomas H. Lee Partners"
                width={280}
                height={120}
                className="h-auto w-full max-w-[220px] brightness-0 invert lg:max-w-[260px]"
              />
              </div>
              <div className="text-center lg:col-span-8 lg:text-left">
              <p className="mb-2 text-sm font-semibold uppercase tracking-[var(--tracking-wide)] text-white/90">
                Backed by
              </p>
              <h2
                id="backed-by-heading"
                className="mb-5 text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-[1.75rem] xl:text-4xl"
              >
                THOMAS H. LEE PARTNERS &amp;
                <br />
                GENSTAR CAPITAL
              </h2>
              <p className="max-w-3xl text-base leading-relaxed text-white/95 lg:max-w-none">
                As equal investors in AmeriLife, Thomas H. Lee Partners (THL) and Genstar Capital –
                two of the world&apos;s leading private equity firms – bring deep domain expertise and
                resources to help great companies accelerate growth, improve operations, and drive
                long-term sustainable value. To learn more about THL, visit{" "}
                <a
                  href="https://thl.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-white underline decoration-white/70 underline-offset-2 transition-colors hover:decoration-white"
                >
                  THL.com
                </a>
                . To learn more about Genstar Capital, visit{" "}
                <a
                  href="https://www.gencap.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-white underline decoration-white/70 underline-offset-2 transition-colors hover:decoration-white"
                >
                  GenCap.com
                </a>
                .
              </p>
              </div>
            </div>
          </div>
        </div>
      </FadeInOnView>
    </section>
  );
}
