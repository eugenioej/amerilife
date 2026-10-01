import { cache } from "react";

import { fetchGraphQL } from "@/lib/wp-client";

import {
  GET_IDEAXCHANGE_DEV_VIEW_ACCESS,
  type IdeaxchangeDevViewAccessResult,
} from "@/lib/ideaxchange-queries";

export const isIdeaxchangeDevViewEmailAllowed = cache(
  async (
    email?: string | null,
  ): Promise<boolean> => {
    const normalizedEmail =
      email?.trim().toLowerCase() ?? "";

    if (!normalizedEmail) {
      return false;
    }

    try {
      const data =
        await fetchGraphQL<IdeaxchangeDevViewAccessResult>(
          GET_IDEAXCHANGE_DEV_VIEW_ACCESS,
          {
            email: normalizedEmail,
          },
        );

      return Boolean(
        data?.ideaxchangeDevViewEmailAllowed,
      );
    } catch (error) {
      console.error(
        "[ideaXchange] dev access check failed:",
        error,
      );

      return false;
    }
  },
);