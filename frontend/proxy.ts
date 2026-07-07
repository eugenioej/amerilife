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
import { canAccessIdeaxchangePath, getIdeaxchangeHomeForPersona } from "@/lib/ideaxchange-persona";

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

function nextWithPathname(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);
  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export async function proxy(request: NextRequest) {
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

  const ideaxchangeAuthed = await isIdeaxchangeRequestAuthenticated(request);

  // 4. Gated ideaXchange — require session (all routes under /ideaxchange/ except login)
  if (isIdeaxchangeProtectedPath(pathname) && !ideaxchangeAuthed) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = IDEAXCHANGE_LOGIN_PATH;
    const returnPath = `${pathname}${request.nextUrl.search}`;
    loginUrl.searchParams.set("next", returnPath);
    return NextResponse.redirect(loginUrl);
  }

  // 4b. Persona-based route guard (Microsoft JIT only)
  if (
    ideaxchangeAuthed &&
    isIdeaxchangeProtectedPath(pathname) &&
    isMicrosoftIdeaxchangeAuthEnabled()
  ) {
    const token = await getToken(getIdeaxchangeJwtParams(request));
    const persona = token?.persona ?? "sales";
    if (!canAccessIdeaxchangePath(pathname, persona)) {
      const home = getIdeaxchangeHomeForPersona(persona);
      return NextResponse.redirect(new URL(home, request.url));
    }
  }

  // 5. Already signed in — skip the login page
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
