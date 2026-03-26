import type { Metadata } from "next";
import { fetchGraphQL } from "@/lib/wp-client";
import { GET_NODE_BY_URI } from "@/lib/queries";
import { privatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = privatePageMetadata(
  "GraphQL test | AmeriLife",
  "Internal GraphQL debug page."
);

export default async function TestPage() {
  const data = await fetchGraphQL<unknown>(GET_NODE_BY_URI, {
    uri: "/about",
  });

  return (
    <pre style={{ padding: "2rem" }}>
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}
