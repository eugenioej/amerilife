// lib/wp-client.ts

function getGraphQLEndpoint(): string {
  const endpoint =
    process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ??
    (process.env.NEXT_PUBLIC_WORDPRESS_URL
      ? `${process.env.NEXT_PUBLIC_WORDPRESS_URL.replace(/\/$/, "")}/graphql`
      : "");
  if (!endpoint) {
    throw new Error(
      "NEXT_PUBLIC_GRAPHQL_ENDPOINT or NEXT_PUBLIC_WORDPRESS_URL is not defined."
    );
  }
  return endpoint;
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
