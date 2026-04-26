/**
 * Third-party analytics (root layout only).
 *
 * Verification (production build, then open site):
 * - DevTools → Network: `gtm.js`, `ns.html` (noscript iframe), Crazy Egg script host.
 * - DevTools → Elements → <head>: GTM bootstrap from `next/script` (`beforeInteractive`).
 *
 * If you later add Content-Security-Policy, you must allow at least:
 * - script-src: https://www.googletagmanager.com https://www.google-analytics.com … (tags GTM loads), https://script.crazyegg.com
 * - frame-src: https://www.googletagmanager.com (noscript iframe)
 * - connect-src: endpoints GTM tags use (GA, Ads, etc.)
 * GTM often needs `'unsafe-inline'` or nonces for the bootstrap; see Google’s Tag Platform CSP guide.
 */
import Script from "next/script";

/** Google Tag Manager container ID */
export const GTM_CONTAINER_ID = "GTM-KW8T4HP";

const gtmInline = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_CONTAINER_ID}');`;

/** GTM loader — `beforeInteractive` so it runs from the initial document like the standard <head> snippet. */
export function GoogleTagManagerScript() {
  return (
    <Script id="google-tag-manager" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: gtmInline }} />
  );
}

/** Crazy Egg heatmaps / session replay */
export function CrazyEggScript() {
  return (
    <Script
      id="crazy-egg"
      src="https://script.crazyegg.com/pages/scripts/0127/1126.js"
      strategy="afterInteractive"
    />
  );
}

/** GTM noscript fallback — must be first content inside `<body>` per Google’s install snippet. */
export function GoogleTagManagerNoScript() {
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_CONTAINER_ID}`}
        height={0}
        width={0}
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
