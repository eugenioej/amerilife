import { notFound } from "next/navigation";
import { CarrierSpotlightTemplate } from "@/app/components/ideaxchange/carrier/CarrierSpotlightTemplate";
import { requireIdeaxchangeAuth } from "@/lib/ideaxchange-auth";
import { getCarrierBySlug } from "@/lib/ideaxchange-carrier-data";
import {
  getIdeaxchangeAdsSettings,
  getIdeaxchangeSalesMagazineBundle,
} from "@/lib/ideaxchange-data";
import { formatInsightExcerptPlain } from "@/lib/insight-excerpt";
import { privatePageMetadata, yoastSeoToMetadata } from "@/lib/seo";

type PageParams = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: PageParams }) {
  const { slug } = await params;
  const carrier = await getCarrierBySlug(slug);
  if (!carrier) return {};

  if (carrier.seo) {
    return yoastSeoToMetadata(carrier.seo, carrier.title ?? "Carrier");
  }
  const title = `${carrier.title ?? "Carrier"} | Career Spotlight`;
  const description =
    formatInsightExcerptPlain(carrier.excerpt).slice(0, 320) ||
    `Learn about ${carrier.title ?? "this carrier"} on AmeriLife ideaXchange Career Spotlight.`;
  return privatePageMetadata(title, description);
}

export default async function CarrierDetailPage({ params }: { params: PageParams }) {
  const { slug } = await params;
  const auth = await requireIdeaxchangeAuth(`/ideaxchange/carrier-spotlight/${slug}/`);

  const [carrier, salesBundle, ideaxchangeAds] = await Promise.all([
    getCarrierBySlug(slug, auth.persona),
    getIdeaxchangeSalesMagazineBundle(auth.persona),
    getIdeaxchangeAdsSettings(),
  ]);

  if (!carrier) notFound();

  return (
    <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)] py-8 md:py-10">
      <CarrierSpotlightTemplate
        carrier={carrier}
        relatedArticles={salesBundle.posts}
        adSlot={ideaxchangeAds?.carrierSidebarVertical}
      />
    </div>
  );
}
