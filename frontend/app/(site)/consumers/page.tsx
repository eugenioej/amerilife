import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/app/components/ui/Link";
import { SiteBreadcrumb } from "@/app/components/layout/SiteBreadcrumb";
import { GravityForm } from "@/app/components/gravity-forms/GravityForm";
import { JsonLd } from "@/app/components/seo/JsonLd";
import { FIND_AN_AGENT_FORM_ID, fetchGravityForm } from "@/lib/gf-client";
import { breadcrumbJsonLd, staticPageMetadata } from "@/lib/seo";
import { rewriteUploadsUrl } from "@/lib/wp-media";

export const metadata: Metadata = staticPageMetadata(
  "Life and Health Insurance for Individuals and Families | AmeriLife",
  "We help families build a solid financial foundation with insurance now to free you to focus on your plans for the future.",
  "/consumers/"
);

const CONSUMER_BANNER =
  "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/04/consumer-banner.jpg";
const GREYGEO_BANNER =
  "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/04/greygeo-banner-1920.webp";
const CHAT_ICON = "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/04/Chat-Icon-Green.png";

export default async function ConsumersLandingPage() {
  let connectAgentForm = null;
  try {
    connectAgentForm = await fetchGravityForm(FIND_AN_AGENT_FORM_ID);
  } catch {
    connectAgentForm = null;
  }

  const bannerUrl = rewriteUploadsUrl(CONSUMER_BANNER);
  const greyGeoUrl = rewriteUploadsUrl(GREYGEO_BANNER);
  const chatIconUrl = rewriteUploadsUrl(CHAT_ICON);

  return (
    <article className="bg-white">
      <JsonLd
        schema={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Insurance for Individuals and Families", path: "/consumers/" },
        ])}
      />

      {/* AML-style breadcrumbs + page title (matches amerilife.com/consumers/) */}
      <div className="border-b border-[#efefef] bg-white">
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-8 sm:py-10">
          <SiteBreadcrumb
            className="mb-6"
            items={[{ label: "Home", href: "/" }, { label: "Insurance for Individuals and Families" }]}
          />
          <h1 className="text-[28px] font-bold leading-tight text-[#003767] sm:text-3xl lg:text-4xl">
            Insurance for Individuals and Families
          </h1>
        </div>
      </div>

      {/* Desktop (≥981px on WP): consumer-banner slider strip */}
      <div
        className="relative hidden min-h-[250px] max-h-[250px] bg-[#ffffff] bg-cover bg-center min-[981px]:block"
        style={{ backgroundImage: `url(${bannerUrl})` }}
      >
        <div className="mx-auto flex h-[250px] max-w-[var(--container-max)] items-center justify-end px-[var(--container-padding-x)]">
          <h2 className="max-w-xl text-right text-[28px] font-black leading-snug text-[#003767] sm:text-[36px] lg:text-[40px]">
            Plan now for a long,
            <br />
            healthy and happy life
          </h2>
        </div>
      </div>

      {/* Tablet/mobile on WP: grey geo band + centered headline */}
      <div
        className="block bg-cover bg-center py-10 min-[981px]:hidden"
        style={{ backgroundImage: `url(${greyGeoUrl})` }}
      >
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] text-center">
          <h2 className="text-[28px] font-bold leading-snug text-[#003767]">
            Plan now for a long, healthy and happy life
          </h2>
        </div>
      </div>

      {/* Worry less — 3/4 + empty 1/4 with divider */}
      <div className="border-b border-[#efefef] bg-white">
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-10 lg:py-14">
          <div className="grid grid-cols-1 gap-8 min-[981px]:grid-cols-[minmax(0,3fr)_minmax(0,1fr)] min-[981px]:gap-10">
            <div className="border-[#efefef] min-[981px]:border-r min-[981px]:pr-8 xl:mr-2">
              <h2 className="mb-6 text-2xl font-bold text-[#003768] sm:text-3xl">
                Worry less and enjoy life more
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-[var(--color-fg)]">
                <p>
                  Like many Americans, you have hopes and dreams. But what about a strategy to fulfill
                  them?
                </p>
                <p>AmeriLife can help you create one.</p>
                <p>
                  Insurance should be affordable and give you a sense of security. Its purpose, after all,
                  is to offset or cover expenses as you go through life – all the way through retirement.
                  Building a solid financial foundation now will free you to focus on what&apos;s really
                  important – your plans for the future. Because happiness is knowing you&apos;re ready.
                </p>
              </div>
            </div>
            <div className="hidden min-[981px]:block" aria-hidden />
          </div>
        </div>
      </div>

      {/* Connect with an Agent — chat icon + Gravity Form 44 */}
      <div className="bg-white pb-14 pt-6 lg:pb-16 lg:pt-8">
        <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] sm:px-10 lg:px-10">
          <div className="overflow-hidden">
            <Image
              src={chatIconUrl}
              width={110}
              height={110}
              alt="Connect with an agent"
              className="float-right ml-6 mb-4 block shrink-0"
            />
            <h2 className="mb-4 text-3xl font-bold text-[#003767] sm:text-4xl">Connect with an Agent</h2>
            <p className="mb-6 text-base leading-relaxed text-[var(--color-fg)]">
              A licensed sales representative may contact you to listen to your needs.
            </p>
          </div>

          <div className="clear-both rounded-sm bg-[#f5f6f8] px-4 py-6 sm:p-8">
            {connectAgentForm ? (
              <GravityForm form={connectAgentForm} />
            ) : (
              <p className="text-sm text-[var(--color-muted)]">
                This form is temporarily unavailable. Please visit{" "}
                <Link
                  href="/find-an-agent/"
                  className="text-[var(--color-link)] underline underline-offset-4 hover:text-[var(--color-link-hover)]"
                >
                  Find an Agent
                </Link>{" "}
                or{" "}
                <Link
                  href="/contact/"
                  className="text-[var(--color-link)] underline underline-offset-4 hover:text-[var(--color-link-hover)]"
                >
                  Contact Us
                </Link>
                .
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
