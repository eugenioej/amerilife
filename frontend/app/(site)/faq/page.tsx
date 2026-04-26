import type { Metadata } from "next";
import { SiteBreadcrumb } from "@/app/components/layout/SiteBreadcrumb";
import { FaqNewsroomSection } from "@/app/components/faq/FaqNewsroomSection";
import { staticPageMetadata } from "@/lib/seo";
import { getFaqNewsroomPosts } from "@/lib/faq-newsroom-posts";

export const metadata: Metadata = staticPageMetadata(
  "Frequently Asked Questions | AmeriLife",
  "Find answers to common questions about partnering with AmeriLife, becoming an agent, and our insurance and financial solutions.",
  "/faq/"
);

export default async function FaqPage() {
  const posts = await getFaqNewsroomPosts();

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
        <SiteBreadcrumb
          className="mb-8"
          items={[
            { label: "Home", href: "/" },
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
