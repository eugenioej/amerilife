"use client";

import Image from "next/image";
import Link from "next/link";

/* ========================================
   CONSTANTS
======================================== */
const UPLOADS =
  "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/05";

const IMAGES = {
  wordmark: `${UPLOADS}/Masterminds26-Wordmark-White-Shaded-031026-CG.png`,
  icon: `${UPLOADS}/Masterminds26-Icon-Green-031026-CG.png`,
  footerBg: `${UPLOADS}/AdobeStock_1515066628.png`,
  footerLogo: `${UPLOADS}/Masterminds26-Logo-White-031026-CG.png`,
  amerilife:
    "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/04/AmeriLife-Logo-white-s.webp",
};

/* ========================================
   PAGE
======================================== */
export default function Page() {
  return (
    <div className="masterminds-page bg-[#091229] min-h-screen">
      <HeroSection />
      <AgendaSection />
      {/* Optional — remove if you don't want footer */}
      <FooterSection />
    </div>
  );
}

/* ========================================
   HERO
======================================== */
function HeroSection() {
  return (
    <div className="text-center text-white pt-16 px-5">

      {/* LOGO */}
      
<div className="mx-auto mb-6 w-[220px] sm:w-[300px]">
  <Link href="/masterminds/agendas/" className="block">
    <Image
      src={IMAGES.wordmark}
      alt="Masterminds"
      width={420}
      height={120}
      className="w-full h-auto cursor-pointer transition hover:scale-102"
    />
  </Link>
</div>


      {/* TITLE */}
      <h1 className="text-2xl sm:text-4xl font-bold mb-4">
        Select Your <span className="text-[#03f080]">Agenda</span>
      </h1>

      {/* SUBTEXT */}
      <p className="mx-auto max-w-[520px] text-sm sm:text-base text-white/80 mb-10">
        Please choose your track below to view your personalized Masterminds agenda.
      </p>

    </div>
  );
}

/* ========================================
   AGENDA (CARDS)
======================================== */
function AgendaSection() {
  return (
    <section className="px-5 pb-40">
      <div className="mx-auto max-w-[900px]">

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          {/* A&RI */}
          <Link
  href="/masterminds/agendas/a-ri"
  className="group rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white transition hover:bg-white/10 hover:border-[#03f080]/40 hover:scale-[1.02]"
>
  {/* ICON ABOVE */}
  <div className="mb-4 flex justify-center">
    <Image
      src={IMAGES.icon}
      alt=""
      width={40}
      height={40}
      className="transition group-hover:scale-110"
    />
  </div>

  <h2 className="text-xl font-semibold mb-3">
    A&amp;RI Agenda
  </h2>

  <p className="text-sm text-white/70 leading-relaxed">
    View the Accumulation &amp; Retirement Income agenda.
  </p>

  <span className="inline-block mt-6 text-sm font-semibold text-[#03f080]">
    View Agenda →
  </span>
</Link>


          {/* HEALTH */}
          <Link
  href="/masterminds/agendas/health"
  className="group rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white transition hover:bg-white/10 hover:border-[#03f080]/40 hover:scale-[1.02]"
>
  {/* ICON ABOVE */}
  <div className="mb-4 flex justify-center">
    <Image
      src={IMAGES.icon}
      alt=""
      width={40}
      height={40}
      className="transition group-hover:scale-110"
    />
  </div>

  <h2 className="text-xl font-semibold mb-3">
    Health Agenda
  </h2>

  <p className="text-sm text-white/70 leading-relaxed">
    View the Health track agenda.
  </p>

  <span className="inline-block mt-6 text-sm font-semibold text-[#03f080]">
    View Agenda →
  </span>
</Link>

        </div>

      </div>
    </section>
  );
}

/* ========================================
   FOOTER
======================================== */
function FooterSection() {
  return (
    <section className="relative overflow-hidden bg-[#091229] pt-10 pb-16 sm:pb-32 text-white">

      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={IMAGES.footerBg}
          alt=""
          className="h-full w-full object-cover scale-105 sm:scale-110 opacity-30 sm:opacity-40"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-[#091229] via-[#091229]/50 to-[#091229]" />

      <div className="relative z-10 mx-auto max-w-[900px] px-5 sm:px-6 text-center space-y-8 sm:space-y-10">

        <LogoBlock />
        <AirTransfers />
        <Divider />
        <Contacts />
        <AmeriLifeLogo />

      </div>
    </section>
  );
}

function LogoBlock() {
  return (
    <>
      <div className="mx-auto w-[140px] sm:w-[200px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={IMAGES.footerLogo} alt="" className="w-full h-auto" />
      </div>
      <p className="text-sm font-semibold tracking-wide text-[#03f080]">
        June 15 – 17, 2026 | Grand Hyatt Tampa Bay, FL
      </p>
    </>
  );
}

function AirTransfers() {
  return (
    <div className="space-y-1.5 sm:space-y-2 text-sm sm:text-base">
      <p className="uppercase tracking-wide text-white/60 font-semibold">
        Air Transfers
      </p>

      <p>
        Kris Gudenrath, EPIC Travel Partners<br />

        <a
          href="tel:14802091863"
          className="hover:underline"
        >
          (480) 209-1863
        </a>{" "}
        •{" "}
        <a
          href="mailto:KrisG@EpicIntl.net"
          className="hover:underline"
        >
          KrisG@EpicIntl.net
        </a>
      </p>
    </div>
  );
}

function Contacts() {
  return (
    <div className="space-y-2.5 sm:space-y-3 text-sm sm:text-base">
      <p className="uppercase tracking-wide text-white/60 font-semibold">
        AmeriLife On-Site Contacts
      </p>

      <div className="space-y-1.5 sm:space-y-2">

        <p>
          Megan Hill • Hotel<br />
          <a href="tel:17275055133" className="hover:underline">
            (727) 505-5133
          </a>
        </p>

        <p>
          Amanda Spadafora • Hotel<br />
          <a href="tel:17273666092" className="hover:underline">
            (727) 366-6092
          </a>
        </p>

        <p>
          Taylor Perko • All Other Inquiries<br />
          <a href="tel:17274039295" className="hover:underline">
            (727) 403-9295
          </a>
        </p>

      </div>
    </div>
  );
}

function Divider() {
  return <div className="mx-auto h-px w-16 sm:w-20 bg-white/10" />;
}

function AmeriLifeLogo() {
  return (
    <div className="pt-6 sm:pt-10">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={IMAGES.amerilife}
        alt="AmeriLife"
        className="mx-auto w-[150px] sm:w-[200px] h-auto opacity-80"
      />
    </div>
  );
}