// lib/wp-client.ts

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
): Promise<T> {
  const graphqlEndpoint = getGraphQLEndpoint();
  const res = await fetch(graphqlEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    cache: "no-store",
    ...(signal ? { signal } : {}),
  });

  if (!res.ok) {
    throw new Error(`GraphQL request failed: ${res.statusText}`);
  }

  const json: { data: T; errors?: { message?: string }[] } = await res.json();

  // Partial-error tolerance: WPGraphQL can return errors alongside valid data
  // (e.g. a nullable field resolver fails but the rest of the response is fine).
  // Only throw if there is truly no data at all.
  if (json.errors && (json.data === null || json.data === undefined)) {
    const msg = json.errors.map((e: { message?: string }) => e.message).join("; ");
    throw new Error(`GraphQL failed: ${msg}`);
  }

  if (json.errors) {
    const critical = json.errors.filter((e) =>
      !e.message?.toLowerCase().includes("internal server error")
    );
    if (critical.length > 0) {
      const msg = critical.map((e) => e.message).join("; ");
      throw new Error(`GraphQL failed: ${msg}`);
    }
    // Log non-critical partial errors in dev
    if (process.env.NODE_ENV === "development") {
      console.warn("[GraphQL partial errors]", json.errors.map((e) => e.message));
    }
  }

  return json.data;
}
