"use client";

import { useState } from "react";
import { Link } from "../ui/Link";

type FaqItem = {
  question: string;
  answer: React.ReactNode;
};

const BROKERS_FAQ_ITEMS: FaqItem[] = [
  {
    question: "What Does an Independent Insurance Agent Do?",
    answer: (
      <>
        Have you been considering a career as an insurance agent? If so, while researching the
        possibilities, perhaps you noticed some agents identify themselves as independent, and wondered
        what this means. Within the insurance industry, &quot;independent&quot; refers to contracted
        sales professionals who work with multiple carrier partners. Independent agents are
        self-employed, pay their own taxes, acquire their own benefits, and offer clients a broader
        selection of products from various insurers. To learn more, visit our{" "}
        <Link href="/our-solutions/agents-and-advisors/" className="text-[var(--color-link)] hover:underline">
          Agents & Advisors
        </Link>{" "}
        page.
      </>
    ),
  },
  {
    question: "What can AmeriLife do for my business?",
    answer: (
      <>
        By aligning with AmeriLife, you can tap into resources like capital and scale unavailable to
        most stand-alone agencies and brokers. We also offer numerous value-added services that will
        save you time and money and allow you to focus on growing your business. From leads and
        marketing support to innovative technology, training, and back-office services, AmeriLife
        provides the infrastructure to accelerate your success.{" "}
        <Link href="/broker-contact-page/" className="text-[var(--color-link)] hover:underline">
          Contact us
        </Link>{" "}
        to learn more about what we can do for your business.
      </>
    ),
  },
  {
    question: "How can I use your distribution to sell our products?",
    answer: (
      <>
        By aligning with AmeriLife, your company gains access to a nationwide network of insurance
        offices and annuity, life and health marketing groups. Our distribution platform connects
        carriers with thousands of agents and advisors across the country.{" "}
        <Link href="/broker-contact-page/" className="text-[var(--color-link)] hover:underline">
          Learn more about doing business with AmeriLife
        </Link>
        .
      </>
    ),
  },
];

export function BrokersFaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-3xl space-y-2">
      {BROKERS_FAQ_ITEMS.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index} className="border-b border-[var(--color-border)]">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full cursor-pointer items-center justify-between py-6 text-left text-lg font-semibold text-[var(--color-fg)] transition-colors hover:text-[var(--color-brand-primary)]"
              aria-expanded={isOpen}
            >
              {item.question}
              <span className={`ml-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-200 ${
                isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="pb-6 pr-8 text-base leading-relaxed text-[var(--color-muted)]">
                {item.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
