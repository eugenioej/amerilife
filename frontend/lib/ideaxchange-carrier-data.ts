import { cache } from "react";
import { fetchGraphQL } from "@/lib/wp-client";
import {
  GET_CARRIERS,
  GET_CARRIER_BY_SLUG,
  type CarrierBySlugResult,
  type CarrierDetail,
  type CarrierListItem,
  type CarriersConnectionResult,
} from "@/lib/ideaxchange-carrier-queries";
import {
  getMockCarrierBySlug,
  getMockCarrierSpotlightBundle,
} from "@/lib/ideaxchange-carrier-mock-data";
import { CARRIER_SPOTLIGHT_FIRST } from "@/lib/ideaxchange-carrier-utils";

async function fetchCarriersConnection(
  first: number,
  after?: string | null,
): Promise<{
  nodes: CarrierListItem[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}> {
  const useMockFallback = !after;

  try {
    const data = await fetchGraphQL<CarriersConnectionResult>(GET_CARRIERS, {
      first,
      after: after ?? null,
    });
    const conn = data?.ideaxchangeCarriers;
    const nodes = conn?.nodes ?? [];
    if (nodes.length > 0) {
      return {
        nodes,
        pageInfo: {
          hasNextPage: conn?.pageInfo?.hasNextPage ?? false,
          endCursor: conn?.pageInfo?.endCursor ?? null,
        },
      };
    }
  } catch (err) {
    console.error("[carrier-spotlight] fetchCarriersConnection failed:", err);
  }

  if (useMockFallback) {
    const mock = getMockCarrierSpotlightBundle();
    return { nodes: mock.carriers.slice(0, first), pageInfo: mock.pageInfo };
  }

  return { nodes: [], pageInfo: { hasNextPage: false, endCursor: null } };
}

export async function getCarriersList(): Promise<CarrierListItem[]> {
  const { nodes } = await fetchCarriersConnection(100);
  return nodes;
}

export const getCarrierSpotlightBundle = cache(async (): Promise<{
  carriers: CarrierListItem[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}> => {
  const { nodes, pageInfo } = await fetchCarriersConnection(CARRIER_SPOTLIGHT_FIRST, null);
  return { carriers: nodes, pageInfo };
});

export async function getCarrierBySlug(slug: string): Promise<CarrierDetail | null> {
  try {
    const data = await fetchGraphQL<CarrierBySlugResult>(GET_CARRIER_BY_SLUG, { slug });
    const carrier = data?.ideaxchangeCarrier;
    if (carrier) return carrier;
  } catch (err) {
    console.error("[carrier-spotlight] getCarrierBySlug failed:", err);
  }
  return getMockCarrierBySlug(slug);
}
