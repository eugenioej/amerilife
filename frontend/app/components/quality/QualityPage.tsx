'use client';

import { useState } from 'react';
import Image from 'next/image';
import { rewriteUploadsUrl } from "@/lib/wp-media";
import dynamic from "next/dynamic";
import { Link } from "@/app/components/ui/Link";

const UPLOADS = "https://headlessameril.wpenginepowered.com/wp-content/uploads";
const BANNER_3 = `${UPLOADS}/2021/12/banner-10.png`;

const QUALITY_HERO_BG =
  "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/04/AML-Wealth-II-Announcement-040532023-HERO-1024x358-1.png";

const FadeInOnView = dynamic(
  () => import("@/app/components/ui/FadeInOnView"),
  { ssr: true }
);

const faqs = [
  {
    question: 'What is YQP?',
    answer:
      'Your Quality Partner (YQP) is a shared name and framework for the commitment to quality and ethics that has always defined how AmeriLife operates. It is not a new program, policy or mandate. It spotlights the work already happening across every affiliate, team and touchpoint and makes that work more visible and consistent.',
  },
  {
    question: 'Is YQP a new initiative or a new quality commitment?',
    answer:
      'No. YQP does not introduce a new standard. It gives a common language to the standard we have always held. The goal is to make AmeriLife’s quality reputation more recognizable across every employee, agent, affiliate, carrier relationship and customer interaction.',
  },
  {
    question: 'Why are we doing this now?',
    answer:
      'The market is changing. Carriers are cutting commissions and marketing dollars, chargebacks are rising, and the quality and persistency of enrollments have become the single most important metric carriers use to choose a distribution partner. In this environment, the quality of our business matters more than ever. YQP makes the standard we already live by more visible to the carriers, affiliates and beneficiaries who count on us.',
  },
  {
    question: 'What does YQP mean for me as an employee?',
    answer:
      'Nothing about your day-to-day changes. YQP does not add a burden or imply that prior work was insufficient. It gives the work you are already doing a shared name and story. Whether you are in the field or in a corporate role, the standard our agents are known for is built on the work you do every day.',
  },
  {
    question: 'What does YQP mean for agents in the field?',
    answer:
      'Selling with quality protects the agent’s own commissions, retention and Agent of Record relationships and it builds the trust that keeps clients for life. Being known as a quality-first agent is a competitive edge with carriers and clients alike. YQP makes that edge more visible and more consistent.',
  },
  {
    question: 'What does YQP mean for affiliate leadership?',
    answer:
      'YQP is support, not a top-down audit. Shared standards strengthen affiliates’ carrier relationships, not just AmeriLife’s. It provides training, reporting and oversight resources that help affiliates compete from a stronger platform while respecting their autonomy.',
  },
  {
    question: 'What does YQP mean for our carrier partners?',
    answer:
      'AmeriLife already delivers high-quality enrollments. YQP proves continued investment in oversight, agent monitoring and beneficiary protection. It positions AmeriLife as a partner that reduces carrier risk rather than adding to it and one that delivers business built for the long term.',
  },
  {
    question: 'Does this change our compliance requirements?',
    answer:
      'No. YQP reinforces the compliance discipline we already practice. It emphasizes shared standards and mutual success rather than compliance policing. The requirements themselves are not changing.',
  },
  {
    question: 'Is YQP a rebrand?',
    answer:
      'YQP is a framework and an expression, not a rebrand. It highlights and connects the quality-focused work already occurring across the organization. The name and mark are a rallying point for the discipline our moment demands, not a new identity.',
  },
  {
    question: 'What happens next?',
    answer:
      'Over the coming weeks, leaders across the organization will discuss YQP in existing meetings and share how it shows up in your area. You will hear more through follow-up communications, newsletters and leadership discussions. The first email introduces the topic; subsequent communications will build on it.',
  },
  {
    question: 'Who can I contact with questions?',
    answer:
      "Contact your leader or affiliate leadership. We'll share additional resources and follow-up communications in the coming weeks.",
  },
];

export default function QualityPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <main>
      {/* Hero */}
      <section className="relative w-full overflow-hidden">
        <div className="relative flex min-h-[min(40vh,520px)] w-full items-stretch">
          <Image
            src={rewriteUploadsUrl(QUALITY_HERO_BG)}
            alt=""
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
          {/* Dark gradient overlay for contrast - blue/teal left → green/teal right */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(14,50,80,0.92) 0%, rgba(0,58,116,0.88) 40%, rgba(0,155,124,0.78) 100%)",
            }}
            aria-hidden
          />
          {/* Centered title + button */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 py-8 text-center sm:px-6 sm:py-10">
            <h1 className="mb-5 max-w-[min(100%,48rem)] text-balance text-xl font-bold leading-snug text-white drop-shadow-sm sm:mb-6 sm:text-2xl sm:leading-tight md:text-3xl md:leading-tight lg:text-4xl xl:text-5xl">
              Your Quality Partner
            </h1>
            <p className="max-w-3xl text-base leading-relaxed text-white/95">
              Your Quality Partner (YQP) is the shared framework that highlights the commitment to quality, ethics, and beneficiary-first service that has always been part of how AmeriLife operates.
            </p>
            
          </div>
        </div>
      </section>

      {/* Video */}
      <section className="py-16 md:py-24 bg-[#f0f0f0]">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 text-center">
            <h2 className="mb-6 text-center text-2xl font-bold text-[var(--color-fg)] sm:text-3xl">
              Hear from Scotty Elliott
            </h2>
          </div>

          <div className="overflow-hidden rounded-3xl shadow-xl">
            <div className="aspect-video">
              <iframe
                src="https://player.vimeo.com/video/1231432348"
                className="h-full w-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title="iv className=mb-12 text-center"/>
            </div>
           
          </div>
        </div>
      </section>

    {/* FAQ */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-6 text-2xl text-center font-bold text-[var(--color-fg)] sm:text-3xl">
              Frequently Asked Questions
            </h2>

          <div className="space-y-4 mx-auto max-w-3xl">
            {faqs.map((faq, index) => (
              <FaqItem
                key={faq.question}
                faq={faq}
                isOpen={openIndex === index}
                onToggle={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
              />
            ))}
          </div>

        </div>
      </section>

      {/* Contact */}
      <FadeInOnView
        direction="up"
        className="relative min-h-[320px] w-full overflow-hidden bg-cover bg-center py-16 text-center lg:py-20"
        style={{ backgroundImage: `url(${rewriteUploadsUrl(BANNER_3)})` }}
      >
        <div className="absolute inset-0 bg-black/30" aria-hidden />
        <div className="relative mx-auto flex max-w-[var(--container-max)] flex-col items-center px-[var(--container-padding-x)] text-center">
          <h2 className="mb-4 text-2xl font-bold text-white sm:text-3xl">
            Connect with AmeriLife
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-white">
            Contact your leader or affiliate leadership. Additional resources and communications will be shared in the coming weeks.
          </p>
          <Link
            href="https://amerilife.com/contact/"
            target="_blank"
            rel="noopener noreferrer"
            variant="button"
            className="motion-cta inline-flex w-fit items-center gap-2.5 rounded-[var(--radius-full)] border-0 bg-white px-8 py-4 text-base font-bold uppercase tracking-[var(--tracking-normal)] text-[var(--color-brand-primary)] shadow-sm transition-opacity hover:opacity-90 no-underline sm:text-lg"
          >
            Contact Us
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </FadeInOnView>
    </main>
  );
}

function FaqItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: {
    question: string;
    answer: string;
  };
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <FadeInOnView
      direction="up"
      className="border-b border-[var(--color-border)]"
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center justify-between py-6 text-left text-lg font-semibold text-[var(--color-fg)] transition-colors hover:text-[var(--color-brand-primary)]"
        aria-expanded={isOpen}
      >
        {faq.question}
        <span
          className="ml-4 inline-flex h-8 w-8 shrink-0 items-center justify-center text-2xl font-medium leading-none text-current"
          aria-hidden
        >
          {isOpen ? "−" : "+"}
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="pb-6 pr-8 text-base leading-relaxed text-[var(--color-muted)]">
          {faq.answer}
        </div>
      </div>
    </FadeInOnView>
  );
}