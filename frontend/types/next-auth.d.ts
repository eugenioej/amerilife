import type { DefaultSession } from "next-auth";
import type { IdeaxchangePersona } from "@/lib/ideaxchange-persona";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      persona: IdeaxchangePersona;
      roles: string[];
      groups: string[];
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    oid?: string;
    persona?: IdeaxchangePersona;
    roles?: string[];
    groups?: string[];
  }
}
