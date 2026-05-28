import Image from "next/image";

/* ========================================
   CONSTANTS
======================================== */
const UPLOADS =
  "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/05";

const IMAGES = {
  hero: `${UPLOADS}/stefano-bucciarelli-59HOF9zHKNs-unsplash.jpg`,
  wordmark: `${UPLOADS}/Masterminds26-Wordmark-White-Shaded-031026-CG.png`,
  scrollIcon: `${UPLOADS}/Masterminds26-Icon-Green-031026-CG.png`,
  footerBg: `${UPLOADS}/AdobeStock_1515066628.png`,
  footerLogo: `${UPLOADS}/Masterminds26-Logo-White-031026-CG.png`,
  qrCode: `${UPLOADS}/MASTERMINDS_Digital_Agenda_Page-scaled.png`,
  amerilife:
    "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/04/AmeriLife-Logo-white-s.webp",
};

/* ========================================
   PAGE
======================================== */
export default function Page() {
  return (
    <div className="masterminds-page">
      <HeroSection />
      <AgendaSection />
      <FooterSection />
    </div>
  );
}

/* ========================================
   HERO
======================================== */
function HeroSection() {
  return (
    <section className="relative flex min-h-[85vh] sm:min-h-screen items-center overflow-hidden bg-[#091229] text-white">

      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src={IMAGES.hero}
          alt=""
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#091229]" />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#091229]/95 via-[#091229]/80 to-[#091229]/95" />
      <div className="absolute bottom-0 left-0 right-0 h-32 sm:h-40 backdrop-blur-[2px] bg-gradient-to-b from-transparent via-[#091229]/50 to-[#091229]" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-[820px] px-5 sm:px-6 text-center">

        <div className="mx-auto mb-3 sm:mb-6 w-[220px] sm:w-[300px] lg:w-[340px]">
          <Image
            src={IMAGES.wordmark}
            alt="Masterminds"
            width={420}
            height={120}
            className="w-full h-auto"
          />
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold sm:text-5xl">
          Masterminds <span className="text-[#03f080]">Agenda</span>
        </h1>

        <p className="mt-3 inline-block px-4 py-2 text-center text-sm font-semibold tracking-wide text-white rounded-full border border-[#03f080]/40 bg-[#03f080]/20 shadow-[0_0_10px_rgba(3,240,128,0.2)] sm:px-6">
          June 15 – 17, 2026 • Grand Hyatt Tampa Bay, FL
        </p>

        <p className="mx-auto mt-3 sm:mt-5 max-w-[600px] text-sm leading-relaxed text-white/85">
          Scan the QR codes below for detailed agendas by track. Business
          casual attire is recommended for meetings, and resort casual for
          group dinners. Unless otherwise noted, group functions combine
          the Health and A&amp;RI distributions. The agenda may change.
        </p>
      </div>

      {/* Scroll */}
      <a
        href="#agenda"
        className="absolute bottom-6 sm:bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center text-[#03f080]"
      >
        <div className="mb-2 animate-[pulse_2.5s_infinite] drop-shadow-[0_0_16px_rgba(3,240,128,0.8)]">
          <Image src={IMAGES.scrollIcon} alt="" width={36} height={36} />
        </div>
        <span className="text-xs tracking-wider">VIEW AGENDA</span>
      </a>
    </section>
  );
}

/* ========================================
   AGENDA
======================================== */
function AgendaSection() {
  return (
    <section id="agenda" className="bg-[#091229] py-12 sm:py-24">

      <div className="mx-auto max-w-[1000px] px-5 sm:px-6">

        <div className="rounded-2xl bg-[#f0fdf4] px-4 py-7 sm:px-10 sm:py-10 shadow-xl">

          <div className="mb-8 sm:mb-12 text-center">
            <h2 className="text-xl sm:text-3xl font-bold text-[#091229]">
              Event Schedule
            </h2>

            <p className="mt-2 sm:mt-3 text-sm text-gray-500">
              June 15 – 17, 2026 • Grand Hyatt Tampa Bay, FL
            </p>
          </div>

          <div className="space-y-10 sm:space-y-14">
            <Day title="Monday, June 15, 2026" items={[
              "12:30 PM: Conference Check-in Begins",
              "1:00 PM – 4:00 PM: A&RI General Session, Audubon Ballroom",
              "6:00 PM – 8:00 PM: Group Dinner, Oystercatchers",
            ]} />

            <Day title="Tuesday, June 16, 2026" items={[
              "8:00 AM – 9:00 AM: Group Breakfast & Networking",
              "9:00 AM – 11:30 AM: General Sessions",
              "Health: Audubon Ballroom",
              "A&RI: White Ibis",
              "11:30 PM – 12:30 PM: Group Lunch",
              "12:30 PM – 4:30 PM: General Sessions",
              "Health: Audubon Ballroom",
              "A&RI: White Ibis",
              "6:00 PM – 8:00 PM: Offsite Dinners",
            ]} />

            <Day title="Wednesday, June 17, 2026" items={[
              "8:00 AM – 9:00 AM: Group Breakfast",
              "9:00 AM – 12:00 PM: General Sessions",
              "Health: Audubon Ballroom",
              "A&RI: White Ibis",
              "12:00 PM – 12:30 PM: Grab ‘n’ Go Lunches",
            ]} />
          </div>
        </div>

        {/* ================= QR SECTION ================= */}
<div className="mt-8 sm:mt-10 text-center text-white">

  {/* COPY */}
  <p className="mx-auto max-w-[600px] text-sm leading-relaxed text-white/80">
    Carriers are invited to all meeting sessions within their registered track.
  </p>

  
{/* QR GRID */}
<div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 max-w-[520px] mx-auto">

  {/* QR 1 */}
  <div className="flex flex-col items-center gap-3 group">
    <div className="rounded-xl bg-white p-2 transition-transform duration-300 group-hover:scale-105">
      <Image
        src={IMAGES.qrCode}
        alt="Scan for agenda"
        width={140}
        height={140}
      />
    </div>

    <span className="text-sm font-semibold tracking-wide text-[#03f080]">
      Scan for Health Agenda
    </span>
  </div>

  {/* QR 2 */}
  <div className="flex flex-col items-center gap-3 group">
    <div className="rounded-xl bg-white p-2 transition-transform duration-300 group-hover:scale-105">
      <Image
        src={IMAGES.qrCode}
        alt="Scan for agenda"
        width={140}
        height={140}
      />
    </div>

    <span className="text-sm font-semibold tracking-wide text-[#03f080]">
      Scan for A&amp;RI Agenda
    </span>
  </div>

</div>
</div>


      </div>
      
    </section>
  );
}

/* ========================================
   DAY
======================================== */

type DayProps = {
  title: string;
  items: string[];
  note?: string;
};

function Day({ title, items}: DayProps) {

  return (
    <div className="border-l-4 border-[#03f080] pl-4">
      <h3 className="mb-3 text-base sm:text-xl font-semibold text-[#091229]">
        {title}
      </h3>

      <ul className="space-y-2 sm:space-y-3 text-gray-700 text-[13px] sm:text-[15px] leading-relaxed">
        {items.map((item: string, i: number) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
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