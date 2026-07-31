import RequestSupportHeader from "@/app/components/request-support/RequestSupportHeader";
import RequestSupportBody from "@/app/components/request-support/RequestSupportBody";
import RequestSupportFooter from "@/app/components/request-support/RequestSupportFooter";
import type { Metadata } from "next";
import { staticPageMetadata } from "@/lib/seo";

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
      <RequestSupportHeader />
      <RequestSupportBody />
      <RequestSupportFooter />
    </div>
  );
}

