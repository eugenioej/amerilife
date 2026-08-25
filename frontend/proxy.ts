import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getIdeaxchangeHomeFromRequest,
  isIdeaxchangeRequestAuthenticated,
} from "@/lib/ideaxchange-auth-proxy";
import {
  IDEAXCHANGE_LOGIN_PATH,
  isIdeaxchangeLoginPath,
  isIdeaxchangeProtectedPath,
  isIdeaxchangeReturnPath,
} from "@/lib/ideaxchange-constants";
import { getToken } from "next-auth/jwt";
import { isMicrosoftIdeaxchangeAuthEnabled } from "@/lib/ideaxchange-auth-config";
import { getIdeaxchangeJwtParams } from "@/lib/ideaxchange-auth-token";
import { getIdeaxchangeDevViewFromRequest } from "@/lib/ideaxchange-dev";
import {
  canAccessIdeaxchangePath,
  getIdeaxchangeHomeForPersona,
  type IdeaxchangePersona,
} from "@/lib/ideaxchange-persona";

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
// Blocked path substrings — common exploit / CMS / config probes
// Rejected here so they never reach [...slug] → WordPress content lookups.
// ---------------------------------------------------------------------------
const BLOCKED_PATH_FRAGMENTS: string[] = [
  "/../",
  "/wp-admin",
  "/wp-login",
  "/wp-includes/",
  "/wp-content/plugins/",
  "/wp-content/themes/",
  "/wp-content/uploads/wc-logs",
  "/wp-json/wp/v2/users",
  "/xmlrpc",
  "/wlwmanifest.xml",
  "/wp-config",
  "/phpmyadmin",
  "/vendor/phpunit",
  "/cgi-bin",
  "/.env",
  "/.git",
  "/.svn",
  "/.htaccess",
  "/.ds_store",
  "/.aws/",
  "/shell",
  "/eval(",
  "/base64_",
  "/autoload_classmap",
  "/actuator",
  "/server-status",
  "/_ignition",
  "/telescope",
  "/debug/default",
  "/docker-compose",
];

/** Exact paths that are never real AmeriLife pages (scanner favorites). */
const BLOCKED_EXACT_PATHS = new Set([
  "/admin",
  "/administrator",
  "/login",
  "/wp",
  "/wordpress",
  "/backup",
  "/mysql",
  "/db",
  "/pma",
  "/phpmyadmin",
  "/web.config",
  "/composer.json",
  "/composer.lock",
  "/package.json",
  "/.env",
  "/.env.local",
  "/.env.production",
  "/config.json",
  "/credentials.json",
]);

// Blocked file extensions — server-side script / dump / backup probes
const BLOCKED_EXTENSIONS: string[] = [
  ".php",
  ".asp",
  ".aspx",
  ".jsp",
  ".cgi",
  ".cfm",
  ".sql",
  ".bak",
  ".old",
  ".ini",
  ".log",
  ".swp",
  ".dist",
  ".orig",
];

function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

function nextWithPathname(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);
  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

function isBlockedProbePath(pathname: string): boolean {
  const pathLower = pathname.toLowerCase();
  const exact = normalizePath(pathLower);

  if (BLOCKED_EXACT_PATHS.has(exact)) return true;

  for (const fragment of BLOCKED_PATH_FRAGMENTS) {
    if (pathLower.includes(fragment)) return true;
  }

  for (const ext of BLOCKED_EXTENSIONS) {
    if (pathLower.endsWith(ext) || pathLower.endsWith(`${ext}/`)) return true;
  }

  return false;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ua = (request.headers.get("user-agent") ?? "").toLowerCase();

    // Handle common ideaXchange capitalization typo
  if (
    pathname === "/ideaXchange" ||
    pathname.startsWith("/ideaXchange/")
  ) {
    const url = request.nextUrl.clone();

    url.pathname = pathname.replace(
      "/ideaXchange",
      "/ideaxchange"
    );

    return NextResponse.redirect(url, 308);
  }

  // 1. Block known vulnerability scanners by user-agent
  for (const token of BLOCKED_UA) {
    if (ua.includes(token)) {
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

  // 2. Block exploit / CMS / dump probes before they hit WordPress
  if (isBlockedProbePath(pathname)) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const ideaxchangeAuthed = await isIdeaxchangeRequestAuthenticated(request);

  // 3. Gated ideaXchange — require session (all routes under /ideaxchange/ except login)
  if (isIdeaxchangeProtectedPath(pathname) && !ideaxchangeAuthed) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = IDEAXCHANGE_LOGIN_PATH;
    const returnPath = `${pathname}${request.nextUrl.search}`;
    loginUrl.searchParams.set("next", returnPath);
    return NextResponse.redirect(loginUrl);
  }

  // 3b. Persona-based route guard (Microsoft JIT only)
  if (
    ideaxchangeAuthed &&
    isIdeaxchangeProtectedPath(pathname) &&
    isMicrosoftIdeaxchangeAuthEnabled()
  ) {
    const token = await getToken(getIdeaxchangeJwtParams(request));
    const persona = (token?.persona ?? "brokerage") as IdeaxchangePersona;
    const devView = getIdeaxchangeDevViewFromRequest(request);
    if (!canAccessIdeaxchangePath(pathname, persona, devView)) {
      const home = getIdeaxchangeHomeForPersona(persona);
      return NextResponse.redirect(new URL(home, request.url));
    }
  }

  // 4. Already signed in — skip the login page
  if (isIdeaxchangeLoginPath(pathname) && ideaxchangeAuthed) {
    const nextParam = request.nextUrl.searchParams.get("next");
    const defaultHome = await getIdeaxchangeHomeFromRequest(request);
    const destination =
      nextParam && isIdeaxchangeReturnPath(nextParam) ? nextParam : defaultHome;
    return NextResponse.redirect(new URL(destination, request.url));
  }

  return nextWithPathname(request);
}

export const config = {
  // Skip Next.js internals and static assets
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico|woff2?|ttf|css|js|map)$).*)",
  ],
};
