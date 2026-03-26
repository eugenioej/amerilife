import Image from "next/image";
import { FadeInOnView } from "@/app/components/ui/FadeInOnView";
import { rewriteUploadsUrl } from "@/lib/wp-media";

const BANNER_URL = "https://amerilife.com/wp-content/uploads/2021/12/banner-image.png";
const STAR_URL = "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/03/star.png";

export function HeroSection() {
  const bannerUrl = rewriteUploadsUrl(BANNER_URL);
  const starUrl = STAR_URL;
  return (
    <section className="relative flex min-h-[85vh] flex-col items-start justify-center overflow-hidden lg:min-h-[100vh]">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={bannerUrl}
          alt=""
          fill
          className="object-cover"
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
        threshold={0}
        className="relative z-10 mx-auto w-full max-w-[var(--container-max)] px-[var(--container-padding-x)] text-left"
      >
        <h2 className="mb-4 text-xl font-normal tracking-wide text-white/95 sm:text-2xl lg:text-3xl">
          Together As
        </h2>
        <h1 className="font-poppins mb-8 flex items-baseline justify-start gap-2 text-7xl tracking-tight text-white sm:text-8xl md:text-9xl lg:text-[10rem] xl:text-[12rem]">
          <span style={{ fontWeight: 800 }}>O</span>
          <span className="font-light">NE</span>
        </h1>
        <p className="max-w-[min(100%,32ch)] text-left text-lg font-normal leading-snug text-white/95 sm:text-xl lg:text-2xl">
          Delivering insurance and financial solutions to agents and advisors to help people live longer, healthier lives.
        </p>
      </FadeInOnView>
    </section>
  );
}
