"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";

/* ========================================
   CONSTANTS
======================================== */
const UPLOADS =
  "https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/05";

const IMAGES = {
  wordmark: `${UPLOADS}/Masterminds26-Wordmark-White-Shaded-031026-CG.png`,
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
    <div className="masterminds-page">
      <AgendaSection />
      <FooterSection />
    </div>
  );
}

/* ========================================
   AGENDA
======================================== */
function AgendaSection() {
  return (
    <section className="bg-[#091229] py-14 sm:py-20">
      <div className="mx-auto max-w-[1000px] px-5 sm:px-6">

        {/* HEADER */}
                <div className="mb-10 sm:mb-14 text-center text-white">
        
                  {/* LOGO */}
      
<div className="mx-auto mb-6 w-[220px] sm:w-[300px]">
  <Link href="/masterminds" className="block">
    <Image
      src={IMAGES.wordmark}
      alt="Masterminds"
      width={420}
      height={120}
      className="w-full h-auto cursor-pointer transition hover:scale-102"
    />
  </Link>
</div>
        
                  <h1 className="text-2xl sm:text-4xl font-bold">
                    Masterminds <span className="text-[#03f080]">Health Agenda</span>
                  </h1>
        
                  <p className="mt-3 inline-block px-4 py-2 text-sm font-semibold tracking-wide text-white rounded-full border border-[#03f080]/40 bg-[#03f080]/20">
                    June 15 – 17, 2026 • Grand Hyatt Tampa Bay, FL
                  </p>
        
                  <p className="mx-auto mt-3 max-w-[600px] text-xs text-white/60">
                    Please note the agenda is subject to change. Attire is business casual for meetings and resort casual for group dinners. Unless otherwise noted, group meals combine Health and A&RI distributions.
                  </p>
        
                </div>

        {/* SCHEDULE CARD */}
        <div className="rounded-2xl bg-[#f0fdf4] px-4 py-7 sm:px-10 sm:py-10 shadow-xl">

          <div className="space-y-10 sm:space-y-14">

  {/* MONDAY */}
  <Day
    title="Monday, June 15, 2026"
    items={[
      { text: "Arrivals - please utilize Ubers/Lyft" },
      { text: "5:00 PM: Carrier booth set-up, Audubon Ballroom" },
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
      { text: "7:00 AM: Carrier booth set-up, Audubon Ballroom" },
      { text: "8:00 AM – 9:00 AM: Group Breakfast & Networking, Audubon Ballroom A" },

      {
        text: "9:00 AM – 11:30 AM: General Session, Audubon Ballroom",
        children: [
          {
            text:
              "9:00 – 9:30 AM: Opening Session: Powering the Next Surge in Senior Market Expansion",
            children: [
              { text: "Speakers: Bryan Keeven & Jim Palmer" },
            ],
          },
          {
            text:
              "9:30 – 9:45 AM: Orientation: How the Product Marketing Labs Work",
            children: [
              { text: "Rotations include Life & Annuity and Health Specialty" },
              { text: "Life & Annuity: David Paul & Eric Brennan" },
              { text: "Health Specialty: Steve Patton & Jamie Sarno" },
            ],
          },
          {
            text: "9:50 – 11:20 AM: Product Marketing Lab Rotation 1",
          },
        ],
      },

      { text: "11:30 AM – 12:30 PM: Group Lunch, Audubon Ballroom A" },

      {
        text: "12:30 PM – 4:00 PM: General Session, Audubon Ballroom",
        children: [
          { text: "12:30 – 2:00 PM: Product Marketing Lab Rotation 2" },
          {
            text:
              "2:10 – 3:00 PM: Growth Session: The Power of the Process: Solutions First, Products Second",
            children: [{ text: "Speakers: Bryan Keeven" }],
          },
          { text: "3:00 – 3:30 PM: Carrier Networking" },
          {
            text:
              "3:30 – 4:00 PM: Closing: Pulse Check: Connecting Today’s Product Line Insights",
            children: [
              {
                text:
                  "Speakers: Bobby Bache, Eric Brennan, Brian Luben & Darren Houck",
              },
            ],
          },
        ],
      },

      {
        text: "5:30 PM – 9:00 PM: Offsite Group Dinner, Whiskey Cakes",
        children: [
          {
            text:
              "Group transportation provided – more details and updated timing will be communicated closer to the event",
          },
          { text: "Health + Health Carriers only" },
        ],
      },
    ]}
  />

  {/* WEDNESDAY */}
  <Day
    title="Wednesday, June 17, 2026"
    items={[
      { text: "8:00 AM – 9:00 AM: Group Breakfast, Audubon Ballroom A" },

      {
        text: "9:00 AM – 12:00 PM: General Session, Audubon Ballroom",
        children: [
          {
            text:
              "9:00 – 9:45 AM: Tapping into the Current: The Agent Need – Value Proposition Connection",
            children: [
              {
                text:
                  "Speakers: David Paul, Eric Brennan, Robert Bache, Darren Houck, & Brian Luben",
              },
            ],
          },
          {
            text:
              "9:45 – 10:30 AM: Growth Session: Powering Up: Where Under 65 Growth Is Accelerating",
            children: [{ text: "Speakers: JC Moreno" }],
          },
          { text: "10:30 – 10:45 AM: Break" },
          {
            text:
              "10:45 – 11:25 AM: Flip the Switch: Execute, Implement, and Scale",
            children: [
              {
                text:
                  "Speakers: Bobby Bache, Eric Brennan, Brian Luben & Darren Houck",
              },
            ],
          },
          {
            text: "11:30 AM: Carrier Raffles",
            children: [
              { text: "Moderated by: Bryan Keeven & Jim Palmer" },
            ],
          },
        ],
      },

      { text: "12:00 PM – 12:30 PM: Grab ‘n’ Go Lunches, Audubon Foyer" },
      {
        text:
          "12:00 PM – 12:30 PM – Carrier booth break-down, Audubon Ballroom",
      },
      { text: "Departures – please utilize Ubers/Lyft" },
    ]}
  />

</div>
        </div>
        <p className="mx-auto mt-4 text-center text-sm text-white/80 leading-relaxed">
            Health Carriers are welcome to attend all Health meeting sessions, with booths located in the
Audubon Ballroom.
          </p>

        {/* INSTALL BUTTON */}
        <div className="mt-10 text-center">
          <AddToHomeScreen />
        </div>

      </div>
    </section>
  );
}


/* ========================================
   INSTALL BUTTON
======================================== */
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
  
};

function AddToHomeScreen() {
  
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

    
useEffect(() => {
  if (!("serviceWorker" in navigator)) return;

  navigator.serviceWorker.register("/sw.js").catch(console.error);
}, []);


  const isMobile =
    typeof window !== "undefined" &&
    /iphone|ipad|ipod|android/i.test(navigator.userAgent);

  useEffect(() => {
    if (!isMobile) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, [isMobile]);

  // ✅ Hide entirely on desktop
  if (!isMobile) return null;

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    } else {
      alert("To install:\nTap Share (📤) → Add to Home Screen");
    }
  };

  return (
    <div className="mt-10 text-center relative z-20">
      <button
        onClick={handleInstall}
        className="
          inline-flex items-center justify-center gap-3
          rounded-full px-6 py-3
          text-sm font-semibold text-white
          bg-[#091229]
          border border-[#03f080]/40
          shadow-[0_0_20px_rgba(3,240,128,0.25)]
          backdrop-blur
          transition-all duration-200
          hover:bg-[#091229]/90 hover:scale-[1.02]
          active:scale-95
          cursor-pointer
        "
      >
        {/* ✅ Branded icon */}
        <Image
          src="https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/05/Masterminds26-Icon-Green-031026-CG.png"
          alt="App icon"
          width={22}
          height={22}
          className="rounded-md"
        />

        <span>Add Agenda to Home Screen</span>
      </button>
    </div>
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