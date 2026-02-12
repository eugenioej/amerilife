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
  variables?: Record<string, any>
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
  });

  if (!res.ok) {
    throw new Error(`GraphQL request failed: ${res.statusText}`);
  }

  const json = await res.json();

  if (json.errors) {
    const msg = json.errors.map((e: { message?: string }) => e.message).join("; ");
    throw new Error(`GraphQL failed: ${msg}`);
  }

  return json.data;
}
