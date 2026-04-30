"use client";

const TARGET_ID = "home-next";

export function HeroScrollDownButton() {
  function scrollToNext() {
    document.getElementById(TARGET_ID)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-6 z-20 flex justify-center sm:bottom-10">
      <button
        type="button"
        onClick={scrollToNext}
        className="pointer-events-auto text-white/90 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        aria-label="Scroll to next section"
      >
        <span className="relative inline-flex h-11 w-7 rounded-full border-2 border-current bg-transparent shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
          <span
            className="hero-scroll-mouse-dot absolute left-1/2 top-1/2 size-1.5 rounded-full bg-current"
            aria-hidden
          />
        </span>
      </button>
    </div>
  );
}
