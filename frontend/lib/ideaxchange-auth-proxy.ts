import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { isMicrosoftIdeaxchangeAuthEnabled } from "@/lib/ideaxchange-auth-config";
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
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
    });
    return Boolean(token?.sub);
  }

  return isLegacyIdeaxchangeSession(request);
}

/** Resolve post-login home from JWT persona in proxy. */
export async function getIdeaxchangeHomeFromRequest(
  request: NextRequest,
): Promise<string> {
  if (isMicrosoftIdeaxchangeAuthEnabled()) {
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
    });
    if (token?.persona) {
      return getIdeaxchangeHomeForPersona(token.persona);
    }
  }

  return IDEAXCHANGE_HOME_PATH;
}
