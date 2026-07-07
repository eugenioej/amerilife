import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/** Auth.js uses __Secure-authjs.session-token on HTTPS — getToken must match. */
export function isIdeaxchangeSecureAuthCookie(): boolean {
  const authUrl = process.env.AUTH_URL?.trim() ?? process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? "";
  if (authUrl.startsWith("https://")) return true;
  return process.env.NODE_ENV === "production";
}

export function getIdeaxchangeJwtParams(request: NextRequest) {
  return {
    req: request,
    secret: process.env.AUTH_SECRET,
    secureCookie: isIdeaxchangeSecureAuthCookie(),
  } as const;
}

export async function getIdeaxchangeJwtFromRequest(request: NextRequest) {
  return getToken(getIdeaxchangeJwtParams(request));
}
