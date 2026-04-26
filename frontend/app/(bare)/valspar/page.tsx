import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/app/components/ui/Link";
import { GravityForm } from "@/app/components/gravity-forms/GravityForm";
import { VALSPAR_FORM_ID, fetchGravityForm } from "@/lib/gf-client";
import { staticPageMetadata } from "@/lib/seo";

const VALSPAR_BANNER_SRC =
  "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/04/ValsparBanner-031120-BL-s.jpg";

const VALSPAR_HERO_LOGO_SRC =
  "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/04/AmeriLife-Logo-white-s.webp";

const VALSPAR_BRAND_BG = "rgb(0, 55, 103)";

const VALSPAR_FOOTER_PATTERN_SRC =
  "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/04/GolfBallPattern-b.jpg";

export const metadata: Metadata = staticPageMetadata(
  "Valspar | AmeriLife",
  "AmeriLife is a national leader in the development, marketing and distribution of annuity, life and health insurance solutions.",
  "/valspar/"
);

export default async function ValsparPage() {
  let valsparForm = null;
  try {
    valsparForm = await fetchGravityForm(VALSPAR_FORM_ID);
  } catch {
    valsparForm = null;
  }

  return (
    <>
      <section className="relative w-full overflow-hidden" style={{ backgroundColor: VALSPAR_BRAND_BG }}>
        <Image
          src={VALSPAR_BANNER_SRC}
          alt="Valspar"
          width={1920}
          height={480}
          className="h-auto w-full object-cover object-center"
          priority
          sizes="100vw"
        />
        <Link
          href="/"
          variant="button"
          className="absolute left-[var(--container-padding-x)] top-4 z-10 outline-offset-4 sm:top-6 md:top-8"
        >
          <Image
            src={VALSPAR_HERO_LOGO_SRC}
            alt="AmeriLife — Home"
            width={280}
            height={72}
            className="h-auto w-36 drop-shadow-md sm:w-44 md:w-48"
            sizes="(max-width: 640px) 9rem, (max-width: 768px) 11rem, 12rem"
            priority
          />
        </Link>
      </section>

      <section className="border-t border-[var(--color-border)] bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-start">
            <div>
              <h2 className="mb-4 text-2xl font-bold text-[var(--color-fg)] sm:text-3xl">
                AmeriLife® is a national leader in the development, marketing and distribution of
                annuity, life and health insurance solutions.
              </h2>
              <p className="text-base leading-relaxed text-[var(--color-fg)]">
                To learn more about the products and services we offer, please complete the form{" "}
                <span className="text-[var(--color-brand-primary)]" aria-hidden="true">
                  →
                </span>
              </p>
            </div>

            <div className="min-w-0 space-y-5">
              <div
                className="rounded-lg border border-white/15 p-6 sm:p-8"
                style={{ backgroundColor: VALSPAR_BRAND_BG }}
              >
                {valsparForm ? (
                  <GravityForm form={valsparForm} onDarkPanel />
                ) : (
                  <p className="text-sm text-white/80">
                    The contact form is temporarily unavailable. Please try again later or{" "}
                    <Link
                      href="/contact/"
                      className="font-medium text-[var(--color-brand-secondary)] underline hover:text-white"
                    >
                      contact us
                    </Link>
                    .
                  </p>
                )}
              </div>
              <div className="text-xs leading-relaxed text-[var(--color-muted)] sm:text-sm">
                <p className="mb-3">
                  By submitting this form, you agree to allow an AmeriLife representative to contact
                  you about our products and services.
                </p>
                <p>Not affiliated with the United States government or federal Medicare program.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative w-full overflow-hidden" style={{ backgroundColor: VALSPAR_BRAND_BG }}>
        <Image
          src={VALSPAR_FOOTER_PATTERN_SRC}
          alt=""
          width={1920}
          height={320}
          className="h-20 w-full object-cover object-center sm:h-24 md:h-28"
          sizes="100vw"
        />
      </footer>
    </>
  );
}
