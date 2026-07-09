import type { Metadata } from "next";
import { CarrierSpotlightPage } from "@/app/components/ideaxchange/carrier/CarrierSpotlightPage";
import { requireIdeaxchangeAuth } from "@/lib/ideaxchange-auth";
import { IDEAXCHANGE_CARRIER_SPOTLIGHT_PATH } from "@/lib/ideaxchange-constants";
import { getCarrierSpotlightBundle } from "@/lib/ideaxchange-carrier-data";
import { privatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = privatePageMetadata(
  "Carrier Spotlight | ideaXchange",
  "Carrier profiles, resources, and spotlight articles for AmeriLife distribution partners.",
);

export default async function CarrierSpotlightIndexPage() {
  const auth = await requireIdeaxchangeAuth(IDEAXCHANGE_CARRIER_SPOTLIGHT_PATH);

  const { carriers } = await getCarrierSpotlightBundle(auth.persona);

  return <CarrierSpotlightPage carriers={carriers} />;
}
