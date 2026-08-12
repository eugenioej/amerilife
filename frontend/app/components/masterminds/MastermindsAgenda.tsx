import Image from "next/image";
import Link from "next/link";
import { IMAGES } from "./MastermindsConstants";
import { useEffect, useState } from "react";


type AgendaItem = {
  text: string;
  children?: AgendaItem[];
};

type DayProps = {
  title: string;
  items: AgendaItem[];
};
type AgendaDay = {

title: string;

items: AgendaItem[];

};
type MastermindsAgendaProps = {

    agendaDays: AgendaDay[];

};



export default function MastermindsAgenda({agendaDays}:MastermindsAgendaProps) {
  return (
      <div className=" mx-auto max-w-[1000px] px-5 pb-14 sm:pb-20 sm:px-6">
        {/* SCHEDULE CARD */}
        <div className="rounded-2xl bg-[#f0fdf4] px-4 py-7 sm:px-10 sm:py-10 shadow-xl">

<div className="space-y-10 sm:space-y-14">
    
    {agendaDays.map((day) => (
        <Day
        key={day.title}
        title={day.title}
        items={day.items}
        />
    ))}
    </div>
    </div>
 {/* INSTALL BUTTON */}
    <div className="mt-10 text-center">
        <AddToHomeScreen />
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
      Scan or Click for Agendas
    </p>

  </Link>
</div>


      </div>
    
  );
}

function Day({ title, items }: DayProps) {
  return (
    <div className="border-l-4 border-[#03f080] pl-4">
      <h3 className="mb-3 text-base font-semibold text-[#091229] sm:text-xl">
        {title}
      </h3>

      <ul className="space-y-3">
        {items.map((item, index) => (
          <AgendaNode
            key={index}
            item={item}
            level={0}
          />
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
              ? "font-medium text-gray-800"
              : level === 1
              ? "pl-4 text-[13px] text-gray-700"
              : "pl-6 text-[12px] text-gray-500"
          }
          ${isSpeaker ? "italic text-gray-500" : ""}
          ${isNote ? "mt-1 italic text-gray-500" : ""}
        `}
      >
        {level === 1 && (
          <span className="mt-[6px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400" />
        )}

        {level === 2 && (
          <span className="mt-[6px] h-1 w-1 flex-shrink-0 rounded-full border border-gray-400" />
        )}

        <span>{formatText(item.text)}</span>
      </div>

      {item.children && (
        <ul className="mt-1 space-y-1">
          {item.children.map((child, index) => (
            <AgendaNode
              key={index}
              item={child}
              level={level + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

function formatText(text: string) {
  const match = text.match(
    /^(\d{1,2}:\d{2}\s?(AM|PM)(\s?–\s?\d{1,2}:\d{2}\s?(AM|PM))?)/
  );

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
    

  // ✅ FIXED: proper install detection (Android + standalone)
  const isInstalled =
    typeof window !== "undefined" &&
    (
      window.matchMedia("(display-mode: standalone)").matches ||
      localStorage.getItem("pwaInstalled") === "true"
    );

  // ✅ existing SW registration
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.register("/sw.js").catch(console.error);
  }, []);

  const isMobile =
    typeof window !== "undefined" &&
    /iphone|ipad|ipod|android/i.test(navigator.userAgent);

  // ✅ install prompt listener
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

  // ✅ ✅ FIX: correct installed state
  if (isInstalled) {
    return (
      <div className="mt-10 text-center relative z-20">
        <div className="inline-flex items-center justify-center gap-3 rounded-full px-6 py-3 text-sm font-semibold text-white bg-white/10 border border-white/20">
          ✅ <span>Already Added</span>
        </div>
      </div>
    );
  }

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;

      // ✅ FIX: persist install state
      if (result.outcome === "accepted") {
        localStorage.setItem("pwaInstalled", "true");
      }

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
        <Image
          src="https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/05/Masterminds26-Icon-Green-031026-CG.png"
          alt="App icon"
          width={22}
          height={22}
          className="rounded-md"
        />

        <span>Add Agendas to Home Screen</span>
      </button>
    </div>
  );
}