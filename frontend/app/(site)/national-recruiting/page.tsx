
import type { Metadata } from "next";
import { staticPageMetadata } from "@/lib/seo";
import NationalRecruitingHeader from "@/app/components/national-recruiting/NationalRecruitingHeader";
import NationalRecruitingBody from "@/app/components/national-recruiting/NationalRecruitingBody";
import NationalRecruitingFooter from "@/app/components/national-recruiting/NationalRecruitingFooter";

export const metadata: Metadata = {
  ...staticPageMetadata(
    "AmeriLife Marketing Support",
    "AmeriLife Marketing Support",
    "/thankyou/"
  ),
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className="request-support-page min-h-screen bg-white">
      <NationalRecruitingHeader/>
      <NationalRecruitingBody/>
      <NationalRecruitingFooter/>
    </div>
  );
}

