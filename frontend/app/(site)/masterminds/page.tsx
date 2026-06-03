import Image from "next/image";
import Link from "next/link";

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
    <section className="bg-[#091229] py-14 sm:py-20" id="agenda">
      <div className="mx-auto max-w-[1000px] px-5 sm:px-6">
        {/* SCHEDULE CARD */}
        <div className="rounded-2xl bg-[#f0fdf4] px-4 py-7 sm:px-10 sm:py-10 shadow-xl">

<div className="space-y-10 sm:space-y-14">

  {/* MONDAY */}
  <Day
    title="Monday, June 15, 2026"
    items={[
      {
        text: "12:30 PM: Conference Check-in Begins",
      },
      {
        text: "1:00 PM – 4:00 PM: A&RI General Session, Audubon Ballroom",
      },
      {
        text: "6:00 PM – 8:00 PM: Group Dinner, Oystercatchers",
        children: [
          {
            text:
              "Please note that this location is a 10-minute walk from the hotel. For easy access, kindly take the walkway located beyond the surface parking lot. If needed, hotel shuttles are available upon request at the front drive (valet stand) of the hotel for transportation.",
          },
        ],
      },
    ]}
  />

  {/* TUESDAY */}
  <Day
    title="Tuesday, June 16, 2026"
    items={[
      {
        text:
          "8:00 AM – 9:00 AM: Group Breakfast & Networking, Audubon Ballroom A",
      },
      {
        text: "9:00 AM – 11:30 AM: General Sessions",
        children: [
          {
            text: "Health: Audubon Ballroom",
          },
          {
            text: "A&RI: White Ibis",
          },
        ],
      },
      {
        text: "11:30 AM – 12:30 PM: Group Lunch, Audubon Ballroom A",
      },
      {
        text: "12:30 PM – 4:30 PM: General Sessions",
        children: [
          {
            text: "Health: Audubon Ballroom",
          },
          {
            text: "A&RI: White Ibis",
          },
        ],
      },
      {
        text: "6:00 PM – 8:00 PM: Offsite Dinners",
        children: [
          {
            text: "Health: Whiskey Cakes",
          },
          {
            text: "A&RI: TBD",
          },
          {
            text:
              "For offsite dinner transportation details, please scan the Health or A&RI QR code below that corresponds to your track.",
          },
        ],
      },
    ]}
  />

  {/* WEDNESDAY */}
  <Day
    title="Wednesday, June 17, 2026"
    items={[
      {
        text: "8:00 AM – 9:00 AM: Group Breakfast, Audubon Ballroom A",
      },
      {
        text: "9:00 AM – 12:00 PM: General Sessions",
        children: [
          {
            text: "Health: Audubon Ballroom",
          },
          {
            text: "A&RI: White Ibis",
          },
        ],
      },
      {
        text: "12:00 PM – 12:30 PM: Grab ‘n’ Go Lunches, Audubon Ballroom Foyer",
      },
    ]}
  />

</div>
        </div>

{/* QR SECTION */}
<div className="mt-12 text-center">
  <Link href="/masterminds/agendas/" className="inline-block group">

    {/* QR */}
    
<div className="mx-auto mb-4 w-[140px]">
  <Image
    src={IMAGES.qrCode}
    alt="QR Code"
    width={140}
    height={140}
    className="w-full h-auto rounded-xl transition group-hover:scale-102"
  />
</div>


    {/* GREEN TITLE */}
    <p className="text-base font-semibold text-[#03f080] tracking-wide">
      Scan or Click for Agenda&apos;s
    </p>

  </Link>
</div>


      </div>
    </section>
  );
}

/* ========================================
   DAY
======================================== */
type AgendaItem = {
  text: string;
  children?: AgendaItem[];
};

type DayProps = {
  title: string;
  items: AgendaItem[];
};

function Day({ title, items }: DayProps) {
  return (
    <div className="border-l-4 border-[#03f080] pl-4">
      <h3 className="mb-3 text-base sm:text-xl font-semibold text-[#091229]">
        {title}
      </h3>

      <ul className="space-y-3">
        {items.map((item, i) => (
          <AgendaNode key={i} item={item} level={0} />
        ))}
      </ul>
    </div>
  );
}

function AgendaNode({
  item,
  level,
}: {
  item: AgendaItem;
  level: number;
}) {
  const isSpeaker = item.text.toLowerCase().startsWith("speakers");
  const isNote = item.text.toLowerCase().startsWith("please note");

  return (
    <li>
      <div
        className={`
          flex items-start gap-2
          ${
            level === 0
              ? "text-gray-800 font-medium"
              : level === 1
              ? "pl-4 text-[13px] text-gray-700"
              : "pl-6 text-[12px] text-gray-500"
          }
          ${isSpeaker ? "italic text-gray-500" : ""}
          ${isNote ? "italic text-gray-500 mt-1" : ""}
        `}
      >
        {/* Level 1 bullet (dot) */}
        {level === 1 && (
          <span className="mt-[6px] h-1.5 w-1.5 bg-gray-400 rounded-full flex-shrink-0" />
        )}

        {/* Level 2 bullet (smaller lighter circle) */}
        {level === 2 && (
          <span className="mt-[6px] h-1 w-1 rounded-full border border-gray-400 flex-shrink-0" />
        )}

        {/* Text */}
        <span>{formatText(item.text)}</span>
      </div>

      {item.children && (
        <ul className="mt-1 space-y-1">
          {item.children.map((child, i) => (
            <AgendaNode key={i} item={child} level={level + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

function formatText(text: string) {
  const match = text.match(/^(\d{1,2}:\d{2}\s?(AM|PM)(\s?–\s?\d{1,2}:\d{2}\s?(AM|PM))?)/);

  if (!match) return text;

  const time = match[0];
  const rest = text.replace(time, "").trim();

  return (
    <>
      <span className="font-semibold text-gray-900">{time}</span>{" "}
      <span className="text-gray-700">{rest}</span>
    </>
  );
}


function Item({ item, level }: { item: AgendaItem; level: number }) {
  return (
    <li>
      <div
        className={
          level === 0
            ? ""
            : level === 1
            ? "text-[13px] text-gray-600 mt-1 pl-4"
            : "text-[12px] text-gray-500 pl-6"
        }
      >
        {item.text}
      </div>

      {item.children && (
        <ul className="mt-1 space-y-1">
          {item.children.map((child, i) => (
            <Item key={i} item={child} level={level + 1} />
          ))}
        </ul>
      )}
    </li>
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