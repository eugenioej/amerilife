import type { Metadata } from "next";
import { ValsparForm } from "@/app/components/valspar/ValsparForm";
import { staticPageMetadata } from "@/lib/seo";

export const metadata: Metadata = staticPageMetadata(
  "Valspar | AmeriLife",
  "AmeriLife is a national leader in the development, marketing and distribution of annuity, life and health insurance solutions.",
  "/valspar/"
);

export default function ValsparPage() {
  return (
    <>
      {/* Hero */}
      <section
        className="relative flex min-h-[40vh] flex-col items-center justify-center overflow-hidden py-20"
        style={{ background: "var(--gradient-header)" }}
      >
        <div className="absolute inset-0 opacity-30">
          <div
            className="h-full w-full opacity-50"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 20px,
                rgba(255,255,255,0.03) 20px,
                rgba(255,255,255,0.03) 40px
              )`,
            }}
          />
        </div>
        <div className="relative z-10 mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] text-center">
          <p
            className="text-xl font-bold uppercase tracking-wide text-white sm:text-2xl lg:text-3xl"
            style={{
              textShadow: "0 1px 2px rgba(0,0,0,0.2)",
            }}
          >
            We make people&apos;s lives better — and we&apos;re proud of it.
          </p>
        </div>
      </section>

      {/* Form section - two column */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-bg)] py-16 sm:py-24">
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-start">
            {/* Left: intro text */}
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

            {/* Right: form */}
            <ValsparForm />
          </div>
        </div>
      </section>
    </>
  );
}
