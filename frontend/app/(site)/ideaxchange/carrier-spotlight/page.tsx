import type { Metadata } from "next";
import { CarrierSpotlightPage } from "@/app/components/ideaxchange/carrier/CarrierSpotlightPage";
import { requireIdeaxchangeAuth } from "@/lib/ideaxchange-auth";
import { IDEAXCHANGE_CARRIER_SPOTLIGHT_PATH } from "@/lib/ideaxchange-constants";
import { getCarrierSpotlightBundle } from "@/lib/ideaxchange-carrier-data";
import { privatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = privatePageMetadata(
  "Career Spotlight | ideaXchange",
  "Carrier and career partner profiles, resources, and spotlight articles on AmeriLife ideaXchange.",
);

export default async function CarrierSpotlightIndexPage() {
  const auth = await requireIdeaxchangeAuth(IDEAXCHANGE_CARRIER_SPOTLIGHT_PATH);

  const { carriers } = await getCarrierSpotlightBundle(auth.persona);

  return <CarrierSpotlightPage carriers={carriers} />;
}
