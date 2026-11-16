export function ResourcesIntro() {
  return (
    <section className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">

      {/* Left column */}
      <div className="space-y-5">
        <h2 className="max-w-[400px] lg:max-w-[500px] text-3xl font-bold leading-tight text-[#244364] md:text-4xl">
          Everything You Need to Learn, Connect and Grow
        </h2>

        <p className="prose prose-sm mt-6 max-w-full lg:max-w-xl text-[var(--color-muted)] [&_p]:mb-4">
          Welcome to the ideaXchange Resources hub, where tools,
          courses, and learning opportunities power your success at
          AmeriLife. Build momentum with{" "}
          <strong>
            sales training, recruiting tools, knowledge resources and
            branding services.
          </strong>
        </p>

        <p className="prose prose-sm mt-6 max-w-full lg:max-w-xl text-[var(--color-muted)] [&_p]:mb-4">
          Build skills, connect with colleagues and move your career
          forward. Explore the resources below to learn, collaborate
          and thrive.
        </p>
      </div>

      {/* Right column: video placeholder */}
      <div className="relative aspect-video w-full overflow-hidden rounded-md bg-[#102735]">

        <div className="absolute inset-0 bg-black/30" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white text-white">

            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ml-1"
              aria-hidden="true"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>

          </div>
        </div>

      </div>

    </section>
  );
}