import Image from "next/image";
import { SiteBreadcrumb } from "@/app/components/layout/SiteBreadcrumb";
import { InsightPostChrome } from "@/app/components/insights/InsightPostChrome";
import type { CarrierDetail } from "@/lib/ideaxchange-carrier-queries";
import type { IdeaxchangeListItem } from "@/lib/ideaxchange-queries";
import {
  IDEAXCHANGE_CARRIER_SPOTLIGHT_PATH,
  IDEAXCHANGE_HOME_PATH,
} from "@/lib/ideaxchange-constants";
import { rewriteUploadsInHtml, rewriteUploadsUrl } from "@/lib/wp-media";
import {
  formatInsightExcerptPlain,
  INSIGHT_IMG_QUALITY,
} from "@/app/components/ideaxchange/magazine/ideaxchange-utils";
import { ideaxchangeFeaturedImageSrc } from "@/app/components/ideaxchange/shared/ideaxchange-card-types";
import type { IdeaxchangeAdSlot } from "@/lib/queries";
import { CarrierHighlights } from "./CarrierHighlights";
import { CarrierResourcesSidebar } from "./CarrierResourcesSidebar";

type Props = {
  carrier: CarrierDetail;
  relatedArticles: IdeaxchangeListItem[];
  adSlot?: IdeaxchangeAdSlot | null;
};

export function CarrierSpotlightTemplate({ carrier, relatedArticles, adSlot }: Props) {
  const fields = carrier.ideaxchangeCarrierFields;
  const html = carrier.content ? rewriteUploadsInHtml(carrier.content) : "";
  const logo = ideaxchangeFeaturedImageSrc(carrier.featuredImage?.node?.sourceUrl);
  const excerptPlain = formatInsightExcerptPlain(carrier.excerpt);
  const highlights = fields?.highlights ?? [];
  const resources = fields?.carrierResources ?? [];

  const proseClasses =
  "ideaxchange-article-body max-w-none font-sans text-[var(--color-fg)] " +
  "[&_p]:mb-4 [&_p]:leading-relaxed " +
  "[&_a]:text-[var(--color-link)] [&_a:hover]:text-[var(--color-link-hover)] [&_a]:underline " +
  "[&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 " +
  "[&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 " +
  "[&_li]:mb-2 " +
  "[&_iframe]:my-6 [&_iframe]:aspect-video [&_iframe]:w-full [&_iframe]:max-w-full [&_iframe]:rounded-md " +
  "[&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:scroll-mt-24 " +
  "[&_h3]:mt-8 [&_h3]:mb-3";

  return (
    <InsightPostChrome>
      <SiteBreadcrumb
        className="mb-6"
        items={[
          { label: "Home", href: "/" },
          { label: "ideaXchange", href: IDEAXCHANGE_HOME_PATH },
          { label: "Career Spotlight", href: IDEAXCHANGE_CARRIER_SPOTLIGHT_PATH },
          {
            label: carrier.title ?? "Carrier",
            className: "truncate text-[var(--color-muted)] sm:max-w-[28rem]",
          },
        ]}
      />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-8">
          <div className="flex aspect-[16/9] w-full items-center justify-center rounded-2xl bg-[#eef1f3] p-10 md:p-14">
            <div className="relative h-32 w-full max-w-md md:h-40">
              <Image
                src={rewriteUploadsUrl(logo)}
                alt=""
                fill
                className="object-contain"
                sizes="(max-width:1024px) 80vw, 50vw"
                quality={INSIGHT_IMG_QUALITY}
                priority
              />
            </div>
          </div>

          <h1 className="mt-8 font-sans text-3xl font-bold leading-tight tracking-tight text-[var(--color-brand-dark)] sm:text-4xl">
            {carrier.title}
          </h1>

          {excerptPlain ? (
            <div className="mt-4 max-w-3xl text-lg leading-relaxed text-[var(--color-muted)] whitespace-pre-line">
              {excerptPlain}
            </div>
          ) : null}

          <CarrierHighlights highlights={highlights} />

          {html ? (
            <div
              className={`${proseClasses} mt-10`}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ) : null}
        </div>

        <div className="lg:col-span-4">
          <CarrierResourcesSidebar
            resources={resources}
            articles={relatedArticles}
            adSlot={adSlot}
          />
        </div>
      </div>
    </InsightPostChrome>
  );
}
