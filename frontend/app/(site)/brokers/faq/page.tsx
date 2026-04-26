import type { Metadata } from "next";
import { SiteBreadcrumb } from "@/app/components/layout/SiteBreadcrumb";
import { BrokersFaqAccordion } from "@/app/components/brokers-faq/BrokersFaqAccordion";
import { staticPageMetadata } from "@/lib/seo";

export const metadata: Metadata = staticPageMetadata(
  "Frequently Asked Questions About AmeriLife | AmeriLife",
  "Find answers to common questions about independent insurance agents, what AmeriLife can do for your business, and our distribution network.",
  "/brokers/faq/"
);

export default function BrokersFaqPage() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
        <SiteBreadcrumb
          className="mb-8"
          items={[
            { label: "Home", href: "/" },
            { label: "Brokers", href: "/broker-contact-page/" },
            { label: "Frequently Asked Questions" },
          ]}
        />

        <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight text-[var(--color-fg)]">
          Frequently Asked Questions
        </h1>
        <div
          className="mb-12 h-[3px] w-[125px] max-w-full shrink-0 bg-[#94c83d]"
          aria-hidden
        />
        <BrokersFaqAccordion />
      </div>
    </section>
  );
}
