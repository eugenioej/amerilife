import type { Metadata } from "next";
import { SiteBreadcrumb } from "@/app/components/layout/SiteBreadcrumb";
import { FaqNewsroomSection } from "@/app/components/faq/FaqNewsroomSection";
import { staticPageMetadata } from "@/lib/seo";
import { getFaqNewsroomPosts } from "@/lib/faq-newsroom-posts";

export const metadata: Metadata = staticPageMetadata(
  "Frequently Asked Questions for Consumers | AmeriLife",
  "Find answers to common questions about insurance for individuals and families. AmeriLife offers life, health, Medicare and financial solutions.",
  "/consumers/faq/"
);

export default async function ConsumersFaqPage() {
  const posts = await getFaqNewsroomPosts();

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
        <SiteBreadcrumb
          className="mb-8"
          items={[
            { label: "Home", href: "/" },
            {
              label: "Insurance for Individuals and Families",
              href: "/our-solutions/consumers/",
            },
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
        <FaqNewsroomSection posts={posts} />
      </div>
    </section>
  );
}
