import type { Metadata } from "next";
import { TexasMarketView } from "@/app/components/texas-market/TexasMarketView";
import { FIND_AN_AGENT_FORM_ID, fetchGravityForm } from "@/lib/gf-client";
import { staticPageMetadata } from "@/lib/seo";

export const metadata: Metadata = staticPageMetadata(
  "AmeriLife Texas Market | AmeriLife",
  "Find an AmeriLife agent in Texas. Dallas, Fort Worth, McKinney, Mansfield, Highland Village, Rockwall and more — Medicare, life, health, and retirement solutions.",
  "/texas/"
);

export default async function TexasMarketPage() {
  let connectForm = null;
  try {
    connectForm = await fetchGravityForm(FIND_AN_AGENT_FORM_ID);
  } catch {
    connectForm = null;
  }

  return <TexasMarketView connectForm={connectForm} />;
}
