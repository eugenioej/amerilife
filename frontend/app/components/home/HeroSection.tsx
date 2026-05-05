import Image from "next/image";
import { HeroScrollDownButton } from "@/app/components/home/HeroScrollDownButton";
import { HOME_STAR_SRC } from "@/app/components/home/home-star";
import { FadeInOnView } from "@/app/components/ui/FadeInOnView";
import { rewriteUploadsUrl } from "@/lib/wp-media";

const BANNER_URL = "https://headlessameril.wpenginepowered.com/wp-content/uploads/2021/12/banner-image.png";

export function HeroSection() {
  const bannerUrl = rewriteUploadsUrl(BANNER_URL);
  const starUrl = HOME_STAR_SRC;
  return (
    <section className="relative flex w-full flex-1 flex-col items-center justify-center overflow-x-hidden overflow-y-visible sm:items-start">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={bannerUrl}
          alt=""
          fill
          className="object-cover object-[center_0%]"
          priority
          sizes="100vw"
        />
      </div>

      {/* Gradient overlay — strong, matches original site */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(90deg, rgba(0, 36, 71, 0.97) 0%, rgba(0, 58, 116, 0.92) 35%, rgba(0, 130, 110, 0.82) 65%, rgba(0, 168, 130, 0.70) 100%)",
        }}
      />

      {/* Star — above gradient, top-left */}
      <div className="pointer-events-none absolute left-0 top-0 z-[2] w-[420px] sm:w-[520px] lg:w-[640px]">
        <Image
          src={starUrl}
          alt=""
          width={640}
          height={640}
          className="h-auto w-full opacity-55 brightness-[1.45] contrast-[1.12]"
          priority
        />
      </div>

      {/* Content */}
      <FadeInOnView
        direction="fade"
        threshold={0.01}
        initialVisible
        className="relative z-10 mx-auto flex w-full max-w-[var(--container-max)] flex-col items-center px-[var(--container-padding-x)] text-center sm:items-start sm:text-left"
      >
        <h2 className="hero-home-subtitle text-center sm:text-left">
          Together As
        </h2>
        <h1
          className="hero-home-one w-full justify-center sm:justify-start"
          aria-label="ONE"
        >
          <span aria-hidden className="hero-home-one-ring bg-transparent" />
          <span aria-hidden>NE</span>
        </h1>
        <p className="max-w-[min(100%,32ch)] text-center text-lg font-normal leading-snug text-white/95 sm:text-left sm:text-xl lg:text-2xl mx-auto sm:mx-0">
          Delivering insurance and financial solutions to agents and advisors to help people live longer, healthier lives.
        </p>
      </FadeInOnView>

      <HeroScrollDownButton />
    </section>
  );
}
