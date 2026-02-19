import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/app/components/ui/Link";
import { rewriteUploadsUrl } from "@/lib/wp-media";

// Image on headless: /wp-content/uploads/2017/10/Thank-You-IMG.jpg
const THANK_YOU_IMAGE_URL = rewriteUploadsUrl(
  "https://amerilife.com/wp-content/uploads/2017/10/Thank-You-IMG.jpg"
);

export const metadata: Metadata = {
  title: "Thank You | AmeriLife",
  description:
    "Thank you for contacting AmeriLife. We have received your inquiry and will respond as quickly as possible.",
};

export default function AffiliatesThankYouPage() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-[var(--color-muted)]" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <li>
              <Link
                href="/"
                className="text-[var(--color-link)] transition-colors hover:text-[var(--color-link-hover)]"
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href="/about/"
                className="text-[var(--color-link)] transition-colors hover:text-[var(--color-link-hover)]"
              >
                About AmeriLife
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href="/our-solutions/affiliates/"
                className="text-[var(--color-link)] transition-colors hover:text-[var(--color-link-hover)]"
              >
                Our Affiliates
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-[var(--color-fg)]" aria-current="page">
              Thank You
            </li>
          </ol>
        </nav>

        {/* Main title */}
        <h1 className="mb-2 text-3xl font-bold text-[var(--color-fg)] sm:text-4xl">
          Thank You
        </h1>
        <h2 className="mb-6 text-3xl font-bold text-[var(--color-fg)] sm:text-4xl">
          We appreciate your interest!
        </h2>

        {/* Accent line */}
        <div
          className="mb-8 h-1 w-24"
          style={{ background: "var(--color-brand-primary)" }}
        />

        {/* Two-column: image left, message right */}
        <div className="grid gap-8 md:grid-cols-[1fr_1.2fr] md:items-center">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg md:aspect-auto md:min-h-[280px]">
            <Image
              src={THANK_YOU_IMAGE_URL}
              alt="AmeriLife team members"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 45vw"
            />
          </div>
          <div>
            <h3 className="mb-4 text-2xl font-bold text-[var(--color-fg)]">
              Thank you for contacting AmeriLife.
            </h3>
            <p className="text-base leading-relaxed text-[var(--color-fg)]">
              We have received your inquiry and will respond as quickly as possible.
              Please feel free to check out the{" "}
              <Link
                href="/newsroom/"
                className="text-[var(--color-link)] underline transition-colors hover:text-[var(--color-link-hover)]"
              >
                latest things happening at amerilife
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
