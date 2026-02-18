"use client";

export function ValsparForm() {
  return (
    <form
      className="rounded-lg p-8"
      style={{ background: "var(--color-footer-bg)" }}
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="space-y-5">
        {/* First & Last Name row */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="valspar-first"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/90"
            >
              First Name
            </label>
            <input
              id="valspar-first"
              name="firstName"
              type="text"
              placeholder="First Name"
              className="w-full rounded border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/50 focus:border-[var(--color-brand-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-primary)]"
            />
          </div>
          <div>
            <label
              htmlFor="valspar-last"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/90"
            >
              Last Name
            </label>
            <input
              id="valspar-last"
              name="lastName"
              type="text"
              placeholder="Last Name"
              className="w-full rounded border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/50 focus:border-[var(--color-brand-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-primary)]"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="valspar-email"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/90"
          >
            Email
          </label>
          <input
            id="valspar-email"
            name="email"
            type="email"
            placeholder="Email"
            className="w-full rounded border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/50 focus:border-[var(--color-brand-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-primary)]"
          />
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="valspar-phone"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/90"
          >
            Phone
          </label>
          <input
            id="valspar-phone"
            name="phone"
            type="tel"
            placeholder="Phone"
            className="w-full rounded border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/50 focus:border-[var(--color-brand-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-primary)]"
          />
        </div>

        {/* Zip Code */}
        <div>
          <label
            htmlFor="valspar-zip"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/90"
          >
            Zip Code
          </label>
          <input
            id="valspar-zip"
            name="zip"
            type="text"
            placeholder="Zip Code"
            className="w-full rounded border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/50 focus:border-[var(--color-brand-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-primary)]"
          />
        </div>

        {/* CAPTCHA placeholder - actual CAPTCHA would be integrated separately */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/90">
            CAPTCHA
          </label>
          <div className="rounded border border-white/20 bg-white/5 p-4 text-sm text-white/70">
            CAPTCHA would be integrated here
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            className="inline-flex min-w-[160px] items-center justify-center rounded-lg bg-[var(--color-brand-primary)] px-8 py-4 text-base font-bold uppercase tracking-wide text-white shadow-lg transition-colors hover:bg-[var(--color-brand-primary-hover)] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-footer-bg)]"
          >
            Send
          </button>
        </div>

        <p className="text-xs leading-relaxed text-white/80">
          By submitting this form, you agree to allow an AmeriLife representative to contact you
          about our products and services.
        </p>
        <p className="text-xs text-white/70">
          Not affiliated with the United States government or federal Medicare program.
        </p>
      </div>
    </form>
  );
}
