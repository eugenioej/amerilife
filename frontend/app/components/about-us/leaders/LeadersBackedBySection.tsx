import Image from "next/image";
import { FadeInOnView } from "@/app/components/ui/FadeInOnView";
import { rewriteUploadsUrl } from "@/lib/wp-media";

/** Same assets + overlay as https://amerilife.com/about-us/our-leaders/ (Divi-Child `aml-info-banner overlay overlay-style-2`) */
const BANNER_BG =
  "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/04/banner-5.png";

/** `main.css` `.overlay-style-2:before` — not the solid brand overlay */
const OVERLAY_STYLE_2 =
  "linear-gradient(76.17deg, #0E3250 22.96%, #003A74 39.11%, #009B7C 73.34%, #67C084 88.48%)";

export function LeadersBackedBySection() {
  const bgSrc = rewriteUploadsUrl(BANNER_BG);

  return (
    <section className="relative isolate w-full" aria-labelledby="backed-by-heading">
      <FadeInOnView
        direction="up"
        className="relative min-h-[min(28rem,70vw)] w-full overflow-hidden sm:min-h-[22rem] lg:min-h-[20rem]"
      >
        <Image
          src={bgSrc}
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority={false}
        />
        <div
          className="absolute inset-0"
          style={{
            background: OVERLAY_STYLE_2,
            opacity: 0.8,
          }}
          aria-hidden
        />

        <div className="relative z-10 py-[70px] md:py-[130px]">
          <div className="mx-auto w-full max-w-[var(--container-max)] px-[var(--container-padding-x)]">
            <div className="mx-auto w-full max-w-2xl text-left">
              <h3 className="mb-0 text-2xl font-semibold leading-[48px] text-white">
                Backed by
              </h3>
              <h2
                id="backed-by-heading"
                className="mb-[30px] mt-0 text-2xl font-bold uppercase leading-[42px] tracking-[3px] text-white sm:text-[32px]"
              >
                THOMAS H. LEE PARTNERS &amp;
                <br />
                GENSTAR CAPITAL
              </h2>
              <div className="text-base leading-[27px] text-white">
                <p className="pb-1 text-white">
                  As equal investors in AmeriLife, Thomas H. Lee Partners (THL) and Genstar Capital –
                  two of the world&apos;s leading private equity firms – bring deep domain expertise and
                  resources to help great companies accelerate growth, improve operations, and drive
                  long-term sustainable value. To learn more about THL, visit{" "}
                  <a
                    href="https://thl.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-normal text-white underline decoration-white/80 underline-offset-2 transition-[font-weight] hover:font-bold"
                  >
                    THL.com
                  </a>
                  . To learn more about Genstar Capital, visit{" "}
                  <a
                    href="https://www.gencap.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-normal text-white underline decoration-white/80 underline-offset-2 transition-[font-weight] hover:font-bold"
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
