"use client";
import Image from "next/image";
import { useEffect, useState } from "react";



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
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(console.error);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  if (typeof window === "undefined") {
    return null;
  }

  const isMobile =
    /iphone|ipad|ipod|android/i.test(navigator.userAgent);

  const installed =
    window.matchMedia("(display-mode: standalone)").matches ||
    localStorage.getItem("pwaInstalled") === "true";

  if (!isMobile) {
    return null;
  }

  if (installed) {
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

      if (result.outcome === "accepted") {
        localStorage.setItem("pwaInstalled", "true");
        window.location.reload();
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
          transition-all duration-200
          hover:bg-[#091229]/90
          hover:scale-[1.02]
          active:scale-95
          cursor-pointer
        "
      >
        <Image
          src="https://headlessameril.wpenginepowered.com/wp-content/uploads/2026/05/Masterminds26-Icon-Green-031026-CG.png"
          alt="App icon"
          width={22}
          height={22}
          className="rounded-md w-auto"
        />

        <span>Add Agendas to Home Screen</span>
      </button>
    </div>
  );
}
export default AddToHomeScreen;