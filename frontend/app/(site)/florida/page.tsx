import type { Metadata } from "next";
import { FloridaMarketView } from "@/app/components/florida-market/FloridaMarketView";
import { FIND_AN_AGENT_FORM_ID, fetchGravityForm } from "@/lib/gf-client";
import { staticPageMetadata } from "@/lib/seo";

export const metadata: Metadata = staticPageMetadata(
  "AmeriLife of Florida, LLC | AmeriLife",
  "Find an AmeriLife agent in Florida — West Palm Beach and Fort Lauderdale. Medicare, life, health, and retirement solutions.",
  "/florida/"
);

export default async function FloridaMarketPage() {
  let connectForm = null;
  try {
    connectForm = await fetchGravityForm(FIND_AN_AGENT_FORM_ID);
  } catch {
    connectForm = null;
  }

  return <FloridaMarketView connectForm={connectForm} />;
}
