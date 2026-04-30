"use client";

import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// global-error.tsx replaces the root layout when it catches, so it must
// render its own <html> and <body> — no LayoutShell here.
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log to your error monitoring service here (e.g. Sentry)
    console.error("[app/global-error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          backgroundColor: "#f9f9f7",
          color: "#1a1a1a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: 560, width: "100%" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            {/* AmeriLife wordmark fallback — no image loading when root layout fails */}
            <span
              style={{
                fontSize: 22,
                fontWeight: 600,
                color: "#003087",
                letterSpacing: "-0.02em",
              }}
            >
              AmeriLife
            </span>
          </div>

          <h1
            style={{
              fontSize: "2rem",
              fontWeight: 700,
              marginBottom: "0.75rem",
              color: "#003087",
            }}
          >
            Something went wrong
          </h1>
          <p style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "1rem" }}>
            We hit an unexpected error
          </p>
          <p
            style={{
              fontSize: "1rem",
              lineHeight: 1.65,
              color: "#555",
              marginBottom: "1.5rem",
            }}
          >
            Sorry about that — our team has been notified. You can try again or
            return to the homepage.
          </p>

          {error.digest && (
            <p style={{ fontSize: "0.875rem", color: "#888", marginBottom: "1.5rem" }}>
              Error ID:{" "}
              <code
                style={{
                  fontFamily: "monospace",
                  background: "#eee",
                  padding: "2px 6px",
                  borderRadius: 4,
                }}
              >
                {error.digest}
              </code>
            </p>
          )}

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <button
              onClick={reset}
              style={{
                padding: "0.75rem 1.5rem",
                background: "#003087",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                fontWeight: 600,
                fontSize: "1rem",
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages --
                global-error replaces the root layout entirely; next/link
                requires a router context that may not be available here.
                A hard-navigate <a> is intentional for catastrophic failures. */}
            <a
              href="/"
              style={{
                padding: "0.75rem 1.5rem",
                border: "1.5px solid #003087",
                borderRadius: 6,
                fontWeight: 600,
                fontSize: "1rem",
                color: "#003087",
                textDecoration: "none",
              }}
            >
              Return to Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
