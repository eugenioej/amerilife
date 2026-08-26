import NextAuth from "next-auth";
import type { Profile } from "next-auth";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import { isMicrosoftIdeaxchangeAuthEnabled } from "@/lib/ideaxchange-auth-config";
import {
  extractEntraAuthClaims,
  resolvePersonaFromEntraClaims,
} from "@/lib/ideaxchange-entra-claims";
import {
  IDEAXCHANGE_HOME_PATH,
  IDEAXCHANGE_LOGIN_PATH,
  isIdeaxchangeLoginPath,
} from "@/lib/ideaxchange-constants";

function getMicrosoftEntraProvider() {
  const clientId = process.env.AUTH_MICROSOFT_ENTRA_ID_ID?.trim();
  const clientSecret = process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET?.trim();
  const issuer = process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER?.trim();
  if (!clientId || !clientSecret || !issuer) return null;

  return MicrosoftEntraID({
    clientId,
    clientSecret,
    issuer,
    authorization: {
      params: {
        scope: "openid profile email User.Read",
      },
    },
  });
}

function getAuthProviders() {
  if (!isMicrosoftIdeaxchangeAuthEnabled()) return [];
  const provider = getMicrosoftEntraProvider();
  return provider ? [provider] : [];
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  providers: getAuthProviders(),
  pages: {
    signIn: IDEAXCHANGE_LOGIN_PATH,
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7,
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      const base = baseUrl.replace(/\/$/, "");
      const pathname = url.split("?")[0] ?? url;

      if (pathname.startsWith("/ideaxchange/") && !isIdeaxchangeLoginPath(pathname)) {
        return url.startsWith("/") ? `${base}${url}` : url;
      }

      try {
        const parsed = new URL(url);
        if (parsed.origin === new URL(base).origin && parsed.pathname.startsWith("/ideaxchange/")) {
          if (!isIdeaxchangeLoginPath(parsed.pathname)) return url;
        }
      } catch {
        // ignore invalid callback URLs
      }

      return `${base}${IDEAXCHANGE_HOME_PATH}`;
    },
    async signIn({ profile, account }) {
      if (!isMicrosoftIdeaxchangeAuthEnabled()) return false;

      const tenantId = process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID?.trim();
      const { tid } = extractEntraAuthClaims(profile, account);
      if (tenantId && tid && tid !== tenantId) return false;

      return true;
    },
    async jwt({ token, account, profile }) {
      if (account?.provider === "microsoft-entra-id") {
        const claims = extractEntraAuthClaims(profile, account);
        const persona = resolvePersonaFromEntraClaims(claims);

        token.oid = claims.oid ?? token.sub ?? undefined;
        token.roles = claims.roles;
        token.groups = claims.groups;
        token.persona = persona;
        if (claims.email) {
          token.email = claims.email;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.oid ?? token.sub ?? "";
        session.user.persona = token.persona ?? "brokerage";
        session.user.roles = token.roles ?? [];
        session.user.groups = token.groups ?? [];
        if (typeof token.email === "string") {
          session.user.email = token.email;
        }
      }
      return session;
    },
  },
});