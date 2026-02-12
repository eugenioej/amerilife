"use client";

import { useState } from "react";
import { Link } from "../ui/Link";

type FaqItem = {
  question: string;
  answer: string | React.ReactNode;
};

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "I'm a business owner and ready to partner with AmeriLife. Who do I contact?",
    answer: (
      <>
        We can&apos;t wait to speak with you! Please email Patrick Nichols, AmeriLife&apos;s
        Senior Vice President of Corporate Development, at{" "}
        <a
          href="mailto:pnichols@amerilife.com"
          className="text-[var(--color-link)] hover:underline"
        >
          pnichols@amerilife.com
        </a>{" "}
        to get started.
      </>
    ),
  },
  {
    question: "I'm an insurance company and want to engage AmeriLife. Where do I start?",
    answer: (
      <>
        To learn more about partnering with AmeriLife,{" "}
        <Link href="/contact/" className="text-[var(--color-link)] hover:underline">
          contact us here
        </Link>
        .
      </>
    ),
  },
  {
    question: "What solutions does AmeriLife offer independent agents and advisors?",
    answer: (
      <>
        From industry-best solutions from over 100 carriers, to our vast national
        distribution network, AmeriLife was built to grow and accelerate your
        business. To learn more, visit our{" "}
        <Link href="/our-solutions/agents-and-advisors/" className="text-[var(--color-link)] hover:underline">
          Agents & Advisors
        </Link>{" "}
        and{" "}
        <Link href="/our-solutions/affiliates/" className="text-[var(--color-link)] hover:underline">
          Affiliates
        </Link>{" "}
        pages.
      </>
    ),
  },
  {
    question: "How does someone become an AmeriLife career agent?",
    answer: (
      <>
        It&apos;s easy! Click{" "}
        <Link href="/join-our-team/" className="text-[var(--color-link)] hover:underline">
          here
        </Link>{" "}
        to start your journey toward becoming an AmeriLife-affiliated agent.
      </>
    ),
  },
  {
    question: "AmeriLife sounds like the place for me! How can I join the team?",
    answer: (
      <>
        We&apos;re biased, but we think it&apos;s a pretty great place, too. Visit
        our{" "}
        <Link href="/our-solutions/employees/" className="text-[var(--color-link)] hover:underline">
          Employees
        </Link>{" "}
        page for more on our company and to browse corporate professional
        opportunities.
      </>
    ),
  },
  {
    question: "I'm a prospective customer. How can I get a quote?",
    answer: (
      <>
        Welcome to AmeriLife! We&apos;re excited for the possibility to serve you. To
        learn more about the products and solutions we distribute, and to connect
        with an agent in your area, visit our{" "}
        <Link href="/our-solutions/consumers/" className="text-[var(--color-link)] hover:underline">
          Consumers
        </Link>{" "}
        page.
      </>
    ),
  },
  {
    question: "Does AmeriLife offer retirement services beyond conventional planning?",
    answer: (
      <>
        Yes, we offer a range of fee-based asset management services and
        solutions. To learn more, visit our{" "}
        <Link href="/about-us/our-distribution/brokerage-division/" className="text-[var(--color-link)] hover:underline">
          Wholesale Brokerage
        </Link>{" "}
        and{" "}
        <Link href="/about-us/our-distribution/wealth-management/" className="text-[var(--color-link)] hover:underline">
          Institutional Wealth Management, Broker-Dealer & RIA pages
        </Link>
        .
      </>
    ),
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--container-padding-x)]">
        <h2 className="mb-12 text-center text-3xl font-bold text-[var(--color-fg)] sm:text-4xl">
          Questions? We&apos;ve Got Answers.
        </h2>

        <div className="mx-auto max-w-3xl space-y-2">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="border-b border-[var(--color-border)]"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between py-6 text-left text-lg font-semibold text-[var(--color-fg)] transition-colors hover:text-[var(--color-brand-primary)]"
                  aria-expanded={isOpen}
                >
                  {item.question}
                  <span
                    className={`ml-4 shrink-0 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
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
                    {typeof item.answer === "string" ? (
                      item.answer
                    ) : (
                      item.answer
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
