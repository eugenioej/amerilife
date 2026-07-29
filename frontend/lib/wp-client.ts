// lib/wp-client.ts

/** Default Next.js Data Cache TTL for GraphQL GET queries (10 minutes). */
export const GRAPHQL_REVALIDATE_SECONDS = 600;

/** Longer TTL for layout-global data (menus, header form schema). */
export const LAYOUT_REVALIDATE_SECONDS = 3600;

/** WordPress origin for building `/graphql` (server scripts often set `WORDPRESS_URL` only). */
function getWpBaseUrl(): string | undefined {
  const pub = process.env.NEXT_PUBLIC_WORDPRESS_URL?.trim();
  if (pub) return pub.replace(/\/$/, "");
  const server = process.env.WORDPRESS_URL?.trim();
  if (server) return server.replace(/\/$/, "");
  return undefined;
}

/** True when a GraphQL URL can be resolved (explicit endpoint or any known WP base URL). */
export function isWpGraphqlConfigured(): boolean {
  const explicit = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT?.trim();
  return Boolean(explicit || getWpBaseUrl());
}

function getGraphQLEndpoint(): string {
  const explicit = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT?.trim();
  if (explicit) return explicit;

  const base = getWpBaseUrl();
  if (base) return `${base}/graphql`;

  throw new Error(
    "Set NEXT_PUBLIC_GRAPHQL_ENDPOINT, or NEXT_PUBLIC_WORDPRESS_URL / WORDPRESS_URL (in frontend/.env.local).",
  );
}

export async function fetchGraphQL<T>(
  query: string,
  variables?: Record<string, unknown>,
  signal?: AbortSignal,
  isMutation = false,
  revalidate: number | false = GRAPHQL_REVALIDATE_SECONDS,
): Promise<T> {
  const graphqlEndpoint = getGraphQLEndpoint();

  let res: Response;

  if (isMutation) {
    res = await fetch(graphqlEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Next.js GraphQL Client",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
      ...(signal ? { signal } : {}),
    });
  } else {
    const params = new URLSearchParams({ query });

    if (variables && Object.keys(variables).length > 0) {
      params.append("variables", JSON.stringify(variables));
    }

    const url = `${graphqlEndpoint}?${params.toString()}`;

    res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Next.js GraphQL Client",
      },
      // Stale-while-revalidate: serve cached data and refresh in the background.
      next: { revalidate },
      ...(signal ? { signal } : {}),
    });
  }
  if (!res.ok) {
    throw new Error(`GraphQL request failed: ${res.status} ${res.statusText}`);
  }

  const json: { data?: T | null; errors?: { message?: string }[] } =
    await res.json();

  const errorMsgs =
    json.errors?.map((e) => e.message).filter((m): m is string => Boolean(m)) ?? [];

  const hasData = json.data !== null && json.data !== undefined;

  if (!hasData) {
    throw new Error(
      errorMsgs.length
        ? `GraphQL failed: ${errorMsgs.join("; ")}`
        : "GraphQL returned no data",
    );
  }

  if (errorMsgs.length && process.env.NODE_ENV === "development") {
    console.warn("[GraphQL errors alongside data]", errorMsgs);
  }

  return json.data as T;
}

const DEFAULT_GRAPHQL_TIMEOUT_MS = 8_000;

/** Abort slow WP GraphQL calls so ideaXchange pages can fall back to mock data quickly. */
export async function fetchGraphQLWithTimeout<T>(
  query: string,
  variables?: Record<string, unknown>,
  timeoutMs = DEFAULT_GRAPHQL_TIMEOUT_MS,
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetchGraphQL<T>(query, variables, controller.signal);
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error(`GraphQL request timed out after ${timeoutMs}ms`);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}
