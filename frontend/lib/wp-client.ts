// lib/wp-client.ts

const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT;

if (!endpoint) {
  throw new Error("NEXT_PUBLIC_GRAPHQL_ENDPOINT is not defined.");
}

const graphqlEndpoint = endpoint;

export async function fetchGraphQL<T>(
  query: string,
  variables?: Record<string, any>
): Promise<T> {
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
