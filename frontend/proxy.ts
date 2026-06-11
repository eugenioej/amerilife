import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  IDEAXCHANGE_LOGIN_PATH,
  IDEAXCHANGE_SESSION_COOKIE,
  IDEAXCHANGE_SESSION_VALUE,
} from "@/lib/ideaxchange-constants";

const IDEAXCHANGE_MAGAZINE_PREFIX = "/ideaxchange/magazine";

// ---------------------------------------------------------------------------
// Blocked user-agent substrings — vulnerability scanners & automated tools
// ---------------------------------------------------------------------------
const BLOCKED_UA: string[] = [
  "sqlmap",
  "nikto",
  "nessus",
  "masscan",
  "zgrab",
  "nuclei",
  "acunetix",
  "dirbuster",
  "gobuster",
  "wfuzz",
  "havij",
];

// ---------------------------------------------------------------------------
// Blocked path substrings — common exploit probes
// ---------------------------------------------------------------------------
const BLOCKED_PATHS: string[] = [
  "/../",
  "/wp-admin",
  "/wp-login.php",
  "/xmlrpc.php",
  "/.env",
  "/.git/",
  "/shell",
  "/eval(",
  "/base64_",
];

// Blocked file extensions — server-side script probes
const BLOCKED_EXTENSIONS: string[] = [".php", ".asp", ".aspx", ".jsp", ".cgi", ".cfm"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ua = (request.headers.get("user-agent") ?? "").toLowerCase();
  const pathLower = pathname.toLowerCase();

  // 1. Block known vulnerability scanners by user-agent
  for (const token of BLOCKED_UA) {
    if (ua.includes(token)) {
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

  // 2. Block suspicious path patterns
  for (const fragment of BLOCKED_PATHS) {
    if (pathLower.includes(fragment)) {
      return new NextResponse("Not Found", { status: 404 });
    }
  }

  // 3. Block server-side script extension probes
  for (const ext of BLOCKED_EXTENSIONS) {
    if (pathLower.endsWith(ext)) {
      return new NextResponse("Not Found", { status: 404 });
    }
  }

  // 4. Gated ideaXchange magazine — require session cookie
  if (pathname.startsWith(IDEAXCHANGE_MAGAZINE_PREFIX)) {
    const session = request.cookies.get(IDEAXCHANGE_SESSION_COOKIE)?.value;
    if (session !== IDEAXCHANGE_SESSION_VALUE) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = IDEAXCHANGE_LOGIN_PATH;
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Skip Next.js internals and static assets
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico|woff2?|ttf|css|js|map)$).*)",
  ],
};
