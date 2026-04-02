"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    grecaptcha?: {
      /** Prefer this before calling `render` — required when the script loads async. */
      ready: (cb: () => void) => void;
      render: (container: HTMLElement, options: { sitekey: string; theme?: "light" | "dark" }) => number;
      getResponse: (widgetId?: number) => string;
      reset: (widgetId?: number) => void;
    };
  }
}

type GfRecaptchaFieldProps = {
  siteKey: string;
  onReady: (widgetId: number) => void;
};

export function GfRecaptchaField({ siteKey, onReady }: GfRecaptchaFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const onReadyRef = useRef(onReady);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    const existing = document.querySelector('script[src*="google.com/recaptcha/api.js"]');
    if (existing) {
      queueMicrotask(() => setScriptReady(true));
      return;
    }
    const s = document.createElement("script");
    // v2 “I’m not a robot” checkbox: do NOT use `?render=explicit` without an `onload` callback in the URL,
    // or `grecaptcha.render` may be missing. Use the default api.js + `grecaptcha.ready()` instead.
    s.src = "https://www.google.com/recaptcha/api.js";
    s.async = true;
    s.defer = true;
    s.onload = () => setScriptReady(true);
    document.body.appendChild(s);
  }, []);

  useEffect(() => {
    if (!scriptReady || !containerRef.current || !siteKey) return;
    const el = containerRef.current;
    const gr = window.grecaptcha;
    if (!gr) return;

    const mount = () => {
      if (!el.isConnected) return;
      if (typeof gr.render !== "function") {
        console.error(
          "[reCAPTCHA] grecaptcha.render is not available. Use a reCAPTCHA v2 Checkbox site key (Gravity Forms), not v3/invisible.",
        );
        return;
      }
      const id = gr.render(el, { sitekey: siteKey, theme: "light" });
      onReadyRef.current(id);
    };

    if (typeof gr.ready === "function") {
      gr.ready(mount);
    } else {
      mount();
    }
  }, [scriptReady, siteKey]);

  return <div ref={containerRef} className="min-h-[78px]" />;
}
