import type { Metadata } from "next";
import { staticPageMetadata } from "@/lib/seo";
import GivesBackPage from "@/app/components/givesback/GivesBackPage";

export const metadata: Metadata = staticPageMetadata(
  "AmeriLife Gives Back Foundation | AmeriLife",
  "As a values-driven company, giving back is in AmeriLife's DNA. The AmeriLife Gives Back Foundation supports senior veterans and community partnerships.",
  "/givesback/"
);

export default function Page() {
  return <GivesBackPage />;
}