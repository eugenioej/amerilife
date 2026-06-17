import Image from "next/image";
import { GravityForm } from "@/app/components/gravity-forms/GravityForm";
import { CONTRIBUTOR_FORM_ID, fetchGravityForm } from "@/lib/gf-client";

export default async function ContributorForm() {

  let contributorForm = null;
  try {
    contributorForm = await fetchGravityForm(CONTRIBUTOR_FORM_ID);
  } catch {
    contributorForm = null;
  }

  return (
    <section className="bg-[#f3f3f3] py-16 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">

        {/* ROW */}
        <div className="flex flex-col md:flex-row">

          {/* LEFT SIDEBAR */}
          <div className="bg-[#efefef] md:w-[380px] w-full flex-shrink-0 px-8 pt-12 pb-10 flex flex-col items-center text-center">
            <Image
              src="https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/06/AmeriLife-Icon-Navy-021725-CG-1.png"
              alt="AmeriLife icon"
              width={155}
              height={150}
              className="mb-6"
            />

            <div className="w-60 h-[3px] bg-[var(--color-brand-primary)] mb-8 mt-2" />

            <p className="text-center font-semibold text-base leading-relaxed text-[black] max-w-[95%]"> 
              Please review the content{" "}
                <a
                  href="https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/06/AmeriLife-Insights-Content-Submission-Guidelines-5.21.26.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-brand-primary hover:text-brand-primary/80"
                >
                   submission guidelines
                </a>{" "}
                before submitting your article for publication.

            </p>

          </div>

          {/* RIGHT COLUMN */}
          <div className="flex-1 bg-white px-8 py-10 md:px-10 md:py-10">

            <p className="text-sm text-[black] leading-relaxed mb-6">
              Thought leadership is a powerful content marketing tool for building awareness and influence. The AmeriLife Insights editorial team will help you write persuasive, educational, and thought-provoking articles that fit your goals, share your experience, and position you as an industry-leading subject matter expert.
            </p>

            <h3 className="text-[var(--color-brand-primary)] font-bold tracking-wide mb-3">
              HOW TO CONTRIBUTE
            </h3>

            {/* ✅ MISSING PARAGRAPH RESTORED */}
            <p className="text-sm text-[black] leading-relaxed mb-5">
              There are several ways to contribute to AmeriLife Insights. Each is designed to match your level of involvement. Our goal is to make your contribution as impactful as possible and as easy as possible, with the full support of our editorial team. The expected turnaround time for each article submission, including compliance review, is approximately two to three weeks.
            </p>

            {/* ✅ FULL LIST RESTORED */}
            <ol className="text-sm text-[black] space-y-3 mb-8 list-decimal pl-5">
              <li>
                Submit an original article for publication (see content submission guidelines).
              </li>
              <li>
                Send us a rough draft summary of your article’s topic, supporting statements, or bullet points. We will write, edit, polish, proofread, and send back a completed article for your review/approval.
              </li>
              <li>
                Submit your article topic and schedule a call with the AmeriLife Insights editorial team. We will interview you based on your topic and write the article on your behalf. You will have final editing and approval rights (refer to submission guidelines for information on the types of articles we can help develop).
              </li>
              <li>
                Choose from one of our pre-developed, evergreen story topics relevant to your business and of interest to our audience. Add in your unique perspective utilizing any of the three options above, and we will do the rest (story topics are emailed weekly).
              </li>
            </ol>

            {/* FORM */}
            {contributorForm ? (
              <GravityForm form={contributorForm} />
            ) : (
              <p className="text-sm text-[var(--color-muted)]">
                The contributor form is temporarily unavailable. Please call{" "}
                <a
                  href="tel:+18004587112"
                  className="text-[var(--color-link)] underline-offset-4 hover:text-[var(--color-link-hover)] hover:underline"
                >
                  (800) 458-7112
                </a>{" "}
                or try again later.
              </p>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}