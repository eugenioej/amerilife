import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { isMicrosoftIdeaxchangeAuthEnabled } from "@/lib/ideaxchange-auth-config";
import { getIdeaxchangeJwtFromRequest } from "@/lib/ideaxchange-auth-token";
import {
  IDEAXCHANGE_HOME_PATH,
  IDEAXCHANGE_SESSION_COOKIE,
  IDEAXCHANGE_SESSION_VALUE,
} from "@/lib/ideaxchange-constants";
import { getIdeaxchangeHomeForPersona } from "@/lib/ideaxchange-persona";

function isLegacyIdeaxchangeSession(request: NextRequest): boolean {
  return request.cookies.get(IDEAXCHANGE_SESSION_COOKIE)?.value === IDEAXCHANGE_SESSION_VALUE;
}

/** Proxy-safe auth check (no React server APIs). */
export async function isIdeaxchangeRequestAuthenticated(
  request: NextRequest,
): Promise<boolean> {
  if (isMicrosoftIdeaxchangeAuthEnabled()) {
    const token = await getIdeaxchangeJwtFromRequest(request);
    return Boolean(token?.sub);
  }

  return isLegacyIdeaxchangeSession(request);
}

/** Resolve post-login home from JWT persona in proxy. */
export async function getIdeaxchangeHomeFromRequest(
  request: NextRequest,
): Promise<string> {
  if (isMicrosoftIdeaxchangeAuthEnabled()) {
    const token = await getIdeaxchangeJwtFromRequest(request);
    if (token?.persona) {
      return getIdeaxchangeHomeForPersona(token.persona);
    }
  }

  return IDEAXCHANGE_HOME_PATH;
}

function isAuthJsCookieName(name: string): boolean {
  return name.includes("authjs.") || name.includes("next-auth.");
}

const AUTH_JS_COOKIE_NAMES = [
  "__Host-authjs.csrf-token",
  "__Secure-authjs.csrf-token",
  "__Secure-authjs.callback-url",
  "__Secure-authjs.session-token",
  "__Secure-authjs.pkce.code_verifier",
  "__Secure-authjs.state",
  "__Secure-authjs.nonce",
  "authjs.csrf-token",
  "authjs.callback-url",
  "authjs.session-token",
  "authjs.pkce.code_verifier",
] as const;

/** Expire Auth.js cookies only — leave Imperva / Cloudflare cookies intact. */
export function expireIdeaxchangeAuthCookies(
  request: NextRequest,
  response: NextResponse,
): void {
  const names = new Set<string>(AUTH_JS_COOKIE_NAMES);
  for (const cookie of request.cookies.getAll()) {
    if (isAuthJsCookieName(cookie.name)) names.add(cookie.name);
  }

  for (const name of names) {
    response.cookies.set({
      name,
      value: "",
      maxAge: 0,
      path: "/",
      secure: true,
      httpOnly: true,
      sameSite: "lax",
    });
  }
}
