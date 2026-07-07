import NextAuth from "next-auth";
import type { Profile } from "next-auth";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import { isMicrosoftIdeaxchangeAuthEnabled } from "@/lib/ideaxchange-auth-config";
import { resolveIdeaxchangePersona } from "@/lib/ideaxchange-persona";
import { IDEAXCHANGE_LOGIN_PATH } from "@/lib/ideaxchange-constants";

function readStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((entry) => String(entry));
}

function extractEntraClaims(profile: Profile | undefined) {
  const record = (profile ?? {}) as Record<string, unknown>;
  return {
    roles: readStringArray(record.roles),
    groups: readStringArray(record.groups),
    oid: typeof record.oid === "string" ? record.oid : undefined,
    tid: typeof record.tid === "string" ? record.tid : undefined,
  };
}

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
    async signIn({ profile }) {
      if (!isMicrosoftIdeaxchangeAuthEnabled()) return false;

      const tenantId = process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID?.trim();
      const { tid } = extractEntraClaims(profile);
      if (tenantId && tid && tid !== tenantId) return false;

      return true;
    },
    async jwt({ token, account, profile }) {
      if (account?.provider === "microsoft-entra-id") {
        const { roles, groups, oid } = extractEntraClaims(profile);
        const persona = resolveIdeaxchangePersona(roles, groups);

        token.oid = oid ?? token.sub ?? undefined;
        token.roles = roles;
        token.groups = groups;
        token.persona = persona;

        console.info("[ideaxchange-auth] JIT session", {
          id: token.oid,
          persona,
          roles,
          groupCount: groups.length,
        });
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.oid ?? token.sub ?? "";
        session.user.persona = token.persona ?? "sales";
        session.user.roles = token.roles ?? [];
        session.user.groups = token.groups ?? [];
      }
      return session;
    },
  },
});
