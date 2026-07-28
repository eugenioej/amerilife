import Script from "next/script";

export default function SupportSection() {
  return (
    <section className="bg-white px-6 py-12 md:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[30%_70%] lg:gap-18">
          <div className="flex flex-col">
            <p className="mb-2 pl-1 text-sm font-semibold uppercase tracking-[0.28em] text-[#3fa590]/80">
              Marketing Support
            </p>

            <h1 className="text-3xl font-bold text-[var(--color-fg)] sm:text-4xl">
              Request Support
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-[#244260] md:text-lg">
              Complete the form and we will be in touch if we have any questions. 
            </p>

            <div className="mt-9 border-l-4 border-[#3fa590] bg-[#3FA590]/10 p-5 md:p-6 rounded-r-lg">
              <p className="text-base leading-8 text-[#244260]">
                <strong>Important: </strong>
                Any requests received after <strong>3:00 PM</strong> will be
                processed on the following business day.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="min-w-0 flex-1 rounded-lg bg-[#f7f8f9] p-2 sm:p-8">
              <Script
                src="https://js.hsforms.net/forms/embed/23344415.js"
                strategy="afterInteractive"
              />

              <div
                className="hs-form-frame w-full"
                data-region="na1"
                data-form-id="2f4fbd59-3188-4a80-beed-d2d69a147b74"
                data-portal-id="23344415"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}