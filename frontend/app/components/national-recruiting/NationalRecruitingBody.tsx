import Script from "next/script";

export default function SupportSection() {
  return (
    <section className="bg-white px-6 py-12 md:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[30%_70%] lg:gap-18">
          <div className="flex flex-col">
            <p className="mb-2 pl-1 text-sm font-semibold uppercase tracking-[0.28em] text-[#3fa590]/80">
              AmeriLife Marketing
            </p>

            <h1 className="text-3xl font-bold text-[var(--color-fg)] sm:text-4xl">
              Become Part 
              <br/>
              of the National 
              <br/>
              Recruiting Campaign
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-[#244260] md:text-lg">
              Complete the form, and a team member will be in touch with next steps. 
            </p>

          </div>

          <div className="flex items-start">
            <div className="min-w-0 flex-1 rounded-lg bg-[#f7f8f9] p-2 sm:p-8">
            <Script 
            src="https://js.hsforms.net/forms/embed/50694998.js" defer></Script>

            <div 
            className="hs-form-frame" data-region="na1" 
            data-form-id="09bc375a-ca74-40bd-9125-9140b810b22e" 
            data-portal-id="50694998"/>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}